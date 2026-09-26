/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChemiZIC Give Reason Engine Tab
 * Structured "Give Reason" Q&A UI with Core Principle, Detailed Cause, and One-Line Exam Answer.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle, Search, Sparkles, CheckCircle2, BookOpen,
  AlertTriangle, Lightbulb, Brain, Target, ChevronRight
} from 'lucide-react';
import {
  GIVE_REASON_DATABASE,
  findGiveReasonAnswer,
  searchGiveReasonBank,
  getAllGiveReasonTopics,
  GiveReasonResponse
} from '../services/giveReasonEngine';
import { EducationLevelId } from '../types/curriculum';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';

interface GiveReasonTabProps {
  onAskAI?: (context: string) => void;
}

const LEVEL_COLORS: Record<string, string> = {
  CLASS_11: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  CLASS_12: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  BSC: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
  MSC: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
  BTECH: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  MTECH: 'bg-rose-500/20 border-rose-500/40 text-rose-300'
};

const EXAMPLE_QUESTIONS = [
  'Why does water have a higher boiling point than H₂S?',
  'Why do transition metals form coloured compounds?',
  'Why is ortho-nitrophenol more volatile?',
  'Why is benzene unusually stable?',
  'Why does HF have a higher boiling point than HCl?',
  'Why do noble gases not form bonds?',
  'Why do alkali metals react vigorously with water?'
];

export const GiveReasonTab: React.FC<GiveReasonTabProps> = ({ onAskAI }) => {
  const { studentProfile, recordFeatureUsage } = useAuthAndQuiz();
  const [query, setQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevelId | ''>('');
  const [answer, setAnswer] = useState<GiveReasonResponse | null>(null);
  const [searchResults, setSearchResults] = useState<GiveReasonResponse[]>(GIVE_REASON_DATABASE.slice(0, 6));
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showPrinciple, setShowPrinciple] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [showExam, setShowExam] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    const results = searchGiveReasonBank(q, selectedLevel as EducationLevelId || undefined);
    setSearchResults(results.slice(0, 6));
    const exact = findGiveReasonAnswer(q);
    if (exact) {
      setAnswer(exact);
      setShowPrinciple(true);
      setShowDetail(false);
      setShowExam(false);
      setAiResult(null);
      recordFeatureUsage('explorer', 'Give Reason Engine', `Answered: ${q.substring(0, 40)}`, 'Revision', 15);
    }
  };

  const handleSelectAnswer = (gr: GiveReasonResponse) => {
    setAnswer(gr);
    setQuery(gr.question);
    setShowPrinciple(true);
    setShowDetail(false);
    setShowExam(false);
    setAiResult(null);
    recordFeatureUsage('explorer', 'Give Reason Engine', `Answered: ${gr.question.substring(0, 40)}`, 'Revision', 15);
  };

  const handleAskAI = async () => {
    if (!query.trim() && !answer) return;
    const question = answer ? answer.question : query;
    const context = answer
      ? `Give Reason question: "${question}". Topic: ${answer.topic}. Concept: ${answer.concept}.`
      : `Give Reason question: "${question}"`;
    if (onAskAI) { onAskAI(context); return; }
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/give-reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context })
      });
      const data = await res.json();
      setAiResult(data.response || data.answer || JSON.stringify(data));
    } catch {
      setAiError('AI Chemist unavailable. Gemini API key required in .env.local');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-950/60 to-fuchsia-950/60 border border-violet-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="text-violet-400" size={24} />
          <h2 className="text-xl font-black text-white font-mono">GIVE REASON ENGINE</h2>
          <span className="text-[10px] bg-violet-500/20 border border-violet-500/40 text-violet-300 px-2 py-0.5 rounded-full font-mono">VERIFIED</span>
        </div>
        <p className="text-slate-400 text-xs font-sans">
          Structured "Give Reason" explanations with Core Scientific Principle, Detailed Chemical Cause, and One-Line Exam Answer.
        </p>
      </div>

      {/* Search Panel */}
      <div className="bg-[#111318] border border-slate-700/40 rounded-2xl p-6">
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Ask: Why does water boil higher than H₂S? or any anomaly..."
              className="w-full bg-black/40 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-cyan-100 placeholder:text-slate-600 outline-none focus:border-violet-400/60 font-mono"
            />
          </div>
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value as EducationLevelId | '')}
            className="bg-black/40 border border-slate-700/50 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none font-mono cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="CLASS_11">Class 11</option>
            <option value="CLASS_12">Class 12</option>
            <option value="BSC">BSc</option>
            <option value="MSC">MSc</option>
            <option value="BTECH">BTech</option>
          </select>
        </div>

        {/* Examples */}
        <div className="flex flex-wrap gap-2 mb-4">
          {EXAMPLE_QUESTIONS.slice(0, 5).map(q => (
            <button
              key={q}
              onClick={() => handleSearch(q)}
              className="px-3 py-1 bg-slate-800/60 border border-slate-700/50 rounded-lg text-[10px] font-mono text-slate-400 hover:text-violet-300 hover:border-violet-500/50 cursor-pointer transition text-left"
            >
              {q.substring(0, 42)}...
            </button>
          ))}
        </div>

        {/* Browse Results */}
        {!answer && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {searchResults.map(gr => (
              <button
                key={gr.question}
                onClick={() => handleSelectAnswer(gr)}
                className="text-left bg-black/30 border border-slate-700/40 hover:border-violet-500/50 hover:bg-violet-950/20 rounded-xl p-4 transition cursor-pointer group"
              >
                <div className="text-xs font-medium text-slate-300 mb-2 group-hover:text-violet-200 leading-snug">{gr.question}</div>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 font-mono">{gr.topic}</div>
                  <ChevronRight size={10} className="text-slate-600 group-hover:text-violet-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Answer Card */}
      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Question Header */}
            <div className="bg-[#111318] border border-violet-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-2">{answer.question}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-400 font-mono">{answer.topic}</span>
                    <span className="text-[10px] bg-violet-500/20 border border-violet-500/40 rounded px-2 py-0.5 text-violet-300 font-mono">{answer.concept}</span>
                    {answer.educationLevel.map(lvl => (
                      <span key={lvl} className={`text-[10px] border rounded px-2 py-0.5 font-mono ${LEVEL_COLORS[lvl] || 'bg-slate-800 border-slate-700 text-slate-400'}`}>{lvl.replace('_', ' ')}</span>
                    ))}
                    <span className={`text-[10px] border rounded px-2 py-0.5 font-mono ${answer.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'}`}>
                      {answer.verificationStatus} ({answer.confidence}%)
                    </span>
                  </div>
                </div>
                <button onClick={() => setAnswer(null)} className="text-slate-500 hover:text-white text-xs ml-4 cursor-pointer">✕</button>
              </div>

              {/* Three-section reveal */}
              <div className="space-y-3">
                {/* Section 1: Core Principle */}
                <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowPrinciple(!showPrinciple)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-blue-950/50 transition"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-300 font-mono">
                      <Brain size={12} /> 1. CORE SCIENTIFIC PRINCIPLE
                    </div>
                    <ChevronRight size={12} className={`text-blue-400 transition-transform ${showPrinciple ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showPrinciple && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 text-sm text-blue-100 leading-relaxed"
                      >
                        {answer.coreScientificPrinciple}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 2: Detailed Chemical Cause */}
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-purple-950/50 transition"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300 font-mono">
                      <Lightbulb size={12} /> 2. DETAILED CHEMICAL CAUSE / MECHANISM
                    </div>
                    <ChevronRight size={12} className={`text-purple-400 transition-transform ${showDetail ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showDetail && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 text-sm text-purple-100 leading-relaxed whitespace-pre-line"
                      >
                        {answer.detailedChemicalCause}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 3: One-Line Exam Answer */}
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowExam(!showExam)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-emerald-950/50 transition"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 font-mono">
                      <Target size={12} /> 3. ONE-LINE EXAM ANSWER
                    </div>
                    <ChevronRight size={12} className={`text-emerald-400 transition-transform ${showExam ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showExam && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 text-sm text-emerald-100 leading-relaxed font-medium"
                      >
                        {answer.oneLineExamAnswer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Reveal All Button */}
              <button
                onClick={() => { setShowPrinciple(true); setShowDetail(true); setShowExam(true); }}
                className="mt-4 w-full py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-xs text-slate-400 font-mono hover:text-white hover:border-slate-500 cursor-pointer transition"
              >
                Reveal All Sections
              </button>

              {/* Key Terms & Exam Tip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="bg-yellow-950/20 border border-yellow-500/20 rounded-xl p-3">
                  <div className="text-[10px] text-yellow-400 font-mono mb-2">KEY TERMS</div>
                  <div className="flex flex-wrap gap-1.5">
                    {answer.keyTerms.map((t, i) => (
                      <span key={i} className="text-[10px] bg-black/40 border border-yellow-500/20 rounded px-2 py-0.5 text-yellow-200 font-mono">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3">
                  <div className="text-[10px] text-cyan-400 font-mono mb-2">EXAM TIP</div>
                  <div className="text-xs text-cyan-100 leading-relaxed">{answer.examTip}</div>
                </div>
              </div>
            </div>

            {/* Ask AI for deeper explanation */}
            <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-2">
                  <Sparkles size={12} /> NEED A DEEPER EXPLANATION?
                </div>
                <button
                  onClick={handleAskAI}
                  disabled={aiLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-mono hover:bg-cyan-500/30 cursor-pointer transition disabled:opacity-50"
                >
                  {aiLoading ? <span className="w-3 h-3 border border-t-cyan-400 rounded-full animate-spin" /> : <Sparkles size={10} />}
                  {aiLoading ? 'Asking AI...' : 'Ask AI Chemist'}
                </button>
              </div>
              {aiResult && (
                <div className="mt-4 bg-black/30 rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {aiResult}
                </div>
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

export default GiveReasonTab;
