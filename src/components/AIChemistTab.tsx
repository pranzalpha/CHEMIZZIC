/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ExplainResponse } from '../types';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { 
  Send, HelpCircle, GraduationCap, Microscope, ShieldAlert, Sparkles, 
  BookOpen, AlertCircle, Volume2, VolumeX, Lightbulb, Play, ArrowRight,
  Brain, CheckCircle2, RotateCcw, MessageSquare, Zap, Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIChemistTab() {
  const { recordFeatureUsage } = useAuthAndQuiz();
  const [topicInput, setTopicInput] = useState<string>('Benzene & Aromatic Stability');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExplainResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tutor Perspective Mode
  const [tutorMode, setTutorMode] = useState<'student' | 'scientist' | 'problemsolver' | 'lab'>('student');

  // Audio Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Problem Solver State
  const [mathProblem, setMathProblem] = useState<string>('');
  const [mathSolution, setMathSolution] = useState<string | null>(null);
  const [loadingMath, setLoadingMath] = useState<boolean>(false);

  // Curriculum Modules
  const curriculumModules = [
    { title: "Nernst Equation & Cell Potential", query: "Explain how to calculate cell EMF using the Nernst Equation E = E° - (0.0591/n)log(Q)", category: "Electrochem" },
    { title: "SN1 vs SN2 Nucleophilic Substitution", query: "Compare SN1 and SN2 reaction mechanisms, carbocation intermediates, inversion of stereochemistry, and solvent effects", category: "Organic" },
    { title: "Gibbs Free Energy & Spontaneity", query: "Explain Gibbs Free Energy ΔG = ΔH - TΔS, spontaneous equilibrium conditions, and temperature thresholds", category: "Thermodynamics" },
    { title: "VSEPR Shapes & Hybridization", query: "Explain VSEPR theory, steric numbers, sp, sp2, sp3 hybridization, and molecular bond angles", category: "Inorganic" },
    { title: "Henderson-Hasselbalch Buffer pH", query: "Explain buffer solutions, common ion effect, and how to calculate pH with pH = pKa + log([A-]/[HA])", category: "Analytical" },
    { title: "Diels-Alder [4+2] Cycloaddition", query: "Explain the stereospecific mechanism of Diels-Alder cycloaddition between a conjugated diene and dienophile", category: "Organic" }
  ];

  const handleAsk = async (chemical: string, customQuestion?: string) => {
    const chemicalName = chemical.trim();
    if (!chemicalName) return;

    // Stop previous audio if speaking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/chemical/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chemicalName, customQuestion })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Chemist database.");
      }

      const data: ExplainResponse = await response.json();
      setResult(data);
      recordFeatureUsage(
        'chemist',
        'AI Chemist Tutor Full Mode',
        `Consulted tutor on ${chemicalName}${customQuestion ? `: "${customQuestion.substring(0, 30)}..."` : ''}`,
        'AI Consultation',
        25
      );
    } catch (err: any) {
      console.error(err);
      setError("AI explanation generated an issue. Verify network or API key configuration.");
    } finally {
      setLoading(false);
    }
  };

  // Text to Speech Narrator
  const toggleSpeech = (textToRead: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown before speaking
    const cleanText = textToRead.replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Step-by-Step Problem Solver
  const handleSolveProblem = async (problemText: string) => {
    const q = (problemText || mathProblem).trim();
    if (!q) return;

    setLoadingMath(true);
    try {
      const res = await fetch('/api/chemist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Solve this chemistry problem step-by-step with clear formulas, unit conversions, and calculations:\n"${q}"`,
          context: 'AI Chemist Step-by-Step Mathematical Solver'
        })
      });

      if (!res.ok) throw new Error('Solver service offline.');
      const data = await res.json();
      setMathSolution(data.reply || 'Step-by-step solution completed.');
      recordFeatureUsage(
        'chemist',
        'AI Chemist Problem Solver',
        `Solved chemistry problem: "${q.substring(0, 35)}..."`,
        'Calculations',
        30
      );
    } catch (e: any) {
      setMathSolution(`Here is how to solve this problem:\n1. Identify given quantities and units.\n2. Convert temperature to Kelvin: T(K) = °C + 273.15.\n3. Apply governing stoichiometric or thermodynamic equations.\n4. Check dimensional analysis.`);
    } finally {
      setLoadingMath(false);
    }
  };

  return (
    <div className="space-y-6 select-text">
      
      {/* TOP HERO & TUTOR CONTROLS */}
      <div className="bg-gradient-to-r from-emerald-950/30 via-[#111318] to-cyan-950/20 border border-emerald-500/20 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <GraduationCap size={20} />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                AI Chemist Tutor — Full Laboratory & Academic Advisor
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
                Interactive Voice Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Comprehensive chemical guidance, quantum orbital mechanisms, step-by-step problem solver, and voice-assisted academic tutoring.
            </p>
          </div>

          {/* Perspective Mode Switcher */}
          <div className="flex p-1 bg-black/60 border border-slate-800 rounded-xl font-mono text-xs shrink-0 flex-wrap">
            {[
              { id: 'student', label: 'Student Mode 🎓' },
              { id: 'scientist', label: 'Scientist Mode 🔬' },
              { id: 'problemsolver', label: 'Problem Solver 📐' },
              { id: 'lab', label: 'Lab & Safety 🛡️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTutorMode(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  tutorMode === tab.id
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT QUERY FORM */}
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleAsk(topicInput, customQuery); 
          }} 
          className="space-y-3 font-mono"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Chemical / Concept / Topic:
              </label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Benzene, Caffeine, Nernst Equation..."
                className="w-full text-xs bg-[#0A0B0E] px-4 py-2.5 border border-slate-800 focus:border-emerald-400 rounded-xl outline-none font-mono font-bold text-emerald-200"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Custom Academic Inquiry or Homework Question (Optional):
              </label>
              <div className="relative flex">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Explain its stereochemistry orbital bonds / or simplify with analogy..."
                  className="flex-1 text-xs bg-[#0A0B0E] pl-4 pr-24 py-2.5 border border-slate-800 focus:border-emerald-400 rounded-xl outline-none text-white font-sans"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 top-1 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {loading ? (
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={12} className="fill-black" />
                  )}
                  Consult
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* CURRICULUM MODULE CHIPS */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
          <span className="text-slate-500 uppercase tracking-wider">Curriculum Pillars:</span>
          {curriculumModules.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTopicInput(m.title);
                setCustomQuery(m.query);
                handleAsk(m.title, m.query);
              }}
              className="px-2.5 py-1 bg-black/40 border border-slate-800 hover:bg-emerald-950/40 hover:border-emerald-500/40 hover:text-emerald-300 text-slate-400 rounded-lg transition-all cursor-pointer"
            >
              {m.title}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-4 flex gap-3 text-rose-200 text-xs font-mono">
          <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">AI Chemist Notice</h4>
            <p className="mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="bg-[#111318] border border-emerald-500/20 rounded-2xl p-12 text-center space-y-3 font-mono">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white">Synthesizing Chemical Reasoning & Pedagogical Insights...</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Formulating multi-perspective explanations, molecular orbital models, and safety directives.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP-BY-STEP PROBLEM SOLVER TAB */}
      {/* ========================================================================= */}
      {tutorMode === 'problemsolver' && (
        <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 shadow-sm space-y-4 font-mono">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator size={18} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Step-by-Step Chemistry Problem Solver & Derivation Engine
            </h3>
          </div>

          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Paste any stoichiometry, thermodynamics, buffer pH, or equilibrium problem from your exams or lab work. The AI Chemist Tutor breaks down every single calculation step!
          </p>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={mathProblem}
              onChange={(e) => setMathProblem(e.target.value)}
              placeholder="e.g. Calculate the pH of a solution containing 0.15 M acetic acid and 0.20 M sodium acetate (Ka = 1.8 × 10⁻⁵)..."
              className="w-full bg-[#0A0B0E] border border-slate-800 focus:border-cyan-400 rounded-xl p-3.5 text-xs text-white outline-none font-mono resize-none"
            />

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMathProblem("Calculate the cell EMF of Zn(s) | Zn2+(0.01M) || Cu2+(1.0M) | Cu(s) at 298 K given E°cell = +1.10 V.")}
                  className="text-[10px] text-cyan-400/80 hover:text-cyan-300 underline cursor-pointer"
                >
                  Try: Nernst Cell EMF
                </button>
                <span className="text-slate-700">•</span>
                <button
                  type="button"
                  onClick={() => setMathProblem("What is the pH of 0.05 M HCl mixed with 0.02 M NaOH in a total volume of 1.0 L?")}
                  className="text-[10px] text-cyan-400/80 hover:text-cyan-300 underline cursor-pointer"
                >
                  Try: Strong Acid-Base
                </button>
              </div>

              <button
                onClick={() => handleSolveProblem(mathProblem)}
                disabled={loadingMath || !mathProblem.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
              >
                {loadingMath ? (
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles size={13} className="text-black" />
                )}
                Solve Step-by-Step
              </button>
            </div>
          </div>

          {/* Solution display */}
          {mathSolution && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-black/50 border border-cyan-500/30 rounded-xl space-y-3 font-sans"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Full Derivation & Answer:
                </span>
                <button
                  onClick={() => toggleSpeech(mathSolution)}
                  className="text-[10.5px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {isSpeaking ? <VolumeX size={13} className="text-rose-400" /> : <Volume2 size={13} />}
                  {isSpeaking ? 'Mute Narrator' : 'Listen Out Loud'}
                </button>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {mathSolution}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EXPLANATION RESULTS DISPLAY */}
      {/* ========================================================================= */}
      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Title Strip & Voice Audio Control */}
          <div className="bg-[#111318] border border-emerald-500/25 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">
                Educational Consultation Result
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif tracking-tight mt-0.5">
                {result.chemicalName}
              </h3>
            </div>

            {/* Voice Audio Listen Button */}
            <button
              onClick={() => {
                const text = tutorMode === 'scientist' 
                  ? result.scientistExplanation 
                  : tutorMode === 'lab' 
                  ? result.safetySummary 
                  : result.studentExplanation;
                toggleSpeech(text);
              }}
              className={`px-4 py-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isSpeaking 
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                  : 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400 text-emerald-300 shadow-sm'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX size={15} /> Pause Reading Voice
                </>
              ) : (
                <>
                  <Volume2 size={15} /> Listen Out Loud (Voice Tutor)
                </>
              )}
            </button>
          </div>

          {/* MAIN CONTENT PERSPECTIVES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Primary Explanation Box (2 cols) */}
            <div className="lg:col-span-2 bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-4 leading-relaxed font-sans text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  {tutorMode === 'scientist' ? (
                    <><Microscope size={15} /> Quantum & Scientific Mechanics Mode</>
                  ) : tutorMode === 'lab' ? (
                    <><ShieldAlert size={15} /> Laboratory Protocol & Safety Directives</>
                  ) : (
                    <><GraduationCap size={15} /> Conceptual Foundation & Analogies (Student Mode)</>
                  )}
                </span>

                <span className="text-[10px] font-mono text-slate-500">
                  Mode: <strong className="text-white capitalize">{tutorMode}</strong>
                </span>
              </div>

              {/* Dynamic text based on mode */}
              <div className="text-slate-200 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
                {tutorMode === 'scientist' 
                  ? result.scientistExplanation 
                  : tutorMode === 'lab' 
                  ? result.safetySummary 
                  : result.studentExplanation}
              </div>

              {/* Action shortcuts */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-ai-chemist-tutor', {
                        detail: {
                          prompt: `Give me 3 practice multiple-choice questions on ${result.chemicalName} with step-by-step explanations.`
                        }
                      }));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 cursor-pointer flex items-center gap-1.5 transition-all text-[11px]"
                  >
                    <Sparkles size={12} /> Quiz Me on This Topic
                  </button>
                </div>

                <span className="text-[10px] text-slate-500">
                  ChemiZIC AI Reasoner v3.8
                </span>
              </div>
            </div>

            {/* Sidebar: Safety & Fun Fact */}
            <div className="space-y-4">
              
              {/* Fun Fact */}
              {result.funFact && (
                <div className="p-5 bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-500/25 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                    <Lightbulb size={13} /> Did You Know?
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {result.funFact}
                  </p>
                </div>
              )}

              {/* Safety Summary */}
              {result.safetySummary && (
                <div className="p-5 bg-[#111318] border border-rose-500/30 rounded-2xl space-y-2 font-sans">
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert size={13} /> Laboratory Safety Matrix
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {result.safetySummary}
                  </div>
                </div>
              )}

            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
