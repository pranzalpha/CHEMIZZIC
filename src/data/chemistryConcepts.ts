/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChemistryConcept {
  id: string;
  name: string;
  category: 'Physical' | 'Inorganic' | 'Organic';
  description: string;
  prerequisites: string[]; // Concept IDs
  keyFormulasAndRules?: string[];
  subtopics: string[];
}

export const CHEMISTRY_CONCEPTS: ChemistryConcept[] = [
  {
    id: 'atomic_structure',
    name: 'Atomic Structure',
    category: 'Physical',
    description: 'Bohr model, subatomic particles, isotopes, and Rutherford alpha scattering.',
    prerequisites: [],
    keyFormulasAndRules: ['E = -13.6 eV * (Z²/n²)', 'c = λ * ν', 'mvr = nh / 2π'],
    subtopics: ['Rutherford & Bohr Models', 'Isotopes & Isobars', 'Electromagnetic Spectrum']
  },
  {
    id: 'quantum_numbers',
    name: 'Quantum Numbers',
    category: 'Physical',
    description: 'Principal (n), azimuthal (l), magnetic (ml), and spin (ms) quantum numbers and orbital shapes.',
    prerequisites: ['atomic_structure'],
    keyFormulasAndRules: ['l = 0 to (n-1)', 'ml = -l to +l', 'Pauli Exclusion Principle', 'Hund’s Rule'],
    subtopics: ['Orbital Shapes (s, p, d, f)', 'Aufbau Principle', 'Electronic Configurations']
  },
  {
    id: 'periodic_properties',
    name: 'Periodic Properties',
    category: 'Inorganic',
    description: 'Periodic trends in ionization energy, electron affinity, electronegativity, and atomic radii.',
    prerequisites: ['atomic_structure', 'quantum_numbers'],
    keyFormulasAndRules: ['Effective Nuclear Charge Zeff = Z - S', 'Slater’s Rules'],
    subtopics: ['Ionization Enthalpy', 'Electronegativity Scales', 'Atomic & Ionic Radii']
  },
  {
    id: 'chemical_bonding',
    name: 'Chemical Bonding',
    category: 'Inorganic',
    description: 'Ionic, covalent, coordinate bonds, Lewis structures, lattice energy, and formal charge.',
    prerequisites: ['periodic_properties'],
    keyFormulasAndRules: ['Born-Haber Cycle', 'Formal Charge = V - N - B/2', 'Octet Rule Exceptions'],
    subtopics: ['Ionic vs Covalent', 'Lewis Dot Structures', 'Lattice Energy']
  },
  {
    id: 'molecular_structure',
    name: 'Molecular Structure',
    category: 'Physical',
    description: 'VSEPR geometry, orbital hybridization (sp, sp2, sp3, dsp2), and molecular polarity.',
    prerequisites: ['chemical_bonding'],
    keyFormulasAndRules: ['Steric Number = Bond Pairs + Lone Pairs', 'Dipole Moment μ = q * d'],
    subtopics: ['VSEPR Geometry', 'Hybridization Schemes', 'Dipole Moments & Polarity']
  },
  {
    id: 'thermodynamics',
    name: 'Thermodynamics',
    category: 'Physical',
    description: 'Enthalpy (ΔH), entropy (ΔS), Gibbs free energy (ΔG), Hess’s Law, and spontaneity.',
    prerequisites: ['atomic_structure'],
    keyFormulasAndRules: ['ΔG = ΔH - TΔS', 'ΔU = q + w', 'Hess’s Law ΣΔH(products) - ΣΔH(reactants)'],
    subtopics: ['First & Second Laws', 'Enthalpy & Calorimetry', 'Spontaneity & Gibbs Energy']
  },
  {
    id: 'chemical_equilibrium',
    name: 'Chemical Equilibrium',
    category: 'Physical',
    description: 'Equilibrium constants (Kc, Kp), Le Chatelier’s principle, and reaction quotient (Q).',
    prerequisites: ['thermodynamics'],
    keyFormulasAndRules: ['Kp = Kc(RT)^Δn', 'ΔG° = -RT ln K', 'Q vs K directionality'],
    subtopics: ['Le Chatelier’s Shifts', 'Homogeneous & Heterogeneous Equilibria', 'Solubility Product (Ksp)']
  },
  {
    id: 'acids_and_bases',
    name: 'Acids & Bases',
    category: 'Inorganic',
    description: 'Arrhenius, Brønsted-Lowry, Lewis theories, pH calculations, buffer solutions, and titrations.',
    prerequisites: ['chemical_equilibrium'],
    keyFormulasAndRules: ['pH = -log[H+]', 'pH + pOH = 14', 'Henderson-Hasselbalch: pH = pKa + log([A-]/[HA])'],
    subtopics: ['pH and pOH Scale', 'Buffer Solutions', 'Acid-Base Titration Curves']
  },
  {
    id: 'electrochemistry',
    name: 'Electrochemistry',
    category: 'Physical',
    description: 'Galvanic and electrolytic cells, standard reduction potentials, Nernst equation, and Faraday’s laws.',
    prerequisites: ['thermodynamics', 'chemical_equilibrium'],
    keyFormulasAndRules: ['Ecell = E°cell - (0.0591/n) log Q', 'ΔG° = -nFE°cell', 'Faraday: m = (Q * M) / (n * F)'],
    subtopics: ['Galvanic Cells & EMF', 'Nernst Equation Calculations', 'Electrolysis & Faraday’s Laws']
  },
  {
    id: 'organic_chemistry',
    name: 'Organic Chemistry',
    category: 'Organic',
    description: 'IUPAC nomenclature, isomerism, reaction mechanisms (SN1, SN2, E1, E2), and functional groups.',
    prerequisites: ['chemical_bonding', 'molecular_structure'],
    keyFormulasAndRules: ['Markovnikov’s Rule', 'Zaitsev’s Rule', 'Carbocation Stability 3° > 2° > 1°'],
    subtopics: ['Hydrocarbons & Functional Groups', 'Reaction Mechanisms', 'Stereochemistry & Chirality']
  }
];

export interface AdaptiveQuestion {
  id: string;
  conceptId: string;
  secondaryConcepts?: string[];
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numericalDifficulty: number; // 1 to 10
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  whyIncorrect: Record<string, string>; // Explanations for why specific wrong options are flawed
  prerequisiteConcept?: string;
  subtopic?: string;
}

import { EXPANDED_100_CHEMISTRY_QUESTIONS } from './expanded100Questions';

export const ADAPTIVE_QUESTIONS_BANK: AdaptiveQuestion[] = [
  ...EXPANDED_100_CHEMISTRY_QUESTIONS,
  // --- ATOMIC STRUCTURE ---
  {
    id: 'q_atom_1',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'Which subatomic particle has a negative charge and negligible mass relative to a proton?',
    options: ['Electron', 'Proton', 'Neutron', 'Positron'],
    correctAnswer: 'Electron',
    explanation: 'Electrons possess a relative charge of -1 and have a mass of approximately 1/1836 of a proton.',
    whyIncorrect: {
      'Proton': 'Protons carry a positive charge (+1) and a relative atomic mass of ~1 amu.',
      'Neutron': 'Neutrons are electrically neutral and possess a mass similar to protons (~1 amu).',
      'Positron': 'A positron is an antimatter particle with a positive charge (+1).'
    },
    subtopic: 'Rutherford & Bohr Models'
  },
  {
    id: 'q_atom_2',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Two atoms having the same number of protons but different numbers of neutrons are termed:',
    options: ['Isotopes', 'Isobars', 'Isotones', 'Isomers'],
    correctAnswer: 'Isotopes',
    explanation: 'Isotopes share the same atomic number (Z, number of protons) but differ in mass number (A, neutrons + protons), such as Carbon-12 and Carbon-14.',
    whyIncorrect: {
      'Isobars': 'Isobars have identical mass numbers (A) but different atomic numbers (Z).',
      'Isotones': 'Isotones share the same number of neutrons but have different numbers of protons.',
      'Isomers': 'Isomers are molecules with identical molecular formulas but different structural arrangements.'
    },
    subtopic: 'Isotopes & Isobars'
  },
  {
    id: 'q_atom_3',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'What is the wavelength of radiation emitted when an electron in a hydrogen atom transitions from n = 3 to n = 2 (Balmer series)? [RH ≈ 1.097 × 10⁷ m⁻¹]',
    options: ['656 nm', '486 nm', '434 nm', '121 nm'],
    correctAnswer: '656 nm',
    explanation: 'Using the Rydberg equation: 1/λ = RH * (1/2² - 1/3²) = RH * (5/36). Solving gives λ ≈ 656.3 nm (H-alpha red emission line in the visible spectrum).',
    whyIncorrect: {
      '486 nm': '486 nm is the H-beta transition line corresponding to n = 4 to n = 2.',
      '434 nm': '434 nm is the H-gamma transition from n = 5 to n = 2.',
      '121 nm': '121 nm belongs to the ultraviolet Lyman series (n = 2 to n = 1).'
    },
    subtopic: 'Rutherford & Bohr Models'
  },

  // --- QUANTUM NUMBERS ---
  {
    id: 'q_quant_1',
    conceptId: 'quantum_numbers',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'What is the maximum number of electrons that can occupy a single atomic orbital according to the Pauli Exclusion Principle?',
    options: ['2', '6', '10', '14'],
    correctAnswer: '2',
    explanation: 'The Pauli Exclusion Principle dictates that no two electrons in an atom can have identical quantum numbers. An orbital can hold at most 2 electrons with opposite spins (+1/2 and -1/2).',
    whyIncorrect: {
      '6': '6 is the maximum capacity of a complete p-subshell (3 orbitals * 2).',
      '10': '10 is the capacity of a d-subshell (5 orbitals * 2).',
      '14': '14 is the capacity of an f-subshell (7 orbitals * 2).'
    },
    subtopic: 'Aufbau Principle'
  },
  {
    id: 'q_quant_2',
    conceptId: 'quantum_numbers',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Which quantum number determines the orientation of an orbital in three-dimensional space?',
    options: ['Magnetic quantum number (ml)', 'Principal quantum number (n)', 'Azimuthal quantum number (l)', 'Spin quantum number (ms)'],
    correctAnswer: 'Magnetic quantum number (ml)',
    explanation: 'The magnetic quantum number (ml) ranges from -l to +l and specifies the spatial orientation of the orbital in space relative to an external magnetic field.',
    whyIncorrect: {
      'Principal quantum number (n)': 'The principal quantum number determines energy level and principal shell size.',
      'Azimuthal quantum number (l)': 'The azimuthal quantum number determines orbital angular momentum and shape (sphere, dumbbell, etc.).',
      'Spin quantum number (ms)': 'The spin quantum number determines intrinsic electron spin direction (+1/2 or -1/2).'
    },
    subtopic: 'Orbital Shapes (s, p, d, f)'
  },
  {
    id: 'q_quant_3',
    conceptId: 'quantum_numbers',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'Which set of quantum numbers (n, l, ml, ms) is quantum mechanically forbidden for an electron in an atom?',
    options: ['n = 2, l = 2, ml = 0, ms = +1/2', 'n = 3, l = 1, ml = -1, ms = -1/2', 'n = 4, l = 0, ml = 0, ms = +1/2', 'n = 3, l = 2, ml = -2, ms = +1/2'],
    correctAnswer: 'n = 2, l = 2, ml = 0, ms = +1/2',
    explanation: 'The azimuthal quantum number l can only take integer values from 0 up to (n - 1). When n = 2, the maximum allowed value of l is 1 (only 2s and 2p exist, no 2d).',
    whyIncorrect: {
      'n = 3, l = 1, ml = -1, ms = -1/2': 'Allowed: corresponds to an electron in a 3p orbital.',
      'n = 4, l = 0, ml = 0, ms = +1/2': 'Allowed: corresponds to an electron in a 4s orbital.',
      'n = 3, l = 2, ml = -2, ms = +1/2': 'Allowed: corresponds to an electron in a 3d orbital.'
    },
    subtopic: 'Electronic Configurations'
  },

  // --- PERIODIC PROPERTIES ---
  {
    id: 'q_per_1',
    conceptId: 'periodic_properties',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'Which element possesses the highest electronegativity on the Pauling scale?',
    options: ['Fluorine (F)', 'Oxygen (O)', 'Chlorine (Cl)', 'Francium (Fr)'],
    correctAnswer: 'Fluorine (F)',
    explanation: 'Fluorine has an electronegativity value of ~3.98, the highest of all elements due to its high effective nuclear charge and small atomic radius.',
    whyIncorrect: {
      'Oxygen (O)': 'Oxygen is second highest at ~3.44.',
      'Chlorine (Cl)': 'Chlorine is ~3.16.',
      'Francium (Fr)': 'Francium has among the lowest electronegativities (~0.7).'
    },
    subtopic: 'Electronegativity Scales'
  },
  {
    id: 'q_per_2',
    conceptId: 'periodic_properties',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Why does Nitrogen have a higher first ionization energy than Oxygen, despite being to the left in the periodic table?',
    options: [
      'Nitrogen has a stable half-filled 2p³ subshell',
      'Oxygen has a smaller nuclear charge than Nitrogen',
      'Nitrogen has higher shielding effect than Oxygen',
      'Oxygen loses an electron to achieve a noble gas configuration'
    ],
    correctAnswer: 'Nitrogen has a stable half-filled 2p³ subshell',
    explanation: 'Nitrogen’s 2p³ configuration has three unpaired electrons in degenerate orbitals, conferring extra exchange stabilization. Oxygen (2p⁴) experiences inter-electronic repulsion in its paired orbital, making electron removal easier.',
    whyIncorrect: {
      'Oxygen has a smaller nuclear charge than Nitrogen': 'Oxygen has Z=8 while Nitrogen has Z=7, so Oxygen has a larger nuclear charge.',
      'Nitrogen has higher shielding effect than Oxygen': 'Both have the same core 1s² electrons shielding the valence shell.',
      'Oxygen loses an electron to achieve a noble gas configuration': 'Removing one electron from Oxygen leaves 2p³, not a noble gas configuration.'
    },
    subtopic: 'Ionization Enthalpy'
  },
  {
    id: 'q_per_3',
    conceptId: 'periodic_properties',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'Which is the correct order of increasing ionic radii for the isoelectronic series: Al³⁺, Mg²⁺, Na⁺, F⁻, O²⁻?',
    options: [
      'Al³⁺ < Mg²⁺ < Na⁺ < F⁻ < O²⁻',
      'O²⁻ < F⁻ < Na⁺ < Mg²⁺ < Al³⁺',
      'Na⁺ < Mg²⁺ < Al³⁺ < F⁻ < O²⁻',
      'Al³⁺ < Na⁺ < Mg²⁺ < O²⁻ < F⁻'
    ],
    correctAnswer: 'Al³⁺ < Mg²⁺ < Na⁺ < F⁻ < O²⁻',
    explanation: 'All these ions have 10 electrons (neon configuration). As the nuclear charge increases (Al has 13 protons vs O with only 8), the electron cloud is pulled tighter, decreasing ionic size.',
    whyIncorrect: {
      'O²⁻ < F⁻ < Na⁺ < Mg²⁺ < Al³⁺': 'This is reverse of the correct order; anions with fewer protons expand.',
      'Na⁺ < Mg²⁺ < Al³⁺ < F⁻ < O²⁻': 'Mg²⁺ and Al³⁺ have higher positive charges and are smaller than Na⁺.',
      'Al³⁺ < Na⁺ < Mg²⁺ < O²⁻ < F⁻': 'Incorrect ordering of cations and anions.'
    },
    subtopic: 'Atomic & Ionic Radii'
  },

  // --- CHEMICAL BONDING ---
  {
    id: 'q_bond_1',
    conceptId: 'chemical_bonding',
    prerequisiteConcept: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'What type of chemical bond involves the electrostatic attraction between oppositely charged ions?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    correctAnswer: 'Ionic bond',
    explanation: 'Ionic bonding occurs when electrons are transferred from an electropositive element to an electronegative element, creating cations and anions held by Coulombic attraction.',
    whyIncorrect: {
      'Covalent bond': 'Covalent bonds involve sharing of valence electron pairs between atoms.',
      'Metallic bond': 'Metallic bonding involves fixed positive atomic cores within a delocalized electron sea.',
      'Hydrogen bond': 'Hydrogen bonds are intermolecular dipole-dipole attractions.'
    },
    subtopic: 'Ionic vs Covalent'
  },
  {
    id: 'q_bond_2',
    conceptId: 'chemical_bonding',
    prerequisiteConcept: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'What is the formal charge on the central oxygen atom in the ozone molecule (O3)?',
    options: ['+1', '0', '-1', '+2'],
    correctAnswer: '+1',
    explanation: 'In the resonance structure of ozone (O=O⁺-O⁻), the central oxygen has 6 valence electrons - 2 nonbonding electrons - 3 bonds = +1.',
    whyIncorrect: {
      '0': 'A neutral divalent oxygen atom has formal charge 0, but central ozone oxygen forms three bonds and has one lone pair.',
      '-1': '-1 is the formal charge on the single-bonded terminal oxygen.',
      '+2': '+2 would require oxygen to lose four electrons beyond its share.'
    },
    subtopic: 'Lewis Dot Structures'
  },
  {
    id: 'q_bond_3',
    conceptId: 'chemical_bonding',
    prerequisiteConcept: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'According to Born-Haber cycle thermodynamic principles, which factor contributes most positively to the high lattice energy of Magnesium Oxide (MgO) compared to Sodium Chloride (NaCl)?',
    options: [
      'Higher ionic charges (Mg²⁺ and O²⁻ vs Na⁺ and Cl⁻)',
      'Larger atomic size of magnesium compared to sodium',
      'Lower ionization enthalpy of magnesium',
      'Higher electron affinity of chlorine than oxygen'
    ],
    correctAnswer: 'Higher ionic charges (Mg²⁺ and O²⁻ vs Na⁺ and Cl⁻)',
    explanation: 'Lattice energy is proportional to (q1 * q2) / r. For MgO, the charges are (+2) and (-2), making the product 4, nearly 4 times larger than (+1)(-1) in NaCl.',
    whyIncorrect: {
      'Larger atomic size of magnesium compared to sodium': 'Mg²⁺ is actually smaller than Na⁺, and larger size would decrease lattice energy.',
      'Lower ionization enthalpy of magnesium': 'Magnesium has higher ionization enthalpy (sum of IE1 and IE2 is much higher).',
      'Higher electron affinity of chlorine than oxygen': 'Electron affinity contributes to enthalpy of formation, not the lattice energy term itself.'
    },
    subtopic: 'Lattice Energy'
  },

  // --- MOLECULAR STRUCTURE ---
  {
    id: 'q_mol_1',
    conceptId: 'molecular_structure',
    prerequisiteConcept: 'chemical_bonding',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'What is the molecular geometry of methane (CH4) according to VSEPR theory?',
    options: ['Tetrahedral', 'Square Planar', 'Trigonal Pyramidal', 'Bent'],
    correctAnswer: 'Tetrahedral',
    explanation: 'Methane has a steric number of 4 (4 single bonds, 0 lone pairs), yielding a tetrahedral shape with 109.5° bond angles.',
    whyIncorrect: {
      'Square Planar': 'Square planar requires steric number 6 with 2 lone pairs (like XeF4).',
      'Trigonal Pyramidal': 'Trigonal pyramidal has 3 bond pairs and 1 lone pair (like NH3).',
      'Bent': 'Bent has 2 bond pairs and 2 lone pairs (like H2O).'
    },
    subtopic: 'VSEPR Geometry'
  },
  {
    id: 'q_mol_2',
    conceptId: 'molecular_structure',
    prerequisiteConcept: 'chemical_bonding',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'What is the hybridization and molecular geometry of Sulfur Hexafluoride (SF6)?',
    options: [
      'sp³d², Octahedral',
      'sp³d, Trigonal Bipyramidal',
      'sp³, Tetrahedral',
      'dsp², Square Planar'
    ],
    correctAnswer: 'sp³d², Octahedral',
    explanation: 'Sulfur in SF6 forms 6 single bonds with 0 lone pairs. Steric number is 6, requiring sp³d² hybridization and giving an octahedral geometry with 90° bond angles.',
    whyIncorrect: {
      'sp³d, Trigonal Bipyramidal': 'sp³d corresponds to steric number 5 (like PCl5).',
      'sp³, Tetrahedral': 'sp³ corresponds to steric number 4 (like CH4).',
      'dsp², Square Planar': 'dsp² is common for d⁸ transition metal complexes (like [PtCl4]²⁻).'
    },
    subtopic: 'Hybridization Schemes'
  },
  {
    id: 'q_mol_3',
    conceptId: 'molecular_structure',
    prerequisiteConcept: 'chemical_bonding',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'Which of the following molecules has polar bonds but possesses a net zero dipole moment (μ = 0)?',
    options: ['Boron Trifluoride (BF3)', 'Sulfur Dioxide (SO2)', 'Ammonia (NH3)', 'Water (H2O)'],
    correctAnswer: 'Boron Trifluoride (BF3)',
    explanation: 'BF3 has polar B-F bonds, but its trigonal planar geometry (120° bond angles) causes the three bond dipole vectors to cancel out completely.',
    whyIncorrect: {
      'Sulfur Dioxide (SO2)': 'SO2 is bent due to a lone pair on sulfur, so its bond dipoles do not cancel.',
      'Ammonia (NH3)': 'NH3 is trigonal pyramidal with a net upward dipole vector.',
      'Water (H2O)': 'H2O is bent with a large net dipole moment (~1.85 D).'
    },
    subtopic: 'Dipole Moments & Polarity'
  },

  // --- THERMODYNAMICS ---
  {
    id: 'q_thermo_1',
    conceptId: 'thermodynamics',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'If a chemical reaction releases heat energy into its surroundings, the process is classified as:',
    options: ['Exothermic (ΔH < 0)', 'Endothermic (ΔH > 0)', 'Adiabatic (q = 0)', 'Isochoric (ΔV = 0)'],
    correctAnswer: 'Exothermic (ΔH < 0)',
    explanation: 'Exothermic reactions release thermal energy, meaning the enthalpy of products is lower than reactants, resulting in a negative ΔH.',
    whyIncorrect: {
      'Endothermic (ΔH > 0)': 'Endothermic reactions absorb thermal energy from surroundings (ΔH > 0).',
      'Adiabatic (q = 0)': 'Adiabatic refers to a process where no heat is exchanged with surroundings.',
      'Isochoric (ΔV = 0)': 'Isochoric refers to a constant volume process.'
    },
    subtopic: 'Enthalpy & Calorimetry'
  },
  {
    id: 'q_thermo_2',
    conceptId: 'thermodynamics',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Under what conditions is a chemical reaction always spontaneous at all temperatures?',
    options: [
      'ΔH is negative and ΔS is positive',
      'ΔH is positive and ΔS is positive',
      'ΔH is negative and ΔS is negative',
      'ΔH is positive and ΔS is negative'
    ],
    correctAnswer: 'ΔH is negative and ΔS is positive',
    explanation: 'From ΔG = ΔH - TΔS, if ΔH is negative and ΔS is positive, then -TΔS is always negative for all absolute temperatures T > 0, guaranteeing ΔG < 0 (spontaneous).',
    whyIncorrect: {
      'ΔH is positive and ΔS is positive': 'Only spontaneous at high temperatures where TΔS exceeds ΔH.',
      'ΔH is negative and ΔS is negative': 'Only spontaneous at low temperatures.',
      'ΔH is positive and ΔS is negative': 'Non-spontaneous at all temperatures (ΔG is always positive).'
    },
    subtopic: 'Spontaneity & Gibbs Energy'
  },
  {
    id: 'q_thermo_3',
    conceptId: 'thermodynamics',
    prerequisiteConcept: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'Calculate ΔG° at 298 K for a reaction with ΔH° = -92.2 kJ/mol and ΔS° = -198.7 J/(mol·K). [Convert units carefully!]',
    options: ['-33.0 kJ/mol', '-151.4 kJ/mol', '+33.0 kJ/mol', '-92.2 kJ/mol'],
    correctAnswer: '-33.0 kJ/mol',
    explanation: 'ΔG° = ΔH° - TΔS° = -92.2 kJ - (298 K * (-0.1987 kJ/K)) = -92.2 + 59.21 = -32.99 kJ/mol ≈ -33.0 kJ/mol.',
    whyIncorrect: {
      '-151.4 kJ/mol': 'Occurs if you add the TΔS term instead of subtracting it.',
      '+33.0 kJ/mol': 'Sign inversion error in ΔH or TΔS calculation.',
      '-92.2 kJ/mol': 'Ignores the entropy change term entirely.'
    },
    subtopic: 'Spontaneity & Gibbs Energy'
  },

  // --- CHEMICAL EQUILIBRIUM ---
  {
    id: 'q_eq_1',
    conceptId: 'chemical_equilibrium',
    prerequisiteConcept: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'According to Le Chatelier’s principle, what happens to the equilibrium N2(g) + 3H2(g) ⇌ 2NH3(g) [Exothermic] when pressure is increased?',
    options: [
      'Shifts forward (towards NH3)',
      'Shifts backward (towards N2 and H2)',
      'No change in equilibrium position',
      'The equilibrium constant Kp decreases'
    ],
    correctAnswer: 'Shifts forward (towards NH3)',
    explanation: 'Increasing pressure favors the side with fewer moles of gas. The reactant side has 1 + 3 = 4 moles of gas, while the product side has 2 moles, so the system shifts forward.',
    whyIncorrect: {
      'Shifts backward (towards N2 and H2)': 'A backward shift would produce more gas moles (4 moles), counteracting pressure decrease, not increase.',
      'No change in equilibrium position': 'Pressure change affects equilibrium whenever Δn(gas) ≠ 0.',
      'The equilibrium constant Kp decreases': 'Equilibrium constants are temperature-dependent only, not pressure-dependent.'
    },
    subtopic: 'Le Chatelier’s Shifts'
  },
  {
    id: 'q_eq_2',
    conceptId: 'chemical_equilibrium',
    prerequisiteConcept: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'If the reaction quotient Q is greater than the equilibrium constant K (Q > K), what occurs as the system moves towards equilibrium?',
    options: [
      'Products convert to reactants (reaction shifts left)',
      'Reactants convert to products (reaction shifts right)',
      'The system is already at dynamic equilibrium',
      'The value of K increases to match Q'
    ],
    correctAnswer: 'Products convert to reactants (reaction shifts left)',
    explanation: 'When Q > K, there is an excess of products relative to equilibrium proportions. The system consumes products and generates reactants (shifts left) until Q = K.',
    whyIncorrect: {
      'Reactants convert to products (reaction shifts right)': 'A rightward shift occurs when Q < K.',
      'The system is already at dynamic equilibrium': 'Equilibrium occurs strictly when Q = K.',
      'The value of K increases to match Q': 'K is an intrinsic thermodynamic constant at fixed temperature; only Q changes.'
    },
    subtopic: 'Homogeneous & Heterogeneous Equilibria'
  },
  {
    id: 'q_eq_3',
    conceptId: 'chemical_equilibrium',
    prerequisiteConcept: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'The solubility product Ksp of Calcium Fluoride (CaF2) in pure water is 4.0 × 10⁻¹¹. What is its molar solubility (s)?',
    options: ['2.15 × 10⁻⁴ M', '6.32 × 10⁻⁶ M', '3.16 × 10⁻⁴ M', '1.0 × 10⁻⁵ M'],
    correctAnswer: '2.15 × 10⁻⁴ M',
    explanation: 'Dissociation: CaF2 ⇌ Ca²⁺ + 2F⁻. Therefore [Ca²⁺] = s and [F⁻] = 2s. Ksp = s * (2s)² = 4s³. So s = (Ksp / 4)^(1/3) = (1.0 × 10⁻¹¹)^(1/3) ≈ 2.15 × 10⁻⁴ M.',
    whyIncorrect: {
      '6.32 × 10⁻⁶ M': 'Forgot the stoichiometric coefficient 2 in (2s)² and calculated s = sqrt(Ksp).',
      '3.16 × 10⁻⁴ M': 'Calculated s = (Ksp / 2)^(1/3).',
      '1.0 × 10⁻⁵ M': 'Arithmetic calculation error without cubed root.'
    },
    subtopic: 'Solubility Product (Ksp)'
  },

  // --- ACIDS & BASES ---
  {
    id: 'q_ab_1',
    conceptId: 'acids_and_bases',
    prerequisiteConcept: 'chemical_equilibrium',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'What is the pH of a 0.001 M solution of strong hydrochloric acid (HCl)?',
    options: ['3.0', '1.0', '11.0', '7.0'],
    correctAnswer: '3.0',
    explanation: 'HCl dissociates completely in water: [H⁺] = 1.0 × 10⁻³ M. pH = -log(1.0 × 10⁻³) = 3.0.',
    whyIncorrect: {
      '1.0': 'A pH of 1 corresponds to [H⁺] = 0.1 M.',
      '11.0': '11.0 is the pOH, not the pH, or corresponds to a basic solution.',
      '7.0': '7.0 is neutral water.'
    },
    subtopic: 'pH and pOH Scale'
  },
  {
    id: 'q_ab_2',
    conceptId: 'acids_and_bases',
    prerequisiteConcept: 'chemical_equilibrium',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Which mixture constitutes an effective buffer solution capable of resisting pH changes?',
    options: [
      'Acetic acid (CH3COOH) and Sodium acetate (CH3COONa)',
      'Hydrochloric acid (HCl) and Sodium chloride (NaCl)',
      'Sodium hydroxide (NaOH) and Sodium chloride (NaCl)',
      'Nitric acid (HNO3) and Ammonium nitrate (NH4NO3)'
    ],
    correctAnswer: 'Acetic acid (CH3COOH) and Sodium acetate (CH3COONa)',
    explanation: 'A buffer requires a weak acid and its conjugate base (or a weak base and its conjugate acid). Acetic acid and acetate ion form a classic acidic buffer system.',
    whyIncorrect: {
      'Hydrochloric acid (HCl) and Sodium chloride (NaCl)': 'HCl is a strong acid; strong acids do not form buffers because Cl⁻ is a negligible base.',
      'Sodium hydroxide (NaOH) and Sodium chloride (NaCl)': 'NaOH is a strong base without conjugate buffer pairing.',
      'Nitric acid (HNO3) and Ammonium nitrate (NH4NO3)': 'HNO3 is a strong acid and cannot buffer.'
    },
    subtopic: 'Buffer Solutions'
  },
  {
    id: 'q_ab_3',
    conceptId: 'acids_and_bases',
    prerequisiteConcept: 'chemical_equilibrium',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'Calculate the pH of a buffer solution containing 0.20 M Acetic Acid (Ka = 1.8 × 10⁻⁵, pKa = 4.74) and 0.40 M Sodium Acetate.',
    options: ['5.04', '4.74', '4.44', '5.34'],
    correctAnswer: '5.04',
    explanation: 'Using Henderson-Hasselbalch equation: pH = pKa + log([Conjugate Base] / [Acid]) = 4.74 + log(0.40 / 0.20) = 4.74 + log(2) = 4.74 + 0.301 = 5.04.',
    whyIncorrect: {
      '4.74': '4.74 is when [Base] = [Acid], where log(1) = 0.',
      '4.44': 'Subtracted log(2) instead of adding it (inverting acid and base ratio).',
      '5.34': 'Added log(4) instead of log(2).'
    },
    subtopic: 'Buffer Solutions'
  },

  // --- ELECTROCHEMISTRY ---
  {
    id: 'q_el_1',
    conceptId: 'electrochemistry',
    prerequisiteConcept: 'chemical_equilibrium',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'In a standard Daniell galvanic cell (Zn-Cu), at which electrode does oxidation occur?',
    options: [
      'Zinc anode',
      'Copper cathode',
      'Copper anode',
      'Zinc cathode'
    ],
    correctAnswer: 'Zinc anode',
    explanation: 'Oxidation always occurs at the anode (An Ox). Zinc is more electropositive than copper (E° = -0.76 V vs +0.34 V), so Zn oxidizes to Zn²⁺ at the anode.',
    whyIncorrect: {
      'Copper cathode': 'Reduction occurs at the cathode (Red Cat: Cu²⁺ + 2e⁻ -> Cu).',
      'Copper anode': 'Copper is not the anode in a spontaneous standard Zn-Cu galvanic cell.',
      'Zinc cathode': 'Zinc acts as the anode, not cathode, in this spontaneous setup.'
    },
    subtopic: 'Galvanic Cells & EMF'
  },
  {
    id: 'q_el_2',
    conceptId: 'electrochemistry',
    prerequisiteConcept: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'What is the standard cell potential (E°cell) for a cell with cathode potential E°(Ag⁺/Ag) = +0.80 V and anode potential E°(Fe²⁺/Fe) = -0.44 V?',
    options: ['+1.24 V', '+0.36 V', '-1.24 V', '-0.36 V'],
    correctAnswer: '+1.24 V',
    explanation: 'E°cell = E°cathode - E°anode = +0.80 V - (-0.44 V) = +0.80 V + 0.44 V = +1.24 V (spontaneous positive EMF).',
    whyIncorrect: {
      '+0.36 V': 'Subtracted magnitudes without accounting for double negative (+0.80 - 0.44).',
      '-1.24 V': 'Reversed cathode and anode designations.',
      '-0.36 V': 'Calculation sign errors.'
    },
    subtopic: 'Galvanic Cells & EMF'
  },
  {
    id: 'q_el_3',
    conceptId: 'electrochemistry',
    prerequisiteConcept: 'thermodynamics',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'For the cell Zn(s) | Zn²⁺(0.001 M) || Cu²⁺(1.0 M) | Cu(s) at 298 K with E°cell = 1.10 V, what is the actual cell potential E according to the Nernst Equation?',
    options: ['1.19 V', '1.01 V', '1.10 V', '1.28 V'],
    correctAnswer: '1.19 V',
    explanation: 'Cell reaction: Zn + Cu²⁺ ⇌ Zn²⁺ + Cu (n = 2). Q = [Zn²⁺]/[Cu²⁺] = 0.001 / 1.0 = 10⁻³. E = E° - (0.0591/n) * log Q = 1.10 - (0.0591/2) * (-3) = 1.10 + 0.08865 ≈ 1.19 V.',
    whyIncorrect: {
      '1.01 V': 'Subtracted the concentration adjustment instead of adding it (missed log(10^-3) is -3).',
      '1.10 V': '1.10 V is standard E° without concentration adjustment.',
      '1.28 V': 'Did not divide 0.0591 by n = 2 electrons transferred.'
    },
    subtopic: 'Nernst Equation Calculations'
  },

  // --- ORGANIC CHEMISTRY ---
  {
    id: 'q_org_1',
    conceptId: 'organic_chemistry',
    prerequisiteConcept: 'chemical_bonding',
    topic: 'Organic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'What is the IUPAC systematic name for CH3-CH2-CH2-OH?',
    options: ['Propan-1-ol', 'Propan-2-ol', 'Ethanol', 'Propanoic acid'],
    correctAnswer: 'Propan-1-ol',
    explanation: 'A 3-carbon chain (propane) with a hydroxyl group (-OH) located at carbon-1 is propan-1-ol.',
    whyIncorrect: {
      'Propan-2-ol': 'Propan-2-ol has the -OH group attached to the central carbon (CH3-CH(OH)-CH3).',
      'Ethanol': 'Ethanol contains only 2 carbon atoms (CH3CH2OH).',
      'Propanoic acid': 'Propanoic acid contains a carboxylic acid functional group (-COOH).'
    },
    subtopic: 'Hydrocarbons & Functional Groups'
  },
  {
    id: 'q_org_2',
    conceptId: 'organic_chemistry',
    prerequisiteConcept: 'molecular_structure',
    topic: 'Organic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'According to Markovnikov’s rule, what is the major organic product formed when HBr is added to propene (CH3-CH=CH2)?',
    options: [
      '2-Bromopropane (CH3-CHBr-CH3)',
      '1-Bromopropane (CH3-CH2-CH2Br)',
      '1,2-Dibromopropane',
      'Cyclopropane'
    ],
    correctAnswer: '2-Bromopropane (CH3-CHBr-CH3)',
    explanation: 'Electrophilic addition of HBr proceeds via the more stable secondary carbocation intermediate (CH3-CH⁺-CH3). Bromide then attacks to yield 2-bromopropane as the major product.',
    whyIncorrect: {
      '1-Bromopropane (CH3-CH2-CH2Br)': '1-Bromopropane is the anti-Markovnikov minor product formed under peroxide conditions (free radical mechanism).',
      '1,2-Dibromopropane': '1,2-Dibromopropane is produced by reaction with molecular Br2, not HBr.',
      'Cyclopropane': 'Cyclopropane is a cyclic alkane, not a halogenated addition product.'
    },
    subtopic: 'Reaction Mechanisms'
  },
  {
    id: 'q_org_3',
    conceptId: 'organic_chemistry',
    prerequisiteConcept: 'molecular_structure',
    topic: 'Organic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'Which nucleophilic substitution mechanism proceeds with complete stereochemical inversion of configuration (Walden Inversion) via a single-step bimolecular transition state?',
    options: ['SN2 mechanism', 'SN1 mechanism', 'E1 mechanism', 'E2 mechanism'],
    correctAnswer: 'SN2 mechanism',
    explanation: 'SN2 involves backside attack by the nucleophile simultaneous with leaving group departure. This produces an umbrella-like inversion of stereochemistry (Walden Inversion).',
    whyIncorrect: {
      'SN1 mechanism': 'SN1 proceeds via a planar carbocation intermediate leading to racemization (mixture of retention and inversion).',
      'E1 mechanism': 'E1 is an elimination mechanism forming alkenes via carbocations.',
      'E2 mechanism': 'E2 is a concerted elimination requiring anti-periplanar geometry.'
    },
    subtopic: 'Reaction Mechanisms'
  }
];
