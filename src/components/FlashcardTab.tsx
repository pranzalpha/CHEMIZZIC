/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChemiZIC AI Revision Flashcard Generator Tab
 * Interactive flashcard system with flip UI, spaced repetition, and progress tracking.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen, ChevronLeft, ChevronRight, RefreshCw, RotateCcw,
  CheckCircle2, XCircle, Star, Sparkles, Search, Filter,
  Brain, Layers, Trophy
} from 'lucide-react';
import {
  CURATED_FLASHCARD_SETS,
  getDeckByTopic,
  getAllDeckTopics,
  scheduleNextReview,
  getNewStatus,
  Flashcard,
  FlashcardDeck,
  FlashcardStatus
} from '../services/flashcardEngine';
import { EducationLevelId } from '../types/curriculum';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';

interface FlashcardTabProps {
  onAskAI?: (context: string) => void;
}

const STATUS_COLORS: Record<FlashcardStatus, string> = {
  unseen: 'bg-slate-700 text-slate-400',
  learning: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  known: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  needs_review: 'bg-red-500/20 border-red-500/40 text-red-300'
};

const TYPE_LABELS: Record<string, string> = {
  definition: '📖 Definition', formula: '🧮 Formula', reaction: '⚗️ Reaction',
  mcq: '❓ MCQ', one_mark: '1️⃣ 1-Mark', two_mark: '2️⃣ 2-Mark',
  three_mark: '3️⃣ 3-Mark', common_mistake: '⚠️ Mistake', exam_tip: '⭐ Exam Tip',
  key_fact: '🔑 Key Fact'
};

export const FlashcardTab: React.FC<FlashcardTabProps> = ({ onAskAI }) => {
  const { recordFeatureUsage } = useAuthAndQuiz();
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [topicQuery, setTopicQuery] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCards, setAiCards] = useState<Flashcard[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FlashcardStatus | 'all'>('all');

  // Stats
  const stats = useMemo(() => {
    const total = cards.length;
    const known = cards.filter(c => c.status === 'known').length;
    const learning = cards.filter(c => c.status === 'learning').length;
    const needsReview = cards.filter(c => c.status === 'needs_review').length;
    return { total, known, learning, needsReview };
  }, [cards]);

  const filteredCards = useMemo(() => {
    if (filter === 'all') return cards;
    return cards.filter(c => c.status === filter);
  }, [cards, filter]);

  const currentCard = filteredCards[currentIndex] ?? null;

  const handleSelectDeck = (deck: FlashcardDeck) => {
    setSelectedDeck(deck);
    setCards(deck.cards.map(c => ({ ...c })));
    setCurrentIndex(0);
    setIsFlipped(false);
    setFilter('all');
    recordFeatureUsage('explorer', 'Flashcard Generator', `Deck: ${deck.topic}`, 'Revision', 15);
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleMarkKnown = () => {
    if (!currentCard) return;
    setCards(prev => prev.map(c =>
      c.id === currentCard.id
        ? { ...c, status: getNewStatus({ ...c, correctCount: c.correctCount + 1 }, true), correctCount: c.correctCount + 1, lastReviewed: new Date().toISOString() }
        : c
    ));
    advance();
  };

  const handleMarkNeedsReview = () => {
    if (!currentCard) return;
    setCards(prev => prev.map(c =>
      c.id === currentCard.id
        ? { ...c, status: 'needs_review', incorrectCount: c.incorrectCount + 1, lastReviewed: new Date().toISOString() }
        : c
    ));
    advance();
  };

  const handleMarkDifficult = () => {
    if (!currentCard) return;
    setCards(prev => prev.map(c =>
      c.id === currentCard.id ? { ...c, status: 'learning', lastReviewed: new Date().toISOString() } : c
    ));
    advance();
  };

  const advance = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(filteredCards.length, 1));
    }, 100);
  };

  const handleShuffle = () => {
    setCards(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCards(prev => prev.map(c => ({ ...c, status: 'unseen' as FlashcardStatus })));
    setCurrentIndex(0);
    setIsFlipped(false);
    setFilter('all');
  };

  const handleAIGenerate = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiCards(null);
    try {
      const res = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic.trim() })
      });
      const data = await res.json();
      if (data.cards && Array.isArray(data.cards)) {
        setAiCards(data.cards);
        const aiDeck: FlashcardDeck = {
          id: `ai_${Date.now()}`,
          topic: aiTopic,
          educationLevel: ['CLASS_12'],
          createdAt: new Date().toISOString(),
          source: 'AI-GENERATED',
          cards: data.cards
        };
        handleSelectDeck(aiDeck);
      } else {
        setAiError(data.error || 'Failed to generate flashcards.');
      }
    } catch {
      setAiError('AI Chemist unavailable. Gemini API key required in .env.local');
    } finally {
      setAiLoading(false);
    }
  };

  const topicSuggestions = getAllDeckTopics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-950/60 to-rose-950/60 border border-pink-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="text-pink-400" size={24} />
          <h2 className="text-xl font-black text-white font-mono">AI REVISION FLASHCARDS</h2>
          <span className="text-[10px] bg-pink-500/20 border border-pink-500/40 text-pink-300 px-2 py-0.5 rounded-full font-mono">SPACED REPETITION</span>
        </div>
        <p className="text-slate-400 text-xs font-sans">
          Flip, mark, and schedule cards. Spaced repetition integrated. AI generation available.
        </p>
      </div>

      {/* Topic Selection + AI Generation */}
      <div className="bg-[#111318] border border-slate-700/40 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Curated decks */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 font-mono mb-3 flex items-center gap-2">
              <Layers size={12} /> CURATED DECKS
            </h4>
            <div className="relative mb-3">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={topicQuery}
                onChange={e => setTopicQuery(e.target.value)}
                placeholder="Filter decks..."
                className="w-full bg-black/40 border border-slate-700/50 rounded-xl pl-8 pr-3 py-2 text-xs text-cyan-100 placeholder:text-slate-600 outline-none focus:border-pink-400/60 font-mono"
              />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {CURATED_FLASHCARD_SETS.filter(d => !topicQuery || d.topic.toLowerCase().includes(topicQuery.toLowerCase())).map(deck => (
                <button
                  key={deck.id}
                  onClick={() => handleSelectDeck(deck)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono transition cursor-pointer border ${selectedDeck?.id === deck.id ? 'bg-pink-500/20 border-pink-500/40 text-pink-200' : 'bg-black/30 border-slate-700/40 text-slate-400 hover:text-pink-300 hover:border-pink-500/40'}`}
                >
                  <div className="font-bold">{deck.topic}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{deck.cards.length} cards · {deck.source}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Generation */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 font-mono mb-3 flex items-center gap-2">
              <Sparkles size={12} /> AI GENERATE FLASHCARDS
            </h4>
            <input
              type="text"
              value={aiTopic}
              onChange={e => setAiTopic(e.target.value)}
              placeholder="Topic (e.g. Colligative Properties, d-Block Elements...)"
              className="w-full bg-black/40 border border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-cyan-100 placeholder:text-slate-600 outline-none focus:border-pink-400/60 font-mono mb-3"
            />
            <div className="flex flex-wrap gap-2 mb-3">
              {['Electrochemistry', 'Organic Reactions', 'Chemical Bonding', 'Equilibrium'].map(s => (
                <button
                  key={s}
                  onClick={() => setAiTopic(s)}
                  className="px-3 py-1 bg-slate-800/60 border border-slate-700/50 rounded-lg text-[10px] font-mono text-slate-400 hover:text-pink-300 cursor-pointer transition"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={handleAIGenerate}
              disabled={aiLoading || !aiTopic.trim()}
              className="w-full py-2.5 bg-pink-500/20 border border-pink-500/40 text-pink-300 rounded-xl text-xs font-mono hover:bg-pink-500/30 cursor-pointer transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {aiLoading ? <span className="w-3 h-3 border border-t-pink-400 rounded-full animate-spin" /> : <Sparkles size={10} />}
              {aiLoading ? 'Generating...' : 'Generate Flashcards'}
            </button>
            {aiError && <div className="mt-2 text-xs text-red-400 bg-red-950/20 rounded-lg p-2 border border-red-500/20">{aiError}</div>}
          </div>
        </div>
      </div>

      {/* Flashcard Viewer */}
      {selectedDeck && filteredCards.length > 0 && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="bg-[#111318] border border-slate-700/40 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-xs font-mono">
                <span className="text-slate-500">Total: <span className="text-white">{stats.total}</span></span>
                <span className="text-emerald-400">Known: {stats.known}</span>
                <span className="text-blue-400">Learning: {stats.learning}</span>
                <span className="text-red-400">Review: {stats.needsReview}</span>
              </div>
              <div className="flex gap-2">
                {(['all', 'unseen', 'learning', 'needs_review', 'known'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setCurrentIndex(0); setIsFlipped(false); }}
                    className={`px-2 py-1 rounded text-[10px] font-mono cursor-pointer transition border ${filter === f ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' : 'bg-black/30 border-slate-700/40 text-slate-500 hover:text-white'}`}
                  >
                    {f === 'all' ? 'All' : f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 flex gap-0.5">
              {filteredCards.map((c, i) => (
                <div
                  key={c.id}
                  className={`flex-1 h-1 rounded-full ${c.status === 'known' ? 'bg-emerald-400' : c.status === 'learning' ? 'bg-blue-400' : c.status === 'needs_review' ? 'bg-red-400' : 'bg-slate-700'}`}
                />
              ))}
            </div>
          </div>

          {/* Card */}
          {currentCard && (
            <div className="relative" style={{ perspective: '1200px' }}>
              <motion.div
                className="relative w-full cursor-pointer"
                onClick={handleFlip}
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                {/* Front */}
                <div
                  className="bg-gradient-to-br from-[#111318] to-[#0a0b0e] border border-pink-500/30 rounded-2xl p-8 min-h-[280px] flex flex-col justify-between"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] bg-pink-500/20 border border-pink-500/30 rounded px-2 py-0.5 text-pink-300 font-mono">
                      {TYPE_LABELS[currentCard.type] || currentCard.type}
                    </span>
                    <span className={`text-[10px] border rounded px-2 py-0.5 font-mono ${STATUS_COLORS[currentCard.status]}`}>
                      {currentCard.status}
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-base font-medium text-white leading-relaxed">{currentCard.front}</p>
                  </div>
                  <div className="text-center text-[10px] text-slate-600 font-mono mt-4">Click to flip ↕</div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 to-[#0a0b0e] border border-emerald-500/30 rounded-2xl p-8 min-h-[280px] flex flex-col justify-between"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="text-[10px] text-emerald-400 font-mono mb-2">ANSWER</div>
                  <div className="flex-1 overflow-y-auto text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {currentCard.back}
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {currentCard.tags.slice(0, 4).map(t => (
                        <span key={t} className="text-[9px] bg-black/40 border border-emerald-500/20 rounded px-1.5 py-0.5 text-emerald-400 font-mono">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-[#111318] border border-slate-700/40 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500 font-mono">
                {currentIndex + 1} / {filteredCards.length} cards
              </span>
              <div className="flex gap-2">
                <button onClick={handleShuffle} title="Shuffle" className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 cursor-pointer transition">
                  <RefreshCw size={12} className="text-slate-400" />
                </button>
                <button onClick={handleReset} title="Reset all cards" className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 cursor-pointer transition">
                  <RotateCcw size={12} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Navigation + grading */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => { setCurrentIndex(p => Math.max(0, p - 1)); setIsFlipped(false); }}
                  disabled={currentIndex === 0}
                  className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer transition disabled:opacity-40 flex items-center justify-center gap-1"
                >
                  <ChevronLeft size={12} /> Prev
                </button>
                <button
                  onClick={() => { setCurrentIndex(p => Math.min(filteredCards.length - 1, p + 1)); setIsFlipped(false); }}
                  disabled={currentIndex === filteredCards.length - 1}
                  className="flex-1 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer transition disabled:opacity-40 flex items-center justify-center gap-1"
                >
                  Next <ChevronRight size={12} />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleMarkNeedsReview}
                  className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs font-mono hover:bg-red-500/30 cursor-pointer transition flex items-center justify-center gap-1"
                >
                  <XCircle size={12} /> Needs Review
                </button>
                <button
                  onClick={handleMarkKnown}
                  className="flex-1 py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-mono hover:bg-emerald-500/30 cursor-pointer transition flex items-center justify-center gap-1"
                >
                  <CheckCircle2 size={12} /> Known!
                </button>
              </div>
            </div>

            <button
              onClick={handleMarkDifficult}
              className="w-full mt-2 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl text-xs font-mono hover:bg-yellow-500/20 cursor-pointer transition"
            >
              ⭐ Mark as Difficult (Still Learning)
            </button>
          </div>

          {/* Completion celebration */}
          {stats.known === stats.total && stats.total > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center"
            >
              <Trophy className="text-yellow-400 mx-auto mb-2" size={32} />
              <div className="text-lg font-black text-white mb-1">🎉 All {stats.total} Cards Known!</div>
              <div className="text-xs text-slate-400">Excellent revision! Your spaced repetition schedule has been updated.</div>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty state */}
      {selectedDeck && filteredCards.length === 0 && (
        <div className="bg-[#111318] border border-slate-700/40 rounded-2xl p-12 text-center">
          <Brain size={40} className="text-slate-600 mx-auto mb-3" />
          <div className="text-slate-500 text-sm">No cards match the current filter.</div>
          <button onClick={() => setFilter('all')} className="mt-3 text-xs text-pink-400 hover:text-pink-300 cursor-pointer">Show all cards</button>
        </div>
      )}
    </div>
  );
};

export default FlashcardTab;
