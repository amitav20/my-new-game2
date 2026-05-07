import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/useGameStore';
import { chatWithCharacter } from '../../services/aiService';
import { MessageCircle, Heart, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CharacterVisual = () => {
  const { character, updateCharacter, addCoins, completeQuest } = useGameStore();
  const [isDancing, setIsDancing] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  if (!character) return null;

  const handleInteract = async () => {
    setIsDancing(true);
    setTimeout(() => setIsDancing(false), 1000);
    
    setIsTyping(true);
    setBubbleText(null);
    
    const response = await chatWithCharacter(character, "Hello! How are you doing?");
    setBubbleText(response);
    setIsTyping(false);
    
    // Reward for interaction
    updateCharacter({ affection: Math.min(100, character.affection + 2) });
    addCoins(10);
    completeQuest('q1'); // First Greeting quest
  };

  const getMoodColor = () => {
    switch (character.mood) {
      case 'happy': return 'from-indigo-400 to-teal-400';
      case 'excited': return 'from-amber-400 to-orange-500';
      case 'sad': return 'from-blue-600/40 to-indigo-800/40';
      case 'tired': return 'from-slate-700 to-slate-900';
      default: return 'from-indigo-500 to-purple-600';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Interaction Bubble */}
      <AnimatePresence>
        {(bubbleText || isTyping) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 w-64 glass-card p-4 rounded-3xl border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            {isTyping ? (
              <div className="flex gap-1 justify-center py-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-100 leading-relaxed italic text-center">
                "{bubbleText}"
              </p>
            )}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/10 backdrop-blur-xl rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={cn(
          "w-64 h-64 rounded-full blur-[100px] opacity-30 transition-all duration-1000 bg-gradient-to-br",
          getMoodColor()
        )} />
        <div className="w-[300px] h-[300px] border border-white/5 rounded-full absolute animate-pulse-glow" />
      </div>

      {/* Character Image container */}
      <motion.div
        animate={isDancing ? {
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        } : {
          y: [0, -10, 0]
        }}
        transition={isDancing ? { duration: 0.5 } : {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={handleInteract}
        className="relative z-10 cursor-pointer group"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent rounded-full blur-3xl opacity-50" />
        <img 
          src={`https://api.dicebear.com/7.x/${
            character.type === 'fantasy' ? 'bottts-neutral' : 
            character.type === 'cyber' ? 'identicon' : 
            character.type === 'beast' ? 'rings' : 
            character.type === 'ghost' ? 'shapes' : 'bottts'
          }/svg?seed=${character.name}&backgroundColor=0f172a,1e293b`} 
          alt="Character"
          className="w-48 h-48 filter drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-transform group-hover:scale-105"
        />
      </motion.div>
      
      {/* Quick Action Buttons */}
      <div className="flex gap-4 mt-12 relative z-20">
        <button 
          onClick={handleInteract}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl glass-card border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest text-indigo-300"
        >
          <MessageCircle className="w-4 h-4" />
          Talk
        </button>
        <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-indigo-600 border border-indigo-400 font-bold text-xs uppercase tracking-widest text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <Zap className="w-4 h-4 fill-white" />
          Evolve
        </button>
      </div>
    </div>
  );
};
