import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Lock, Sparkles, Feather } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

const MEMORIES = [
  { id: 1, title: 'The Awakening', description: 'The moment your soul first resonated with this ethereal realm.', minLevel: 1, unlocked: true },
  { id: 2, title: 'Shadow of the Past', description: 'A glimpse into the history of your companion.', minLevel: 5, unlocked: false },
  { id: 3, title: 'The Convergence', description: 'How habits forge the bridge between worlds.', minLevel: 10, unlocked: false },
  { id: 4, title: 'Celestial Echo', description: 'Whispers from the stars about your shared destiny.', minLevel: 15, unlocked: false },
];

export const StoryScreen = () => {
  const { character } = useGameStore();
  const currentLevel = character?.level || 1;

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 pb-32 space-y-8">
      <header className="space-y-2 mt-8">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          Memory <span className="text-indigo-400">Library</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Chronicles of the Soulbound</p>
      </header>

      <div className="grid gap-6">
        {MEMORIES.map((memory) => {
          const isUnlocked = currentLevel >= memory.minLevel;
          
          return (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: memory.id * 0.1 }}
              className={`p-6 rounded-[2rem] border transition-all relative overflow-hidden ${
                isUnlocked 
                  ? 'bg-white/5 border-white/10 shadow-premium' 
                  : 'bg-white/5 border-transparent opacity-50 grayscale'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="w-6 h-6 text-white/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Level {memory.minLevel} Required</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 relative z-0">
                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center ${
                  isUnlocked ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-slate-600'
                }`}>
                  {memory.id === 1 ? <Sparkles className="w-7 h-7" /> : <BookOpen className="w-7 h-7" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white tracking-tight">{memory.title}</h3>
                    {isUnlocked && <Feather className="w-4 h-4 text-indigo-400 opacity-50" />}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed italic">
                    "{memory.description}"
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-8 rounded-[2.5rem] bg-indigo-600/10 border border-indigo-500/20 text-center">
         <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
         <p className="text-xs font-bold text-slate-300 leading-relaxed uppercase tracking-wider">
           Maintain your streak to unlock the deep lore of your companion.
         </p>
      </div>
    </div>
  );
};
