import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wand2, Cpu, Ghost, Star, Check } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Character } from '../types';

const CHARACTER_TYPES = [
  { id: 'fantasy', name: 'Celestial', icon: Wand2, color: 'from-amber-400 to-orange-500', bg: 'bg-orange-500/10' },
  { id: 'cyber', name: 'Neura', icon: Cpu, color: 'from-blue-400 to-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'beast', name: 'Primal', icon: Star, color: 'from-emerald-400 to-teal-500', bg: 'bg-teal-500/10' },
  { id: 'ghost', name: 'Ethereal', icon: Ghost, color: 'from-purple-400 to-pink-500', bg: 'bg-pink-500/10' },
];

export const GenesisScreen = () => {
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<Character['type']>('fantasy');
  const [isCreating, setIsCreating] = useState(false);
  const createCharacter = useGameStore(state => state.createCharacter);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsCreating(true);
    await createCharacter(name.trim(), selectedType);
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col min-h-screen px-8 py-12 relative overflow-hidden bg-dark-bg">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-12 text-center"
      >
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
          Breathe <span className="text-indigo-400">Life</span>
        </h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Genesis Protocol</p>
      </motion.div>

      <div className="space-y-8 flex-1">
        {/* Name Input */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Identify the Soul</label>
          <div className="relative">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all text-center text-xl"
            />
          </div>
        </div>

        {/* Type Selection */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Resonance Affinity</label>
          <div className="grid grid-cols-2 gap-4">
            {CHARACTER_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as Character['type'])}
                  className={`relative p-5 rounded-3xl border transition-all duration-300 text-left overflow-hidden ${
                    isSelected ? 'bg-white/10 border-indigo-500 scale-[1.02]' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isSelected && (
                    <motion.div 
                      layoutId="selected-bg"
                      className="absolute inset-0 bg-indigo-600/10 pointer-events-none"
                    />
                  )}
                  <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                    {type.name}
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 text-indigo-400">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        disabled={!name.trim() || isCreating}
        onClick={handleCreate}
        className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
          name.trim() && !isCreating 
            ? 'bg-white text-indigo-900 shadow-[0_20px_40px_rgba(255,255,255,0.1)]' 
            : 'bg-white/5 text-white/20 cursor-not-allowed'
        }`}
      >
        {isCreating ? (
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Establish Bond
          </>
        )}
      </motion.button>
    </div>
  );
};
