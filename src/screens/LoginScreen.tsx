import React from 'react';
import { motion } from 'motion/react';
import { signInWithGoogle } from '../lib/firebase';
import { Sparkles, Heart, Shield } from 'lucide-react';

export const LoginScreen = () => {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center space-y-12 relative overflow-hidden">
      {/* Dynamic Background elements */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="w-[400px] h-[400px] border border-white/5 rounded-full absolute" />
        <div className="w-[550px] h-[550px] border border-white/5 rounded-full absolute opacity-30" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 relative z-10"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-800 rounded-[2rem] mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-white/20 rotate-12">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-white mt-8 italic uppercase">
          Soul<span className="text-indigo-400">bound</span>
        </h1>
        <div className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold">Chronicle of the Heart</div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs relative z-10">
        <div className="p-5 glass-card rounded-3xl flex flex-col items-center gap-3 border-white/10">
          <Heart className="w-6 h-6 text-indigo-400" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Connect</span>
        </div>
        <div className="p-5 glass-card rounded-3xl flex flex-col items-center gap-3 border-white/10">
          <Shield className="w-6 h-6 text-teal-400" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Evolve</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogin}
        disabled={loading}
        className="w-full max-w-xs py-5 bg-white text-indigo-900 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] relative z-10"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Begin Journey
          </>
        )}
      </motion.button>

      <p className="text-[9px] text-slate-500 max-w-[200px] uppercase tracking-widest font-bold opacity-50 relative z-10">
        Encrypted via Ethereal Protocol
      </p>
    </div>
  );
};
