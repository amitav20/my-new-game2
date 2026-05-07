import React from 'react';
import { Home, Compass, Scroll, ShoppingBag, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils'; // I'll create the utils in the next step

interface BottomTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'world', icon: Compass, label: 'World' },
  { id: 'story', icon: Scroll, label: 'Story' },
  { id: 'shop', icon: ShoppingBag, label: 'Shop' },
  { id: 'settings', icon: Settings, label: 'Options' },
];

export const BottomTabs = ({ activeTab, onTabChange }: BottomTabsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 safe-area-bottom z-50">
      <div className="glass-panel border-white/10 rounded-[2.5rem] px-2 py-2 mb-4 shadow-2xl flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const label = tab.id === 'home' ? '🏠' : tab.id === 'world' ? '🛡️' : tab.id === 'story' ? '📜' : tab.id === 'shop' ? '🏪' : '⚙️';
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-3xl transition-all duration-300",
                isActive ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5"
              )}
            >
              <span className="text-xl mb-0.5">{label}</span>
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest",
                isActive ? "opacity-100" : "opacity-40"
              )}>
                {tab.id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
