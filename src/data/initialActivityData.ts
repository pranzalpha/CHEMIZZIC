/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyLoginRecord, FeatureActivityLog } from '../types';

export const INITIAL_DAILY_LOGINS: DailyLoginRecord[] = [
  {
    date: new Date(Date.now() - 0 * 86400000).toISOString().split('T')[0],
    loginTime: new Date(Date.now() - 0 * 86400000).toISOString(),
    streakCount: 5,
    bonusClaimed: true,
    questionsSolved: 8,
    featuresUsed: ['explorer', 'reaction', 'quiz', 'adaptive_practice'],
    sessionMinutes: 42
  },
  {
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    loginTime: new Date(Date.now() - 1 * 86400000).toISOString(),
    streakCount: 4,
    bonusClaimed: true,
    questionsSolved: 12,
    featuresUsed: ['phmeter', 'periodic', 'quiz'],
    sessionMinutes: 35
  },
  {
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    loginTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    streakCount: 3,
    bonusClaimed: true,
    questionsSolved: 15,
    featuresUsed: ['adaptive_practice', 'chemist', 'explorer'],
    sessionMinutes: 50
  },
  {
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    loginTime: new Date(Date.now() - 3 * 86400000).toISOString(),
    streakCount: 2,
    bonusClaimed: true,
    questionsSolved: 7,
    featuresUsed: ['quiz', 'reaction'],
    sessionMinutes: 28
  },
  {
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    loginTime: new Date(Date.now() - 4 * 86400000).toISOString(),
    streakCount: 1,
    bonusClaimed: true,
    questionsSolved: 10,
    featuresUsed: ['periodic', 'explorer', 'adaptive_practice'],
    sessionMinutes: 45
  },
  {
    date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
    loginTime: new Date(Date.now() - 6 * 86400000).toISOString(),
    streakCount: 1,
    bonusClaimed: true,
    questionsSolved: 6,
    featuresUsed: ['chemist', 'quiz'],
    sessionMinutes: 25
  },
  {
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    loginTime: new Date(Date.now() - 7 * 86400000).toISOString(),
    streakCount: 6,
    bonusClaimed: true,
    questionsSolved: 14,
    featuresUsed: ['phmeter', 'reaction', 'periodic'],
    sessionMinutes: 55
  }
];

export const INITIAL_FEATURE_LOGS: FeatureActivityLog[] = [
  {
    id: 'log_01',
    student_id: 'std_current',
    feature_id: 'adaptive_practice',
    feature_name: 'Adaptive Learning Engine',
    action: 'Completed 6 adaptive questions on Chemical Bonding (Mastery reached 78%)',
    category: 'Assessment',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    xpEarned: 45
  },
  {
    id: 'log_02',
    student_id: 'std_current',
    feature_id: 'reaction',
    feature_name: 'AI Reaction Predictor',
    action: 'Simulated combustion of Propane (C3H8 + 5O2 → 3CO2 + 4H2O) with enthalpy calculation',
    category: 'Calculations',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    xpEarned: 25
  },
  {
    id: 'log_03',
    student_id: 'std_current',
    feature_id: 'phmeter',
    feature_name: 'pH Meter & Indicator Lab',
    action: 'Conducted drop titration test using Methyl Orange on Lemon Juice (pH measured at 2.4)',
    category: 'Laboratory',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    xpEarned: 30
  },
  {
    id: 'log_04',
    student_id: 'std_current',
    feature_id: 'explorer',
    feature_name: 'Molecule Structure Explorer',
    action: 'Analyzed 3D Ball & Stick model and GHS hazard sheet of Caffeine (C8H10N4O2)',
    category: 'Exploration',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    xpEarned: 20
  },
  {
    id: 'log_05',
    student_id: 'std_current',
    feature_id: 'chemist',
    feature_name: 'AI Chemist Tutor',
    action: 'Queried tutor regarding Nernst Equation concentration cell derivations',
    category: 'AI Consultation',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    xpEarned: 15
  },
  {
    id: 'log_06',
    student_id: 'std_current',
    feature_id: 'periodic',
    feature_name: 'Interactive Periodic Table',
    action: 'Inspected Lanthanide contraction electron shells for Europium (Eu, Z = 63)',
    category: 'Exploration',
    timestamp: new Date(Date.now() - 1 * 86400000 - 4 * 3600000).toISOString(),
    xpEarned: 20
  },
  {
    id: 'log_07',
    student_id: 'std_current',
    feature_id: 'quiz',
    feature_name: 'Quiz Arena',
    action: 'Achieved 5/5 score on Inorganic Acids & Bases Timed Challenge',
    category: 'Assessment',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    xpEarned: 60
  }
];
