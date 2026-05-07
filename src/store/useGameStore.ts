import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, GameState, Mood, Quest, InventoryItem } from '../types';
import { db, auth } from '../lib/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { User as FirebaseUser } from 'firebase/auth';

interface StoreState extends GameState {
  character: Character | null;
  user: FirebaseUser | null;
  isAuthReady: boolean;
  
  // Actions
  setAuthUser: (user: FirebaseUser | null) => void;
  syncFromFirebase: () => Promise<void>;
  createCharacter: (name: string, type: Character['type']) => Promise<void>;
  updateCharacter: (updates: Partial<Character>) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  addGems: (amount: number) => Promise<void>;
  useEnergy: (amount: number) => Promise<boolean>;
  completeQuest: (questId: string) => Promise<void>;
  updateMood: (mood: Mood) => Promise<void>;
  claimDailyReward: () => Promise<void>;
  addItem: (item: InventoryItem) => Promise<void>;
}

const INITIAL_STATE: GameState = {
  coins: 500,
  gems: 10,
  energy: 100,
  maxEnergy: 100,
  tickets: 5,
  inventory: [],
  quests: [
    {
      id: 'q1',
      title: 'First Greeting',
      description: 'Talk to your character for the first time.',
      rewardType: 'xp',
      rewardAmount: 20,
      isCompleted: false,
      type: 'daily',
      category: 'social',
    },
    {
      id: 'q2',
      title: 'Healthy Start',
      description: 'Log your first daily habit.',
      rewardType: 'coins',
      rewardAmount: 100,
      isCompleted: false,
      type: 'habit',
      category: 'fitness',
    },
    {
      id: 'q3',
      title: 'Morning Reflection',
      description: 'Share your mood with your soulbound.',
      rewardType: 'gems',
      rewardAmount: 1,
      isCompleted: false,
      type: 'daily',
      category: 'mindfulness',
    }
  ],
  lastLogin: Date.now(),
  dailyRewardClaimed: false,
};

const INITIAL_CHARACTER: Character = {
  id: '1',
  name: 'Soul',
  type: 'fantasy',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  mood: 'happy',
  affection: 50,
  lastInteraction: Date.now(),
  streak: 1,
  outfitId: 'default',
  roomLevel: 1,
  evolutionStage: 1,
};

export const useGameStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      character: INITIAL_CHARACTER,
      user: null,
      isAuthReady: false,

      setAuthUser: (user) => set({ user, isAuthReady: true }),

      syncFromFirebase: async () => {
        const { user } = get();
        if (!user) return;

        // Skip firebase sync for guest users
        if (user.uid === 'guest-user') {
          set({ isAuthReady: true });
          return;
        }

        const userPath = `users/${user.uid}`;
        try {
          const userDoc = await getDoc(doc(db, userPath));
          if (userDoc.exists()) {
            const data = userDoc.data();
            set({ 
              coins: data.coins, 
              gems: data.gems, 
              energy: data.energy,
              maxEnergy: data.maxEnergy,
              dailyRewardClaimed: data.dailyRewardClaimed
            });
            
            // Get character
            const charDoc = await getDoc(doc(db, `${userPath}/characters/char1`));
            if (charDoc.exists()) {
              set({ character: charDoc.data() as Character });
            } else {
              set({ character: null });
            }
          } else {
            // First time user, create base user doc but NO character yet
            const newUser = {
              ...INITIAL_STATE,
              id: user.uid,
              email: user.email,
              createdAt: Date.now(),
              updatedAt: Date.now()
            };
            await setDoc(doc(db, userPath), newUser);
            set({ ...INITIAL_STATE, character: null });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, userPath);
        }
      },

      createCharacter: async (name, type) => {
        const { user } = get();
        if (!user) return;

        const newChar: Character = {
          ...INITIAL_CHARACTER,
          name,
          type,
          id: 'char1',
          lastInteraction: Date.now(),
        };

        set({ character: newChar });

        const path = `users/${user.uid}/characters/char1`;
        try {
          if (user.uid !== 'guest-user') {
            await setDoc(doc(db, path), newChar);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      },

      updateCharacter: async (updates) => {
        const { user, character } = get();
        if (!user || !character) return;
        
        const newChar = { ...character, ...updates };
        set({ character: newChar });
        
        const path = `users/${user.uid}/characters/char1`;
        try {
          if (user.uid !== 'guest-user') {
            await updateDoc(doc(db, path), updates);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
      },

      addCoins: async (amount) => {
        const { user, coins } = get();
        if (!user) return;
        
        const newTotal = coins + amount;
        set({ coins: newTotal });
        
        const path = `users/${user.uid}`;
        try {
          if (user.uid !== 'guest-user') {
            await updateDoc(doc(db, path), { coins: newTotal, updatedAt: serverTimestamp() });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
      },

      addGems: async (amount) => {
        const { user, gems } = get();
        if (!user) return;
        
        const newTotal = gems + amount;
        set({ gems: newTotal });
        
        const path = `users/${user.uid}`;
        try {
          if (user.uid !== 'guest-user') {
            await updateDoc(doc(db, path), { gems: newTotal, updatedAt: serverTimestamp() });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
      },

      useEnergy: async (amount) => {
        const { user, energy } = get();
        if (!user || energy < amount) return false;
        
        const newEnergy = energy - amount;
        set({ energy: newEnergy });
        
        const path = `users/${user.uid}`;
        try {
          if (user.uid !== 'guest-user') {
            await updateDoc(doc(db, path), { energy: newEnergy, updatedAt: serverTimestamp() });
          }
          return true;
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
          return false;
        }
      },

      completeQuest: async (questId) => {
        const state = get();
        const quest = state.quests.find(q => q.id === questId);
        if (!quest || quest.isCompleted || !state.user) return;

        const newQuests = state.quests.map(q => 
          q.id === questId ? { ...q, isCompleted: true } : q
        );

        let { coins, gems, character } = state;
        if (quest.rewardType === 'coins') coins += quest.rewardAmount;
        if (quest.rewardType === 'gems') gems += quest.rewardAmount;
        if (quest.rewardType === 'xp' && character) {
          character = { ...character, xp: character.xp + quest.rewardAmount };
          if (character.xp >= character.xpToNextLevel) {
            character.xp -= character.xpToNextLevel;
            character.level += 1;
            character.xpToNextLevel = Math.floor(character.xpToNextLevel * 1.5);
          }
        }

        set({ quests: newQuests, coins, gems, character });
        
        // Sync to Firebase
        const userPath = `users/${state.user.uid}`;
        try {
          if (state.user.uid !== 'guest-user') {
            await updateDoc(doc(db, userPath), { coins, gems, updatedAt: serverTimestamp() });
            await setDoc(doc(db, `${userPath}/quests/${questId}`), { questId, isCompleted: true, completedAt: Date.now() });
            if (character) {
               await setDoc(doc(db, `${userPath}/characters/char1`), character);
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, userPath);
        }
      },

      updateMood: async (mood) => {
        const { user, character } = get();
        if (!user || !character) return;
        
        const lastInteraction = Date.now();
        set({ character: { ...character, mood, lastInteraction } });
        
        const path = `users/${user.uid}/characters/char1`;
        try {
          if (user.uid !== 'guest-user') {
            await updateDoc(doc(db, path), { mood, lastInteraction });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
      },

      claimDailyReward: async () => {
        const { user } = get();
        if (!user) return;
        
        set({ dailyRewardClaimed: true });
        const path = `users/${user.uid}`;
        try {
          if (user.uid !== 'guest-user') {
            await updateDoc(doc(db, path), { dailyRewardClaimed: true, updatedAt: serverTimestamp() });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, path);
        }
      },

      addItem: async (item) => {
        const { user, inventory } = get();
        if (!user) return;
        
        set({ inventory: [...inventory, item] });
        const path = `users/${user.uid}/inventory/${item.id}`;
        try {
          await setDoc(doc(db, path), item);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      },
    }),
    {
      name: 'soulbound-game-storage',
      // Don't persist user object directly as it contains functions
      partialize: (state) => {
        const { user, ...rest } = state;
        return rest;
      },
    }
  )
);
