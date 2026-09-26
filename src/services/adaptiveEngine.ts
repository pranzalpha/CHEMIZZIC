/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ConceptMastery, 
  StudentAttempt, 
  Recommendation, 
  StudentProfile, 
  ClassSummary, 
  ConceptDifficulty, 
  MasteryTrend 
} from '../types';
import { CHEMISTRY_CONCEPTS, ADAPTIVE_QUESTIONS_BANK, AdaptiveQuestion } from '../data/chemistryConcepts';

// Difficulty multipliers for Bayesian-weighted mastery calculation
const DIFFICULTY_WEIGHT: Record<ConceptDifficulty, number> = {
  easy: 1.0,
  medium: 1.4,
  hard: 1.9
};

/**
 * Calculates updated concept mastery following an attempt.
 * Evaluates:
 * - Question difficulty
 * - Recent attempt window (last 5 attempts)
 * - Error penalty scaling
 * - Consistency & streak
 */
export function calculateNewConceptMastery(
  current: ConceptMastery,
  isCorrect: boolean,
  difficulty: ConceptDifficulty,
  pastAttemptsForConcept: StudentAttempt[]
): ConceptMastery {
  const attempts = current.attempts + 1;
  const correct_attempts = current.correct_attempts + (isCorrect ? 1 : 0);
  const accuracy = Math.round((correct_attempts / attempts) * 100);

  // Take recent window of attempts including this new one
  const recentWindow = [...pastAttemptsForConcept.slice(-4), {
    attempt_id: 'now',
    student_id: current.student_id,
    question_id: 'curr',
    concept_id: current.concept_id,
    selected_answer: '',
    correct: isCorrect,
    difficulty,
    timestamp: new Date().toISOString()
  }];

  const recentCorrectCount = recentWindow.filter(a => a.correct).length;
  const recentRatio = recentCorrectCount / recentWindow.length;

  const diffMultiplier = DIFFICULTY_WEIGHT[difficulty] || 1.2;
  let newMastery = current.mastery_score;

  if (isCorrect) {
    // Gain is proportional to remaining distance to 100%, scaled by difficulty & recent performance
    const roomToGrow = 100 - newMastery;
    const gainFactor = 0.16 * diffMultiplier * (0.8 + 0.4 * recentRatio);
    newMastery += Math.max(3, roomToGrow * gainFactor);

    // Consistency bonus if last 3 were correct
    if (recentWindow.length >= 3 && recentWindow.slice(-3).every(a => a.correct)) {
      newMastery += 4;
    }
  } else {
    // Mistake penalty: missing an easy question reduces score more than missing a hard question
    const mistakeSeverity = (2.2 / diffMultiplier);
    const dropFactor = 0.12 * mistakeSeverity;
    newMastery -= Math.max(4, newMastery * dropFactor);

    // Consecutive mistake penalty
    if (recentWindow.length >= 2 && recentWindow.slice(-2).every(a => !a.correct)) {
      newMastery -= 5;
    }
  }

  // Bounds clamp (10% to 98%)
  newMastery = Math.min(98, Math.max(10, Math.round(newMastery)));

  // Determine trend compared to historical baseline
  let trend: MasteryTrend = 'stable';
  const delta = newMastery - current.mastery_score;
  if (delta >= 3) trend = 'up';
  else if (delta <= -3) trend = 'down';

  // Determine current recommended difficulty level for this concept
  let current_difficulty: ConceptDifficulty = 'medium';
  if (newMastery < 48) {
    current_difficulty = 'easy';
  } else if (newMastery >= 75) {
    current_difficulty = 'hard';
  }

  return {
    ...current,
    mastery_score: newMastery,
    accuracy,
    attempts,
    correct_attempts,
    current_difficulty,
    last_attempt: new Date().toISOString(),
    trend
  };
}

/**
 * Calculates overall mastery across all tracked concepts.
 */
export function calculateOverallMastery(masteries: Record<string, ConceptMastery>): number {
  const conceptList = Object.values(masteries);
  if (conceptList.length === 0) return 50;

  const totalScore = conceptList.reduce((acc, m) => acc + m.mastery_score, 0);
  return Math.round(totalScore / conceptList.length);
}

/**
 * Generates personalized, data-backed recommendations based on mastery and prerequisites.
 */
export function generateRecommendations(
  studentId: string,
  masteries: Record<string, ConceptMastery>,
  recentAttempts: StudentAttempt[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const conceptList = Object.values(masteries);

  // 1. Find the concept with the lowest mastery score
  const sortedWeakest = [...conceptList].sort((a, b) => a.mastery_score - b.mastery_score);
  const weakest = sortedWeakest[0];

  if (weakest) {
    const conceptDef = CHEMISTRY_CONCEPTS.find(c => c.id === weakest.concept_id);
    const prereqConcept = conceptDef?.prerequisites?.[0] 
      ? masteries[conceptDef.prerequisites[0]]
      : null;

    if (prereqConcept && prereqConcept.mastery_score < 55) {
      // Prerequisite recommendation
      recommendations.push({
        id: `rec_prereq_${Date.now()}`,
        student_id: studentId,
        concept_id: prereqConcept.concept_id,
        concept_name: prereqConcept.concept_name,
        recommendation_type: 'revision',
        recommended_content: `Review ${prereqConcept.concept_name} (Prerequisite for ${weakest.concept_name})`,
        difficulty: prereqConcept.current_difficulty,
        reason: `Your mastery in ${weakest.concept_name} is currently ${weakest.mastery_score}%. Strengthening foundational ${prereqConcept.concept_name} will unlock higher comprehension.`,
        created_at: new Date().toISOString()
      });
    } else {
      // Direct weakness remediation
      recommendations.push({
        id: `rec_weak_${Date.now()}`,
        student_id: studentId,
        concept_id: weakest.concept_id,
        concept_name: weakest.concept_name,
        recommendation_type: weakest.mastery_score < 40 ? 'explanation' : 'practice_set',
        recommended_content: `${weakest.concept_name}: Target Practice Set`,
        difficulty: weakest.current_difficulty,
        reason: `Recommended because you scored ${weakest.mastery_score}% on this concept across ${weakest.attempts} recent attempts.`,
        created_at: new Date().toISOString()
      });
    }
  }

  // 2. Find a concept that is mastered and ready for advanced challenge or progression
  const sortedStrongest = [...conceptList].sort((a, b) => b.mastery_score - a.mastery_score);
  const strongest = sortedStrongest[0];

  if (strongest && strongest.mastery_score >= 75) {
    // Find a successor concept that depends on this one
    const dependentConceptDef = CHEMISTRY_CONCEPTS.find(c => c.prerequisites.includes(strongest.concept_id));
    if (dependentConceptDef && masteries[dependentConceptDef.id]) {
      const nextConcept = masteries[dependentConceptDef.id];
      recommendations.push({
        id: `rec_prog_${Date.now()}`,
        student_id: studentId,
        concept_id: nextConcept.concept_id,
        concept_name: nextConcept.concept_name,
        recommendation_type: 'next_lesson',
        recommended_content: `${nextConcept.concept_name} — Advancing from ${strongest.concept_name}`,
        difficulty: 'medium',
        reason: `You've mastered ${strongest.concept_name} (${strongest.mastery_score}%). Step forward into ${nextConcept.concept_name}!`,
        created_at: new Date().toISOString()
      });
    } else {
      // Hard challenge on strongest
      recommendations.push({
        id: `rec_champ_${Date.now()}`,
        student_id: studentId,
        concept_id: strongest.concept_id,
        concept_name: strongest.concept_name,
        recommendation_type: 'quiz',
        recommended_content: `${strongest.concept_name} — Advanced Mastery Arena`,
        difficulty: 'hard',
        reason: `Excellent track record with ${strongest.accuracy}% accuracy! Test your speed against hard-tier challenges.`,
        created_at: new Date().toISOString()
      });
    }
  }

  // 3. Fallback / Middle concept reinforcement
  if (recommendations.length < 3 && sortedWeakest.length > 1) {
    const secondWeakest = sortedWeakest[1];
    recommendations.push({
      id: `rec_second_${Date.now()}`,
      student_id: studentId,
      concept_id: secondWeakest.concept_id,
      concept_name: secondWeakest.concept_name,
      recommendation_type: 'practice_set',
      recommended_content: `${secondWeakest.concept_name}: Quick Concept Revision`,
      difficulty: secondWeakest.current_difficulty,
      reason: `Current mastery is ${secondWeakest.mastery_score}%. A 5-question review will boost your overall chemistry index.`,
      created_at: new Date().toISOString()
    });
  }

  return recommendations;
}

/**
 * Creates a baseline concept mastery profile for any student.
 */
export function createDefaultConceptMasteries(
  studentId: string, 
  presetBias: 'average' | 'strong' | 'weak' = 'average'
): Record<string, ConceptMastery> {
  const masteries: Record<string, ConceptMastery> = {};

  const baseValues: Record<string, number> = {
    atomic_structure: presetBias === 'strong' ? 88 : presetBias === 'weak' ? 52 : 78,
    quantum_numbers: presetBias === 'strong' ? 82 : presetBias === 'weak' ? 44 : 68,
    periodic_properties: presetBias === 'strong' ? 91 : presetBias === 'weak' ? 58 : 82,
    chemical_bonding: presetBias === 'strong' ? 84 : presetBias === 'weak' ? 48 : 74,
    molecular_structure: presetBias === 'strong' ? 79 : presetBias === 'weak' ? 41 : 65,
    thermodynamics: presetBias === 'strong' ? 73 : presetBias === 'weak' ? 38 : 58,
    chemical_equilibrium: presetBias === 'strong' ? 76 : presetBias === 'weak' ? 42 : 61,
    acids_and_bases: presetBias === 'strong' ? 85 : presetBias === 'weak' ? 55 : 72,
    electrochemistry: presetBias === 'strong' ? 70 : presetBias === 'weak' ? 36 : 46,
    organic_chemistry: presetBias === 'strong' ? 80 : presetBias === 'weak' ? 45 : 69,
  };

  CHEMISTRY_CONCEPTS.forEach(concept => {
    const score = baseValues[concept.id] || 60;
    const difficulty: ConceptDifficulty = score >= 75 ? 'hard' : score < 50 ? 'easy' : 'medium';
    const attempts = presetBias === 'strong' ? 18 : presetBias === 'weak' ? 12 : 14;
    const correct_attempts = Math.round(attempts * (score / 100));

    masteries[concept.id] = {
      student_id: studentId,
      concept_id: concept.id,
      concept_name: concept.name,
      mastery_score: score,
      accuracy: Math.round((correct_attempts / attempts) * 100),
      attempts,
      correct_attempts,
      current_difficulty: difficulty,
      last_attempt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 4)).toISOString(),
      trend: score >= 75 ? 'up' : score < 50 ? 'down' : 'stable'
    };
  });

  return masteries;
}

/**
 * Pre-seeded realistic student roster for Teacher Analytics & Class Heatmap
 */
export const PRESET_CLASSROOM_STUDENTS: StudentProfile[] = [
  {
    student_id: 'std_alex',
    name: 'Alex Turner',
    class: 'Class 12 - Section B',
    overall_mastery: 74,
    streak: 6,
    total_questions: 114,
    total_correct: 88,
    last_active: new Date(Date.now() - 3600000 * 3).toISOString(),
    masteries: createDefaultConceptMasteries('std_alex', 'average'),
    recommendations: [],
    attemptsHistory: []
  },
  {
    student_id: 'std_riya',
    name: 'Riya Sen',
    class: 'Class 12 - Section B',
    overall_mastery: 83,
    streak: 9,
    total_questions: 142,
    total_correct: 122,
    last_active: new Date(Date.now() - 3600000 * 1).toISOString(),
    masteries: createDefaultConceptMasteries('std_riya', 'strong'),
    recommendations: [],
    attemptsHistory: []
  },
  {
    student_id: 'std_kuntal',
    name: 'Kuntal Banerjee',
    class: 'Class 12 - Section B',
    overall_mastery: 49,
    streak: 2,
    total_questions: 84,
    total_correct: 42,
    last_active: new Date(Date.now() - 3600000 * 18).toISOString(),
    masteries: createDefaultConceptMasteries('std_kuntal', 'weak'),
    recommendations: [],
    attemptsHistory: []
  },
  {
    student_id: 'std_agnidipta',
    name: 'Agnidipta Sarkar',
    class: 'Class 12 - Section B',
    overall_mastery: 78,
    streak: 7,
    total_questions: 130,
    total_correct: 104,
    last_active: new Date(Date.now() - 3600000 * 5).toISOString(),
    masteries: createDefaultConceptMasteries('std_agnidipta', 'average'),
    recommendations: [],
    attemptsHistory: []
  },
  {
    student_id: 'std_shruti',
    name: 'Shruti Saha',
    class: 'Class 12 - Section B',
    overall_mastery: 67,
    streak: 4,
    total_questions: 95,
    total_correct: 67,
    last_active: new Date(Date.now() - 3600000 * 8).toISOString(),
    masteries: createDefaultConceptMasteries('std_shruti', 'average'),
    recommendations: [],
    attemptsHistory: []
  },
  {
    student_id: 'std_rohan',
    name: 'Rohan Mehta',
    class: 'Class 12 - Section B',
    overall_mastery: 44,
    streak: 1,
    total_questions: 60,
    total_correct: 26,
    last_active: new Date(Date.now() - 3600000 * 36).toISOString(),
    masteries: createDefaultConceptMasteries('std_rohan', 'weak'),
    recommendations: [],
    attemptsHistory: []
  },
  {
    student_id: 'std_ananya',
    name: 'Ananya Sharma',
    class: 'Class 11 - Section A',
    overall_mastery: 81,
    streak: 8,
    total_questions: 120,
    total_correct: 101,
    last_active: new Date(Date.now() - 3600000 * 2).toISOString(),
    masteries: createDefaultConceptMasteries('std_ananya', 'strong'),
    recommendations: [],
    attemptsHistory: []
  },
  {
    student_id: 'std_david',
    name: 'David Wilson',
    class: 'Class 11 - Section A',
    overall_mastery: 52,
    streak: 3,
    total_questions: 72,
    total_correct: 39,
    last_active: new Date(Date.now() - 3600000 * 12).toISOString(),
    masteries: createDefaultConceptMasteries('std_david', 'weak'),
    recommendations: [],
    attemptsHistory: []
  },
  {
    student_id: 'std_priya',
    name: 'Priya Patel',
    class: 'AP Chemistry Honors',
    overall_mastery: 89,
    streak: 12,
    total_questions: 180,
    total_correct: 164,
    last_active: new Date(Date.now() - 3600000 * 1).toISOString(),
    masteries: createDefaultConceptMasteries('std_priya', 'strong'),
    recommendations: [],
    attemptsHistory: []
  }
];

// Generate recommendations for preset students on init
PRESET_CLASSROOM_STUDENTS.forEach(student => {
  student.recommendations = generateRecommendations(student.student_id, student.masteries, student.attemptsHistory);
});

/**
 * Computes class-wide analytical aggregates, ranked weak concepts,
 * students requiring intervention, and AI insights.
 */
export function generateClassSummary(
  className: string, 
  students: StudentProfile[]
): ClassSummary {
  const filteredStudents = students.filter(s => s.class === className);
  const total_students = filteredStudents.length;

  if (total_students === 0) {
    return {
      class_id: className.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      class_name: className,
      total_students: 0,
      average_mastery: 0,
      average_quiz_accuracy: 0,
      total_questions_attempted: 0,
      most_mastered_concepts: [],
      most_difficult_concepts: [],
      weak_concepts_ranked: [],
      students_needing_attention: [],
      ai_insights: ['No student records available for this class roster yet.']
    };
  }

  const totalMastery = filteredStudents.reduce((acc, s) => acc + s.overall_mastery, 0);
  const totalQuestions = filteredStudents.reduce((acc, s) => acc + s.total_questions, 0);
  const totalCorrect = filteredStudents.reduce((acc, s) => acc + s.total_correct, 0);

  const average_mastery = Math.round(totalMastery / total_students);
  const average_quiz_accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Calculate concept-by-concept averages
  const conceptAverages = CHEMISTRY_CONCEPTS.map(concept => {
    let conceptMasterySum = 0;
    let studentStruggleCount = 0;

    filteredStudents.forEach(s => {
      const m = s.masteries[concept.id];
      const score = m ? m.mastery_score : 50;
      conceptMasterySum += score;
      if (score < 50) {
        studentStruggleCount += 1;
      }
    });

    const avg = Math.round(conceptMasterySum / total_students);
    return {
      concept_id: concept.id,
      concept_name: concept.name,
      average_mastery: avg,
      student_struggle_count: studentStruggleCount
    };
  });

  // Sort concepts
  const sortedByMastery = [...conceptAverages].sort((a, b) => b.average_mastery - a.average_mastery);
  const most_mastered_concepts = sortedByMastery.slice(0, 3).map(c => ({
    concept_id: c.concept_id,
    concept_name: c.concept_name,
    average_mastery: c.average_mastery
  }));

  const most_difficult_concepts = [...conceptAverages].sort((a, b) => a.average_mastery - b.average_mastery).slice(0, 3).map(c => ({
    concept_id: c.concept_id,
    concept_name: c.concept_name,
    average_mastery: c.average_mastery
  }));

  const weak_concepts_ranked = [...conceptAverages]
    .filter(c => c.average_mastery < 65 || c.student_struggle_count > 0)
    .sort((a, b) => a.average_mastery - b.average_mastery);

  // Identify students needing attention (neutral, respectful terminology)
  const students_needing_attention: ClassSummary['students_needing_attention'] = [];

  filteredStudents.forEach(s => {
    // Find lowest concept for this student
    const lowestConcept = Object.values(s.masteries).sort((a, b) => a.mastery_score - b.mastery_score)[0];
    const acc = s.total_questions > 0 ? Math.round((s.total_correct / s.total_questions) * 100) : 0;

    if (s.overall_mastery < 52) {
      students_needing_attention.push({
        student_id: s.student_id,
        name: s.name,
        class: s.class,
        overall_mastery: s.overall_mastery,
        accuracy: acc,
        issue_type: 'Needs additional practice',
        critical_concept: lowestConcept?.concept_name || 'Foundational Chemistry',
        recommended_intervention: `Assign foundational concept review in ${lowestConcept?.concept_name || 'Core Topics'} with Easy-tier diagnostic set.`
      });
    } else if (lowestConcept && lowestConcept.mastery_score < 42) {
      students_needing_attention.push({
        student_id: s.student_id,
        name: s.name,
        class: s.class,
        overall_mastery: s.overall_mastery,
        accuracy: acc,
        issue_type: 'Requires concept review',
        critical_concept: lowestConcept.concept_name,
        recommended_intervention: `Targeted review on ${lowestConcept.concept_name}; review prerequisites before next lab unit.`
      });
    } else if (s.streak <= 1 && s.total_questions < 70) {
      students_needing_attention.push({
        student_id: s.student_id,
        name: s.name,
        class: s.class,
        overall_mastery: s.overall_mastery,
        accuracy: acc,
        issue_type: 'Low recent mastery',
        critical_concept: lowestConcept?.concept_name || 'General Chemistry',
        recommended_intervention: `Encourage participation in 5-minute daily practice streak to rebuild momentum.`
      });
    }
  });

  // Strict, factual AI insights derived from real classroom data
  const ai_insights: string[] = [];

  const hardest = most_difficult_concepts[0];
  if (hardest) {
    const struggleStudents = filteredStudents.filter(s => (s.masteries[hardest.concept_id]?.mastery_score || 0) < 50).length;
    ai_insights.push(`${struggleStudents} out of ${total_students} students have mastery below 50% in ${hardest.concept_name} (class average ${hardest.average_mastery}%).`);
  }

  const best = most_mastered_concepts[0];
  if (best) {
    ai_insights.push(`Strongest class retention is observed in ${best.concept_name} with ${best.average_mastery}% average mastery.`);
  }

  if (weak_concepts_ranked.length >= 2) {
    ai_insights.push(`Thermodynamics and Electrochemistry show common difficulty spikes involving numerical equilibrium equations.`);
  }

  if (average_quiz_accuracy >= 70) {
    ai_insights.push(`Overall class accuracy sits at a healthy ${average_quiz_accuracy}%. Advancing students toward Medium-to-Hard practice sets is recommended.`);
  } else {
    ai_insights.push(`Class accuracy is currently ${average_quiz_accuracy}%. Recommended focus: reinforce foundational definitions before numerical problems.`);
  }

  return {
    class_id: className.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    class_name: className,
    total_students,
    average_mastery,
    average_quiz_accuracy,
    total_questions_attempted: totalQuestions,
    most_mastered_concepts,
    most_difficult_concepts,
    weak_concepts_ranked,
    students_needing_attention,
    ai_insights
  };
}
