import React from 'react';
import { CurrencyHeader, XPBar } from '../components/game/Header';
import { CharacterVisual } from '../components/game/CharacterVisual';
import { useGameStore } from '../store/useGameStore';
import { Calendar, CheckCircle2, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'motion/react';

export const HomeScreen = () => {
  const { quests, claimDailyReward, dailyRewardClaimed } = useGameStore();

  return (
    <div className="min-h-screen pb-32">
      <CurrencyHeader />
      <XPBar />

      <main className="px-6 space-y-8 mt-4">
        {/* Character Stage */}
        <section>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-emerald-400 text-sm animate-pulse">●</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Mood: {character?.mood}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Bond: Soulbound</span>
            </div>
          </div>
          <CharacterVisual />
        </section>

        {/* Daily Tasks / Quests */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-black text-slate-100/50 uppercase tracking-[0.2em] mb-1">
                Ethereal Path
              </h2>
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
                Daily Quests
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">
              {quests.filter(q => q.isCompleted).length}/{quests.length}
            </div>
          </div>

          <div className="space-y-4">
            {quests.map((quest) => (
              <motion.div
                key={quest.id}
                whileTap={{ scale: 0.98 }}
                className={`p-5 rounded-[2rem] flex items-center justify-between transition-all ${
                  quest.isCompleted 
                    ? 'bg-emerald-500/10 border border-emerald-500/20' 
                    : 'glass-card border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                    quest.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'
                  }`}>
                    {quest.category === 'social' ? '🎁' : '⚡'}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold mb-1">
                      {quest.category}
                    </div>
                    <h3 className={`text-sm font-bold ${quest.isCompleted ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {quest.title}
                    </h3>
                  </div>
                </div>
                {quest.isCompleted ? (
                   <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                     <CheckCircle2 className="w-4 h-4 text-white" />
                   </div>
                ) : (
                  <div className="text-[10px] font-black bg-indigo-500 text-white px-2.5 py-1 rounded-lg shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                    GO
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Bonus Card */}
        {!dailyRewardClaimed && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={claimDailyReward}
            className="w-full relative overflow-hidden p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20 border border-indigo-400/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-800 opacity-90" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-70 font-bold mb-1">Reward Ready</div>
                <h3 className="text-xl font-black">Daily Lore Burst</h3>
                <p className="text-xs opacity-60 mt-1">Claim your gift box for today</p>
              </div>
              <div className="w-14 h-14 bg-white/20 p-3 rounded-[1.5rem] backdrop-blur-md flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
            </div>
          </motion.button>
        )}
      </main>
    </div>
  );
};
