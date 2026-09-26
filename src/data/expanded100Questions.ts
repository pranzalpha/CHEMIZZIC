/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 100 Comprehensive Chemistry Questions
 * Distributed across 10 Chemistry Pillars (10 questions each):
 * 1. Atomic Structure (10 questions)
 * 2. Quantum Numbers (10 questions)
 * 3. Periodic Properties (10 questions)
 * 4. Chemical Bonding (10 questions)
 * 5. Molecular Structure (10 questions)
 * 6. Thermodynamics (10 questions)
 * 7. Chemical Equilibrium (10 questions)
 * 8. Acids & Bases (10 questions)
 * 9. Electrochemistry (10 questions)
 * 10. Organic Chemistry (10 questions)
 * 
 * Accurately calibrated into Easy, Medium, and Hard difficulties with full explanations.
 */

import { AdaptiveQuestion } from './chemistryConcepts';
import { QUESTIONS_BATCH_1 } from './questionsBatch1';
import { QUESTIONS_BATCH_2 } from './questionsBatch2';

export const EXPANDED_100_CHEMISTRY_QUESTIONS: AdaptiveQuestion[] = [
  ...QUESTIONS_BATCH_1,
  ...QUESTIONS_BATCH_2
];

export const TOTAL_QUESTIONS_COUNT = EXPANDED_100_CHEMISTRY_QUESTIONS.length;
