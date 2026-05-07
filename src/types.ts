export type Mood = 'happy' | 'sad' | 'excited' | 'tired' | 'thoughtful' | 'playful';

export interface Character {
  id: string;
  name: string;
  type: 'male' | 'female' | 'fantasy' | 'robot' | 'animal';
  level: number;
  xp: number;
  xpToNextLevel: number;
  mood: Mood;
  affection: number; // 0-100
  lastInteraction: number; // timestamp
  streak: number;
  outfitId: string;
  roomLevel: number;
  evolutionStage: number;
}

export interface GameState {
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  tickets: number;
  inventory: InventoryItem[];
  quests: Quest[];
  lastLogin: number;
  dailyRewardClaimed: boolean;
}

export interface InventoryItem {
  id: string;
  type: 'clothing' | 'accessory' | 'furniture' | 'consumable';
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardType: 'coins' | 'gems' | 'xp' | 'item';
  rewardAmount: number;
  isCompleted: boolean;
  type: 'daily' | 'story' | 'habit';
  category: 'fitness' | 'learning' | 'social' | 'mindfulness';
}

export interface Reward {
  type: 'coins' | 'gems' | 'xp' | 'item';
  amount: number;
  itemId?: string;
}
