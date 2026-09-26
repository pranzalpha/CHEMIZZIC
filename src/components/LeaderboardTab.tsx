/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { WorldwideRankingItem } from '../types';
import { 
  Trophy, Award, Sparkles, Star, Users, Zap, Calendar, 
  Search, Globe, Building2, FlaskConical, Filter, ChevronRight, 
  BookOpen, ExternalLink, Activity, Flame, Shield, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LeaderboardTab: React.FC = () => {
  const { leaderboard, currentUser } = useAuthAndQuiz();
  
  // Category Tab: 'scholars' | 'chemicals' | 'laureates' | 'institutions'
  const [activeCategory, setActiveCategory] = useState<'scholars' | 'chemicals' | 'laureates' | 'institutions'>('scholars');
  
  // Worldwide search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected Country Filter for Scholars
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  
  // Remote / Web rankings data state
  const [remoteRankings, setRemoteRankings] = useState<WorldwideRankingItem[]>([]);
  const [loadingWeb, setLoadingWeb] = useState<boolean>(false);

  // Deduplicate leaderboard entries by username, keeping highest score
  const uniqueLeaderboard = useMemo(() => {
    const seen = new Set<string>();
    const unique: typeof leaderboard = [];
    for (const entry of leaderboard) {
      if (!entry.username) continue;
      const lowerName = entry.username.trim().toLowerCase();
      if (!seen.has(lowerName)) {
        seen.add(lowerName);
        unique.push(entry);
      }
    }
    return unique;
  }, [leaderboard]);

  // Fetch worldwide search results from backend
  const fetchWorldwideData = async (cat: string, q: string) => {
    setLoadingWeb(true);
    try {
      const res = await fetch(`/api/rankings/worldwide-search?category=${cat === 'scholars' ? 'scholar' : cat === 'chemicals' ? 'chemical' : cat === 'laureates' ? 'laureate' : 'institution'}&q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setRemoteRankings(data.results || []);
      }
    } catch (err) {
      console.warn("Could not load remote rankings, relying on client data:", err);
    } finally {
      setLoadingWeb(false);
    }
  };

  useEffect(() => {
    fetchWorldwideData(activeCategory, searchQuery);
  }, [activeCategory, searchQuery]);

  // Filtered scholars list
  const filteredScholars = useMemo(() => {
    return uniqueLeaderboard.filter(entry => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!entry.username.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [uniqueLeaderboard, searchQuery]);

  // Badging Standards
  const ACHIEVEMENTS_SPECS = [
    { title: 'First Breakthrough', description: 'Complete your first chemistry quiz examination in the arena.', icon: '🎯', criteria: '1 quiz attempt' },
    { title: 'Organic Master', description: 'Answer at least 4 questions correctly in an Organic Chemistry exam.', icon: '🌿', criteria: 'Organic score >= 40' },
    { title: 'Acid Master', description: 'Answer at least 4 questions correctly in an Inorganic Chemistry exam.', icon: '⚗', criteria: 'Inorganic score >= 40' },
    { title: 'Physical Champion', description: 'Answer at least 4 questions correctly in a Physical Chemistry exam.', icon: '⚡', criteria: 'Physical score >= 40' },
    { title: 'Speed Demon', description: 'Secure a high score in Timed countdown mode.', icon: '⏱', criteria: 'Fast reaction answers' },
    { title: 'Lab Scientist', description: 'Reach Experience Level 5 or higher.', icon: '🔬', criteria: 'Level >= 5 reached' },
    { title: 'Molecular Master', description: 'Reach Experience Level 10 or higher.', icon: '🌌', criteria: 'Level >= 10 reached' },
  ];

  return (
    <div className="space-y-6 select-text font-sans">
      
      {/* 1. TOP HEADER & FLUENTIC WORLDWIDE SEARCH BAR */}
      <div className="bg-gradient-to-r from-yellow-950/20 via-[#111318] to-cyan-950/20 border border-yellow-500/20 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-400 animate-pulse" size={22} />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Global Chemistry Rankings & Worldwide Knowledge Index
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 uppercase">
                Web Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Fluid, dynamic leaderboard tracking worldwide scholars, Nobel Prize chemistry breakthroughs, global chemical production volumes, and premier research institutions taking data from across the internet.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-yellow-400/90 bg-black/40 border border-yellow-500/20 px-3 py-1.5 rounded-xl shrink-0">
            <Globe size={13} className="text-cyan-400 animate-spin-slow" />
            <span>International Chemistry League Active</span>
          </div>
        </div>

        {/* Fluentic Category Tabs & Global Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Tab Categories */}
          <div className="flex p-1 bg-black/50 border border-slate-800 rounded-xl font-mono text-xs overflow-x-auto scrollbar-none">
            {[
              { id: 'scholars', label: 'Worldwide Scholars 🎓', icon: Users },
              { id: 'chemicals', label: 'Global Chemical Rankings ⚗️', icon: FlaskConical },
              { id: 'laureates', label: 'Nobel Laureates 🏅', icon: Award },
              { id: 'institutions', label: 'Top Universities 🏛️', icon: Building2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id as any);
                    setSearchQuery('');
                  }}
                  className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-bold shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Worldwide Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder={`Worldwide search ${activeCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#0A0B0E] pl-9 pr-3 py-2.5 border border-slate-800 focus:border-yellow-400 rounded-xl outline-none font-mono text-white placeholder:text-slate-600"
            />
          </div>

        </div>
      </div>

      {/* 2. MAIN WORKSPACE GRID: RANKINGS TABLE & SIDEBAR ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER COLUMNS: DYNAMIC RANKINGS DISPLAY */}
        <div className="lg:col-span-2 space-y-6">

          {/* ========================================================================= */}
          {/* CATEGORY 1: WORLDWIDE SCHOLARS LEADERBOARD */}
          {/* ========================================================================= */}
          {activeCategory === 'scholars' && (
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                <span className="font-mono text-xs uppercase font-bold text-yellow-400 tracking-wider flex items-center gap-1.5">
                  <Trophy size={14} /> International Chemistry Scholars Leaderboard
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Updated Live • {filteredScholars.length} Active Scholars
                </span>
              </div>

              {/* Podium visualization of the top 3 */}
              <div className="grid grid-cols-3 gap-3 text-center select-none font-mono pt-2">
                {/* Rank 2 (Left) */}
                {filteredScholars[1] && (
                  <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between items-center relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-400 text-black text-[9px] font-bold flex items-center justify-center">2</span>
                    <div className="pt-2">
                      <p className="text-xs font-bold text-slate-100 truncate w-full px-1">{filteredScholars[1].username}</p>
                      <p className="text-cyan-400 text-[11px] font-bold mt-1">{filteredScholars[1].score} pts</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">Lv. {filteredScholars[1].level}</p>
                    </div>
                  </div>
                )}

                {/* Rank 1 (Center) */}
                {filteredScholars[0] && (
                  <div className="bg-yellow-950/20 border border-yellow-500/40 rounded-xl p-4 flex flex-col justify-between items-center relative transform scale-105 shadow-[0_0_25px_rgba(234,179,8,0.15)]">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-yellow-400 text-black text-[11px] font-black flex items-center justify-center animate-bounce-short">👑</span>
                    <div className="pt-2">
                      <p className="text-xs font-black text-yellow-300 truncate w-full px-1 uppercase tracking-wider">{filteredScholars[0].username}</p>
                      <p className="text-cyan-300 text-sm font-black mt-1">{filteredScholars[0].score} pts</p>
                      <p className="text-[9.5px] text-slate-400 mt-0.5 font-bold">Lv. {filteredScholars[0].level} • Grandmaster</p>
                    </div>
                  </div>
                )}

                {/* Rank 3 (Right) */}
                {filteredScholars[2] && (
                  <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between items-center relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">3</span>
                    <div className="pt-2">
                      <p className="text-xs font-bold text-slate-200 truncate w-full px-1">{filteredScholars[2].username}</p>
                      <p className="text-cyan-400 text-[11px] font-bold mt-1">{filteredScholars[2].score} pts</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">Lv. {filteredScholars[2].level}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scholars Table */}
              <div className="space-y-2 pt-2 font-mono">
                {filteredScholars.map((entry, idx) => {
                  const isCurrentUser = currentUser && entry.userId === currentUser.id;
                  
                  return (
                    <div 
                      key={entry.userId}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isCurrentUser 
                          ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                          : 'bg-black/30 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className={`w-6 text-center text-xs font-black ${
                          idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-500' : 'text-slate-500'
                        }`}>
                          #{idx + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold truncate ${isCurrentUser ? 'text-cyan-300' : 'text-white'}`}>
                              {entry.username}
                            </span>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.2 text-[8px] bg-cyan-400/20 text-cyan-300 uppercase tracking-widest font-black rounded select-none">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[9.5px] text-slate-500 mt-0.5">
                            <span>Lv. {entry.level}</span>
                            <span className="h-2 w-px bg-slate-800" />
                            <span>{entry.quizAttempts} Quizzes Solved</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-cyan-300">{entry.score} pts</span>
                        <div className="flex gap-0.5 mt-0.5 justify-end">
                          {entry.badges?.slice(0, 3).map((badge, bIdx) => (
                            <span key={bIdx} className="text-[9px]" title={badge}>🏆</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* CATEGORIES 2, 3, 4: WORLDWIDE WEB GROUNDED RANKINGS */}
          {/* ========================================================================= */}
          {activeCategory !== 'scholars' && (
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-4">
              
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 font-mono">
                <span className="text-xs uppercase font-bold text-yellow-400 tracking-wider flex items-center gap-1.5">
                  <Globe size={14} className="text-cyan-400" />
                  {activeCategory === 'chemicals' && 'Top Chemicals Produced Worldwide (Volume & Economics)'}
                  {activeCategory === 'laureates' && 'Nobel Prize in Chemistry Discoveries (Hall of Fame)'}
                  {activeCategory === 'institutions' && 'Premier Chemistry Universities & Research Centers'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {remoteRankings.length} Records Found
                </span>
              </div>

              {loadingWeb && (
                <div className="p-8 text-center text-xs font-mono text-cyan-300 animate-pulse">
                  Fetching verified worldwide data from chemistry knowledge archives...
                </div>
              )}

              {/* Cards List */}
              <div className="space-y-3 font-mono">
                {remoteRankings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-black/40 border border-slate-800 hover:border-yellow-500/40 transition-all space-y-2 group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-lg bg-yellow-950/40 border border-yellow-500/30 text-yellow-300 flex items-center justify-center text-xs font-black shrink-0">
                          #{item.rank}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white font-sans">{item.name}</h4>
                            {item.countryFlag && (
                              <span className="text-xs">{item.countryFlag}</span>
                            )}
                          </div>
                          <p className="text-[10.5px] text-cyan-300 font-mono mt-0.5">{item.subtitle}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-emerald-400 block">{item.metricValue}</span>
                        <span className="text-[9px] text-slate-500 uppercase">{item.metricLabel}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                      {item.details}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('open-ai-chemist-tutor', {
                            detail: {
                              prompt: `Explain the chemistry significance of ${item.name} (${item.subtitle}): ${item.details}`
                            }
                          }));
                        }}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors cursor-pointer"
                      >
                        <span>Consult AI Tutor</span>
                        <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ACHIEVEMENTS & SCHOLAR CREDENTIALS */}
        <div className="space-y-6">
          
          {/* User Score Summary Card */}
          <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block border-b border-slate-800 pb-2">
              Your Scholar Identity
            </span>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Award size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{currentUser?.username || 'Guest Scholar'}</h4>
                <p className="text-[10px] text-cyan-400 font-bold">
                  {currentUser?.role === 'admin' ? '🛡 Global Administrator' : currentUser?.role === 'teacher' ? '🧑‍🏫 Faculty Instructor' : '🎓 Chemical Scholar'}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Global Score:</span>
                <span className="text-cyan-300 font-bold">{currentUser?.score || 0} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Level:</span>
                <span className="text-purple-300 font-bold">Level {currentUser?.level || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Academic Badges:</span>
                <span className="text-yellow-400 font-bold">{currentUser?.badges?.length || 0} unlocked</span>
              </div>
            </div>
          </div>

          {/* Gamified Achievements Specifications */}
          <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Star className="text-yellow-400" size={16} />
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Academic Badges & Credentials
              </h4>
            </div>

            <div className="space-y-3 font-mono">
              {ACHIEVEMENTS_SPECS.map((ach, idx) => {
                const isUnlocked = currentUser?.badges?.includes(ach.title);
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                      isUnlocked 
                        ? 'bg-yellow-950/20 border-yellow-500/30 text-yellow-200' 
                        : 'bg-black/30 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{ach.icon}</span>
                    <div className="space-y-0.5 text-xs font-sans leading-normal">
                      <div className="flex items-center justify-between">
                        <strong className="text-white font-mono text-[11px]">{ach.title}</strong>
                        {isUnlocked && (
                          <span className="text-[8px] px-1.5 py-0.2 rounded bg-yellow-400 text-black font-bold font-mono uppercase">UNLOCKED</span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-slate-400">{ach.description}</p>
                      <p className="text-[9.5px] text-cyan-400 font-mono">{ach.criteria}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
