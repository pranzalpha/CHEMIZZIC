/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Difficult Equation Solver & Redox Balancer
 * Parses complex chemical reactions, calculates oxidation states,
 * shows step-by-step equation balancing, and labels verification confidence.
 */

import React, { useState } from 'react';
import { solveChemicalEquation } from '../services/equationSolver';
import { EquationSolverResult } from '../types';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { 
  Calculator, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, 
  HelpCircle, ShieldCheck, Flame, BookOpen, RefreshCw, Zap,
  Activity, Play, Check, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EquationSolverTab: React.FC = () => {
  const { recordFeatureUsage } = useAuthAndQuiz();
  const [equationInput, setEquationInput] = useState<string>('KMnO4 + HCl');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EquationSolverResult | null>(() => {
    return solveChemicalEquation('KMnO4 + HCl');
  });

  const challengePresets = [
    { label: 'KMnO4 + HCl', desc: 'Permanganate Acidic Redox (16 HCl balancing)', category: 'Advanced Redox' },
    { label: 'Fe + O2', desc: 'Iron Oxidation & Rusting', category: 'Oxidation' },
    { label: 'C2H5OH + O2', desc: 'Ethanol Complete Combustion', category: 'Combustion' },
    { label: 'CaCO3', desc: 'Limestone Thermal Calcination (>840°C)', category: 'Thermal Decomposition' },
    { label: 'Fe2O3 + Al', desc: 'Thermite Energetics (Molten Fe)', category: 'Displacement' },
    { label: 'Cu + HNO3', desc: 'Copper Oxidizing Acid Attack (NO2 gas)', category: 'Acid Attack' }
  ];

  const handleSolve = async (queryToSolve?: string) => {
    const q = (queryToSolve || equationInput).trim();
    if (!q) return;

    setLoading(true);
    try {
      const res = await fetch('/api/reaction/solve-equation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactants: q })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        recordFeatureUsage(
          'reaction',
          'Difficult Equation Solver',
          `Solved and balanced: ${data.balancedEquation || q}`,
          'Calculations',
          30
        );
      } else {
        // Fallback to local equation solver service
        const localData = solveChemicalEquation(q);
        setResult(localData);
      }
    } catch (_) {
      const localData = solveChemicalEquation(q);
      setResult(localData);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
      case 'CALCULATED':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40';
      case 'PREDICTED':
        return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
      default:
        return 'text-purple-400 bg-purple-950/40 border-purple-500/40';
    }
  };

  return (
    <div className="space-y-6 select-text">
      
      {/* Header Banner */}
      <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Calculator className="text-cyan-400" size={22} />
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              Difficult Chemical Equation Solver & Redox Analyzer
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Stoichiometric Logic
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Input challenging chemical reactants to determine balanced products, step-by-step balancing logic, oxidation number assignments, and electron transfers.
          </p>
        </div>

        {/* Input & Action Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={equationInput}
            onChange={(e) => setEquationInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSolve()}
            placeholder="e.g. KMnO4 + HCl or Fe + O2"
            className="w-full md:w-64 px-4 py-2.5 rounded-xl bg-black/50 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-600"
          />
          <button
            onClick={() => handleSolve()}
            disabled={loading}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} className="fill-black" />}
            Solve
          </button>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
          Preset Benchmark Challenges:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {challengePresets.map(preset => (
            <button
              key={preset.label}
              onClick={() => {
                setEquationInput(preset.label);
                handleSolve(preset.label);
              }}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer font-mono ${equationInput === preset.label ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200' : 'border-slate-800 bg-[#0c0d12] text-slate-400 hover:border-slate-700 hover:text-white'}`}
            >
              <div className="text-xs font-bold truncate">{preset.label}</div>
              <div className="text-[9px] text-slate-500 truncate mt-0.5">{preset.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Solution Display */}
      {result && (
        <div className="space-y-6">
          
          {/* Main Balanced Formula Card */}
          <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 md:p-8 space-y-4 shadow-[0_0_40px_rgba(34,211,238,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border uppercase ${getStatusBadge(result.verificationStatus)}`}>
                  {result.verificationStatus}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Confidence: <strong className="text-cyan-300">{result.confidence}%</strong>
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Classification: <strong className="text-white">{result.reactionType}</strong>
              </span>
            </div>

            {/* Balanced Equation Big Display */}
            <div className="py-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">
                Stoichiometrically Balanced Equation
              </span>
              <div className="text-xl md:text-2xl font-mono font-bold text-white tracking-wide overflow-x-auto pb-1 text-cyan-200 selection:bg-cyan-950">
                {result.balancedEquation}
              </div>
            </div>

            {/* Uncertain / Parameter Warning Alert if applicable */}
            {result.isUncertain && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2.5 font-mono">
                <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                <span>{result.uncertaintyReason || 'Thermodynamic parameters required to resolve product distribution.'}</span>
              </div>
            )}

            {/* Chemical Explanation */}
            <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 uppercase">
                <BookOpen size={13} /> Reaction Mechanism & Thermodynamic Rationale
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Dual Columns: Step-by-Step Balancing Logic (Left) & Oxidation States / Redox (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Step-by-Step Balancing Explanations */}
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Zap size={14} className="text-cyan-400" /> Step-by-Step Stoichiometric Balancing
              </h3>

              <div className="space-y-3">
                {result.balancingSteps.map((step) => (
                  <div key={step.stepNumber} className="p-3.5 rounded-xl bg-black/30 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                        Step {step.stepNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {step.description}
                    </p>
                    <div className="font-mono text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      {step.intermediateEquation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oxidation States & Redox Tracking */}
            <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                <Activity size={14} className="text-cyan-400" /> Oxidation Numbers & Electron Flow
              </h3>

              {result.oxidationStates.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                          <th className="pb-2 text-left">Element</th>
                          <th className="pb-2 text-center">Initial State</th>
                          <th className="pb-2 text-center">Final State</th>
                          <th className="pb-2 text-right">Redox Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {result.oxidationStates.map((entry, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 font-bold text-white">{entry.element}</td>
                            <td className="py-2.5 text-center text-slate-300">{entry.initialState}</td>
                            <td className="py-2.5 text-center text-slate-300">{entry.finalState}</td>
                            <td className="py-2.5 text-right font-bold">
                              <span className={entry.change === 'Oxidized' ? 'text-orange-400' : entry.change === 'Reduced' ? 'text-emerald-400' : 'text-slate-500'}>
                                {entry.change}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Redox Agents Callout if present */}
                  {result.redoxDetails && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                        <span className="text-[10px] text-slate-500 block uppercase">Oxidizing Agent</span>
                        <span className="text-emerald-300 font-bold block mt-0.5">{result.redoxDetails.oxidizingAgent}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/20">
                        <span className="text-[10px] text-slate-500 block uppercase">Reducing Agent</span>
                        <span className="text-orange-300 font-bold block mt-0.5">{result.redoxDetails.reducingAgent}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic p-4 text-center">
                  Non-redox transformation. No oxidation state changes observed.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
