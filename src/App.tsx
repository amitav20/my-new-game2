import React from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { BottomTabs } from './components/game/BottomTabs';
import { LoginScreen } from './screens/LoginScreen';
import { useGameStore } from './store/useGameStore';
import { GenesisScreen } from './screens/GenesisScreen';
import { StoryScreen } from './screens/StoryScreen';
import { ShopScreen } from './screens/ShopScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';

const WorldPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-4">
    <div className="w-24 h-24 bg-brand-accent/20 rounded-full flex items-center justify-center">
      <div className="w-12 h-12 bg-brand-accent rounded-full animate-pulse" />
    </div>
    <h2 className="text-xl font-bold text-slate-800">Exploring the World...</h2>
    <p className="text-sm text-slate-500">New regions and adventures are unlocking. Your character is getting ready!</p>
  </div>
);

const StoryPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center space-y-4">
    <div className="w-24 h-24 bg-brand-secondary/20 rounded-full flex items-center justify-center">
      <div className="w-12 h-12 bg-brand-secondary rounded-full animate-bounce" />
    </div>
    <h2 className="text-xl font-bold text-slate-800">Fables of Soulbound</h2>
    <p className="text-sm text-slate-500">The library of memories is being inscribed. Keep leveling up to unlock your story!</p>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  const { user, character, isAuthReady, setAuthUser, syncFromFirebase } = useGameStore();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
      if (firebaseUser) {
        syncFromFirebase();
      }
    });

    return () => unsubscribe();
  }, [setAuthUser, syncFromFirebase]);

  if (!isAuthReady) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-dark-bg text-white">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500">Inscribing Soul...</div>
      </div>
    );
  }

  // Guest Mode: Automatically set a placeholder user if none exists to bypass LoginScreen
  if (!user) {
    setTimeout(() => {
      setAuthUser({ uid: 'guest-user', email: 'guest@soulbound.io' } as any);
    }, 100);
    return null;
  }

  if (!character) {
    return (
      <div className="max-w-md mx-auto h-screen relative bg-dark-bg text-white">
        <GenesisScreen />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen relative bg-dark-bg text-slate-100 overflow-x-hidden overflow-y-auto scrollbar-hide select-none transition-colors duration-1000">
      {/* Background purely for aesthetic depth */}
      <div className="fixed inset-0 pointer-events-none opacity-40 blur-3xl overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-indigo-500/5 rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-purple-500/5 rounded-full" />
      </div>

      <div className="relative z-10">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'world' && <WorldPlaceholder />}
        {activeTab === 'story' && <StoryScreen />}
        {activeTab === 'shop' && <ShopScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </div>

      <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
