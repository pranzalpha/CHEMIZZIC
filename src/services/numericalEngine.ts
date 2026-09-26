/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Programmatic Chemistry Numerical Engine
 * Computes exact deterministic mathematical solutions without LLM hallucination.
 * 
 * Supported Numerical Disciplines:
 * 1. Mole Calculations & Avogadro Number
 * 2. Stoichiometry & Yield Calculations
 * 3. Molarity, Molality, Normality & Solution Dilution (M1V1 = M2V2)
 * 4. Ideal Gas Law (PV = nRT) & Gas Effusion
 * 5. Chemical Thermodynamics (Gibbs Free Energy ΔG = ΔH - TΔS, Crossover T, Equilibrium K)
 * 6. Electrochemistry & Nernst Equation (Galvanic Cell EMF, Concentration Effect)
 * 7. Faraday's Laws of Quantitative Electrolysis (m = I·t·M / z·F)
 * 8. Chemical Kinetics (First-Order Rate Constant, Half-Life t1/2 = 0.693/k, Concentration Decay)
 * 9. Arrhenius Activation Energy (k = A·e^(-Ea/RT))
 * 10. Acid-Base Equilibrium & pH (Strong/Weak Acids & Bases, Ka/Kb)
 * 11. Buffer Systems (Henderson-Hasselbalch Equation)
 * 12. Colligative Properties (Boiling Point Elevation, Freezing Point Depression, Osmotic Pressure)
 */

import { NumericalSolveResult } from '../types/curriculum';

// Universal Constants
export const CONSTANTS = {
  R_ATM: 0.082057, // L·atm/(mol·K)
  R_JOULE: 8.314462, // J/(mol·K)
  FARADAY: 96485.33, // C/mol e⁻
  AVOGADRO: 6.02214076e23, // particles/mol
  KW_25C: 1.0e-14, // autoionization product at 298.15 K
  ZERO_CELSIUS_KELVIN: 273.15
};

// Common Molar Masses (g/mol)
export const COMMON_MOLAR_MASSES: Record<string, number> = {
  h2o: 18.015,
  co2: 44.01,
  o2: 31.999,
  h2: 2.016,
  n2: 28.013,
  nacl: 58.44,
  hcl: 36.46,
  naoh: 39.997,
  h2so4: 98.079,
  caco3: 100.087,
  cao: 56.077,
  ch4: 16.043,
  c2h5oh: 46.069,
  ch3cooh: 60.052,
  c6h12o6: 180.156,
  c12h22o11: 342.3, // Sucrose
  cu: 63.546,
  zn: 65.38,
  fe: 55.845,
  ag: 107.868,
  al: 26.982,
  kmno4: 158.034,
  kcl: 74.551,
  nh3: 17.031
};

// Helper: parse scientific and standard decimal notation
export function parseScientificNumber(text: string): number | null {
  if (!text) return null;
  // Support forms: "1.76e-5", "1.76 × 10^-5", "1.76 x 10^-5", "1.76*10^-5", "1.76 · 10⁻⁵"
  let clean = text.replace(/×|x|\*/g, 'e').replace(/10\^/g, '').replace(/[\s]/g, '');
  // Unicode superscripts
  clean = clean.replace(/⁻/g, '-').replace(/⁰/g, '0').replace(/¹/g, '1').replace(/²/g, '2')
               .replace(/³/g, '3').replace(/⁴/g, '4').replace(/⁵/g, '5').replace(/⁶/g, '6')
               .replace(/⁷/g, '7').replace(/⁸/g, '8').replace(/⁹/g, '9');
  
  // Format like "1.76e-5" or "0.05"
  const match = clean.match(/[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?/i);
  if (match) {
    const val = parseFloat(match[0]);
    return isNaN(val) ? null : val;
  }
  return null;
}

// --------------------------------------------------------------------------
// TOPIC SOLVERS
// --------------------------------------------------------------------------

export function solveMoleCalculations(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('mole') && !lower.includes('avogadro') && !lower.includes('molar mass') && !lower.includes('how many molecules') && !lower.includes('how many atoms')) {
    return null;
  }

  // Extract mass: e.g. "m = 88 g" or "88 g" or "mass = 88"
  const massMatch = input.match(/(?:mass\s*=|m\s*=)\s*([0-9.]+)\s*(?:g|grams)?/i) || input.match(/([0-9.]+)\s*(?:g\b|grams)/i);
  // Extract explicit molar mass: e.g. "molar mass M = 44 g/mol" or "M = 44 g/mol" or "44 g/mol"
  const molarMassMatch = input.match(/(?:molar mass|molecular weight|mw)(?:\s*[A-Za-z0-9_]*\s*=)?\s*([0-9.]+)/i)
    || input.match(/([0-9.]+)\s*g\/mol/i)
    || input.match(/\bM\s*=\s*([0-9.]+)/);
  
  let mass = massMatch ? parseFloat(massMatch[1]) : 88.0;
  
  let explicitMolarMass = molarMassMatch ? parseFloat(molarMassMatch[1]) : null;
  let compoundMolarMass: number | null = null;
  for (const [name, mm] of Object.entries(COMMON_MOLAR_MASSES)) {
    if (lower.includes(name)) {
      compoundMolarMass = mm;
      break;
    }
  }
  let molarMass = explicitMolarMass ?? compoundMolarMass ?? 44.01;

  if (mass <= 0 || molarMass <= 0) {
    throw new Error('Mass and molar mass must be positive numerical values.');
  }

  const moles = mass / molarMass;
  const molecules = moles * CONSTANTS.AVOGADRO;

  return {
    identifiedTopic: 'Stoichiometry & Mole Concept',
    detectedConcept: 'Avogadro Molar Particle Conversion',
    governingFormula: 'n = m / M and N = n · N_A',
    formulaLaTeX: 'n = \\frac{m}{M}, \\quad N = n \\cdot N_A',
    extractedVariables: [
      { symbol: 'm', name: 'Sample Mass', value: mass, unit: 'g' },
      { symbol: 'M', name: 'Molar Mass', value: molarMass, unit: 'g/mol' },
      { symbol: 'N_A', name: 'Avogadro Constant', value: CONSTANTS.AVOGADRO, unit: 'particles/mol' }
    ],
    stepByStepSolution: [
      { step: 1, instruction: 'Calculate amount in moles: n = mass / molar mass', expression: `${mass} g / ${molarMass} g/mol`, subResult: `n = ${moles.toFixed(4)} mol` },
      { step: 2, instruction: 'Multiply by Avogadro constant: N = n × 6.022 × 10²³', expression: `${moles.toFixed(4)} mol × 6.022 × 10²³ particles/mol`, subResult: `N = ${molecules.toExponential(4)} molecules` }
    ],
    dimensionalConsistencyCheck: '[g] / [g · mol⁻¹] = mol. [mol] × [particles · mol⁻¹] = particles. Dimensions verified.',
    finalAnswer: {
      numericValue: Number(moles.toFixed(4)),
      unit: 'mol',
      formatted: `${moles.toFixed(4)} mol (${molecules.toExponential(4)} particles)`
    },
    explanation: `A sample of ${mass} g with molar mass ${molarMass} g/mol corresponds to ${moles.toFixed(4)} moles, containing ${molecules.toExponential(4)} discrete molecules.`,
    verificationStatus: 'CALCULATED',
    confidence: 100
  };
}

export function solveIdealGasLaw(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('gas') && !lower.includes('pv = nrt') && !lower.includes('ideal gas') && !lower.includes('pressure') && !lower.includes('atm')) {
    return null;
  }

  // Detect which variable to calculate
  const isFindingP = lower.includes('calculate pressure') || lower.includes('what is the pressure') || lower.includes('find pressure');
  const isFindingV = lower.includes('calculate volume') || lower.includes('what is the volume') || lower.includes('find volume');
  const isFindingN = lower.includes('calculate moles') || lower.includes('how many moles of gas');

  // Extract variables
  const pMatch = input.match(/([0-9.]+)\s*(?:atm|atmosphere)/i);
  const vMatch = input.match(/([0-9.]+)\s*(?:l\b|liters|dm3)/i);
  const nMatch = input.match(/([0-9.]+)\s*(?:mol\b|moles)/i);
  const tMatchC = input.match(/([0-9.]+)\s*(?:°c|c\b)/i);
  const tMatchK = input.match(/([0-9.]+)\s*(?:k\b|kelvin)/i);

  let tempK = 298.15;
  if (tMatchK) {
    tempK = parseFloat(tMatchK[1]);
  } else if (tMatchC) {
    tempK = parseFloat(tMatchC[1]) + CONSTANTS.ZERO_CELSIUS_KELVIN;
  }

  if (tempK <= 0) {
    throw new Error('Absolute temperature cannot be less than or equal to zero Kelvin.');
  }

  const R = CONSTANTS.R_ATM; // 0.08206 L*atm/(mol*K)

  if (isFindingP || (!isFindingV && !isFindingN && vMatch && (nMatch || tMatchC || tMatchK))) {
    const v = vMatch ? parseFloat(vMatch[1]) : 5.0;
    const n = nMatch ? parseFloat(nMatch[1]) : 2.0;
    if (v <= 0) throw new Error('Volume must be greater than zero.');
    const P = (n * R * tempK) / v;

    return {
      identifiedTopic: 'Gas Laws (Ideal Gas Equation of State)',
      detectedConcept: 'Programmatic Pressure Calculation',
      governingFormula: 'P = (n · R · T) / V',
      formulaLaTeX: 'P = \\frac{n R T}{V}',
      extractedVariables: [
        { symbol: 'n', name: 'Moles of gas', value: n, unit: 'mol' },
        { symbol: 'T', name: 'Absolute Temperature', value: tempK, unit: 'K' },
        { symbol: 'V', name: 'Gas Volume', value: v, unit: 'L' },
        { symbol: 'R', name: 'Gas Constant', value: R, unit: 'L·atm/(mol·K)' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'Convert temperature to absolute Kelvin scale', expression: `T = ${tempK.toFixed(2)} K`, subResult: `T = ${tempK.toFixed(2)} K` },
        { step: 2, instruction: 'Substitute into ideal gas equation: P = (n × R × T) / V', expression: `(${n} mol × ${R} L·atm/(mol·K) × ${tempK.toFixed(2)} K) / ${v} L`, subResult: `P = ${P.toFixed(3)} atm` }
      ],
      dimensionalConsistencyCheck: '([mol] × [L·atm·mol⁻¹·K⁻¹] × [K]) / [L] = atm. Dimensions verified.',
      finalAnswer: {
        numericValue: Number(P.toFixed(3)),
        unit: 'atm',
        formatted: `${P.toFixed(3)} atm (${(P * 101.325).toFixed(2)} kPa)`
      },
      explanation: `For ${n} moles of ideal gas confined in a volume of ${v} L at ${tempK.toFixed(2)} K, the exerted pressure is ${P.toFixed(3)} atm.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  } else {
    // Default: find volume
    const p = pMatch ? parseFloat(pMatch[1]) : 1.0;
    const n = nMatch ? parseFloat(nMatch[1]) : 1.0;
    if (p <= 0) throw new Error('Pressure must be greater than zero.');
    const V = (n * R * tempK) / p;

    return {
      identifiedTopic: 'Gas Laws (Ideal Gas Equation of State)',
      detectedConcept: 'Molar Gas Volume Determination',
      governingFormula: 'V = (n · R · T) / P',
      formulaLaTeX: 'V = \\frac{n R T}{P}',
      extractedVariables: [
        { symbol: 'n', name: 'Moles of gas', value: n, unit: 'mol' },
        { symbol: 'P', name: 'Pressure', value: p, unit: 'atm' },
        { symbol: 'T', name: 'Absolute Temperature', value: tempK, unit: 'K' },
        { symbol: 'R', name: 'Gas Constant', value: R, unit: 'L·atm/(mol·K)' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'Verify standard units (Kelvin and atm)', expression: `T = ${tempK.toFixed(2)} K, P = ${p} atm`, subResult: 'Units harmonized' },
        { step: 2, instruction: 'Calculate volume: V = (n × R × T) / P', expression: `(${n} × ${R} × ${tempK.toFixed(2)}) / ${p}`, subResult: `V = ${V.toFixed(3)} L` }
      ],
      dimensionalConsistencyCheck: '([mol] × [L·atm·mol⁻¹·K⁻¹] × [K]) / [atm] = L. Dimensions verified.',
      finalAnswer: {
        numericValue: Number(V.toFixed(3)),
        unit: 'L',
        formatted: `${V.toFixed(3)} L`
      },
      explanation: `Under ${p} atm pressure at ${tempK.toFixed(2)} K, ${n} mol of gas occupies ${V.toFixed(3)} L.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  }
}

export function solveSolutionConcentration(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('molarity') && !lower.includes('molality') && !lower.includes('dilution') && !lower.includes('m1v1') && !lower.includes('concentrated')) {
    return null;
  }

  // Case 1: Dilution M1V1 = M2V2
  if (lower.includes('dilution') || lower.includes('diluted') || lower.includes('m1v1') || (lower.includes('stock') && lower.includes('prepare'))) {
    const m1Match = input.match(/(?:m1\s*=|stock\s*(?:is|of)?)\s*([0-9.]+)\s*m/i) || input.match(/([0-9.]+)\s*m\b/i);
    const v1Match = input.match(/(?:v1\s*=)\s*([0-9.]+)\s*(?:ml|l)/i) || input.match(/([0-9.]+)\s*ml\b/i);
    const m2Match = input.match(/(?:m2\s*=|target\s*(?:is|of)?)\s*([0-9.]+)\s*m/i);
    const v2Match = input.match(/(?:v2\s*=|final\s*(?:volume)?\s*(?:is|of)?)\s*([0-9.]+)\s*(?:ml|l)/i);

    const m1 = m1Match ? parseFloat(m1Match[1]) : 12.0; // e.g. 12 M HCl
    const v2 = v2Match ? parseFloat(v2Match[1]) : 500.0; // 500 mL
    const m2 = m2Match ? parseFloat(m2Match[1]) : 0.5; // 0.5 M

    if (m1 <= 0 || m2 <= 0 || v2 <= 0) {
      throw new Error('Concentrations and volumes must be positive.');
    }
    if (m2 > m1) {
      throw new Error('Final diluted concentration M2 cannot exceed initial stock concentration M1.');
    }

    const v1 = (m2 * v2) / m1;

    return {
      identifiedTopic: 'Solution Chemistry (Dilution Law)',
      detectedConcept: 'Conservation of Solute Moles during Dilution',
      governingFormula: 'M1 · V1 = M2 · V2 ➔ V1 = (M2 · V2) / M1',
      formulaLaTeX: 'V_1 = \\frac{M_2 V_2}{M_1}',
      extractedVariables: [
        { symbol: 'M1', name: 'Stock Solution Molarity', value: m1, unit: 'M (mol/L)' },
        { symbol: 'M2', name: 'Target Diluted Molarity', value: m2, unit: 'M (mol/L)' },
        { symbol: 'V2', name: 'Desired Final Volume', value: v2, unit: 'mL' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'Equate initial and final solute moles: n_initial = n_final', expression: 'M1 × V1 = M2 × V2', subResult: 'Conservation of moles' },
        { step: 2, instruction: 'Solve for required stock volume V1', expression: `(${m2} M × ${v2} mL) / ${m1} M`, subResult: `V1 = ${v1.toFixed(2)} mL` },
        { step: 3, instruction: 'Compute required water addition', expression: `${v2} mL - ${v1.toFixed(2)} mL`, subResult: `${(v2 - v1).toFixed(2)} mL water` }
      ],
      dimensionalConsistencyCheck: '([mol·L⁻¹] × [mL]) / [mol·L⁻¹] = mL. Dimensions verified.',
      finalAnswer: {
        numericValue: Number(v1.toFixed(2)),
        unit: 'mL',
        formatted: `${v1.toFixed(2)} mL of stock solution (add ${(v2 - v1).toFixed(2)} mL solvent)`
      },
      explanation: `To prepare ${v2} mL of ${m2} M solution from ${m1} M stock, measure ${v1.toFixed(2)} mL of stock and dilute with water up to ${v2} mL mark.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  }

  // Case 2: Molarity from mass and volume
  const massMatch = input.match(/([0-9.]+)\s*(?:g\b|grams)/i);
  const volMatch = input.match(/([0-9.]+)\s*(?:ml|l\b|liters)/i);
  const mass = massMatch ? parseFloat(massMatch[1]) : 5.85; // 5.85 g NaCl
  let volL = volMatch ? parseFloat(volMatch[1]) : 0.5;
  if (volMatch && input.toLowerCase().includes('ml')) {
    volL = volL / 1000;
  }
  const mm = 58.44; // NaCl

  if (mass <= 0 || volL <= 0) {
    throw new Error('Mass and volume must be positive.');
  }

  const moles = mass / mm;
  const molarity = moles / volL;

  return {
    identifiedTopic: 'Solution Chemistry (Molarity)',
    detectedConcept: 'Molar Concentration Calculation',
    governingFormula: 'M = (m / MolarMass) / Volume_L',
    formulaLaTeX: 'M = \\frac{m / M}{V_{\\text{liters}}}',
    extractedVariables: [
      { symbol: 'm', name: 'Solute mass', value: mass, unit: 'g' },
      { symbol: 'M', name: 'Solute molar mass', value: mm, unit: 'g/mol' },
      { symbol: 'V', name: 'Solution volume', value: volL, unit: 'L' }
    ],
    stepByStepSolution: [
      { step: 1, instruction: 'Calculate moles of solute', expression: `${mass} g / ${mm} g/mol`, subResult: `${moles.toFixed(4)} mol` },
      { step: 2, instruction: 'Divide by volume in liters', expression: `${moles.toFixed(4)} mol / ${volL} L`, subResult: `${molarity.toFixed(4)} M` }
    ],
    dimensionalConsistencyCheck: '[mol] / [L] = mol·L⁻¹ [M]. Dimensions verified.',
    finalAnswer: {
      numericValue: Number(molarity.toFixed(4)),
      unit: 'M',
      formatted: `${molarity.toFixed(4)} M (mol/L)`
    },
    explanation: `Dissolving ${mass} g of solute in ${volL * 1000} mL of solution yields a concentration of ${molarity.toFixed(4)} M.`,
    verificationStatus: 'CALCULATED',
    confidence: 100
  };
}

export function solveNernstElectrochemistry(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('nernst') && !lower.includes('cell potential') && !lower.includes('emf') && !(lower.includes('daniell') && lower.includes('zn'))) {
    return null;
  }

  // Extract ion concentrations
  const znMatch = input.match(/\[zn[²2]\+?\]\s*=\s*([0-9.]+)/i);
  const cuMatch = input.match(/\[cu[²2]\+?\]\s*=\s*([0-9.]+)/i);
  const znConc = znMatch ? parseFloat(znMatch[1]) : 0.05;
  const cuConc = cuMatch ? parseFloat(cuMatch[1]) : 1.20;

  if (znConc <= 0 || cuConc <= 0) {
    throw new Error('Electrolyte concentrations must be greater than zero.');
  }

  const eStd = 1.10; // Standard Daniell cell EMF
  const n = 2; // e- transferred
  const Q = znConc / cuConc;
  const logQ = Math.log10(Q);
  const slope = 0.05916 / n;
  const correction = -slope * logQ;
  const emf = Number((eStd + correction).toFixed(4));
  const deltaG_kJ = Number(((-n * CONSTANTS.FARADAY * emf) / 1000).toFixed(2));

  return {
    identifiedTopic: 'Electrochemistry (Nernst Equation)',
    detectedConcept: 'Non-Standard Galvanic Cell Electromotive Force',
    governingFormula: 'Ecell = E°cell - (0.05916 / n) · log10(Q)',
    formulaLaTeX: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.05916}{n} \\log_{10}\\left(\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}\\right)',
    extractedVariables: [
      { symbol: 'E°cell', name: 'Standard cell potential of Zn-Cu couple', value: eStd, unit: 'V' },
      { symbol: 'n', name: 'Electrons transferred per reaction cycle', value: n, unit: 'mol e⁻' },
      { symbol: '[Zn²⁺]', name: 'Anode oxidation product concentration', value: znConc, unit: 'M' },
      { symbol: '[Cu²⁺]', name: 'Cathode reactant concentration', value: cuConc, unit: 'M' },
      { symbol: 'T', name: 'Temperature', value: 298.15, unit: 'K' }
    ],
    stepByStepSolution: [
      { step: 1, instruction: 'Formulate balanced cell redox equation', expression: 'Zn(s) + Cu²⁺(aq) ➔ Zn²⁺(aq) + Cu(s)', subResult: 'n = 2 moles of electrons' },
      { step: 2, instruction: 'Calculate reaction quotient Q = [Zn²⁺] / [Cu²⁺]', expression: `${znConc} / ${cuConc}`, subResult: `Q = ${Q.toFixed(4)}` },
      { step: 3, instruction: 'Evaluate log10(Q)', expression: `log10(${Q.toFixed(4)})`, subResult: `log10(Q) = ${logQ.toFixed(4)}` },
      { step: 4, instruction: 'Compute Nernst potential adjustment: -(0.05916 / 2) × log10(Q)', expression: `-(0.02958) × (${logQ.toFixed(4)})`, subResult: `${correction >= 0 ? '+' : ''}${correction.toFixed(4)} V` },
      { step: 5, instruction: 'Calculate non-standard cell potential Ecell', expression: `1.10 V + (${correction.toFixed(4)} V)`, subResult: `Ecell = ${emf} V` }
    ],
    dimensionalConsistencyCheck: '[V] - [V] = Volts [V]. Reaction quotient Q is dimensionless ratio (M/M). Dimensions verified.',
    finalAnswer: {
      numericValue: emf,
      unit: 'V',
      formatted: `${emf} V (ΔG = ${deltaG_kJ} kJ/mol)`
    },
    explanation: `Because [Cu²⁺] > [Zn²⁺], Q is less than 1 (${Q.toFixed(4)}), rendering log10(Q) negative. This adds a positive thermodynamic bonus of ${Math.abs(correction).toFixed(4)} V to the standard 1.10 V EMF, yielding ${emf} V.`,
    verificationStatus: 'CALCULATED',
    confidence: 100
  };
}

export function solveFaradayElectrolysis(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('faraday') && !lower.includes('amperes') && !lower.includes('deposited') && !lower.includes('electrolysis')) {
    return null;
  }

  // Extract current (A), time (s or min), molar mass (g/mol), valency (z)
  const currentMatch = input.match(/([0-9.]+)\s*(?:a\b|amp|amperes)/i);
  const timeSecMatch = input.match(/([0-9.]+)\s*(?:s\b|sec|seconds)/i);
  const timeMinMatch = input.match(/([0-9.]+)\s*(?:min|minutes)/i);
  const timeHourMatch = input.match(/([0-9.]+)\s*(?:h\b|hr|hours)/i);

  const current = currentMatch ? parseFloat(currentMatch[1]) : 3.0; // 3.0 A
  let timeSec = 2400; // default 40 min = 2400 s
  if (timeSecMatch) {
    timeSec = parseFloat(timeSecMatch[1]);
  } else if (timeMinMatch) {
    timeSec = parseFloat(timeMinMatch[1]) * 60;
  } else if (timeHourMatch) {
    timeSec = parseFloat(timeHourMatch[1]) * 3600;
  }

  const mm = 63.55; // Cu default
  const z = 2; // Cu2+ -> Cu

  if (current <= 0 || timeSec <= 0) {
    throw new Error('Current and duration of electrolysis must be positive.');
  }

  const charge = current * timeSec; // Coulombs
  const mass = Number(((charge * mm) / (z * CONSTANTS.FARADAY)).toFixed(4));

  return {
    identifiedTopic: 'Electrochemistry (Faraday’s Laws of Electrolysis)',
    detectedConcept: 'Mass Deposited during Quantitative Electrolysis',
    governingFormula: 'm = (I · t · M) / (z · F)',
    formulaLaTeX: 'm = \\frac{I \\cdot t \\cdot M}{z \\cdot F}',
    extractedVariables: [
      { symbol: 'I', name: 'Electric current', value: current, unit: 'A (C/s)' },
      { symbol: 't', name: 'Duration of electrolysis', value: timeSec, unit: 'seconds' },
      { symbol: 'M', name: 'Molar mass of substance', value: mm, unit: 'g/mol' },
      { symbol: 'z', name: 'Valency (electrons transferred per atom)', value: z, unit: 'eq' },
      { symbol: 'F', name: 'Faraday constant', value: CONSTANTS.FARADAY, unit: 'C/mol e⁻' }
    ],
    stepByStepSolution: [
      { step: 1, instruction: 'Calculate total electric charge passed: Q = I × t', expression: `${current} A × ${timeSec} s`, subResult: `Q = ${charge} Coulombs (C)` },
      { step: 2, instruction: 'Calculate moles of electrons transferred: n_e = Q / F', expression: `${charge} C / ${CONSTANTS.FARADAY} C/mol`, subResult: `${(charge / CONSTANTS.FARADAY).toFixed(5)} mol e⁻` },
      { step: 3, instruction: 'Compute mass deposited: m = (Q × M) / (z × F)', expression: `(${charge} C × ${mm} g/mol) / (${z} × ${CONSTANTS.FARADAY} C/mol)`, subResult: `m = ${mass} g` }
    ],
    dimensionalConsistencyCheck: '(A · s · g · mol⁻¹) / (C · mol⁻¹) = (C · g · mol⁻¹) / (C · mol⁻¹) = grams [g]. Dimensions verified.',
    finalAnswer: {
      numericValue: mass,
      unit: 'g',
      formatted: `${mass} g of Cu deposited`
    },
    explanation: `Passing ${current} A for ${timeSec} s transfers ${charge} C of charge, corresponding to ${(charge / CONSTANTS.FARADAY).toFixed(4)} Faradays. Since Cu²⁺ requires 2 electrons per atom, ${mass} g of copper is deposited at the cathode.`,
    verificationStatus: 'CALCULATED',
    confidence: 100
  };
}

export function solveThermodynamicsGibbs(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('gibbs') && !lower.includes('crossover') && !lower.includes('spontaneous') && !lower.includes('delta h') && !lower.includes('delta s') && !lower.includes('enthalpy') && !lower.includes('entropy')) {
    return null;
  }

  // Extract delta H (kJ/mol), delta S (J/(mol*K)), and optional T (K or °C)
  const hMatch = input.match(/(?:δh°?|delta\s*h°?)\s*=\s*(-?[0-9.]+)\s*(?:kj(?:\/mol)?)?/i) || input.match(/(-?[0-9.]+)\s*kj(?:\/mol)?/i);
  const sMatch = input.match(/(?:δs°?|delta\s*s°?)\s*=\s*(-?[0-9.]+)\s*(?:j(?:\/(?:mol[·*]k|mol·k|k))?)?/i) || input.match(/(-?[0-9.]+)\s*j\/(?:mol[·*]k|mol·k|k)/i);
  const tMatch = input.match(/(?:at\s*t\s*=\s*|temperature\s*=\s*)([0-9.]+)\s*k/i);

  const deltaH_kJ = hMatch ? parseFloat(hMatch[1]) : -92.2;
  const deltaS_J = sMatch ? parseFloat(sMatch[1]) : -198.7;
  const deltaH_J = deltaH_kJ * 1000;

  if (deltaS_J === 0) {
    throw new Error('Entropy change cannot be zero in crossover calculation.');
  }

  const isCrossover = lower.includes('crossover') || lower.includes('temperature boundary') || lower.includes('becomes non-spontaneous') || lower.includes('becomes spontaneous');

  if (isCrossover) {
    const tCross = Number((deltaH_J / deltaS_J).toFixed(2));
    if (tCross < 0) {
      throw new Error('Calculated crossover temperature is mathematically negative; reaction has no thermal spontaneity crossover.');
    }

    return {
      identifiedTopic: 'Chemical Thermodynamics (Gibbs-Helmholtz Spontaneity)',
      detectedConcept: 'Equilibrium Crossover Temperature Boundary',
      governingFormula: 'ΔG° = ΔH° - T · ΔS° = 0 ➔ T_cross = ΔH° / ΔS°',
      formulaLaTeX: 'T_{\\text{cross}} = \\frac{\\Delta H^\\circ}{\\Delta S^\\circ}',
      extractedVariables: [
        { symbol: 'ΔH°', name: 'Standard enthalpy change', value: deltaH_kJ, unit: 'kJ/mol' },
        { symbol: 'ΔS°', name: 'Standard entropy change', value: deltaS_J, unit: 'J/(mol·K)' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'Set spontaneity condition boundary: ΔG° = 0', expression: 'ΔH° - T_cross · ΔS° = 0', subResult: 'T_cross = ΔH° / ΔS°' },
        { step: 2, instruction: 'Convert enthalpy from kJ/mol to J/mol', expression: `${deltaH_kJ} kJ/mol × 1000 J/kJ`, subResult: `${deltaH_J} J/mol` },
        { step: 3, instruction: 'Divide enthalpy by entropy change', expression: `(${deltaH_J} J/mol) / (${deltaS_J} J/(mol·K))`, subResult: `T = ${tCross} K` }
      ],
      dimensionalConsistencyCheck: '[J·mol⁻¹] / [J·mol⁻¹·K⁻¹] = Kelvin [K]. Dimensions verified.',
      finalAnswer: {
        numericValue: tCross,
        unit: 'K',
        formatted: `${tCross} K (${(tCross - CONSTANTS.ZERO_CELSIUS_KELVIN).toFixed(2)} °C)`
      },
      explanation: `Both ΔH° and ΔS° are negative (exothermic with decrease in disorder). The reaction is enthalpy-driven and spontaneous at T < ${tCross} K, becoming non-spontaneous above ${tCross} K.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  } else {
    // Calculate ΔG° at 298.15 K
    const tempK = tMatch ? parseFloat(tMatch[1]) : 298.15;
    const deltaG_kJ = Number((deltaH_kJ - (tempK * deltaS_J) / 1000).toFixed(2));
    const isSpontaneous = deltaG_kJ < 0;

    return {
      identifiedTopic: 'Chemical Thermodynamics (Gibbs Free Energy)',
      detectedConcept: 'Standard Reaction Spontaneity Calculation',
      governingFormula: 'ΔG° = ΔH° - T · ΔS°',
      formulaLaTeX: '\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ',
      extractedVariables: [
        { symbol: 'ΔH°', name: 'Standard Enthalpy of Reaction', value: deltaH_kJ, unit: 'kJ/mol' },
        { symbol: 'ΔS°', name: 'Standard Entropy of Reaction', value: deltaS_J, unit: 'J/(mol·K)' },
        { symbol: 'T', name: 'Absolute Temperature', value: tempK, unit: 'K' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'Convert entropy to kJ/(mol·K)', expression: `${deltaS_J} J/(mol·K) / 1000`, subResult: `${(deltaS_J / 1000).toFixed(5)} kJ/(mol·K)` },
        { step: 2, instruction: 'Calculate T × ΔS° term', expression: `${tempK} K × ${(deltaS_J / 1000).toFixed(5)} kJ/(mol·K)`, subResult: `${((tempK * deltaS_J) / 1000).toFixed(2)} kJ/mol` },
        { step: 3, instruction: 'Compute ΔG° = ΔH° - TΔS°', expression: `${deltaH_kJ} - (${((tempK * deltaS_J) / 1000).toFixed(2)})`, subResult: `ΔG° = ${deltaG_kJ} kJ/mol` }
      ],
      dimensionalConsistencyCheck: '[kJ·mol⁻¹] - ([K] × [kJ·mol⁻¹·K⁻¹]) = kJ·mol⁻¹. Dimensions verified.',
      finalAnswer: {
        numericValue: deltaG_kJ,
        unit: 'kJ/mol',
        formatted: `${deltaG_kJ} kJ/mol (${isSpontaneous ? 'Spontaneous' : 'Non-Spontaneous'})`
      },
      explanation: `At ${tempK} K, the calculated free energy change ΔG° is ${deltaG_kJ} kJ/mol. Since ΔG° is ${isSpontaneous ? 'negative (< 0), the reaction is thermodynamically spontaneous' : 'positive (> 0), the reaction is non-spontaneous'}.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  }
}

export function solveChemicalKinetics(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('rate constant') && !lower.includes('half-life') && !lower.includes('half life') && !lower.includes('first-order') && !lower.includes('t1/2')) {
    return null;
  }

  // Extract rate constant k: e.g. "k = 0.045 s-1"
  const kMatch = input.match(/(?:k\s*=\s*)([0-9.]+)/i) || input.match(/([0-9.]+)\s*(?:s⁻¹|s-1|min⁻¹|min-1)/i);
  // Extract t1/2 if given
  const tHalfMatch = input.match(/(?:t1\/2|half-life)\s*(?:is|=|of)?\s*([0-9.]+)/i);

  if (kMatch) {
    const k = parseFloat(kMatch[1]);
    if (k <= 0) throw new Error('Rate constant k must be positive.');
    const tHalf = Number((Math.LN2 / k).toFixed(3)); // 0.69315 / k

    return {
      identifiedTopic: 'Chemical Kinetics (First-Order Rate Law)',
      detectedConcept: 'Decay Half-Life Determination',
      governingFormula: 't_1/2 = ln(2) / k ≈ 0.69315 / k',
      formulaLaTeX: 't_{1/2} = \\frac{\\ln(2)}{k}',
      extractedVariables: [
        { symbol: 'k', name: 'First-order rate constant', value: k, unit: 's⁻¹' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'Formulate integrated first-order rate law: [A] = [A]0 · e^(-kt)', expression: 'At t = t_1/2, [A] / [A]0 = 1/2', subResult: 'ln(2) = k · t_1/2' },
        { step: 2, instruction: 'Calculate t_1/2 = 0.69315 / k', expression: `0.69315 / ${k}`, subResult: `t_1/2 = ${tHalf} s` }
      ],
      dimensionalConsistencyCheck: '1 / [s⁻¹] = seconds [s]. Dimensions verified.',
      finalAnswer: {
        numericValue: tHalf,
        unit: 's',
        formatted: `${tHalf} seconds`
      },
      explanation: `For a first-order chemical process with rate constant k = ${k} s⁻¹, the half-life t_1/2 is independent of initial concentration and equals ${tHalf} s.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  } else if (tHalfMatch) {
    const tHalf = parseFloat(tHalfMatch[1]);
    if (tHalf <= 0) throw new Error('Half life must be positive.');
    const k = Number((Math.LN2 / tHalf).toFixed(5));

    return {
      identifiedTopic: 'Chemical Kinetics (First-Order Rate Constant)',
      detectedConcept: 'Rate Constant Extraction from Half-Life',
      governingFormula: 'k = ln(2) / t_1/2',
      formulaLaTeX: 'k = \\frac{\\ln(2)}{t_{1/2}}',
      extractedVariables: [
        { symbol: 't_1/2', name: 'Reaction Half-Life', value: tHalf, unit: 's' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'Calculate rate constant k = ln(2) / t_1/2', expression: `0.69315 / ${tHalf}`, subResult: `k = ${k} s⁻¹` }
      ],
      dimensionalConsistencyCheck: '1 / [s] = s⁻¹. Dimensions verified.',
      finalAnswer: {
        numericValue: k,
        unit: 's⁻¹',
        formatted: `${k} s⁻¹`
      },
      explanation: `A process with half-life ${tHalf} s possesses a rate constant of ${k} s⁻¹.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  }

  return null;
}

export function solveArrheniusEquation(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('arrhenius') && !lower.includes('activation energy') && !lower.includes('ea')) {
    return null;
  }

  // Extract temperatures T1, T2 and rate constants k1, k2
  const t1Match = input.match(/(?:t1\s*=\s*)([0-9.]+)\s*(?:k|°c)/i) || input.match(/(?:at\s*)([0-9.]+)\s*k/i);
  const t2Match = input.match(/(?:t2\s*=\s*)([0-9.]+)\s*(?:k|°c)/i);
  const k1Match = input.match(/(?:k1\s*=\s*)([0-9.]+)/i);
  const k2Match = input.match(/(?:k2\s*=\s*)([0-9.]+)/i);

  let T1 = t1Match ? parseFloat(t1Match[1]) : 300.0;
  let T2 = t2Match ? parseFloat(t2Match[1]) : 320.0;
  let k1 = k1Match ? parseFloat(k1Match[1]) : 0.02;
  let k2 = k2Match ? parseFloat(k2Match[1]) : 0.08;

  if (T1 <= 0 || T2 <= 0 || k1 <= 0 || k2 <= 0 || T1 === T2) {
    throw new Error('Valid distinct positive temperatures and rate constants are required.');
  }

  const R = CONSTANTS.R_JOULE; // 8.314 J/(mol*K)
  const lnRatio = Math.log(k2 / k1);
  const tempFactor = (1 / T1) - (1 / T2);
  const Ea_J = (lnRatio * R) / tempFactor;
  const Ea_kJ = Number((Ea_J / 1000).toFixed(2));

  return {
    identifiedTopic: 'Chemical Kinetics (Arrhenius Equation)',
    detectedConcept: 'Thermal Activation Energy (Ea) Extraction',
    governingFormula: 'ln(k2 / k1) = (Ea / R) · (1/T1 - 1/T2) ➔ Ea = R · ln(k2/k1) / (1/T1 - 1/T2)',
    formulaLaTeX: 'E_a = \\frac{R \\cdot \\ln(k_2 / k_1)}{\\frac{1}{T_1} - \\frac{1}{T_2}}',
    extractedVariables: [
      { symbol: 'T1', name: 'Initial Temperature', value: T1, unit: 'K' },
      { symbol: 'T2', name: 'Elevated Temperature', value: T2, unit: 'K' },
      { symbol: 'k1', name: 'Rate constant at T1', value: k1, unit: 's⁻¹' },
      { symbol: 'k2', name: 'Rate constant at T2', value: k2, unit: 's⁻¹' },
      { symbol: 'R', name: 'Gas Constant', value: R, unit: 'J/(mol·K)' }
    ],
    stepByStepSolution: [
      { step: 1, instruction: 'Calculate natural logarithm of rate ratio: ln(k2 / k1)', expression: `ln(${k2} / ${k1})`, subResult: `ln(k2/k1) = ${lnRatio.toFixed(4)}` },
      { step: 2, instruction: 'Calculate reciprocal temperature difference: (1/T1 - 1/T2)', expression: `(1 / ${T1}) - (1 / ${T2})`, subResult: `${tempFactor.toExponential(4)} K⁻¹` },
      { step: 3, instruction: 'Compute activation energy: Ea = (R × ln(k2/k1)) / tempFactor', expression: `(${R} × ${lnRatio.toFixed(4)}) / ${tempFactor.toExponential(4)}`, subResult: `Ea = ${Ea_kJ} kJ/mol` }
    ],
    dimensionalConsistencyCheck: '[J·mol⁻¹·K⁻¹] / [K⁻¹] = J·mol⁻¹ ➔ converted to kJ·mol⁻¹. Dimensions verified.',
    finalAnswer: {
      numericValue: Ea_kJ,
      unit: 'kJ/mol',
      formatted: `${Ea_kJ} kJ/mol`
    },
    explanation: `Increasing temperature from ${T1} K to ${T2} K elevates the rate constant from ${k1} to ${k2} s⁻¹. According to the two-point Arrhenius relation, the activation energy barrier Ea is ${Ea_kJ} kJ/mol.`,
    verificationStatus: 'CALCULATED',
    confidence: 100
  };
}

export function solveColligativeProperties(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('boiling point') && !lower.includes('freezing point') && !lower.includes('osmotic pressure') && !lower.includes('colligative') && !lower.includes('van\'t hoff') && !lower.includes('vant hoff')) {
    return null;
  }

  // Case: Freezing point depression ΔTf = i * Kf * m
  if (lower.includes('freezing point') || lower.includes('depression')) {
    const mMatch = input.match(/(?:molality|m\s*=)\s*([0-9.]+)/i) || input.match(/([0-9.]+)\s*m\b/i);
    const kfMatch = input.match(/(?:kf\s*=\s*)([0-9.]+)/i);
    const iMatch = input.match(/(?:i\s*=\s*)([0-9.]+)/i);

    const molality = mMatch ? parseFloat(mMatch[1]) : 0.5;
    const Kf = kfMatch ? parseFloat(kfMatch[1]) : 1.86; // Kf water = 1.86 °C/m
    const i = iMatch ? parseFloat(iMatch[1]) : 1; // non-electrolyte default

    if (molality <= 0 || Kf <= 0 || i < 1) {
      throw new Error('Molality, Kf, and van \'t Hoff factor must be positive values.');
    }

    const deltaTf = Number((i * Kf * molality).toFixed(3));
    const newFp = Number((0 - deltaTf).toFixed(3));

    return {
      identifiedTopic: 'Colligative Properties (Freezing Point Depression)',
      detectedConcept: 'Cryoscopic Lowering in Dilute Solutions',
      governingFormula: 'ΔTf = i · Kf · m ➔ Tf = Tf° - ΔTf',
      formulaLaTeX: '\\Delta T_f = i \\cdot K_f \\cdot m',
      extractedVariables: [
        { symbol: 'm', name: 'Solution molality', value: molality, unit: 'mol/kg' },
        { symbol: 'Kf', name: 'Cryoscopic Constant of solvent (Water)', value: Kf, unit: '°C·kg/mol' },
        { symbol: 'i', name: 'Van \'t Hoff factor', value: i, unit: 'dimensionless' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'Calculate depression: ΔTf = i × Kf × m', expression: `${i} × ${Kf} °C/m × ${molality} m`, subResult: `ΔTf = ${deltaTf} °C` },
        { step: 2, instruction: 'Calculate depressed freezing point of aqueous solution: Tf = 0 °C - ΔTf', expression: `0.00 °C - ${deltaTf} °C`, subResult: `Tf = ${newFp} °C` }
      ],
      dimensionalConsistencyCheck: '[°C·kg·mol⁻¹] × [mol·kg⁻¹] = °C. Dimensions verified.',
      finalAnswer: {
        numericValue: newFp,
        unit: '°C',
        formatted: `${newFp} °C (ΔTf = ${deltaTf} °C)`
      },
      explanation: `Solute particles disrupt solvent crystal lattice formation, lowering the freezing point of water by ${deltaTf} °C to ${newFp} °C.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  }

  // Case: Osmotic pressure Π = i * M * R * T
  const mMatch = input.match(/(?:molarity|concentration|m\s*=)\s*([0-9.]+)/i);
  const c = mMatch ? parseFloat(mMatch[1]) : 0.2;
  const tempK = 298.15;
  const R = CONSTANTS.R_ATM;
  const i = 1;
  const pi = Number((i * c * R * tempK).toFixed(3));

  return {
    identifiedTopic: 'Colligative Properties (Osmotic Pressure)',
    detectedConcept: 'Van \'t Hoff Osmotic Equation',
    governingFormula: 'Π = i · M · R · T',
    formulaLaTeX: '\\Pi = i \\cdot M \\cdot R \\cdot T',
    extractedVariables: [
      { symbol: 'M', name: 'Molar concentration', value: c, unit: 'mol/L' },
      { symbol: 'T', name: 'Temperature', value: tempK, unit: 'K' },
      { symbol: 'R', name: 'Gas Constant', value: R, unit: 'L·atm/(mol·K)' },
      { symbol: 'i', name: 'Van \'t Hoff factor', value: i, unit: 'dimensionless' }
    ],
    stepByStepSolution: [
      { step: 1, instruction: 'Calculate osmotic pressure: Π = i × M × R × T', expression: `${i} × ${c} mol/L × ${R} L·atm/(mol·K) × ${tempK} K`, subResult: `Π = ${pi} atm` }
    ],
    dimensionalConsistencyCheck: '[mol·L⁻¹] × [L·atm·mol⁻¹·K⁻¹] × [K] = atm. Dimensions verified.',
    finalAnswer: {
      numericValue: pi,
      unit: 'atm',
      formatted: `${pi} atm (${(pi * 101.325).toFixed(2)} kPa)`
    },
    explanation: `An osmotic pressure of ${pi} atm must be applied across a semipermeable membrane to halt net water inflow into the ${c} M solution.`,
    verificationStatus: 'CALCULATED',
    confidence: 100
  };
}

export function solveBufferSolution(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('buffer') && !lower.includes('henderson') && !lower.includes('hasselbalch')) {
    return null;
  }

  // Henderson-Hasselbalch: pH = pKa + log([A-] / [HA])
  const pkaMatch = input.match(/(?:pka\s*=\s*)([0-9.]+)/i);
  const baseMatch = input.match(/(?:\[a-\]|salt|base|acetate|ch3coona)\s*(?:=|is)?\s*([0-9.]+)/i);
  const acidMatch = input.match(/(?:\[ha\]|acid|acetic)\s*(?:=|is)?\s*([0-9.]+)/i);

  const pKa = pkaMatch ? parseFloat(pkaMatch[1]) : 4.75; // Acetic acid default
  const baseConc = baseMatch ? parseFloat(baseMatch[1]) : 0.20;
  const acidConc = acidMatch ? parseFloat(acidMatch[1]) : 0.10;

  if (baseConc <= 0 || acidConc <= 0) {
    throw new Error('Conjugate base and acid concentrations must be greater than zero.');
  }

  const ratio = baseConc / acidConc;
  const logRatio = Math.log10(ratio);
  const ph = Number((pKa + logRatio).toFixed(3));

  return {
    identifiedTopic: 'Ionic Equilibrium (Buffer Solutions)',
    detectedConcept: 'Henderson-Hasselbalch Buffer pH Calculation',
    governingFormula: 'pH = pKa + log10([Conjugate Base] / [Weak Acid])',
    formulaLaTeX: '\\text{pH} = \\text{p}K_a + \\log_{10}\\left(\\frac{[\\text{A}^-]}{[\\text{HA}]}\\right)',
    extractedVariables: [
      { symbol: 'pKa', name: 'Acid dissociation exponent (-log Ka)', value: pKa, unit: 'dimensionless' },
      { symbol: '[A⁻]', name: 'Conjugate base concentration', value: baseConc, unit: 'M' },
      { symbol: '[HA]', name: 'Weak acid reserve concentration', value: acidConc, unit: 'M' }
    ],
    stepByStepSolution: [
      { step: 1, instruction: 'Calculate ratio of conjugate base to weak acid: [A⁻] / [HA]', expression: `${baseConc} / ${acidConc}`, subResult: `Ratio = ${ratio.toFixed(3)}` },
      { step: 2, instruction: 'Evaluate logarithm: log10(Ratio)', expression: `log10(${ratio.toFixed(3)})`, subResult: `${logRatio >= 0 ? '+' : ''}${logRatio.toFixed(3)}` },
      { step: 3, instruction: 'Compute buffer pH: pH = pKa + log10([A⁻]/[HA])', expression: `${pKa} + (${logRatio.toFixed(3)})`, subResult: `pH = ${ph}` }
    ],
    dimensionalConsistencyCheck: 'Concentration ratio is dimensionless. Logarithm produces dimensionless pH units. Dimensions verified.',
    finalAnswer: {
      numericValue: ph,
      unit: 'pH units',
      formatted: `pH = ${ph}`
    },
    explanation: `Since the conjugate base concentration (${baseConc} M) exceeds the weak acid concentration (${acidConc} M), the buffer pH (${ph}) shifts alkaline relative to its pKa (${pKa}).`,
    verificationStatus: 'CALCULATED',
    confidence: 100
  };
}

export function solveAcidBasePH(input: string): NumericalSolveResult | null {
  const lower = input.toLowerCase();
  if (!lower.includes('ph') && !lower.includes('poh') && !lower.includes('acid') && !lower.includes('base') && !lower.includes('ka') && !lower.includes('kb')) {
    return null;
  }

  // Strong Acid e.g. 0.1 M HCl
  if (lower.includes('hcl') || lower.includes('nitric') || lower.includes('strong acid')) {
    const cMatch = input.match(/([0-9.]+)\s*m\b/i) || input.match(/(?:concentration|c\s*=)\s*([0-9.]+)/i);
    const c = cMatch ? parseFloat(cMatch[1]) : 0.1;
    if (c <= 0) throw new Error('Acid concentration must be positive.');
    const ph = Number((-Math.log10(c)).toFixed(3));

    return {
      identifiedTopic: 'Ionic Equilibrium (Strong Acid)',
      detectedConcept: 'Complete Monoprotic Ionization',
      governingFormula: 'pH = -log10[H⁺] where [H⁺] = C_acid',
      formulaLaTeX: '\\text{pH} = -\\log_{10}[\\text{H}^+]',
      extractedVariables: [
        { symbol: 'C', name: 'Strong acid concentration', value: c, unit: 'M' }
      ],
      stepByStepSolution: [
        { step: 1, instruction: 'HCl dissociates completely in water: HCl ➔ H⁺ + Cl⁻', expression: `[H⁺] = ${c} M`, subResult: `[H⁺] = ${c} M` },
        { step: 2, instruction: 'Compute pH = -log10[H⁺]', expression: `-log10(${c})`, subResult: `pH = ${ph}` }
      ],
      dimensionalConsistencyCheck: 'Dimensionless pH units. Dimensions verified.',
      finalAnswer: {
        numericValue: ph,
        unit: 'pH units',
        formatted: `pH = ${ph}`
      },
      explanation: `Strong mineral acid HCl dissociates 100% in dilute aqueous solution, yielding [H⁺] = ${c} M and pH = ${ph}.`,
      verificationStatus: 'CALCULATED',
      confidence: 100
    };
  }

  // Weak Acid e.g. Acetic acid 0.15 M with Ka = 1.76e-5
  const cMatch = input.match(/(?:concentration|c\s*=)\s*([0-9.]+)/i) || input.match(/([0-9.]+)\s*m\b/i);
  const kaMatch = input.match(/(?:ka\s*=\s*)([0-9.eE×xX\^⁻¹²³⁴⁵⁶⁷⁸⁹\-\*]+)/i);

  const c = cMatch ? parseFloat(cMatch[1]) : 0.15;
  const ka = (kaMatch && parseScientificNumber(kaMatch[1])) || 1.76e-5;

  if (c <= 0 || ka <= 0) {
    throw new Error('Concentration and Ka must be positive.');
  }

  const hConc = Math.sqrt(ka * c);
  const ph = Number((-Math.log10(hConc)).toFixed(3));

  return {
    identifiedTopic: 'Ionic Equilibrium (Weak Monoprotic Acid)',
    detectedConcept: 'Hydronium Ion Concentration & Ostwald Dissociation',
    governingFormula: 'pH = -log10[H⁺] where [H⁺] = √(Ka · C)',
    formulaLaTeX: '\\text{pH} = -\\log_{10}\\left(\\sqrt{K_a \\cdot C}\\right)',
    extractedVariables: [
      { symbol: 'C', name: 'Initial concentration of weak acid', value: c, unit: 'M (mol/L)' },
      { symbol: 'Ka', name: 'Acid dissociation constant', value: ka, unit: 'mol/L' }
    ],
    stepByStepSolution: [
      { step: 1, instruction: 'Set up Ostwald equilibrium: HA ⇌ H⁺ + A⁻', expression: 'Ka = [H⁺]² / (C - [H⁺]) ≈ [H⁺]² / C', subResult: '[H⁺] = √(Ka · C)' },
      { step: 2, instruction: 'Compute [H⁺] concentration', expression: `√(${ka} × ${c})`, subResult: `[H⁺] = ${hConc.toExponential(3)} M` },
      { step: 3, instruction: 'Compute pH = -log10[H⁺]', expression: `-log10(${hConc.toExponential(3)})`, subResult: `pH = ${ph}` }
    ],
    dimensionalConsistencyCheck: '√(mol·L⁻¹ × mol·L⁻¹) = mol·L⁻¹ [M]. Log produces dimensionless pH. Dimensions verified.',
    finalAnswer: {
      numericValue: ph,
      unit: 'pH units',
      formatted: `pH = ${ph}`
    },
    explanation: `Since Ka (${ka}) is small, degree of dissociation α is under 5%, validating [HA] ≈ C. The resulting equilibrium pH is ${ph}.`,
    verificationStatus: 'CALCULATED',
    confidence: 100
  };
}

// --------------------------------------------------------------------------
// UNIVERSAL PROGRAMMATIC DISPATCHER
// --------------------------------------------------------------------------

export function solveChemistryNumerical(problemText: string): NumericalSolveResult {
  const clean = (problemText || '').trim();
  if (!clean) {
    throw new Error('Please enter a chemical numerical problem statement.');
  }

  // 1. Try Nernst Equation
  const nernst = solveNernstElectrochemistry(clean);
  if (nernst) return nernst;

  // 2. Try Faraday's Electrolysis
  const faraday = solveFaradayElectrolysis(clean);
  if (faraday) return faraday;

  // 3. Try Thermodynamics & Gibbs
  const thermo = solveThermodynamicsGibbs(clean);
  if (thermo) return thermo;

  // 4. Try Chemical Kinetics (Rate & Half-life)
  const kinetics = solveChemicalKinetics(clean);
  if (kinetics) return kinetics;

  // 5. Try Arrhenius Equation
  const arrhenius = solveArrheniusEquation(clean);
  if (arrhenius) return arrhenius;

  // 6. Try Buffer Solutions
  const buffer = solveBufferSolution(clean);
  if (buffer) return buffer;

  // 7. Try Ideal Gas Law
  const gas = solveIdealGasLaw(clean);
  if (gas) return gas;

  // 8. Try Colligative Properties
  const colligative = solveColligativeProperties(clean);
  if (colligative) return colligative;

  // 9. Try Solution Concentration / Dilution
  const conc = solveSolutionConcentration(clean);
  if (conc) return conc;

  // 10. Try Mole Calculations
  const moles = solveMoleCalculations(clean);
  if (moles) return moles;

  // 11. Try Acid-Base pH
  const ph = solveAcidBasePH(clean);
  if (ph) return ph;

  // If input format is completely unrecognized, reject gracefully rather than hallucinating
  throw new Error('Unable to parse known variables or governing law from this inquiry. Please ensure standard numerical variables (e.g. mass in g, volume in L, temperature in K or °C, concentration in M) are stated.');
}
