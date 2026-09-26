/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Spaced Repetition Scheduling Engine (SM-2 Algorithm adapted for Conceptual Mastery)
 */

import { SpacedRepetitionItem } from '../types';
import { CHEMISTRY_CONCEPTS } from '../data/chemistryConcepts';

/**
 * Initializes a default spaced-repetition schedule for all registered chemistry concepts.
 */
export function initializeSpacedRepetitionSchedule(): Record<string, SpacedRepetitionItem> {
  const schedule: Record<string, SpacedRepetitionItem> = {};
  const today = new Date();

  CHEMISTRY_CONCEPTS.forEach((concept, index) => {
    // Stagger initial review dates slightly across 1-3 days so student isn't overwhelmed on day 1
    const reviewDate = new Date(today);
    const dayOffset = index % 3 === 0 ? 0 : (index % 3);
    reviewDate.setDate(today.getDate() + dayOffset);
    const reviewDateStr = reviewDate.toISOString().split('T')[0];

    schedule[concept.id] = {
      concept_id: concept.id,
      concept_name: concept.name,
      repetition_number: 0,
      interval_days: 1,
      ease_factor: 2.5,
      last_reviewed: new Date(today.getTime() - 86400000 * 2).toISOString(),
      next_review_date: reviewDateStr,
      is_due: dayOffset === 0,
      retention_score: 65
    };
  });

  return schedule;
}

/**
 * Computes updated spaced repetition parameters using SM-2 algorithm following a question attempt.
 * Quality rating:
 * - isCorrect + high mastery -> Quality 5 (Perfect recall)
 * - isCorrect + moderate -> Quality 4 (Good recall)
 * - isCorrect + low mastery -> Quality 3 (Hard recall)
 * - incorrect + high mastery -> Quality 2 (Lapse on known concept)
 * - incorrect + low mastery -> Quality 1 (Forgot or unfamiliar)
 */
export function updateConceptSpacedRepetition(
  current: SpacedRepetitionItem,
  isCorrect: boolean,
  currentMasteryScore: number
): SpacedRepetitionItem {
  let quality: number;

  if (isCorrect) {
    if (currentMasteryScore >= 80) quality = 5;
    else if (currentMasteryScore >= 60) quality = 4;
    else quality = 3;
  } else {
    if (currentMasteryScore >= 65) quality = 2;
    else quality = 1;
  }

  // SM-2 Ease Factor calculation: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEaseFactor = current.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;
  if (newEaseFactor > 3.0) newEaseFactor = 3.0;

  let newRepNumber = current.repetition_number;
  let newIntervalDays: number;

  if (quality >= 3) {
    // Successful recall
    if (newRepNumber === 0) {
      newIntervalDays = 1;
    } else if (newRepNumber === 1) {
      newIntervalDays = 3;
    } else if (newRepNumber === 2) {
      newIntervalDays = 6;
    } else {
      newIntervalDays = Math.round(current.interval_days * newEaseFactor);
    }
    newRepNumber += 1;
  } else {
    // Failed recall: reset repetition count to 0 or 1, schedule review for tomorrow
    newRepNumber = 0;
    newIntervalDays = 1;
  }

  // Cap max interval at 60 days
  newIntervalDays = Math.min(60, Math.max(1, newIntervalDays));

  // Compute next review date
  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + newIntervalDays);
  const nextDateStr = nextDate.toISOString().split('T')[0];

  // Retention score estimate
  const retentionScore = Math.min(99, Math.max(20, Math.round(
    currentMasteryScore * 0.7 + (newEaseFactor / 2.5) * 20 + (newRepNumber * 3)
  )));

  return {
    ...current,
    repetition_number: newRepNumber,
    interval_days: newIntervalDays,
    ease_factor: Number(newEaseFactor.toFixed(2)),
    last_reviewed: now.toISOString(),
    next_review_date: nextDateStr,
    is_due: false,
    retention_score: retentionScore
  };
}

/**
 * Returns a list of concepts that are due for review today or overdue.
 */
export function getDueConcepts(schedule: Record<string, SpacedRepetitionItem>): SpacedRepetitionItem[] {
  const todayStr = new Date().toISOString().split('T')[0];
  return Object.values(schedule).filter(item => {
    return item.next_review_date <= todayStr;
  });
}
