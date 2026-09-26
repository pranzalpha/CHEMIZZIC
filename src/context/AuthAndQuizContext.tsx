import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  QuizQuestion, 
  LeaderboardEntry, 
  StudentProfile, 
  ConceptMastery, 
  StudentAttempt, 
  Recommendation, 
  ConceptDifficulty,
  FeatureActivityLog,
  DailyLoginRecord,
  Assignment,
  UserRole
} from '../types';
import { initialQuestions } from '../data/quizQuestions';
import { 
  ADAPTIVE_QUESTIONS_BANK, 
  AdaptiveQuestion, 
  CHEMISTRY_CONCEPTS 
} from '../data/chemistryConcepts';
import { 
  calculateNewConceptMastery, 
  calculateOverallMastery, 
  generateRecommendations, 
  createDefaultConceptMasteries, 
  PRESET_CLASSROOM_STUDENTS 
} from '../services/adaptiveEngine';
import { INITIAL_DAILY_LOGINS, INITIAL_FEATURE_LOGS } from '../data/initialActivityData';

interface AuthAndQuizContextType {
  currentUser: User | null;
  questions: QuizQuestion[];
  adaptiveQuestions: AdaptiveQuestion[];
  leaderboard: LeaderboardEntry[];
  studentProfile: StudentProfile;
  allStudents: StudentProfile[];
  selectedClass: string;
  setSelectedClass: (className: string) => void;
  featureLogs: FeatureActivityLog[];
  dailyLogins: DailyLoginRecord[];
  assignments: Assignment[];
  createAssignment: (assignment: Omit<Assignment, 'id' | 'created_at' | 'completed_by'>) => Promise<void>;
  completeAssignment: (assignmentId: string) => Promise<void>;
  recordFeatureUsage: (
    feature_id: FeatureActivityLog['feature_id'],
    feature_name: string,
    action: string,
    category?: FeatureActivityLog['category'],
    xpEarned?: number
  ) => void;
  claimDailyLoginBonus: () => { success: boolean; bonusXp: number; message: string };
  login: (email: string, username: string, password?: string, targetRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (
    username: string, 
    email: string, 
    options?: { roll_no?: string; student_class?: string; section?: string; role?: UserRole }
  ) => Promise<{ success: boolean; error?: string }>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
  addCustomQuestion: (question: Omit<QuizQuestion, 'id'>) => void;
  recordQuizResult: (
    correctCount: number, 
    incorrectCount: number, 
    fastAnswersCount: number,
    topic: string,
    isTimed: boolean
  ) => void;
  recordAdaptiveAttempt: (
    questionId: string,
    conceptId: string,
    selectedAnswer: string,
    isCorrect: boolean,
    difficulty: ConceptDifficulty
  ) => void;
  guestLogin: () => void;
  refreshRecommendations: () => void;
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

  const [selectedClass, setSelectedClass] = useState<string>('Class 12 - Section B');

  const [allStudents, setAllStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('chemizic_all_students');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return PRESET_CLASSROOM_STUDENTS;
  });

  const [adaptiveQuestions] = useState<AdaptiveQuestion[]>(ADAPTIVE_QUESTIONS_BANK);

  const [featureLogs, setFeatureLogs] = useState<FeatureActivityLog[]>(() => {
    const saved = localStorage.getItem('chemizic_feature_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_FEATURE_LOGS;
  });

  const [dailyLogins, setDailyLogins] = useState<DailyLoginRecord[]>(() => {
    const saved = localStorage.getItem('chemizic_daily_logins');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_DAILY_LOGINS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('chemizic_assignments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'asg_01',
        title: 'Nernst Equation Concentration Cell Calculations',
        concept_id: 'electrochemistry',
        concept_name: 'Electrochemistry',
        difficulty: 'medium',
        assigned_by: 'Prof. Arfwedson (Faculty)',
        target_type: 'all',
        target_student_ids: [],
        target_class: 'Class 12 - Section B',
        question_count: 5,
        due_date: '2026-10-05',
        instructions: 'Calculate EMF and logarithmic quotient terms carefully before our upcoming lab quiz.',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        completed_by: ['leader_1']
      },
      {
        id: 'asg_02',
        title: 'Hess’s Law & Gibbs Free Energy Diagnostic',
        concept_id: 'thermodynamics',
        concept_name: 'Thermodynamics',
        difficulty: 'hard',
        assigned_by: 'Prof. Arfwedson (Faculty)',
        target_type: 'specific_students',
        target_student_ids: ['std_current', 'std_riya', 'std_vikram'],
        target_class: 'Class 12 - Section B',
        question_count: 5,
        due_date: '2026-10-02',
        instructions: 'Required intervention drill for students with mastery < 60% on Spontaneity and Enthalpy cycles.',
        created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
        completed_by: []
      },
      {
        id: 'asg_03',
        title: 'VSEPR Molecular Geometry & Hybridization Schemes',
        concept_id: 'molecular_structure',
        concept_name: 'Molecular Structure',
        difficulty: 'easy',
        assigned_by: 'Dr. Evelyn Reed',
        target_type: 'all',
        target_student_ids: [],
        target_class: 'Class 12 - Section B',
        question_count: 6,
        due_date: '2026-10-08',
        instructions: 'Foundational review on lone pair-bond pair distortions and sp3/sp3d shapes.',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        completed_by: ['std_current', 'leader_2']
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('chemizic_feature_logs', JSON.stringify(featureLogs));
  }, [featureLogs]);

  useEffect(() => {
    localStorage.setItem('chemizic_daily_logins', JSON.stringify(dailyLogins));
  }, [dailyLogins]);

  useEffect(() => {
    localStorage.setItem('chemizic_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Fetch assignments from server on mount
  useEffect(() => {
    fetch('/api/assignments')
      .then(res => res.json())
      .then(data => {
        if (data && data.assignments && data.assignments.length > 0) {
          setAssignments(data.assignments);
        }
      })
      .catch(err => console.warn("Could not fetch remote assignments ledger:", err));
  }, []);

  // Initialize or load current active studentProfile
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('chemizic_student_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    const defaultMasteries = createDefaultConceptMasteries('std_current', 'average');
    const defaultRecs = generateRecommendations('std_current', defaultMasteries, []);
    return {
      student_id: 'std_current',
      name: 'Scholar Student',
      class: 'Class 12 - Section B',
      overall_mastery: calculateOverallMastery(defaultMasteries),
      streak: 5,
      total_questions: 48,
      total_correct: 36,
      last_active: new Date().toISOString(),
      masteries: defaultMasteries,
      recommendations: defaultRecs,
      attemptsHistory: []
    };
  });

  // When currentUser changes, sync student profile identity
  useEffect(() => {
    if (currentUser) {
      setStudentProfile(prev => {
        const updated = {
          ...prev,
          student_id: currentUser.id,
          name: currentUser.username,
        };
        localStorage.setItem('chemizic_student_profile', JSON.stringify(updated));
        return updated;
      });
    }
  }, [currentUser]);

  // Keep allStudents synced to localStorage
  useEffect(() => {
    localStorage.setItem('chemizic_all_students', JSON.stringify(allStudents));
  }, [allStudents]);

  // Sync studentProfile to localStorage and server
  useEffect(() => {
    localStorage.setItem('chemizic_student_profile', JSON.stringify(studentProfile));

    // Update active student in allStudents list
    setAllStudents(prev => {
      const idx = prev.findIndex(s => s.student_id === studentProfile.student_id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = studentProfile;
        return next;
      } else {
        return [studentProfile, ...prev];
      }
    });

    // Remote sync
    if (studentProfile.student_id !== 'std_guest') {
      fetch('/api/adaptive/sync-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: studentProfile })
      }).catch(err => console.warn('Could not sync student profile with server ledger:', err));
    }
  }, [studentProfile]);

  // Fetch true global leaderboard on mount and keep syncing periodically (every 10s)
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        if (data && data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote leaderboard, utilizing cached values:", err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('chemizic_user', JSON.stringify(currentUser));
      
      // Auto submit/sync state to server-based leaderboard ledger
      if (currentUser.role !== 'guest') {
        const submitScore = async () => {
          try {
            const res = await fetch('/api/leaderboard/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: currentUser.id,
                username: currentUser.username,
                score: currentUser.score,
                xp: currentUser.xp,
                level: currentUser.level,
                quizAttempts: currentUser.quizAttempts,
                badges: currentUser.badges
              })
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.leaderboard) {
                setLeaderboard(data.leaderboard);
              }
            }
          } catch (err) {
            console.warn("Failed to submit leaderboard updates to server:", err);
          }
        };
        submitScore();
      } else {
        // Keep guest leaderboard updated locally
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
      }
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

  const login = async (email: string, username: string, password?: string, targetRole?: UserRole) => {
    const cleanEmail = email.trim();
    const inputUsername = username.trim();
    const cleanPassword = password?.trim() || '';

    // Secure custom Admin Login override
    if (
      cleanEmail.toLowerCase() === 'yours_pranz' || 
      inputUsername.toLowerCase() === 'yours_pranz' ||
      cleanEmail.toLowerCase() === 'yours_pranz@chemizic.com'
    ) {
      if (cleanPassword === 'pran123.') {
        const adminUser: User = {
          id: 'admin_pranz',
          username: 'yours_pranz',
          email: 'yours_pranz@chemizic.com',
          score: 9999,
          xp: 99999,
          level: 99,
          quizAttempts: 1337,
          badges: ['Master Admin', 'Syllabus Architect'],
          joinedAt: new Date().toISOString().split('T')[0],
          role: 'admin'
        };
        setCurrentUser(adminUser);
        return { success: true };
      } else {
        throw new Error('Incorrect password for Administrator yours_pranz.');
      }
    }

    const userEmail = cleanEmail.toLowerCase();
    
    // Strict email format checker to prevent injection attempts or profile overflows
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail) || userEmail.length > 100) {
      throw new Error('Invalid email standard format.');
    }

    const rawUsername = username.trim();
    if (rawUsername) {
      if (!/^[a-zA-Z0-9_.-]+$/.test(rawUsername) || rawUsername.length < 3 || rawUsername.length > 20) {
        throw new Error('Username must be 3-20 characters of alphanumeric symbols, dots, dashes, or underscores.');
      }
    }
    
    const cleanUsername = rawUsername || userEmail.split('@')[0].substring(0, 20).replace(/[^a-zA-Z0-9_.-]/g, '');
    const determinedRole: UserRole = targetRole || (
      userEmail.startsWith('admin') ? 'admin' :
      (userEmail.includes('teacher') || userEmail.includes('faculty') || userEmail.includes('prof')) ? 'teacher' :
      'student'
    );
    
    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail, username: cleanUsername, role: determinedRole })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server sync failed.');
      }

      const data = await response.json();
      if (data && data.user) {
        const matched = {
          ...data.user,
          role: determinedRole || data.user.role
        };
        setCurrentUser(matched);
        if (matched.role === 'student') {
          setStudentProfile(prev => ({
            ...prev,
            student_id: matched.id,
            name: matched.username,
            class: matched.student_class ? `${matched.student_class} - ${matched.section || 'Section A'}` : prev.class
          }));
        }
        return { success: true };
      }
    } catch (apiErr) {
      console.warn("Server auth sync failed, falling back to local simulation:", apiErr);
    }

    // Local Fallback Flow (robust resilience)
    const existingLeaderboard = leaderboard.find(l => l.username.toLowerCase() === cleanUsername.toLowerCase());
    
    const matchedUser: User = {
      id: existingLeaderboard?.userId || `user_${Date.now()}`,
      username: existingLeaderboard?.username || cleanUsername,
      email: userEmail,
      score: existingLeaderboard?.score || 0,
      xp: (existingLeaderboard?.score || 0) * 5, 
      level: existingLeaderboard?.level || 1,
      quizAttempts: existingLeaderboard?.quizAttempts || 0,
      badges: existingLeaderboard?.badges || [],
      joinedAt: new Date().toISOString().split('T')[0],
      role: determinedRole
    };

    setCurrentUser(matchedUser);
    if (determinedRole === 'student') {
      setStudentProfile(prev => ({
        ...prev,
        student_id: matchedUser.id,
        name: matchedUser.username
      }));
    }
    return { success: true };
  };

  const signup = async (
    username: string, 
    email: string,
    options?: { roll_no?: string; student_class?: string; section?: string; role?: UserRole }
  ) => {
    const userEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    
    if (!cleanUsername || !userEmail) {
      return { success: false, error: 'All fields are required.' };
    }

    // Email format enforcement
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail) || userEmail.length > 100) {
      return { success: false, error: 'Please submit a valid email address.' };
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername) || cleanUsername.length < 3 || cleanUsername.length > 20) {
      return { success: false, error: 'Username must be 3-20 characters comprising only letters, numbers, dots, dashes, and underscores.' };
    }

    const selectedRole: UserRole = options?.role || (
      userEmail.startsWith('admin') ? 'admin' :
      (userEmail.includes('teacher') || userEmail.includes('faculty') || userEmail.includes('prof')) ? 'teacher' :
      'student'
    );

    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: userEmail, 
          username: cleanUsername,
          roll_no: options?.roll_no,
          student_class: options?.student_class,
          section: options?.section,
          role: selectedRole
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.error || 'Server sync failed.' };
      }

      const data = await response.json();
      if (data && data.user) {
        const fullUser: User = {
          ...data.user,
          roll_no: options?.roll_no || data.user.roll_no,
          student_class: options?.student_class || data.user.student_class,
          section: options?.section || data.user.section,
          role: selectedRole
        };
        setCurrentUser(fullUser);
        if (selectedRole === 'student') {
          setStudentProfile(prev => ({
            ...prev,
            student_id: fullUser.id,
            name: fullUser.username,
            class: `${fullUser.student_class || 'Class 12'} - ${fullUser.section || 'Section A'}`
          }));
        }
        return { success: true };
      }
    } catch (apiErr) {
      console.warn("Server signup sync failed, falling back to local simulation:", apiErr);
    }

    // Local Fallback signup
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
      role: selectedRole,
      roll_no: options?.roll_no,
      student_class: options?.student_class || 'Class 12',
      section: options?.section || 'Section B'
    };

    setCurrentUser(newUser);
    if (selectedRole === 'student') {
      setStudentProfile(prev => ({
        ...prev,
        student_id: newUser.id,
        name: newUser.username,
        class: `${newUser.student_class} - ${newUser.section}`
      }));
    }
    return { success: true };
  };

  const switchRole = useCallback((newRole: UserRole) => {
    setCurrentUser(prev => {
      if (!prev) {
        return {
          id: `user_${Date.now()}`,
          username: newRole === 'teacher' ? 'Prof. Arfwedson' : newRole === 'admin' ? 'Master Admin' : 'Scholar Student',
          email: `${newRole}@chemizic.com`,
          score: 500,
          xp: 2500,
          level: 5,
          quizAttempts: 12,
          badges: ['First Breakthrough'],
          joinedAt: new Date().toISOString().split('T')[0],
          role: newRole,
          student_class: 'Class 12',
          section: 'Section B'
        };
      }
      return {
        ...prev,
        role: newRole
      };
    });
  }, []);

  const createAssignment = useCallback(async (newAsg: Omit<Assignment, 'id' | 'created_at' | 'completed_by'>) => {
    const fullAsg: Assignment = {
      ...newAsg,
      id: `asg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      completed_by: []
    };
    setAssignments(prev => [fullAsg, ...prev]);

    try {
      await fetch('/api/assignments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignment: fullAsg })
      });
    } catch (e) {
      console.warn("Could not sync assignment to server:", e);
    }
  }, []);

  const completeAssignment = useCallback(async (assignmentId: string) => {
    const currentStudentId = currentUser?.id || studentProfile.student_id;
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId && !a.completed_by.includes(currentStudentId)) {
        return {
          ...a,
          completed_by: [...a.completed_by, currentStudentId]
        };
      }
      return a;
    }));

    try {
      await fetch('/api/assignments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, studentId: currentStudentId })
      });
    } catch (e) {
      console.warn("Could not sync assignment completion to server:", e);
    }
  }, [currentUser, studentProfile.student_id]);

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

  const recordAdaptiveAttempt = useCallback((
    questionId: string,
    conceptId: string,
    selectedAnswer: string,
    isCorrect: boolean,
    difficulty: ConceptDifficulty
  ) => {
    setStudentProfile(prev => {
      const targetConcept = CHEMISTRY_CONCEPTS.find(c => c.id === conceptId);
      const prevConceptMastery: ConceptMastery = prev.masteries[conceptId] || {
        student_id: prev.student_id,
        concept_id: conceptId,
        concept_name: targetConcept?.name || conceptId,
        mastery_score: 50,
        accuracy: 50,
        attempts: 0,
        correct_attempts: 0,
        current_difficulty: 'medium',
        last_attempt: new Date().toISOString(),
        trend: 'stable'
      };

      const pastAttemptsForConcept = prev.attemptsHistory.filter(a => a.concept_id === conceptId);
      const updatedConceptMastery = calculateNewConceptMastery(
        prevConceptMastery,
        isCorrect,
        difficulty,
        pastAttemptsForConcept
      );

      const nextMasteries = {
        ...prev.masteries,
        [conceptId]: updatedConceptMastery
      };

      const nextOverall = calculateOverallMastery(nextMasteries);

      const newAttempt: StudentAttempt = {
        attempt_id: `att_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        student_id: prev.student_id,
        question_id: questionId,
        concept_id: conceptId,
        selected_answer: selectedAnswer,
        correct: isCorrect,
        difficulty,
        timestamp: new Date().toISOString()
      };

      const nextAttemptsHistory = [...prev.attemptsHistory, newAttempt];
      const nextRecs = generateRecommendations(prev.student_id, nextMasteries, nextAttemptsHistory);

      return {
        ...prev,
        overall_mastery: nextOverall,
        total_questions: prev.total_questions + 1,
        total_correct: prev.total_correct + (isCorrect ? 1 : 0),
        last_active: new Date().toISOString(),
        masteries: nextMasteries,
        recommendations: nextRecs,
        attemptsHistory: nextAttemptsHistory
      };
    });
  }, []);

  const refreshRecommendations = useCallback(() => {
    setStudentProfile(prev => ({
      ...prev,
      recommendations: generateRecommendations(prev.student_id, prev.masteries, prev.attemptsHistory)
    }));
  }, []);

  const recordFeatureUsage = useCallback((
    feature_id: FeatureActivityLog['feature_id'],
    feature_name: string,
    action: string,
    category: FeatureActivityLog['category'] = 'Exploration',
    xpEarned: number = 15
  ) => {
    const newLog: FeatureActivityLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      student_id: currentUser?.id || studentProfile.student_id,
      feature_id,
      feature_name,
      action,
      category,
      timestamp: new Date().toISOString(),
      xpEarned
    };

    setFeatureLogs(prev => [newLog, ...prev]);

    // Update today's login record featuresUsed
    const todayStr = new Date().toISOString().split('T')[0];
    setDailyLogins(prev => {
      const idx = prev.findIndex(r => r.date === todayStr);
      if (idx >= 0) {
        const updated = [...prev];
        const currentUsed = updated[idx].featuresUsed || [];
        if (!currentUsed.includes(feature_id)) {
          updated[idx] = {
            ...updated[idx],
            featuresUsed: [...currentUsed, feature_id],
            sessionMinutes: (updated[idx].sessionMinutes || 20) + 5
          };
        }
        return updated;
      } else {
        const newRecord: DailyLoginRecord = {
          date: todayStr,
          loginTime: new Date().toISOString(),
          streakCount: studentProfile.streak || 5,
          bonusClaimed: false,
          questionsSolved: 0,
          featuresUsed: [feature_id],
          sessionMinutes: 15
        };
        return [newRecord, ...prev];
      }
    });

    if (currentUser && currentUser.role !== 'guest' && xpEarned > 0) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const newXp = prev.xp + xpEarned;
        const newLevel = Math.max(prev.level, Math.floor(newXp / 60) + 1);
        return {
          ...prev,
          xp: newXp,
          level: newLevel
        };
      });
    }
  }, [currentUser, studentProfile.student_id, studentProfile.streak]);

  const claimDailyLoginBonus = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const existing = dailyLogins.find(r => r.date === todayStr);
    
    if (existing && existing.bonusClaimed) {
      return { success: false, bonusXp: 0, message: "You have already claimed today's daily streak bonus!" };
    }

    const bonusAmount = 50 + ((studentProfile.streak || 5) * 10);
    setStudentProfile(prev => ({
      ...prev,
      streak: prev.streak + (existing ? 0 : 1)
    }));

    setDailyLogins(prev => {
      const idx = prev.findIndex(r => r.date === todayStr);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], bonusClaimed: true };
        return copy;
      } else {
        return [{
          date: todayStr,
          loginTime: new Date().toISOString(),
          streakCount: (studentProfile.streak || 5) + 1,
          bonusClaimed: true,
          questionsSolved: 0,
          featuresUsed: ['analytics'],
          sessionMinutes: 10
        }, ...prev];
      }
    });

    if (currentUser) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const newXp = prev.xp + bonusAmount;
        const newScore = prev.score + bonusAmount;
        const newLevel = Math.max(prev.level, Math.floor(newXp / 60) + 1);
        return {
          ...prev,
          xp: newXp,
          score: newScore,
          level: newLevel
        };
      });
    }

    const log: FeatureActivityLog = {
      id: `log_bonus_${Date.now()}`,
      student_id: currentUser?.id || studentProfile.student_id,
      feature_id: 'analytics',
      feature_name: 'Daily Streak & Check-in',
      action: `Claimed daily attendance bonus of +${bonusAmount} XP!`,
      category: 'Assessment',
      timestamp: new Date().toISOString(),
      xpEarned: bonusAmount
    };
    setFeatureLogs(prev => [log, ...prev]);

    return { 
      success: true, 
      bonusXp: bonusAmount, 
      message: `Daily attendance logged! Claimed +${bonusAmount} XP streak bonus!` 
    };
  }, [dailyLogins, studentProfile.streak, currentUser, studentProfile.student_id]);

  return (
    <AuthAndQuizContext.Provider value={{
      currentUser,
      questions,
      adaptiveQuestions,
      leaderboard,
      studentProfile,
      allStudents,
      selectedClass,
      setSelectedClass,
      featureLogs,
      dailyLogins,
      assignments,
      createAssignment,
      completeAssignment,
      switchRole,
      recordFeatureUsage,
      claimDailyLoginBonus,
      login,
      signup,
      logout,
      addCustomQuestion,
      recordQuizResult,
      recordAdaptiveAttempt,
      guestLogin,
      refreshRecommendations
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
