import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Coins, Hexagon, Battery, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

export const CurrencyHeader = () => {
  const { coins, gems, energy, maxEnergy } = useGameStore();

  return (
    <div className="flex items-center justify-between px-6 py-4 fixed top-0 left-0 right-0 z-50 glass-panel border-none bg-transparent">
      <div className="flex gap-4">
        {/* Coins */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl"
        >
          <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" />
          <span className="text-sm font-bold tracking-tight text-white">{coins.toLocaleString()}</span>
        </motion.div>

        {/* Gems */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl"
        >
          <div className="w-4 h-4 bg-teal-400 rounded-full shadow-[0_0_10px_#2dd4bf]" />
          <span className="text-sm font-bold tracking-tight text-white">{gems}</span>
        </motion.div>
      </div>

      <div className="flex gap-3">
        {/* Energy */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-2xl"
        >
          <span className="text-xs">⚡</span>
          <span className="text-sm font-bold text-white">{energy}/{maxEnergy}</span>
        </motion.div>
      </div>
    </div>
  );
};

export const XPBar = () => {
  const character = useGameStore(state => state.character);
  if (!character) return null;

  return (
    <div className="w-full px-6 mt-24">
      <div className="flex justify-between items-end mb-3">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-indigo-600 text-white font-bold text-[10px] tracking-widest shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400">
            LVL. {character.level}
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Tier {character.evolutionStage}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {character.xp} / {character.xpToNextLevel} XP
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(character.xp / character.xpToNextLevel) * 100}%` }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>
    </div>
  );
};
