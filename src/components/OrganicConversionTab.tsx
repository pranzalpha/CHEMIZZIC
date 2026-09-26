/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChemiZIC Organic Conversion Lab Tab
 * Multi-step organic conversion route viewer with reagent reasoning.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical, Search, ArrowDown, Sparkles, CheckCircle2,
  AlertTriangle, Info, Beaker, ChevronRight, BookOpen
} from 'lucide-react';
import {
  ORGANIC_CONVERSION_DATABASE,
  findConversionRoute,
  searchConversionRoutes,
  getAllConversions,
  OrganicConversionRoute,
  ConversionStep
} from '../services/organicConversionEngine';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';

interface OrganicConversionTabProps {
  onAskAI?: (context: string) => void;
}

const CONVERSION_EXAMPLES = [
  { from: 'Ethanol', to: 'Ethanoic Acid' },
  { from: 'Ethanol', to: 'Ethene' },
  { from: 'Benzene', to: 'Phenol' },
  { from: 'Benzene', to: 'Aniline' },
  { from: 'Ethene', to: 'Ethanol' }
];

const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Beginner', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Expert'
};

export const OrganicConversionTab: React.FC<OrganicConversionTabProps> = ({ onAskAI }) => {
  const { recordFeatureUsage } = useAuthAndQuiz();
  const [startCompound, setStartCompound] = useState('');
  const [targetCompound, setTargetCompound] = useState('');
  const [route, setRoute] = useState<OrganicConversionRoute | null>(null);
  const [searchResults, setSearchResults] = useState<OrganicConversionRoute[]>(ORGANIC_CONVERSION_DATABASE.slice(0, 5));
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 0: true });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleFind = () => {
    if (!startCompound.trim() || !targetCompound.trim()) return;
    const found = findConversionRoute(startCompound, targetCompound);
    if (found) {
      setRoute(found);
      setExpandedSteps({ 0: true });
      setAiResult(null);
      recordFeatureUsage('explorer', 'Organic Conversion Lab', `${startCompound} → ${targetCompound}`, 'Exploration', 20);
    } else {
      setRoute(null);
    }
  };

  const handleSearchQuery = (q: string) => {
    const results = searchConversionRoutes(q);
    setSearchResults(results);
  };

  const handleSelectRoute = (r: OrganicConversionRoute) => {
    setRoute(r);
    setExpandedSteps({ 0: true });
    setAiResult(null);
    recordFeatureUsage('explorer', 'Organic Conversion Lab', `${r.startingCompound} → ${r.targetCompound}`, 'Exploration', 20);
  };

  const handleAskAI = async () => {
    if (!route) return;
    const context = `Organic conversion: ${route.startingCompound} → ${route.targetCompound}. ${route.numberOfSteps} steps. Route: ${route.overallReaction}`;
    if (onAskAI) { onAskAI(context); return; }
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/organic-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: route.startingCompound, to: route.targetCompound, context })
      });
      const data = await res.json();
      setAiResult(data.response || data.route || JSON.stringify(data));
    } catch {
      setAiError('AI Chemist unavailable. Gemini API key required.');
    } finally {
      setAiLoading(false);
    }
  };

  const toggleStep = (i: number) => setExpandedSteps(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="text-emerald-400" size={24} />
          <h2 className="text-xl font-black text-white font-mono">ORGANIC CONVERSION LAB</h2>
          <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full font-mono">VERIFIED</span>
        </div>
        <p className="text-slate-400 text-xs font-sans">
          Step-by-step organic conversion routes with reagents, conditions, mechanism types, and reasoning for each step.
        </p>
      </div>

      {/* Input Panel */}
      <div className="bg-[#111318] border border-slate-700/40 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            value={startCompound}
            onChange={e => { setStartCompound(e.target.value); handleSearchQuery(e.target.value); }}
            placeholder="Starting compound (e.g. Ethanol)"
            className="bg-black/40 border border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-cyan-100 placeholder:text-slate-600 outline-none focus:border-emerald-400/60 font-mono"
          />
          <input
            type="text"
            value={targetCompound}
            onChange={e => setTargetCompound(e.target.value)}
            placeholder="Target compound (e.g. Ethanoic Acid)"
            className="bg-black/40 border border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-cyan-100 placeholder:text-slate-600 outline-none focus:border-emerald-400/60 font-mono"
          />
          <button
            onClick={handleFind}
            className="px-6 py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono hover:bg-emerald-500/30 cursor-pointer transition font-bold"
          >
            FIND ROUTE
          </button>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CONVERSION_EXAMPLES.map(ex => (
            <button
              key={ex.from + ex.to}
              onClick={() => { setStartCompound(ex.from); setTargetCompound(ex.to); findConversionRoute(ex.from, ex.to) && handleFind(); handleSelectRoute(findConversionRoute(ex.from, ex.to)!); }}
              className="px-3 py-1 bg-slate-800/60 border border-slate-700/50 rounded-lg text-[10px] font-mono text-slate-400 hover:text-emerald-300 hover:border-emerald-500/50 cursor-pointer transition"
            >
              {ex.from} → {ex.to}
            </button>
          ))}
        </div>

        {/* Browse results */}
        {!route && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map(r => (
              <button
                key={r.id}
                onClick={() => handleSelectRoute(r)}
                className="text-left bg-black/30 border border-slate-700/40 hover:border-emerald-500/50 hover:bg-emerald-950/20 rounded-xl p-4 transition cursor-pointer group"
              >
                <div className="text-xs font-bold text-emerald-300 mb-1 font-mono group-hover:text-emerald-200">
                  {r.startingCompound.split('(')[0].trim()}
                </div>
                <ArrowDown size={10} className="text-slate-500 mb-1" />
                <div className="text-xs font-bold text-cyan-300 mb-2 font-mono">
                  {r.targetCompound.split('(')[0].trim()}
                </div>
                <div className="text-[10px] text-slate-500">{r.numberOfSteps} step{r.numberOfSteps > 1 ? 's' : ''} · {DIFFICULTY_LABELS[r.difficulty]}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Route Viewer */}
      <AnimatePresence>
        {route && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Route header */}
            <div className="bg-[#111318] border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-black text-emerald-300 font-mono">{route.startingCompound.split('(')[0].trim()}</span>
                    <ArrowDown size={16} className="text-slate-400" />
                    <span className="text-lg font-black text-cyan-300 font-mono">{route.targetCompound.split('(')[0].trim()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-400 font-mono">{route.numberOfSteps} steps</span>
                    <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded px-2 py-0.5 font-mono">{DIFFICULTY_LABELS[route.difficulty]}</span>
                    <span className={`text-[10px] border rounded px-2 py-0.5 font-mono ${route.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'}`}>
                      {route.verificationStatus}
                    </span>
                  </div>
                </div>
                <button onClick={() => setRoute(null)} className="text-slate-500 hover:text-white text-xs cursor-pointer">✕</button>
              </div>

              {/* Overall Reaction */}
              <div className="bg-black/40 rounded-xl p-4 border border-emerald-500/20 mb-4">
                <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">Overall Route</div>
                <div className="text-sm text-emerald-200 font-mono">{route.overallReaction}</div>
              </div>

              <p className="text-xs text-slate-400">{route.routeSummary}</p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {route.steps.map((step, i) => (
                <div key={i} className="bg-[#111318] border border-slate-700/40 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleStep(i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-slate-800/30 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm font-black text-emerald-300">
                        {step.stepNumber}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">
                          {step.from.split('(')[0].trim()} → {step.to.split('(')[0].trim()}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{step.mechanismType}</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className={`text-slate-500 transition-transform ${expandedSteps[i] ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedSteps[i] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6"
                      >
                        <div className="border-t border-slate-700/30 pt-4 space-y-3">
                          {/* Reagents & Conditions */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-3">
                              <div className="text-[10px] text-blue-400 font-mono uppercase mb-2">Reagents</div>
                              {step.reagents.map((r, ri) => (
                                <div key={ri} className="text-xs text-blue-200 font-mono mb-1">• {r}</div>
                              ))}
                            </div>
                            <div className="bg-yellow-950/20 border border-yellow-500/20 rounded-xl p-3">
                              <div className="text-[10px] text-yellow-400 font-mono uppercase mb-1">Conditions</div>
                              <div className="text-xs text-yellow-200">{step.conditions}</div>
                              {step.temperature && <div className="text-[10px] text-yellow-400 mt-1">T: {step.temperature}</div>}
                              {step.solvent && <div className="text-[10px] text-yellow-400">Solvent: {step.solvent}</div>}
                            </div>
                          </div>

                          {/* Why this reagent */}
                          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4">
                            <div className="text-[10px] text-emerald-400 font-mono uppercase mb-2">🔬 Why This Reagent?</div>
                            <p className="text-xs text-emerald-100 leading-relaxed">{step.whyThisReagent}</p>
                          </div>

                          {/* Why not alternative */}
                          {step.whyNotAlternative && (
                            <div className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-3">
                              <div className="text-[10px] text-orange-400 font-mono uppercase mb-1">Why Not Another Reagent?</div>
                              <p className="text-xs text-orange-100 leading-relaxed">{step.whyNotAlternative}</p>
                            </div>
                          )}

                          {/* Alternative reagent */}
                          {step.alternativeReagent && (
                            <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-3">
                              <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">Alternative Reagent</div>
                              <div className="text-xs text-slate-300">{step.alternativeReagent}</div>
                            </div>
                          )}

                          {/* Limitations */}
                          {step.limitations && (
                            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3">
                              <div className="text-[10px] text-red-400 font-mono uppercase mb-1">⚠️ Limitations</div>
                              <div className="text-xs text-red-200">{step.limitations}</div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Key Reagent Highlight & Exam Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-5">
                <div className="text-xs font-bold text-cyan-300 font-mono mb-3 flex items-center gap-2">
                  <Beaker size={12} /> KEY REAGENT HIGHLIGHT
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{route.keyReagentHighlight}</p>
              </div>
              <div className="bg-[#111318] border border-yellow-500/20 rounded-2xl p-5">
                <div className="text-xs font-bold text-yellow-300 font-mono mb-3 flex items-center gap-2">
                  <BookOpen size={12} /> EXAM TIPS
                </div>
                <ul className="space-y-2">
                  {route.examTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-yellow-400 shrink-0">★</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ask AI */}
            <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-2">
                  <Sparkles size={12} /> NEED A DIFFERENT ROUTE OR AI EXPLANATION?
                </div>
                <button
                  onClick={handleAskAI}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono hover:bg-cyan-500/30 cursor-pointer transition disabled:opacity-50"
                >
                  {aiLoading ? <span className="w-3 h-3 border border-t-cyan-400 rounded-full animate-spin" /> : <Sparkles size={10} />}
                  {aiLoading ? 'Asking...' : 'Ask AI Chemist'}
                </button>
              </div>
              {aiResult && (
                <div className="mt-4 bg-black/30 rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">{aiResult}</div>
              )}
              {aiError && (
                <div className="mt-3 bg-red-950/30 rounded-xl p-3 border border-red-500/30 text-xs text-red-300">{aiError}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganicConversionTab;
