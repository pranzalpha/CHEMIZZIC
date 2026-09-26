/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Massive Curriculum, Scalable Question Bank & Pedagogical Engine Types
 * Supports Class 11, Class 12, BSc, MSc, BTech, and MTech chemistry tracks.
 */

export type EducationLevelId = 
  | 'CLASS_11'
  | 'CLASS_12'
  | 'BSC'
  | 'MSC'
  | 'BTECH'
  | 'MTECH';

export type ChemistryBranch = 
  | 'Physical'
  | 'Inorganic'
  | 'Organic'
  | 'Analytical'
  | 'Engineering'
  | 'Materials'
  | 'Biochemistry'
  | 'Environmental';

export type ScientificVerificationLabel = 
  | 'VERIFIED'
  | 'CALCULATED'
  | 'PREDICTED'
  | 'AI-GENERATED'
  | 'EXPERIMENTAL'
  | 'USER-PROVIDED';

export type GranularDifficulty = 1 | 2 | 3 | 4 | 5; // 1 = Beginner, 2 = Easy, 3 = Medium, 4 = Hard, 5 = Expert

export type AdvancedQuestionType =
  | 'mcq'
  | 'multi_select'
  | 'true_false'
  | 'numerical'
  | 'short_answer'
  | 'long_conceptual'
  | 'assertion_reason'
  | 'give_reason'
  | 'match_the_following'
  | 'fill_in_the_blanks'
  | 'sequence'
  | 'case_study'
  | 'story_based'
  | 'reaction_prediction'
  | 'guess_the_products'
  | 'equation_balancing'
  | 'identify_reaction_type'
  | 'mechanism'
  | 'diagram_based'
  | 'structure_based'
  | 'spectroscopy'
  | 'graph_based'
  | 'data_interpretation'
  | 'laboratory_scenario'
  | 'experimental_design'
  | 'error_analysis'
  | 'numerical_multistep'
  | 'real_world_problem';

export interface ConceptDefinition {
  id: string;
  name: string;
  branch: ChemistryBranch;
  description: string;
  prerequisites: string[]; // Concept IDs
  keyFormulasAndRules?: string[];
  subtopics: string[];
  unitId: string;
  topicId: string;
  educationLevel: EducationLevelId;
  realWorldApplications?: string[];
}

export interface SubtopicDefinition {
  id: string;
  name: string;
  topicId: string;
  description: string;
  conceptIds: string[];
}

export interface TopicDefinition {
  id: string;
  name: string;
  unitId: string;
  branch: ChemistryBranch;
  description: string;
  subtopicIds: string[];
  conceptIds: string[];
  prerequisites: string[];
  estimatedQuestions: number;
}

export interface UnitDefinition {
  id: string;
  unitNumber: number;
  name: string;
  subjectId: string;
  branch: ChemistryBranch;
  description: string;
  topicIds: string[];
}

export interface SubjectDefinition {
  id: string;
  name: string;
  programId: string;
  educationLevel: EducationLevelId;
  description: string;
  unitIds: string[];
}

export interface ProgramDefinition {
  id: string;
  name: string;
  educationLevel: EducationLevelId;
  description: string;
  subjectIds: string[];
}

export interface EducationLevelDefinition {
  id: EducationLevelId;
  label: string;
  subtitle: string;
  description: string;
  programs: ProgramDefinition[];
  iconName: string;
  badgeColor: string;
}

// ==========================================
// SCALABLE QUESTION SCHEMA (1000+ per topic)
// ==========================================

export interface NumericalProblemData {
  given: Record<string, { value: number | string; unit: string; symbol: string; description: string }>;
  formula: string;
  formulaLaTeX?: string;
  targetVariable: string;
  targetUnit: string;
  stepCalculations: Array<{
    stepNumber: number;
    title: string;
    description: string;
    substitution: string;
    calculation: string;
    result: string;
  }>;
  calculatedAnswer: number;
  tolerance: number; // e.g. 0.05 (5%)
  dimensionalCheck: string;
  verificationMethod: string;
}

export interface DiagramQuestionData {
  diagramType: 'daniell_cell' | 'energy_profile' | 'titration_curve' | 'orbital_split' | 'mechanism' | 'generic';
  title: string;
  description?: string;
  components: Array<{
    id: string;
    label: string;
    role: string;
    details: string;
    active?: boolean;
    x?: number;
    y?: number;
  }>;
  interactivePrompt?: string;
  highlightComponentId?: string;
}

export interface ReactionQuestionData {
  reactants: string[];
  conditions: string;
  balancedEquation: string;
  reactionType: string;
  oxidationStates?: string;
  mechanismNotes?: string;
  products: string[];
  byproducts?: string[];
  thermodynamics?: {
    deltaH?: string;
    deltaG?: string;
    thermalType?: 'Exothermic' | 'Endothermic' | 'Neutral';
  };
}

export interface AssertionReasonData {
  assertion: string;
  reason: string;
  assertionTrue: boolean;
  reasonTrue: boolean;
  reasonExplainsAssertion: boolean;
  correctChoiceLetter: 'A' | 'B' | 'C' | 'D';
}

export interface GiveReasonData {
  scenarioOrFact: string;
  expectedReasoningKeyPoints: string[];
  governingPrinciple: string;
  stepByStepExplanation: string[];
  finalAnswer: string;
}

export interface MatchTheFollowingPair {
  itemA: string;
  matchId: string;
  itemB: string;
}

export interface QuestionHintItem {
  level: 1 | 2 | 3 | 4;
  title: string;
  content: string;
}

export interface ScalableChemistryQuestion {
  id: string;
  educationLevel: EducationLevelId;
  program: string;
  subject: string;
  unit: string;
  topic: string;
  subtopic: string;
  conceptIds: string[];
  prerequisites: string[];
  questionType: AdvancedQuestionType;
  difficulty: GranularDifficulty;
  question: string;
  context?: string; // Story, case-study scenario, laboratory context
  options: string[];
  correctAnswer: string;
  explanation: string;
  whyIncorrect?: Record<string, string>;
  solutionSteps?: string[];
  hints: QuestionHintItem[];
  numericalData?: NumericalProblemData;
  diagramData?: DiagramQuestionData;
  reactionData?: ReactionQuestionData;
  assertionReasonData?: AssertionReasonData;
  giveReasonData?: GiveReasonData;
  matchData?: MatchTheFollowingPair[];
  source: string;
  verificationStatus: ScientificVerificationLabel;
  generatedBy: 'CURATED_FACULTY' | 'PARAMETERIZED_ENGINE' | 'AI_GENERATED' | 'PROGRAMMATIC_SOLVER';
  createdAt: string;
  updatedAt: string;
  estimatedTime: number; // in seconds
  tags: string[];
  version?: string;
}

// ==========================================
// MIND MAP DEFINITIONS
// ==========================================

export interface MindMapNode {
  id: string;
  label: string;
  conceptId?: string;
  type: 'root' | 'unit' | 'topic' | 'subtopic' | 'concept' | 'formula';
  summary?: string;
  masteryScore?: number; // 0-100
  isWeak?: boolean;
  prerequisites?: string[];
  children?: MindMapNode[];
  formulas?: string[];
  questionsCount?: number;
}

// ==========================================
// GUESS THE PRODUCTS GAME DEFINITIONS
// ==========================================

export interface GuessTheProductsChallenge {
  id: string;
  title: string;
  reactantsInput: string;
  conditions: string;
  reactantsList: string[];
  options: string[]; // Possible products to guess
  correctAnswer?: string;
  correctProducts: string[];
  balancedEquation: string;
  reactionType: string;
  mechanism: string;
  oxidationStates: string;
  whyProductsForm: string;
  difficulty: GranularDifficulty;
  confidence: number;
  verificationStatus: ScientificVerificationLabel;
  category: 'Organic' | 'Inorganic' | 'Redox' | 'Acid-Base' | 'Displacement' | 'Thermal' | 'Physical' | 'Applied' | string;
  subtopic?: string;
  question?: string;
  reactants?: string;
  products?: string[];
  source?: string;
}

// ==========================================
// NUMERICAL SOLVER DEFINITIONS
// ==========================================

export interface NumericalSolveRequest {
  problemText: string;
  topicHint?: string;
  userGivenData?: Record<string, number | string>;
}

export interface NumericalSolveResult {
  identifiedTopic: string;
  detectedConcept: string;
  governingFormula: string;
  formulaLaTeX: string;
  extractedVariables: Array<{
    symbol: string;
    name: string;
    value: number;
    unit: string;
  }>;
  stepByStepSolution: Array<{
    step: number;
    instruction: string;
    expression: string;
    subResult: string;
  }>;
  dimensionalConsistencyCheck: string;
  finalAnswer: {
    numericValue: number;
    unit: string;
    formatted: string;
  };
  explanation: string;
  verificationStatus: ScientificVerificationLabel;
  confidence: number;
}
