/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { QuizQuestion, ConceptDifficulty } from '../types';
import { CHEMISTRY_CONCEPTS, AdaptiveQuestion } from '../data/chemistryConcepts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Trophy, Timer, Award, CheckCircle2, AlertTriangle, 
  RefreshCw, Layers, Plus, BookOpen, Lock, Key, Brain, Zap, 
  ArrowRight, Check, X, HelpCircle, BarChart3
} from 'lucide-react';

interface QuizArenaTabProps {
  initialConceptId?: string;
  initialDifficulty?: ConceptDifficulty;
  onNavigateToDashboard?: () => void;
}

export const QuizArenaTab: React.FC<QuizArenaTabProps> = ({
  initialConceptId,
  initialDifficulty,
  onNavigateToDashboard
}) => {
  const { 
    currentUser, 
    questions, 
    adaptiveQuestions,
    studentProfile,
    addCustomQuestion, 
    recordQuizResult, 
    recordAdaptiveAttempt,
    recordFeatureUsage,
    guestLogin, 
    login 
  } = useAuthAndQuiz();
  
  // Arena Mode: 'adaptive' (AI-Powered) or 'standard' (Traditional)
  const [arenaMode, setArenaMode] = useState<'adaptive' | 'standard'>(
    initialConceptId ? 'adaptive' : 'adaptive'
  );

  // Adaptive Mode States
  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    initialConceptId || 'all'
  );
  const [currentAdaptiveDifficulty, setCurrentAdaptiveDifficulty] = useState<ConceptDifficulty>(
    initialDifficulty || 'medium'
  );
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState<number>(0);
  const [difficultyChangeNotice, setDifficultyChangeNotice] = useState<string | null>(null);

  // Standard Selection States
  const [selectedTopic, setSelectedTopic] = useState<string>('Organic Chemistry');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [quizLength, setQuizLength] = useState<number>(5);
  const [isTimedMode, setIsTimedMode] = useState<boolean>(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState<boolean>(false);
  
  // Quiz Session States
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<(QuizQuestion | AdaptiveQuestion)[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  // Performance and Scoring Trackers
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [fastAnswersCount, setFastAnswersCount] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Session Question History for Mistake Review
  interface SessionAttemptRecord {
    question: QuizQuestion | AdaptiveQuestion;
    selectedAnswer: string;
    isCorrect: boolean;
    conceptId?: string;
    conceptName?: string;
    difficulty: ConceptDifficulty;
    explanation: string;
    whyIncorrect?: string;
  }
  const [sessionHistory, setSessionHistory] = useState<SessionAttemptRecord[]>([]);
  
  // Timers
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30s per question
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Admin Panel states
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    topic: 'Organic Chemistry'
  });
  const [adminMsg, setAdminMsg] = useState('');

  // Admin Gateway login states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isLoggingInAdmin, setIsLoggingInAdmin] = useState(false);

  // If initialConceptId was passed in via props, auto-select it
  useEffect(() => {
    if (initialConceptId) {
      setSelectedConceptId(initialConceptId);
      setArenaMode('adaptive');
      if (initialDifficulty) {
        setCurrentAdaptiveDifficulty(initialDifficulty);
      }
    }
  }, [initialConceptId, initialDifficulty]);

  const handleAdminGatewayLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    setIsLoggingInAdmin(true);
    try {
      const res = await login(adminUsername, adminUsername, adminPassword);
      if (res.success) {
        setAdminUsername('');
        setAdminPassword('');
      } else {
        setAdminLoginError(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setAdminLoginError(err?.message || 'Invalid admin credentials or connection disrupted.');
    } finally {
      setIsLoggingInAdmin(false);
    }
  };

  // Setup quiz session
  const startQuiz = () => {
    setDifficultyChangeNotice(null);
    setConsecutiveCorrect(0);
    setConsecutiveIncorrect(0);
    setSessionHistory([]);

    if (arenaMode === 'adaptive') {
      // Build adaptive question pool
      let pool = [...adaptiveQuestions];
      if (selectedConceptId !== 'all') {
        pool = pool.filter(q => q.conceptId === selectedConceptId);
      }

      // Prioritize questions matching current difficulty
      let matched = pool.filter(q => q.difficulty === currentAdaptiveDifficulty);
      if (matched.length === 0) matched = pool;

      // Shuffle and select
      const selected = matched.sort(() => 0.5 - Math.random()).slice(0, quizLength);
      // Fallback if empty
      if (selected.length === 0) {
        selected.push(...adaptiveQuestions.slice(0, quizLength));
      }

      setQuizQuestions(selected);
    } else {
      // Standard Mode
      let filtered = [...questions];
      
      if (isDailyChallenge) {
        filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, quizLength);
      } else {
        filtered = filtered.filter(q => q.topic === selectedTopic && q.difficulty === selectedDifficulty);
        if (filtered.length === 0) {
          filtered = questions.filter(q => q.topic === selectedTopic);
        }
        filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, quizLength);
      }

      if (filtered.length === 0) {
        filtered = questions.slice(0, quizLength);
      }

      setQuizQuestions(filtered);
    }

    setCurrentIdx(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setFastAnswersCount(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizActive(true);
    setQuizCompleted(false);
    setTimeLeft(isTimedMode ? 15 : 30);
    setQuestionStartTime(Date.now());
  };

  // Timer tick
  useEffect(() => {
    if (!quizActive || quizCompleted || isSubmitted) return;

    if (timeLeft <= 0) {
      // Auto wrong answer on timer expire
      handleTimeExpired();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quizActive, quizCompleted, isSubmitted]);

  const handleTimeExpired = () => {
    const currentQ = quizQuestions[currentIdx];
    setIncorrectCount(prev => prev + 1);
    setIsSubmitted(true);

    const conceptId = (currentQ as AdaptiveQuestion).conceptId || mapTopicToConceptId(currentQ.topic);
    const conceptDef = CHEMISTRY_CONCEPTS.find(c => c.id === conceptId);

    // Record attempt in adaptive engine
    recordAdaptiveAttempt(
      currentQ.id,
      conceptId,
      'Timed Out',
      false,
      currentQ.difficulty
    );

    setSessionHistory(prev => [
      ...prev,
      {
        question: currentQ,
        selectedAnswer: 'Time Expired (No response)',
        isCorrect: false,
        conceptId,
        conceptName: conceptDef?.name || currentQ.topic,
        difficulty: currentQ.difficulty,
        explanation: (currentQ as AdaptiveQuestion).explanation || 'Time ran out before an answer was locked in.',
        whyIncorrect: 'Prompt response time expired under strict laboratory timed mode.'
      }
    ]);

    adjustAdaptiveDifficultyOnAnswer(false);
  };

  // Adjust adaptive difficulty based on performance
  const adjustAdaptiveDifficultyOnAnswer = (isCorrect: boolean) => {
    if (arenaMode !== 'adaptive') return;

    if (isCorrect) {
      setConsecutiveIncorrect(0);
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);

      // Increase difficulty after 2 consecutive correct answers
      if (newConsecutive >= 2) {
        if (currentAdaptiveDifficulty === 'easy') {
          setCurrentAdaptiveDifficulty('medium');
          setDifficultyChangeNotice('Adaptive Level: Medium • Difficulty increased because you answered 2 questions correctly!');
          setConsecutiveCorrect(0);
        } else if (currentAdaptiveDifficulty === 'medium') {
          setCurrentAdaptiveDifficulty('hard');
          setDifficultyChangeNotice('Adaptive Level: Hard • Advancing to competitive exam-level challenge!');
          setConsecutiveCorrect(0);
        }
      }
    } else {
      setConsecutiveCorrect(0);
      const newConsecutive = consecutiveIncorrect + 1;
      setConsecutiveIncorrect(newConsecutive);

      // Decrease difficulty after 2 consecutive incorrect answers
      if (newConsecutive >= 2) {
        if (currentAdaptiveDifficulty === 'hard') {
          setCurrentAdaptiveDifficulty('medium');
          setDifficultyChangeNotice('Adaptive Level: Medium • Adjusted to stabilize conceptual understanding.');
          setConsecutiveIncorrect(0);
        } else if (currentAdaptiveDifficulty === 'medium') {
          setCurrentAdaptiveDifficulty('easy');
          setDifficultyChangeNotice('Adaptive Level: Easy • Switched to foundational questions to reinforce core concepts.');
          setConsecutiveIncorrect(0);
        }
      }
    }
  };

  const handleOptionClick = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const submitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const currentQuestion = quizQuestions[currentIdx];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const timeTaken = (Date.now() - questionStartTime) / 1000;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      if (timeTaken < 6) {
        setFastAnswersCount(prev => prev + 1);
      }
    } else {
      setIncorrectCount(prev => prev + 1);
    }

    // Determine concept
    const conceptId = (currentQuestion as AdaptiveQuestion).conceptId || mapTopicToConceptId(currentQuestion.topic);
    const conceptDef = CHEMISTRY_CONCEPTS.find(c => c.id === conceptId);
    const adaptiveQ = currentQuestion as AdaptiveQuestion;

    // Record in Adaptive Learning Engine immediately!
    recordAdaptiveAttempt(
      currentQuestion.id,
      conceptId,
      selectedOption,
      isCorrect,
      currentQuestion.difficulty
    );

    recordFeatureUsage(
      arenaMode === 'adaptive' ? 'adaptive_practice' : 'quiz',
      arenaMode === 'adaptive' ? 'Adaptive Learning Engine' : 'Quiz Arena Challenge',
      `${isCorrect ? 'Correctly solved' : 'Attempted'} ${currentQuestion.difficulty} question on ${conceptDef?.name || currentQuestion.topic}`,
      'Assessment',
      isCorrect ? 15 : 5
    );

    // Save detailed history for Question Review & Mistake Analysis
    const whyIncorrectNote = !isCorrect && adaptiveQ.whyIncorrect
      ? (adaptiveQ.whyIncorrect[selectedOption] || 'Option does not satisfy the chemical conservation or orbital requirements.')
      : undefined;

    setSessionHistory(prev => [
      ...prev,
      {
        question: currentQuestion,
        selectedAnswer: selectedOption,
        isCorrect,
        conceptId,
        conceptName: conceptDef?.name || currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        explanation: adaptiveQ.explanation || `The correct chemical answer is ${currentQuestion.correctAnswer}.`,
        whyIncorrect: whyIncorrectNote
      }
    ]);

    adjustAdaptiveDifficultyOnAnswer(isCorrect);
    setIsSubmitted(true);
  };

  const advanceQuestion = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setTimeLeft(isTimedMode ? 15 : 30);
      setQuestionStartTime(Date.now());
      setDifficultyChangeNotice(null);
    } else {
      // Completed!
      setQuizCompleted(true);
      setQuizActive(false);

      if (currentUser && currentUser.role !== 'guest') {
        recordQuizResult(
          correctCount + (selectedOption === quizQuestions[currentIdx].correctAnswer ? 1 : 0),
          incorrectCount + (selectedOption !== quizQuestions[currentIdx].correctAnswer ? 1 : 0),
          fastAnswersCount,
          selectedTopic,
          isTimedMode
        );
      }
    }
  };

  // Helper to map general topic to concept id
  function mapTopicToConceptId(topic: string): string {
    if (topic.includes('Organic')) return 'organic_chemistry';
    if (topic.includes('Inorganic')) return 'chemical_bonding';
    return 'thermodynamics';
  }

  // Admin submit question
  const handleAdminAddQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.question || !newQuestion.correctAnswer || newQuestion.options.some(opt => !opt)) {
      setAdminMsg('❌ Complete all fields.');
      return;
    }
    if (!newQuestion.options.includes(newQuestion.correctAnswer)) {
      setAdminMsg('❌ Correct answer must match one option.');
      return;
    }

    addCustomQuestion(newQuestion);
    setAdminMsg('✅ Question successfully compiled into core database!');
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: 'easy',
      topic: 'Organic Chemistry'
    });
    setTimeout(() => setAdminMsg(''), 4000);
  };

  // Calculation of concept breakdown in completed quiz
  const conceptBreakdown = useMemo(() => {
    const map: Record<string, { total: number; correct: number; name: string }> = {};
    sessionHistory.forEach(item => {
      const cid = item.conceptId || 'general';
      if (!map[cid]) {
        map[cid] = { total: 0, correct: 0, name: item.conceptName || 'General Chemistry' };
      }
      map[cid].total += 1;
      if (item.isCorrect) map[cid].correct += 1;
    });
    return Object.values(map);
  }, [sessionHistory]);

  const difficultyBreakdown = useMemo(() => {
    const map: Record<ConceptDifficulty, { total: number; correct: number }> = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 }
    };
    sessionHistory.forEach(item => {
      if (map[item.difficulty]) {
        map[item.difficulty].total += 1;
        if (item.isCorrect) map[item.difficulty].correct += 1;
      }
    });
    return map;
  }, [sessionHistory]);

  const incorrectSessionQuestions = useMemo(() => {
    return sessionHistory.filter(item => !item.isCorrect);
  }, [sessionHistory]);

  return (
    <div className="space-y-8 select-text">
      
      {/* 1. GUEST NOTICE IF NOT LOGGED IN */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/20 rounded-2xl p-6 md:p-8 text-center space-y-4 shadow-[0_0_50px_rgba(34,211,238,0.05)]">
          <Trophy className="text-cyan-400 mx-auto animate-bounce" size={42} />
          <h2 className="text-xl md:text-2xl font-bold font-serif text-white tracking-tight">Competitive Chemistry Arena</h2>
          <p className="max-w-md mx-auto text-slate-300 text-xs font-sans leading-relaxed">
            Log in or sign up above to track your mastery progress, get real-time adaptive questions, trigger rare badges, and join the global Leaderboard!
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => guestLogin()}
              className="px-6 py-2 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all border border-slate-800 cursor-pointer"
            >
              Continue as Guest (No XP saved)
            </button>
          </div>
        </div>
      )}

      {/* 2. QUIZ CONSOLE HUB (NOT ACTIVE, NOT COMPLETED) */}
      {currentUser && !quizActive && !quizCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Select Arena Pane */}
          <div className="lg:col-span-2 bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-6">
            
            {/* Mode Switcher Pill */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-cyan-400" />
                <h3 className="font-mono text-xs font-bold text-white tracking-wider uppercase">Challenge Engine Mode</h3>
              </div>

              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setArenaMode('adaptive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    arenaMode === 'adaptive' 
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap size={12} className={arenaMode === 'adaptive' ? 'fill-black' : ''} />
                  Adaptive AI Mode
                </button>
                <button
                  onClick={() => setArenaMode('standard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    arenaMode === 'standard' 
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers size={12} />
                  Standard Arena
                </button>
              </div>
            </div>

            {/* A. ADAPTIVE MODE SETTINGS */}
            {arenaMode === 'adaptive' && (
              <div className="space-y-5">
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs text-slate-300 leading-relaxed">
                  <span className="text-cyan-300 font-bold block mb-1">⚡ Dynamic Difficulty Active:</span>
                  The engine monitors your responses. Getting 2 consecutive answers correct increases difficulty (Easy → Medium → Hard). If you make mistakes, it adapts to reinforce foundational principles.
                </div>

                {/* Concept Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                    1. Focus Chemistry Concept
                  </label>
                  <select
                    value={selectedConceptId}
                    onChange={(e) => setSelectedConceptId(e.target.value)}
                    className="w-full bg-black/50 border border-slate-800 text-cyan-200 text-xs font-mono rounded-xl p-3 outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="all">All 10 Concepts (Dynamic Auto-Balance)</option>
                    {CHEMISTRY_CONCEPTS.map(c => {
                      const m = studentProfile.masteries[c.id];
                      return (
                        <option key={c.id} value={c.id}>
                          {c.name} (Current Mastery: {m?.mastery_score || 50}%)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Initial Starting Difficulty */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                    2. Starting Calibrated Difficulty
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'easy', label: 'Easy', desc: 'Foundations (1-3)' },
                      { id: 'medium', label: 'Medium', desc: 'Core Curriculum (4-7)' },
                      { id: 'hard', label: 'Hard', desc: 'Advanced Exam (8-10)' }
                    ].map(diff => (
                      <button
                        key={diff.id}
                        onClick={() => setCurrentAdaptiveDifficulty(diff.id as any)}
                        className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider font-mono transition-all text-center cursor-pointer ${
                          currentAdaptiveDifficulty === diff.id 
                            ? 'border-cyan-400 bg-cyan-950/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                            : 'border-slate-800 hover:border-slate-700 bg-black/20 text-slate-400'
                        }`}
                      >
                        {diff.label}
                        <span className="text-[9px] block text-slate-500 lowercase mt-0.5">{diff.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                    3. Practice Set Length
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 8].map(len => (
                      <button
                        key={len}
                        onClick={() => setQuizLength(len)}
                        className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider font-mono transition-all text-center cursor-pointer ${
                          quizLength === len ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 hover:border-slate-700 bg-black/20 text-slate-400'
                        }`}
                      >
                        {len} Questions
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* B. STANDARD MODE SETTINGS */}
            {arenaMode === 'standard' && (
              <div className="space-y-5">
                {/* Topic Select Row */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">1. Select Chemical Science Discipline</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'].map(topic => (
                      <button
                        key={topic}
                        disabled={isDailyChallenge}
                        onClick={() => setSelectedTopic(topic)}
                        className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider font-mono transition-all text-center cursor-pointer ${selectedTopic === topic && !isDailyChallenge ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 hover:border-slate-700 bg-black/20 text-slate-400 disabled:opacity-40'}`}
                      >
                        {topic.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty select row */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">2. Cognitive Grade / Complexity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'easy', label: 'Beginner (Standard)' },
                      { id: 'medium', label: 'School Level' },
                      { id: 'hard', label: 'Competitive Exam' }
                    ].map(diff => (
                      <button
                        key={diff.id}
                        disabled={isDailyChallenge}
                        onClick={() => setSelectedDifficulty(diff.id as any)}
                        className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider font-mono transition-all text-center cursor-pointer ${selectedDifficulty === diff.id && !isDailyChallenge ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 hover:border-slate-700 bg-black/20 text-slate-400 disabled:opacity-40'}`}
                      >
                        {diff.label.split(' ')[0]}
                        <span className="text-[9px] block text-slate-500 lowercase mt-0.5">{diff.label.slice(diff.label.indexOf(' ') + 1)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quiz session length selection row */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">3. Select Quiz Session Length (3 to 5 questions)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 4, 5].map(len => (
                      <button
                        key={len}
                        onClick={() => setQuizLength(len)}
                        className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider font-mono transition-all text-center cursor-pointer ${quizLength === len ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 hover:border-slate-700 bg-black/20 text-slate-400'}`}
                      >
                        {len} Questions
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Timed Toggle */}
            <div className="pt-2">
              <button
                onClick={() => setIsTimedMode(!isTimedMode)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left w-full cursor-pointer ${isTimedMode ? 'border-amber-500 bg-amber-950/10 text-amber-300' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <Timer size={18} className={isTimedMode ? 'text-amber-400' : 'text-slate-500'} />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider font-mono block">Timed Challenge Mode</span>
                  <span className="text-[10px] opacity-70 block mt-0.5">Limits answering time to 15 seconds per question for rapid recall training.</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => startQuiz()}
              className="w-full py-4 text-xs font-black uppercase tracking-widest font-mono text-black bg-cyan-400 hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] rounded-xl transition-all cursor-pointer"
            >
              {arenaMode === 'adaptive' ? 'START ADAPTIVE LEARNING SESSION' : 'LAUNCH MOLECULAR LAB TEST'}
            </button>

          </div>

          {/* Gamified Profile / Mastery Quick View Sidebar */}
          <div className="space-y-6">
            
            {/* Student Rank Card */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-800 pb-2">Academic Profile</h4>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center">
                  <Award className="text-cyan-400 animate-pulse" size={24} />
                </div>
                <div>
                  <h5 className="font-mono text-xs font-bold text-white uppercase">{currentUser.username}</h5>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Overall Mastery: <span className="text-cyan-400 font-bold">{studentProfile.overall_mastery}%</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 font-mono text-[11px] pt-1 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Streak:</span>
                  <span className="text-orange-400 font-bold">🔥 {studentProfile.streak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Solved:</span>
                  <span className="text-white font-bold">{studentProfile.total_questions} questions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Global Score:</span>
                  <span className="text-cyan-300 font-bold">{currentUser.score} pts</span>
                </div>
              </div>

              {onNavigateToDashboard && (
                <button
                  onClick={onNavigateToDashboard}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 rounded-lg text-xs font-mono cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                >
                  <BarChart3 size={13} /> Open Student Analytics
                </button>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 3. ACTIVE QUIZ SESSION WORKSPACE */}
      {quizActive && !quizCompleted && quizQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.05)] select-text">
          
          {/* Header Progress Strip */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                Question {currentIdx + 1} of {quizQuestions.length}
              </span>
              <span className="text-slate-400 capitalize">
                Diff: <strong className="text-white">{quizQuestions[currentIdx]?.difficulty}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 font-bold ${timeLeft <= 5 ? 'text-red-400 animate-ping' : 'text-amber-400'}`}>
                <Timer size={14} /> {timeLeft}s
              </span>
              <span className="text-emerald-400 font-bold">
                Score: {correctCount * 10}
              </span>
            </div>
          </div>

          {/* Adaptive Notification Banner (when difficulty dynamically changes) */}
          <AnimatePresence>
            {difficultyChangeNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-cyan-950/50 border border-cyan-400/50 text-cyan-200 rounded-xl text-xs font-mono flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              >
                <Zap size={14} className="text-cyan-400 fill-cyan-400 shrink-0" />
                <span>{difficultyChangeNotice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Question Text */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              {(quizQuestions[currentIdx] as any).subtopic || quizQuestions[currentIdx]?.topic}
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white font-sans leading-relaxed">
              {quizQuestions[currentIdx]?.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {quizQuestions[currentIdx]?.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === quizQuestions[currentIdx].correctAnswer;
              
              let optionStyles = 'bg-black/40 border-slate-800 text-slate-300 hover:border-cyan-500/50';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  optionStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  optionStyles = 'bg-red-950/40 border-red-500 text-red-200';
                } else {
                  optionStyles = 'bg-black/20 border-slate-900 text-slate-600 opacity-50';
                }
              } else if (isSelected) {
                optionStyles = 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.15)] font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all cursor-pointer flex items-center justify-between ${optionStyles}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-slate-400">
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isSubmitted && isCorrectAnswer && (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrectAnswer && (
                    <X size={18} className="text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation reveal upon submit */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-900/80 border border-slate-700 rounded-xl space-y-3 text-xs"
            >
              <div className="font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                <BookOpen size={13} /> Scientific Explanation
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {(quizQuestions[currentIdx] as AdaptiveQuestion).explanation || 
                  `The correct answer is ${quizQuestions[currentIdx].correctAnswer}.`}
              </p>
              
              <button
                type="button"
                onClick={() => {
                  const currentQ = quizQuestions[currentIdx];
                  window.dispatchEvent(new CustomEvent('open-ai-chemist-tutor', {
                    detail: {
                      prompt: `Explain this problem and give me a full step-by-step solution:\n\n"${currentQ.question}"\n\nOptions:\n${currentQ.options.map((o: string) => '- ' + o).join('\n')}\n\nCorrect Answer: ${currentQ.correctAnswer}\nSelected Answer: ${selectedOption}\nTopic: ${(currentQ as any).subtopic || currentQ.topic}`
                    }
                  }));
                }}
                className="px-3.5 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles size={13} className="text-cyan-400" />
                Ask AI Chemist Tutor for Full Step-by-Step Solution 🔬
              </button>
            </motion.div>
          )}

          {/* Action Button Row */}
          <div className="flex justify-end pt-2">
            {!isSubmitted ? (
              <button
                disabled={!selectedOption}
                onClick={submitAnswer}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={advanceQuestion}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                {currentIdx + 1 < quizQuestions.length ? 'Next Question' : 'View Detailed Report'}
                <ArrowRight size={14} />
              </button>
            )}
          </div>

        </div>
      )}

      {/* 4. PERFORMANCE RESULTS COMPOSITE CARDS & QUESTION REVIEW (PROMPT SECTION 6) */}
      {quizCompleted && quizQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#111318] border border-cyan-500/25 rounded-2xl p-6 md:p-8 space-y-8 select-text shadow-[0_0_50px_rgba(34,211,238,0.06)]">
          
          {/* Header Score summary */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-800">
            <Trophy className="text-yellow-400 mx-auto animate-bounce-short" size={48} />
            <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-cyan-500/30 text-cyan-300 bg-cyan-950/20 rounded-full select-none">
              Lab Assessment Completed
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">Performance & Mistake Analysis Report</h2>
            <p className="text-slate-400 text-xs font-sans max-w-md mx-auto">
              Your results have been synchronized with your Adaptive Concept Mastery profile.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-3 max-w-lg mx-auto">
              <div className="p-3 bg-black/40 border border-emerald-500/20 rounded-xl">
                <span className="text-2xl font-black font-mono text-emerald-400">{correctCount}</span>
                <span className="text-[9px] text-slate-500 uppercase block font-mono">Correct</span>
              </div>
              <div className="p-3 bg-black/40 border border-red-500/20 rounded-xl">
                <span className="text-2xl font-black font-mono text-red-400">{incorrectCount}</span>
                <span className="text-[9px] text-slate-500 uppercase block font-mono">Mistakes</span>
              </div>
              <div className="p-3 bg-black/40 border border-cyan-500/20 rounded-xl">
                <span className="text-2xl font-black font-mono text-cyan-300">
                  {Math.round((correctCount / (correctCount + incorrectCount || 1)) * 100)}%
                </span>
                <span className="text-[9px] text-slate-500 uppercase block font-mono">Accuracy</span>
              </div>
            </div>
          </div>

          {/* SECTION 6.1: CONCEPT-WISE & DIFFICULTY-WISE PERFORMANCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Concept-Wise Performance */}
            <div className="bg-black/30 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                Concept-Wise Performance
              </span>
              <div className="space-y-2">
                {conceptBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">{item.name}</span>
                    <span className="font-mono text-slate-400">
                      {item.correct} / {item.total} ({Math.round((item.correct / item.total) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty-Wise Performance */}
            <div className="bg-black/30 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <span className="font-mono text-xs font-bold text-purple-300 uppercase tracking-wider block">
                Difficulty-Wise Performance
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Easy (Foundations):</span>
                  <span className="font-mono text-slate-400">
                    {difficultyBreakdown.easy.correct} / {difficultyBreakdown.easy.total || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Medium (Core):</span>
                  <span className="font-mono text-slate-400">
                    {difficultyBreakdown.medium.correct} / {difficultyBreakdown.medium.total || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Hard (Competitive):</span>
                  <span className="font-mono text-slate-400">
                    {difficultyBreakdown.hard.correct} / {difficultyBreakdown.hard.total || 0}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 6.2: QUESTION REVIEW & MISTAKE ANALYSIS CARDS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle size={16} className="text-cyan-400" />
                Comprehensive Mistake Analysis & Item Review
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {incorrectSessionQuestions.length} mistakes analyzed
              </span>
            </div>

            {sessionHistory.map((item, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-xl border space-y-3 transition-all ${
                  item.isCorrect 
                    ? 'bg-emerald-950/10 border-emerald-500/20' 
                    : 'bg-red-950/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase ${
                        item.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Concept: <strong className="text-cyan-300">{item.conceptName}</strong>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        Diff: {item.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white font-sans mt-1">
                      {idx + 1}. {item.question.question}
                    </h4>
                  </div>
                </div>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className={`p-2.5 rounded-lg border ${
                    item.isCorrect 
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                      : 'bg-red-950/30 border-red-500/40 text-red-200'
                  }`}>
                    <span className="text-[9px] uppercase text-slate-500 block">Your Answer:</span>
                    <strong>{item.selectedAnswer}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                    <span className="text-[9px] uppercase text-slate-500 block">Correct Answer:</span>
                    <strong>{item.question.correctAnswer}</strong>
                  </div>
                </div>

                {/* Why Incorrect (Distractor Analysis) */}
                {!item.isCorrect && item.whyIncorrect && (
                  <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-lg text-xs space-y-1">
                    <span className="font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                      ⚠ Why your answer was incorrect:
                    </span>
                    <p className="text-slate-300 italic font-sans">
                      {item.whyIncorrect}
                    </p>
                  </div>
                )}

                {/* Explanation */}
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs space-y-1">
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Scientific Explanation:
                  </span>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                {/* Recommended Follow-up Practice */}
                {!item.isCorrect && (
                  <div className="text-[11px] font-mono text-cyan-300 pt-1 flex items-center gap-2">
                    <ArrowRight size={12} className="text-cyan-400" />
                    <span>Recommended: Review {item.conceptName} → Practice Easy → Attempt Medium</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setQuizQuestions([]);
                setQuizCompleted(false);
                setQuizActive(false);
                startQuiz();
              }}
              className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
            >
              <RefreshCw size={13} /> Retake / Run New Practice
            </button>

            {onNavigateToDashboard && (
              <button
                onClick={onNavigateToDashboard}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
              >
                <BarChart3 size={13} /> View in Student Dashboard
              </button>
            )}
          </div>

        </div>
      )}

      {/* 5. SECURE ADMIN QUESTION COMPILATION UNIT (Preserved from previous prompt) */}
      {currentUser && currentUser.role === 'admin' ? (
        <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Plus size={16} className="text-cyan-400" />
              <h4 className="font-mono text-xs font-black text-cyan-400 tracking-widest uppercase">Admin Question Compiler Console</h4>
            </div>
            <span className="font-mono text-[9px] bg-red-950/40 text-red-400 border border-red-900/30 px-2 py-0.5 rounded uppercase font-bold">Authorized Session: {currentUser.username}</span>
          </div>

          <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
            As logged in <strong className="text-cyan-300">Administrator</strong>, you can add new questions directly to the global database registry.
          </p>

          <form onSubmit={handleAdminAddQ} className="space-y-4 pt-1 font-mono text-xs">
            {adminMsg && (
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 text-cyan-300 rounded-lg font-bold text-[11px] animate-pulse">
                {adminMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Scientific Question Text</label>
                <input
                  type="text"
                  required
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="e.g. What is the molecular layout representation of methane?"
                  className="w-full text-xs bg-black/60 px-3 py-2 border border-slate-800 rounded-lg text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Discipline Category</label>
                  <select
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                    className="w-full text-xs bg-black/60 px-3 py-2 border border-slate-800 rounded-lg text-slate-350 outline-none focus:border-cyan-500"
                  >
                    <option value="Organic Chemistry">Organic Chemistry</option>
                    <option value="Inorganic Chemistry">Inorganic Chemistry</option>
                    <option value="Physical Chemistry">Physical Chemistry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Difficulty Complexity</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                    className="w-full text-xs bg-black/60 px-3 py-2 border border-slate-800 rounded-lg text-slate-350 outline-none focus:border-cyan-500"
                  >
                    <option value="easy">Beginner (Easy)</option>
                    <option value="medium">School (Intermediate)</option>
                    <option value="hard">Competitive (Advanced)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest select-none">Multiple Choice Options (Fill all 4)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {newQuestion.options.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => {
                      const next = [...newQuestion.options];
                      next[idx] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: next });
                    }}
                    placeholder={`Option ${['A', 'B', 'C', 'D'][idx]} Choice`}
                    className="text-xs bg-black/60 px-3 py-2 border border-slate-800 rounded-lg text-slate-300 outline-none focus:border-cyan-500"
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Correct Answer String</label>
                <input
                  type="text"
                  required
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                  placeholder="Must match one option exactly..."
                  className="w-full text-xs bg-black/60 px-3 py-2 border border-slate-800 rounded-lg text-slate-200 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-extrabold uppercase rounded-lg tracking-wider transition-all cursor-pointer text-center select-none"
                >
                  Publish Question Node
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-[#111318] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Lock size={15} className="text-amber-500 animate-pulse" />
            <h4 className="font-mono text-xs font-black text-amber-500 tracking-widest uppercase">Admin Gateway Login</h4>
          </div>

          <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
            Authorized administrative staff can log in here using credentials (username: <strong className="text-cyan-300">yours_pranz</strong>) to register, customize, and upload multiple-choice chemistry questions for the arena database.
          </p>

          <form onSubmit={handleAdminGatewayLogin} className="space-y-3 font-mono text-xs max-w-md pt-1">
            {adminLoginError && (
              <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-300 rounded-lg font-bold text-[10px] leading-relaxed">
                ❌ {adminLoginError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Admin Username</label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Username (yours_pranz)"
                  className="w-full text-xs bg-black/50 border border-slate-800 focus:border-cyan-500/50 px-3 py-2 rounded-lg outline-none text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Admin Password</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Password (pran123.)"
                  className="w-full text-xs bg-black/50 border border-slate-800 focus:border-cyan-500/50 px-3 py-2 rounded-lg outline-none text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingInAdmin}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/30 text-black font-extrabold uppercase rounded-lg tracking-wider transition-all cursor-pointer text-center select-none flex items-center justify-center gap-1.5"
            >
              <Key size={12} /> {isLoggingInAdmin ? 'Authenticating...' : 'Unlock Admin Workspace'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
