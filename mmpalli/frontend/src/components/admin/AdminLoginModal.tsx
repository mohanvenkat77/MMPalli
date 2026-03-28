import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Lock, X, KeyRound, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: Props) {
  const [apiKey, setApiKey] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      login(apiKey.trim());
      setApiKey('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top Decoration */}
            <div className="h-32 bg-trustBlue-900 relative overflow-hidden flex items-center justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500 rounded-bl-full opacity-20"></div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>

            {/* Form */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Admin Access</h2>
              <p className="text-slate-500 text-center mb-8 text-sm">Enter your secure API key to manage village data.</p>

              <form onSubmit={handleLogin}>
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter Admin API Key..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 transition-all outline-none font-mono text-lg"
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-trustBlue-900 hover:bg-trustBlue-800 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors group"
                >
                  Unlock Portal <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}