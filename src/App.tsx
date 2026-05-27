/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { popularChemicals, LocalChemical } from './data/popularChemicals';
import MoleculeCanvas from './components/MoleculeCanvas';
import PeriodicTable from './components/PeriodicTable';
import ReactionPredictorTab from './components/ReactionPredictorTab';
import AIChemistTab from './components/AIChemistTab';
import { QuizArenaTab } from './components/QuizArenaTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { AuthModal } from './components/AuthModal';
import { useAuthAndQuiz } from './context/AuthAndQuizContext';
import { ChemizicLogo } from './components/ChemizicLogo';
import { 
  Search, FlaskConical, Scale, GraduationCap, Compass, BookOpen, 
  Settings, Check, Mail, Phone, MapPin, Sparkles, AlertTriangle, 
  CheckCircle2, Flame, AlertOctagon, HelpCircle, Activity, Beaker, Atom, Cpu,
  Trophy, User, LogOut, ShieldAlert, Home
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const { currentUser, logout } = useAuthAndQuiz();
  const [activeTab, setActiveTab] = useState<'home' | 'explorer' | 'periodic' | 'reaction' | 'chemist' | 'about' | 'quiz' | 'leaderboard'>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChemical, setSelectedChemical] = useState<LocalChemical>(popularChemicals[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // About feedback form state
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  // Trigger search on mount to load Water
  useEffect(() => {
    setSelectedChemical(popularChemicals[0]);
  }, []);

  // Chemical search query resolver (checks local first, otherwise API)
  const handleSearch = async (query: string) => {
    const q = (query || searchQuery || '').trim();
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chemical/search?q=${encodeURIComponent(q)}`);
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to locate chemical compound details.");
      }

      const data = await response.json();
      setSelectedChemical(data.chemical);
      setActiveTab('explorer');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Chemical structure matched, but failed to compile. Verify network connection.");
    } finally {
      setLoading(false);
    }
  };

  // Connected Periodic Table query event handler
  const handlePeriodicElementSearch = (symbol: string) => {
    setSearchQuery(symbol);
    handleSearch(symbol);
  };

  // Handle feedback submit
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.name || !feedback.email || !feedback.message) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedback({ name: '', email: '', message: '' });
      setFeedbackSent(false);
    }, 4000);
  };

  const symbols = ['H₂O', 'NaCl', 'C₆H₆', 'CH₄', 'DNA', 'CO₂', 'NH₃', 'O₂'];

  return (
    <div className="min-h-screen bg-[#020204] text-slate-300 flex flex-col font-sans selection:bg-cyan-950/40 selection:text-cyan-200 border-t-4 border-cyan-500 relative overflow-hidden">
      
      {/* Background Decorators from the template */}
      <div className="absolute inset-0 bg-black pointer-events-none" style={{ zIndex: 0 }} />

      <div className="absolute inset-0 opacity-[0.08] mix-blend-soft-light bg-gradient-to-br from-zinc-900 via-black to-zinc-950 animate-pulse pointer-events-none" style={{ zIndex: 0 }} />

      {/* Floating Chemical Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20" style={{ zIndex: 0 }}>
        {symbols.map((symbol, i) => (
          <motion.div
            key={symbol}
            initial={{ y: 120, opacity: 0 }}
            animate={{
              y: [-40, -120, -540],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 15 + i * 2,
              delay: i * 1.5,
              ease: 'linear',
            }}
            className="absolute text-cyan-400/30 font-mono text-xl blur-[0.5px]"
            style={{
              left: `${5 + i * 11}%`,
              bottom: '-5%',
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Toxic Vapor Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-cyan-500/5 via-transparent to-transparent blur-3xl opacity-50 animate-pulse pointer-events-none" style={{ zIndex: 0 }} />

      {/* Molecular Connection Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none animate-pulse" style={{ zIndex: 0 }}>
        <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="#22d3ee" strokeWidth="1" />
        <line x1="30%" y1="40%" x2="50%" y2="25%" stroke="#8b5cf6" strokeWidth="1" />
        <line x1="50%" y1="25%" x2="70%" y2="45%" stroke="#22d3ee" strokeWidth="1" />
        <line x1="70%" y1="45%" x2="90%" y2="30%" stroke="#8b5cf6" strokeWidth="1" />

        <circle cx="10%" cy="20%" r="4" fill="#22d3ee">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" repeatCount="indefinite" />
        </circle>

        <circle cx="30%" cy="40%" r="5" fill="#8b5cf6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="5s" repeatCount="indefinite" />
        </circle>

        <circle cx="50%" cy="25%" r="4" fill="#22d3ee">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
        </circle>

        <circle cx="70%" cy="45%" r="5" fill="#8b5cf6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="6s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Futuristic Fog / Particle Spots */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] bg-purple-700/5 rounded-full blur-[180px] animate-pulse pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" style={{ zIndex: 0 }} />

      {/* Cyber Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse pointer-events-none" style={{ zIndex: 0 }} />

      {/* Floating Spark Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDuration: `${3 + (i % 4)}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Tech Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_95%,rgba(0,255,255,0.04)_100%)] bg-[length:100%_8px] opacity-15" style={{ zIndex: 0 }} />

      {/* HEADER: Glowing Cyberpunk Global Navbar with Unified Query Search */}
      <header className="relative z-45 border-b border-cyan-500/15 backdrop-blur-3xl bg-black/40 sticky top-0 shadow-lg shadow-cyan-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <ChemizicLogo />
          </div>

          {/* Unified search bar */}
          <div className="w-full md:w-[440px] relative">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }} className="flex relative">
              <input
                type="text"
                placeholder="Search compounds... (e.g. Water, Benzene, Caffeine, Methane)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-black/50 border border-cyan-500/20 pl-4 pr-12 py-2.5 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 rounded-xl outline-none font-medium text-cyan-100 transition-all placeholder:text-slate-600 shadow-[inset_0_0_12px_rgba(34,211,238,0.05)] font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                title="Search Compound Database"
                className="absolute right-1 top-1 text-cyan-400 hover:text-cyan-300 p-1.5 bg-cyan-950/40 hover:bg-cyan-950/80 rounded-lg border border-cyan-500/20 hover:border-cyan-400/40 transition-all cursor-pointer disabled:opacity-40"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-slate-705 border-t-cyan-400 rounded-full animate-spin block" />
                ) : (
                  <Search size={14} />
                )}
              </button>
            </form>
          </div>

          {/* Dynamic Auth Widget / Profile dashboard trigger */}
          <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-cyan-955/20 border border-cyan-500/30 p-1.5 pl-3 pr-2.5 rounded-xl text-slate-300">
                <div className="text-right">
                  <div className="font-bold text-cyan-300 text-[11px] truncate max-w-[120px]">{currentUser.username}</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">
                    Lv. {currentUser.level} • {currentUser.role === 'admin' ? '🛡 ADMIN' : currentUser.role === 'guest' ? '🎓 GUEST' : '🔬 SCHOLAR'}
                  </div>
                </div>
                <button 
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-2 bg-black/40 hover:bg-black/80 hover:text-red-400 text-slate-400 border border-slate-800 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4.5 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-[10.5px] uppercase tracking-wider font-extrabold cursor-pointer transition-all flex items-center gap-2 font-mono shadow-[0_0_15px_rgba(34,211,238,0.05)]"
              >
                <User size={12} /> Login / Signup
              </button>
            )}
          </div>

        </div>
      </header>


      {/* SUBNAV: Dark cyber floating tab navigation row */}
      <nav className="relative z-30 border-b border-cyan-500/10 bg-black/20 sticky top-[77px] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-none">
            {[
              { id: 'home', label: 'Home Hub', icon: Home },
              { id: 'explorer', label: 'Structure Explorer', icon: FlaskConical },
              { id: 'periodic', label: 'Periodic Table Explorer', icon: Compass },
              { id: 'reaction', label: 'AI Reaction Predictor', icon: Scale },
              { id: 'chemist', label: 'AI Chemist Tutor', icon: GraduationCap },
              { id: 'quiz', label: 'Quiz Arena 🎮', icon: Sparkles },
              { id: 'leaderboard', label: 'Rankings 🏆', icon: Trophy },
              { id: 'about', label: 'Documentation & Info', icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { 
                    setActiveTab(tab.id as any);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-4 py-1.5 font-mono tracking-wider uppercase text-[10px] rounded-lg transition-all cursor-pointer whitespace-nowrap border ${isActive ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-bold' : 'text-slate-400 border-transparent hover:text-cyan-300 hover:bg-white/[0.03]'}`}
                >
                  <Icon size={12} className={isActive ? 'text-cyan-300' : 'text-slate-500'} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* CORE WORKSPACE SCREEN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* TAB WORKSPACE 0: Centralized Home Hub & Portal Dashboard */}
        {activeTab === 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 select-text"
          >
            {/* Main Premium Interactive Hero Gateway */}
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/15 bg-gradient-to-b from-[#0E1118]/80 to-[#0A0B0E]/95 p-8 md:p-12 shadow-[0_0_50px_rgba(34,211,238,0.05)]">
              {/* Absolutes decorative glow blobs */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -mr-40 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[90px] -ml-20 -mb-20 pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 border border-cyan-500/35 rounded-full text-[10px] font-mono text-cyan-300 tracking-wider">
                    <Sparkles size={11} className="text-cyan-400 animate-spin" />
                    Interactive Gamified Chemical Sandbox
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white font-sans">
                    EXPLORE <br />
                    <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                      CHEMISTRY
                    </span> <br />
                    BEYOND IMAGINATION
                  </h1>

                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-sans font-medium">
                    Welcome to ChemiZIC—the futuristic virtual sandbox. Map structural characteristics of thousands of compounds, query an advanced AI tutor, simulate organic reactions, and test your skills in the competitive gamified quiz arenas.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => {
                        setActiveTab('quiz');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 rounded-xl bg-cyan-500 text-[#020204] hover:bg-cyan-400 text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.03] cursor-pointer flex items-center gap-2 font-mono"
                    >
                      <Sparkles size={14} /> PLAY QUIZ NOW 🎮
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('explorer');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 rounded-xl bg-[#111318] hover:bg-slate-950 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/50 text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.03] cursor-pointer font-mono"
                    >
                      3D Explorer ⚗
                    </button>
                  </div>
                </div>

                {/* Right hand layout showing beautiful scientific graphic */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center select-none scale-90 md:scale-100">
                    <div className="absolute inset-0 rounded-full border border-cyan-500/5 animate-spin duration-10000 shadow-[0_0_50px_rgba(0,255,255,0.05)]" />
                    <div className="absolute w-[80%] h-[80%] rounded-full border border-purple-550/10 animate-spin duration-7000" />
                    
                    <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-cyan-950/30 via-slate-950/85 to-purple-950/30 backdrop-blur-md border border-cyan-500/20 flex flex-col items-center justify-center text-center p-6">
                      {/* Integrated custom brand logo */}
                      <ChemizicLogo showText={false} className="h-20" />
                      <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-2 block">Active Lab Core</span>
                    </div>

                    {/* Orbiting particles */}
                    <div className="absolute w-4 h-4 bg-cyan-400 rounded-full -top-2 left-1/2 -ml-2 animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    <div className="absolute w-3 h-3 bg-purple-500 rounded-full bottom-8 left-4 animate-ping shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
                    <div className="absolute w-3.5 h-3.5 bg-blue-400 rounded-full bottom-4 right-10 animate-bounce" />
                  </div>
                </div>
              </div>
            </div>



            {/* Central Portal Grid of 6 Active Sections */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono">CHEMIZIC STATION CORE SECTORS</h3>
                <p className="text-xs text-slate-500 mt-1">Select an active laboratory department below to jump straight to its workstation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: 'explorer',
                    title: 'Molecule Structure Explorer',
                    icon: FlaskConical,
                    color: 'text-cyan-400 border-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]',
                    glow: 'bg-cyan-500/10',
                    tag: 'STRUCTURE INTERACTIVE',
                    bullets: ['3D Ball & Stick rendering', 'PubChem molecule resolver', 'NFPA 704 and GHS hazard specs']
                  },
                  {
                    id: 'periodic',
                    title: 'Interactive Periodic Table',
                    icon: Compass,
                    color: 'text-purple-450 border-purple-500/20 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]',
                    glow: 'bg-purple-500/10',
                    tag: 'ELEMENTARY DISCOVERY',
                    bullets: ['Complete interactive elements matrix', 'Details of group groups, periods & shells', 'Filter by nonmetals, halogens & transition metals']
                  },
                  {
                    id: 'reaction',
                    title: 'AI Reaction Predictor',
                    icon: Scale,
                    color: 'text-blue-455 border-blue-500/20 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]',
                    glow: 'bg-blue-500/10',
                    tag: 'AI STOICHIOMETRY ENGINE',
                    bullets: ['Identify reaction products dynamically', 'Balance stoichiometry chemical equations', 'Simulate thermodynamics values']
                  },
                  {
                    id: 'chemist',
                    title: 'AI Chemist Tutor',
                    icon: GraduationCap,
                    color: 'text-emerald-455 border-emerald-500/20 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]',
                    glow: 'bg-emerald-500/10',
                    tag: 'ACADEMIC REASONING',
                    bullets: ['Generative chemistry voice reading', 'Explain organic & inorganic chemistry', 'Homework assistance chat']
                  },
                  {
                    id: 'quiz',
                    title: 'Game Quiz Arena 🎮',
                    icon: Sparkles,
                    color: 'text-amber-455 border-amber-500/20 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]',
                    glow: 'bg-amber-500/10',
                    tag: 'COMPETITIVE ARENA',
                    bullets: ['Timed chemistry challenges', 'Gain experience level ups', 'Verify academic accomplishments']
                  },
                  {
                    id: 'leaderboard',
                    title: 'Scholar Rankings 🏆',
                    icon: Trophy,
                    color: 'text-rose-455 border-rose-500/20 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]',
                    glow: 'bg-rose-500/10',
                    tag: 'SCHOLAR BOARD',
                    bullets: ['Real-time scoreboard ranking', 'XP accumulation system', 'Ascend levels with academic credentials']
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`relative overflow-hidden group cursor-pointer p-6 rounded-2xl border bg-gradient-to-b from-[#111318]/90 to-[#0A0B0E]/95 transition-all flex flex-col justify-between h-[230px] ${item.color}`}
                    >
                      {/* Decorative backing glow color */}
                      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-40 -mr-16 -mt-16 pointer-events-none group-hover:opacity-100 transition-opacity ${item.glow}`} />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-slate-500 font-extrabold tracking-wider">{item.tag}</span>
                          <div className="w-8 h-8 rounded-lg bg-[#0E1118] border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 transition-colors">
                            <Icon size={14} />
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-white transition-all font-sans">{item.title}</h4>
                        
                        <ul className="text-[10.5px] text-slate-400 space-y-1.5 font-sans leading-relaxed">
                          {item.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 bg-cyan-500/60 rounded-full shrink-0" />
                              <span className="truncate">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-[9.5px] font-mono uppercase tracking-widest text-cyan-400/80 font-bold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform mt-4 self-start">
                        LAUNCH PORTAL <span className="text-xs">→</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Gamification Onboarding Segment */}
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between leading-relaxed">
              <div className="space-y-2 flex-1">
                <span className="text-[9px] bg-purple-500/20 border border-purple-400/30 text-purple-300 font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-widest">
                  SCHOLAR STATUS SYSTEM
                </span>
                <h3 className="text-md font-bold text-slate-200 font-sans tracking-tight">Ascend the leaderboard by testing inorganic & organic reasoning</h3>
                <p className="text-xs text-slate-400 font-sans font-medium">
                  Register with a scholar handle (guest mode is activated automatically). Each correct answer in the Quiz Arena awards you experience points (XP). Accumulate points to level up, claim titles, and secure your place on the rankings leaderboard.
                </p>
              </div>

              <div className="flex gap-4 shrink-0 flex-wrap">
                {currentUser ? (
                  <div className="text-center bg-[#0A0B0E] border border-slate-800 p-4 rounded-xl min-w-[140px] flex flex-col items-center justify-center font-mono">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">YOUR RANK</span>
                    <span className="text-sm font-black text-cyan-300 mt-1 truncate max-w-[120px]">{currentUser.username}</span>
                    <span className="text-xs font-bold text-slate-400 mt-0.5">Lv. {currentUser.level} • {currentUser.role}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-5 py-3 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 border border-purple-500/30 hover:border-purple-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
                  >
                    SIGN UP CHANNELS 🎓
                  </button>
                )}
                <button
                  onClick={() => {
                    setActiveTab('leaderboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-xl bg-[#0A0B0E] hover:bg-[#111318] text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
                >
                  VIEW LEADERBOARD 🏆
                </button>
              </div>
            </div>

            {/* Documentation & Manual Portal Box (Reference Station) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative overflow-hidden group cursor-pointer p-6 rounded-2xl border border-cyan-500/15 bg-gradient-to-b from-[#111318]/95 to-[#0A0B0E]/98 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none group-hover:opacity-100 transition-opacity" />
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-slate-500 font-extrabold tracking-wider uppercase">REFERENCE STATION</span>
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">MANUAL</span>
                </div>
                <h4 className="text-md font-bold text-slate-100 group-hover:text-white transition-all font-sans flex items-center gap-2">
                  <BookOpen size={16} className="text-cyan-400" /> Platform Documentation & Lab Guides
                </h4>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  Learn how to master ChemiZIC's molecular structure visualizers, understand NFPA hazard diamond safety ratings, leverage stoichiometric reaction calculators, or read instructions on earning scholar academic ranks.
                </p>

                <div className="flex flex-wrap gap-4 text-[10px] font-mono text-slate-500 pt-1">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500/60 rounded-full" /> 3D Spatial Controls</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500/60 rounded-full" /> Stoichiometric Balancing</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500/60 rounded-full" /> Gamification XP Guide</span>
                </div>
              </div>

              <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 font-bold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform shrink-0">
                OPEN STUDY STATION <span className="text-xs">→</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* TAB WORKSPACE 1: Structure Explorer & 3D Molecule Visualizer */}
        {activeTab === 'explorer' && (
          <div className="space-y-12">
            
            {/* HERO LANDING COMPOSITE (Directly adapted from user's premium template) */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex flex-col lg:flex-row items-center justify-between py-10 md:py-16 gap-12 border-b border-cyan-500/10"
            >
              {/* Left Column Information */}
              <div className="max-w-2xl space-y-6 md:space-y-8">

                <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tight relative font-sans">
                  <span className="absolute -inset-4 blur-3xl opacity-30 bg-cyan-500/20 animate-pulse rounded-full" />
                  <span className="text-white">FUTURE</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-550 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-pulse uppercase">
                    CHEMISTRY
                  </span>
                </h1>

                <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-sans font-medium">
                  Explore molecules, thermodynamic characteristics, element structures, and reaction pathways inside a dark futuristic molecular universe. Glowing carbon networks, neon particle fields, and AI-powered biochemical reasoning create a gloomily immersive virtual laboratory.
                </p>


              </div>

              {/* Right Column Rotating Orbital Assembly */}
              <div className="relative flex items-center justify-center scale-90 md:scale-105 shrink-0 select-none">
                <div className="absolute w-[440px] h-[440px] rounded-full border border-cyan-400/5 animate-spin shadow-[0_0_60px_rgba(0,255,255,0.1)]" />
                <div className="absolute w-[340px] h-[340px] rounded-full border border-purple-500/5 animate-spin duration-3000" />

                <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-800/10 backdrop-blur-xl border border-cyan-400/10 flex items-center justify-center shadow-[0_0_120px_rgba(34,211,238,0.25)]">
                  <div className="absolute inset-0 rounded-full border border-cyan-400/5 animate-ping" />
                  <div className="absolute w-[114%] h-[114%] border border-purple-500/5 rounded-full animate-spin duration-[40s]" />

                  <div className="grid grid-cols-3 gap-6 relative z-10">
                    <div className="w-4 h-4 rounded-full bg-cyan-400 animate-bounce" />
                    <div className="w-4 h-4 rounded-full bg-purple-400 animate-pulse" />
                    <div className="w-4 h-4 rounded-full bg-blue-400 animate-bounce" />
                    <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse" />

                    <div className="w-10 h-10 rounded-full border-2 border-cyan-300 flex items-center justify-center bg-cyan-950/40">
                      <Atom className="text-cyan-300 animate-spin" size={18} />
                    </div>

                    <div className="w-4 h-4 rounded-full bg-pink-400 animate-bounce" />
                    <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse" />
                    <div className="w-4 h-4 rounded-full bg-violet-400 animate-bounce" />
                    <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Quick-choice horizontal showcase list & Canvas Viewport */}
            <div id="database-search-workspace" className="space-y-6 pt-4 scroll-mt-24">
            
            {/* Quick-choice horizontal showcase list */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block mb-3">Popular Inorganic & Organic Showcases</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {popularChemicals.slice(0, 6).map(chem => (
                  <button
                    key={chem.id}
                    onClick={() => { setSelectedChemical(chem); setSearchQuery(chem.name); }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${selectedChemical.name === chem.name ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300 shadow-xs' : 'border-slate-800 hover:border-slate-700 hover:bg-[#0A0B0E]'}`}
                  >
                    <h5 className="text-xs font-bold truncate text-slate-200">{chem.name}</h5>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">{chem.formula}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs font-medium flex gap-3 select-text">
                <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold">Chemical Profiling Issue</h4>
                  <p className="mt-0.5 opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* Dynamic details dashboard layout */}
            {selectedChemical && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-text">
                
                {/* 3D Simulation canvas viewport block */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="h-[360px] md:h-[420px]">
                    <MoleculeCanvas
                      key={selectedChemical.id} // Re-mount when selected chemical resets
                      smiles={selectedChemical.smiles}
                      formula={selectedChemical.formula}
                      chemicalName={selectedChemical.name}
                      presetAtoms={selectedChemical.atoms as any}
                      presetBonds={selectedChemical.bonds as any}
                    />
                  </div>

                  {/* Summary chemical description card */}
                  <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <span className="inline-flex items-center gap-1 bg-[#0A0B0E] border border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 select-none">
                      <Activity size={10} className="text-slate-500" /> Scientific Profile Descriptor
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium select-text">
                      {selectedChemical.description}
                    </p>

                    {/* Characteristics block */}
                    {selectedChemical.characteristics && selectedChemical.characteristics.length > 0 && (
                      <div className="border-t border-slate-800 pt-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Structure Characteristics</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {selectedChemical.characteristics.map((c, i) => (
                            <div key={i} className="flex gap-2 items-center bg-[#0A0B0E]/60 p-2 rounded-lg border border-slate-800">
                              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0" />
                              <p className="text-slate-300 font-sans font-medium">{c}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right hand details dashboard list (properties, safety GHS, fire diamond) */}
                <div className="space-y-6">
                  
                  {/* IUPAC nomenclature, formula, and standard properties cards */}
                  <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 font-sans">
                    <div className="border-b border-slate-800/60 pb-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Standard Identity</h4>
                      <h3 className="text-lg font-serif font-semibold text-cyan-400 tracking-tight mt-2 select-all">{selectedChemical.name}</h3>
                      <p className="text-xs text-slate-400 font-mono italic mt-1 select-all">IUPAC Name: {selectedChemical.iupacName || "Pending data lookup"}</p>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                        <span className="text-slate-400 font-sans font-medium">Atomic Formula</span>
                        <span className="font-bold text-cyan-400 bg-[#0A0B0E] border border-slate-800 px-1.5 py-0.5 rounded" dangerouslySetInnerHTML={{ __html: formatFormulaSubscripts(selectedChemical.formula) }} />
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                        <span className="text-slate-400 font-sans font-medium">Molecular Weight</span>
                        <span className="font-bold text-slate-200 font-mono bg-[#0A0B0E] p-1 px-1.5 border border-slate-800 rounded">{selectedChemical.molarMass}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                        <span className="text-slate-400 font-sans font-medium">Appearance</span>
                        <span className="font-semibold text-slate-300 text-right truncate max-w-[170px]" title={selectedChemical.appearance}>{selectedChemical.appearance}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                        <span className="text-slate-400 font-sans font-medium">Odor Profile</span>
                        <span className="font-medium text-slate-300 text-right truncate max-w-[170px]" title={selectedChemical.odor}>{selectedChemical.odor}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                        <span className="text-slate-400 font-sans font-medium">Physical Density</span>
                        <span className="font-bold text-slate-200 text-right">{selectedChemical.density}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                        <span className="text-slate-400 font-sans font-medium">Melting Point</span>
                        <span className="font-medium text-slate-200 text-right">{selectedChemical.meltingPoint}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 pb-1">
                        <span className="text-slate-400 font-sans font-medium">Boiling Point</span>
                        <span className="font-medium text-slate-200 text-right">{selectedChemical.boilingPoint}</span>
                      </div>
                    </div>
                  </div>

                  {/* Safety & NFPA Fire Diamond panel */}
                  <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-slate-550 uppercase tracking-widest border-b border-slate-850 pb-2 mb-3">Safety & NFPA Indicators</h4>
                    
                    <div className="flex bg-[#0A0B0E]/60 p-4 rounded-xl border border-slate-850 items-center justify-between gap-4">
                      {selectedChemical.nfpa ? (
                        <div className="shrink-0">
                          <NfpanDiamondSvg
                            health={selectedChemical.nfpa.health}
                            flammability={selectedChemical.nfpa.flammability}
                            instability={selectedChemical.nfpa.instability}
                            special={selectedChemical.nfpa.special}
                          />
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-505 italic select-none">NFPA data unavailable</div>
                      )}

                      <div className="text-xs flex-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-sans">NFPA 704 Standard</span>
                        <ul className="space-y-1 font-sans font-semibold leading-normal text-slate-300">
                          <li>Health Rating: <span className="font-mono text-slate-205">{selectedChemical.nfpa?.health ?? 0}</span>/4</li>
                          <li>Flammability: <span className="font-mono text-slate-205">{selectedChemical.nfpa?.flammability ?? 0}</span>/4</li>
                          <li>Instability: <span className="font-mono text-slate-205">{selectedChemical.nfpa?.instability ?? 0}</span>/4</li>
                        </ul>
                      </div>
                    </div>

                    {/* GHS Pictograms cards list */}
                    {selectedChemical.ghsPictograms && selectedChemical.ghsPictograms.length > 0 && (
                      <div className="border-t border-slate-800/65 pt-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-sans">GHS Pictogram Alerts</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedChemical.ghsPictograms.map((pic, i) => (
                            <GhsCautionCard key={i} category={pic} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risks listings statements */}
                    <div className="border-t border-slate-800/65 pt-4 text-xs font-medium">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-sans">Standard Hazard Statements</span>
                      <div className="space-y-1 bg-rose-950/20 p-3 rounded-lg border border-rose-900/40">
                        {selectedChemical.hazards.map((haz, i) => (
                          <p key={i} className="text-slate-300 pl-2 border-l-2 border-rose-505 leading-normal font-sans font-medium">{haz}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary applications / industrial uses card */}
                  <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3">Industrial & Practical Uses</h4>
                    <div className="space-y-2 mt-2 flex flex-col gap-1.5 text-xs text-slate-300 font-sans font-medium">
                      {selectedChemical.uses.map((use, i) => (
                        <div key={i} className="flex gap-2 items-start bg-[#0A0B0E]/60 p-2.5 rounded-lg border border-slate-800">
                          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0 mt-1.5" />
                          <p className="leading-relaxed text-slate-300 font-medium">{use}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {/* TAB WORKSPACE 2: Elements Periodic Table Grid explorer */}
        {activeTab === 'periodic' && (
          <PeriodicTable onSearchElement={handlePeriodicElementSearch} />
        )}

        {/* TAB WORKSPACE 3: AI Reaction equations stoichiometry solver */}
        {activeTab === 'reaction' && (
          <ReactionPredictorTab />
        )}

        {/* TAB WORKSPACE 4: AI Chemist conversational academic helper */}
        {activeTab === 'chemist' && (
          <AIChemistTab />
        )}

        {/* TAB WORKSPACE 6: Gamified Chemistry Quiz Arena */}
        {activeTab === 'quiz' && (
          <QuizArenaTab />
        )}

        {/* TAB WORKSPACE 7: Top Scholars Leaderboard / Rankings */}
        {activeTab === 'leaderboard' && (
          <LeaderboardTab />
        )}

        {/* TAB WORKSPACE 5: About, Documentation and feedback page */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-text leading-normal">
            
            {/* Project Overview & Info block split */}
            <div className="lg:col-span-2 bg-[#111318] border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-955/20 border border-cyan-900/50 rounded-full mb-1">
                Project Description & Innovation
              </span>
              
              <h2 className="text-xl font-serif font-black tracking-tight text-white">About CHEMIZIC</h2>
              
              <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                <strong className="text-white font-semibold">CHEMIZIC</strong> is an advanced visual and cognitive biochemistry database platform developed to support secondary students, scientists, laboratory engineers, and academic researchers in exploring the world of chemical compounds through an intelligent and interactive ecosystem.
              </p>

              <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                The platform integrates real-time chemical compound registries from the <strong className="text-white font-semibold">PubChem REST Database API</strong> provided by the National Library of Medicine, enabling users to access authentic molecular structures, compound characteristics, and scientific data with precision and efficiency. By combining modern Artificial Intelligence techniques with data-structure-driven architecture, CHEMIZIC delivers dynamic visual mapping of chemical properties on demand, creating a smarter and more intuitive learning and research environment.
              </p>

              <div className="bg-cyan-950/10 border border-cyan-900/30 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-sans font-medium">
                Designed and conceptualized by first-year Computer Science & Engineering students of{' '}
                <a 
                  href="https://share.google/M7wIMYupNAiMfZx2e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 font-semibold hover:underline underline-offset-2 decoration-cyan-500/50"
                >
                  Narula Institute of Technology
                </a>
                , this project reflects innovation, technical creativity, and interdisciplinary application of computational science in chemistry.
              </div>

              <div className="border-t border-slate-850 pt-5 space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 pb-2">
                  <GraduationCap size={15} /> Development Team
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Prantik Das',
                    'Ishita Parvin',
                    'Soumodip Khalko',
                    'Priyajeet Ghosh'
                  ].map((member) => (
                    <div key={member} className="flex items-center gap-3 bg-[#0A0B0E]/60 p-3 rounded-lg border border-slate-850 hover:border-cyan-500/30 transition-all">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <div>
                        <p className="text-xs font-bold text-white font-mono">{member}</p>
                        <p className="text-[10px] text-slate-500 font-sans font-medium">CSE Student • Developer</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-850 pt-5">
                <p className="text-xs text-slate-400 leading-relaxed italic font-sans font-medium">
                  CHEMIZIC represents a fusion of scientific intelligence, educational accessibility, and AI-powered visualization — aiming to simplify complex biochemical data for the next generation of learners and researchers.
                </p>
              </div>
            </div>

            {/* User Feedback & Contact panel sidebar block */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">Feedback & Lab Support</h3>
              
              {feedbackSent ? (
                <div className="bg-emerald-950/20 border border-emerald-900/50 text-emerald-300 rounded-xl p-4 text-xs font-medium text-center space-y-2 animate-bounce-short">
                  <CheckCircle2 size={24} className="text-emerald-400 mx-auto" />
                  <h4 className="font-bold">Transmission Succeeded</h4>
                  <p className="opacity-90">Your educational suggestions have been loaded to the developer repository.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Submit chemical additions, periodic data corrections, or general application suggestions directly.
                  </p>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={feedback.name}
                      onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                      placeholder="e.g. Prof. Arfwedson"
                      className="w-full text-xs bg-[#0A0B0E] px-3 py-2 border border-slate-800 rounded focus:border-cyan-500 focus:bg-[#0A0B0E] outline-none font-medium text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={feedback.email}
                      onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                      placeholder="e.g. teacher@university.edu"
                      className="w-full text-xs bg-[#0A0B0E] px-3 py-2 border border-slate-800 rounded focus:border-cyan-500 focus:bg-[#0A0B0E] outline-none font-medium text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Inquiry / Suggestion</label>
                    <textarea
                      required
                      rows={3}
                      value={feedback.message}
                      onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                      placeholder="Request custom chemical addition, report data variance..."
                      className="w-full text-xs bg-[#0A0B0E] px-3 py-2 border border-slate-800 rounded focus:border-cyan-500 focus:bg-[#0A0B0E] outline-none font-medium text-slate-200 resize-none leading-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold text-xs rounded transition-colors cursor-pointer text-center"
                  >
                    Transmit Feedback
                  </button>
                </form>
              )}

              {/* Static support tags */}
              <div className="border-t border-slate-800 pt-4 space-y-2 select-text text-slate-400 text-xs font-sans">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Mail size={12} className="text-slate-500 shrink-0" />
                  <span>dasprantik413@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium font-sans">
                  <MapPin size={12} className="text-slate-500 shrink-0" />
                  <span>
                    <a 
                      href="https://share.google/M7wIMYupNAiMfZx2e"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 text-slate-300 transition-colors underline decoration-dotted decoration-cyan-500/50 underline-offset-2"
                    >
                      Narula Institute of Technology
                    </a>
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* FOOTER: Standard humble scientific credit label */}
      <footer className="relative z-30 border-t border-cyan-500/10 bg-black/40 py-8 mt-16 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10.5px] text-slate-400">
          <div>
            <p className="font-mono text-cyan-400 uppercase tracking-widest font-bold">CHEMIZIC DATABASE SYSTEM — UNIVERSITY LAB CO-OP</p>
            <p className="mt-1 opacity-70 font-mono text-[9.5px]">Integrating real-time molecular visualization nodes and cognitive AI reasoning engines.</p>
          </div>
          <div className="text-right font-mono text-[9.5px] space-y-1">
            <p className="opacity-70">Licensed under <span className="text-cyan-300 font-bold">Prantik das</span>. IG: <a href="https://instagram.com/yours_pranz" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors">@yours_pranz</a></p>
            <p className="opacity-50">Open Academic Resource &copy; 2026.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

// NFPA 704 standard SVG diamond drawer. Highly precise coordinates layout.
function NfpanDiamondSvg({ health = 0, flammability = 0, instability = 0, special = '' }: { health: number; flammability: number; instability: number; special?: string }) {
  return (
    <svg viewBox="0 0 120 120" className="w-24 h-24 select-none filter drop-shadow font-mono">
      {/* Blue Diamond (Health) - Left quadrant */}
      <polygon points="60,60 30,30 0,60 30,90" fill="#2563eb" stroke="#1e293b" strokeWidth="1.5" />
      <text x="30" y="66" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">{health}</text>

      {/* Red Diamond (Flammability) - Top quadrant */}
      <polygon points="60,60 30,30 60,0 90,30" fill="#dc2626" stroke="#1e293b" strokeWidth="1.5" />
      <text x="60" y="36" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">{flammability}</text>

      {/* Yellow Diamond (Instability) - Right quadrant */}
      <polygon points="60,60 90,30 120,60 90,90" fill="#eab308" stroke="#1e293b" strokeWidth="1.5" />
      <text x="90" y="66" fill="#0f172a" fontSize="18" fontWeight="bold" textAnchor="middle">{instability}</text>

      {/* White Diamond (Special Hazards) - Bottom quadrant */}
      <polygon points="60,60 30,90 60,120 90,90" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
      <text x="60" y="96" fill="#030712" fontSize="13" fontWeight="black" textAnchor="middle">{special || 'W'}</text>
    </svg>
  );
}

// Compact warning card for standard GHS Pictograms (caution red diamond design)
function GhsCautionCard({ category }: { category: string; key?: any }) {
  const getLabelInfo = (cat: string) => {
    switch (cat.trim().toLowerCase()) {
      case 'flammable':
        return { text: 'Flammable gas/liquid', icon: <Flame size={14} className="text-red-650" /> };
      case 'toxic-hazard':
        return { text: 'Acute Toxicity', icon: <AlertOctagon size={14} className="text-red-650" /> };
      case 'corrosive':
        return { text: 'Corrosive burn substance', icon: <AlertTriangle size={14} className="text-red-650 animate-pulse" /> };
      case 'explosive':
        return { text: 'Explosion Danger', icon: <span className="text-[10px] text-red-700 font-bold">BOMB</span> };
      case 'environmental':
        return { text: 'Environmental Hazard', icon: <span className="text-[10px] text-red-700 font-bold">ECO</span> };
      case 'danger-health':
        return { text: 'Severe Health Hazard', icon: <AlertOctagon size={14} className="text-red-700" /> };
      case 'gas-cylinder':
        return { text: 'Compressed Gas', icon: <span className="text-[10px] text-red-700 font-bold">CYL</span> };
      default:
        return { text: 'Warning hazard', icon: <AlertTriangle size={14} className="text-red-650" /> };
    }
  };

  const info = getLabelInfo(category);

  return (
    <div className="flex items-center gap-2 border border-red-200/80 bg-red-50/20 px-2 py-1.5 rounded-lg shrink-0 select-none">
      {/* rotated square shape */}
      <div className="w-6 h-6 border-2 border-red-600 bg-white rotate-45 flex items-center justify-center shrink-0">
        <div className="-rotate-45">
          {info.icon}
        </div>
      </div>
      <span className="text-[10px] font-bold text-red-800 tracking-tight leading-none">{info.text}</span>
    </div>
  );
}

// Formula subscripts converter (e.g. converting H2O to H<sub>2</sub>O)
function formatFormulaSubscripts(eq: string) {
  if (!eq) return '';
  return eq.replace(/([A-Za-z])(\d+)/g, '$1<sub>$2</sub>');
}
