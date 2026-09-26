/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Programmatic AI Numerical Solver & Step-by-Step Dimensional Analyzer
 * Solves real chemistry numericals without LLM guessing by:
 * 1. Identifying the chemistry topic & governing law
 * 2. Extracting variables and verifying units
 * 3. Applying governing algebraic and thermodynamic equations
 * 4. Checking dimensional consistency
 * 5. Formatting transparent step-by-step arithmetic explanations
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, Sparkles, CheckCircle2, ArrowRight, HelpCircle, 
  RefreshCw, ShieldCheck, Flame, Zap, AlertTriangle, Layers, BookOpen
} from 'lucide-react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { NumericalSolveResult } from '../types/curriculum';
import { solveChemistryNumerical } from '../services/numericalEngine';

export const NUMERICAL_PRESET_PROBLEMS = [
  {
    title: 'Mole Calculations & Avogadro Particles',
    prompt: 'A sample contains m = 88 g of carbon dioxide CO2. Given molar mass M = 44 g/mol and Avogadro constant N_A = 6.022 × 10^23, calculate the number of moles and total molecules.',
    topic: 'Stoichiometry'
  },
  {
    title: 'Daniell Cell Nernst Equation (EMF Calculation)',
    prompt: 'Calculate the cell potential Ecell for a Daniell cell at 298 K where [Zn²⁺] = 0.05 M and [Cu²⁺] = 1.20 M. Standard cell potential E°cell = 1.10 V.',
    topic: 'Electrochemistry'
  },
  {
    title: 'Ideal Gas Law (PV = nRT)',
    prompt: 'Calculate the pressure P in atm exerted by n = 2.5 moles of ideal gas occupying volume V = 10.0 L at temperature T = 300 K (R = 0.0821 L·atm/(mol·K)).',
    topic: 'Physical Chemistry'
  },
  {
    title: 'Buffer Solution pH (Henderson-Hasselbalch)',
    prompt: 'Calculate the pH of an acetate buffer containing [acid] = 0.10 M acetic acid and [salt] = 0.20 M sodium acetate, given pKa = 4.76.',
    topic: 'Ionic Equilibrium'
  },
  {
    title: 'Weak Acid pH (Equilibrium Constant Ka)',
    prompt: 'Calculate the pH of a 0.15 M solution of acetic acid (CH3COOH) with Ka = 1.76 × 10⁻⁵ at 25°C.',
    topic: 'Ionic Equilibrium'
  },
  {
    title: 'Gibbs-Helmholtz Spontaneity Crossover Temperature',
    prompt: 'A reaction has standard enthalpy ΔH° = -92.2 kJ/mol and standard entropy ΔS° = -198.7 J/(mol·K). Calculate the crossover temperature in Kelvin above which the reaction becomes non-spontaneous.',
    topic: 'Thermodynamics'
  },
  {
    title: 'First-Order Decomposition Half-Life',
    prompt: 'A radioactive or first-order chemical decomposition has rate constant k = 0.045 s⁻¹. What is its half-life t1/2 in seconds?',
    topic: 'Chemical Kinetics'
  },
  {
    title: 'Faraday’s Law of Electrolysis Mass Deposited',
    prompt: 'A steady electric current of 3.0 Amperes is passed through a copper sulfate (CuSO4) electrolytic solution for 40 minutes (2400 seconds). Calculate the mass of copper (in grams) deposited at the cathode. (Cu atomic mass = 63.55 g/mol, F = 96485 C/mol).',
    topic: 'Electrochemistry'
  }
];

export const NumericalSolverTab: React.FC = () => {
  const { recordFeatureUsage } = useAuthAndQuiz();
  const [problemInput, setProblemInput] = useState<string>(NUMERICAL_PRESET_PROBLEMS[0].prompt);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<NumericalSolveResult | null>(null);

  // Programmatic numerical solver logic powered by deterministic numericalEngine
  const handleSolveNumerical = (customText?: string) => {
    const text = (customText || problemInput).trim();
    if (!text) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      try {
        const calculatedResult = solveChemistryNumerical(text);
        setResult(calculatedResult);
      } catch (err: any) {
        console.error('Numerical solve error:', err);
      } finally {
        setLoading(false);
        recordFeatureUsage(
          'phmeter',
          'AI Numerical Solver',
          `Solved numerical problem in chemistry`,
          'Calculations',
          25
        );
      }
    }, 250);
  };

  return (
    <div className="space-y-6 select-text">
      
      {/* Header Banner */}
      <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Calculator className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Numerical Solver & Dimensional Step-by-Step Calculator
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Dimensional Verifier
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Solves chemistry numerical problems programmatically: identifies topic, extracts variables, applies governing formulas, verifies dimensions, and computes verified exact solutions.
          </p>
        </div>
      </div>

      {/* Preset Problem Buttons */}
      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
          Preset Benchmark Problems:
        </label>
        <div className="flex flex-wrap gap-2">
          {NUMERICAL_PRESET_PROBLEMS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setProblemInput(preset.prompt);
                handleSolveNumerical(preset.prompt);
              }}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 text-xs font-mono transition cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Enter or Paste Chemistry Numerical Problem:
          </label>
          <textarea
            rows={3}
            value={problemInput}
            onChange={(e) => setProblemInput(e.target.value)}
            placeholder="e.g. Calculate the cell potential Ecell for a Daniell cell at 298 K where [Zn²⁺] = 0.05 M and [Cu²⁺] = 1.20 M..."
            className="w-full bg-black/50 border border-slate-800 text-slate-200 text-xs font-sans rounded-xl p-3.5 outline-none focus:border-cyan-400"
          />
        </div>

        <button
          onClick={() => handleSolveNumerical()}
          disabled={loading || !problemInput.trim()}
          className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          {loading ? (
            <>
              <RefreshCw size={14} className="animate-spin" /> Solving Problem...
            </>
          ) : (
            <>
              <Sparkles size={14} /> Solve Numerical Step-by-Step
            </>
          )}
        </button>
      </div>

      {/* Numerical Results Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0B0E] border border-cyan-500/30 rounded-2xl p-6 md:p-8 space-y-6 select-text"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  {result.identifiedTopic}
                </span>
                <h3 className="text-lg font-bold text-white font-sans mt-0.5">
                  {result.detectedConcept}
                </h3>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 self-start">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Verification: {result.verificationStatus}</span>
              </div>
            </div>

            {/* Extracted Variables Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                Extracted Variables & Standard Units:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {result.extractedVariables.map((v, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#111318] border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between items-center text-slate-400 text-[10px]">
                      <span>{v.name}</span>
                      <strong className="text-cyan-300">{v.symbol}</strong>
                    </div>
                    <div className="text-white font-bold text-sm">
                      {v.value} <span className="text-xs text-slate-400">{v.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Governing Formula */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-black/80 to-cyan-950/20 border border-cyan-500/20 space-y-1.5 font-mono">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Governing Chemical Formula:</span>
              <div className="text-sm font-bold text-cyan-300">{result.governingFormula}</div>
            </div>

            {/* Step-by-Step Calculation */}
            <div className="space-y-3 font-sans">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                Step-by-Step Mathematical & Chemical Resolution:
              </span>
              <div className="space-y-2">
                {result.stepByStepSolution.map((s) => (
                  <div key={s.step} className="p-3.5 rounded-xl bg-[#111318] border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-[10px]">
                        {s.step}
                      </span>
                      <span>{s.instruction}</span>
                    </div>
                    <div className="pl-7 font-mono text-slate-300 text-[11.5px]">
                      {s.expression} ➔ <strong className="text-emerald-300">{s.subResult}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dimensional Consistency Check */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 text-xs font-mono space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} /> Dimensional Consistency Validation:
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {result.dimensionalConsistencyCheck}
              </p>
            </div>

            {/* Final Answer Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">Final Calculated Answer:</span>
                <div className="text-2xl font-mono font-black text-white mt-0.5">{result.finalAnswer.formatted}</div>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="text-xs text-slate-400 font-sans leading-relaxed border-t border-slate-800 pt-3">
              <strong>Pedagogical Insight:</strong> {result.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
