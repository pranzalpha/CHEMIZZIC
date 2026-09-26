/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { CHEMISTRY_CONCEPTS } from '../data/chemistryConcepts';
import { generateClassSummary } from '../services/adaptiveEngine';
import { StudentProfile, UserRole } from '../types';
import { 
  Users, Award, AlertTriangle, TrendingUp, TrendingDown, 
  Brain, BarChart3, Search, Sparkles, Filter, ChevronRight, 
  X, CheckCircle2, RefreshCw, Eye, BookOpen, Compass,
  FileText, Send, Clock, ShieldAlert, Check, GraduationCap, Flame, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TeacherAnalyticsDashboardProps {
  onSwitchToStudentPortal?: () => void;
  onOpenAuthModal?: () => void;
}

export const TeacherAnalyticsDashboard: React.FC<TeacherAnalyticsDashboardProps> = ({
  onSwitchToStudentPortal,
  onOpenAuthModal
}) => {
  const { 
    allStudents, 
    selectedClass, 
    setSelectedClass,
    currentUser,
    featureLogs,
    assignments,
    createAssignment,
    login
  } = useAuthAndQuiz();
  
  // Available classes
  const classOptions = [
    'Class 12 - Section B',
    'Class 11 - Section A',
    'AP Chemistry Honors'
  ];

  // Active student drill-down state
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [heatmapCellFocus, setHeatmapCellFocus] = useState<{ studentName: string; conceptName: string; score: number } | null>(null);

  // Assignment Creator state
  const [assignTitle, setAssignTitle] = useState('Remedial Electrochemistry Nernst Practice');
  const [assignConcept, setAssignConcept] = useState('electrochemistry');
  const [assignDifficulty, setAssignDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [assignTargetType, setAssignTargetType] = useState<'all' | 'specific_students'>('specific_students');
  const [assignSelectedStudents, setAssignSelectedStudents] = useState<string[]>(['std_current', 'std_riya']);
  const [assignQuestionCount, setAssignQuestionCount] = useState<number>(5);
  const [assignDueDate, setAssignDueDate] = useState<string>(() => {
    const d = new Date(Date.now() + 5 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [assignInstructions, setAssignInstructions] = useState('Carefully review standard reduction potentials and Nernst equations before class.');
  const [assignmentSuccessMsg, setAssignmentSuccessMsg] = useState<string | null>(null);

  // Student activity feed filters
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<string>('all');
  const [activityStudentFilter, setActivityStudentFilter] = useState<string>('all');

  // Compute live class analytics summary
  const summary = useMemo(() => {
    return generateClassSummary(selectedClass, allStudents);
  }, [selectedClass, allStudents]);

  // Students belonging to current class
  const classStudents = useMemo(() => {
    const list = allStudents.filter(s => s.class === selectedClass);
    if (!searchTerm.trim()) return list;
    const q = searchTerm.toLowerCase();
    return list.filter(s => s.name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q));
  }, [allStudents, selectedClass, searchTerm]);

  // Dynamic AI Insights generator / refresh state
  const [aiInsights, setAiInsights] = useState<string[]>(summary.ai_insights);
  const [refreshingAi, setRefreshingAi] = useState<boolean>(false);

  const handleRefreshAiInsights = async () => {
    setRefreshingAi(true);
    try {
      const res = await fetch('/api/adaptive/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: selectedClass,
          averages: { mastery: summary.average_mastery, accuracy: summary.average_quiz_accuracy },
          weakConcepts: summary.most_difficult_concepts,
          struggleCount: summary.students_needing_attention.length,
          totalStudents: summary.total_students
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.insights && data.insights.length > 0) {
          setAiInsights(data.insights);
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote AI insights, falling back to heuristic engine:", err);
    } finally {
      setRefreshingAi(false);
    }
  };

  // Helper function to colorize heatmap cells based on mastery %
  const getCellColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/35 text-emerald-200 border-emerald-500/40 hover:bg-emerald-500/50';
    if (score >= 70) return 'bg-teal-500/25 text-teal-200 border-teal-500/30 hover:bg-teal-500/40';
    if (score >= 55) return 'bg-amber-500/25 text-amber-200 border-amber-500/30 hover:bg-amber-500/40';
    return 'bg-rose-500/30 text-rose-200 border-rose-500/40 hover:bg-rose-500/50';
  };

  // Class common problems data
  const classCommonProblems = [
    {
      id: 'prob_1',
      title: 'Nernst Equation: Reaction Quotient [Q] Inversion',
      concept_id: 'electrochemistry',
      concept_name: 'Electrochemistry',
      failure_rate: 68,
      struggling_students_count: 5,
      description: 'Students inverted the quotient ratio [Products]/[Reactants] or incorrectly factored solid zinc mass into Q.',
      common_incorrect_choice: 'Assuming solid Zn(s) has activity > 1 in non-standard galvanic cells.',
      pedagogical_tip: 'Emphasize that pure solids and liquids have activity = 1 by definition, and cathode always represents reduction.'
    },
    {
      id: 'prob_2',
      title: 'Gibbs Free Energy: Temperature Unit Conversion (Celsius to Kelvin)',
      concept_id: 'thermodynamics',
      concept_name: 'Thermodynamics',
      failure_rate: 58,
      struggling_students_count: 4,
      description: 'Calculations failed when ΔG = ΔH - TΔS was evaluated using Celsius temperature instead of absolute Kelvin.',
      common_incorrect_choice: 'Using 25°C directly instead of 298.15 K, producing wrong sign for spontaneity.',
      pedagogical_tip: 'Implement a mandatory pre-calculation units check checklist (T in K, ΔS in kJ/(mol·K)).'
    },
    {
      id: 'prob_3',
      title: 'VSEPR Theory: Lone Pair Bond Angle Distortion (H2O & NH3)',
      concept_id: 'molecular_structure',
      concept_name: 'Molecular Structure',
      failure_rate: 52,
      struggling_students_count: 4,
      description: 'Students misclassified water as linear or predicted 109.5° angles without factoring lone-pair lone-pair repulsion.',
      common_incorrect_choice: 'Predicting ideal tetrahedral 109.5° bond angle for ammonia and water.',
      pedagogical_tip: 'Use 3D Structure Explorer to demonstrate lone pair electron cloud volume pushing bonding pairs.'
    },
    {
      id: 'prob_4',
      title: 'Le Chatelier: Noble Gas Addition at Constant Volume',
      concept_id: 'chemical_equilibrium',
      concept_name: 'Chemical Equilibrium',
      failure_rate: 64,
      struggling_students_count: 6,
      description: 'Students assumed adding inert argon gas increases pressure and shifts equilibrium, even when volume is constant.',
      common_incorrect_choice: 'Claiming equilibrium shifts toward fewer gas moles when inert gas is added at constant V.',
      pedagogical_tip: 'Clarify that partial pressures of reactants and products remain unchanged if volume is fixed.'
    },
    {
      id: 'prob_5',
      title: 'Periodic Trends: Second Ionization Enthalpy Anomalies (Na vs Mg)',
      concept_id: 'periodic_properties',
      concept_name: 'Periodic Properties',
      failure_rate: 44,
      struggling_students_count: 3,
      description: 'Students overlooked noble gas electronic configuration when removing second electron from alkali metals.',
      common_incorrect_choice: 'Predicting Mg has higher second ionization energy than Na.',
      pedagogical_tip: 'Review noble gas core octet stability after losing 1s/2s electrons.'
    }
  ];

  const handleDispatchAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedConceptObj = CHEMISTRY_CONCEPTS.find(c => c.id === assignConcept);
    const newAsg = {
      title: assignTitle,
      concept_id: assignConcept,
      concept_name: selectedConceptObj?.name || 'Chemistry Concept',
      difficulty: assignDifficulty,
      assigned_by: `${currentUser?.username || 'Prof. Arfwedson'} (Faculty)`,
      target_type: assignTargetType,
      target_student_ids: assignTargetType === 'specific_students' ? assignSelectedStudents : [],
      target_class: selectedClass,
      question_count: assignQuestionCount,
      due_date: assignDueDate,
      instructions: assignInstructions
    };
    createAssignment(newAsg);
    setAssignmentSuccessMsg(`Assignment "${assignTitle}" dispatched successfully to ${assignTargetType === 'all' ? selectedClass : `${assignSelectedStudents.length} students`}!`);
    setTimeout(() => setAssignmentSuccessMsg(null), 3500);
  };

  const handleAutoSelectStruggling = (conceptId: string) => {
    const strugglingIds = classStudents.filter(s => {
      const m = s.masteries[conceptId];
      return !m || m.mastery_score < 60;
    }).map(s => s.student_id);
    setAssignSelectedStudents(strugglingIds.length > 0 ? strugglingIds : classStudents.slice(0, 3).map(s => s.student_id));
    setAssignConcept(conceptId);
    const cObj = CHEMISTRY_CONCEPTS.find(c => c.id === conceptId);
    setAssignTitle(`Remedial Focus Drill: ${cObj?.name || 'Chemistry'}`);
  };

  const filteredActivities = useMemo(() => {
    return featureLogs.filter(log => {
      if (activityCategoryFilter !== 'all' && log.category !== activityCategoryFilter) return false;
      if (activityStudentFilter !== 'all' && log.student_id !== activityStudentFilter) return false;
      return true;
    });
  }, [featureLogs, activityCategoryFilter, activityStudentFilter]);

  // Security Access Guard: Only accessible by teachers and admin
  if (currentUser?.role !== 'teacher' && currentUser?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center select-text font-mono space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-950/40 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(168,85,247,0.2)]">
          <ShieldAlert size={40} />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
            Restricted Faculty Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Teacher & Faculty Access Only</h1>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed font-sans">
            The Teacher Portal contains private student gradebooks, cohort performance heatmaps, class-wide error diagnostics, and homework assignment dispatch tools. Only verified teachers, instructors, and administrators have clearance.
          </p>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl max-w-md mx-auto text-xs text-slate-300 space-y-1">
          <div>Currently logged in as: <strong className="text-cyan-300">{currentUser?.username || 'Guest Scholar'}</strong></div>
          <div className="text-slate-500">Current Role: <span className="uppercase text-amber-400 font-bold">{currentUser?.role || 'Guest'}</span></div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenAuthModal ? onOpenAuthModal() : login('teacher@chemizic.com', 'Prof. Arfwedson', '', 'teacher')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-2"
          >
            <Users size={14} /> Log In as Teacher / Faculty
          </button>
          <button
            onClick={() => onSwitchToStudentPortal?.()}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Go to Student Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-text">
      
      {/* 1. HEADER & CLASS SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-cyan-950/20 border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.04)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Users size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Faculty & Teacher Analytics Portal</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 uppercase">
                Educator Mode
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-cohort chemistry mastery tracking, predictive intervention alerts, and concept heatmaps.
            </p>
          </div>
        </div>

        {/* Cohort Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider shrink-0">Class Roster:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-black/60 border border-purple-500/30 text-white font-mono text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-purple-400 cursor-pointer shadow-[inset_0_0_12px_rgba(168,85,247,0.1)]"
          >
            {classOptions.map(c => (
              <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. CLASS OVERVIEW METRICS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Active Cohort Roster</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">{summary.total_students}</span>
            <span className="text-xs text-slate-400 font-sans">students enrolled</span>
          </div>
          <span className="text-[10px] text-purple-400 font-mono mt-3 block">{selectedClass}</span>
        </div>

        {/* Class Average Mastery */}
        <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Average Class Mastery</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">{summary.average_mastery}%</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <TrendingUp size={13} className="mr-0.5" /> Normal curve
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-cyan-400 h-1.5 rounded-full"
              style={{ width: `${summary.average_mastery}%` }}
            />
          </div>
        </div>

        {/* Quiz Accuracy */}
        <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Average Quiz Accuracy</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">{summary.average_quiz_accuracy}%</span>
            <span className="text-xs text-slate-400 font-sans">aggregate score</span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-400 h-1.5 rounded-full"
              style={{ width: `${summary.average_quiz_accuracy}%` }}
            />
          </div>
        </div>

        {/* Total Questions Attempted */}
        <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Total Questions Solved</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">{summary.total_questions_attempted}</span>
            <span className="text-xs text-slate-400 font-sans">cumulative</span>
          </div>
          <span className="text-[10px] text-blue-400 font-mono mt-3 block">High practice engagement</span>
        </div>

      </div>

      {/* 3. AI-GENERATED CLASSROOM INSIGHTS */}
      <div className="bg-[#0d1017] border border-purple-500/25 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles size={18} className="text-purple-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              AI Learning Insights (Strictly Performance Data-Backed)
            </h2>
          </div>
          <button
            onClick={handleRefreshAiInsights}
            disabled={refreshingAi}
            className="px-3 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw size={12} className={refreshingAi ? "animate-spin" : ""} />
            {refreshingAi ? "Analyzing..." : "Refresh Insights"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiInsights.map((insight, idx) => (
            <div 
              key={idx}
              className="bg-black/40 border border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CLASS WEAK CONCEPTS & INTERVENTION ALERT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Class Weak Concepts Ranked */}
        <div className="bg-[#0e1117] border border-amber-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle size={18} />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">Class-Wide Weak Concepts (Ranked)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Dynamically prioritized by lowest average cohort mastery and frequency of incorrect answers.
          </p>
          <div className="space-y-2.5 pt-1">
            {summary.weak_concepts_ranked.slice(0, 4).map((c, i) => (
              <div 
                key={c.concept_id}
                className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-mono text-xs font-bold">
                    #{i + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{c.concept_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {c.student_struggle_count} students with mastery &lt; 50%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-extrabold text-amber-400">{c.average_mastery}%</span>
                  <span className="text-[9px] text-slate-500 uppercase block font-mono">Cohort Avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Mastered Concepts */}
        <div className="bg-[#0e1117] border border-emerald-500/20 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Award size={18} />
            <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">Cohort Strengths & Benchmarks</h3>
          </div>
          <p className="text-xs text-slate-400">
            Topics where students consistently demonstrate verified retention and high accuracy.
          </p>
          <div className="space-y-2.5 pt-1">
            {summary.most_mastered_concepts.map((c, i) => (
              <div 
                key={c.concept_id}
                className="p-3 rounded-xl bg-black/40 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono text-xs font-bold">
                    ✓
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{c.concept_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Solid foundational comprehension</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-extrabold text-emerald-400">{c.average_mastery}%</span>
                  <span className="text-[9px] text-slate-500 uppercase block font-mono">Cohort Avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 5. TEACHER CLASS HEATMAP (SECTION 8) */}
      <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <Compass size={18} className="text-cyan-400" />
              Class Mastery Heatmap Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rows represent students, columns represent the 10 chemistry concepts. Click any cell or student to drill down.
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/60 inline-block" /> ≥80% High</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-500/30 border border-teal-500/50 inline-block" /> 70-79%</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50 inline-block" /> 55-69%</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/35 border border-rose-500/60 inline-block" /> &lt;55% Requires Practice</span>
          </div>
        </div>

        {/* Heatmap Matrix Table */}
        <div className="overflow-x-auto scrollbar-none pb-2">
          <table className="w-full text-left border-collapse min-w-[840px]">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2.5 px-3 sticky left-0 bg-[#0e1117] z-10 w-44">Student Name</th>
                {CHEMISTRY_CONCEPTS.map(concept => (
                  <th key={concept.id} className="py-2.5 px-2 text-center" title={concept.name}>
                    <div className="truncate max-w-[70px] mx-auto text-[9.5px]">
                      {concept.name.split(' ')[0]}
                    </div>
                  </th>
                ))}
                <th className="py-2.5 px-3 text-right">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {classStudents.map(student => (
                <tr key={student.student_id} className="hover:bg-slate-900/50 transition-colors">
                  
                  {/* Student row title */}
                  <td className="py-2.5 px-3 sticky left-0 bg-[#0e1117] z-10 font-sans font-semibold text-white">
                    <button
                      onClick={() => setSelectedStudentForModal(student)}
                      className="hover:text-cyan-300 text-left transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="truncate max-w-[130px]">{student.name}</span>
                      <ChevronRight size={12} className="text-slate-500" />
                    </button>
                  </td>

                  {/* Concept Cells */}
                  {CHEMISTRY_CONCEPTS.map(concept => {
                    const m = student.masteries[concept.id];
                    const score = m ? m.mastery_score : 50;
                    return (
                      <td key={concept.id} className="py-2 px-1 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudentForModal(student);
                            setHeatmapCellFocus({
                              studentName: student.name,
                              conceptName: concept.name,
                              score
                            });
                          }}
                          className={`w-full py-1.5 px-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${getCellColor(score)}`}
                          title={`${student.name} • ${concept.name}: ${score}% mastery`}
                        >
                          {score}%
                        </button>
                      </td>
                    );
                  })}

                  {/* Student Overall */}
                  <td className="py-2.5 px-3 text-right font-black text-cyan-300">
                    {student.overall_mastery}%
                  </td>

                </tr>
              ))}

              {/* Class Average Row */}
              <tr className="bg-slate-900/80 font-bold border-t-2 border-slate-700">
                <td className="py-3 px-3 sticky left-0 bg-slate-900 z-10 text-cyan-300 uppercase tracking-wider text-[11px]">
                  Cohort Average
                </td>
                {CHEMISTRY_CONCEPTS.map(concept => {
                  let sum = 0;
                  classStudents.forEach(s => {
                    sum += s.masteries[concept.id]?.mastery_score || 50;
                  });
                  const avg = classStudents.length > 0 ? Math.round(sum / classStudents.length) : 50;
                  return (
                    <td key={concept.id} className="py-3 px-1 text-center font-extrabold text-[11px] text-white">
                      {avg}%
                    </td>
                  );
                })}
                <td className="py-3 px-3 text-right font-black text-cyan-300 text-sm">
                  {summary.average_mastery}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. STUDENTS NEEDING ATTENTION (MEASURABLE LEARNING INDICATORS, NEUTRAL LANGUAGE) */}
      <div className="bg-[#0e1117] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <Brain size={18} className="text-amber-400" />
              Targeted Support & Intervention Roster
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identified via measurable indicators (mastery &lt; 52%, repeated incorrect attempts, or low activity).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {summary.students_needing_attention.length} students flagged for support
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {summary.students_needing_attention.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 italic">All students in this cohort currently exceed the benchmark threshold!</p>
          ) : (
            summary.students_needing_attention.map(item => (
              <div 
                key={item.student_id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-900/40 p-3 rounded-xl transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-sm">{item.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {item.issue_type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Overall Mastery: <strong className="text-amber-300">{item.overall_mastery}%</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Focus area (Requires practice): <span className="text-cyan-300 font-semibold">{item.critical_concept}</span> • 
                    Accuracy: <span className="text-slate-300 font-mono">{item.accuracy}%</span>
                  </p>
                  <p className="text-xs text-slate-300 italic bg-black/40 p-2 rounded-lg border border-slate-800 inline-block mt-1">
                    Pedagogical Recommendation: {item.recommended_intervention}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => {
                      const fullStd = allStudents.find(s => s.student_id === item.student_id);
                      if (fullStd) setSelectedStudentForModal(fullStd);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye size={12} /> View Drill-Down
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 7. CLASS-WIDE COMMON PROBLEMS & MISCONCEPTION DIAGNOSTICS */}
      <div className="bg-[#0e1117] border border-amber-500/30 rounded-2xl p-6 space-y-5 shadow-[0_0_35px_rgba(245,158,11,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle size={20} />
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                Class-Wide Common Problems & Error Diagnostics
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Top recurring chemistry misconceptions, problematic question types, and inaccurate option choices identified across {selectedClass}.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-500/30">
            5 Critical Misconceptions Flagged
          </span>
        </div>

        <div className="space-y-3.5">
          {classCommonProblems.map((prob, idx) => (
            <div 
              key={prob.id}
              className="p-4 rounded-xl bg-black/40 border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{prob.title}</h3>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      Concept: {prob.concept_name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-mono font-black text-rose-400">{prob.failure_rate}% Fail Rate</span>
                    <span className="text-[9.5px] font-mono text-slate-500 block">
                      {prob.struggling_students_count} students affected
                    </span>
                  </div>
                  <button
                    onClick={() => handleAutoSelectStruggling(prob.concept_id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  >
                    <Send size={12} /> Assign Remedial Drill
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 font-sans">
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <strong className="text-[10.5px] font-mono text-slate-400 uppercase block">Common Student Misconception:</strong>
                  <p className="text-slate-300 leading-relaxed">{prob.description}</p>
                  <p className="text-rose-300 text-[11px] font-mono pt-1">
                    Frequent Incorrect Option: <em>"{prob.common_incorrect_choice}"</em>
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 space-y-1">
                  <strong className="text-[10.5px] font-mono text-purple-300 uppercase block">Recommended Faculty Action:</strong>
                  <p className="text-slate-300 leading-relaxed">{prob.pedagogical_tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. ASSIGN PARTICULAR QUESTION SETS FOR SPECIFIC STUDENTS */}
      <div className="bg-[#0e1117] border border-cyan-500/30 rounded-2xl p-6 space-y-6 shadow-[0_0_35px_rgba(34,211,238,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                Assign Particular Question Sets for Students
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Target homework or intervention drills to individual struggling learners or the entire classroom cohort.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-500/30">
            {assignments.length} Active Assignments in Ledger
          </span>
        </div>

        {assignmentSuccessMsg && (
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono flex items-center gap-2 animate-pulse">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{assignmentSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleDispatchAssignment} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Assignment Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={assignTitle}
                onChange={(e) => setAssignTitle(e.target.value)}
                placeholder="e.g. Remedial Electrochemistry Nernst Practice"
                className="w-full bg-black/50 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Concept */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Target Chemistry Pillar <span className="text-cyan-400">*</span>
              </label>
              <select
                value={assignConcept}
                onChange={(e) => {
                  setAssignConcept(e.target.value);
                  const cObj = CHEMISTRY_CONCEPTS.find(c => c.id === e.target.value);
                  setAssignTitle(`Focused Practice: ${cObj?.name || 'Chemistry'}`);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-200 outline-none focus:border-cyan-400 font-mono"
              >
                {CHEMISTRY_CONCEPTS.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Difficulty */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Difficulty Tier
              </label>
              <select
                value={assignDifficulty}
                onChange={(e) => setAssignDifficulty(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
              >
                <option value="easy">Easy (Foundational)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="hard">Hard (Advanced / Olympiad)</option>
              </select>
            </div>

            {/* Question count */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Number of Questions
              </label>
              <select
                value={assignQuestionCount}
                onChange={(e) => setAssignQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
              >
                <option value={3}>3 Questions (Quick Drill)</option>
                <option value={5}>5 Questions (Standard Practice)</option>
                <option value={8}>8 Questions (In-Depth Assessment)</option>
                <option value={10}>10 Questions (Mastery Diagnostic)</option>
              </select>
            </div>

            {/* Due date */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Submission Due Date
              </label>
              <input
                type="date"
                required
                value={assignDueDate}
                onChange={(e) => setAssignDueDate(e.target.value)}
                className="w-full bg-black/50 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Target Student Selection */}
          <div className="p-4 bg-black/40 border border-slate-800 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                Assign To:
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="targetType"
                    checked={assignTargetType === 'all'}
                    onChange={() => setAssignTargetType('all')}
                    className="accent-cyan-400"
                  />
                  <span>Entire Class ({selectedClass})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="targetType"
                    checked={assignTargetType === 'specific_students'}
                    onChange={() => setAssignTargetType('specific_students')}
                    className="accent-cyan-400"
                  />
                  <span>Specific Student(s)</span>
                </label>
              </div>
            </div>

            {assignTargetType === 'specific_students' && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Select enrolled students for this intervention set:</span>
                  <button
                    type="button"
                    onClick={() => handleAutoSelectStruggling(assignConcept)}
                    className="text-[10.5px] text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    ⚡ Auto-select students &lt; 60% in {CHEMISTRY_CONCEPTS.find(c => c.id === assignConcept)?.name || 'this concept'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                  {classStudents.map(student => {
                    const isSelected = assignSelectedStudents.includes(student.student_id);
                    const mastery = student.masteries[assignConcept]?.mastery_score || 50;
                    return (
                      <label
                        key={student.student_id}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 text-white font-bold'
                            : 'bg-black/30 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setAssignSelectedStudents(prev => prev.filter(id => id !== student.student_id));
                              } else {
                                setAssignSelectedStudents(prev => [...prev, student.student_id]);
                              }
                            }}
                            className="accent-cyan-400 shrink-0"
                          />
                          <span className="truncate">{student.name}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          mastery < 55 ? 'text-rose-400 bg-rose-950/40' : 'text-slate-400'
                        }`}>
                          {mastery}%
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Teacher Instructions & Pedagogical Guidance
            </label>
            <textarea
              rows={2}
              value={assignInstructions}
              onChange={(e) => setAssignInstructions(e.target.value)}
              placeholder="Provide specific hints, formulas to remember, or objectives..."
              className="w-full bg-black/50 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >
              <Send size={14} className="fill-black" /> Dispatch Assignment to Students
            </button>
          </div>
        </form>

        {/* Existing Assigned Sets list */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} className="text-cyan-400" /> Active Dispatched Assignments ({assignments.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {assignments.map(asg => (
              <div key={asg.id} className="p-3.5 rounded-xl bg-black/40 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                    {asg.concept_name}
                  </span>
                  <span className="text-slate-400">Due: {asg.due_date}</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{asg.title}</h4>
                <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
                  <span>Target: {asg.target_type === 'all' ? 'All Class' : `${asg.target_student_ids.length} Students`}</span>
                  <span className="text-emerald-400 font-bold">
                    {asg.completed_by.length} Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. LIVE STUDENT ACTIVITY FEED & AUDIT LEDGER */}
      <div className="bg-[#0e1117] border border-purple-500/25 rounded-2xl p-6 space-y-5 shadow-[0_0_35px_rgba(168,85,247,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Activity size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                Live Student Activity Feed & Audit Ledger
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time activity tracking: quiz submissions, reaction simulations, pH litmus experiments, and daily logins.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activityCategoryFilter}
              onChange={(e) => setActivityCategoryFilter(e.target.value)}
              className="bg-black/60 border border-slate-800 text-xs text-slate-300 font-mono rounded-lg px-2.5 py-1.5 outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Laboratory">Laboratory Lab</option>
              <option value="Assessment">Assessment & Quizzes</option>
              <option value="AI Consultation">AI Consultation</option>
              <option value="Calculations">Calculations</option>
              <option value="Exploration">3D Exploration</option>
            </select>

            <select
              value={activityStudentFilter}
              onChange={(e) => setActivityStudentFilter(e.target.value)}
              className="bg-black/60 border border-slate-800 text-xs text-slate-300 font-mono rounded-lg px-2.5 py-1.5 outline-none"
            >
              <option value="all">All Students</option>
              {classStudents.map(s => (
                <option key={s.student_id} value={s.student_id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Activity rows */}
        <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto pr-1">
          {filteredActivities.length === 0 ? (
            <div className="py-8 text-center text-slate-500 font-mono text-xs">
              No matching activity events recorded for this filter.
            </div>
          ) : (
            filteredActivities.map(log => {
              const student = allStudents.find(s => s.student_id === log.student_id);
              return (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs font-mono hover:bg-slate-900/30 px-2 rounded-lg transition-all">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{student?.name || 'Student Scholar'}</span>
                      <span className="text-[10px] text-slate-500">
                        ({student?.class || 'Class 12 - Sec B'})
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                        log.category === 'Laboratory' ? 'bg-cyan-950/40 text-cyan-300 border border-cyan-800' :
                        log.category === 'Assessment' ? 'bg-amber-950/40 text-amber-300 border border-amber-800' :
                        log.category === 'AI Consultation' ? 'bg-purple-950/40 text-purple-300 border border-purple-800' :
                        'bg-blue-950/40 text-blue-300 border border-blue-800'
                      }`}>
                        {log.category}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs font-sans">{log.action}</p>
                    <span className="text-[10px] text-slate-500 block">
                      Feature: {log.feature_name} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(log.timestamp).toLocaleDateString()})
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-amber-400 font-bold text-xs">+{log.xpEarned} XP</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <AnimatePresence>
        {selectedStudentForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e1117] border border-cyan-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedStudentForModal.name}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      {selectedStudentForModal.class}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    ID: {selectedStudentForModal.student_id} • Last active: {new Date(selectedStudentForModal.last_active).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudentForModal(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Student Overview Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Overall Mastery</span>
                  <div className="text-2xl font-black text-cyan-300 font-mono mt-1">
                    {selectedStudentForModal.overall_mastery}%
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Total Solved</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">
                    {selectedStudentForModal.total_questions}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Accuracy</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {selectedStudentForModal.total_questions > 0 
                      ? Math.round((selectedStudentForModal.total_correct / selectedStudentForModal.total_questions) * 100) 
                      : 0}%
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Study Streak</span>
                  <div className="text-2xl font-black text-orange-400 font-mono mt-1">
                    {selectedStudentForModal.streak} days
                  </div>
                </div>
              </div>

              {/* Concept-by-Concept Mastery Breakdown */}
              <div className="space-y-3">
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <BookOpen size={14} className="text-cyan-400" />
                  Concept Mastery Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CHEMISTRY_CONCEPTS.map(concept => {
                    const m = selectedStudentForModal.masteries[concept.id];
                    const score = m ? m.mastery_score : 50;
                    return (
                      <div key={concept.id} className="p-3 bg-black/30 border border-slate-800 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{concept.name}</span>
                          <span className="font-mono font-extrabold text-cyan-300">{score}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${score >= 75 ? 'bg-emerald-400' : score < 50 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9.5px] font-mono text-slate-500">
                          <span>{m?.attempts || 0} attempts</span>
                          <span className="capitalize">Diff: {m?.current_difficulty || 'medium'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Recommended Intervention */}
              <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs uppercase">
                  <Sparkles size={14} /> Teacher Intervention Advisory
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedStudentForModal.recommendations?.[0]?.reason || 
                    "Assign foundational practice sets and review prerequisite bonding concepts before the upcoming laboratory assessment."}
                </p>
              </div>

              {/* Student Live Activity Ledger */}
              <div className="space-y-3">
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Activity size={14} className="text-purple-400" />
                  Recorded Activities & Lab History
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {featureLogs.filter(l => l.student_id === selectedStudentForModal.student_id).length === 0 ? (
                    <div className="p-3 text-center text-slate-500 font-mono text-xs bg-black/30 rounded-xl">
                      No recorded lab actions or quiz attempts yet for this student.
                    </div>
                  ) : (
                    featureLogs.filter(l => l.student_id === selectedStudentForModal.student_id).map(log => (
                      <div key={log.id} className="p-2.5 rounded-lg bg-black/40 border border-slate-800 text-xs font-mono flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold">{log.action}</div>
                          <div className="text-[10px] text-slate-500">
                            {log.feature_name} • {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <span className="text-amber-400 font-bold shrink-0">+{log.xpEarned} XP</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedStudentForModal(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Close Drill-Down
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
