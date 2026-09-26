/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { 
  Flame, Award, Calendar, Clock, CheckCircle2, 
  ArrowLeft, Sparkles, Zap, Shield, Filter, Search,
  Download, Activity, BarChart3, FlaskConical, Compass,
  Scale, Beaker, GraduationCap, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface DailyStreakActivityReportProps {
  onBackToAnalytics: () => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const DailyStreakActivityReport: React.FC<DailyStreakActivityReportProps> = ({
  onBackToAnalytics,
  onNavigateToTab
}) => {
  const { 
    currentUser, 
    studentProfile, 
    dailyLogins, 
    featureLogs, 
    claimDailyLoginBonus 
  } = useAuthAndQuiz();

  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [claimStatusMessage, setClaimStatusMessage] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const streakDays = studentProfile.streak || 5;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = dailyLogins.find(r => r.date === todayStr);
  const isTodayClaimed = todayRecord?.bonusClaimed;

  const handleClaimBonus = () => {
    setIsClaiming(true);
    const result = claimDailyLoginBonus();
    setClaimStatusMessage(result.message);
    setTimeout(() => setIsClaiming(false), 500);
    setTimeout(() => setClaimStatusMessage(null), 5000);
  };

  // Generate 30-day attendance calendar array
  const last30Days = useMemo(() => {
    const list = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const found = dailyLogins.find(r => r.date === dStr);
      list.push({
        date: dStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        active: Boolean(found),
        questions: found?.questionsSolved || 0,
        features: found?.featuresUsed || [],
        minutes: found?.sessionMinutes || 0
      });
    }
    return list;
  }, [dailyLogins]);

  // Aggregate stats per recorded feature
  const featureBreakdown = useMemo(() => {
    const registry = [
      { id: 'adaptive_practice', name: 'Adaptive Learning Engine', tab: 'student_analytics', icon: Zap, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
      { id: 'quiz', name: 'Quiz Arena Challenges', tab: 'quiz', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
      { id: 'reaction', name: 'AI Reaction Predictor', tab: 'reaction', icon: Scale, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
      { id: 'phmeter', name: 'pH Meter & Indicator Lab', tab: 'phmeter', icon: Beaker, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
      { id: 'explorer', name: '3D Molecule Explorer', tab: 'explorer', icon: FlaskConical, color: 'text-cyan-300 bg-cyan-500/10 border-cyan-400/30' },
      { id: 'periodic', name: 'Interactive Periodic Table', tab: 'periodic', icon: Compass, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
      { id: 'chemist', name: 'AI Chemist Tutor', tab: 'chemist', icon: GraduationCap, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
      { id: 'analytics', name: 'Student Analytics Hub', tab: 'student_analytics', icon: BarChart3, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' }
    ];

    return registry.map(reg => {
      const logs = featureLogs.filter(l => l.feature_id === reg.id);
      const totalXp = logs.reduce((sum, l) => sum + l.xpEarned, 0);
      const lastUsed = logs.length > 0 ? logs[0].timestamp : null;
      return {
        ...reg,
        count: logs.length,
        totalXp,
        lastUsed
      };
    });
  }, [featureLogs]);

  // Filtered activity logs
  const filteredLogs = useMemo(() => {
    return featureLogs.filter(log => {
      const matchesFeature = selectedFeatureFilter === 'all' || log.feature_id === selectedFeatureFilter;
      const matchesSearch = !searchQuery || 
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.feature_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFeature && matchesSearch;
    });
  }, [featureLogs, selectedFeatureFilter, searchQuery]);

  const handleExportReport = () => {
    const reportData = {
      student_id: studentProfile.student_id,
      name: studentProfile.name,
      streak_days: streakDays,
      generated_at: new Date().toISOString(),
      daily_logins: dailyLogins,
      features_summary: featureBreakdown.map(f => ({ name: f.name, interactions: f.count, xp: f.totalXp })),
      recent_activity: featureLogs.slice(0, 50)
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chemizic-activity-report-${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 select-text"
    >
      {/* NAVIGATION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-950/20 via-slate-900/60 to-purple-950/20 border border-orange-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(249,115,22,0.06)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToAnalytics}
            title="Return to Student Analytics"
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-orange-400 border border-slate-700/60 transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Daily Login Report, Streak & Feature Activity
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                Activity Ledger
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive attendance records, learning streak longevity, and recorded feature utilization for <span className="text-orange-300 font-semibold">{currentUser?.username || studentProfile.name}</span>.
            </p>
          </div>
        </div>
      </div>

      {/* CLAIM STATUS ALERT BANNER */}
      {claimStatusMessage && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        >
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{claimStatusMessage}</span>
        </motion.div>
      )}

      {/* 1. STREAK STATUS & CHECK-IN HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Active Streak Hero */}
        <div className="bg-[#0e1117] border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.06)] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-orange-400 font-bold tracking-wider flex items-center gap-1.5">
                <Flame size={16} className="text-orange-500 fill-orange-500 animate-pulse" />
                Active Study Streak
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Top 5% Cohort
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-5xl font-black text-white font-mono">{streakDays}</span>
              <span className="text-lg font-bold text-orange-400 font-mono">CONSECUTIVE DAYS</span>
            </div>

            <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
              You are maintaining a strong chemical mastery routine. Daily consistency boosts recall of organic synthesis and equations by over 300%.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Longest Streak: <strong className="text-white font-mono">14 days</strong></span>
            <span className="text-slate-400">Streak Shields: <strong className="text-cyan-400 font-mono">2 Active</strong></span>
          </div>
        </div>

        {/* Card 2: Daily Check-In & Bonus Action */}
        <div className="bg-[#0e1117] border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
                <Calendar size={16} /> Daily Attendance Check-In
              </span>
              <span className="text-[11px] font-mono text-slate-400">{todayStr}</span>
            </div>

            <h3 className="text-lg font-bold text-white mt-3">
              {isTodayClaimed ? 'Today’s Login Recorded ✓' : 'Record Today’s Login'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {isTodayClaimed 
                ? 'Your daily attendance has been verified. Complete more practice questions to earn additional mastery XP.' 
                : 'Click below to verify today’s study session and claim your daily streak XP bonus!'}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleClaimBonus}
              disabled={isClaiming || isTodayClaimed}
              className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isTodayClaimed
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-orange-500/20 hover:scale-[1.02]'
              }`}
            >
              {isTodayClaimed ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Attendance Logged & Bonus Claimed
                </>
              ) : (
                <>
                  <Sparkles size={16} className="fill-black" />
                  Claim Today's +{50 + (streakDays * 10)} XP Bonus
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 3: Milestone & Shield Protection */}
        <div className="bg-[#0e1117] border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider flex items-center gap-1.5">
                <Shield size={16} /> Streak Milestones
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Next: Day 7
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Day 3: Bronze Flame</span>
                <span className="text-emerald-400 font-mono font-bold">UNLOCKED ✓</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-1.5 rounded-full w-full" />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-300 font-medium">Day 7: Silver Spark (+200 XP)</span>
                <span className="text-purple-300 font-mono font-bold">{Math.min(7, streakDays)} / 7 Days</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, (streakDays / 7) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-medium">Day 14: Golden Chemist Core</span>
                <span className="text-slate-500 font-mono font-bold">{Math.min(14, streakDays)} / 14 Days</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Missed days are auto-protected by active shields.</span>
          </div>
        </div>

      </div>

      {/* 2. 30-DAY ATTENDANCE & ACTIVITY CALENDAR HEATMAP */}
      <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              30-Day Activity & Attendance Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily frequency of logins, practice question resolutions, and laboratory interactions over the past month.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Less Active</span>
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 block" />
            <span className="w-3 h-3 rounded bg-orange-950 border border-orange-800 block" />
            <span className="w-3 h-3 rounded bg-orange-700 border border-orange-600 block" />
            <span className="w-3 h-3 rounded bg-orange-500 border border-orange-400 block" />
            <span>Highly Active</span>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 pt-2">
          {last30Days.map((item, idx) => {
            const hasActivity = item.active;
            const qCount = item.questions;
            const bgClass = !hasActivity
              ? 'bg-slate-900/60 border-slate-800 text-slate-600 hover:border-slate-700'
              : qCount >= 10
              ? 'bg-orange-500 text-black border-orange-400 font-bold shadow-[0_0_10px_rgba(249,115,22,0.4)]'
              : qCount >= 5
              ? 'bg-orange-700 text-white border-orange-600'
              : 'bg-orange-950 text-orange-200 border-orange-800';

            return (
              <div 
                key={idx}
                title={`${item.date}: ${hasActivity ? `${qCount} questions, ${item.minutes} mins` : 'No recorded activity'}`}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-default select-none text-center ${bgClass}`}
              >
                <span className="text-[9px] font-mono uppercase opacity-75">{item.dayName}</span>
                <span className="text-sm font-mono font-bold mt-0.5">{item.dayNum}</span>
                <span className="text-[8px] font-mono mt-0.5 opacity-90">
                  {hasActivity ? `${qCount}q` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CHEMIZIC RECORDED FEATURES BREAKDOWN */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Zap size={16} className="text-cyan-400" />
            CHEMIZIC Platform Features Utilization (Recorded Live)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every feature you interact with is recorded in your learning profile to shape adaptive recommendations and track competencies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureBreakdown.map(feat => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-[#0e1117] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 relative overflow-hidden transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${feat.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                      +{feat.totalXp} XP
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                    {feat.name}
                  </h4>
                  
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-white font-mono">{feat.count}</span>
                    <span className="text-xs text-slate-400 font-sans">interactions recorded</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {feat.lastUsed ? 'Active Recently' : 'Not logged yet'}
                  </span>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab(feat.tab)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Open <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RECORDED ACTIVITY LOGS FEED */}
      <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock size={16} className="text-orange-400" />
              Recorded Feature Activity Ledger ({filteredLogs.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of academic exercises, simulations, experiments, and quizzes recorded in CHEMIZIC.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/40 border border-slate-800 rounded-xl px-3 pl-8 py-1.5 text-xs text-slate-200 outline-none focus:border-cyan-500 w-44 font-mono"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-500" />
            </div>

            {/* Feature Filter Dropdown */}
            <select
              value={selectedFeatureFilter}
              onChange={(e) => setSelectedFeatureFilter(e.target.value)}
              className="bg-black/40 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-cyan-500 font-mono"
            >
              <option value="all">All Features</option>
              <option value="adaptive_practice">Adaptive Practice</option>
              <option value="quiz">Quiz Arena</option>
              <option value="reaction">Reaction Predictor</option>
              <option value="phmeter">pH Meter Lab</option>
              <option value="explorer">Molecule Explorer</option>
              <option value="periodic">Periodic Table</option>
              <option value="chemist">AI Chemist Tutor</option>
              <option value="analytics">Analytics & Streak</option>
            </select>
          </div>
        </div>

        {/* Logs Table / List */}
        <div className="divide-y divide-slate-800/80 max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-2">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs font-mono">
              No matching activity records found. Perform experiments or answer questions to generate logs!
            </div>
          ) : (
            filteredLogs.map(log => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dateStr = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

              return (
                <div 
                  key={log.id} 
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
                      <Zap size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{log.feature_name}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-800 text-slate-400 border border-slate-700/60">
                          {log.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 font-sans leading-relaxed">
                        {log.action}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1 shrink-0 pl-11 sm:pl-0">
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      +{log.xpEarned} XP
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {dateStr} • {timeStr}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};
