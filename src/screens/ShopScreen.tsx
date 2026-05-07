import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Zap, Sparkles, Star, Package } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

const SHOP_ITEMS = [
  { id: 'item1', name: 'Celestial Aura', description: 'Surrounds your soul in golden light.', price: 200, currency: 'gems', type: 'effect', icon: Sparkles },
  { id: 'item2', name: 'Energy Surge', description: 'Restores 50 Energy immediately.', price: 100, currency: 'coins', type: 'consumable', icon: Zap },
  { id: 'item3', name: 'Identity Shifter', description: 'Change your name and appearance.', price: 50, currency: 'gems', type: 'service', icon: Package },
  { id: 'item4', name: 'Ancient Scroll', description: 'A massive burst of 500 XP.', price: 1000, currency: 'coins', type: 'exp', icon: Star },
];

export const ShopScreen = () => {
  const { coins, gems, addCoins, addGems } = useGameStore();

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    // Logic for buying
    alert(`Purchasing ${item.name}! (Demo Logic)`);
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 pb-32 space-y-8">
      <header className="space-y-2 mt-8">
        <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
          Ethereal <span className="text-teal-400">Boutique</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Acquire Essences</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {SHOP_ITEMS.map((item) => {
          const Icon = item.icon;
          const isGems = item.currency === 'gems';
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBuy(item)}
              className="flex flex-col items-center p-5 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all text-center relative overflow-hidden group"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Icon className={`w-8 h-8 ${isGems ? 'text-teal-400' : 'text-yellow-400'}`} />
              </div>
              
              <h3 className="text-sm font-black text-white uppercase tracking-tight mb-1">{item.name}</h3>
              <p className="text-[9px] text-slate-500 font-bold leading-tight mb-4">{item.description}</p>
              
              <div className={`mt-auto px-4 py-1.5 rounded-full flex items-center gap-2 border ${
                isGems ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isGems ? 'bg-teal-400 shadow-[0_0_5px_#2dd4bf]' : 'bg-yellow-400 shadow-[0_0_5px_#facc15]'}`} />
                <span className="text-xs font-black">{item.price}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Resource Top-up */}
      <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Top Up</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="py-4 rounded-3xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest">+ 1000 Coins</button>
          <button className="py-4 rounded-3xl bg-teal-600 text-white font-black text-[10px] uppercase tracking-widest">+ 50 Gems</button>
        </div>
      </div>
    </div>
  );
};
