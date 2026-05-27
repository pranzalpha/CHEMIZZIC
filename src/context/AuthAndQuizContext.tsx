import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, QuizQuestion, LeaderboardEntry } from '../types';
import { initialQuestions } from '../data/quizQuestions';

interface AuthAndQuizContextType {
  currentUser: User | null;
  questions: QuizQuestion[];
  leaderboard: LeaderboardEntry[];
  login: (email: string, username: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addCustomQuestion: (question: Omit<QuizQuestion, 'id'>) => void;
  recordQuizResult: (
    correctCount: number, 
    incorrectCount: number, 
    fastAnswersCount: number,
    topic: string,
    isTimed: boolean
  ) => void;
  guestLogin: () => void;
}

const AuthAndQuizContext = createContext<AuthAndQuizContextType | undefined>(undefined);

const PRESET_LEADERBOARD: LeaderboardEntry[] = [
  { userId: 'leader_1', username: 'Prantik', score: 980, level: 12, quizAttempts: 15, badges: ['Organic Master', 'First Breakthrough', 'Acid Master'] },
  { userId: 'leader_2', username: 'Alex', score: 740, level: 8, quizAttempts: 11, badges: ['Acid Master', 'First Breakthrough'] },
  { userId: 'leader_3', username: 'Riya', score: 510, level: 6, quizAttempts: 8, badges: ['First Breakthrough'] }
];

export const AuthAndQuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('chemizic_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem('chemizic_questions');
    return saved ? JSON.parse(saved) : initialQuestions;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('chemizic_leaderboard');
    if (saved) return JSON.parse(saved);
    return PRESET_LEADERBOARD;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('chemizic_user', JSON.stringify(currentUser));
      
      // Keep leaderboard updated with current user stats
      setLeaderboard(prev => {
        const existingIdx = prev.findIndex(item => item.userId === currentUser.id);
        const updatedEntry: LeaderboardEntry = {
          userId: currentUser.id,
          username: currentUser.username,
          score: currentUser.score,
          level: currentUser.level,
          quizAttempts: currentUser.quizAttempts,
          badges: currentUser.badges
        };
        
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = updatedEntry;
          return next.sort((a, b) => b.score - a.score);
        } else {
          return [...prev, updatedEntry].sort((a, b) => b.score - a.score);
        }
      });
    } else {
      localStorage.removeItem('chemizic_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('chemizic_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('chemizic_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const login = async (email: string, username: string) => {
    // Standard mock authentication that allows quick setup on the fly
    const userEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim() || userEmail.split('@')[0];
    
    // Set up role: if they try admin@chemizic.com, let them be an admin
    const isAdmin = userEmail === 'admin@chemizic.com' || userEmail.startsWith('admin');
    
    // Look if user exists in the local leaderboard or create new
    const existingLeaderboard = leaderboard.find(l => l.username.toLowerCase() === cleanUsername.toLowerCase());
    
    const matchedUser: User = {
      id: existingLeaderboard?.userId || `user_${Date.now()}`,
      username: existingLeaderboard?.username || cleanUsername,
      email: userEmail,
      score: existingLeaderboard?.score || 0,
      xp: (existingLeaderboard?.score || 0) * 5, // 5 XP per 1 point approx
      level: existingLeaderboard?.level || 1,
      quizAttempts: existingLeaderboard?.quizAttempts || 0,
      badges: existingLeaderboard?.badges || [],
      joinedAt: new Date().toISOString().split('T')[0],
      role: isAdmin ? 'admin' : 'user'
    };

    setCurrentUser(matchedUser);
    return { success: true };
  };

  const signup = async (username: string, email: string) => {
    const userEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    
    if (!cleanUsername || !userEmail) {
      return { success: false, error: 'All fields are required.' };
    }

    const nameTaken = leaderboard.some(l => l.username.toLowerCase() === cleanUsername.toLowerCase());
    if (nameTaken) {
      return { success: false, error: 'Username is already taken.' };
    }

    const isAdmin = userEmail === 'admin@chemizic.com' || userEmail.startsWith('admin');

    const newUser: User = {
      id: `user_${Date.now()}`,
      username: cleanUsername,
      email: userEmail,
      score: 0,
      xp: 0,
      level: 1,
      quizAttempts: 0,
      badges: [],
      joinedAt: new Date().toISOString().split('T')[0],
      role: isAdmin ? 'admin' : 'user'
    };

    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const guestLogin = () => {
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      username: 'Guest Scholar',
      email: 'guest@chemizic.com',
      score: 0,
      xp: 0,
      level: 1,
      quizAttempts: 0,
      badges: [],
      joinedAt: new Date().toISOString().split('T')[0],
      role: 'guest'
    };
    setCurrentUser(guestUser);
  };

  const addCustomQuestion = (newQ: Omit<QuizQuestion, 'id'>) => {
    const fullQuestion: QuizQuestion = {
      ...newQ,
      id: `custom_${Date.now()}`
    };
    setQuestions(prev => [fullQuestion, ...prev]);
  };

  const recordQuizResult = (
    correctCount: number, 
    incorrectCount: number, 
    fastAnswersCount: number,
    topic: string,
    isTimed: boolean
  ) => {
    if (!currentUser || currentUser.role === 'guest') return;

    // Point parameter rules:
    // +10 per correct answer
    // +5 for fast answers
    // -2 for wrong answers
    let addedPoints = (correctCount * 10) + (fastAnswersCount * 5) - (incorrectCount * 2);
    if (addedPoints < 0) addedPoints = 0;

    // XP calculation: 8 XP per correct, 4 XP per fast, 15 XP bonus for completing
    const xpGained = (correctCount * 12) + (fastAnswersCount * 6) + 20;

    const newScore = currentUser.score + addedPoints;
    const newXp = currentUser.xp + xpGained;
    
    // Level up calculation: every 60 XP = 1 level
    const newLevel = Math.max(currentUser.level, Math.floor(newXp / 60) + 1);

    // Badges collection update
    const newBadges = [...currentUser.badges];
    if (!newBadges.includes('First Breakthrough')) {
      newBadges.push('First Breakthrough');
    }

    if (topic === 'Organic Chemistry' && correctCount >= 4 && !newBadges.includes('Organic Master')) {
      newBadges.push('Organic Master');
    }
    if (topic === 'Inorganic Chemistry' && correctCount >= 4 && !newBadges.includes('Acid Master')) {
      newBadges.push('Acid Master');
    }
    if (topic === 'Physical Chemistry' && correctCount >= 4 && !newBadges.includes('Physical Champion')) {
      newBadges.push('Physical Champion');
    }
    if (isTimed && correctCount >= 4 && !newBadges.includes('Speed Demon')) {
      newBadges.push('Speed Demon');
    }
    if (newLevel >= 5 && !newBadges.includes('Lab Scientist')) {
      newBadges.push('Lab Scientist');
    }
    if (newLevel >= 10 && !newBadges.includes('Molecular Master')) {
      newBadges.push('Molecular Master');
    }

    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        score: newScore,
        xp: newXp,
        level: newLevel,
        quizAttempts: prev.quizAttempts + 1,
        badges: newBadges
      };
    });
  };

  return (
    <AuthAndQuizContext.Provider value={{
      currentUser,
      questions,
      leaderboard,
      login,
      signup,
      logout,
      addCustomQuestion,
      recordQuizResult,
      guestLogin
    }}>
      {children}
    </AuthAndQuizContext.Provider>
  );
};

export const useAuthAndQuiz = () => {
  const context = useContext(AuthAndQuizContext);
  if (context === undefined) {
    throw new Error('useAuthAndQuiz must be used within an AuthAndQuizProvider');
  }
  return context;
};
