import { QuizQuestion } from '../types';

export const initialQuestions: QuizQuestion[] = [
  // Organic Chemistry
  {
    id: 'org_1',
    question: 'What is the molecular formula of benzene?',
    options: ['C6H6', 'C6H12', 'C5H5', 'C6H14'],
    correctAnswer: 'C6H6',
    difficulty: 'easy',
    topic: 'Organic Chemistry'
  },
  {
    id: 'org_2',
    question: 'Which of the following functional groups is present in ethanol?',
    options: ['Hydroxyl group (-OH)', 'Carboxyl group (-COOH)', 'Carbonyl group (-C=O)', 'Ether group (-O-)'],
    correctAnswer: 'Hydroxyl group (-OH)',
    difficulty: 'easy',
    topic: 'Organic Chemistry'
  },
  {
    id: 'org_3',
    question: 'What is the hybridization of carbon atoms in an alkyne (triple bond)?',
    options: ['sp', 'sp2', 'sp3', 'dsp2'],
    correctAnswer: 'sp',
    difficulty: 'medium',
    topic: 'Organic Chemistry'
  },
  {
    id: 'org_4',
    question: 'Which organic reaction mechanism is characterized by the formation of a carbocation intermediate?',
    options: ['SN1 Substitution', 'SN2 Substitution', 'E2 Elimination', 'Electrophilic Addition to Alkenes'],
    correctAnswer: 'SN1 Substitution',
    difficulty: 'hard',
    topic: 'Organic Chemistry'
  },
  {
    id: 'org_5',
    question: 'What is the main compound in natural gas?',
    options: ['Methane', 'Ethane', 'Propane', 'Butane'],
    correctAnswer: 'Methane',
    difficulty: 'easy',
    topic: 'Organic Chemistry'
  },

  // Inorganic Chemistry
  {
    id: 'inorg_1',
    question: 'Which acid is commonly known as "oil of vitriol"?',
    options: ['Sulfuric Acid (H2SO4)', 'Hydrochloric Acid (HCl)', 'Nitric Acid (HNO3)', 'Phosphoric Acid (H3PO4)'],
    correctAnswer: 'Sulfuric Acid (H2SO4)',
    difficulty: 'easy',
    topic: 'Inorganic Chemistry'
  },
  {
    id: 'inorg_2',
    question: 'What is the main constituent of common table salt?',
    options: ['Sodium Chloride (NaCl)', 'Calcium Carbonate (CaCO3)', 'Potassium Chloride (KCl)', 'Magnesium Sulfate (MgSO4)'],
    correctAnswer: 'Sodium Chloride (NaCl)',
    difficulty: 'easy',
    topic: 'Inorganic Chemistry'
  },
  {
    id: 'inorg_3',
    question: 'Which oxide of nitrogen is commonly used as anesthetics and known as laughing gas?',
    options: ['Nitrous oxide (N2O)', 'Nitric oxide (NO)', 'Nitrogen dioxide (NO2)', 'Dinitrogen pentoxide (N2O5)'],
    correctAnswer: 'Nitrous oxide (N2O)',
    difficulty: 'medium',
    topic: 'Inorganic Chemistry'
  },
  {
    id: 'inorg_4',
    question: 'What is the coordination number of iron in the hexacyanoferrate(II) complex, [Fe(CN)6]4-?',
    options: ['6', '4', '2', '8'],
    correctAnswer: '6',
    difficulty: 'medium',
    topic: 'Inorganic Chemistry'
  },
  {
    id: 'inorg_5',
    question: 'Which metal exhibits the highest oxidization state among first-row transition metals?',
    options: ['Manganese (Mn)', 'Chromium (Cr)', 'Iron (Fe)', 'Cobalt (Co)'],
    correctAnswer: 'Manganese (Mn)',
    difficulty: 'hard',
    topic: 'Inorganic Chemistry'
  },

  // Physical Chemistry
  {
    id: 'phys_1',
    question: 'According to the first law of thermodynamics, what is conserved?',
    options: ['Energy', 'Entropy', 'Enthalpy', 'Gibbs Free Energy'],
    correctAnswer: 'Energy',
    difficulty: 'easy',
    topic: 'Physical Chemistry'
  },
  {
    id: 'phys_2',
    question: 'What is the shape of a water molecule (H2O) according to VSEPR theory?',
    options: ['Bent', 'Linear', 'Trigonal Planar', 'Tetrahedral'],
    correctAnswer: 'Bent',
    difficulty: 'easy',
    topic: 'Physical Chemistry'
  },
  {
    id: 'phys_3',
    question: 'Which quantum number determines the orientation of an orbital in space?',
    options: ['Magnetic quantum number (ml)', 'Principal quantum number (n)', 'Azimuthal quantum number (l)', 'Spin quantum number (ms)'],
    correctAnswer: 'Magnetic quantum number (ml)',
    difficulty: 'medium',
    topic: 'Physical Chemistry'
  },
  {
    id: 'phys_4',
    question: 'What is the value of the gas constant (R) in SI units (J·K-1·mol-1)?',
    options: ['8.314', '0.0821', '1.987', '62.36'],
    correctAnswer: '8.314',
    difficulty: 'medium',
    topic: 'Physical Chemistry'
  },
  {
    id: 'phys_5',
    question: 'Under what conditions of temperature and pressure does a real gas behave most like an ideal gas?',
    options: ['High temperature and low pressure', 'Low temperature and high pressure', 'High temperature and high pressure', 'Low temperature and low pressure'],
    correctAnswer: 'High temperature and low pressure',
    difficulty: 'hard',
    topic: 'Physical Chemistry'
  }
];
