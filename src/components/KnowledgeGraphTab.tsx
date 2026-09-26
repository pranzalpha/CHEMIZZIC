/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Interactive Concept Knowledge Graph
 * Visualizes hierarchical prerequisite relationships, conceptual dependencies,
 * and live student mastery across the chemistry syllabus.
 */

import React, { useState, useMemo } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { CHEMISTRY_CONCEPTS, ChemistryConcept } from '../data/chemistryConcepts';
import { 
  GitBranch, Sparkles, BookOpen, ArrowRight, Zap, Target, 
  CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight,
  Flame, Award, Layers, Compass, Play, RefreshCw, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KnowledgeGraphTabProps {
  onStartPractice?: (conceptId: string, difficulty?: 'easy' | 'medium' | 'hard') => void;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

export const KnowledgeGraphTab: React.FC<KnowledgeGraphTabProps> = ({ onStartPractice }) => {
  const { studentProfile, spacedRepetitionSchedule } = useAuthAndQuiz();
  const [selectedConceptId, setSelectedConceptId] = useState<string>('atomic_structure');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Physical' | 'Inorganic' | 'Organic'>('All');

  // Node coordinates on a 1000x560 virtual SVG grid
  const nodePositions: Record<string, { x: number; y: number }> = {
    atomic_structure: { x: 120, y: 150 },
    quantum_numbers: { x: 300, y: 80 },
    periodic_properties: { x: 490, y: 80 },
    chemical_bonding: { x: 670, y: 150 },
    molecular_structure: { x: 860, y: 150 },
    thermodynamics: { x: 260, y: 350 },
    chemical_equilibrium: { x: 470, y: 350 },
    acids_and_bases: { x: 680, y: 440 },
    electrochemistry: { x: 470, y: 470 },
    organic_chemistry: { x: 860, y: 350 }
  };

  const selectedConcept = useMemo(() => {
    return CHEMISTRY_CONCEPTS.find(c => c.id === selectedConceptId) || CHEMISTRY_CONCEPTS[0];
  }, [selectedConceptId]);

  const selectedMastery = studentProfile.masteries[selectedConcept.id] || {
    mastery_score: 50,
    accuracy: 50,
    attempts: 0,
    current_difficulty: 'medium' as const,
    trend: 'stable' as const
  };

  const selectedSpaced = spacedRepetitionSchedule[selectedConcept.id];

  // Prerequisites concepts objects
  const prerequisiteConcepts = useMemo(() => {
    return selectedConcept.prerequisites
      .map(pid => CHEMISTRY_CONCEPTS.find(c => c.id === pid))
      .filter((c): c is ChemistryConcept => Boolean(c));
  }, [selectedConcept]);

  // Concepts that depend on the selected one
  const successorConcepts = useMemo(() => {
    return CHEMISTRY_CONCEPTS.filter(c => c.prerequisites.includes(selectedConcept.id));
  }, [selectedConcept]);

  // Edges definition (prerequisite -> dependent)
  const edges = useMemo(() => {
    const list: { from: string; to: string; active: boolean }[] = [];
    CHEMISTRY_CONCEPTS.forEach(concept => {
      concept.prerequisites.forEach(prereqId => {
        list.push({
          from: prereqId,
          to: concept.id,
          active: concept.id === selectedConceptId || prereqId === selectedConceptId
        });
      });
    });
    return list;
  }, [selectedConceptId]);

  const getNodeColor = (score: number) => {
    if (score >= 75) return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', glow: 'rgba(16, 185, 129, 0.3)', text: 'text-emerald-400' };
    if (score >= 50) return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', glow: 'rgba(245, 158, 11, 0.3)', text: 'text-amber-400' };
    return { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.15)', glow: 'rgba(239, 68, 68, 0.3)', text: 'text-red-400' };
  };

  return (
    <div className="space-y-6 select-text">
      
      {/* Header Banner */}
      <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <GitBranch className="text-cyan-400" size={22} />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Chemistry Concept Knowledge Graph & Syllabus Map
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Adaptive Hierarchy
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Explore conceptual dependency trees and prerequisite pathways. Concepts are live color-coded by your calculated mastery index (<span className="text-emerald-400">≥75% Mastered</span>, <span className="text-amber-400">50-74% Learning</span>, <span className="text-red-400">&lt;50% Remedial</span>).
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          {(['All', 'Physical', 'Inorganic', 'Organic'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${categoryFilter === cat ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-slate-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace: Graph Canvas (Left) + Detail Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Graph Canvas */}
        <div className="lg:col-span-2 bg-[#0c0d12] border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[460px] shadow-inner">
          
          {/* Subtle Grid Canvas Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SVG Map Container */}
          <div className="w-full aspect-[16/9] max-w-[960px] relative">
            <svg viewBox="0 0 1000 560" className="w-full h-full drop-shadow-md">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#0891b2" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
                </marker>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Dependency Connection Lines */}
              {edges.map((edge, i) => {
                const start = nodePositions[edge.from];
                const end = nodePositions[edge.to];
                if (!start || !end) return null;

                return (
                  <g key={`edge-${i}`}>
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={edge.active ? '#22d3ee' : '#334155'}
                      strokeWidth={edge.active ? 2.5 : 1.5}
                      strokeDasharray={edge.active ? 'none' : '4 4'}
                      markerEnd={edge.active ? 'url(#arrow-active)' : 'url(#arrow)'}
                      className={edge.active ? 'animate-pulse' : 'opacity-40'}
                    />
                  </g>
                );
              })}

              {/* Concept Nodes */}
              {CHEMISTRY_CONCEPTS.map(concept => {
                const pos = nodePositions[concept.id];
                if (!pos) return null;

                const mastery = studentProfile.masteries[concept.id]?.mastery_score ?? 50;
                const colors = getNodeColor(mastery);
                const isSelected = concept.id === selectedConceptId;
                const isDimmed = categoryFilter !== 'All' && concept.category !== categoryFilter;

                return (
                  <g
                    key={concept.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelectedConceptId(concept.id)}
                    className="cursor-pointer group"
                    opacity={isDimmed ? 0.25 : 1}
                  >
                    {/* Ripple / Selected Halo */}
                    {isSelected && (
                      <circle
                        r="38"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-spin"
                        style={{ animationDuration: '8s' }}
                      />
                    )}

                    {/* Node Body Circle */}
                    <circle
                      r="28"
                      fill={isSelected ? '#0f172a' : colors.fill}
                      stroke={isSelected ? '#22d3ee' : colors.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      filter={isSelected ? 'url(#glow)' : undefined}
                      className="transition-all duration-300 group-hover:scale-110"
                    />

                    {/* Mastery Percentage Text */}
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={colors.stroke}
                    >
                      {mastery}%
                    </text>

                    {/* Concept Label Pill below node */}
                    <g transform="translate(0, 42)">
                      <rect
                        x="-70"
                        y="-10"
                        width="140"
                        height="20"
                        rx="10"
                        fill="#0b0f19"
                        stroke={isSelected ? '#22d3ee' : '#1e293b'}
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dy="3"
                        fontSize="9"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        fill={isSelected ? '#ffffff' : '#94a3b8'}
                      >
                        {concept.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Graph Legend Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400 mt-2 border-t border-slate-800/80 pt-3 w-full">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
              Mastered (≥75%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-500/20" />
              Developing (50-74%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 ring-2 ring-red-500/20" />
              Needs Review (&lt;50%)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <ArrowRight size={12} /> Prerequisite Flow
            </span>
          </div>

        </div>

        {/* Concept Inspector Panel (Right) */}
        <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {selectedConcept.category} Chemistry
                </span>
                <span className={`text-xs font-mono font-bold ${selectedMastery.mastery_score >= 75 ? 'text-emerald-400' : selectedMastery.mastery_score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  Mastery: {selectedMastery.mastery_score}%
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2">
                {selectedConcept.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedConcept.description}
              </p>
            </div>

            {/* Performance Metrics Cards */}
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 block uppercase">Accuracy</span>
                <span className="text-base font-bold text-white">{selectedMastery.accuracy}%</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{selectedMastery.correct_attempts} / {selectedMastery.attempts} correct</span>
              </div>
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 block uppercase">Spaced Review</span>
                <span className={`text-xs font-bold ${selectedSpaced?.is_due ? 'text-orange-400' : 'text-cyan-300'}`}>
                  {selectedSpaced?.is_due ? 'Due Today ⚡' : selectedSpaced?.next_review_date || 'Scheduled'}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Ease: {selectedSpaced?.ease_factor || 2.5}</span>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Foundational Prerequisites:
              </span>
              {prerequisiteConcepts.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-2.5 rounded-lg bg-black/20 border border-slate-900">
                  Fundamental starting concept (No prior prerequisites).
                </div>
              ) : (
                <div className="space-y-1.5">
                  {prerequisiteConcepts.map(prereq => {
                    const prereqMastery = studentProfile.masteries[prereq.id]?.mastery_score ?? 50;
                    return (
                      <button
                        key={prereq.id}
                        onClick={() => setSelectedConceptId(prereq.id)}
                        className="w-full p-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 bg-black/30 flex items-center justify-between text-left text-xs transition-all cursor-pointer group"
                      >
                        <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
                          {prereq.name}
                        </span>
                        <span className={`font-mono text-[11px] ${prereqMastery >= 75 ? 'text-emerald-400' : prereqMastery >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {prereqMastery}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Successor Concepts */}
            {successorConcepts.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Unlocks Advanced Topics:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {successorConcepts.map(succ => (
                    <button
                      key={succ.id}
                      onClick={() => setSelectedConceptId(succ.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-[11px] font-mono cursor-pointer transition-all"
                    >
                      {succ.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Governing Formulas & Rules */}
            {selectedConcept.keyFormulasAndRules && selectedConcept.keyFormulasAndRules.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                  Key Formulas & Rules:
                </span>
                <div className="space-y-1">
                  {selectedConcept.keyFormulasAndRules.map((rule, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20 font-mono text-[11px] text-cyan-200">
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => onStartPractice && onStartPractice(selectedConcept.id, selectedMastery.current_difficulty)}
            className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play size={14} className="fill-black" /> Practice {selectedConcept.name}
          </button>

        </div>

      </div>

    </div>
  );
};
