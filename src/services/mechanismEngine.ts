/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChemiZIC Reaction Mechanism Engine
 * Provides scientifically curated, step-by-step reaction mechanism data.
 * Covers major organic, inorganic and physical chemistry reaction types.
 */

export type MechanismStepType =
  | 'bond_breaking'
  | 'bond_forming'
  | 'proton_transfer'
  | 'electron_shift'
  | 'nucleophilic_attack'
  | 'electrophilic_attack'
  | 'elimination'
  | 'rearrangement'
  | 'oxidation'
  | 'reduction'
  | 'complexation'
  | 'acid_base';

export interface MechanismStep {
  stepNumber: number;
  title: string;
  description: string;
  species: string[];           // Species present at this step
  intermediates: string[];     // Intermediates formed
  electronMovement?: string;   // Arrow-pushing description
  whyItHappens: string;
  type: MechanismStepType;
  energyNote?: string;
}

export interface ReactionMechanism {
  id: string;
  name: string;
  aliases: string[];           // e.g. "SN2", "backside attack"
  reactionType: string;        // "Nucleophilic Substitution"
  subType: string;             // "Bimolecular (SN2)"
  branch: 'Organic' | 'Inorganic' | 'Physical' | 'Biochemistry';
  
  // Key participants
  startingMaterials: string[];
  reagents: string[];
  conditions: string;
  products: string[];
  byProducts: string[];
  
  // Mechanism details
  nucleophile?: string;
  electrophile?: string;
  leavingGroup?: string;
  catalyst?: string;
  catalystRole?: string;
  
  // Step-by-step
  steps: MechanismStep[];
  
  // Summary data
  balancedEquation: string;
  overallReactionType: string;
  stereochemistry?: string;
  regioselectivity?: string;
  
  // Educational metadata
  whyThisReaction: string;
  keyInsights: string[];
  commonMistakes: string[];
  examTips: string[];
  
  // Verification
  verificationStatus: 'VERIFIED' | 'PREDICTED' | 'AI-GENERATED';
  confidence: number;
  educationLevels: string[];
}

// ============================================================
// CURATED MECHANISM DATABASE
// ============================================================

export const MECHANISM_DATABASE: ReactionMechanism[] = [

  // ─────────────────────────────────────────────────────────────
  // SN2 — Bimolecular Nucleophilic Substitution
  // ─────────────────────────────────────────────────────────────
  {
    id: 'sn2_ch3br_oh',
    name: 'SN2 Nucleophilic Substitution',
    aliases: ['sn2', 'bimolecular nucleophilic substitution', 'backside attack', 'ch3br + naoh', 'ch3br + oh'],
    reactionType: 'Nucleophilic Substitution',
    subType: 'Bimolecular (SN2)',
    branch: 'Organic',
    startingMaterials: ['CH₃Br (Bromomethane)'],
    reagents: ['NaOH (aq) — provides OH⁻ nucleophile'],
    conditions: 'Aqueous NaOH, room temperature, polar protic solvent',
    products: ['CH₃OH (Methanol)'],
    byProducts: ['NaBr (Sodium bromide)'],
    nucleophile: 'OH⁻ (Hydroxide ion)',
    electrophile: 'Carbon bonded to the leaving group (C–Br carbon)',
    leavingGroup: 'Br⁻ (Bromide ion)',
    catalyst: undefined,
    catalystRole: undefined,
    balancedEquation: 'CH₃Br + NaOH → CH₃OH + NaBr',
    overallReactionType: 'Nucleophilic Substitution (SN2)',
    stereochemistry: 'Walden inversion — if chiral centre present, configuration inverts (backside attack gives inversion of configuration).',
    steps: [
      {
        stepNumber: 1,
        title: 'Nucleophile Approach',
        description: 'OH⁻ approaches the back face of the electrophilic carbon (C–Br) at 180° to the C–Br bond.',
        species: ['CH₃Br', 'OH⁻'],
        intermediates: [],
        electronMovement: 'Lone pair on O of OH⁻ attacks backside of C. Simultaneously, electrons of C–Br begin to shift toward Br.',
        whyItHappens: 'Carbon is electrophilic due to the electronegative Br withdrawing electron density. OH⁻ is a strong nucleophile attracted to this partial positive charge on carbon.',
        type: 'nucleophilic_attack',
        energyNote: 'Single concerted transition state (no intermediate). Energy barrier corresponds to the activation energy.'
      },
      {
        stepNumber: 2,
        title: 'Transition State',
        description: 'Pentacoordinate trigonal bipyramidal transition state forms with partial bonds to both OH and Br.',
        species: ['[HO---CH₃---Br]⁻ ‡ (Transition State)'],
        intermediates: ['Pentacoordinate transition state [HO---CH₃---Br]⁻'],
        electronMovement: 'C–O bond is partially formed; C–Br bond is partially broken. Negative charge delocalized across O···C···Br.',
        whyItHappens: 'This is the highest energy point on the reaction coordinate. There is no discrete intermediate — the bond making and bond breaking are simultaneous (concerted).',
        type: 'bond_forming',
        energyNote: 'This is the rate-determining transition state. Rate = k[CH₃Br][OH⁻].'
      },
      {
        stepNumber: 3,
        title: 'Leaving Group Departure',
        description: 'Br⁻ departs as the C–O bond fully forms. Inversion of configuration occurs.',
        species: ['CH₃OH', 'Br⁻'],
        intermediates: [],
        electronMovement: 'C–Br bond electrons fully shift to Br, forming Br⁻. C–O bond completes.',
        whyItHappens: 'Br⁻ is a stable, weak base and an excellent leaving group (pKa of HBr = −9). The thermodynamic driving force is formation of a stronger C–O bond in place of the weaker C–Br bond.',
        type: 'bond_breaking',
        energyNote: 'Exothermic step. Products are more stable than reactants.'
      }
    ],
    whyThisReaction: 'SN2 is favoured with primary (methyl > primary > secondary) substrates where backside attack is sterically accessible, and with strong nucleophiles in polar aprotic solvents.',
    keyInsights: [
      'Rate = k[substrate][nucleophile] — bimolecular kinetics',
      'Walden inversion: configuration inverts at the reaction centre',
      'Primary substrates react fastest; tertiary substrates do not react via SN2',
      'Polar aprotic solvents (DMF, DMSO, acetone) enhance SN2 by not stabilising nucleophile',
      'Good leaving groups: I⁻ > Br⁻ > Cl⁻ > F⁻ (leaving group ability)'
    ],
    commonMistakes: [
      'Confusing SN2 (concerted) with SN1 (stepwise via carbocation)',
      'Thinking that SN2 can occur at tertiary carbons easily',
      'Forgetting that polar protic solvents slow SN2 (they solvate and stabilise nucleophile)'
    ],
    examTips: [
      'Methyl and primary → SN2 preferred; tertiary → SN1 preferred; secondary → depends on nucleophile strength',
      'Strong nucleophile + primary substrate = SN2',
      'Walden inversion is signature of SN2 — if asked about stereochemical outcome'
    ],
    verificationStatus: 'VERIFIED',
    confidence: 98,
    educationLevels: ['CLASS_12', 'BSC', 'MSC']
  },

  // ─────────────────────────────────────────────────────────────
  // SN1 — Unimolecular Nucleophilic Substitution
  // ─────────────────────────────────────────────────────────────
  {
    id: 'sn1_tertiary',
    name: 'SN1 Nucleophilic Substitution',
    aliases: ['sn1', 'unimolecular nucleophilic substitution', 'carbocation intermediate', 't-butyl bromide + water'],
    reactionType: 'Nucleophilic Substitution',
    subType: 'Unimolecular (SN1)',
    branch: 'Organic',
    startingMaterials: ['(CH₃)₃CBr (tert-Butyl bromide)'],
    reagents: ['H₂O (water — weak nucleophile)', 'or: Aqueous ethanol'],
    conditions: 'Polar protic solvent (water/ethanol), room temperature',
    products: ['(CH₃)₃COH (tert-Butanol)'],
    byProducts: ['HBr'],
    nucleophile: 'H₂O (water) — weak nucleophile',
    electrophile: 'tert-Butyl carbocation (CH₃)₃C⁺',
    leavingGroup: 'Br⁻ (Bromide ion)',
    balancedEquation: '(CH₃)₃CBr + H₂O → (CH₃)₃COH + HBr',
    overallReactionType: 'Nucleophilic Substitution (SN1)',
    stereochemistry: 'Racemization — planar carbocation attacked from both faces gives racemic mixture.',
    steps: [
      {
        stepNumber: 1,
        title: 'Rate-Determining Ionisation (Leaving Group Departure)',
        description: 'The C–Br bond breaks heterolytically. Br⁻ leaves, forming a tertiary carbocation.',
        species: ['(CH₃)₃CBr'],
        intermediates: ['(CH₃)₃C⁺ (tert-Butyl carbocation)', 'Br⁻'],
        electronMovement: 'Br takes both electrons from C–Br bond to leave as Br⁻. C becomes carbocation (empty p orbital).',
        whyItHappens: 'Tertiary carbocation is stabilised by hyperconjugation and inductive donation from three methyl groups. Polar protic solvent stabilises both the carbocation (by ion-dipole) and Br⁻ (by hydrogen bonding).',
        type: 'bond_breaking',
        energyNote: 'This is the SLOW, rate-determining step. Rate = k[(CH₃)₃CBr] — unimolecular.'
      },
      {
        stepNumber: 2,
        title: 'Nucleophilic Attack on Carbocation',
        description: 'Water acts as nucleophile and attacks the planar (sp²) tertiary carbocation from either face.',
        species: ['(CH₃)₃C⁺', 'H₂O'],
        intermediates: ['(CH₃)₃C–OH₂⁺ (Protonated tert-butanol, oxonium ion)'],
        electronMovement: 'Lone pair on O of H₂O attacks empty p orbital on C⁺. New C–O bond forms.',
        whyItHappens: 'The carbocation is highly electrophilic. The FAST step does not affect the rate. Attack from both faces of the planar sp² C⁺ leads to racemization.',
        type: 'nucleophilic_attack',
        energyNote: 'Fast step — occurs after rate-determining ionisation.'
      },
      {
        stepNumber: 3,
        title: 'Proton Transfer (Deprotonation)',
        description: 'The oxonium ion intermediate loses a proton to solvent or Br⁻ to give the alcohol product.',
        species: ['(CH₃)₃C–OH₂⁺', 'Br⁻ or H₂O'],
        intermediates: [],
        electronMovement: 'O–H bond breaks, electron pair goes to oxygen. Proton accepted by Br⁻ or water.',
        whyItHappens: 'Oxygen carries a positive formal charge in the oxonium intermediate. Proton loss restores neutral product.',
        type: 'proton_transfer'
      }
    ],
    whyThisReaction: 'SN1 is favoured at tertiary and secondary substrates where stable carbocations can form, and in polar protic solvents that stabilise the ion pair.',
    keyInsights: [
      'Rate = k[substrate] — only substrate in rate law',
      'Carbocation intermediate is the key species',
      'Tertiary > secondary > primary for carbocation stability',
      'Polar protic solvents (H₂O, ROH) stabilise ions — favour SN1',
      'Racemization indicates SN1 pathway'
    ],
    commonMistakes: [
      'Including [nucleophile] in the SN1 rate law — it does not appear',
      'Forgetting that rearrangements (hydride/methyl shifts) can occur via carbocations',
      'Assuming only 50:50 racemization — slight inversion excess is common in practice'
    ],
    examTips: [
      'SN1 rate depends ONLY on substrate concentration',
      'Tertiary substrates → SN1; primary substrates → SN2',
      'Carbocation rearrangements are a hallmark clue of SN1'
    ],
    verificationStatus: 'VERIFIED',
    confidence: 98,
    educationLevels: ['CLASS_12', 'BSC', 'MSC']
  },

  // ─────────────────────────────────────────────────────────────
  // E2 — Bimolecular Elimination
  // ─────────────────────────────────────────────────────────────
  {
    id: 'e2_dehydrohalogenation',
    name: 'E2 Elimination (Dehydrohalogenation)',
    aliases: ['e2', 'bimolecular elimination', 'dehydrohalogenation', 'zaitsev', 'anti-periplanar elimination'],
    reactionType: 'Elimination',
    subType: 'Bimolecular (E2)',
    branch: 'Organic',
    startingMaterials: ['2-Bromopropane (CH₃CHBrCH₃)'],
    reagents: ['KOH in ethanol — strong base'],
    conditions: 'Alcoholic KOH, elevated temperature (50–80°C)',
    products: ['Propene (CH₃CH=CH₂) — Zaitsev product (more substituted alkene)'],
    byProducts: ['KBr', 'H₂O'],
    nucleophile: undefined,
    electrophile: undefined,
    leavingGroup: 'Br⁻',
    catalyst: undefined,
    balancedEquation: 'CH₃CHBrCH₃ + KOH (alc.) → CH₃CH=CH₂ + KBr + H₂O',
    overallReactionType: 'Bimolecular Elimination (E2)',
    stereochemistry: 'Anti-periplanar geometry required: H and Br must be anti (180°) — favours trans-alkene products from cyclic or acyclic systems where geometry allows.',
    regioselectivity: 'Zaitsev\'s Rule: more substituted (more stable) alkene preferentially formed.',
    steps: [
      {
        stepNumber: 1,
        title: 'Concerted Anti-Periplanar Elimination',
        description: 'Base (OH⁻/EtO⁻) abstracts a β-hydrogen anti-periplanar to the leaving group. Simultaneously, the C=C π bond forms and Br⁻ departs.',
        species: ['CH₃CHBrCH₃', 'OH⁻'],
        intermediates: [],
        electronMovement: 'Base lone pair → β-H; C–H electron pair → π bond (C=C); C–Br electrons → Br⁻. All bonds shift simultaneously — concerted.',
        whyItHappens: 'The anti-periplanar arrangement allows optimal p orbital overlap for π bond formation. Strong base at elevated temperature favours elimination over substitution.',
        type: 'elimination',
        energyNote: 'Concerted — single transition state, no intermediate. Rate = k[substrate][base].'
      }
    ],
    whyThisReaction: 'E2 is favoured when a strong base is used with secondary or tertiary substrates at elevated temperatures. It competes with SN2.',
    keyInsights: [
      'Requires anti-periplanar H and leaving group (180° dihedral)',
      'Rate = k[substrate][base] — bimolecular',
      'Zaitsev product is the major product (more substituted alkene)',
      'Hofmann product can be formed with bulky bases (e.g., t-BuOK)',
      'Temperature increase favours elimination over substitution'
    ],
    commonMistakes: [
      'Not recognising the anti-periplanar requirement',
      'Confusing Zaitsev (more substituted) with Hofmann (less substituted) selectivity',
      'Forgetting that E2 competes with SN2 at primary/secondary substrates'
    ],
    examTips: [
      'Alcoholic KOH = E2 (elimination); Aqueous KOH = SN2 (substitution)',
      'Zaitsev product = major alkene in E2',
      'Anti-periplanar geometry = trans-H and Br for reaction to proceed'
    ],
    verificationStatus: 'VERIFIED',
    confidence: 97,
    educationLevels: ['CLASS_12', 'BSC', 'MSC']
  },

  // ─────────────────────────────────────────────────────────────
  // Acid-Catalysed Esterification (Fischer)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'fischer_esterification',
    name: 'Acid-Catalysed Fischer Esterification',
    aliases: ['esterification', 'fischer esterification', 'acid catalyzed esterification', 'carboxylic acid + alcohol', 'ch3cooh + c2h5oh'],
    reactionType: 'Condensation',
    subType: 'Nucleophilic Acyl Substitution',
    branch: 'Organic',
    startingMaterials: ['CH₃COOH (Acetic acid)', 'C₂H₅OH (Ethanol)'],
    reagents: ['Conc. H₂SO₄ (acid catalyst)'],
    conditions: 'Conc. H₂SO₄, reflux, reversible equilibrium — driven forward by removing water or excess alcohol',
    products: ['CH₃COOC₂H₅ (Ethyl acetate)', 'H₂O'],
    byProducts: ['H₂O'],
    catalyst: 'H₂SO₄ (conc.)',
    catalystRole: 'Protonates the carbonyl oxygen of the carboxylic acid, activating the carbonyl carbon toward nucleophilic attack by the alcohol.',
    nucleophile: 'Ethanol (C₂H₅OH) — oxygen lone pair attacks carbonyl carbon',
    electrophile: 'Protonated carbonyl carbon of acetic acid',
    leavingGroup: 'H₂O (formed from OH of acid)',
    balancedEquation: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (cat. H₂SO₄, Δ)',
    overallReactionType: 'Reversible Acid-Catalysed Esterification',
    stereochemistry: 'Not applicable — no stereocentre created.',
    steps: [
      {
        stepNumber: 1,
        title: 'Protonation of Carbonyl Oxygen',
        description: 'H₂SO₄ donates a proton to the carbonyl oxygen of acetic acid, forming an oxocarbenium ion.',
        species: ['CH₃COOH', 'H⁺'],
        intermediates: ['CH₃C(=OH⁺)OH (Protonated acetic acid)'],
        electronMovement: 'Lone pair on C=O oxygen accepts H⁺. Positive charge delocalized over C=OH⁺ resonance structure.',
        whyItHappens: 'Protonation makes the carbonyl carbon much more electrophilic, enabling attack by the weak nucleophile alcohol.',
        type: 'proton_transfer'
      },
      {
        stepNumber: 2,
        title: 'Nucleophilic Attack by Alcohol',
        description: 'Oxygen lone pair of ethanol attacks the activated carbonyl carbon, forming a tetrahedral intermediate.',
        species: ['CH₃C(=OH⁺)OH', 'C₂H₅OH'],
        intermediates: ['CH₃C(OH)(OC₂H₅)(OH₂⁺) — Protonated tetrahedral intermediate'],
        electronMovement: 'O of EtOH lone pair → electrophilic C=O carbon. C becomes sp³ tetrahedral.',
        whyItHappens: 'The electrophilic carbonyl carbon is susceptible to nucleophilic addition. The oxygen lone pair of ethanol acts as the nucleophile.',
        type: 'nucleophilic_attack'
      },
      {
        stepNumber: 3,
        title: 'Proton Transfers to Facilitate Water Loss',
        description: 'Proton transfer within the tetrahedral intermediate converts the OH (from acid) into a better leaving group (OH₂⁺).',
        species: ['Tetrahedral intermediate'],
        intermediates: ['Rearranged tetrahedral intermediate with OH₂⁺ leaving'],
        electronMovement: 'Proton shifts from newly added ethanol oxygen to original OH group, converting it to water.',
        whyItHappens: 'Water (H₂O) is a far better leaving group than OH⁻. The proton transfer activates the departure of H₂O.',
        type: 'proton_transfer'
      },
      {
        stepNumber: 4,
        title: 'Elimination of Water',
        description: 'Water departs as a leaving group, re-forming the C=O (ester) and restoring sp² geometry.',
        species: ['Rearranged intermediate'],
        intermediates: ['CH₃C(=OH⁺)(OC₂H₅) — Protonated ester'],
        electronMovement: 'C–OH₂⁺ bond breaks, electrons form new C=O (ester carbonyl). H₂O leaves.',
        whyItHappens: 'The driving force is formation of the stable ester product and release of water.',
        type: 'bond_breaking'
      },
      {
        stepNumber: 5,
        title: 'Deprotonation — Product Formation',
        description: 'The protonated ester loses a proton (to water or conjugate base) to give the neutral ester product.',
        species: ['CH₃C(=OH⁺)(OC₂H₅)'],
        intermediates: [],
        electronMovement: 'Base (water or conjugate base) accepts proton from O of ester.',
        whyItHappens: 'Deprotonation restores the neutral ester and regenerates the acid catalyst.',
        type: 'proton_transfer'
      }
    ],
    whyThisReaction: 'Acid-catalysed esterification is the standard route to simple esters. The reaction is reversible — Le Chatelier\'s principle is used to drive equilibrium towards product.',
    keyInsights: [
      'Reversible reaction — equilibrium constant ~4 for CH₃COOH + EtOH',
      'Driven forward by removing water (Dean-Stark) or using excess alcohol',
      'H₂SO₄ is a catalyst — consumed in step 1, regenerated in step 5',
      '¹⁸O labelling studies confirm: water oxygen comes from the acid, not the alcohol',
      'Rate is enhanced by increased temperature (reflux condition)'
    ],
    commonMistakes: [
      'Thinking the alcohol oxygen is lost as water — it is the acid oxygen that leaves as H₂O',
      'Forgetting it is reversible — excess acid or alcohol is needed',
      'Assuming concentrated H₂SO₄ breaks C–O bond rather than O–H bond'
    ],
    examTips: [
      'Acid + Alcohol ⇌ Ester + Water (Fischer Esterification — reversible)',
      'Water is lost from the ACID\'s OH group (proven by ¹⁸O labelling)',
      'For board exams: "Conc. H₂SO₄, heat/reflux, equilibrium reaction"'
    ],
    verificationStatus: 'VERIFIED',
    confidence: 99,
    educationLevels: ['CLASS_12', 'BSC', 'MSC']
  },

  // ─────────────────────────────────────────────────────────────
  // Ethanol Dehydration to Ethene (Intramolecular Elimination)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ethanol_dehydration_ethene',
    name: 'Dehydration of Ethanol to Ethene',
    aliases: ['dehydration of ethanol', 'ethanol to ethene', 'ethanol dehydration 170', 'ethene synthesis from ethanol'],
    reactionType: 'Elimination',
    subType: 'Acid-Catalysed Intramolecular Dehydration',
    branch: 'Organic',
    startingMaterials: ['C₂H₅OH (Ethanol)'],
    reagents: ['Conc. H₂SO₄'],
    conditions: '170°C, excess conc. H₂SO₄',
    products: ['CH₂=CH₂ (Ethene)'],
    byProducts: ['H₂O'],
    catalyst: 'H₂SO₄',
    catalystRole: 'Protonates the OH group, converting it to a better leaving group (H₂O⁺), enabling β-H elimination.',
    leavingGroup: 'H₂O (protonated OH)',
    balancedEquation: 'C₂H₅OH → CH₂=CH₂ + H₂O (170°C, conc. H₂SO₄)',
    overallReactionType: 'Intramolecular Acid-Catalysed Elimination',
    steps: [
      {
        stepNumber: 1,
        title: 'Protonation of Hydroxyl Group',
        description: 'Conc. H₂SO₄ protonates the –OH group to give ethyloxonium ion.',
        species: ['C₂H₅OH', 'H⁺'],
        intermediates: ['C₂H₅OH₂⁺ (Ethyloxonium ion)'],
        electronMovement: 'H⁺ from H₂SO₄ attacks lone pair on oxygen of ethanol.',
        whyItHappens: 'Water (H₂O) is an excellent leaving group; OH⁻ is not. Protonation converts the poor leaving group OH into the excellent leaving group H₂O.',
        type: 'proton_transfer'
      },
      {
        stepNumber: 2,
        title: 'Loss of Water — Carbocation Formation',
        description: 'At 170°C water departs to give ethyl carbocation (CH₃CH₂⁺).',
        species: ['C₂H₅OH₂⁺'],
        intermediates: ['CH₃CH₂⁺ (Ethyl carbocation — primary, short-lived)', 'H₂O'],
        electronMovement: 'O–C bond breaks; electrons taken by O (as H₂O). C left with empty orbital (primary carbocation).',
        whyItHappens: 'At 170°C, sufficient energy available to overcome the instability of a primary carbocation. Higher temperature is required compared to secondary or tertiary.',
        type: 'bond_breaking'
      },
      {
        stepNumber: 3,
        title: 'Proton Loss — Elimination to Ethene',
        description: 'H₂SO₄ (or H₂O) abstracts the β-hydrogen, C=C π bond forms, ethene produced.',
        species: ['CH₃CH₂⁺', 'HSO₄⁻'],
        intermediates: [],
        electronMovement: 'β-C–H electrons shift → form π bond (C=C). H⁺ departs to HSO₄⁻.',
        whyItHappens: 'Loss of a proton gives the stable neutral alkene ethene. H₂SO₄ is regenerated as catalyst.',
        type: 'elimination'
      }
    ],
    whyThisReaction: 'Dehydration of alcohols is the industrial route to alkenes. Temperature controls selectivity: 140°C gives diethyl ether (intermolecular); 170°C gives ethene (intramolecular, elimination dominates).',
    keyInsights: [
      'Temperature dictates product: 140°C → ether; 170°C → alkene',
      'Conc. H₂SO₄ acts as catalyst — regenerated',
      'Larger alcohols can give multiple alkene regioisomers (Zaitsev rule)',
      'Industrial ethene production uses Al₂O₃ at 350°C as a solid acid catalyst'
    ],
    commonMistakes: [
      'Confusing the two temperature conditions (140°C vs 170°C)',
      'Forgetting that H₂SO₄ is regenerated — it is a catalyst not a reactant',
      'Not writing the correct temperature in the arrow notation'
    ],
    examTips: [
      '170°C: elimination → ethene; 140°C: substitution → ether',
      'Equation: C₂H₅OH → CH₂=CH₂ + H₂O (conc. H₂SO₄, 170°C)',
      'For board exam — mark the temperature above the arrow: "conc. H₂SO₄, 170°C"'
    ],
    verificationStatus: 'VERIFIED',
    confidence: 99,
    educationLevels: ['CLASS_11', 'CLASS_12', 'BSC']
  },

  // ─────────────────────────────────────────────────────────────
  // EAS — Electrophilic Aromatic Substitution (Nitration of Benzene)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'eas_nitration_benzene',
    name: 'Electrophilic Aromatic Substitution — Nitration',
    aliases: ['eas', 'electrophilic aromatic substitution', 'nitration of benzene', 'benzene + hno3'],
    reactionType: 'Electrophilic Aromatic Substitution',
    subType: 'Nitration',
    branch: 'Organic',
    startingMaterials: ['Benzene (C₆H₆)'],
    reagents: ['Conc. HNO₃', 'Conc. H₂SO₄ (catalyst)'],
    conditions: '50–55°C, mixed acid (H₂SO₄/HNO₃)',
    products: ['Nitrobenzene (C₆H₅NO₂)'],
    byProducts: ['H₂O'],
    electrophile: 'NO₂⁺ (Nitronium ion) — generated by protonation of HNO₃ by H₂SO₄',
    nucleophile: 'π electrons of benzene ring',
    catalyst: 'H₂SO₄',
    catalystRole: 'Protonates HNO₃ to generate highly electrophilic nitronium ion (NO₂⁺).',
    balancedEquation: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O (conc. H₂SO₄, 50–55°C)',
    overallReactionType: 'Electrophilic Aromatic Substitution (EAS)',
    stereochemistry: 'Not applicable — planar aromatic ring.',
    steps: [
      {
        stepNumber: 1,
        title: 'Generation of Nitronium Ion (Electrophile)',
        description: 'Conc. H₂SO₄ protonates HNO₃, which then loses water to give the powerfully electrophilic NO₂⁺.',
        species: ['HNO₃', 'H₂SO₄'],
        intermediates: ['H₂NO₃⁺ (Protonated nitric acid)', 'NO₂⁺ (Nitronium ion)', 'H₂O'],
        electronMovement: 'H⁺ from H₂SO₄ → lone pair on N=O of HNO₃. N–OH bond breaks, water leaves, forms linear NO₂⁺.',
        whyItHappens: 'Nitric acid alone is too weak an electrophile for benzene. Protonation by the stronger H₂SO₄ activates it to give the much more electrophilic NO₂⁺.',
        type: 'acid_base'
      },
      {
        stepNumber: 2,
        title: 'Electrophilic Attack — Arenium Ion (Sigma Complex) Formation',
        description: 'NO₂⁺ attacks one carbon of the benzene ring; π electrons attack the electrophile to form the arenium ion (Wheland intermediate / sigma complex).',
        species: ['C₆H₆', 'NO₂⁺'],
        intermediates: ['Arenium ion / Wheland intermediate (C₆H₆NO₂⁺) — delocalized carbocation, ring loses aromaticity'],
        electronMovement: 'Two electrons of the benzene π system attack the empty orbital of NO₂⁺. The attacked carbon becomes sp³ — ring is now non-aromatic.',
        whyItHappens: 'Benzene\'s π electrons are nucleophilic and attracted to the strong electrophile NO₂⁺. Formation of the sigma complex is the rate-determining step.',
        type: 'electrophilic_attack',
        energyNote: 'Rate-determining step (addition). The Wheland intermediate is higher in energy — ring has lost aromaticity.'
      },
      {
        stepNumber: 3,
        title: 'Deprotonation — Rearomatisation',
        description: 'HSO₄⁻ (or H₂O) removes the H from the sp³ carbon, C=C π bond re-forms, aromaticity restored.',
        species: ['Arenium ion', 'HSO₄⁻'],
        intermediates: [],
        electronMovement: 'C–H electrons go to reform ring π system. H⁺ accepted by HSO₄⁻. Aromaticity restored.',
        whyItHappens: 'The strong thermodynamic driving force of regaining aromaticity (resonance energy ~150 kJ/mol) makes the elimination of H⁺ fast and irreversible.',
        type: 'elimination'
      }
    ],
    whyThisReaction: 'EAS is the dominant reaction of aromatic compounds. The aromatic ring acts as a nucleophile but the reaction ends in substitution (not addition) to preserve aromaticity.',
    keyInsights: [
      'EAS preserves aromaticity — substitution not addition',
      'Rate-determining step is the electrophilic attack (step 2)',
      'Activating groups (OH, NH₂, CH₃) direct electrophile to ortho/para positions',
      'Deactivating groups (NO₂, CF₃, CHO) direct to meta position',
      'Temperature control is critical: >55°C gives dinitration products'
    ],
    commonMistakes: [
      'Drawing an addition product instead of a substitution product',
      'Forgetting that aromaticity is the driving force for H⁺ loss in step 3',
      'Confusing arenium ion with a carbocation — it is delocalized over the ring'
    ],
    examTips: [
      'EAS mechanism: Electrophile generation → Sigma complex → Deprotonation',
      'Nitronium ion (NO₂⁺) is always the electrophile in nitration',
      'Aromaticity is restored in the final step (this is what drives the reaction)'
    ],
    verificationStatus: 'VERIFIED',
    confidence: 98,
    educationLevels: ['CLASS_12', 'BSC', 'MSC']
  },

  // ─────────────────────────────────────────────────────────────
  // Nucleophilic Addition to Aldehyde/Ketone (e.g. Grignard)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'nucleophilic_addition_carbonyl',
    name: 'Nucleophilic Addition to Carbonyl',
    aliases: ['nucleophilic addition', 'addition to carbonyl', 'grignard reaction', 'rnmgx + rcho', 'aldehyde reaction'],
    reactionType: 'Nucleophilic Addition',
    subType: 'Direct Addition to C=O',
    branch: 'Organic',
    startingMaterials: ['RCHO (Aldehyde, e.g. ethanal CH₃CHO)', 'RMgX (Grignard reagent, e.g. CH₃MgBr)'],
    reagents: ['CH₃MgBr (Grignard reagent)', 'then H₃O⁺ (aqueous acid workup)'],
    conditions: 'Dry ether solvent, anhydrous conditions, then aqueous acid workup',
    products: ['Secondary alcohol (e.g. CH₃CH(OH)CH₃ from CH₃CHO + CH₃MgBr)'],
    byProducts: ['Mg(OH)Br (on workup)'],
    nucleophile: 'Carbanion (R⁻) from Grignard reagent (C–Mg bond is polarised C^δ⁻–Mg^δ⁺)',
    electrophile: 'Carbonyl carbon (C^δ⁺=O^δ⁻)',
    balancedEquation: 'CH₃CHO + CH₃MgBr → (H₃O⁺ workup) → CH₃CH(OH)CH₃',
    overallReactionType: 'Nucleophilic Addition (Grignard Addition)',
    stereochemistry: 'Racemization if aldehyde is prochiral — both faces of planar C=O can be attacked.',
    steps: [
      {
        stepNumber: 1,
        title: 'Nucleophilic Attack on Carbonyl Carbon',
        description: 'The carbanion character of the Grignard R group attacks the electrophilic C=O carbon, forming a C–C bond.',
        species: ['RCHO', 'R\'MgX'],
        intermediates: ['Alkoxide-Mg complex: R\'–C(R)–OMgX'],
        electronMovement: 'C^δ⁻ of Grignard (lone pair character) attacks C=O. π bond breaks — electrons shift to O, forming Mg–alkoxide.',
        whyItHappens: 'The C=O is polarised with partial positive charge on C. The Grignard R group, with carbanion character (C is more electronegative than Mg), acts as a powerful nucleophile.',
        type: 'nucleophilic_attack'
      },
      {
        stepNumber: 2,
        title: 'Acid Workup — Protonation of Alkoxide',
        description: 'Aqueous NH₄Cl or dilute HCl is added. The Mg-alkoxide is protonated to give the free alcohol.',
        species: ['Mg-alkoxide intermediate', 'H₃O⁺'],
        intermediates: [],
        electronMovement: 'O–Mg bond is cleaved by protonation; O lone pair accepts H⁺; Mg²⁺ released to solution.',
        whyItHappens: 'The Mg–O bond is hydrolysed under mild acidic aqueous conditions to liberate the target alcohol product.',
        type: 'proton_transfer'
      }
    ],
    whyThisReaction: 'Grignard addition is the most versatile carbon–carbon bond forming reaction for building complex alcohols.',
    keyInsights: [
      'Grignard reaction forms new C–C bonds — key in synthesis',
      'Aldehyde + Grignard → secondary alcohol; Ketone + Grignard → tertiary alcohol',
      'Anhydrous conditions essential — Grignard reacts with water',
      'Acid workup (NH₄Cl aq.) releases the magnesium alkoxide to give alcohol'
    ],
    commonMistakes: [
      'Using protic solvents — Grignard is destroyed by water',
      'Confusing Grignard (RMgX) with organolithium (RLi) — both are carbon nucleophiles',
      'Forgetting the acid workup step in product writing'
    ],
    examTips: [
      'Grignard + aldehyde → 2° alcohol; Grignard + ketone → 3° alcohol',
      'Grignard reagent: C is carbanion character (C–Mg bond highly polarised)',
      'Must use dry ether — Grignard destroyed by moisture'
    ],
    verificationStatus: 'VERIFIED',
    confidence: 97,
    educationLevels: ['CLASS_12', 'BSC', 'MSC']
  }
];

// ============================================================
// LOOKUP FUNCTIONS
// ============================================================

export function findMechanism(query: string): ReactionMechanism | null {
  if (!query || !query.trim()) return null;
  const qLower = query.toLowerCase();
  
  // Exact alias match first
  for (const mech of MECHANISM_DATABASE) {
    if (mech.aliases.some(alias => qLower.includes(alias))) {
      return mech;
    }
  }
  
  // Partial name match
  for (const mech of MECHANISM_DATABASE) {
    if (qLower.includes(mech.name.toLowerCase())) {
      return mech;
    }
  }
  
  // Reactant match
  for (const mech of MECHANISM_DATABASE) {
    const reactantStr = mech.startingMaterials.join(' ').toLowerCase();
    if (
      mech.startingMaterials.some(r => qLower.includes(r.toLowerCase().split('(')[0].trim())) ||
      qLower.includes(mech.reactionType.toLowerCase())
    ) {
      return mech;
    }
  }
  
  return null;
}

export function searchMechanisms(query: string): ReactionMechanism[] {
  if (!query || !query.trim()) return MECHANISM_DATABASE.slice(0, 6);
  const qLower = query.toLowerCase();
  return MECHANISM_DATABASE.filter(mech =>
    mech.aliases.some(a => qLower.includes(a)) ||
    mech.name.toLowerCase().includes(qLower) ||
    mech.reactionType.toLowerCase().includes(qLower) ||
    mech.startingMaterials.some(r => qLower.includes(r.toLowerCase().substring(0, 6)))
  );
}

export function getAllMechanismNames(): Array<{ id: string; name: string; type: string }> {
  return MECHANISM_DATABASE.map(m => ({ id: m.id, name: m.name, type: m.reactionType }));
}
