import React from 'react';
import { motion } from 'motion/react';
import { User, LogOut, Shield, Bell, HelpCircle, ChevronRight, Share2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useGameStore } from '../store/useGameStore';

export const SettingsScreen = () => {
  const { user, character } = useGameStore();

  const MENU_ITEMS = [
    { icon: User, label: 'Profile Settings', value: character?.name || 'Soul' },
    { icon: Shield, label: 'Privacy & Security', value: 'Soulbound' },
    { icon: Bell, label: 'Notifications', value: 'Active' },
    { icon: HelpCircle, label: 'Support & FAQ', value: '' },
    { icon: Share2, label: 'Invite Souls', value: '' },
  ];

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 pb-32 space-y-8">
      <header className="space-y-2 mt-8">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          Ethereal <span className="text-slate-500">Node</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">System Configuration</p>
      </header>

      {/* User Card */}
      <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
          <User className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-black text-white uppercase tracking-tight">{user?.email?.split('@')[0]}</div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user?.email}</div>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {MENU_ITEMS.map((item, index) => (
          <button
            key={index}
            className="w-full p-5 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-400">
                 <item.icon className="w-5 h-5" />
               </div>
               <div className="text-left">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">{item.label}</div>
                  {item.value && <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">{item.value}</div>}
               </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => auth.signOut()}
        className="w-full py-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3"
      >
        <LogOut className="w-4 h-4" />
        Sever Connection
      </motion.button>

      <div className="text-center">
        <div className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Soulbound v1.0.4</div>
      </div>
    </div>
  );
};
