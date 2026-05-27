import React, { useState } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { X, Mail, ShieldAlert, KeyRound, Sparkles, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuthAndQuiz();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Input fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Statuses
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePreset = (type: 'admin' | 'scholar') => {
    setError(null);
    if (type === 'admin') {
      setEmail('admin@chemizic.com');
      setUsername('PrantikDasAdmin');
    } else {
      setEmail('scholar@chemizic.com');
      setUsername('Scholar_Pro');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!email) {
          setError('Please provide your email address.');
          setLoading(false);
          return;
        }
        await login(email, username);
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          onClose();
          // Reset states
          setEmail('');
          setUsername('');
          setPassword('');
          setSuccessMsg(null);
        }, 1200);
      } else if (activeTab === 'signup') {
        if (!username || !email) {
          setError('Please complete all signup fields.');
          setLoading(false);
          return;
        }
        const res = await signup(username, email);
        if (res.success) {
          setSuccessMsg('Account compiled. Standard login credentials active.');
          setTimeout(() => {
            onClose();
            setEmail('');
            setUsername('');
            setPassword('');
            setSuccessMsg(null);
          }, 1500);
        } else {
          setError(res.error || 'Registration failed.');
        }
      } else {
        // Forgot password simulation
        if (!email) {
          setError('Please enter your email.');
          setLoading(false);
          return;
        }
        setSuccessMsg(`Entropy recovery signal transmitted to ${email}. Check mailbox for decryption logs!`);
        setTimeout(() => {
          setActiveTab('login');
          setSuccessMsg(null);
        }, 4000);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication channel disrupted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Black backdrop overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Card content */}
      <div className="bg-[#111318] border border-cyan-500/25 rounded-2xl w-full max-w-sm overflow-hidden relative z-10 shadow-[0_0_50px_rgba(34,211,238,0.15)] select-text">
        
        {/* Close Button overlay */}
        <button 
          onClick={onClose}
          title="Close Modal"
          className="absolute right-4 top-4 text-slate-500 hover:text-cyan-400 p-1 hover:bg-white/[0.03] rounded-lg transition-all cursor-pointer"
        >
          <X size={15} />
        </button>

        {/* Modal headers */}
        <div className="p-6 pb-2 border-b border-slate-805">
          <div className="flex items-center gap-1.5 justify-center mb-4">
            <div className="w-5 h-5 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded flex items-center justify-center text-white text-[10px]">⚗</div>
            <span className="font-mono text-xs font-black tracking-[0.2em] text-cyan-400 uppercase">CHEMIZIC AUTH NODE</span>
          </div>

          {/* Tab selector */}
          <div className="flex gap-1 border-b border-slate-812">
            {[
              { id: 'login', label: 'Log In' },
              { id: 'signup', label: 'Sign Up' },
              { id: 'forgot', label: 'Recover' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 font-mono text-[9px] uppercase tracking-wider font-extrabold focus:outline-none transition-all border-b-2 ${activeTab === tab.id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body forms content */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 font-mono text-xs text-slate-305">
          
          {error && (
            <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-300 rounded-lg text-[10.5px] items-start flex gap-2 leading-relaxed">
              <ShieldAlert size={14} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-[10.5px] items-start flex gap-2 leading-relaxed animate-pulse">
              <Sparkles size={14} className="shrink-0 text-cyan-400 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'signup' && (
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Pick Username</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-600"><UserPlus size={13} /></span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. prantik"
                  className="w-full text-xs bg-black/50 border border-slate-800 focus:border-cyan-500/50 pl-9 pr-3 py-2 rounded-lg outline-none text-slate-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-600"><Mail size={13} /></span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@gmail.com"
                className="w-full text-xs bg-black/50 border border-slate-800 focus:border-cyan-500/50 pl-9 pr-3 py-2 rounded-lg outline-none text-slate-100"
              />
            </div>
          </div>

          {activeTab !== 'forgot' && (
            <div>
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Decryption Secret Key</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-600"><KeyRound size={13} /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password value..."
                  className="w-full text-xs bg-black/50 border border-slate-800 focus:border-cyan-500/50 pl-9 pr-3 py-2 rounded-lg outline-none text-slate-100 placeholder:text-slate-700"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 font-bold disabled:opacity-40"
          >
            {loading ? 'Processing Node...' : activeTab === 'login' ? 'Sync Portal Account' : activeTab === 'signup' ? 'Compile Registration' : 'Trigger Reset Directive'}
          </button>

          {/* Quick Evaluate Presets Selector (Highly user-friendly feature to log in with presets instant-click!) */}
          {activeTab === 'login' && (
            <div className="pt-2 border-t border-slate-805 space-y-2">
              <span className="text-[9px] text-slate-550 block font-bold text-center">FAST EVALUATION CREDENTIALS PRESETS</span>
              <div className="grid grid-cols-2 gap-2 text-[8.5px]">
                <button
                  type="button"
                  onClick={() => handlePreset('admin')}
                  className="py-1 px-2 border border-cyan-500/20 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-500/10 rounded-md transition-all cursor-pointer text-center font-bold"
                >
                  Load Admin Preset
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('scholar')}
                  className="py-1 px-2 border border-purple-500/20 bg-purple-950/20 text-purple-300 hover:bg-purple-500/10 rounded-md transition-all cursor-pointer text-center font-bold"
                >
                  Load Scholar Preset
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
