/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Batch 2: 50 Questions across Concepts 6 to 10
 * (Thermodynamics, Chemical Equilibrium, Acids & Bases, Electrochemistry, Organic Chemistry)
 * 10 Questions each, accurately distributed (Easy: 3, Medium: 4, Hard: 3)
 */

import { AdaptiveQuestion } from './chemistryConcepts';

export const QUESTIONS_BATCH_2: AdaptiveQuestion[] = [
  // ==========================================
  // CONCEPT 6: THERMODYNAMICS (10 questions)
  // ==========================================
  {
    id: 'thm_q1',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'According to the First Law of Thermodynamics, the change in internal energy (ΔU) of a closed system is equal to:',
    options: ['q + w', 'q - w', 'ΔH + PΔV', 'TΔS'],
    correctAnswer: 'q + w',
    explanation: 'ΔU = q + w (IUPAC convention), where q is heat absorbed by the system and w is work done on the system.',
    whyIncorrect: {
      'q - w': 'Earlier physics convention where work was defined as work done BY the system.',
      'ΔH + PΔV': 'From ΔH = ΔU + PΔV, ΔU = ΔH - PΔV.',
      'TΔS': 'TΔS relates to entropy and reversible heat (qrev).'
    },
    subtopic: 'First & Second Laws'
  },
  {
    id: 'thm_q2',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'A chemical reaction is strictly spontaneous under constant temperature and pressure when which thermodynamic condition is met?',
    options: ['ΔG < 0 (negative)', 'ΔH < 0', 'ΔS < 0', 'ΔG > 0 (positive)'],
    correctAnswer: 'ΔG < 0 (negative)',
    explanation: 'According to the Second Law, a process is spontaneous at constant T and P if and only if the change in Gibbs Free Energy ΔG is negative.',
    whyIncorrect: {
      'ΔH < 0': 'Exothermic reactions can be non-spontaneous if entropy decreases substantially at high temperatures.',
      'ΔS < 0': 'A decrease in entropy opposes spontaneity unless overridden by large negative enthalpy.',
      'ΔG > 0 (positive)': 'Positive ΔG signifies a non-spontaneous (endergonic) process requiring continuous energy input.'
    },
    subtopic: 'Spontaneity & Gibbs Energy'
  },
  {
    id: 'thm_q3',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'The standard enthalpy of formation (ΔHf°) is defined as zero at 298 K for which of the following substances?',
    options: ['O2(g)', 'O3(g)', 'H2O(l)', 'CO2(g)'],
    correctAnswer: 'O2(g)',
    explanation: 'By thermodynamic convention, the standard enthalpy of formation of an element in its most stable reference physical state at 1 bar and 298 K is zero (e.g., O2 gas, C graphite).',
    whyIncorrect: {
      'O3(g)': 'Ozone is an allotrope with positive ΔHf° (+142.7 kJ/mol).',
      'H2O(l)': 'Water is a compound with ΔHf° = -285.8 kJ/mol.',
      'CO2(g)': 'Carbon dioxide is a compound with ΔHf° = -393.5 kJ/mol.'
    },
    subtopic: 'Enthalpy & Calorimetry'
  },
  {
    id: 'thm_q4',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'For a reaction with ΔH = +40 kJ/mol and ΔS = +100 J/(mol·K), at what temperature does the reaction become spontaneous?',
    options: ['Above 400 K', 'Below 400 K', 'Above 250 K', 'At all temperatures'],
    correctAnswer: 'Above 400 K',
    explanation: 'ΔG = ΔH - TΔS. At equilibrium, ΔG = 0 => T = ΔH / ΔS = (40,000 J/mol) / (100 J/(mol·K)) = 400 K. Since ΔH and ΔS are both positive, ΔG < 0 when T > 400 K.',
    whyIncorrect: {
      'Below 400 K': 'At T < 400 K, the positive enthalpy term dominates, making ΔG > 0.',
      'Above 250 K': 'Arithmetic error using ΔH = 25 kJ/mol.',
      'At all temperatures': 'Only reactions with ΔH < 0 and ΔS > 0 are spontaneous at all temperatures.'
    },
    subtopic: 'Spontaneity & Gibbs Energy'
  },
  {
    id: 'thm_q5',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'An ideal gas expands isothermally and reversibly from 2.0 L to 20.0 L at 300 K against an external pressure. What is the change in internal energy (ΔU)?',
    options: ['0 J', '5.7 kJ', '-5.7 kJ', '11.4 kJ'],
    correctAnswer: '0 J',
    explanation: 'For an ideal gas, internal energy depends solely on temperature: U = f(T). In any isothermal process (constant T), ΔT = 0, therefore ΔU = 0 J.',
    whyIncorrect: {
      '5.7 kJ': 'This is the magnitude of the work done (w = -nRT ln(V2/V1)), not ΔU.',
      '-5.7 kJ': 'Work done during expansion, but ΔU is strictly zero.',
      '11.4 kJ': 'Doubled work value.'
    },
    subtopic: 'First & Second Laws'
  },
  {
    id: 'thm_q6',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Using Hess’s Law, calculate the enthalpy for: C(graphite) + 2H2(g) → CH4(g), given: C + O2 → CO2 (ΔH = -393.5 kJ), H2 + 1/2 O2 → H2O (ΔH = -285.8 kJ), and CH4 + 2O2 → CO2 + 2H2O (ΔH = -890.3 kJ):',
    options: ['-74.8 kJ/mol', '+74.8 kJ/mol', '-211.0 kJ/mol', '-1569.6 kJ/mol'],
    correctAnswer: '-74.8 kJ/mol',
    explanation: 'ΔH = ΔHf(CO2) + 2*ΔHf(H2O) - ΔHcomb(CH4) = -393.5 + 2*(-285.8) - (-890.3) = -965.1 + 890.3 = -74.8 kJ/mol.',
    whyIncorrect: {
      '+74.8 kJ/mol': 'Reversed signs in combustion formula.',
      '-211.0 kJ/mol': 'Forgot to multiply H2O enthalpy by 2.',
      '-1569.6 kJ/mol': 'Added all enthalpies without reversing methane combustion.'
    },
    subtopic: 'Enthalpy & Calorimetry'
  },
  {
    id: 'thm_q7',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Which of the following processes represents an increase in standard entropy (ΔS° > 0)?',
    options: ['CaCO3(s) → CaO(s) + CO2(g)', 'N2(g) + 3H2(g) → 2NH3(g)', 'H2O(l) → H2O(s)', '2SO2(g) + O2(g) → 2SO3(g)'],
    correctAnswer: 'CaCO3(s) → CaO(s) + CO2(g)',
    explanation: 'A solid decomposes into another solid and generates 1 mole of gas (Δng = +1). Formation of gas greatly increases positional disorder, so ΔS° > 0.',
    whyIncorrect: {
      'N2(g) + 3H2(g) → 2NH3(g)': '4 moles of gas convert into 2 moles of gas (Δng = -2, ΔS < 0).',
      'H2O(l) → H2O(s)': 'Freezing water creates an ordered crystal lattice (ΔS < 0).',
      '2SO2(g) + O2(g) → 2SO3(g)': '3 moles of gas condense into 2 moles of gas (ΔS < 0).'
    },
    subtopic: 'First & Second Laws'
  },
  {
    id: 'thm_q8',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'The equilibrium constant K for a reaction at 298 K is 1.0 × 10⁵. What is the standard Gibbs free energy change (ΔG°)? (R = 8.314 J/(mol·K))',
    options: ['-28.5 kJ/mol', '+28.5 kJ/mol', '-12.4 kJ/mol', '-57.0 kJ/mol'],
    correctAnswer: '-28.5 kJ/mol',
    explanation: 'ΔG° = -RT ln K = -8.314 * 298 * ln(10⁵) = -2477.57 * (5 * 2.303) = -2477.57 * 11.513 = -28,524 J/mol ≈ -28.5 kJ/mol.',
    whyIncorrect: {
      '+28.5 kJ/mol': 'Omitted the negative sign in ΔG° = -RT ln K.',
      '-12.4 kJ/mol': 'Used natural log without factor of 2.303.',
      '-57.0 kJ/mol': 'Doubled calculation.'
    },
    subtopic: 'Spontaneity & Gibbs Energy'
  },
  {
    id: 'thm_q9',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'For an adiabatic reversible expansion of an ideal gas, which relationship between pressure and volume holds true? (γ = Cp / Cv)',
    options: ['P * V^γ = constant', 'P * V = constant', 'T * V^γ = constant', 'P^γ * V = constant'],
    correctAnswer: 'P * V^γ = constant',
    explanation: 'In a reversible adiabatic process (dq = 0), integration of dU = dw yields P * V^γ = constant, and T * V^(γ-1) = constant.',
    whyIncorrect: {
      'P * V = constant': 'Boyle’s law for an isothermal process (constant temperature).',
      'T * V^γ = constant': 'Incorrect exponent; the correct relationship is T * V^(γ-1) = constant.',
      'P^γ * V = constant': 'Inverted exponent.'
    },
    subtopic: 'First & Second Laws'
  },
  {
    id: 'thm_q10',
    conceptId: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'What is the Third Law of Thermodynamics and its direct consequence?',
    options: ['The entropy of a perfectly crystalline substance approaches zero as temperature approaches absolute zero (0 K)', 'Energy cannot be created or destroyed', 'Entropy of an isolated universe always increases', 'Two bodies in thermal equilibrium with a third are in equilibrium with each other'],
    correctAnswer: 'The entropy of a perfectly crystalline substance approaches zero as temperature approaches absolute zero (0 K)',
    explanation: 'Formulated by Walther Nernst, the Third Law provides an absolute reference point for the determination of absolute entropies (S = 0 at T = 0 K for pure perfect crystals).',
    whyIncorrect: {
      'Energy cannot be created or destroyed': 'This is the First Law of Thermodynamics.',
      'Entropy of an isolated universe always increases': 'This is the Second Law of Thermodynamics.',
      'Two bodies in thermal equilibrium with a third': 'This is the Zeroth Law of Thermodynamics.'
    },
    subtopic: 'First & Second Laws'
  },

  // ==========================================
  // CONCEPT 7: CHEMICAL EQUILIBRIUM (10 questions)
  // ==========================================
  {
    id: 'eq_q1',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'What defines a state of dynamic chemical equilibrium in a reversible reaction?',
    options: ['Rate of forward reaction equals rate of reverse reaction', 'Concentrations of reactants and products must be exactly equal', 'Reaction has completely stopped occurring', 'Total moles of reactants must equal total moles of products'],
    correctAnswer: 'Rate of forward reaction equals rate of reverse reaction',
    explanation: 'Dynamic equilibrium occurs when forward and reverse reaction rates are identical, so macroscopic concentrations remain constant despite continuous molecular interconversions.',
    whyIncorrect: {
      'Concentrations of reactants and products must be exactly equal': 'Concentrations remain constant, but are rarely equal (governed by K).',
      'Reaction has completely stopped occurring': 'Dynamic equilibrium means reactions continue at equal rates in both directions.',
      'Total moles of reactants must equal products': 'Stoichiometry does not dictate equilibrium composition.'
    },
    subtopic: 'Homogeneous & Heterogeneous Equilibria'
  },
  {
    id: 'eq_q2',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'For the Haber process: N2(g) + 3H2(g) ⇌ 2NH3(g) (ΔH = -92 kJ/mol), what will increase the equilibrium yield of ammonia according to Le Chatelier’s principle?',
    options: ['Increasing total pressure and lowering temperature', 'Decreasing pressure and increasing temperature', 'Adding a catalyst at constant volume', 'Removing nitrogen gas continuously'],
    correctAnswer: 'Increasing total pressure and lowering temperature',
    explanation: 'Forward reaction is exothermic (lowering T shifts right) and reduces moles of gas from 4 to 2 (increasing pressure shifts to side with fewer gas molecules).',
    whyIncorrect: {
      'Decreasing pressure and increasing temperature': 'Shifts equilibrium to the left, favoring reactants.',
      'Adding a catalyst': 'Catalysts speed up both forward and reverse rates equally without changing equilibrium yield.',
      'Removing nitrogen gas': 'Shifts equilibrium left to replace depleted reactant.'
    },
    subtopic: 'Le Chatelier’s Shifts'
  },
  {
    id: 'eq_q3',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'What is the relationship between equilibrium constants Kp and Kc for a gas-phase reaction?',
    options: ['Kp = Kc * (RT)^Δn', 'Kc = Kp * (RT)^Δn', 'Kp = Kc / (RT)', 'Kp = Kc * Δn * R * T'],
    correctAnswer: 'Kp = Kc * (RT)^Δn',
    explanation: 'Kp = Kc(RT)^Δn, where Δn = (moles of gaseous products) - (moles of gaseous reactants). When Δn = 0, Kp = Kc.',
    whyIncorrect: {
      'Kc = Kp * (RT)^Δn': 'Inverted relationship.',
      'Kp = Kc / (RT)': 'Only holds when Δn = -1.',
      'Kp = Kc * Δn * R * T': 'Incorrect mathematical formula.'
    },
    subtopic: 'Homogeneous & Heterogeneous Equilibria'
  },
  {
    id: 'eq_q4',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'For the dissociation of solid calcium carbonate: CaCO3(s) ⇌ CaO(s) + CO2(g), what is the correct expression for Kc?',
    options: ['Kc = [CO2]', 'Kc = [CaO][CO2] / [CaCO3]', 'Kc = [CaO] / [CaCO3]', 'Kc = [CO2] / [CaCO3]'],
    correctAnswer: 'Kc = [CO2]',
    explanation: 'Pure solids have constant activity (activity = 1). Therefore, solid CaCO3 and solid CaO are omitted from the equilibrium expression, leaving Kc = [CO2].',
    whyIncorrect: {
      'Kc = [CaO][CO2] / [CaCO3]': 'Erroneously includes pure solid phases in concentration expression.',
      'Kc = [CaO] / [CaCO3]': 'Ignores the gaseous product entirely.',
      'Kc = [CO2] / [CaCO3]': 'Incorrectly retains solid reactant.'
    },
    subtopic: 'Homogeneous & Heterogeneous Equilibria'
  },
  {
    id: 'eq_q5',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'If the reaction quotient Q is greater than the equilibrium constant K (Q > K), what will occur in the reaction mixture?',
    options: ['The net reaction will shift to the left (toward reactants)', 'The net reaction will shift to the right (toward products)', 'The system is already at dynamic equilibrium', 'The value of K will automatically increase to match Q'],
    correctAnswer: 'The net reaction will shift to the left (toward reactants)',
    explanation: 'When Q > K, there is an excess of products relative to reactants compared to equilibrium. The net reaction proceeds in reverse to restore equilibrium.',
    whyIncorrect: {
      'Shift to the right': 'Occurs when Q < K (excess reactants).',
      'Already at equilibrium': 'Occurs only when Q = K.',
      'Value of K will increase': 'K is constant at fixed temperature; it does not adapt to arbitrary concentrations.'
    },
    subtopic: 'Le Chatelier’s Shifts'
  },
  {
    id: 'eq_q6',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'The equilibrium constant for: 2NO2(g) ⇌ N2O4(g) is K1. What is the equilibrium constant for: N2O4(g) ⇌ 2NO2(g)?',
    options: ['1 / K1', '√K1', 'K1²', '-K1'],
    correctAnswer: '1 / K1',
    explanation: 'Reversing a chemical equation inverts its equilibrium constant: K_reverse = 1 / K_forward.',
    whyIncorrect: {
      '√K1': 'Applies when coefficients are multiplied by 1/2.',
      'K1²': 'Applies when coefficients are doubled.',
      '-K1': 'Equilibrium constants are thermodynamic ratios and cannot be negative.'
    },
    subtopic: 'Homogeneous & Heterogeneous Equilibria'
  },
  {
    id: 'eq_q7',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'What is the expression for the solubility product (Ksp) of lead(II) iodide: PbI2(s) ⇌ Pb2+(aq) + 2I-(aq) in terms of molar solubility S?',
    options: ['4S³', 'S²', '2S²', '27S⁴'],
    correctAnswer: '4S³',
    explanation: '[Pb2+] = S, [I-] = 2S. Ksp = [Pb2+][I-]² = (S)(2S)² = S * 4S² = 4S³.',
    whyIncorrect: {
      'S²': 'Solubility product expression for 1:1 salts like AgCl.',
      '2S²': 'Forgetting to square the iodide stoichiometry factor.',
      '27S⁴': 'Solubility product expression for 1:3 salts like Al(OH)3.'
    },
    subtopic: 'Solubility Product (Ksp)'
  },
  {
    id: 'eq_q8',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'According to the van ’t Hoff equation, how does the equilibrium constant K of an endothermic reaction (ΔH° > 0) respond to an increase in temperature?',
    options: ['ln(K2/K1) > 0, so K increases with temperature', 'K decreases with temperature', 'K remains unchanged because ΔH° is independent of T', 'K fluctuates periodically'],
    correctAnswer: 'ln(K2/K1) > 0, so K increases with temperature',
    explanation: 'ln(K2/K1) = -(ΔH°/R) * (1/T2 - 1/T1) = (ΔH°/R) * (T2 - T1)/(T1*T2). For ΔH° > 0 and T2 > T1, the expression is positive, so K2 > K1.',
    whyIncorrect: {
      'K decreases with temperature': 'Occurs for exothermic reactions (ΔH° < 0).',
      'K remains unchanged': 'K is strongly temperature-dependent.',
      'K fluctuates periodically': 'Equilibrium constants vary monotonically with temperature.'
    },
    subtopic: 'Homogeneous & Heterogeneous Equilibria'
  },
  {
    id: 'eq_q9',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'If Ksp of AgCl is 1.8 × 10^-10, what is its solubility in a 0.10 M NaCl solution (Common Ion Effect)?',
    options: ['1.8 × 10^-9 M', '1.34 × 10^-5 M', '1.8 × 10^-11 M', '1.0 × 10^-7 M'],
    correctAnswer: '1.8 × 10^-9 M',
    explanation: '[Cl-] ≈ 0.10 M from fully dissociated NaCl. Ksp = [Ag+][Cl-] => 1.8 × 10^-10 = S * (0.10). S = 1.8 × 10^-9 M (drastically lower than in pure water: √1.8×10^-10 ≈ 1.34×10^-5 M).',
    whyIncorrect: {
      '1.34 × 10^-5 M': 'Solubility of AgCl in pure water without common ion.',
      '1.8 × 10^-11 M': 'Dividing by 10 instead of 0.10.',
      '1.0 × 10^-7 M': 'Neutral water ion product confusion.'
    },
    subtopic: 'Solubility Product (Ksp)'
  },
  {
    id: 'eq_q10',
    conceptId: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'In a 1.0 L vessel at 400 K, 2.0 mol of PCl5 is heated: PCl5(g) ⇌ PCl3(g) + Cl2(g). If degree of dissociation α = 0.5, what is Kc?',
    options: ['1.0 mol/L', '0.5 mol/L', '2.0 mol/L', '0.25 mol/L'],
    correctAnswer: '1.0 mol/L',
    explanation: 'Initial: [PCl5] = 2.0 M. At equilibrium: [PCl5] = 2.0*(1 - 0.5) = 1.0 M; [PCl3] = 2.0*0.5 = 1.0 M; [Cl2] = 2.0*0.5 = 1.0 M. Kc = [PCl3][Cl2] / [PCl5] = (1.0 * 1.0) / 1.0 = 1.0 mol/L.',
    whyIncorrect: {
      '0.5 mol/L': 'Used α instead of concentration products.',
      '2.0 mol/L': 'Neglected the denominator.',
      '0.25 mol/L': 'Squared degree of dissociation without molar multiplier.'
    },
    subtopic: 'Homogeneous & Heterogeneous Equilibria'
  },

  // ==========================================
  // CONCEPT 8: ACIDS & BASES (10 questions)
  // ==========================================
  {
    id: 'acb_q1',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'According to the Brønsted-Lowry definition, an acid is a substance that:',
    options: ['Donates a proton (H+)', 'Accepts a proton (H+)', 'Accepts an electron pair', 'Produces OH- ions in water'],
    correctAnswer: 'Donates a proton (H+)',
    explanation: 'Brønsted-Lowry defines acids as proton (H+) donors and bases as proton (H+) acceptors.',
    whyIncorrect: {
      'Accepts a proton (H+)': 'This is the Brønsted-Lowry definition of a base.',
      'Accepts an electron pair': 'This is the Lewis definition of an acid.',
      'Produces OH- ions in water': 'This is the Arrhenius definition of a base.'
    },
    subtopic: 'pH and pOH Scale'
  },
  {
    id: 'acb_q2',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'What is the pH of a 0.001 M (1.0 × 10^-3 M) solution of Hydrochloric Acid (HCl)?',
    options: ['3', '11', '1', '7'],
    correctAnswer: '3',
    explanation: 'HCl is a strong monoprotic acid that dissociates completely: [H+] = 10^-3 M. pH = -log[H+] = -log(10^-3) = 3.',
    whyIncorrect: {
      '11': '11 is the pOH of the solution (14 - 3 = 11).',
      '1': 'pH of a 0.1 M HCl solution.',
      '7': 'pH of neutral water.'
    },
    subtopic: 'pH and pOH Scale'
  },
  {
    id: 'acb_q3',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'What is the conjugate base of the bicarbonate ion (HCO3-)?',
    options: ['Carbonate ion (CO3^2-)', 'Carbonic acid (H2CO3)', 'Carbon dioxide (CO2)', 'Hydroxide ion (OH-)'],
    correctAnswer: 'Carbonate ion (CO3^2-)',
    explanation: 'To find a conjugate base, remove one proton (H+) from the acid: HCO3- - H+ = CO3^2-.',
    whyIncorrect: {
      'Carbonic acid (H2CO3)': 'H2CO3 is the conjugate acid of HCO3- (formed by adding H+).',
      'Carbon dioxide (CO2)': 'Anhydride of carbonic acid, not a conjugate base.',
      'Hydroxide ion (OH-)': 'Conjugate base of water.'
    },
    subtopic: 'pH and pOH Scale'
  },
  {
    id: 'acb_q4',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Which of the following mixtures forms an effective acidic buffer solution?',
    options: ['Acetic acid (CH3COOH) and Sodium acetate (CH3COONa)', 'Hydrochloric acid (HCl) and Sodium chloride (NaCl)', 'Sodium hydroxide (NaOH) and Sodium chloride (NaCl)', 'Sulfuric acid (H2SO4) and Sodium sulfate (Na2SO4)'],
    correctAnswer: 'Acetic acid (CH3COOH) and Sodium acetate (CH3COONa)',
    explanation: 'A buffer requires a weak acid and its conjugate base (salt with a strong base). CH3COOH is a weak acid and CH3COONa provides its conjugate base CH3COO-.',
    whyIncorrect: {
      'HCl and NaCl': 'Strong acid and neutral salt; cannot resist pH changes when base is added.',
      'NaOH and NaCl': 'Strong base; lacks weak acid buffer capacity.',
      'H2SO4 and Na2SO4': 'Strong acid; cannot function as a standard buffer.'
    },
    subtopic: 'Buffer Solutions'
  },
  {
    id: 'acb_q5',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'According to the Henderson-Hasselbalch equation, what is the pH of an equimolar buffer solution containing equal concentrations of weak acid HA and salt A-? (Ka = 1.0 × 10^-5)',
    options: ['5.0', '7.0', '9.0', '1.0'],
    correctAnswer: '5.0',
    explanation: 'pH = pKa + log([A-] / [HA]). Since [A-] = [HA], log(1) = 0. Therefore pH = pKa = -log(10^-5) = 5.0.',
    whyIncorrect: {
      '7.0': 'Neutral pH of water.',
      '9.0': 'pKb equivalent (14 - 5).',
      '1.0': 'Strong acid pH.'
    },
    subtopic: 'Buffer Solutions'
  },
  {
    id: 'acb_q6',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Which substance acts as a Lewis acid in the reaction: BF3 + NH3 → F3B-NH3?',
    options: ['Boron trifluoride (BF3)', 'Ammonia (NH3)', 'Both BF3 and NH3', 'Neither, it is a redox reaction'],
    correctAnswer: 'Boron trifluoride (BF3)',
    explanation: 'BF3 has an incomplete octet (6 valence electrons around boron) and accepts an electron pair from ammonia, acting as a Lewis acid. NH3 donates its lone pair, acting as a Lewis base.',
    whyIncorrect: {
      'Ammonia (NH3)': 'NH3 has a lone pair and acts as a Lewis base.',
      'Both BF3 and NH3': 'One is the electron acceptor (acid) and one is the donor (base).',
      'Neither': 'This is a classical Lewis acid-base adduct formation, not a redox reaction.'
    },
    subtopic: 'pH and pOH Scale'
  },
  {
    id: 'acb_q7',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'At the equivalence point in the titration of a weak acid (CH3COOH) with a strong base (NaOH), why is the pH greater than 7?',
    options: ['The conjugate base (CH3COO-) undergoes hydrolysis in water producing OH- ions', 'Excess NaOH remains unreacted', 'CH3COOH is volatile and evaporates during titration', 'The salt formed is insoluble'],
    correctAnswer: 'The conjugate base (CH3COO-) undergoes hydrolysis in water producing OH- ions',
    explanation: 'At equivalence point, all acetic acid is converted into CH3COONa. Acetate anion hydrolyzes: CH3COO- + H2O ⇌ CH3COOH + OH-, producing a basic solution (pH ~8.7).',
    whyIncorrect: {
      'Excess NaOH remains unreacted': 'At equivalence point, stoichiometric amounts of acid and base have reacted.',
      'CH3COOH is volatile': 'Evaporation does not account for equivalence point basicity.',
      'The salt formed is insoluble': 'Sodium acetate is completely soluble in water.'
    },
    subtopic: 'Acid-Base Titration Curves'
  },
  {
    id: 'acb_q8',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'What is the pH of an extremely dilute 1.0 × 10^-8 M solution of Hydrochloric Acid (HCl) at 25 °C?',
    options: ['6.98 (slightly acidic, taking autoionization of water into account)', '8.00 (basic)', '7.00 (neutral)', '2.00'],
    correctAnswer: '6.98 (slightly acidic, taking autoionization of water into account)',
    explanation: 'Adding acid to water can never make it basic (pH cannot be 8). Total [H+] = [H+]acid + [H+]water. Set [H+] = (10^-8 + x), where (10^-8 + x)(x) = 1.0 × 10^-14. Solving quadratic gives [H+] = 1.05 × 10^-7 M, pH = -log(1.05 × 10^-7) ≈ 6.98.',
    whyIncorrect: {
      '8.00': 'Common beginner mistake (-log(10^-8) = 8). An acid solution cannot be alkaline.',
      '7.00': 'Acid addition lowers pH below 7.00.',
      '2.00': 'Severe power-of-ten calculation error.'
    },
    subtopic: 'pH and pOH Scale'
  },
  {
    id: 'acb_q9',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'Why is trichloroacetic acid (CCl3COOH) a much stronger acid than acetic acid (CH3COOH)?',
    options: ['Three electronegative Cl atoms exert a powerful -I (electron-withdrawing) inductive effect that stabilizes the carboxylate anion', 'CCl3COOH contains more hydrogen atoms', 'Chlorine atoms form covalent bonds with water', 'CH3COOH is an inorganic mineral acid'],
    correctAnswer: 'Three electronegative Cl atoms exert a powerful -I (electron-withdrawing) inductive effect that stabilizes the carboxylate anion',
    explanation: 'The three electronegative chlorine atoms pull electron density away from the carboxylate group, dispersing negative charge and stabilizing the conjugate base CCl3COO- (pKa = 0.65 vs 4.76 for acetic acid).',
    whyIncorrect: {
      'CCl3COOH contains more hydrogen atoms': 'CCl3COOH has only 1 H atom, while CH3COOH has 4.',
      'Chlorine atoms form covalent bonds with water': 'Chlorine atoms remain attached to carbon.',
      'CH3COOH is an inorganic mineral acid': 'Acetic acid is an organic carboxylic acid.'
    },
    subtopic: 'Buffer Solutions'
  },
  {
    id: 'acb_q10',
    conceptId: 'acids_and_bases',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'What is the pH range and color transition of Phenolphthalein indicator in aqueous solution?',
    options: ['pH 8.2 to 10.0 (colorless to vibrant pink/fuchsia)', 'pH 3.1 to 4.4 (red to yellow)', 'pH 6.0 to 7.6 (yellow to blue)', 'pH 1.2 to 2.8 (red to yellow)'],
    correctAnswer: 'pH 8.2 to 10.0 (colorless to vibrant pink/fuchsia)',
    explanation: 'Phenolphthalein is colorless in acidic solutions and turns pink/fuchsia in basic solutions between pH 8.2 and 10.0 due to conjugation changes in the quinoid ring structure.',
    whyIncorrect: {
      'pH 3.1 to 4.4': 'This is Methyl Orange indicator range.',
      'pH 6.0 to 7.6': 'This is Bromothymol Blue indicator range.',
      'pH 1.2 to 2.8': 'This is Thymol Blue (acid range).'
    },
    subtopic: 'Acid-Base Titration Curves'
  },

  // ==========================================
  // CONCEPT 9: ELECTROCHEMISTRY (10 questions)
  // ==========================================
  {
    id: 'elc_q1',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'In any electrochemical cell, oxidation always takes place at which electrode?',
    options: ['Anode', 'Cathode', 'Salt bridge', 'External potentiometer'],
    correctAnswer: 'Anode',
    explanation: 'Remember the mnemonic "An Ox, Red Cat": Oxidation always occurs at the Anode, and Reduction always occurs at the Cathode.',
    whyIncorrect: {
      'Cathode': 'Reduction always occurs at the cathode.',
      'Salt bridge': 'Maintains electrical neutrality by migrating ions; no redox occurs here.',
      'External potentiometer': 'Measures cell potential without conducting redox reactions.'
    },
    subtopic: 'Galvanic Cells & EMF'
  },
  {
    id: 'elc_q2',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'What is the standard reduction potential of the Standard Hydrogen Electrode (SHE) by international agreement?',
    options: ['0.00 V', '1.00 V', '-0.76 V', '+0.34 V'],
    correctAnswer: '0.00 V',
    explanation: 'The Standard Hydrogen Electrode: 2H+(aq, 1 M) + 2e- ⇌ H2(g, 1 bar) at platinum electrode is assigned an arbitrary potential of E° = 0.00 V at all temperatures.',
    whyIncorrect: {
      '1.00 V': 'Arbitrary round number.',
      '-0.76 V': 'Standard reduction potential of Zn2+/Zn couple.',
      '+0.34 V': 'Standard reduction potential of Cu2+/Cu couple.'
    },
    subtopic: 'Galvanic Cells & EMF'
  },
  {
    id: 'elc_q3',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'According to Faraday’s First Law of Electrolysis, the mass (m) of a substance liberated at an electrode is proportional to:',
    options: ['Total electrical charge (Q = I * t) passed through the cell', 'Current squared (I²)', 'Temperature of the electrolyte', 'Volume of the electrode'],
    correctAnswer: 'Total electrical charge (Q = I * t) passed through the cell',
    explanation: 'Faraday’s First Law states m = Z * Q = Z * I * t, where Z is the electrochemical equivalent and Q is charge in Coulombs.',
    whyIncorrect: {
      'Current squared': 'Joule heating is proportional to I², but not electrolysis mass.',
      'Temperature': 'Temperature affects conductivity, but mass deposited depends on charge.',
      'Volume of the electrode': 'Mass depends on electron quantity passed, not physical electrode size.'
    },
    subtopic: 'Electrolysis & Faraday’s Laws'
  },
  {
    id: 'elc_q4',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'What is the standard EMF (E°cell) of the Daniell cell: Zn(s) + Cu2+(aq) → Zn2+(aq) + Cu(s)? (Given: E°(Cu2+/Cu) = +0.34 V, E°(Zn2+/Zn) = -0.76 V)',
    options: ['+1.10 V', '-0.42 V', '+0.42 V', '-1.10 V'],
    correctAnswer: '+1.10 V',
    explanation: 'E°cell = E°cathode - E°anode = E°(Cu2+/Cu) - E°(Zn2+/Zn) = +0.34 V - (-0.76 V) = +1.10 V.',
    whyIncorrect: {
      '-0.42 V': 'Subtraction error (+0.34 - 0.76).',
      '+0.42 V': 'Inverted arithmetic.',
      '-1.10 V': 'Reversing the spontaneous cell flow.'
    },
    subtopic: 'Galvanic Cells & EMF'
  },
  {
    id: 'elc_q5',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'What is the function of the salt bridge containing inert electrolyte (e.g., agar-agar with KCl or KNO3) in a galvanic cell?',
    options: ['Completes electrical circuit and maintains electrical neutrality in half-cells without mixing solutions', 'Accelerates electron transfer through the external wire', 'Provides electrical resistance to stop current', 'Generates standard voltage through nuclear decay'],
    correctAnswer: 'Completes electrical circuit and maintains electrical neutrality in half-cells without mixing solutions',
    explanation: 'Anions migrate to the anode compartment and cations migrate to the cathode compartment, preventing liquid junction charge accumulation that would otherwise halt cell EMF.',
    whyIncorrect: {
      'Accelerates electron transfer through external wire': 'Electrons flow only through the metallic wire, not the salt bridge.',
      'Provides electrical resistance': 'Salt bridge minimizes internal resistance.',
      'Generates voltage through nuclear decay': 'No nuclear reactions occur in electrochemical cells.'
    },
    subtopic: 'Galvanic Cells & EMF'
  },
  {
    id: 'elc_q6',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'How many Faradays of electrical charge are required to electroplate 1 mole of Aluminum from molten Al2O3?',
    options: ['3 Faradays', '1 Faraday', '2 Faradays', '6 Faradays'],
    correctAnswer: '3 Faradays',
    explanation: 'The reduction half-reaction is: Al3+ + 3e- → Al(s). 1 mole of Al requires 3 moles of electrons, which equals exactly 3 Faradays (3 × 96,485 Coulombs).',
    whyIncorrect: {
      '1 Faraday': 'Would deposit only 1/3 mole of Aluminum.',
      '2 Faradays': 'Deposits 1 mole of divalent metal like Cu2+ or Mg2+.',
      '6 Faradays': 'Charge needed to reduce 1 mole of Al2O3 (which contains 2 moles of Al).'
    },
    subtopic: 'Electrolysis & Faraday’s Laws'
  },
  {
    id: 'elc_q7',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'What is the relationship between standard cell potential E°cell and standard Gibbs free energy change ΔG°?',
    options: ['ΔG° = -nFE°cell', 'ΔG° = nFE°cell', 'ΔG° = -RT ln(E°cell)', 'E°cell = -nFΔG°'],
    correctAnswer: 'ΔG° = -nFE°cell',
    explanation: 'ΔG° = -nFE°cell, where n is moles of electrons transferred and F is Faraday’s constant (~96,485 C/mol). Positive E°cell produces negative ΔG° (spontaneous).',
    whyIncorrect: {
      'ΔG° = nFE°cell': 'Missing the essential negative sign representing thermodynamic spontaneity.',
      'ΔG° = -RT ln(E°cell)': 'Incorrect formula; ΔG° = -RT ln K.',
      'E°cell = -nFΔG°': 'Inverted algebraic terms.'
    },
    subtopic: 'Galvanic Cells & EMF'
  },
  {
    id: 'elc_q8',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'Using the Nernst equation at 298 K, what is the EMF of the cell: Zn | Zn2+(0.01 M) || Cu2+(1.0 M) | Cu? (E°cell = 1.10 V)',
    options: ['1.159 V', '1.041 V', '1.100 V', '1.218 V'],
    correctAnswer: '1.159 V',
    explanation: 'Ecell = E°cell - (0.0591 / n) * log([Zn2+] / [Cu2+]) = 1.10 - (0.0591 / 2) * log(0.01 / 1.0) = 1.10 - (0.02955) * (-2) = 1.10 + 0.0591 = 1.1591 V.',
    whyIncorrect: {
      '1.041 V': 'Subtracted instead of adding the logarithmic term: 1.10 - 0.0591 = 1.041 V.',
      '1.100 V': 'Standard potential at 1.0 M, ignoring concentration effect.',
      '1.218 V': 'Used n = 1 instead of n = 2 in the denominator.'
    },
    subtopic: 'Nernst Equation Calculations'
  },
  {
    id: 'elc_q9',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'According to Kohlrausch’s Law of Independent Migration of Ions, the limiting molar conductivity (Λ°m) of BaCl2 is equal to:',
    options: ['λ°(Ba2+) + 2 * λ°(Cl-)', 'λ°(Ba2+) + λ°(Cl-)', '2 * λ°(Ba2+) + λ°(Cl-)', 'λ°(Ba2+) * λ°(Cl-)'],
    correctAnswer: 'λ°(Ba2+) + 2 * λ°(Cl-)',
    explanation: 'Kohlrausch’s law states Λ°m = ν+ * λ°+ + ν- * λ°-. For BaCl2, ν+ = 1 and ν- = 2, so Λ°m = λ°(Ba2+) + 2 * λ°(Cl-).',
    whyIncorrect: {
      'λ°(Ba2+) + λ°(Cl-)': 'Fails to account for 2 chloride ions per formula unit.',
      '2 * λ°(Ba2+) + λ°(Cl-)': 'Inverted stoichiometric coefficients.',
      'Product form': 'Conductivities are additive, not multiplicative.'
    },
    subtopic: 'Galvanic Cells & EMF'
  },
  {
    id: 'elc_q10',
    conceptId: 'electrochemistry',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'In the electrolysis of concentrated aqueous Sodium Chloride (brine) using inert electrodes, why is chlorine gas (Cl2) produced at the anode instead of oxygen (O2), despite O2 having a lower standard oxidation potential?',
    options: ['High overpotential (overvoltage) for oxygen evolution on the electrode makes chlorine oxidation kinetically faster', 'Chlorine is more electronegative than oxygen', 'Water cannot be oxidized electrochemically', 'Sodium ions reduce chlorine gas at the anode'],
    correctAnswer: 'High overpotential (overvoltage) for oxygen evolution on the electrode makes chlorine oxidation kinetically faster',
    explanation: 'Thermally, oxidation of water to O2 is favored (E° = -1.23 V vs -1.36 V for Cl2). However, the complex 4-electron oxidation of water has a high activation energy (overpotential ~0.4 V), allowing Cl2 formation to dominate kinetically.',
    whyIncorrect: {
      'Chlorine is more electronegative than oxygen': 'False; Oxygen is more electronegative than Chlorine.',
      'Water cannot be oxidized electrochemically': 'Water is oxidized in dilute NaCl solutions.',
      'Sodium ions reduce chlorine gas': 'Sodium ions are spectators at the anode and migrate to the cathode.'
    },
    subtopic: 'Electrolysis & Faraday’s Laws'
  },

  // ==========================================
  // CONCEPT 10: ORGANIC CHEMISTRY (10 questions)
  // ==========================================
  {
    id: 'org_q1',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'What is the IUPAC systematic name for CH3-CH(CH3)-CH2-CH3?',
    options: ['2-Methylbutane', 'Isopentane', '3-Methylbutane', 'Dimethylpropane'],
    correctAnswer: '2-Methylbutane',
    explanation: 'The longest continuous carbon chain has 4 carbons (butane). Numbering from the end closest to the branch assigns the methyl group to carbon-2: 2-methylbutane.',
    whyIncorrect: {
      'Isopentane': 'Common trivial name, not the systematic IUPAC nomenclature.',
      '3-Methylbutane': 'Violates IUPAC rule of lowest locant numbering.',
      'Dimethylpropane': 'Constitutional isomer (neopentane).'
    },
    subtopic: 'Hydrocarbons & Functional Groups'
  },
  {
    id: 'org_q2',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'Which functional group is present in aldehydes?',
    options: ['-CHO (formyl group)', '-COOH (carboxyl group)', '-OH (hydroxyl group)', '-CO- (ketone group)'],
    correctAnswer: '-CHO (formyl group)',
    explanation: 'Aldehydes contain a terminal carbonyl bonded to at least one hydrogen atom (-CH=O or -CHO).',
    whyIncorrect: {
      '-COOH': 'Carboxylic acid functional group.',
      '-OH': 'Alcohol functional group.',
      '-CO-': 'Ketone internal carbonyl group.'
    },
    subtopic: 'Hydrocarbons & Functional Groups'
  },
  {
    id: 'org_q3',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'Hydrocarbons containing only single carbon-carbon bonds and having general formula CnH2n+2 are called:',
    options: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatics'],
    correctAnswer: 'Alkanes',
    explanation: 'Saturated acyclic hydrocarbons with single bonds conform to CnH2n+2 and are known as alkanes (or paraffins).',
    whyIncorrect: {
      'Alkenes': 'Unsaturated hydrocarbons with double bonds (CnH2n).',
      'Alkynes': 'Unsaturated hydrocarbons with triple bonds (CnH2n-2).',
      'Aromatics': 'Conjugated planar cyclic systems (e.g., C6H6).'
    },
    subtopic: 'Hydrocarbons & Functional Groups'
  },
  {
    id: 'org_q4',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'What is the relative order of carbocation stability in organic reaction intermediates?',
    options: ['3° (tertiary) > 2° (secondary) > 1° (primary) > Methyl', 'Methyl > 1° > 2° > 3°', '1° > 2° > 3° > Methyl', 'All carbocations have identical stability'],
    correctAnswer: '3° (tertiary) > 2° (secondary) > 1° (primary) > Methyl',
    explanation: 'Carbocation stability increases with alkyl substitution due to hyperconjugation (C-H σ-bond overlap with empty p-orbital) and +I inductive electron donation.',
    whyIncorrect: {
      'Methyl > 1° > 2° > 3°': 'This is the order of SN2 reactivity due to steric hindrance, not carbocation stability.',
      '1° > 2° > 3° > Methyl': 'Reversed order.',
      'Identical stability': 'Substituents heavily dictate carbocation energy.'
    },
    subtopic: 'Reaction Mechanisms'
  },
  {
    id: 'org_q5',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Which test distinguishes an aldehyde from a ketone using ammoniacal silver nitrate solution (forming a silver mirror)?',
    options: ['Tollens’ Test', 'Fehling’s Test', 'Lucas Test', 'Iodoform Test'],
    correctAnswer: 'Tollens’ Test',
    explanation: 'Tollens’ reagent [Ag(NH3)2]+ oxidizes aldehydes to carboxylates while reducing Ag+ to metallic silver, forming a characteristic silver mirror on the glass wall. Ketones do not react.',
    whyIncorrect: {
      'Fehling’s Test': 'Produces a red Cu2O precipitate with aliphatic aldehydes.',
      'Lucas Test': 'Distinguishes 1°, 2°, and 3° alcohols using ZnCl2 / HCl.',
      'Iodoform Test': 'Identifies methyl ketones and methyl carbinols using I2 / NaOH.'
    },
    subtopic: 'Hydrocarbons & Functional Groups'
  },
  {
    id: 'org_q6',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'According to Zaitsev’s (Saytzeff’s) Rule, what is the major alkene product during base-induced dehydrohalogenation of 2-bromobutane?',
    options: ['But-2-ene (more substituted alkene)', 'But-1-ene (less substituted alkene)', 'Cyclobutane', '2-Butanol'],
    correctAnswer: 'But-2-ene (more substituted alkene)',
    explanation: 'Zaitsev’s rule states that elimination yields the more thermodynamically stable, more highly substituted alkene (but-2-ene with 2 alkyl substituents vs but-1-ene with 1).',
    whyIncorrect: {
      'But-1-ene': 'Hofmann minor elimination product under unhindered base conditions.',
      'Cyclobutane': 'Cyclization is not favored.',
      '2-Butanol': 'Product of substitution, not elimination.'
    },
    subtopic: 'Reaction Mechanisms'
  },
  {
    id: 'org_q7',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Molecules that are non-superimposable mirror images of each other and rotate plane-polarized light in opposite directions are termed:',
    options: ['Enantiomers', 'Diastereomers', 'Constitutional isomers', 'Conformers'],
    correctAnswer: 'Enantiomers',
    explanation: 'Enantiomers are chiral stereoisomers that are non-superimposable mirror images and have identical physical properties except for the direction of optical rotation.',
    whyIncorrect: {
      'Diastereomers': 'Stereoisomers that are not mirror images of each other.',
      'Constitutional isomers': 'Molecules with the same molecular formula but different atom connectivities.',
      'Conformers': 'Spatial arrangements interconvertible by rotation around single bonds.'
    },
    subtopic: 'Stereochemistry & Chirality'
  },
  {
    id: 'org_q8',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'According to Hückel’s Rule, a monocyclic planar conjugated ring system exhibits aromatic stability if it contains:',
    options: ['(4n + 2) π-electrons, where n is a non-negative integer (0, 1, 2...)', '4n π-electrons', '(2n + 2) π-electrons', 'Any odd number of π-electrons'],
    correctAnswer: '(4n + 2) π-electrons, where n is a non-negative integer (0, 1, 2...)',
    explanation: 'Hückel’s rule requires (4n + 2) delocalized π-electrons (e.g., 2, 6, 10, 14 π-electrons). For benzene, n = 1 gives 6 π-electrons.',
    whyIncorrect: {
      '4n π-electrons': 'Describes antiaromatic systems (e.g., cyclobutadiene, 4 π-electrons), which are exceptionally unstable.',
      '(2n + 2) π-electrons': 'Incorrect formula.',
      'Any odd number': 'Unpaired radical electrons, not closed-shell aromatic systems.'
    },
    subtopic: 'Hydrocarbons & Functional Groups'
  },
  {
    id: 'org_q9',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'Why does an SN1 substitution reaction of an optically active chiral tertiary alkyl halide result in partial or full racemization?',
    options: ['The carbocation intermediate is sp2-hybridized and planar, allowing nucleophilic attack with equal probability from top or bottom faces', 'The nucleophile can only attack from the rear', 'Optical activity is destroyed by boiling', 'The product forms a covalent polymer'],
    correctAnswer: 'The carbocation intermediate is sp2-hybridized and planar, allowing nucleophilic attack with equal probability from top or bottom faces',
    explanation: 'The loss of the leaving group generates a flat, achiral planar carbocation (sp2). Attack from the front face retains configuration, while attack from the back face inverts it, resulting in a racemic mixture (50:50).',
    whyIncorrect: {
      'The nucleophile can only attack from the rear': 'Characteristic of SN2 bimolecular substitution, causing 100% inversion (Walden inversion).',
      'Optical activity destroyed by boiling': 'Incorrect; stereochemical racemization occurs during reaction.',
      'Forms a covalent polymer': 'SN1 yields monomeric substituted products.'
    },
    subtopic: 'Reaction Mechanisms'
  },
  {
    id: 'org_q10',
    conceptId: 'organic_chemistry',
    topic: 'Organic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'In the Aldol condensation of acetaldehyde (CH3CHO) in dilute NaOH, what is the sequence of fundamental mechanistic steps?',
    options: ['Deprotonation of α-hydrogen → enolate nucleophilic addition to carbonyl carbon → protonation to β-hydroxyaldehyde (aldol) → dehydration to α,β-unsaturated aldehyde', 'Electrophilic addition → hydride shift → esterification', 'Decarboxylation → radical dimerization → hydrolysis', 'Epoxidation → ring opening → elimination'],
    correctAnswer: 'Deprotonation of α-hydrogen → enolate nucleophilic addition to carbonyl carbon → protonation to β-hydroxyaldehyde (aldol) → dehydration to α,β-unsaturated aldehyde',
    explanation: 'Base removes an acidic α-H forming a resonance-stabilized enolate. The enolate attacks the electrophilic carbonyl of a second acetaldehyde molecule, yielding a β-hydroxyaldehyde (aldol), which undergoes E1cB elimination to crotonaldehyde.',
    whyIncorrect: {
      'Electrophilic addition → hydride shift': 'Aldol is nucleophilic addition via enolates.',
      'Decarboxylation': 'No carboxylic acid is present.',
      'Epoxidation': 'Requires peracids (mCPBA), not aqueous base.'
    },
    subtopic: 'Reaction Mechanisms'
  }
];
