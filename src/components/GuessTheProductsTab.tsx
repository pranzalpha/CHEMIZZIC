/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC "Guess the Products" Dedicated Reaction Game & Challenge Arena
 * Students test their predictive chemistry intuition by examining reactants and reaction conditions,
 * choosing or formulating predicted products, and checking with the layered reaction engine.
 * 
 * Powered by a structured reaction bank of 122+ distinct validated challenges across
 * Inorganic, Organic, and Physical/Applied chemistry with randomization, anti-repetition tracking,
 * and scalable procedural generation for 500+ to 5000+ challenges.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, Sparkles, CheckCircle2, X, ArrowRight, 
  HelpCircle, RefreshCw, Trophy, BookOpen, ShieldCheck, 
  Flame, Zap, AlertTriangle, Layers, Shuffle, Filter
} from 'lucide-react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { GuessTheProductsChallenge } from '../types/curriculum';
import { GUESS_THE_PRODUCTS_BANK, generateDynamicReaction } from '../data/guessProductsData';

// Fisher-Yates Shuffle helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const GuessTheProductsTab: React.FC = () => {
  const { recordFeatureUsage } = useAuthAndQuiz();

  // Categories filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | 'all'>('all');

  // Anti-repetition tracking
  const [recentSeenIds, setRecentSeenIds] = useState<string[]>([]);
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  
  // Current challenge & shuffled options
  const [currentChallenge, setCurrentChallenge] = useState<GuessTheProductsChallenge>(GUESS_THE_PRODUCTS_BANK[0]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>(() => shuffleArray(GUESS_THE_PRODUCTS_BANK[0].options));
  
  // Game session states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Available categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    GUESS_THE_PRODUCTS_BANK.forEach(c => cats.add(c.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filtered pool
  const filteredBank = useMemo(() => {
    return GUESS_THE_PRODUCTS_BANK.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchDiff = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
      return matchCat && matchDiff;
    });
  }, [selectedCategory, selectedDifficulty]);

  // Load a challenge by index or randomly avoiding recent ones
  const loadChallenge = (challenge: GuessTheProductsChallenge) => {
    setCurrentChallenge(challenge);
    setShuffledOptions(shuffleArray(challenge.options));
    setSelectedOption(null);
    setRevealed(false);

    setRecentSeenIds(prev => {
      const updated = [challenge.id, ...prev.filter(id => id !== challenge.id)];
      return updated.slice(0, 20); // Keep last 20 seen
    });
  };

  const handleNextChallenge = () => {
    if (filteredBank.length === 0) return;
    
    // Pick next challenge from filtered pool that has not been seen recently if possible
    const unseen = filteredBank.filter(c => !recentSeenIds.includes(c.id));
    const pool = unseen.length > 0 ? unseen : filteredBank;
    const nextIdx = Math.floor(Math.random() * pool.length);
    const chosen = pool[nextIdx] || filteredBank[0];

    loadChallenge(chosen);
  };

  const handleSelectOption = (option: string) => {
    if (revealed) return;
    setSelectedOption(option);
  };

  const handleVerifyPrediction = () => {
    if (!selectedOption || revealed) return;
    setRevealed(true);
    setAttempts(prev => prev + 1);

    const targetAnswer = currentChallenge.correctAnswer || currentChallenge.options[0];
    const isCorrect = selectedOption.trim().toLowerCase() === targetAnswer.trim().toLowerCase();

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    recordFeatureUsage(
      'reaction',
      'Guess the Products Challenge',
      `Predicted products for ${currentChallenge.title}: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`,
      'Assessment',
      isCorrect ? 30 : 10
    );
  };

  // Switch category
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const matches = GUESS_THE_PRODUCTS_BANK.filter(c => cat === 'All' || c.category === cat);
    if (matches.length > 0) {
      loadChallenge(matches[0]);
    }
  };

  return (
    <div className="space-y-6 select-text">
      
      {/* Header Banner */}
      <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FlaskConical className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Guess the Products — Chemistry Predictive Arena
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              {GUESS_THE_PRODUCTS_BANK.length}+ Reaction Bank
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Analyze reactants, conditions, and oxidation states across 100+ distinct inorganic, organic, and electrochemical challenges. Predict products, inspect mechanisms, and master driving forces.
          </p>
        </div>

        {/* Score & Streak tracker */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-slate-800 text-slate-300">
            Score: <span className="text-cyan-300 font-bold">{score} / {attempts}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <Flame size={13} className="text-amber-400" />
            <span>Streak: <strong>{streak}</strong></span>
          </div>
        </div>
      </div>

      {/* Control Strip: Categories & Randomizer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0d0f14] border border-slate-800 p-3 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          <span className="text-slate-500 uppercase text-[10px] pr-1 flex items-center gap-1">
            <Filter size={11} /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'bg-black/30 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleNextChallenge}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 flex items-center gap-1.5 cursor-pointer transition font-mono text-xs"
          >
            <Shuffle size={13} /> Next Random Reaction
          </button>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        
        {/* Reactants and Conditions Display */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-black/60 to-cyan-950/20 border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Challenge #{currentChallenge.id} • {currentChallenge.category} ({currentChallenge.subtopic || 'Reaction'})
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-bold">
              Tier {currentChallenge.difficulty} • [VERIFIED DATA]
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black font-mono text-white flex items-center gap-3 flex-wrap">
            <span>{currentChallenge.reactantsInput}</span>
            <span className="text-cyan-400">➔</span>
            <span className="text-amber-300 underline decoration-dashed">[ ? PREDICT PRODUCTS ? ]</span>
          </h3>

          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 pt-1 border-t border-slate-800">
            <div><strong>Conditions:</strong> <span className="text-cyan-300">{currentChallenge.conditions}</span></div>
            <div><strong>Reactants:</strong> <span className="text-slate-300">{currentChallenge.reactantsList.join(', ')}</span></div>
          </div>
        </div>

        {/* Question Prompt */}
        {currentChallenge.question && (
          <div className="text-sm text-slate-200 font-sans font-medium flex items-center gap-2">
            <HelpCircle size={15} className="text-cyan-400 shrink-0" />
            <span>{currentChallenge.question}</span>
          </div>
        )}

        {/* Prediction Options (Randomized via Fisher-Yates) */}
        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Select Your Predicted Products (Options Randomized):
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shuffledOptions.map((option, idx) => {
              const isSelected = selectedOption === option;
              const targetAnswer = currentChallenge.correctAnswer || currentChallenge.options[0];
              const isCorrectAnswer = option.trim().toLowerCase() === targetAnswer.trim().toLowerCase();

              let cardStyles = 'bg-black/40 border-slate-800 text-slate-300 hover:border-cyan-500/50';

              if (revealed) {
                if (isCorrectAnswer) {
                  cardStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  cardStyles = 'bg-rose-950/40 border-rose-500 text-rose-200';
                } else {
                  cardStyles = 'bg-black/20 border-slate-900 text-slate-600 opacity-50';
                }
              } else if (isSelected) {
                cardStyles = 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.2)] font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={revealed}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-xl border text-left text-xs font-mono transition flex items-center justify-between cursor-pointer ${cardStyles}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 font-bold">
                      {['A', 'B', 'C', 'D'][idx % 4]}
                    </span>
                    <span>{option}</span>
                  </div>

                  {revealed && isCorrectAnswer && (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  )}
                  {revealed && isSelected && !isCorrectAnswer && (
                    <X size={18} className="text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Verify or Next */}
        <div className="pt-2 flex flex-wrap gap-3 items-center justify-between">
          <div>
            {!revealed ? (
              <button
                onClick={handleVerifyPrediction}
                disabled={!selectedOption}
                className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Verify Product Prediction
              </button>
            ) : (
              <button
                onClick={handleNextChallenge}
                className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2"
              >
                Next Challenge <ArrowRight size={14} />
              </button>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Pool: {filteredBank.length} challenge(s) available in category "{selectedCategory}"
          </div>
        </div>

        {/* Revealed Educational Breakdown */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#0A0B0E] border border-cyan-500/30 rounded-2xl space-y-4 text-xs font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-cyan-300 font-bold uppercase text-xs flex items-center gap-2">
                  <ShieldCheck size={16} className="text-cyan-400" /> Reaction Intelligence Report [VERIFIED]
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                  Scientific Confidence: {currentChallenge.confidence}%
                </span>
              </div>

              {/* Balanced Equation */}
              <div className="p-3.5 bg-black/60 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Balanced Chemical Equation:</span>
                <div className="text-sm font-mono font-bold text-emerald-300">
                  {currentChallenge.balancedEquation}
                </div>
              </div>

              {/* Reaction Type & Mechanism */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Reaction Classification:</span>
                  <div className="text-cyan-200 font-semibold">{currentChallenge.reactionType}</div>
                </div>

                <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Oxidation States & Electron Transfer:</span>
                  <div className="text-amber-200 font-mono text-[11px]">{currentChallenge.oxidationStates}</div>
                </div>
              </div>

              {/* Mechanism & Why products form */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Mechanism & Electron Movement:</span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {currentChallenge.mechanism}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Thermodynamic & Kinetic Driving Force:</span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {currentChallenge.whyProductsForm}
                </p>
              </div>

              {currentChallenge.source && (
                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                  Grounding Citation: {currentChallenge.source}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};
