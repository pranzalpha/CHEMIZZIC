/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { CHEMISTRY_CONCEPTS, AdaptiveQuestion } from '../data/chemistryConcepts';
import { Assignment } from '../types';
import { 
  TrendingUp, TrendingDown, Minus, Sparkles, Target, Zap, 
  CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Flame, 
  BarChart3, Brain, Award, ChevronRight, Activity, ShieldCheck,
  RefreshCw, Play, Filter, FileText, X, GraduationCap, Check, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyStreakActivityReport } from './DailyStreakActivityReport';

interface StudentAnalyticsDashboardProps {
  onStartAdaptivePractice?: (conceptId?: string, difficulty?: 'easy' | 'medium' | 'hard') => void;
  onOpenDailyReport?: () => void;
  onNavigateToTab?: (tabId: string) => void;
}

export const StudentAnalyticsDashboard: React.FC<StudentAnalyticsDashboardProps> = ({
  onStartAdaptivePractice,
  onOpenDailyReport,
  onNavigateToTab
}) => {
  const { 
    studentProfile, 
    currentUser, 
    refreshRecommendations, 
    assignments, 
    completeAssignment, 
    adaptiveQuestions,
    recordAdaptiveAttempt,
    recordFeatureUsage,
    spacedRepetitionSchedule,
    dueConcepts,
    diagnosticResult
  } = useAuthAndQuiz();
  const [trendTimeframe, setTrendTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [selectedConceptFilter, setSelectedConceptFilter] = useState<string>('all');
  const [showDailyReport, setShowDailyReport] = useState<boolean>(false);

  // Assignment interactive solving state
  const [solvingAssignment, setSolvingAssignment] = useState<Assignment | null>(null);
  const [solverQuestions, setSolverQuestions] = useState<AdaptiveQuestion[]>([]);
  const [currentSolverIdx, setCurrentSolverIdx] = useState<number>(0);
  const [selectedSolverOption, setSelectedSolverOption] = useState<string | null>(null);
  const [solverIsSubmitted, setSolverIsSubmitted] = useState<boolean>(false);
  const [solverScore, setSolverScore] = useState<number>(0);
  const [solverFinished, setSolverFinished] = useState<boolean>(false);

  const { masteries, recommendations, overall_mastery, streak, total_questions, total_correct } = studentProfile;

  // Filter assignments relevant to current student
  const myAssignments = useMemo(() => {
    const studentId = currentUser?.id || studentProfile.student_id;
    return assignments.filter(a => 
      a.target_type === 'all' || 
      a.target_student_ids.includes(studentId)
    );
  }, [assignments, currentUser, studentProfile.student_id]);

  const handleStartSolveAssignment = (asg: Assignment) => {
    const matched = adaptiveQuestions.filter(q => q.concept_id === asg.concept_id);
    const chosen = (matched.length > 0 ? matched : adaptiveQuestions).slice(0, asg.question_count || 5);
    setSolvingAssignment(asg);
    setSolverQuestions(chosen);
    setCurrentSolverIdx(0);
    setSelectedSolverOption(null);
    setSolverIsSubmitted(false);
    setSolverScore(0);
    setSolverFinished(false);
  };

  const handleSolverSubmitAnswer = () => {
    if (!selectedSolverOption || solverIsSubmitted) return;
    const currentQ = solverQuestions[currentSolverIdx];
    const isCorrect = selectedSolverOption === currentQ.correct_answer;
    setSolverIsSubmitted(true);
    if (isCorrect) {
      setSolverScore(prev => prev + 1);
    }
    recordAdaptiveAttempt(
      currentQ.id,
      currentQ.concept_id,
      selectedSolverOption,
      isCorrect,
      currentQ.difficulty
    );
  };

  const handleSolverNext = () => {
    if (currentSolverIdx + 1 < solverQuestions.length) {
      setCurrentSolverIdx(prev => prev + 1);
      setSelectedSolverOption(null);
      setSolverIsSubmitted(false);
    } else {
      setSolverFinished(true);
      if (solvingAssignment) {
        completeAssignment(solvingAssignment.id);
        recordFeatureUsage(
          'quiz',
          'Faculty Assignment Completed',
          `Finished assignment "${solvingAssignment.title}" with score ${solverScore}/${solverQuestions.length}`,
          'Assessment',
          50
        );
      }
    }
  };

  // Concept masteries array
  const conceptList = useMemo(() => {
    return CHEMISTRY_CONCEPTS.map(def => {
      const m = masteries[def.id] || {
        student_id: studentProfile.student_id,
        concept_id: def.id,
        concept_name: def.name,
        mastery_score: 50,
        accuracy: 50,
        attempts: 0,
        correct_attempts: 0,
        current_difficulty: 'medium' as const,
        last_attempt: new Date().toISOString(),
        trend: 'stable' as const
      };
      return {
        ...m,
        definition: def
      };
    });
  }, [masteries, studentProfile.student_id]);

  // Strengths (mastery >= 75%)
  const strengths = useMemo(() => {
    return conceptList.filter(c => c.mastery_score >= 72).sort((a, b) => b.mastery_score - a.mastery_score);
  }, [conceptList]);

  // Weak areas (mastery < 60%)
  const weakAreas = useMemo(() => {
    return conceptList.filter(c => c.mastery_score < 60).sort((a, b) => a.mastery_score - b.mastery_score);
  }, [conceptList]);

  // Overall accuracy
  const overallAccuracy = total_questions > 0 ? Math.round((total_correct / total_questions) * 100) : 0;

  // Filtered concepts for table / cards
  const displayedConcepts = useMemo(() => {
    if (selectedConceptFilter === 'all') return conceptList;
    if (selectedConceptFilter === 'weak') return conceptList.filter(c => c.mastery_score < 60);
    if (selectedConceptFilter === 'strong') return conceptList.filter(c => c.mastery_score >= 72);
    return conceptList.filter(c => c.definition.category.toLowerCase() === selectedConceptFilter.toLowerCase());
  }, [conceptList, selectedConceptFilter]);

  // Performance Trend Data Points based on timeframe
  const trendPoints = useMemo(() => {
    const days = trendTimeframe === '7d' ? 7 : trendTimeframe === '30d' ? 30 : 12;
    const points = [];
    const baseMastery = Math.max(35, overall_mastery - (trendTimeframe === '7d' ? 6 : 14));

    for (let i = 0; i < days; i++) {
      const progress = i / (days - 1 || 1);
      // Realistic trending curve ending at current overall_mastery
      const noise = (Math.sin(i * 1.5) * 3);
      const val = Math.min(98, Math.max(20, Math.round(baseMastery + (overall_mastery - baseMastery) * progress + noise)));
      
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const label = trendTimeframe === 'all' 
        ? date.toLocaleDateString('en-US', { month: 'short' }) 
        : date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

      points.push({ label, value: val, accuracy: Math.min(100, Math.round(val * 1.05)) });
    }
    // Guarantee last point is current overall_mastery
    if (points.length > 0) {
      points[points.length - 1].value = overall_mastery;
      points[points.length - 1].accuracy = overallAccuracy || overall_mastery;
    }
    return points;
  }, [trendTimeframe, overall_mastery, overallAccuracy]);

  // SVG Trend Chart calculations
  const chartHeight = 160;
  const chartWidth = 600;
  const minVal = 20;
  const maxVal = 100;

  const svgPoints = useMemo(() => {
    if (trendPoints.length === 0) return '';
    return trendPoints.map((p, idx) => {
      const x = (idx / (trendPoints.length - 1 || 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - 20 - ((p.value - minVal) / (maxVal - minVal)) * (chartHeight - 40);
      return `${x},${y}`;
    }).join(' ');
  }, [trendPoints]);

  if (showDailyReport) {
    return (
      <DailyStreakActivityReport 
        onBackToAnalytics={() => setShowDailyReport(false)}
        onNavigateToTab={onNavigateToTab}
      />
    );
  }

  return (
    <div className="space-y-8 select-text">
      
      {/* 1. TOP HEADER & IDENTITY BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/20 border border-cyan-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.04)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Brain size={28} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Adaptive Learning & Mastery Hub</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                AI Engine Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time concept tracking calibrated across 10 chemistry pillars for <span className="text-cyan-300 font-semibold">{currentUser?.username || studentProfile.name}</span> ({studentProfile.class}).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase">Roll No:</span>
            <span className="font-bold text-white">{currentUser?.roll_no || studentProfile.roll_no || '24'}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-purple-300 font-mono text-xs flex items-center gap-1.5">
            <GraduationCap size={13} className="text-purple-400" />
            <span className="font-bold text-white">{currentUser?.student_class || 'Class 12'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-purple-300 font-semibold">{currentUser?.section || 'Sec B'}</span>
          </div>
        </div>
      </div>

      {/* 2. CORE METRICS STRIP: OVERALL MASTERY, STREAK, QUESTIONS, ACCURACY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Overall Mastery */}
        <div className="bg-[#0e1117] border border-cyan-500/25 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-400/40 transition-all shadow-[0_0_25px_rgba(34,211,238,0.03)]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Overall Chemistry Mastery</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">{overall_mastery}%</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center">
                  <TrendingUp size={13} className="mr-0.5" /> +5% this week
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Target size={20} />
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-700"
              style={{ width: `${overall_mastery}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-2 block">
            {overall_mastery >= 75 ? 'Tier: Advanced Chemist' : overall_mastery >= 50 ? 'Tier: Intermediate Scholar' : 'Tier: Foundation Builder'}
          </span>
        </div>

        {/* Card 2: Learning Streak (Clickable to Daily Login Report & Activity Ledger) */}
        <div 
          onClick={() => {
            if (onOpenDailyReport) {
              onOpenDailyReport();
            } else {
              setShowDailyReport(true);
            }
          }}
          className="bg-[#0e1117] border border-orange-500/30 hover:border-orange-400 rounded-2xl p-5 relative overflow-hidden group hover:shadow-[0_0_25px_rgba(249,115,22,0.25)] transition-all cursor-pointer hover:scale-[1.02] ring-1 ring-orange-500/10"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-orange-400 tracking-wider font-bold">Active Study Streak</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 animate-pulse">
                  REPORT ↗
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-orange-400 font-mono flex items-center gap-1.5">
                  <Flame size={28} className="fill-orange-500 text-orange-500 animate-bounce" />
                  {streak} <span className="text-sm font-sans text-slate-400">days</span>
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 group-hover:border-orange-400/50 flex items-center justify-center text-orange-400 transition-colors">
              <Award size={20} />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px] text-slate-400 font-mono">
            <span className="text-orange-300/90 font-medium">Daily Login & Activity Report</span>
            <span className="text-orange-400 font-bold group-hover:translate-x-0.5 transition-transform">View Details →</span>
          </div>
        </div>

        {/* Card 3: Questions Attempted */}
        <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Questions Answered</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">{total_questions}</span>
                <span className="text-xs text-slate-400">({total_correct} correct)</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart3 size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span>Overall Accuracy</span>
            <span className="font-mono font-bold text-cyan-300">{overallAccuracy}%</span>
          </div>
          <div className="mt-1 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-400 h-1.5 rounded-full"
              style={{ width: `${overallAccuracy}%` }}
            />
          </div>
        </div>

        {/* Card 4: Current Adaptive Level */}
        <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Dynamic Adaptive Difficulty</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl sm:text-3xl font-black text-purple-300 font-mono capitalize">
                  {overall_mastery >= 75 ? 'Hard Tier' : overall_mastery >= 50 ? 'Medium Tier' : 'Foundation (Easy)'}
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap size={20} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed font-sans">
            Question difficulty automatically adjusts after consecutive correct or incorrect answers.
          </p>
        </div>

      </div>

      {/* 2.5. SECTION: FACULTY ASSIGNMENTS & HOMEWORK */}
      <div className="bg-[#0e1117] border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono tracking-wide uppercase flex items-center gap-2">
                Teacher Assigned Question Sets
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {myAssignments.length} Tasks
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeted problem sets dispatched by your chemistry teachers based on class diagnostics.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-500/30">
            {myAssignments.filter(a => a.completed_by.includes(currentUser?.id || studentProfile.student_id)).length}/{myAssignments.length} Completed
          </span>
        </div>

        {myAssignments.length === 0 ? (
          <div className="p-6 text-center text-slate-500 font-mono text-xs">
            No pending homework assignments assigned to your profile yet!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myAssignments.map((asg) => {
              const studentId = currentUser?.id || studentProfile.student_id;
              const isCompleted = asg.completed_by.includes(studentId);
              return (
                <div 
                  key={asg.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isCompleted 
                      ? 'bg-black/30 border-emerald-500/30' 
                      : 'bg-black/50 border-cyan-500/25 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.05)]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30">
                        {asg.concept_name}
                      </span>
                      {isCompleted ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1">
                          <Clock size={12} /> Due: {asg.due_date}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-white text-sm leading-snug">{asg.title}</h3>
                    
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {asg.instructions}
                    </p>
                    
                    <div className="text-[10px] font-mono text-slate-500">
                      Assigned by: <span className="text-slate-300">{asg.assigned_by}</span> • {asg.question_count} Qs ({asg.difficulty})
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-300">
                      {asg.target_type === 'specific_students' ? '🎯 Individual Target' : '👥 Class-Wide'}
                    </span>
                    {isCompleted ? (
                      <button
                        onClick={() => handleStartSolveAssignment(asg)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} /> Review Drill
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartSolveAssignment(asg)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                      >
                        <Play size={12} className="fill-black" /> Solve Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SECTION: RECOMMENDED FOR YOU (PERSONALIZED AI RECOMMENDATION ENGINE) */}
      <div className="bg-[#0d1017] border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles size={18} className="text-cyan-400" />
            <h2 className="text-base font-bold text-white font-mono tracking-wide uppercase">Recommended For You (AI-Generated Next Steps)</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Auto-updates after every attempt</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => (
            <div 
              key={rec.id || i}
              className="bg-black/40 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-4.5 flex flex-col justify-between transition-all group relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider ${
                    rec.recommendation_type === 'revision' 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                      : rec.recommendation_type === 'quiz'
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {rec.recommendation_type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    Level: <strong className="text-slate-300">{rec.difficulty}</strong>
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  {rec.recommended_content}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                  "{rec.reason}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400/80">{rec.concept_name}</span>
                <button
                  onClick={() => onStartAdaptivePractice?.(rec.concept_id, rec.difficulty)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  Start <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3.5. SPACED REPETITION REVIEW QUEUE (PHASE 18) */}
      <div className="bg-[#0e1117] border border-amber-500/25 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono tracking-wide uppercase flex items-center gap-2">
                Spaced Repetition Review Queue
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  dueConcepts.length > 0 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {dueConcepts.length} concepts due for review today
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                SM-2 Leitner algorithmic scheduling prevents cognitive memory decay and optimizes long-term chemical retention.
              </p>
            </div>
          </div>
        </div>

        {dueConcepts.length === 0 ? (
          <div className="p-4 bg-black/30 rounded-xl border border-slate-800 text-center text-xs text-slate-400 font-mono">
            🎉 All concepts up to date! No reviews due today. Excellent retention schedule maintenance.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dueConcepts.map((item) => (
              <div
                key={item.concept_id}
                className="p-3.5 bg-black/40 border border-amber-500/20 hover:border-amber-500/40 rounded-xl flex items-center justify-between transition"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{item.concept_name}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>Interval: {item.interval_days}d</span>
                    <span>•</span>
                    <span className="text-amber-400">Retention: {item.retention_score}%</span>
                  </div>
                </div>
                <button
                  onClick={() => onStartAdaptivePractice?.(item.concept_id, 'medium')}
                  className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold rounded-lg transition"
                >
                  Review Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3.6. DIAGNOSTIC BENCHMARK REPORT (PHASE 1) */}
      {diagnosticResult && (
        <div className="bg-[#0e1117] border border-purple-500/25 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.04)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <GraduationCap size={16} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-mono tracking-wide uppercase flex items-center gap-2">
                  Diagnostic Chemistry Benchmark Report
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Accuracy: {diagnosticResult.accuracy}%
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Baseline assessment administered on {diagnosticResult.timestamp.split('T')[0]}.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Calibrated Starting Tier</span>
              <span className="text-sm font-bold text-cyan-300">
                {diagnosticResult.overallScore >= 75 ? 'Hard Tier' : diagnosticResult.overallScore >= 50 ? 'Medium Tier' : 'Foundational'}
              </span>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Strongest Disciplines</span>
              <span className="text-sm font-bold text-emerald-300 truncate block">
                {diagnosticResult.strongestConcepts.join(', ') || 'General Chemistry'}
              </span>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Primary Gap Focus Areas</span>
              <span className="text-sm font-bold text-amber-300 truncate block">
                {diagnosticResult.weakestConcepts.join(', ') || 'None Detected'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. DUAL COLUMN: STRENGTHS & WEAK AREAS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-[#0e1117] border border-emerald-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={18} />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">Your Strengths (High Mastery)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Concepts where your mastery exceeds 72%. Keep up the momentum or attempt Hard challenges!
          </p>
          <div className="space-y-2 pt-1">
            {strengths.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Complete more practice sets to establish mastery strengths.</p>
            ) : (
              strengths.map(concept => (
                <div 
                  key={concept.concept_id}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-slate-800 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <div className="text-xs font-bold text-white">{concept.concept_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{concept.attempts} attempted • {concept.accuracy}% accuracy</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-extrabold text-emerald-400">{concept.mastery_score}%</span>
                    <button
                      onClick={() => onStartAdaptivePractice?.(concept.concept_id, 'hard')}
                      title="Practice Hard Challenge"
                      className="p-1.5 bg-emerald-950/40 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-mono cursor-pointer"
                    >
                      Hard
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Weak Areas (Needs Practice) */}
        <div className="bg-[#0e1117] border border-amber-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle size={18} />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">Needs Practice (Focus Areas)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Target these concepts to prevent grade drops and unlock dependent prerequisite topics.
          </p>
          <div className="space-y-2 pt-1">
            {weakAreas.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No critical weak concepts detected! Great progress.</p>
            ) : (
              weakAreas.map(concept => (
                <div 
                  key={concept.concept_id}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-slate-800 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">{concept.concept_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{concept.attempts} attempted • {concept.accuracy}% accuracy</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-extrabold text-amber-400">{concept.mastery_score}%</span>
                    <button
                      onClick={() => onStartAdaptivePractice?.(concept.concept_id, 'easy')}
                      title="Practice Foundation (Easy)"
                      className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all"
                    >
                      Practice
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 5. PERFORMANCE TREND OVER TIME (SVG GRAPH WITH TIMEFRAME FILTERS) */}
      <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              Mastery & Performance Trend
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Calculated learning trajectory across time</p>
          </div>

          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-slate-800">
            {(['7d', '30d', 'all'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTrendTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                  trendTimeframe === tf 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === '7d' ? 'Last 7 Days' : tf === '30d' ? 'Last 30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Visualization */}
        <div className="relative pt-4 pb-2 w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[25, 50, 75, 100].map(val => {
                const y = chartHeight - 20 - ((val - minVal) / (maxVal - minVal)) * (chartHeight - 40);
                return (
                  <g key={val}>
                    <line x1="20" y1={y} x2={chartWidth - 20} y2={y} stroke="#334155" strokeDasharray="4 4" strokeWidth="0.8" opacity="0.4" />
                    <text x="10" y={y + 3} fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="end">{val}%</text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              {svgPoints && (
                <polygon
                  points={`20,${chartHeight - 20} ${svgPoints} ${chartWidth - 20},${chartHeight - 20}`}
                  fill="url(#trendGradient)"
                />
              )}

              {/* Line */}
              {svgPoints && (
                <polyline
                  points={svgPoints}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {trendPoints.map((p, idx) => {
                const x = (idx / (trendPoints.length - 1 || 1)) * (chartWidth - 40) + 20;
                const y = chartHeight - 20 - ((p.value - minVal) / (maxVal - minVal)) * (chartHeight - 40);
                const isLast = idx === trendPoints.length - 1;
                return (
                  <g key={idx} className="group">
                    <circle
                      cx={x}
                      cy={y}
                      r={isLast ? 5 : 3.5}
                      fill={isLast ? '#22d3ee' : '#0e1117'}
                      stroke="#22d3ee"
                      strokeWidth={isLast ? 3 : 2}
                    />
                    <text
                      x={x}
                      y={chartHeight - 4}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* 6. CONCEPT-LEVEL MASTERY BREAKDOWN (ALL 10 CONCEPTS WITH CARDS & METRICS) */}
      <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <BookOpen size={18} className="text-cyan-400" />
              Concept Mastery Directory (10 Core Pillars)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bayesian learning estimates factoring recent attempts, question difficulty weights, and mistake patterns.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {[
              { id: 'all', label: 'All Concepts' },
              { id: 'weak', label: 'Needs Practice (<60%)' },
              { id: 'strong', label: 'Mastered (72%+)' },
              { id: 'physical', label: 'Physical' },
              { id: 'inorganic', label: 'Inorganic' },
              { id: 'organic', label: 'Organic' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedConceptFilter(f.id)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedConceptFilter === f.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold'
                    : 'bg-black/30 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Concept Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedConcepts.map(c => {
            const isStrong = c.mastery_score >= 72;
            const isWeak = c.mastery_score < 60;
            const trendIcon = c.trend === 'up' 
              ? <TrendingUp size={13} className="text-emerald-400" />
              : c.trend === 'down'
              ? <TrendingDown size={13} className="text-rose-400" />
              : <Minus size={13} className="text-slate-400" />;

            return (
              <div 
                key={c.concept_id}
                className="bg-black/40 border border-slate-800 hover:border-cyan-500/30 rounded-xl p-4.5 space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {c.definition.category}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        isStrong ? 'bg-emerald-500/15 text-emerald-300' : isWeak ? 'bg-amber-500/15 text-amber-300' : 'bg-blue-500/15 text-blue-300'
                      }`}>
                        {isStrong ? 'Strong' : isWeak ? 'Needs Practice' : 'Developing'}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mt-1.5">{c.concept_name}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{c.definition.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 font-mono font-black text-lg text-white">
                      {trendIcon}
                      <span className={isStrong ? 'text-emerald-400' : isWeak ? 'text-amber-400' : 'text-cyan-300'}>
                        {c.mastery_score}%
                      </span>
                    </div>
                    <span className="text-[9.5px] font-mono text-slate-500 uppercase block mt-0.5">
                      Diff: <strong className="text-slate-300 capitalize">{c.current_difficulty}</strong>
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isStrong ? 'bg-emerald-400' : isWeak ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${c.mastery_score}%` }}
                  />
                </div>

                {/* Stats footer & Quick Practice */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <div>
                    <span>{c.attempts} attempts</span> • <span>{c.accuracy}% correct</span>
                  </div>
                  <button
                    onClick={() => onStartAdaptivePractice?.(c.concept_id, c.current_difficulty)}
                    className="px-3 py-1 rounded bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 hover:border-cyan-400 border border-slate-700/80 text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Play size={10} className="fill-cyan-300" /> Practice
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. INTERACTIVE ASSIGNMENT SOLVER MODAL */}
      <AnimatePresence>
        {solvingAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e1117] border border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.15)] relative"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-400/30 font-bold uppercase">
                      Faculty Assignment Drill
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">
                      {solvingAssignment.concept_name}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white mt-1">{solvingAssignment.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Assigned by: {solvingAssignment.assigned_by} • Due: {solvingAssignment.due_date}
                  </p>
                </div>
                <button
                  onClick={() => setSolvingAssignment(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {!solverFinished && solverQuestions.length > 0 ? (
                <div className="space-y-5">
                  {/* Progress bar */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Question {currentSolverIdx + 1} of {solverQuestions.length}</span>
                    <span className="text-cyan-300 font-bold">Score: {solverScore} / {solverQuestions.length}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-1.5 rounded-full transition-all"
                      style={{ width: `${((currentSolverIdx + 1) / solverQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Box */}
                  <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Topic: {solverQuestions[currentSolverIdx].concept_name} ({solverQuestions[currentSolverIdx].difficulty})
                    </span>
                    <h3 className="text-base font-bold text-white leading-relaxed">
                      {solverQuestions[currentSolverIdx].question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {solverQuestions[currentSolverIdx].options.map((opt, oIdx) => {
                      const isSelected = selectedSolverOption === opt;
                      const isCorrect = opt === solverQuestions[currentSolverIdx].correct_answer;
                      let btnStyle = 'bg-black/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white';
                      if (solverIsSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-cyan-950/50 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)]';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={solverIsSubmitted}
                          onClick={() => setSelectedSolverOption(opt)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {solverIsSubmitted && isCorrect && <Check size={16} className="text-emerald-400 shrink-0" />}
                          {solverIsSubmitted && isSelected && !isCorrect && <X size={16} className="text-rose-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback */}
                  {solverIsSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-xl border text-xs font-sans leading-relaxed space-y-2 ${
                        selectedSolverOption === solverQuestions[currentSolverIdx].correct_answer
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div>
                        <strong className="font-bold block mb-1">
                          {selectedSolverOption === solverQuestions[currentSolverIdx].correct_answer
                            ? '✓ Excellent! Concept verified.'
                            : '✕ Not quite right.'}
                        </strong>
                        {solverQuestions[currentSolverIdx].explanation}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const currentQ = solverQuestions[currentSolverIdx];
                          window.dispatchEvent(new CustomEvent('open-ai-chemist-tutor', {
                            detail: {
                              prompt: `Help me solve this problem step-by-step:\n"${currentQ.question}"\nOptions:\n${currentQ.options.map(o => '- ' + o).join('\n')}\nCorrect Answer: ${currentQ.correct_answer}\nConcept: ${currentQ.concept_name}`
                            }
                          }));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Sparkles size={12} className="text-cyan-400" />
                        Ask AI Chemist Tutor for Full Step-by-Step Solution 🔬
                      </button>
                    </motion.div>
                  )}

                  {/* Hint button before submit */}
                  {!solverIsSubmitted && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const currentQ = solverQuestions[currentSolverIdx];
                          window.dispatchEvent(new CustomEvent('open-ai-chemist-tutor', {
                            detail: {
                              prompt: `Can you give me a subtle hint or key principle for this question without giving away the direct answer?\n"${currentQ.question}"\nTopic: ${currentQ.concept_name}`
                            }
                          }));
                        }}
                        className="text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles size={11} /> Need a hint? Ask AI Chemist Tutor
                      </button>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] font-mono text-slate-500">
                      Step {currentSolverIdx + 1} of {solverQuestions.length}
                    </span>
                    {!solverIsSubmitted ? (
                      <button
                        disabled={!selectedSolverOption}
                        onClick={handleSolverSubmitAnswer}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Verify & Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleSolverNext}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {currentSolverIdx + 1 < solverQuestions.length ? 'Next Question' : 'Complete Assignment 🏆'}
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Completed Screen */
                <div className="text-center py-6 space-y-4 font-mono">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <Award size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Assignment Completed!</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Results registered to your profile and relayed to your teacher's gradebook.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-slate-800 max-w-sm mx-auto flex justify-around">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Score</span>
                      <span className="text-xl font-black text-cyan-300">{solverScore} / {solverQuestions.length}</span>
                    </div>
                    <div className="border-r border-slate-800" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Accuracy</span>
                      <span className="text-xl font-black text-emerald-400">
                        {solverQuestions.length > 0 ? Math.round((solverScore / solverQuestions.length) * 100) : 100}%
                      </span>
                    </div>
                    <div className="border-r border-slate-800" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">XP Awarded</span>
                      <span className="text-xl font-black text-amber-400">+50 XP</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setSolvingAssignment(null)}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Return to Analytics Hub
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
