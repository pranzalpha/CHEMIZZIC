/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Atom3D {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface Bond3D {
  atom1: number;
  atom2: number;
  order: number; // 1 = single, 2 = double, 3 = triple
}

export interface ChemicalProp {
  id: number;
  name: string;
  iupacName: string;
  formula: string;
  molarMass: string;
  smiles: string;
  cid?: number;
  structureImage?: string;
  density: string;
  meltingPoint: string;
  boilingPoint: string;
  appearance: string;
  odor: string;
  hazards: string[];
  uses: string[];
  characteristics: string[];
  nfpa?: {
    health: number;
    flammability: number;
    instability: number;
    special?: string;
  };
  ghsPictograms?: string[]; // flammable, toxic, corrosive, explosive, etc.
}

export interface ElementDetail {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string; // alkali, transition, noble-gas, etc.
  phase: 'Solid' | 'Liquid' | 'Gas' | 'Synthetic';
  electronConfig: string;
  melt?: number; // Kelvin
  boil?: number; // Kelvin
  electronegativity?: number;
  discovery: string;
  summary: string;
}

export interface ReactionDetail {
  reactantText: string;
  balancedEquation: string;
  reactionType: string;
  thermalType: 'Exothermic' | 'Endothermic' | 'Neutral';
  energyChange: string;
  activationEnergy: string;
  catalysts: string[];
  equationBalanced: {
    reactants: { formula: string; coefficient: number; name: string }[];
    products: { formula: string; coefficient: number; name: string }[];
  };
  keyInsights: string[];
  uses: string[];
  conditionsUsed?: {
    temperature: string;
    pressure: string;
    solvent: string;
    catalyst: string;
    atmosphere: string;
    isDefaultAssumption?: boolean;
    defaultAssumptionsSummary?: string;
  };
  conditionDependent?: boolean;
  alternativePathways?: Array<{
    condition: string;
    equation: string;
    products: string;
    note: string;
  }>;
  verificationStatus?: 'VERIFIED' | 'CALCULATED' | 'PREDICTED' | 'AI-GENERATED' | 'DEFAULT ASSUMPTION';
  confidence?: number;
}

export interface CompetitivePathway {
  pathwayName: string;
  balancedEquation: string;
  conditionsFavored: string;
  byproductHazards: string;
  selectivity: string;
  mechanism: string;
}

export interface MechanismStep {
  stepNumber: number;
  title: string;
  description: string;
  electronMovement: string;
  intermediateSpecies: string;
}

export interface ReactionMatrixResult {
  reactantsInput: string;
  conditionsUsed: {
    temperature: string;
    pressure: string;
    solvent: string;
    catalyst: string;
    atmosphere: string;
  };
  primaryPathway: {
    balancedEquation: string;
    reactionType: string;
    yieldPercentage: string;
    thermalType: 'Exothermic' | 'Endothermic' | 'Neutral';
    energyChange: string;
    gibbsFreeEnergy: string;
    activationEnergy: string;
    rateLaw: string;
    mechanismType: string;
    products: { formula: string; name: string; state: string; coefficient: number }[];
  };
  competitivePathways: CompetitivePathway[];
  decompositionPathway?: {
    tempThreshold: string;
    balancedEquation: string;
    hazardWarning: string;
  };
  mechanismSteps: MechanismStep[];
  laboratorySafety: {
    ppeRequired: string[];
    exothermHazard: string;
    ventilationRequired: boolean;
    quenchingProtocol: string;
  };
  internetGroundingData: {
    literatureSources: string[];
    industrialRelevance: string;
  };
}

export interface SynthesizedCompound {
  id: string;
  name: string;
  formula: string;
  synthesisEquation: string;
  conditions: string;
  state: 'Gas' | 'Liquid' | 'Solid' | 'Aqueous';
  elementsUsed: string[];
  molarMass: string;
  smiles?: string;
  uses: string;
  safetyNote?: string;
}

export interface WorldwideRankingItem {
  id: string;
  rank: number;
  name: string;
  subtitle: string;
  category: 'scholar' | 'chemical' | 'laureate' | 'institution';
  country?: string;
  countryFlag?: string;
  metricValue: string;
  metricLabel: string;
  details: string;
  internetSource?: string;
  tags: string[];
}

export interface ExplainResponse {
  chemicalName: string;
  studentExplanation: string;
  scientistExplanation: string;
  safetySummary: string;
  funFact: string;
}

export type UserRole = 'student' | 'teacher' | 'admin' | 'guest';

export interface User {
  id: string;
  username: string;
  email: string;
  score: number;
  xp: number;
  level: number;
  quizAttempts: number;
  badges: string[];
  joinedAt: string;
  role: UserRole;
  roll_no?: string;
  student_class?: string;
  section?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  level: number;
  quizAttempts: number;
  badges: string[];
}

// ==========================================
// ADAPTIVE LEARNING & STUDENT ANALYTICS MODELS
// ==========================================

export type ConceptDifficulty = 'easy' | 'medium' | 'hard';
export type MasteryTrend = 'up' | 'stable' | 'down';

export interface ConceptMastery {
  student_id: string;
  concept_id: string;
  concept_name: string;
  mastery_score: number; // 0 to 100
  accuracy: number; // Percentage 0 to 100
  attempts: number;
  correct_attempts: number;
  current_difficulty: ConceptDifficulty;
  last_attempt: string;
  trend: MasteryTrend;
}

export interface StudentAttempt {
  attempt_id: string;
  student_id: string;
  question_id: string;
  concept_id: string;
  selected_answer: string;
  correct: boolean;
  difficulty: ConceptDifficulty;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  student_id: string;
  concept_id: string;
  concept_name: string;
  recommendation_type: 'next_lesson' | 'practice_set' | 'quiz' | 'revision' | 'explanation';
  recommended_content: string;
  difficulty: ConceptDifficulty;
  reason: string;
  created_at: string;
}

export interface StudentProfile {
  student_id: string;
  name: string;
  class: string;
  roll_no?: string;
  section?: string;
  overall_mastery: number; // 0 to 100
  streak: number; // days
  total_questions: number;
  total_correct: number;
  last_active: string;
  masteries: Record<string, ConceptMastery>; // conceptId -> ConceptMastery
  recommendations: Recommendation[];
  attemptsHistory: StudentAttempt[];
}

export interface ClassSummary {
  class_id: string;
  class_name: string;
  total_students: number;
  average_mastery: number;
  average_quiz_accuracy: number;
  total_questions_attempted: number;
  most_mastered_concepts: { concept_id: string; concept_name: string; average_mastery: number }[];
  most_difficult_concepts: { concept_id: string; concept_name: string; average_mastery: number }[];
  weak_concepts_ranked: { concept_id: string; concept_name: string; average_mastery: number; student_struggle_count: number }[];
  students_needing_attention: {
    student_id: string;
    name: string;
    class: string;
    overall_mastery: number;
    accuracy: number;
    issue_type: 'Needs additional practice' | 'Requires concept review' | 'Low recent mastery' | 'Declining performance';
    critical_concept: string;
    recommended_intervention: string;
  }[];
  ai_insights: string[];
}

export interface FeatureActivityLog {
  id: string;
  student_id: string;
  feature_id: 'explorer' | 'periodic' | 'reaction' | 'phmeter' | 'chemist' | 'quiz' | 'adaptive_practice' | 'analytics' | 'leaderboard';
  feature_name: string;
  action: string;
  category: 'Laboratory' | 'Calculations' | 'Diagnostics' | 'AI Consultation' | 'Assessment' | 'Exploration';
  timestamp: string;
  xpEarned: number;
}

export interface DailyLoginRecord {
  date: string; // YYYY-MM-DD
  loginTime: string;
  streakCount: number;
  bonusClaimed: boolean;
  questionsSolved: number;
  featuresUsed: string[];
  sessionMinutes: number;
}

export interface Assignment {
  id: string;
  title: string;
  concept_id: string;
  concept_name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  assigned_by: string; // Teacher name
  target_type: 'all' | 'specific_students' | 'specific_class';
  target_student_ids: string[];
  target_class: string;
  question_count: number;
  due_date: string;
  instructions: string;
  created_at: string;
  completed_by: string[]; // array of student_ids who completed it
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  stepByStepSolution?: string[];
  concept_id?: string;
  source?: 'ai' | 'local_fallback';
  isError?: boolean;
}

// ==========================================
// SPACED REPETITION & 5-TIER DIFFICULTY TYPES
// ==========================================
export type GranularDifficultyLevel = 1 | 2 | 3 | 4 | 5; // 1=Beginner, 2=Easy, 3=Medium, 4=Hard, 5=Expert

export interface SpacedRepetitionItem {
  concept_id: string;
  concept_name: string;
  repetition_number: number;
  interval_days: number;
  ease_factor: number; // default ~2.5
  last_reviewed: string;
  next_review_date: string; // ISO date string YYYY-MM-DD
  is_due: boolean;
  retention_score: number; // 0 to 100
}

export interface QuestionHint {
  level: 1 | 2 | 3 | 4; // 1: Conceptual clue, 2: Method/formula, 3: Partial reasoning, 4: Full solution
  title: string;
  content: string;
}

// ==========================================
// EQUATION SOLVER & PERIODIC PREDICTOR TYPES
// ==========================================
export type VerificationStatus = 'VERIFIED' | 'CALCULATED' | 'PREDICTED' | 'AI-GENERATED';

export interface EquationBalancingStep {
  stepNumber: number;
  description: string;
  intermediateEquation: string;
}

export interface OxidationStateEntry {
  element: string;
  initialState: string;
  finalState: string;
  change: 'Oxidized' | 'Reduced' | 'Spectator';
}

export interface EquationSolverResult {
  reactantsInput: string;
  parsedReactants: string[];
  predictedProducts: string[];
  balancedEquation: string;
  reactionType: string;
  balancingSteps: EquationBalancingStep[];
  oxidationStates: OxidationStateEntry[];
  redoxDetails?: {
    oxidizingAgent: string;
    reducingAgent: string;
    electronsTransferred: number;
  };
  explanation: string;
  confidence: number; // 0 to 100
  verificationStatus: VerificationStatus;
  conditionsNeeded?: string;
  isUncertain?: boolean;
  uncertaintyReason?: string;
}

export interface PeriodicReactionResult {
  elementA: string;
  elementBOrReagent: string;
  likelyProducts: string;
  balancedEquation: string;
  reactionType: string;
  oxidationStates: string;
  periodicTrends: string[];
  reactivityExplanation: string;
  conditions: string;
  confidence: number;
  verificationStatus: VerificationStatus;
  source: string;
}

// ==========================================
// PH METER LAB & REAL-WORLD DATA TYPES
// ==========================================
export type AcidBaseType = 'Strong Acid' | 'Weak Acid' | 'Strong Base' | 'Weak Base' | 'Neutral' | 'Salt' | 'Buffer';

export interface PHCompoundData {
  id: string;
  name: string;
  formula: string;
  type: AcidBaseType;
  ka?: number;
  kb?: number;
  pka?: number;
  pkb?: number;
  standardConcentration: number; // Molarity
  theoreticalPH: number;
  description: string;
  safety: string;
  applications: string[];
}

export interface PHCalculationResult {
  compoundName: string;
  formula: string;
  type: AcidBaseType;
  concentration: number; // M
  volumeMl: number;
  temperatureC: number;
  calculatedPH: number;
  pOH: number;
  hConcentration: number;
  ohConcentration: number;
  methodUsed: string;
  assumptions: string[];
  dataSource: string;
  confidence: number;
  verificationStatus: VerificationStatus;
}

export interface RealWorldPHMeasurement {
  id: string;
  sampleName: string;
  timestamp: string;
  measuredPH: number;
  theoreticalPH?: number;
  temperature: number;
  temperatureC?: number;
  notes?: string;
  formula?: string;
  concentration?: number;
  sensorError?: number;
  operator?: string;
}

export interface DiagnosticQuizResult {
  id: string;
  timestamp: string;
  studentId: string;
  overallScore: number;
  accuracy: number;
  categoryScores: {
    physical: number;
    inorganic: number;
    organic: number;
  };
  conceptScores: Record<string, number>;
  weakestConcepts: string[];
  strongestConcepts: string[];
  recommendedLearningPath: string[];
}

export * from './types/curriculum';


