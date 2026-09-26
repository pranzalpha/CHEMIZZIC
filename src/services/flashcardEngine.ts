/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChemiZIC AI Flashcard Generator Engine
 * Generates structured flashcards for chemistry topics across all education levels.
 * Includes offline curated sets and AI generation schema.
 */

import { EducationLevelId } from '../types/curriculum';

export type FlashcardType = 
  | 'definition'
  | 'formula'
  | 'reaction'
  | 'mcq'
  | 'one_mark'
  | 'two_mark'
  | 'three_mark'
  | 'common_mistake'
  | 'exam_tip'
  | 'key_fact';

export type FlashcardStatus = 'unseen' | 'learning' | 'known' | 'needs_review';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: FlashcardType;
  topic: string;
  subtopic?: string;
  educationLevel: EducationLevelId[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // Spaced repetition fields
  status: FlashcardStatus;
  lastReviewed?: string;
  nextReview?: string;
  correctCount: number;
  incorrectCount: number;
  
  verificationStatus: 'VERIFIED' | 'AI-GENERATED';
  tags: string[];
}

export interface FlashcardDeck {
  id: string;
  topic: string;
  subtopic?: string;
  educationLevel: EducationLevelId[];
  cards: Flashcard[];
  createdAt: string;
  source: 'CURATED' | 'AI-GENERATED' | 'HYBRID';
}

// ============================================================
// CURATED FLASHCARD SETS
// ============================================================

export const CURATED_FLASHCARD_SETS: FlashcardDeck[] = [

  // ──────────────────────────────────────────────────────────
  // ELECTROCHEMISTRY
  // ──────────────────────────────────────────────────────────
  {
    id: 'deck_electrochemistry',
    topic: 'Electrochemistry',
    educationLevel: ['CLASS_12', 'BSC'],
    createdAt: '2024-01-01',
    source: 'CURATED',
    cards: [
      {
        id: 'ec_01', type: 'definition', topic: 'Electrochemistry', difficulty: 1,
        front: 'What is electromotive force (EMF) of a cell?',
        back: 'EMF (Ecell) is the potential difference between the two electrodes of a cell under zero-current (open-circuit) conditions. It is the maximum work done per unit charge. Unit: Volts (V).',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12'],
        verificationStatus: 'VERIFIED', tags: ['emf', 'cell potential', 'electrochemistry']
      },
      {
        id: 'ec_02', type: 'formula', topic: 'Electrochemistry', difficulty: 2,
        front: 'State the Nernst Equation and define all terms.',
        back: 'Ecell = E°cell − (RT/nF) × ln Q\n\nAt 25°C: Ecell = E°cell − (0.05916/n) × log₁₀ Q\n\nWhere:\n• E°cell = standard cell potential (V)\n• R = 8.314 J/mol·K (gas constant)\n• T = temperature (K)\n• n = moles of electrons transferred\n• F = 96485 C/mol (Faraday constant)\n• Q = reaction quotient = [products]/[reactants]',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12', 'BSC'],
        verificationStatus: 'VERIFIED', tags: ['nernst equation', 'cell potential', 'Q', 'formula']
      },
      {
        id: 'ec_03', type: 'key_fact', topic: 'Electrochemistry', difficulty: 1,
        front: 'What is the standard EMF of the Daniell cell (Zn-Cu)?',
        back: 'E°cell = E°cathode − E°anode\n= E°(Cu²⁺/Cu) − E°(Zn²⁺/Zn)\n= +0.34 V − (−0.76 V)\n= +1.10 V\n\nAnode (oxidation): Zn(s) → Zn²⁺(aq) + 2e⁻\nCathode (reduction): Cu²⁺(aq) + 2e⁻ → Cu(s)',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12'],
        verificationStatus: 'VERIFIED', tags: ['Daniell cell', 'standard electrode potential', '1.10V']
      },
      {
        id: 'ec_04', type: 'formula', topic: 'Electrochemistry', difficulty: 2,
        front: 'State Faraday\'s First and Second Laws of Electrolysis.',
        back: 'First Law: Mass deposited (m) ∝ quantity of charge (Q = It)\n\nSecond Law: m = (I × t × M) / (n × F)\n\nWhere: I = current (A), t = time (s), M = molar mass (g/mol), n = electrons per ion, F = 96485 C/mol\n\nExample: Cu²⁺ + 2e⁻ → Cu: n = 2',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12', 'BSC'],
        verificationStatus: 'VERIFIED', tags: ['Faraday', 'electrolysis', 'formula']
      },
      {
        id: 'ec_05', type: 'reaction', topic: 'Electrochemistry', difficulty: 1,
        front: 'Write the half-reactions for electrolysis of dilute H₂SO₄ (water electrolysis).',
        back: 'Cathode (reduction): 2H⁺ + 2e⁻ → H₂(g)  [or  2H₂O + 2e⁻ → H₂ + 2OH⁻]\n\nAnode (oxidation): 2H₂O → O₂ + 4H⁺ + 4e⁻  [or  4OH⁻ → O₂ + 2H₂O + 4e⁻]\n\nOverall: 2H₂O → 2H₂ + O₂ (ΔG > 0 — non-spontaneous, requires electricity)',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12'],
        verificationStatus: 'VERIFIED', tags: ['water electrolysis', 'H2SO4', 'hydrogen', 'oxygen']
      },
      {
        id: 'ec_06', type: 'definition', topic: 'Electrochemistry', difficulty: 1,
        front: 'What is specific conductance (κ) and molar conductance (Λm)?',
        back: 'Specific conductance (κ): Conductance of a solution of unit cross-section and unit length. SI unit: S/m or S/cm.\n\nMolar conductance (Λm): Conductance of all the ions from 1 mole of electrolyte dissolved in a solution. Λm = (κ × 1000) / c  where c = molarity (mol/L). Unit: S·cm²/mol.',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12', 'BSC'],
        verificationStatus: 'VERIFIED', tags: ['conductance', 'molar conductance', 'specific conductance']
      },
      {
        id: 'ec_07', type: 'exam_tip', topic: 'Electrochemistry', difficulty: 2,
        front: 'Exam Tip: What determines if a cell is spontaneous?',
        back: '✅ Spontaneous: Ecell > 0  AND  ΔG < 0\n✅ ΔG = −nFEcell\n✅ If Ecell = 0 → system at equilibrium (Q = Keq)\n✅ If Ecell < 0 → non-spontaneous (reverse is spontaneous)\n\nFor Daniell cell: Ecell = +1.10 V → spontaneous → ΔG = −(2)(96485)(1.10) = −212.3 kJ/mol',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12'],
        verificationStatus: 'VERIFIED', tags: ['spontaneity', 'Gibbs energy', 'Ecell', 'exam tip']
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // CHEMICAL BONDING
  // ──────────────────────────────────────────────────────────
  {
    id: 'deck_chemical_bonding',
    topic: 'Chemical Bonding and Molecular Structure',
    educationLevel: ['CLASS_11'],
    createdAt: '2024-01-01',
    source: 'CURATED',
    cards: [
      {
        id: 'cb_01', type: 'definition', topic: 'Chemical Bonding', difficulty: 1,
        front: 'What is a covalent bond? Give an example.',
        back: 'A covalent bond is formed by the mutual sharing of one or more electron pairs between two atoms, usually of similar electronegativity.\n\nExample: H₂ (H–H), Cl₂ (Cl–Cl), H₂O (O–H bonds)\n\nShared pair: Bonding pair; Unshared pair: Lone pair.',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_11'],
        verificationStatus: 'VERIFIED', tags: ['covalent bond', 'definition', 'sharing']
      },
      {
        id: 'cb_02', type: 'key_fact', topic: 'Chemical Bonding', difficulty: 2,
        front: 'What are the bond angle, hybridisation and shape of NH₃?',
        back: 'NH₃ (Ammonia):\n• Hybridisation: sp³\n• Shape: Trigonal pyramidal\n• Bond angle: 107° (less than 109.5° due to one lone pair on N)\n• Lone pair: 1\n• Lone pair repulsion > bonding pair repulsion → compressed angle\n\nVSEPR: 4 electron pairs around N (3 bonding + 1 lone).',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_11'],
        verificationStatus: 'VERIFIED', tags: ['NH3', 'sp3', 'VSEPR', 'bond angle', 'trigonal pyramidal']
      },
      {
        id: 'cb_03', type: 'definition', topic: 'Chemical Bonding', difficulty: 1,
        front: 'Define electronegativity. What are the trends across a period and down a group?',
        back: 'Electronegativity (EN): The tendency of an atom in a molecule to attract the shared electron pair towards itself. (Pauling scale: F = 4.0 is highest)\n\nTrend across a period: Increases left → right (increasing Zeff, decreasing atomic radius)\nTrend down a group: Decreases top → bottom (increasing atomic size, more shielding)\n\nF > O > N > Cl > Br > C > H > metals',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_11'],
        verificationStatus: 'VERIFIED', tags: ['electronegativity', 'Pauling', 'periodic trend']
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // ORGANIC CHEMISTRY — BASIC
  // ──────────────────────────────────────────────────────────
  {
    id: 'deck_organic_basics',
    topic: 'Organic Chemistry',
    subtopic: 'Basics of Organic Chemistry',
    educationLevel: ['CLASS_11', 'CLASS_12'],
    createdAt: '2024-01-01',
    source: 'CURATED',
    cards: [
      {
        id: 'org_01', type: 'definition', topic: 'Organic Chemistry', difficulty: 1,
        front: 'What is inductive effect (I-effect)?',
        back: 'Inductive effect: The permanent displacement of electrons along a chain of atoms through σ bonds due to electronegativity differences.\n\n+I (electron-releasing): Alkyl groups (CH₃, C₂H₅, etc.) — push electrons toward nucleus\n−I (electron-withdrawing): NO₂, CN, Cl, F, COOH — pull electrons away\n\nInductive effect diminishes with distance (essentially negligible after 3 bonds).',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_11', 'CLASS_12'],
        verificationStatus: 'VERIFIED', tags: ['inductive effect', '+I', '-I', 'sigma bond']
      },
      {
        id: 'org_02', type: 'key_fact', topic: 'Organic Chemistry', difficulty: 2,
        front: 'Order of stability of carbocations.',
        back: 'Stability order (most to least stable):\n\nTertiary (3°) > Secondary (2°) > Primary (1°) > Methyl (CH₃⁺)\n\nReason: Hyperconjugation and inductive effect of alkyl groups stabilise positive charge. More alkyl groups = more hyperconjugation = more stable.\n\nApplications: SN1 and E1 reactions proceed via tertiary carbocations.',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12'],
        verificationStatus: 'VERIFIED', tags: ['carbocation', 'stability', 'hyperconjugation', 'SN1']
      },
      {
        id: 'org_03', type: 'formula', topic: 'Organic Chemistry', difficulty: 1,
        front: 'General formula for different homologous series.',
        back: 'Alkanes: CₙH₂ₙ₊₂\nAlkenes: CₙH₂ₙ\nAlkynes: CₙH₂ₙ₋₂\nArenes (benzene ring): CₙH₂ₙ₋₆ (for monosubstituted)\nAlcohols: CₙH₂ₙ₊₂O (primary, CₙH₂ₙ₊₁OH)\nAldehydes: CₙH₂ₙO (CₙH₂ₙ₋₁CHO)\nKetones: CₙH₂ₙO\nCarboxylic acids: CₙH₂ₙO₂ (CₙH₂ₙ₋₁COOH)',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_11'],
        verificationStatus: 'VERIFIED', tags: ['general formula', 'homologous series', 'alkane', 'alkene']
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // EQUILIBRIUM (Class 11)
  // ──────────────────────────────────────────────────────────
  {
    id: 'deck_equilibrium',
    topic: 'Equilibrium',
    educationLevel: ['CLASS_11', 'CLASS_12'],
    createdAt: '2024-01-01',
    source: 'CURATED',
    cards: [
      {
        id: 'eq_01', type: 'definition', topic: 'Equilibrium', difficulty: 1,
        front: 'State Le Chatelier\'s Principle.',
        back: 'Le Chatelier\'s Principle: When a system at equilibrium is subjected to a change in conditions (concentration, pressure, temperature), the system shifts in a direction to oppose the change and restore a new equilibrium.\n\nExamples:\n• ↑ concentration of reactant → shift forward (more products)\n• ↑ pressure → shift toward fewer moles of gas\n• ↑ temperature → shift toward endothermic direction',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_11'],
        verificationStatus: 'VERIFIED', tags: ['Le Chatelier', 'equilibrium', 'shift']
      },
      {
        id: 'eq_02', type: 'formula', topic: 'Equilibrium', difficulty: 2,
        front: 'What is Ka for a weak acid? How is pH calculated from Ka?',
        back: 'Ka = [H⁺][A⁻] / [HA]  (acid dissociation constant)\n\npKa = −log Ka\n\nFor weak acid (HA ⇌ H⁺ + A⁻):\n[H⁺] = √(Ka × C)    [approximate, if Ka << C]\n\npH = −log[H⁺] = −log(√(Ka × C)) = ½ × (pKa − log C)\n\nExample: CH₃COOH, Ka = 1.8 × 10⁻⁵, C = 0.1 M:\n[H⁺] = √(1.8e-5 × 0.1) = 1.34 × 10⁻³ M, pH = 2.87',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_11', 'CLASS_12'],
        verificationStatus: 'VERIFIED', tags: ['Ka', 'weak acid', 'pH', 'formula']
      },
      {
        id: 'eq_03', type: 'formula', topic: 'Equilibrium', difficulty: 2,
        front: 'Henderson-Hasselbalch equation for buffer pH.',
        back: 'pH = pKa + log([A⁻]/[HA])\n\nWhere:\n• [A⁻] = conjugate base concentration (e.g. CH₃COO⁻ from sodium acetate)\n• [HA] = weak acid concentration (e.g. CH₃COOH)\n• pKa = −log Ka of the weak acid\n\nExample: Acetate buffer with [CH₃COO⁻] = 0.1 M, [CH₃COOH] = 0.1 M, pKa = 4.74:\npH = 4.74 + log(0.1/0.1) = 4.74 + 0 = 4.74',
        status: 'unseen', correctCount: 0, incorrectCount: 0, educationLevel: ['CLASS_12', 'BSC'],
        verificationStatus: 'VERIFIED', tags: ['Henderson-Hasselbalch', 'buffer', 'pH']
      }
    ]
  }
];

// ============================================================
// SPACED REPETITION SCHEDULING HELPERS
// ============================================================

export function scheduleNextReview(card: Flashcard, wasCorrect: boolean): Date {
  const now = new Date();
  let daysFromNow = 1;
  
  if (wasCorrect) {
    const correct = card.correctCount + 1;
    // Simple interval: 1, 3, 7, 14, 30 days based on correct streak
    const intervals = [1, 3, 7, 14, 30];
    daysFromNow = intervals[Math.min(correct - 1, intervals.length - 1)];
    return new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
  } else {
    // Wrong → review again in 1 day
    return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
  }
}

export function getNewStatus(card: Flashcard, wasCorrect: boolean): FlashcardStatus {
  if (wasCorrect) {
    if (card.correctCount >= 4) return 'known';
    return 'learning';
  } else {
    return 'needs_review';
  }
}

// ============================================================
// LOOKUP FUNCTIONS
// ============================================================

export function getDeckByTopic(topicQuery: string): FlashcardDeck | null {
  if (!topicQuery) return null;
  const q = topicQuery.toLowerCase();
  return CURATED_FLASHCARD_SETS.find(d =>
    d.topic.toLowerCase().includes(q) ||
    (d.subtopic?.toLowerCase().includes(q))
  ) || null;
}

export function getAllDeckTopics(): string[] {
  return CURATED_FLASHCARD_SETS.map(d => d.topic);
}

export function getCardsByLevel(level: EducationLevelId): Flashcard[] {
  const cards: Flashcard[] = [];
  for (const deck of CURATED_FLASHCARD_SETS) {
    if (deck.educationLevel.includes(level)) {
      cards.push(...deck.cards.filter(c => c.educationLevel.includes(level)));
    }
  }
  return cards;
}
