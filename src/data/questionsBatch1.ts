/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Batch 1: 50 Questions across 5 Concepts
 * (Atomic Structure, Quantum Numbers, Periodic Properties, Chemical Bonding, Molecular Structure)
 * 10 Questions each, accurately distributed (Easy: 3, Medium: 4, Hard: 3)
 */

import { AdaptiveQuestion } from './chemistryConcepts';

export const QUESTIONS_BATCH_1: AdaptiveQuestion[] = [
  // ==========================================
  // CONCEPT 1: ATOMIC STRUCTURE (10 questions)
  // ==========================================
  {
    id: 'atm_q1',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'Who discovered the atomic nucleus through the gold foil alpha-particle scattering experiment?',
    options: ['Ernest Rutherford', 'J.J. Thomson', 'Niels Bohr', 'James Chadwick'],
    correctAnswer: 'Ernest Rutherford',
    explanation: 'Rutherford discovered the atomic nucleus in 1911 by observing that a small fraction of alpha particles deflected at large angles when bombarding gold foil.',
    whyIncorrect: {
      'J.J. Thomson': 'Thomson discovered the electron in 1897 and proposed the plum pudding model.',
      'Niels Bohr': 'Bohr proposed the planetary model of quantized electron energy orbits.',
      'James Chadwick': 'Chadwick discovered the neutron in 1932.'
    },
    subtopic: 'Rutherford & Bohr Models'
  },
  {
    id: 'atm_q2',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'How many neutrons are present in an atom of Carbon-14 (14_6 C)?',
    options: ['8', '6', '14', '12'],
    correctAnswer: '8',
    explanation: 'Number of neutrons = Mass number (A) - Atomic number (Z) = 14 - 6 = 8 neutrons.',
    whyIncorrect: {
      '6': '6 is the atomic number (number of protons).',
      '14': '14 is the mass number (protons + neutrons combined).',
      '12': '12 is the mass number of the standard Carbon-12 isotope.'
    },
    subtopic: 'Isotopes & Isobars'
  },
  {
    id: 'atm_q3',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'Which electromagnetic radiation has the highest frequency and photon energy?',
    options: ['Gamma rays', 'X-rays', 'Ultraviolet', 'Infrared'],
    correctAnswer: 'Gamma rays',
    explanation: 'According to E = hν, gamma rays have the shortest wavelength (<0.01 nm) and highest frequency (>10^19 Hz), giving them the greatest photon energy.',
    whyIncorrect: {
      'X-rays': 'X-rays have lower frequencies (10^16 - 10^19 Hz) than gamma rays.',
      'Ultraviolet': 'UV radiation has less energy than X-rays and gamma rays.',
      'Infrared': 'Infrared radiation has longer wavelengths and much lower photon energy.'
    },
    subtopic: 'Electromagnetic Spectrum'
  },
  {
    id: 'atm_q4',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'What is the de Broglie wavelength of an electron (m = 9.11 × 10^-31 kg) moving at 2.0 × 10^6 m/s? (h = 6.626 × 10^-34 J·s)',
    options: ['0.364 nm', '0.728 nm', '1.456 nm', '0.182 nm'],
    correctAnswer: '0.364 nm',
    explanation: 'λ = h / (m * v) = 6.626 × 10^-34 / (9.11 × 10^-31 * 2.0 × 10^6) = 3.636 × 10^-10 m = 0.364 nm.',
    whyIncorrect: {
      '0.728 nm': 'Occurs if mass is inadvertently halved.',
      '1.456 nm': 'Result of forgetting velocity exponent.',
      '0.182 nm': 'Result of doubling the denominator.'
    },
    subtopic: 'Rutherford & Bohr Models'
  },
  {
    id: 'atm_q5',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Which spectral series of hydrogen atom emission falls in the ultraviolet region?',
    options: ['Lyman series', 'Balmer series', 'Paschen series', 'Brackett series'],
    correctAnswer: 'Lyman series',
    explanation: 'The Lyman series transitions terminate at n1 = 1, releasing high-energy photons in the ultraviolet region (91 - 121 nm).',
    whyIncorrect: {
      'Balmer series': 'Balmer series transitions terminate at n1 = 2 and produce visible light.',
      'Paschen series': 'Paschen series transitions terminate at n1 = 3 in the near-infrared.',
      'Brackett series': 'Brackett series transitions terminate at n1 = 4 in the infrared.'
    },
    subtopic: 'Electromagnetic Spectrum'
  },
  {
    id: 'atm_q6',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'What is the radius of the third orbit (n = 3) of a hydrogen atom according to Bohr’s postulate? (r1 = 0.529 Å)',
    options: ['4.76 Å', '1.59 Å', '2.38 Å', '0.53 Å'],
    correctAnswer: '4.76 Å',
    explanation: 'rn = r1 * n² / Z = 0.529 Å * 3² / 1 = 0.529 * 9 = 4.761 Å.',
    whyIncorrect: {
      '1.59 Å': 'Result of linear scaling (0.529 * 3) instead of n².',
      '2.38 Å': 'Result of using n = 2 squared instead of n = 3.',
      '0.53 Å': '0.53 Å is the radius of the ground state (n = 1).'
    },
    subtopic: 'Rutherford & Bohr Models'
  },
  {
    id: 'atm_q7',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Species having the same total number of electrons are called isoelectronic. Which pair is isoelectronic?',
    options: ['Na+ and F-', 'Na+ and Cl-', 'K+ and F-', 'Mg2+ and Ca2+'],
    correctAnswer: 'Na+ and F-',
    explanation: 'Na+ (11 - 1 = 10 e-) and F- (9 + 1 = 10 e-) both have 10 electrons with the 1s² 2s² 2p⁶ configuration.',
    whyIncorrect: {
      'Na+ and Cl-': 'Na+ has 10 electrons while Cl- has 18 electrons.',
      'K+ and F-': 'K+ has 18 electrons while F- has 10 electrons.',
      'Mg2+ and Ca2+': 'Mg2+ has 10 electrons while Ca2+ has 18 electrons.'
    },
    subtopic: 'Isotopes & Isobars'
  },
  {
    id: 'atm_q8',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'The ionization energy of hydrogen in ground state is 13.6 eV. What is the ionization energy for Li2+ ion in its ground state?',
    options: ['122.4 eV', '40.8 eV', '13.6 eV', '54.4 eV'],
    correctAnswer: '122.4 eV',
    explanation: 'Ionization energy for hydrogenic ions = 13.6 eV * (Z² / n²). For Li2+, Z = 3 and n = 1: IE = 13.6 * 3² = 13.6 * 9 = 122.4 eV.',
    whyIncorrect: {
      '40.8 eV': 'Linear multiplication by Z (13.6 * 3) instead of Z².',
      '13.6 eV': 'Hydrogen ground state ionization energy.',
      '54.4 eV': 'Helium ion (He+, Z = 2) ionization energy: 13.6 * 4 = 54.4 eV.'
    },
    subtopic: 'Rutherford & Bohr Models'
  },
  {
    id: 'atm_q9',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'According to Heisenberg’s Uncertainty Principle, if the uncertainty in position of an electron is 0.1 Å (10^-11 m), what is the minimum uncertainty in velocity? (m = 9.11 × 10^-31 kg, h = 6.626 × 10^-34 J·s)',
    options: ['5.79 × 10^6 m/s', '1.16 × 10^6 m/s', '3.14 × 10^5 m/s', '9.11 × 10^7 m/s'],
    correctAnswer: '5.79 × 10^6 m/s',
    explanation: 'Δx * m * Δv ≥ h / (4π). Therefore Δv ≥ h / (4π * m * Δx) = 6.626×10^-34 / (4 * 3.1416 * 9.11×10^-31 * 10^-11) ≈ 5.79 × 10^6 m/s.',
    whyIncorrect: {
      '1.16 × 10^6 m/s': 'Caused by using 2π instead of 4π in the denominator.',
      '3.14 × 10^5 m/s': 'Mathematical rounding error in powers of 10.',
      '9.11 × 10^7 m/s': 'Confusion between electron mass and velocity values.'
    },
    subtopic: 'Rutherford & Bohr Models'
  },
  {
    id: 'atm_q10',
    conceptId: 'atomic_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'How many radial nodes and angular nodes does a 4d orbital possess?',
    options: ['1 radial node, 2 angular nodes', '2 radial nodes, 1 angular node', '3 radial nodes, 0 angular nodes', '0 radial nodes, 2 angular nodes'],
    correctAnswer: '1 radial node, 2 angular nodes',
    explanation: 'Angular nodes = l (for d orbital, l = 2). Radial nodes = n - l - 1 = 4 - 2 - 1 = 1 radial node. Total nodes = n - 1 = 3.',
    whyIncorrect: {
      '2 radial nodes, 1 angular node': 'This configuration corresponds to a 4p orbital (l = 1, radial = 4 - 1 - 1 = 2).',
      '3 radial nodes, 0 angular nodes': 'This corresponds to a 4s orbital (l = 0, radial = 4 - 0 - 1 = 3).',
      '0 radial nodes, 2 angular nodes': 'This corresponds to a 3d orbital (radial = 3 - 2 - 1 = 0).'
    },
    subtopic: 'Rutherford & Bohr Models'
  },

  // ==========================================
  // CONCEPT 2: QUANTUM NUMBERS (10 questions)
  // ==========================================
  {
    id: 'qn_q1',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'Which quantum number primarily determines the energy and overall size of an atomic orbital?',
    options: ['Principal quantum number (n)', 'Azimuthal quantum number (l)', 'Magnetic quantum number (ml)', 'Spin quantum number (ms)'],
    correctAnswer: 'Principal quantum number (n)',
    explanation: 'The principal quantum number (n = 1, 2, 3...) defines the main electron shell and governs orbital size and major energy level.',
    whyIncorrect: {
      'Azimuthal quantum number (l)': 'Determines the shape of the orbital (s, p, d, f) and subshell angular momentum.',
      'Magnetic quantum number (ml)': 'Determines the 3D spatial orientation of the orbital in space.',
      'Spin quantum number (ms)': 'Specifies intrinsic electron spin direction (+1/2 or -1/2).'
    },
    subtopic: 'Electronic Configurations'
  },
  {
    id: 'qn_q2',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'What is the maximum number of electrons that can occupy a 3p subshell?',
    options: ['6 electrons', '2 electrons', '10 electrons', '14 electrons'],
    correctAnswer: '6 electrons',
    explanation: 'A p-subshell (l = 1) has 3 orbitals (ml = -1, 0, +1). Each orbital holds at most 2 electrons, yielding 3 × 2 = 6 electrons.',
    whyIncorrect: {
      '2 electrons': '2 is the capacity of an s subshell (1 orbital).',
      '10 electrons': '10 is the capacity of a d subshell (5 orbitals).',
      '14 electrons': '14 is the capacity of an f subshell (7 orbitals).'
    },
    subtopic: 'Orbital Shapes (s, p, d, f)'
  },
  {
    id: 'qn_q3',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'The rule stating that no two electrons in an atom can have identical values for all four quantum numbers is:',
    options: ['Pauli Exclusion Principle', 'Hund’s Rule of Multiplicity', 'Aufbau Principle', 'Heisenberg Uncertainty Principle'],
    correctAnswer: 'Pauli Exclusion Principle',
    explanation: 'Wolfgang Pauli formulated this in 1925, dictating that two electrons sharing the same orbital must possess opposite spins (ms = +1/2 and -1/2).',
    whyIncorrect: {
      'Hund’s Rule of Multiplicity': 'States degenerate orbitals are occupied singly before pairing occurs.',
      'Aufbau Principle': 'States electrons fill lower-energy orbitals first before higher ones.',
      'Heisenberg Uncertainty Principle': 'States position and momentum cannot be precisely measured simultaneously.'
    },
    subtopic: 'Aufbau Principle'
  },
  {
    id: 'qn_q4',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'What is the total number of orbitals in the principal shell n = 4?',
    options: ['16', '8', '32', '4'],
    correctAnswer: '16',
    explanation: 'The total number of orbitals in any principal quantum shell is n². For n = 4, n² = 4² = 16 orbitals (1 s + 3 p + 5 d + 7 f = 16).',
    whyIncorrect: {
      '32': '32 is the maximum number of electrons (2n² = 2 × 16 = 32).',
      '8': '8 is the number of orbitals in n = 2 and n = 3 combined or electron capacity of n = 2.',
      '4': '4 is the number of subshells (s, p, d, f), not individual orbitals.'
    },
    subtopic: 'Orbital Shapes (s, p, d, f)'
  },
  {
    id: 'qn_q5',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Which electron configuration represents an atom in an excited state?',
    options: ['1s² 2s¹ 2p³', '1s² 2s² 2p²', '1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁶ 3s² 3p¹'],
    correctAnswer: '1s² 2s¹ 2p³',
    explanation: 'For Carbon (6 electrons), the ground state is 1s² 2s² 2p². The promotion of a 2s electron to 2p produces 1s² 2s¹ 2p³, which is an excited state.',
    whyIncorrect: {
      '1s² 2s² 2p²': 'Ground state of Carbon (C, Z = 6).',
      '1s² 2s² 2p⁶ 3s¹': 'Ground state of Sodium (Na, Z = 11).',
      '1s² 2s² 2p⁶ 3s² 3p¹': 'Ground state of Aluminum (Al, Z = 13).'
    },
    subtopic: 'Electronic Configurations'
  },
  {
    id: 'qn_q6',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'According to the (n + l) rule (Aufbau principle), which orbital is filled first between 4s and 3d?',
    options: ['4s is filled before 3d because (n + l) is smaller for 4s', '3d is filled before 4s because 3d has lower n', 'Both have identical energy so they fill simultaneously', '4s fills first because it has higher l value'],
    correctAnswer: '4s is filled before 3d because (n + l) is smaller for 4s',
    explanation: 'For 4s: n + l = 4 + 0 = 4. For 3d: n + l = 3 + 2 = 5. Lower (n + l) value corresponds to lower energy, so 4s fills before 3d.',
    whyIncorrect: {
      '3d is filled before 4s because 3d has lower n': 'Orbitals are filled by total (n + l) energy, not purely principal quantum number n.',
      'Both have identical energy so they fill simultaneously': 'Their (n + l) values differ (4 vs 5).',
      '4s fills first because it has higher l value': '4s has l = 0, which is lower than 3d (l = 2).'
    },
    subtopic: 'Aufbau Principle'
  },
  {
    id: 'qn_q7',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'What are the possible values of magnetic quantum number (ml) for an electron in a 3d orbital?',
    options: ['-2, -1, 0, +1, +2', '-1, 0, +1', '-3, -2, -1, 0, +1, +2, +3', '0, 1, 2'],
    correctAnswer: '-2, -1, 0, +1, +2',
    explanation: 'For a d orbital, l = 2. The magnetic quantum number ml takes integer values from -l to +l, giving -2, -1, 0, +1, +2 (5 distinct orbitals).',
    whyIncorrect: {
      '-1, 0, +1': 'These are the ml values for a p orbital (l = 1).',
      '-3, -2, -1, 0, +1, +2, +3': 'These are the ml values for an f orbital (l = 3).',
      '0, 1, 2': 'These are the azimuthal quantum numbers l up to 2.'
    },
    subtopic: 'Orbital Shapes (s, p, d, f)'
  },
  {
    id: 'qn_q8',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'Why does Chromium (Z = 24) have the ground-state electron configuration [Ar] 3d⁵ 4s¹ instead of [Ar] 3d⁴ 4s²?',
    options: ['Half-filled d-subshell offers extra exchange energy and symmetric charge distribution', '4s electrons experience higher screening than 3d electrons', 'The 4s orbital ceases to exist at Z = 24', 'Cr is radioactive and undergoes spontaneous orbital decay'],
    correctAnswer: 'Half-filled d-subshell offers extra exchange energy and symmetric charge distribution',
    explanation: 'The extra stability of half-filled (3d⁵) and fully-filled (3d¹⁰) subshells arises from maximum exchange energy among parallel spins and symmetrical electron distribution.',
    whyIncorrect: {
      '4s electrons experience higher screening than 3d electrons': 'Incorrect; 4s electrons penetrate closer to the nucleus.',
      'The 4s orbital ceases to exist at Z = 24': '4s orbital exists across all transition metals.',
      'Cr is radioactive and undergoes spontaneous orbital decay': 'Natural Chromium has stable isotopes (Cr-52).'
    },
    subtopic: 'Electronic Configurations'
  },
  {
    id: 'qn_q9',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'Which set of quantum numbers (n, l, ml, ms) is quantum mechanically forbidden for an electron?',
    options: ['n = 3, l = 3, ml = 0, ms = +1/2', 'n = 4, l = 2, ml = -1, ms = -1/2', 'n = 2, l = 1, ml = 0, ms = +1/2', 'n = 5, l = 0, ml = 0, ms = -1/2'],
    correctAnswer: 'n = 3, l = 3, ml = 0, ms = +1/2',
    explanation: 'For any shell n, l can only take integer values from 0 up to (n - 1). For n = 3, l can only be 0, 1, or 2. l = 3 is impossible.',
    whyIncorrect: {
      'n = 4, l = 2, ml = -1, ms = -1/2': 'Valid 4d orbital electron.',
      'n = 2, l = 1, ml = 0, ms = +1/2': 'Valid 2p orbital electron.',
      'n = 5, l = 0, ml = 0, ms = -1/2': 'Valid 5s orbital electron.'
    },
    subtopic: 'Aufbau Principle'
  },
  {
    id: 'qn_q10',
    conceptId: 'quantum_numbers',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'What is the orbital angular momentum of an electron in a 3p orbital in units of ℏ (where ℏ = h / 2π)?',
    options: ['√2 ℏ', '√6 ℏ', '0', '√12 ℏ'],
    correctAnswer: '√2 ℏ',
    explanation: 'Orbital angular momentum L = √(l(l + 1)) * ℏ. For a p orbital, l = 1. Therefore L = √(1(1 + 1)) * ℏ = √2 ℏ.',
    whyIncorrect: {
      '√6 ℏ': 'This is the angular momentum for a d orbital where l = 2: √(2(3)) = √6 ℏ.',
      '0': 'This is the angular momentum for an s orbital where l = 0.',
      '√12 ℏ': 'This is for an f orbital where l = 3: √(3(4)) = √12 ℏ.'
    },
    subtopic: 'Orbital Shapes (s, p, d, f)'
  },

  // ==========================================
  // CONCEPT 3: PERIODIC PROPERTIES (10 questions)
  // ==========================================
  {
    id: 'per_q1',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'Which element possesses the highest electronegativity on the Pauling scale?',
    options: ['Fluorine (F)', 'Oxygen (O)', 'Chlorine (Cl)', 'Nitrogen (N)'],
    correctAnswer: 'Fluorine (F)',
    explanation: 'Fluorine has the highest Pauling electronegativity value (3.98, commonly rounded to 4.0) due to its high effective nuclear charge and small atomic radius.',
    whyIncorrect: {
      'Oxygen (O)': 'Second highest at 3.44.',
      'Chlorine (Cl)': 'Third highest at 3.16.',
      'Nitrogen (N)': 'Equal to Chlorine at ~3.04.'
    },
    subtopic: 'Electronegativity Scales'
  },
  {
    id: 'per_q2',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'How does atomic radius generally vary as you move from left to right across a period in the periodic table?',
    options: ['Decreases', 'Increases', 'Remains constant', 'First increases then decreases'],
    correctAnswer: 'Decreases',
    explanation: 'Across a period, nuclear charge increases while electrons are added to the same energy shell. The greater effective nuclear charge (Zeff) pulls electrons closer.',
    whyIncorrect: {
      'Increases': 'Atomic radius increases down a group, not across a period.',
      'Remains constant': 'Atomic radius changes systematically across periods.',
      'First increases then decreases': 'There is a monotonic decrease across main group periods.'
    },
    subtopic: 'Atomic & Ionic Radii'
  },
  {
    id: 'per_q3',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'Which group of elements has the highest first ionization energies across their respective periods?',
    options: ['Noble gases (Group 18)', 'Halogens (Group 17)', 'Alkali metals (Group 1)', 'Alkaline earth metals (Group 2)'],
    correctAnswer: 'Noble gases (Group 18)',
    explanation: 'Noble gases have stable octet valence electronic configurations (ns² np⁶), making removing an electron extremely endothermic.',
    whyIncorrect: {
      'Halogens (Group 17)': 'Halogens have high electron affinities and high IE, but lower than noble gases.',
      'Alkali metals (Group 1)': 'Alkali metals have the lowest first ionization energies in their periods.',
      'Alkaline earth metals (Group 2)': 'Group 2 elements have moderately low IE values.'
    },
    subtopic: 'Ionization Enthalpy'
  },
  {
    id: 'per_q4',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Why is the first ionization energy of Nitrogen (N, Z = 7) higher than that of Oxygen (O, Z = 8)?',
    options: ['Nitrogen has a stable half-filled 2p³ subshell', 'Oxygen has fewer protons than Nitrogen', 'Nitrogen has a larger atomic radius than Oxygen', 'Oxygen has lower electronegativity than Nitrogen'],
    correctAnswer: 'Nitrogen has a stable half-filled 2p³ subshell',
    explanation: 'Nitrogen has the electronic configuration 1s² 2s² 2p³ (half-filled p subshell), which imparts extra stability. In Oxygen (2p⁴), pairing creates electron-electron repulsion, easing removal.',
    whyIncorrect: {
      'Oxygen has fewer protons than Nitrogen': 'False; Oxygen has 8 protons while Nitrogen has 7.',
      'Nitrogen has a larger atomic radius than Oxygen': 'While true, a larger radius would typically decrease IE, not increase it.',
      'Oxygen has lower electronegativity than Nitrogen': 'False; Oxygen is more electronegative (3.44 vs 3.04).'
    },
    subtopic: 'Ionization Enthalpy'
  },
  {
    id: 'per_q5',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Which of the following atoms/ions has the largest ionic radius?',
    options: ['O2-', 'F-', 'Na+', 'Mg2+'],
    correctAnswer: 'O2-',
    explanation: 'These are isoelectronic species with 10 electrons. As nuclear charge increases (O: 8, F: 9, Na: 11, Mg: 12), the radius decreases. O2- has the fewest protons, so it is the largest.',
    whyIncorrect: {
      'F-': 'Has 9 protons pulling 10 electrons, smaller than O2-.',
      'Na+': 'Has 11 protons pulling 10 electrons, smaller still.',
      'Mg2+': 'Has 12 protons pulling 10 electrons, making it the smallest of the series.'
    },
    subtopic: 'Atomic & Ionic Radii'
  },
  {
    id: 'per_q6',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Why does Chlorine have a more negative electron gain enthalpy (higher electron affinity) than Fluorine?',
    options: ['Small size of Fluorine causes strong interelectronic repulsions in the compact 2p subshell', 'Chlorine has higher electronegativity than Fluorine', 'Fluorine has d-orbitals available for bonding', 'Chlorine has lower nuclear charge than Fluorine'],
    correctAnswer: 'Small size of Fluorine causes strong interelectronic repulsions in the compact 2p subshell',
    explanation: 'Because Fluorine is extremely compact (2p), adding an electron experiences significant electrostatic repulsion. Chlorine (3p) is larger and accommodates the extra electron more readily.',
    whyIncorrect: {
      'Chlorine has higher electronegativity than Fluorine': 'False; Fluorine is more electronegative than Chlorine.',
      'Fluorine has d-orbitals available for bonding': 'Fluorine is in period 2 and lacks d-orbitals.',
      'Chlorine has lower nuclear charge than Fluorine': 'False; Chlorine has Z = 17, higher than Fluorine (Z = 9).'
    },
    subtopic: 'Electronegativity Scales'
  },
  {
    id: 'per_q7',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Which of the following oxide pairs illustrates an amphoteric oxide and a basic oxide, respectively?',
    options: ['Al2O3 and Na2O', 'CO2 and CaO', 'SO3 and MgO', 'N2O5 and K2O'],
    correctAnswer: 'Al2O3 and Na2O',
    explanation: 'Al2O3 reacts with both acids and bases and is therefore amphoteric. Na2O is a strongly basic alkali metal oxide forming NaOH in water.',
    whyIncorrect: {
      'CO2 and CaO': 'CO2 is an acidic non-metal oxide.',
      'SO3 and MgO': 'SO3 is an acidic oxide forming sulfuric acid.',
      'N2O5 and K2O': 'N2O5 is an acidic oxide forming nitric acid.'
    },
    subtopic: 'Atomic & Ionic Radii'
  },
  {
    id: 'per_q8',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'The cause of the "Lanthanide Contraction" (gradual decrease in atomic and ionic radii of 4f elements) is:',
    options: ['Imperfect and poor shielding of 4f electrons by one another', 'Expansion of the 5d orbital', 'Relativistic contraction of the 1s core', 'Pairing of electrons in the 6s orbital'],
    correctAnswer: 'Imperfect and poor shielding of 4f electrons by one another',
    explanation: 'The 4f orbitals are diffused and screen nuclear charge very poorly. As Z increases across the lanthanides, Zeff increases steadily, causing the entire electron cloud to contract.',
    whyIncorrect: {
      'Expansion of the 5d orbital': '5d orbitals do not expand significantly to cause this effect.',
      'Relativistic contraction of the 1s core': 'Relativistic effects become prominent in 6p/7s elements (like gold and mercury), not the primary cause of lanthanide contraction.',
      'Pairing of electrons in the 6s orbital': '6s electrons are already paired in lanthanum and subsequent elements.'
    },
    subtopic: 'Atomic & Ionic Radii'
  },
  {
    id: 'per_q9',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'According to Slater’s rules, what is the screening constant (S) for a 4s electron in Zinc (Z = 30)?',
    options: ['25.65', '21.40', '28.85', '18.00'],
    correctAnswer: '25.65',
    explanation: 'Configuration: (1s²)(2s²2p⁶)(3s²3p⁶)(3d¹⁰)(4s²). For 4s: other 4s electron = 0.35 × 1 = 0.35; n-1 shell (3s²3p⁶3d¹⁰ = 18 electrons) = 0.85 × 18 = 15.30; n-2 or lower (10 electrons) = 1.00 × 10 = 10.00. Total S = 0.35 + 15.30 + 10.00 = 25.65.',
    whyIncorrect: {
      '21.40': 'Calculated by omitting the 3d electrons.',
      '28.85': 'Calculated with wrong multiplier weights.',
      '18.00': 'Screening of core shells only without valence contributions.'
    },
    subtopic: 'Ionization Enthalpy'
  },
  {
    id: 'per_q10',
    conceptId: 'periodic_properties',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'Which of the following elements has an anomalous negative electron affinity (positive electron gain enthalpy), meaning it resists gaining an electron?',
    options: ['Beryllium (Be)', 'Boron (B)', 'Carbon (C)', 'Oxygen (O)'],
    correctAnswer: 'Beryllium (Be)',
    explanation: 'Beryllium has a completely filled 2s² valence shell. Adding an electron requires entering the higher-energy 2p subshell, resulting in an unfavorable endothermic process (ΔegH > 0).',
    whyIncorrect: {
      'Boron (B)': 'Boron has a negative electron gain enthalpy (-27 kJ/mol).',
      'Carbon (C)': 'Carbon readily gains an electron to form a half-filled 2p³ anion (-122 kJ/mol).',
      'Oxygen (O)': 'Oxygen has a strongly exothermic first electron gain enthalpy (-141 kJ/mol).'
    },
    subtopic: 'Electronegativity Scales'
  },

  // ==========================================
  // CONCEPT 4: CHEMICAL BONDING (10 questions)
  // ==========================================
  {
    id: 'bnd_q1',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'What type of chemical bond is formed by the complete transfer of one or more valence electrons from a metal to a non-metal?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    correctAnswer: 'Ionic bond',
    explanation: 'Ionic bonding involves electrostatic attraction between oppositely charged ions formed by the full transfer of electrons.',
    whyIncorrect: {
      'Covalent bond': 'Formed by mutual sharing of electron pairs between non-metals.',
      'Metallic bond': 'Formed by attraction between metal cations and a delocalized electron sea.',
      'Hydrogen bond': 'An intermolecular dipole-dipole attraction involving H bonded to N, O, or F.'
    },
    subtopic: 'Ionic vs Covalent'
  },
  {
    id: 'bnd_q2',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'How many valence electrons are shared in a nitrogen molecule (N2) triple covalent bond?',
    options: ['6 electrons', '3 electrons', '2 electrons', '8 electrons'],
    correctAnswer: '6 electrons',
    explanation: 'A triple covalent bond consists of 3 shared electron pairs, which equals 3 × 2 = 6 shared valence electrons.',
    whyIncorrect: {
      '3 electrons': '3 is the number of electron pairs, not individual electrons.',
      '2 electrons': '2 electrons make a single covalent bond.',
      '8 electrons': '8 is the complete valence octet.'
    },
    subtopic: 'Lewis Dot Structures'
  },
  {
    id: 'bnd_q3',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'Which of the following compounds exhibits an expanded octet (more than 8 valence electrons around the central atom)?',
    options: ['SF6', 'CH4', 'NH3', 'H2O'],
    correctAnswer: 'SF6',
    explanation: 'Sulfur hexafluoride (SF6) has 6 bonding pairs around sulfur (total of 12 valence electrons) utilizing sulfur’s empty 3d orbitals.',
    whyIncorrect: {
      'CH4': 'Carbon has an exact octet of 8 electrons (4 single bonds).',
      'NH3': 'Nitrogen has 8 electrons (3 bond pairs + 1 lone pair).',
      'H2O': 'Oxygen has 8 electrons (2 bond pairs + 2 lone pairs).'
    },
    subtopic: 'Lewis Dot Structures'
  },
  {
    id: 'bnd_q4',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'What is the formal charge on the central atom of Ozone (O3) in its most stable resonance structure?',
    options: ['+1', '0', '-1', '+2'],
    correctAnswer: '+1',
    explanation: 'Formal charge = V - N - B/2. For central oxygen: Valence V = 6, Non-bonding N = 2 (1 lone pair), Bonding B = 6 (1 single + 1 double bond = 6 e-). FC = 6 - 2 - 3 = +1.',
    whyIncorrect: {
      '0': '0 is the formal charge of the double-bonded terminal oxygen.',
      '-1': '-1 is the formal charge of the single-bonded terminal oxygen.',
      '+2': ' 중앙 oxygen does not have a formal charge of +2.'
    },
    subtopic: 'Lewis Dot Structures'
  },
  {
    id: 'bnd_q5',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'Which factor increases the lattice enthalpy of an ionic crystal according to Kapustinskii’s equation?',
    options: ['Higher ionic charges and smaller ionic radii', 'Lower ionic charges and larger ionic radii', 'Low electronegativity difference', 'Presence of non-polar covalent bonds'],
    correctAnswer: 'Higher ionic charges and smaller ionic radii',
    explanation: 'Lattice energy is proportional to (z+ * z-) / (r+ + r-). Higher charges and closer interionic distances dramatically strengthen the electrostatic attraction.',
    whyIncorrect: {
      'Lower ionic charges and larger ionic radii': 'Weakens lattice enthalpy significantly.',
      'Low electronegativity difference': 'Favors covalent bonding rather than high ionic lattice energy.',
      'Presence of non-polar covalent bonds': 'Covalent character reduces purely electrostatic lattice enthalpy.'
    },
    subtopic: 'Lattice Energy'
  },
  {
    id: 'bnd_q6',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'According to Fajan’s rules, which compound will exhibit the greatest covalent character?',
    options: ['AlCl3', 'NaCl', 'MgCl2', 'KCl'],
    correctAnswer: 'AlCl3',
    explanation: 'Al3+ has a high positive charge (+3) and small ionic radius, giving it high polarizing power. It heavily distorts the chloride electron cloud, imparting significant covalent character.',
    whyIncorrect: {
      'NaCl': 'Na+ has low charge (+1) and is strongly ionic.',
      'MgCl2': 'Mg2+ has lower polarizing power than Al3+.',
      'KCl': 'K+ has a larger radius and low charge, making it nearly purely ionic.'
    },
    subtopic: 'Ionic vs Covalent'
  },
  {
    id: 'bnd_q7',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'In the Born-Haber cycle for NaCl, which step is endothermic (requires input of energy)?',
    options: ['Sublimation of solid sodium: Na(s) → Na(g)', 'Lattice formation: Na+(g) + Cl-(g) → NaCl(s)', 'Electron gain by chlorine: Cl(g) + e- → Cl-(g)', 'Standard enthalpy of formation: Na(s) + 1/2 Cl2(g) → NaCl(s)'],
    correctAnswer: 'Sublimation of solid sodium: Na(s) → Na(g)',
    explanation: 'Sublimation of sodium requires energy to break metallic bonds in solid sodium (ΔHsub > 0).',
    whyIncorrect: {
      'Lattice formation': 'Lattice formation is strongly exothermic (ΔHlattice < 0).',
      'Electron gain by chlorine': 'Electron affinity of chlorine is exothermic (ΔHeg < 0).',
      'Standard enthalpy of formation': 'Formation of NaCl is exothermic (ΔHf° = -411 kJ/mol).'
    },
    subtopic: 'Lattice Energy'
  },
  {
    id: 'bnd_q8',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'What is the bond order of molecular oxygen (O2) and its magnetic behavior predicted by Molecular Orbital Theory?',
    options: ['Bond order = 2, Paramagnetic (2 unpaired electrons in π*2p orbitals)', 'Bond order = 2, Diamagnetic (all electrons paired)', 'Bond order = 2.5, Paramagnetic', 'Bond order = 1.5, Diamagnetic'],
    correctAnswer: 'Bond order = 2, Paramagnetic (2 unpaired electrons in π*2p orbitals)',
    explanation: 'Valence configuration: (σ2s)² (σ*2s)² (σ2pz)² (π2px)² (π2py)² (π*2px)¹ (π*2py)¹. Bond order = (8 - 4)/2 = 2. Two unpaired electrons in degenerate π* antibonding orbitals make O2 paramagnetic.',
    whyIncorrect: {
      'Bond order = 2, Diamagnetic': 'Lewis theory erroneously predicts all electrons paired, but experiments confirm paramagnetism.',
      'Bond order = 2.5, Paramagnetic': 'This is the bond order for O2+ ion.',
      'Bond order = 1.5, Diamagnetic': 'This is the bond order for O2- (superoxide).'
    },
    subtopic: 'Ionic vs Covalent'
  },
  {
    id: 'bnd_q9',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'Which of the following molecules has a bond order of zero, meaning it does not exist under ordinary conditions?',
    options: ['He2', 'H2', 'Li2', 'B2'],
    correctAnswer: 'He2',
    explanation: 'He2 has 4 electrons: (σ1s)² (σ*1s)². Bond order = (Nb - Na)/2 = (2 - 2)/2 = 0. A bond order of zero implies no net bonding stabilization.',
    whyIncorrect: {
      'H2': 'Bond order = (2 - 0)/2 = 1 (stable diatomic molecule).',
      'Li2': 'Bond order = (2 - 0)/2 = 1 (stable in vapor phase).',
      'B2': 'Bond order = (4 - 2)/2 = 1 (paramagnetic with 2 unpaired electrons).'
    },
    subtopic: 'Lewis Dot Structures'
  },
  {
    id: 'bnd_q10',
    conceptId: 'chemical_bonding',
    topic: 'Inorganic Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'Between o-nitrophenol and p-nitrophenol, why does o-nitrophenol have a lower boiling point and higher steam volatility?',
    options: ['o-Nitrophenol forms intramolecular hydrogen bonding, preventing intermolecular associations', 'o-Nitrophenol has a higher molecular weight', 'p-Nitrophenol cannot form any hydrogen bonds', 'o-Nitrophenol has a linear geometry'],
    correctAnswer: 'o-Nitrophenol forms intramolecular hydrogen bonding, preventing intermolecular associations',
    explanation: 'In o-nitrophenol, the -OH and -NO2 groups are adjacent, forming a stable 6-membered intramolecular H-bonded ring. p-Nitrophenol forms extensive intermolecular H-bonds, raising its boiling point.',
    whyIncorrect: {
      'o-Nitrophenol has a higher molecular weight': 'Both are constitutional isomers with identical molecular weights (139.11 g/mol).',
      'p-Nitrophenol cannot form any hydrogen bonds': 'p-Nitrophenol forms strong intermolecular hydrogen bonds.',
      'o-Nitrophenol has a linear geometry': 'Neither molecule is linear.'
    },
    subtopic: 'Ionic vs Covalent'
  },

  // ==========================================
  // CONCEPT 5: MOLECULAR STRUCTURE (10 questions)
  // ==========================================
  {
    id: 'mol_q1',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'According to VSEPR theory, what is the geometric molecular geometry of methane (CH4)?',
    options: ['Tetrahedral', 'Square Planar', 'Trigonal Pyramidal', 'Linear'],
    correctAnswer: 'Tetrahedral',
    explanation: 'Carbon in CH4 has 4 single bonds and 0 lone pairs (steric number = 4). Electron-pair repulsions minimize at a tetrahedral geometry with bond angles of 109.5°.',
    whyIncorrect: {
      'Square Planar': 'Square planar geometry occurs with steric number 6 (4 bonds + 2 lone pairs, e.g., XeF4).',
      'Trigonal Pyramidal': 'Occurs with 3 bonds + 1 lone pair (e.g., NH3).',
      'Linear': 'Occurs with steric number 2 (e.g., CO2, BeCl2).'
    },
    subtopic: 'VSEPR Geometry'
  },
  {
    id: 'mol_q2',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 2,
    question: 'What is the hybridization of the central carbon in ethene (CH2=CH2)?',
    options: ['sp2', 'sp3', 'sp', 'sp3d'],
    correctAnswer: 'sp2',
    explanation: 'Each carbon in ethene forms 3 sigma bonds (2 with H, 1 with C) and has 0 lone pairs (steric number = 3). This corresponds to sp2 hybridization with 120° bond angles.',
    whyIncorrect: {
      'sp3': 'Hybridization in ethane (CH3-CH3, 4 sigma bonds).',
      'sp': 'Hybridization in ethyne (CH≡CH, 2 sigma bonds).',
      'sp3d': 'Requires d orbitals, not available to period-2 carbon.'
    },
    subtopic: 'Hybridization Schemes'
  },
  {
    id: 'mol_q3',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'easy',
    numericalDifficulty: 3,
    question: 'Why does Carbon Dioxide (CO2) have a zero dipole moment despite having polar C=O bonds?',
    options: ['Its linear geometry causes the two equal bond dipoles to point in opposite directions and cancel', 'Carbon and oxygen have identical electronegativity', 'CO2 contains only non-polar ionic bonds', 'The carbon atom has two lone pairs that neutralize the charge'],
    correctAnswer: 'Its linear geometry causes the two equal bond dipoles to point in opposite directions and cancel',
    explanation: 'CO2 is linear (O=C=O). The two individual C=O bond dipoles have equal magnitude but opposite directions (180°), so their vector sum is exactly zero (μ = 0).',
    whyIncorrect: {
      'Carbon and oxygen have identical electronegativity': 'Oxygen (3.44) is substantially more electronegative than Carbon (2.55).',
      'CO2 contains only non-polar ionic bonds': 'The bonds are polar covalent.',
      'The carbon atom has two lone pairs that neutralize the charge': 'Carbon has zero lone pairs in CO2.'
    },
    subtopic: 'Dipole Moments & Polarity'
  },
  {
    id: 'mol_q4',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'What is the molecular geometry of Xenon Tetrafluoride (XeF4)?',
    options: ['Square planar', 'Tetrahedral', 'Seesaw', 'Trigonal bipyramidal'],
    correctAnswer: 'Square planar',
    explanation: 'Xe in XeF4 has 4 bond pairs and 2 lone pairs (steric number = 6, octahedral electron geometry). The two lone pairs occupy opposite axial positions, yielding a square planar molecular geometry.',
    whyIncorrect: {
      'Tetrahedral': 'Tetrahedral occurs with 4 bonds and 0 lone pairs.',
      'Seesaw': 'Seesaw occurs with 4 bonds and 1 lone pair (e.g., SF4).',
      'Trigonal bipyramidal': 'Electron geometry for steric number 5.'
    },
    subtopic: 'VSEPR Geometry'
  },
  {
    id: 'mol_q5',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 5,
    question: 'What is the bond angle in water (H2O) and why is it smaller than the ideal tetrahedral angle of 109.5°?',
    options: ['104.5°, due to greater repulsion from two lone pairs on oxygen', '90°, due to unhybridized p-orbitals', '120°, due to trigonal planar distortion', '107°, due to a single lone pair'],
    correctAnswer: '104.5°, due to greater repulsion from two lone pairs on oxygen',
    explanation: 'Oxygen has 2 bonding pairs and 2 lone pairs. According to VSEPR, lone pair-lone pair repulsion > lone pair-bond pair repulsion > bond pair-bond pair repulsion, compressing the angle to ~104.5°.',
    whyIncorrect: {
      '90°': 'Pure p-orbitals would produce 90°, but hybridization is sp3.',
      '120°': '120° is the trigonal planar bond angle.',
      '107°': '107° is the bond angle in ammonia (NH3) which has only 1 lone pair.'
    },
    subtopic: 'VSEPR Geometry'
  },
  {
    id: 'mol_q6',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'What is the hybridization and molecular shape of Chlorine Trifluoride (ClF3)?',
    options: ['sp3d, T-shaped', 'sp3d, Trigonal planar', 'sp3, Trigonal pyramidal', 'sp3d2, T-shaped'],
    correctAnswer: 'sp3d, T-shaped',
    explanation: 'Chlorine in ClF3 has 3 bond pairs and 2 lone pairs (steric number = 5, sp3d). The 2 lone pairs occupy equatorial sites to minimize 90° repulsions, creating a T-shaped molecule.',
    whyIncorrect: {
      'sp3d, Trigonal planar': 'Trigonal planar occurs with 3 bonds and 0 lone pairs (sp2).',
      'sp3, Trigonal pyramidal': 'Occurs with 3 bonds and 1 lone pair (e.g., NH3).',
      'sp3d2, T-shaped': 'Steric number is 5, not 6.'
    },
    subtopic: 'Hybridization Schemes'
  },
  {
    id: 'mol_q7',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'medium',
    numericalDifficulty: 6,
    question: 'Which of the following molecules has a permanent net dipole moment (μ ≠ 0)?',
    options: ['Sulfur dioxide (SO2)', 'Boron trifluoride (BF3)', 'Carbon tetrachloride (CCl4)', 'Sulfur hexafluoride (SF6)'],
    correctAnswer: 'Sulfur dioxide (SO2)',
    explanation: 'SO2 has a bent shape (sp2, 2 bonds + 1 lone pair). The bond dipoles do not cancel, giving a permanent net dipole moment of 1.63 D.',
    whyIncorrect: {
      'Boron trifluoride (BF3)': 'Trigonal planar (120°), three bond dipoles cancel completely (μ = 0).',
      'Carbon tetrachloride (CCl4)': 'Tetrahedral symmetry causes all 4 C-Cl dipoles to cancel (μ = 0).',
      'Sulfur hexafluoride (SF6)': 'Octahedral symmetry causes all 6 S-F dipoles to cancel (μ = 0).'
    },
    subtopic: 'Dipole Moments & Polarity'
  },
  {
    id: 'mol_q8',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'In Phosphorus Pentachloride (PCl5), why are the axial P-Cl bonds longer and weaker than the equatorial P-Cl bonds?',
    options: ['Axial bond pairs experience 3 repulsions at 90° from equatorial bonds, whereas equatorial bonds experience only 2 at 90°', 'Axial bonds are formed by pure s-orbitals while equatorial bonds use p-orbitals', 'Equatorial chlorine atoms are more electronegative than axial ones', 'PCl5 is planar and does not have axial bonds'],
    correctAnswer: 'Axial bond pairs experience 3 repulsions at 90° from equatorial bonds, whereas equatorial bonds experience only 2 at 90°',
    explanation: 'In trigonal bipyramidal PCl5, axial bonds suffer repulsion from 3 equatorial bonds at 90°. Equatorial bonds suffer repulsion from only 2 axial bonds at 90°. Greater repulsion lengthens the axial bonds (240 pm vs 202 pm).',
    whyIncorrect: {
      'Axial bonds are formed by pure s-orbitals': 'Axial bonds involve pz-dz2 hybrid orbitals; equatorial involve s-px-py hybrids.',
      'Equatorial chlorine atoms are more electronegative': 'All chlorine atoms have identical electronegativity.',
      'PCl5 is planar': 'PCl5 is three-dimensional trigonal bipyramidal.'
    },
    subtopic: 'VSEPR Geometry'
  },
  {
    id: 'mol_q9',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 8,
    question: 'According to Bent’s Rule, more electronegative substituents prefer to attach to hybrid orbitals that have:',
    options: ['Less s-character (more p-character)', 'More s-character', 'Equal s- and p-character', 'Pure d-orbital character'],
    correctAnswer: 'Less s-character (more p-character)',
    explanation: 'Bent’s Rule states that more electronegative atoms prefer orbitals with lower s-character (higher p-character) because s-electrons are held closer to the central nucleus.',
    whyIncorrect: {
      'More s-character': 'Electropositive substituents (like alkyl groups or lone pairs) concentrate in orbitals with higher s-character.',
      'Equal s- and p-character': 'Bent’s rule explains deviations from equal character.',
      'Pure d-orbital character': 'd-orbitals participate in hybridization but do not act purely.'
    },
    subtopic: 'Hybridization Schemes'
  },
  {
    id: 'mol_q10',
    conceptId: 'molecular_structure',
    topic: 'Physical Chemistry',
    difficulty: 'hard',
    numericalDifficulty: 9,
    question: 'What is the molecular geometry and hybridization of the I3- (triiodide) anion?',
    options: ['Linear, sp3d', 'Bent, sp3', 'Trigonal planar, sp2', 'T-shaped, sp3d'],
    correctAnswer: 'Linear, sp3d',
    explanation: 'The central iodine in I3- has 2 bond pairs and 3 lone pairs (steric number = 5, sp3d). The 3 lone pairs occupy all three equatorial positions of the trigonal bipyramid, leaving the 2 I atoms in axial positions in a 180° linear geometry.',
    whyIncorrect: {
      'Bent, sp3': 'Occurs with 2 bonds and 2 lone pairs (steric number 4).',
      'Trigonal planar, sp2': 'Occurs with 3 bonds and 0 lone pairs.',
      'T-shaped, sp3d': 'Occurs with 3 bonds and 2 lone pairs (e.g., ClF3).'
    },
    subtopic: 'VSEPR Geometry'
  }
];
