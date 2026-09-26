/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Smart Question Engine
 * Provides option randomization, anti-repetition filtering, concept-balanced selection,
 * and 5-tier adaptive cognitive mapping.
 */

import { AdaptiveQuestion, CHEMISTRY_CONCEPTS } from '../data/chemistryConcepts';
import { ConceptMastery, ConceptDifficulty, GranularDifficultyLevel, SpacedRepetitionItem } from '../types';

export interface ShuffledQuestion extends AdaptiveQuestion {
  originalOptions: string[];
  correctOptionIndex: number; // 0, 1, 2, 3 corresponding to A, B, C, D
}

/**
 * Fisher-Yates array shuffling helper
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles question answer options while preserving correct answer logic.
 * Guarantees that the correct answer is randomized across positions A, B, C, D.
 */
export function shuffleQuestionOptions(question: AdaptiveQuestion): ShuffledQuestion {
  const originalOptions = [...question.options];
  const shuffledOptions = shuffleArray(originalOptions);
  const correctOptionIndex = shuffledOptions.indexOf(question.correctAnswer);

  return {
    ...question,
    options: shuffledOptions,
    originalOptions,
    correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0
  };
}

/**
 * Maps 3-tier difficulty to 5-tier granular difficulty scale:
 * 1 = Beginner
 * 2 = Easy
 * 3 = Medium
 * 4 = Hard
 * 5 = Expert
 */
export function mapDifficultyToGranular(
  difficulty: ConceptDifficulty, 
  numericalDifficulty?: number
): GranularDifficultyLevel {
  if (numericalDifficulty) {
    if (numericalDifficulty <= 2) return 1;
    if (numericalDifficulty <= 4) return 2;
    if (numericalDifficulty <= 6) return 3;
    if (numericalDifficulty <= 8) return 4;
    return 5;
  }

  if (difficulty === 'easy') return 2;
  if (difficulty === 'hard') return 4;
  return 3;
}

/**
 * Maps 5-tier granular level back to 3-tier ConceptDifficulty for compatibility
 */
export function mapGranularToConceptDifficulty(level: GranularDifficultyLevel): ConceptDifficulty {
  if (level <= 2) return 'easy';
  if (level >= 4) return 'hard';
  return 'medium';
}

export const GRANULAR_DIFFICULTY_META: Record<GranularDifficultyLevel, { name: string; label: string; color: string; badge: string }> = {
  1: { name: 'Beginner', label: 'Tier 1 • Beginner Foundational', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40', badge: '🌱 Level 1: Beginner' },
  2: { name: 'Easy', label: 'Tier 2 • Standard Concept Drill', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40', badge: '🧪 Level 2: Easy' },
  3: { name: 'Medium', label: 'Tier 3 • School / Board Standard', color: 'text-amber-400 bg-amber-950/40 border-amber-500/40', badge: '⚡ Level 3: Medium' },
  4: { name: 'Hard', label: 'Tier 4 • Competitive Exam Problem', color: 'text-orange-400 bg-orange-950/40 border-orange-500/40', badge: '🔥 Level 4: Hard' },
  5: { name: 'Expert', label: 'Tier 5 • Advanced Olympiad Mastery', color: 'text-purple-400 bg-purple-950/40 border-purple-500/40', badge: '👑 Level 5: Expert' }
};

export interface SmartSelectionOptions {
  availableQuestions: AdaptiveQuestion[];
  masteries: Record<string, ConceptMastery>;
  recentQuestionIds?: string[];
  targetConceptId?: string; // 'all' or specific concept
  targetDifficulty?: ConceptDifficulty;
  targetGranularLevel?: GranularDifficultyLevel;
  quizLength?: number;
  spacedRepetitionSchedule?: Record<string, SpacedRepetitionItem>;
  isDiagnostic?: boolean;
}

/**
 * Smart Question Selection Engine:
 * - Anti-repetition: Excludes recent questions
 * - Adaptive weighting: Prioritizes weak concepts and concepts due for review
 * - Concept coverage: Ensures questions come from balanced concepts
 * - Shuffles answer options for each chosen question
 */
export function selectSmartQuestions(options: SmartSelectionOptions): ShuffledQuestion[] {
  const {
    availableQuestions,
    masteries,
    recentQuestionIds = [],
    targetConceptId = 'all',
    targetDifficulty,
    targetGranularLevel,
    quizLength = 5,
    spacedRepetitionSchedule,
    isDiagnostic = false
  } = options;

  if (availableQuestions.length === 0) return [];

  // 1. Diagnostic Mode: Pick 1 question from each major concept for complete benchmark coverage
  if (isDiagnostic) {
    const diagnosticSelected: AdaptiveQuestion[] = [];
    const usedConcepts = new Set<string>();

    // Shuffle questions pool first
    const pool = shuffleArray(availableQuestions);

    for (const q of pool) {
      if (!usedConcepts.has(q.conceptId)) {
        diagnosticSelected.push(q);
        usedConcepts.add(q.conceptId);
      }
      if (diagnosticSelected.length >= quizLength) break;
    }

    // Fill remaining if needed
    if (diagnosticSelected.length < quizLength) {
      const remaining = pool.filter(q => !diagnosticSelected.includes(q));
      diagnosticSelected.push(...remaining.slice(0, quizLength - diagnosticSelected.length));
    }

    return diagnosticSelected.map(q => shuffleQuestionOptions(q));
  }

  // 2. Filter by concept if a specific one was targeted
  let candidatePool = [...availableQuestions];
  if (targetConceptId && targetConceptId !== 'all') {
    candidatePool = candidatePool.filter(q => q.conceptId === targetConceptId);
    if (candidatePool.length === 0) {
      candidatePool = [...availableQuestions];
    }
  }

  // 3. Anti-repetition: Filter out recently answered questions if pool allows
  const recentSet = new Set(recentQuestionIds);
  const nonRecent = candidatePool.filter(q => !recentSet.has(q.id));
  const poolToUse = nonRecent.length >= quizLength ? nonRecent : candidatePool;

  // 4. Score and rank questions based on adaptive suitability
  const scored = poolToUse.map(q => {
    let score = Math.random() * 20; // Base randomness

    const mastery = masteries[q.conceptId]?.mastery_score ?? 50;

    // A. Weak concept priority: students gain more from practicing concepts < 60%
    if (mastery < 50) score += 40;
    else if (mastery < 65) score += 25;
    else if (mastery >= 85) score -= 15; // De-prioritize already mastered unless spaced review

    // B. Spaced Repetition Due Bonus
    if (spacedRepetitionSchedule && spacedRepetitionSchedule[q.conceptId]?.is_due) {
      score += 35;
    }

    // C. Difficulty match
    const qGranular = mapDifficultyToGranular(q.difficulty, q.numericalDifficulty);
    if (targetGranularLevel) {
      const diffDistance = Math.abs(qGranular - targetGranularLevel);
      score += Math.max(0, 30 - diffDistance * 15);
    } else if (targetDifficulty) {
      if (q.difficulty === targetDifficulty) score += 25;
    }

    return { question: q, score };
  });

  // Sort descending by adaptive score
  scored.sort((a, b) => b.score - a.score);

  // 5. Concept diversity pass: Avoid picking all questions from the same concept if multiple exist
  const selected: AdaptiveQuestion[] = [];
  const conceptCounts: Record<string, number> = {};
  const maxPerConcept = targetConceptId !== 'all' ? quizLength : Math.max(1, Math.ceil(quizLength / 3));

  for (const item of scored) {
    const cid = item.question.conceptId;
    const currentCount = conceptCounts[cid] || 0;

    if (currentCount < maxPerConcept) {
      selected.push(item.question);
      conceptCounts[cid] = currentCount + 1;
    }

    if (selected.length >= quizLength) break;
  }

  // Fill up if diversity limit prevented reaching quizLength
  if (selected.length < quizLength) {
    for (const item of scored) {
      if (!selected.includes(item.question)) {
        selected.push(item.question);
      }
      if (selected.length >= quizLength) break;
    }
  }

  // Final shuffle of question order so order isn't purely monotonic
  const finalOrder = shuffleArray(selected);

  // Return with shuffled options preserving correct answers
  return finalOrder.map(q => shuffleQuestionOptions(q));
}
