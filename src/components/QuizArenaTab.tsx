import React, { useState, useEffect } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { QuizQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Timer, Award, CheckCircle2, AlertTriangle, RefreshCw, Layers, Plus, BookOpen } from 'lucide-react';

export const QuizArenaTab: React.FC = () => {
  const { currentUser, questions, addCustomQuestion, recordQuizResult, guestLogin } = useAuthAndQuiz();
  
  // Selection States
  const [selectedTopic, setSelectedTopic] = useState<string>('Organic Chemistry');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isTimedMode, setIsTimedMode] = useState<boolean>(false);
  const [isDailyChallenge, setIsDailyChallenge] = useState<boolean>(false);
  
  // Quiz Session States
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  // Performance and Scoring Trackers
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);
  const [fastAnswersCount, setFastAnswersCount] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  
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

  // Setup quiz session
  const startQuiz = () => {
    let filtered = [...questions];
    
    if (isDailyChallenge) {
      // Pick 5 random questions regardless of topic
      filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
      // Filter by topic and difficulty
      filtered = filtered.filter(q => q.topic === selectedTopic && q.difficulty === selectedDifficulty);
      // Fallback if no questions matched - pick random 4 from that topic
      if (filtered.length === 0) {
        filtered = questions.filter(q => q.topic === selectedTopic);
      }
      // Shuffle first 5
      filtered = filtered.sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    if (filtered.length === 0) {
      filtered = questions.slice(0, 4); // Absolute fallback
    }

    setQuizQuestions(filtered);
    setCurrentIdx(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setFastAnswersCount(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setQuizActive(true);
    setQuizCompleted(false);
    setTimeLeft(isTimedMode ? 15 : 30); // 15 seconds in hard timed mode
    setQuestionStartTime(Date.now());
  };

  // Timer tick
  useEffect(() => {
    if (!quizActive || quizCompleted || isSubmitted) return;

    if (timeLeft <= 0) {
      // Automatically record wrong answer
      setIncorrectCount(prev => prev + 1);
      setIsSubmitted(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quizActive, quizCompleted, isSubmitted]);

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
      // Fast answer counts if locked in under 6 seconds
      if (timeTaken < 6) {
        setFastAnswersCount(prev => prev + 1);
      }
    } else {
      setIncorrectCount(prev => prev + 1);
    }

    setIsSubmitted(true);
  };

  const advanceQuestion = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setTimeLeft(isTimedMode ? 15 : 30);
      setQuestionStartTime(Date.now());
    } else {
      // All questions completed!
      setQuizCompleted(true);
      setQuizActive(false);
      // Record scores to state (if logged in)
      if (currentUser && currentUser.role !== 'guest') {
        recordQuizResult(correctCount + (selectedOption === quizQuestions[currentIdx].correctAnswer ? 1 : 0), incorrectCount + (selectedOption !== quizQuestions[currentIdx].correctAnswer ? 1 : 0), fastAnswersCount, selectedTopic, isTimedMode);
      }
    }
  };

  // Admin submit question
  const handleAdminAddQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.question || !newQuestion.correctAnswer || newQuestion.options.some(opt => !opt)) {
      setAdminMsg('❌ Complete all fields.');
      return;
    }
    if (!newQuestion.options.includes(newQuestion.correctAnswer)) {
      setAdminMsg('❌ Correct answer must match one options.');
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

  return (
    <div className="space-y-8 select-text">
      
      {/* 1. STATE LOCK: REQUIRE REGISTERED LOGIN FOR RANKING POINTS */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/20 rounded-2xl p-6 md:p-8 text-center space-y-4 shadow-[0_0_50px_rgba(34,211,238,0.05)]">
          <Trophy className="text-cyan-400 mx-auto animate-bounce" size={42} />
          <h2 className="text-xl md:text-2xl font-bold font-serif text-white tracking-tight">Competitive Chemistry Arena</h2>
          <p className="max-w-md mx-auto text-slate-350 text-xs font-sans leading-relaxed">
            Log in or sign up above to participate in structured quizzes, earn Experience Points (XP), trigger rare achievements, gain status rankings, and join the global Leaderboard!
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => guestLogin()}
              className="px-6 py-2 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all border border-slate-800"
            >
              Continue as Guest (No XP saved)
            </button>
          </div>
        </div>
      )}

      {/* 2. QUIZ CONSOLE HUB */}
      {currentUser && !quizActive && !quizCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Select Arena Pane */}
          <div className="lg:col-span-2 bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2.5">
              <Gamepad2Icon size={18} className="text-cyan-400" />
              <h3 className="font-mono text-xs font-bold text-cyan-400 tracking-wider uppercase">Select Challenge Configuration</h3>
            </div>

            {/* Topic Select Row */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">1. Select Chemical Science Discipline</label>
              <div className="grid grid-cols-3 gap-2">
                {['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'].map(topic => (
                  <button
                    key={topic}
                    disabled={isDailyChallenge}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider font-mono transition-all text-center ${selectedTopic === topic && !isDailyChallenge ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 hover:border-slate-700 bg-black/20 text-slate-400 disabled:opacity-40'}`}
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
                    className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider font-mono transition-all text-center ${selectedDifficulty === diff.id && !isDailyChallenge ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 hover:border-slate-700 bg-black/20 text-slate-400 disabled:opacity-40'}`}
                  >
                    {diff.label.split(' ')[0]}
                    <span className="text-[9px] block text-slate-550 lowercase tracking-tight mt-0.5">{diff.label.slice(diff.label.indexOf(' ') + 1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modes selector badges */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">3. Core Settings & Constraints</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Timed toggle */}
                <button
                  onClick={() => setIsTimedMode(!isTimedMode)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${isTimedMode ? 'border-amber-500 bg-amber-950/10 text-amber-300' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <Timer size={18} className={isTimedMode ? 'text-amber-400' : 'text-slate-500'} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider font-mono block">Speed Countdown Challenge!</span>
                    <span className="text-[10px] opacity-70 block mt-0.5">Limits reaction selection time with fast bonus payouts (+5 pts)</span>
                  </div>
                </button>

                {/* Daily Challenge toggle */}
                <button
                  onClick={() => {
                    const toggle = !isDailyChallenge;
                    setIsDailyChallenge(toggle);
                    if (toggle) {
                      setIsTimedMode(true); // Forced timed in daily challenge!
                    }
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${isDailyChallenge ? 'border-purple-500 bg-purple-950/10 text-purple-300' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <Sparkles size={18} className={isDailyChallenge ? 'text-purple-400 animate-pulse' : 'text-slate-500'} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider font-mono block">Daily Random Medley</span>
                    <span className="text-[10px] opacity-70 block mt-0.5 font-sans">Combines mixed syllabus questions with high competitive multipliers.</span>
                  </div>
                </button>

              </div>
            </div>

            <button
              onClick={() => startQuiz()}
              className="w-full py-4 text-xs font-black uppercase tracking-widest font-mono text-black bg-cyan-400 hover:bg-cyan-305 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] rounded-xl transition-all font-bold cursor-pointer"
            >
              LAUNCH MOLECULAR LAB TEST
            </button>

          </div>

          {/* Gamified Profile / Leaderboard Quick View Sidebar */}
          <div className="space-y-6">
            
            {/* User Grade indicators */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-800 pb-2">Academic Rank Card</h4>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center">
                  <Award className="text-cyan-400 animate-pulse" size={24} />
                </div>
                <div>
                  <h5 className="font-mono text-xs font-bold text-white uppercase">{currentUser.username}</h5>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Grade Role: <span className="text-cyan-400 font-bold capitalize">{currentUser.role}</span>
                  </p>
                </div>
              </div>

              {currentUser.role !== 'guest' ? (
                <div className="space-y-3 font-mono text-[11px] pt-1 border-t border-slate-850">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Global Score:</span>
                    <span className="text-cyan-300 font-bold">{currentUser.score} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">XP Accumulation:</span>
                    <span className="text-purple-305 font-bold">{currentUser.xp} XP</span>
                  </div>
                  
                  {/* EXP percentage progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-550">
                      <span>Level {currentUser.level} {getLevelTitle(currentUser.level)}</span>
                      <span>{currentUser.xp % 60} / 60 XP</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-slate-805">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-450 rounded-full"
                        style={{ width: `${Math.min(100, ((currentUser.xp % 60) / 60) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {currentUser.badges.length > 0 ? (
                      currentUser.badges.map((badge, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[8.5px] font-bold border border-cyan-455/35 bg-cyan-450/10 text-cyan-300 uppercase tracking-tight">
                          🏆 {badge}
                        </span>
                      ))
                    ) : (
                      <span className="text-[9.5px] italic text-slate-600 font-sans">No research badges collected yet. Finish high score quizzes!</span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 leading-normal italic font-mono pt-1">
                  Playing in Guest session. Login to activate level experience tracks, custom avatars, and global badges.
                </p>
              )}
            </div>

            {/* Syllabus summary */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 select-text text-slate-400 space-y-3">
              <h4 className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block border-b border-slate-800 pb-2">Academic Index Rules</h4>
              <div className="space-y-2 text-[10.5px] font-mono">
                <p className="leading-relaxed"><strong className="text-cyan-300 font-bold">+10 pts</strong> for every correct reaction answered.</p>
                <p className="leading-relaxed"><strong className="text-amber-400 font-bold">+5 pts</strong> as speed rewards (replies in under 6s).</p>
                <p className="leading-relaxed"><strong className="text-red-500 font-bold">-2 pts</strong> penalty subtraction for inaccurate responses.</p>
                <p className="leading-relaxed opacity-70">XP triggers level advancement. Advancing levels unlocks standard custom bio titles.</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 3. ACTIVE RUNNING QUIZ PRESENTATION CARDS */}
      {quizActive && quizQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto bg-[#111318] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
          
          {/* Neon background blur nodes specifically in quiz */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/5 rounded-full blur-[40px] pointer-events-none" />

          {/* Quiz running headers */}
          <div className="flex justify-between items-center text-xs font-mono border-b border-slate-800/60 pb-4">
            <span className="text-slate-550">
              Topic: <span className="text-cyan-400 font-bold uppercase">{isDailyChallenge ? 'MIXED SYLLABUS' : selectedTopic}</span>
            </span>
            
            <div className="flex items-center gap-2">
              <span className="text-slate-500">GRADE: {selectedDifficulty.toUpperCase()}</span>
              <span className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5 text-amber-400">
                <Timer size={14} className="animate-spin" />
                <span className="font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Question Text block */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-slate-500 text-[10.5px] font-mono">
              <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
              <span className="font-sans font-bold text-cyan-400 uppercase tracking-widest">{Math.round(((currentIdx) / quizQuestions.length) * 100)}% Complete</span>
            </div>

            {/* Custom procedural design progress bar (e.g. ████░░░░ 50%) */}
            <div className="font-mono text-cyan-500 text-xs tracking-tight select-none leading-none">
              {`${'█'.repeat(currentIdx + 1)}${'░'.repeat(quizQuestions.length - (currentIdx + 1))} ${(currentIdx + 1) * 20}%`}
            </div>

            <h4 className="text-lg font-bold text-white font-sans tracking-tight leading-snug">
              {quizQuestions[currentIdx].question}
            </h4>
          </div>

          {/* Multiple options dynamic stack */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {quizQuestions[currentIdx].options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isOptionSelected = selectedOption === option;
              
              // Color parameters based on state
              let optStyle = "border-slate-810 bg-black/15 text-slate-300 hover:border-slate-700 hover:bg-white/[0.02]";
              if (isOptionSelected && !isSubmitted) {
                optStyle = "border-cyan-400 bg-cyan-950/20 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.1)]";
              } else if (isSubmitted) {
                const isCorrectAns = option === quizQuestions[currentIdx].correctAnswer;
                if (isCorrectAns) {
                  optStyle = "border-emerald-555 bg-emerald-950/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] font-bold";
                } else if (isOptionSelected) {
                  optStyle = "border-red-500 bg-red-950/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                } else {
                  optStyle = "border-slate-850 bg-black/10 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={option}
                  disabled={isSubmitted}
                  onClick={() => handleOptionClick(option)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left text-xs transition-all cursor-pointer ${optStyle}`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono border ${isOptionSelected ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' : 'bg-black/40 text-slate-400 border-slate-800'}`}>
                    {letter}
                  </span>
                  <span className="font-sans font-medium">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons footer */}
          <div className="flex justify-end pt-4 border-t border-slate-800/60 font-mono text-xs">
            {!isSubmitted ? (
              <button
                onClick={() => submitAnswer()}
                disabled={!selectedOption}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-black font-extrabold uppercase rounded-xl transition-all cursor-pointer shadow-md disabled:cursor-not-allowed"
              >
                Confirm Reaction
              </button>
            ) : (
              <button
                onClick={() => advanceQuestion()}
                className="px-6 py-3 bg-white/[0.04] border border-cyan-400/30 hover:border-cyan-400 text-cyan-300 uppercase rounded-xl font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                Next Chemical Node →
              </button>
            )}
          </div>

        </div>
      )}

      {/* 4. PERFORMANCE RESULTS COMPOSITE CARDS */}
      {quizCompleted && quizQuestions.length > 0 && (
        <div className="max-w-2xl mx-auto bg-[#111318] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 select-text">
          
          <div className="text-center space-y-3 pb-4 border-b border-slate-800/60">
            <Trophy className="text-yellow-400 mx-auto animate-bounce-short" size={48} />
            <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-widest border border-cyan-500/30 text-cyan-300 bg-cyan-950/20 rounded-full select-none">
              Research Examination Accomplished
            </span>
            <h3 className="text-2xl font-black font-serif text-white tracking-tight pt-1">Your Laboratory Performance Profile</h3>
            <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto">
              Nice work! Your particle reasoning accuracy has been quantified and calculated. Here is your spectral report.
            </p>
          </div>

          {/* Accuracy counts indicators */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-4 bg-black/25 rounded-xl border border-emerald-500/20">
              <span className="text-2xl font-black font-mono text-emerald-400">{correctCount}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono mt-1">Accurate Answers</span>
            </div>
            
            <div className="p-4 bg-black/25 rounded-xl border border-red-500/20">
              <span className="text-2xl font-black font-mono text-red-400">{incorrectCount}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono mt-1">Faulty Answers</span>
            </div>

            <div className="p-4 bg-black/25 rounded-xl border border-amber-500/20">
              <span className="text-2xl font-black font-mono text-amber-400">{fastAnswersCount}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono mt-1">Speed Payout / Hotkey</span>
            </div>
          </div>

          {/* Gamified summary points indicators feedback */}
          <div className="bg-black/40 border border-slate-805 rounded-xl p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Correct questions multiplier (x10 pts):</span>
              <span className="text-emerald-400">+{correctCount * 10} Score</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Reaction efficiency speed bonuses (x5 pts):</span>
              <span className="text-amber-400">+{fastAnswersCount * 5} Score</span>
            </div>
            <div className="flex justify-between text-slate-400 border-b border-slate-800/40 pb-2">
              <span>Deductions for compound error mismatch (-2 pts):</span>
              <span className="text-red-400">-{incorrectCount * 2} Score</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold pt-1">
              <span className="text-white">Total Dynamic Quiz Score:</span>
              <span className="text-cyan-305 bg-cyan-950/40 p-1 px-2 border border-cyan-400/30 rounded">
                +{Math.max(0, (correctCount * 10) + (fastAnswersCount * 5) - (incorrectCount * 2))} pts
              </span>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => {
                setQuizQuestions([]);
                setQuizCompleted(false);
                setQuizActive(false);
              }}
              className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
            >
              <RefreshCw size={13} /> Run New Lab Test
            </button>
          </div>

        </div>
      )}

      {/* 5. SECURE ADMIN QUESTION COMPILATION UNIT (Only available to Admins like admin@chemizic.com) */}
      {currentUser && currentUser.role === 'admin' && (
        <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-805">
            <Plus size={16} className="text-cyan-400 animate-spin-slow" />
            <h4 className="font-mono text-xs font-black text-cyan-400 tracking-widest uppercase">Admin Question Compiler console</h4>
          </div>

          <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
            As logged in <strong className="text-cyan-300">Administrator</strong>, you can add new questions directly to the global database registry. They will render in structural quiz sessions immediately!
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
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-[8.5px]">Discipline Category</label>
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
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-[8.5px]">Difficulty Complexity</label>
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

            {/* Multiple Options configurations inputs */}
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
                  placeholder="Must match one options exactly..."
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
      )}

    </div>
  );
};

// Simple helpers
function getLevelTitle(level: number) {
  if (level >= 10) return '(Molecular Master)';
  if (level >= 5) return '(Lab Scientist)';
  return '(Beginner Chemist)';
}

// Custom simple icons for local layout robustness
const Gamepad2Icon = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="6" x2="10" y1="12" y2="12" />
    <line x1="8" x2="8" y1="10" y2="14" />
    <line x1="15" x2="15.01" y1="13" y2="13" />
    <line x1="18" x2="18.01" y1="11" y2="11" />
    <rect width="20" height="12" x="2" y="6" rx="3" />
  </svg>
);
