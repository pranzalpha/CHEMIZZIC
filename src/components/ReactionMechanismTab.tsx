/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChemiZIC Reaction Mechanism Explainer Tab
 * Step-by-step interactive mechanism viewer with Previous/Next/Play controls.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, ChevronRight, ChevronLeft, Play, Pause, RefreshCw,
  Sparkles, AlertTriangle, CheckCircle2, Info, Search,
  FlaskConical, ArrowRight, Atom, BookOpen, Brain
} from 'lucide-react';
import {
  MECHANISM_DATABASE,
  findMechanism,
  searchMechanisms,
  getAllMechanismNames,
  ReactionMechanism,
  MechanismStep
} from '../services/mechanismEngine';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';

interface ReactionMechanismTabProps {
  initialQuery?: string;
  onAskAI?: (context: string) => void;
}

const MECHANISM_EXAMPLES = [
  'SN2',
  'SN1 carbocation',
  'E2 elimination',
  'Esterification',
  'Ethanol dehydration',
  'EAS nitration',
  'Grignard reaction'
];

export const ReactionMechanismTab: React.FC<ReactionMechanismTabProps> = ({ initialQuery, onAskAI }) => {
  const { recordFeatureUsage } = useAuthAndQuiz();
  const [query, setQuery] = useState(initialQuery || '');
  const [selectedMechanism, setSelectedMechanism] = useState<ReactionMechanism | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchResults, setSearchResults] = useState<ReactionMechanism[]>(MECHANISM_DATABASE.slice(0, 6));
  const [showSearch, setShowSearch] = useState(!initialQuery);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (initialQuery) {
      const mech = findMechanism(initialQuery);
      if (mech) {
        setSelectedMechanism(mech);
        setCurrentStep(0);
        setShowSearch(false);
      }
    }
  }, [initialQuery]);

  // Auto-play: advance step every 3 seconds
  useEffect(() => {
    if (isPlaying && selectedMechanism) {
      playTimerRef.current = setTimeout(() => {
        if (currentStep < selectedMechanism.steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3000);
    }
    return () => { if (playTimerRef.current) clearTimeout(playTimerRef.current); };
  }, [isPlaying, currentStep, selectedMechanism]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setSearchResults(MECHANISM_DATABASE.slice(0, 6));
    } else {
      const results = searchMechanisms(q);
      setSearchResults(results);
      const exact = findMechanism(q);
      if (exact) {
        setSelectedMechanism(exact);
        setCurrentStep(0);
        setShowSearch(false);
        setIsPlaying(false);
        recordFeatureUsage('explorer', 'Reaction Mechanism Explainer', `Loaded mechanism: ${exact.name}`, 'Exploration', 25);
      }
    }
  };

  const handleSelectMechanism = (mech: ReactionMechanism) => {
    setSelectedMechanism(mech);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowSearch(false);
    recordFeatureUsage('explorer', 'Reaction Mechanism Explainer', `Loaded mechanism: ${mech.name}`, 'Exploration', 25);
  };

  const handleAskAI = async () => {
    if (!selectedMechanism) return;
    const context = `Reaction Mechanism: ${selectedMechanism.name}. Type: ${selectedMechanism.reactionType}. Starting materials: ${selectedMechanism.startingMaterials.join(', ')}. Products: ${selectedMechanism.products.join(', ')}. Currently viewing step ${currentStep + 1}: ${selectedMechanism.steps[currentStep]?.title}.`;
    if (onAskAI) {
      onAskAI(context);
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const res = await fetch('/api/chemist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Explain this mechanism step in detail: ${selectedMechanism.name} - Step ${currentStep + 1} - "${selectedMechanism.steps[currentStep]?.title}". Context: ${context}`,
          history: []
        })
      });
      const data = await res.json();
      setAiResult(data.response || data.text || JSON.stringify(data));
    } catch (e: any) {
      setAiError('AI Chemist unavailable. Check Gemini API key in .env.local');
    } finally {
      setAiLoading(false);
    }
  };

  const step = selectedMechanism?.steps[currentStep];
  const totalSteps = selectedMechanism?.steps.length ?? 0;

  const stepColors: Record<string, string> = {
    nucleophilic_attack: 'from-blue-900/40 border-blue-400/40 text-blue-300',
    bond_forming: 'from-emerald-900/40 border-emerald-400/40 text-emerald-300',
    bond_breaking: 'from-red-900/40 border-red-400/40 text-red-300',
    proton_transfer: 'from-yellow-900/40 border-yellow-400/40 text-yellow-300',
    elimination: 'from-purple-900/40 border-purple-400/40 text-purple-300',
    electrophilic_attack: 'from-orange-900/40 border-orange-400/40 text-orange-300',
    rearrangement: 'from-pink-900/40 border-pink-400/40 text-pink-300',
    acid_base: 'from-cyan-900/40 border-cyan-400/40 text-cyan-300',
    oxidation: 'from-rose-900/40 border-rose-400/40 text-rose-300',
    reduction: 'from-teal-900/40 border-teal-400/40 text-teal-300',
    default: 'from-slate-900/40 border-slate-400/40 text-slate-300'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="text-indigo-400" size={24} />
          <h2 className="text-xl font-black text-white font-mono">REACTION MECHANISM EXPLAINER</h2>
          <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-2 py-0.5 rounded-full font-mono">VERIFIED</span>
        </div>
        <p className="text-slate-400 text-xs font-sans">
          Explore step-by-step reaction mechanisms with electron movement, species roles, and scientific reasoning.
        </p>
      </div>

      {/* Search / Browse Panel */}
      <div className="bg-[#111318] border border-slate-700/40 rounded-2xl p-6">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search mechanism... (e.g. SN2, esterification, dehydration)"
              className="w-full bg-black/40 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-cyan-100 placeholder:text-slate-600 outline-none focus:border-indigo-400/60 font-mono"
            />
          </div>
          <button
            onClick={() => { setShowSearch(!showSearch); setSelectedMechanism(null); }}
            className="px-4 py-2.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-mono hover:bg-indigo-500/30 cursor-pointer transition"
          >
            Browse All
          </button>
        </div>

        {/* Example shortcuts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {MECHANISM_EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => handleSearch(ex)}
              className="px-3 py-1 bg-slate-800/60 border border-slate-700/50 rounded-lg text-[10px] font-mono text-slate-400 hover:text-indigo-300 hover:border-indigo-500/50 cursor-pointer transition"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Search results grid */}
        {(showSearch || searchResults.length > 0) && !selectedMechanism && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map(mech => (
              <button
                key={mech.id}
                onClick={() => handleSelectMechanism(mech)}
                className="text-left bg-black/30 border border-slate-700/40 hover:border-indigo-500/50 hover:bg-indigo-950/20 rounded-xl p-4 transition cursor-pointer group"
              >
                <div className="text-xs font-bold text-white mb-1 group-hover:text-indigo-300 font-mono">{mech.name}</div>
                <div className="text-[10px] text-slate-500 mb-2">{mech.reactionType}</div>
                <div className="flex flex-wrap gap-1">
                  {mech.educationLevels.map(l => (
                    <span key={l} className="text-[9px] bg-slate-800 border border-slate-700/50 rounded px-1.5 py-0.5 text-slate-400 font-mono">{l}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mechanism Viewer */}
      {selectedMechanism && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Overview Card */}
          <div className="bg-[#111318] border border-indigo-500/30 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-white font-mono">{selectedMechanism.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2 py-0.5 rounded font-mono">{selectedMechanism.reactionType}</span>
                  <span className="text-[10px] bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded font-mono">{selectedMechanism.subType}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${selectedMechanism.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'}`}>
                    {selectedMechanism.verificationStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedMechanism(null); setShowSearch(true); }}
                className="text-slate-500 hover:text-white text-xs cursor-pointer transition"
              >
                ✕ Close
              </button>
            </div>

            {/* Overview grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="bg-black/30 rounded-xl p-3 border border-slate-700/30">
                <div className="text-slate-500 text-[10px] mb-1 font-mono uppercase">Starting Materials</div>
                {selectedMechanism.startingMaterials.map((s, i) => <div key={i} className="text-cyan-300 font-mono">{s}</div>)}
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-slate-700/30">
                <div className="text-slate-500 text-[10px] mb-1 font-mono uppercase">Products</div>
                {selectedMechanism.products.map((p, i) => <div key={i} className="text-emerald-300 font-mono">{p}</div>)}
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-slate-700/30">
                <div className="text-slate-500 text-[10px] mb-1 font-mono uppercase">Conditions</div>
                <div className="text-yellow-300">{selectedMechanism.conditions}</div>
              </div>
              {selectedMechanism.nucleophile && (
                <div className="bg-blue-950/30 rounded-xl p-3 border border-blue-500/30">
                  <div className="text-slate-500 text-[10px] mb-1 font-mono uppercase">Nucleophile</div>
                  <div className="text-blue-300">{selectedMechanism.nucleophile}</div>
                </div>
              )}
              {selectedMechanism.electrophile && (
                <div className="bg-orange-950/30 rounded-xl p-3 border border-orange-500/30">
                  <div className="text-slate-500 text-[10px] mb-1 font-mono uppercase">Electrophile</div>
                  <div className="text-orange-300">{selectedMechanism.electrophile}</div>
                </div>
              )}
              {selectedMechanism.leavingGroup && (
                <div className="bg-red-950/30 rounded-xl p-3 border border-red-500/30">
                  <div className="text-slate-500 text-[10px] mb-1 font-mono uppercase">Leaving Group</div>
                  <div className="text-red-300">{selectedMechanism.leavingGroup}</div>
                </div>
              )}
            </div>

            {/* Balanced Equation */}
            <div className="mt-4 bg-black/40 rounded-xl p-4 border border-cyan-500/20">
              <div className="text-slate-500 text-[10px] mb-1 font-mono uppercase">Balanced Equation</div>
              <div className="text-cyan-200 font-mono text-sm">{selectedMechanism.balancedEquation}</div>
            </div>

            {/* Stereochemistry */}
            {selectedMechanism.stereochemistry && (
              <div className="mt-3 bg-purple-950/20 rounded-xl p-3 border border-purple-500/20 text-xs text-purple-200">
                <span className="text-[10px] text-slate-500 font-mono uppercase mr-2">Stereochemistry:</span>
                {selectedMechanism.stereochemistry}
              </div>
            )}
          </div>

          {/* Step-by-Step Mechanism */}
          <div className="bg-[#111318] border border-slate-700/40 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Zap size={14} className="text-yellow-400" />
                MECHANISM STEPS ({totalSteps} total)
              </h4>
              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
                  className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 cursor-pointer transition"
                  title="Reset to step 1"
                >
                  <RefreshCw size={12} className="text-slate-400" />
                </button>
                <button
                  disabled={currentStep === 0}
                  onClick={() => { setCurrentStep(p => p - 1); setIsPlaying(false); }}
                  className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 cursor-pointer transition disabled:opacity-40"
                >
                  <ChevronLeft size={12} className="text-slate-300" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-mono cursor-pointer transition border ${isPlaying ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' : 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'}`}
                >
                  {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  disabled={currentStep === totalSteps - 1}
                  onClick={() => { setCurrentStep(p => p + 1); setIsPlaying(false); }}
                  className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 cursor-pointer transition disabled:opacity-40"
                >
                  <ChevronRight size={12} className="text-slate-300" />
                </button>
              </div>
            </div>

            {/* Step progress bar */}
            <div className="flex gap-1.5 mb-6">
              {selectedMechanism.steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                  className={`flex-1 h-1.5 rounded-full transition cursor-pointer ${i <= currentStep ? 'bg-indigo-400' : 'bg-slate-700'}`}
                  title={`Step ${i + 1}: ${s.title}`}
                />
              ))}
            </div>

            {/* Visual flow: Reactants → Step N → Intermediates → Products */}
            <div className="flex items-center gap-2 overflow-x-auto mb-6 pb-2 text-xs font-mono">
              <span className="text-slate-400 whitespace-nowrap">Reactants</span>
              {selectedMechanism.steps.map((s, i) => (
                <React.Fragment key={i}>
                  <ArrowRight size={12} className={i <= currentStep ? 'text-indigo-400' : 'text-slate-700'} />
                  <span
                    className={`whitespace-nowrap px-2 py-1 rounded cursor-pointer transition ${i === currentStep ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/50' : i < currentStep ? 'text-emerald-400' : 'text-slate-600'}`}
                    onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                  >
                    Step {i + 1}
                  </span>
                </React.Fragment>
              ))}
              <ArrowRight size={12} className={currentStep === totalSteps - 1 ? 'text-emerald-400' : 'text-slate-700'} />
              <span className={`text-slate-400 whitespace-nowrap ${currentStep === totalSteps - 1 ? 'text-emerald-400' : ''}`}>Products</span>
            </div>

            {/* Current Step Card */}
            <AnimatePresence mode="wait">
              {step && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-gradient-to-br ${stepColors[step.type] || stepColors.default} rounded-2xl p-6 border`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-black/40 border border-current/30 flex items-center justify-center text-sm font-black">
                      {step.stepNumber}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono">{step.title}</div>
                      <div className="text-[10px] text-current/60 capitalize font-mono">{step.type.replace(/_/g, ' ')}</div>
                    </div>
                  </div>

                  <p className="text-current/90 text-sm mb-4 leading-relaxed">{step.description}</p>

                  {/* Species */}
                  {step.species.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] text-current/60 font-mono uppercase mb-1">Species Present</div>
                      <div className="flex flex-wrap gap-2">
                        {step.species.map((sp, i) => (
                          <span key={i} className="px-2 py-1 bg-black/30 rounded-lg text-xs font-mono border border-current/20">{sp}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Intermediates */}
                  {step.intermediates.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] text-current/60 font-mono uppercase mb-1">Intermediates Formed</div>
                      {step.intermediates.map((int, i) => (
                        <div key={i} className="text-xs bg-black/30 rounded-lg px-3 py-1.5 mb-1 font-mono border border-current/20">{int}</div>
                      ))}
                    </div>
                  )}

                  {/* Electron Movement */}
                  {step.electronMovement && (
                    <div className="mb-3 bg-black/20 rounded-xl p-3 border border-current/15">
                      <div className="text-[10px] text-current/60 font-mono uppercase mb-1">⚡ Electron Movement</div>
                      <div className="text-xs">{step.electronMovement}</div>
                    </div>
                  )}

                  {/* Why it happens */}
                  <div className="bg-black/20 rounded-xl p-3 border border-current/15">
                    <div className="text-[10px] text-current/60 font-mono uppercase mb-1">🔬 Why This Step Occurs</div>
                    <div className="text-xs leading-relaxed">{step.whyItHappens}</div>
                  </div>

                  {step.energyNote && (
                    <div className="mt-3 text-[10px] bg-black/20 rounded-lg px-3 py-2 border border-current/10 text-current/70 font-mono">
                      ⚡ {step.energyNote}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step counter */}
            <div className="flex items-center justify-center mt-4 text-xs text-slate-500 font-mono">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111318] border border-emerald-500/20 rounded-2xl p-5">
              <h5 className="text-xs font-bold text-emerald-300 font-mono mb-3 flex items-center gap-2">
                <CheckCircle2 size={12} /> KEY INSIGHTS
              </h5>
              <ul className="space-y-2">
                {selectedMechanism.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#111318] border border-yellow-500/20 rounded-2xl p-5">
              <h5 className="text-xs font-bold text-yellow-300 font-mono mb-3 flex items-center gap-2">
                <AlertTriangle size={12} /> COMMON MISTAKES
              </h5>
              <ul className="space-y-2">
                {selectedMechanism.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                    {m}
                  </li>
                ))}
              </ul>
              <h5 className="text-xs font-bold text-cyan-300 font-mono mb-3 mt-4 flex items-center gap-2">
                <BookOpen size={12} /> EXAM TIPS
              </h5>
              <ul className="space-y-2">
                {selectedMechanism.examTips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-cyan-400 mt-0.5 shrink-0">★</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ask AI Button */}
          <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-2">
                <Sparkles size={12} /> ASK AI CHEMIST
              </h5>
              <button
                onClick={handleAskAI}
                disabled={aiLoading}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono hover:bg-cyan-500/30 cursor-pointer transition disabled:opacity-50"
              >
                {aiLoading ? (
                  <span className="w-3 h-3 border border-t-cyan-400 rounded-full animate-spin" />
                ) : <Sparkles size={10} />}
                {aiLoading ? 'Asking...' : 'Ask AI about this step'}
              </button>
            </div>
            <p className="text-xs text-slate-500">AI will receive full mechanism context automatically.</p>
            {aiResult && (
              <div className="mt-3 bg-black/30 rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {aiResult}
              </div>
            )}
            {aiError && (
              <div className="mt-3 bg-red-950/30 rounded-xl p-3 border border-red-500/30 text-xs text-red-300">
                {aiError}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReactionMechanismTab;
