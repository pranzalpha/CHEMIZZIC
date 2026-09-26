/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChemiZIC Organic Conversion Lab Engine
 * Provides scientifically curated multi-step organic conversion routes.
 * Each step includes reagent, mechanism type, conditions, and reasoning.
 */

export interface ConversionStep {
  stepNumber: number;
  from: string;
  to: string;
  reagents: string[];
  conditions: string;
  solvent?: string;
  temperature?: string;
  mechanismType: string;
  whyThisReagent: string;
  whyNotAlternative?: string;
  alternativeReagent?: string;
  limitations?: string;
  sideReactions?: string;
}

export interface OrganicConversionRoute {
  id: string;
  startingCompound: string;
  targetCompound: string;
  aliases: string[];
  numberOfSteps: number;
  steps: ConversionStep[];
  overallReaction: string;
  routeSummary: string;
  keyReagentHighlight: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  educationLevels: string[];
  confidence: number;
  verificationStatus: 'VERIFIED' | 'PREDICTED';
  examTips: string[];
}

export const ORGANIC_CONVERSION_DATABASE: OrganicConversionRoute[] = [

  // ─────────────────────────────────────────────────────────────
  // Ethanol → Ethanoic Acid
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ethanol_to_ethanoic_acid',
    startingCompound: 'Ethanol (CH₃CH₂OH)',
    targetCompound: 'Ethanoic Acid / Acetic Acid (CH₃COOH)',
    aliases: ['ethanol to ethanoic acid', 'ethanol to acetic acid', 'alcohol to carboxylic acid', 'ch3ch2oh to ch3cooh'],
    numberOfSteps: 2,
    steps: [
      {
        stepNumber: 1,
        from: 'Ethanol (CH₃CH₂OH)',
        to: 'Ethanal / Acetaldehyde (CH₃CHO)',
        reagents: ['K₂Cr₂O₇ (potassium dichromate)', 'H₂SO₄ (dilute)'],
        conditions: 'Acidified potassium dichromate solution, mild conditions (warm)',
        solvent: 'Aqueous',
        temperature: '40–60°C',
        mechanismType: 'Oxidation (Primary Alcohol → Aldehyde)',
        whyThisReagent: 'K₂Cr₂O₇/H₂SO₄ is a mild oxidising agent that stops at the aldehyde stage when conditions are controlled (immediate distillation of aldehyde prevents over-oxidation to acid). Cr(VI) is reduced to Cr(III) — colour change: orange → green.',
        whyNotAlternative: 'Excess K₂Cr₂O₇ or prolonged reaction would give ethanoic acid directly (2-step oxidation). KMnO₄ is too strong and uncontrolled.',
        alternativeReagent: 'Pyridinium chlorochromate (PCC) in CH₂Cl₂ — selective aldehyde, stops at aldehyde without over-oxidation.',
        limitations: 'Distillation of acetaldehyde must be immediate to prevent further oxidation to acetic acid.',
        sideReactions: 'Over-oxidation to ethanoic acid if excess oxidant used or product not removed.'
      },
      {
        stepNumber: 2,
        from: 'Ethanal (CH₃CHO)',
        to: 'Ethanoic Acid (CH₃COOH)',
        reagents: ['K₂Cr₂O₇ (potassium dichromate)', 'H₂SO₄ (dilute)', 'OR: KMnO₄/H₂SO₄ OR: Fehling\'s solution'],
        conditions: 'Acidified dichromate, reflux conditions',
        solvent: 'Aqueous',
        temperature: 'Reflux (~100°C)',
        mechanismType: 'Oxidation (Aldehyde → Carboxylic Acid)',
        whyThisReagent: 'Aldehydes are more easily oxidised than alcohols. K₂Cr₂O₇/H₂SO₄ under reflux fully oxidises the aldehyde to the carboxylic acid. This step does not need special selectivity.',
        alternativeReagent: 'KMnO₄ (alkaline or acidic) — vigorous oxidant that also converts aldehydes to carboxylic acids.',
        limitations: 'Carboxylic acids cannot be oxidised further under these conditions.'
      }
    ],
    overallReaction: 'CH₃CH₂OH → (K₂Cr₂O₇/H₂SO₄) → CH₃CHO → (K₂Cr₂O₇/H₂SO₄, reflux) → CH₃COOH',
    routeSummary: 'Ethanol is oxidised in two stages via ethanal to ethanoic acid using acidified potassium dichromate. Step 1 uses mild conditions to isolate the intermediate aldehyde; step 2 uses reflux for complete oxidation to the acid.',
    keyReagentHighlight: 'K₂Cr₂O₇/H₂SO₄ (Acidified dichromate) — oxidising agent for both steps. Color changes from orange (Cr⁶⁺) to green (Cr³⁺) as reaction proceeds.',
    difficulty: 2,
    educationLevels: ['CLASS_12', 'BSC'],
    confidence: 99,
    verificationStatus: 'VERIFIED',
    examTips: [
      'Primary alcohol → Aldehyde (mild/controlled oxidation with PCC or controlled K₂Cr₂O₇)',
      'Primary alcohol → Carboxylic acid (excess K₂Cr₂O₇/reflux, or KMnO₄)',
      'Aldehyde → Carboxylic acid can also be done using Tollens\' reagent (gives silver mirror test) or Fehling\'s solution'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // Ethanol → Ethene
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ethanol_to_ethene',
    startingCompound: 'Ethanol (CH₃CH₂OH)',
    targetCompound: 'Ethene / Ethylene (CH₂=CH₂)',
    aliases: ['ethanol to ethene', 'ethanol to ethylene', 'alcohol to alkene', 'dehydration ethanol'],
    numberOfSteps: 1,
    steps: [
      {
        stepNumber: 1,
        from: 'Ethanol (CH₃CH₂OH)',
        to: 'Ethene (CH₂=CH₂)',
        reagents: ['Conc. H₂SO₄'],
        conditions: '170°C — intramolecular dehydration',
        temperature: '170°C',
        mechanismType: 'Acid-Catalysed E2 Elimination (Dehydration)',
        whyThisReagent: 'Conc. H₂SO₄ protonates the –OH group at 170°C, converting it to an excellent leaving group (H₂O). β-hydrogen elimination then gives ethene. At 170°C, the intramolecular pathway (elimination) is thermodynamically preferred over the intermolecular pathway (ether formation at 140°C).',
        whyNotAlternative: 'At 140°C, the same reagent gives diethyl ether via SN2 intermolecular mechanism. Al₂O₃ at 350°C is the industrial route (heterogeneous acid catalysis).',
        alternativeReagent: 'Alumina (Al₂O₃) at 350°C — industrial route, gives clean elimination.',
        limitations: 'Side reactions include ether formation at lower temperatures and sulfonation/oxidation at very high temperature.',
        sideReactions: 'Diethyl ether formed below 150°C. Char/sulfonation at >180°C.'
      }
    ],
    overallReaction: 'CH₃CH₂OH → (conc. H₂SO₄, 170°C) → CH₂=CH₂ + H₂O',
    routeSummary: 'Dehydration of ethanol over concentrated sulphuric acid at 170°C produces ethene via intramolecular elimination. Temperature control is critical.',
    keyReagentHighlight: 'Conc. H₂SO₄ acts as an acid catalyst: protonates the –OH to form a good leaving group (H₂O). H₂SO₄ is regenerated.',
    difficulty: 1,
    educationLevels: ['CLASS_11', 'CLASS_12'],
    confidence: 99,
    verificationStatus: 'VERIFIED',
    examTips: [
      'Temperature is key: 140°C → ether; 170°C → alkene',
      'H₂SO₄ is catalyst — write above/below the arrow, not as a reactant',
      'Balanced equation: C₂H₅OH → CH₂=CH₂ + H₂O (with "conc. H₂SO₄, 170°C" over arrow)'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // Benzene → Phenol
  // ─────────────────────────────────────────────────────────────
  {
    id: 'benzene_to_phenol',
    startingCompound: 'Benzene (C₆H₆)',
    targetCompound: 'Phenol (C₆H₅OH)',
    aliases: ['benzene to phenol', 'c6h6 to c6h5oh'],
    numberOfSteps: 2,
    steps: [
      {
        stepNumber: 1,
        from: 'Benzene (C₆H₆)',
        to: 'Chlorobenzene (C₆H₅Cl)',
        reagents: ['Cl₂', 'FeCl₃ (Lewis acid catalyst)'],
        conditions: 'Anhydrous conditions, room temperature',
        mechanismType: 'Electrophilic Aromatic Substitution (EAS) — Chlorination',
        whyThisReagent: 'FeCl₃ activates Cl₂ by forming Cl⁺ electrophile (or FeCl₄⁻ + Cl⁺ equivalent). The Cl⁺ acts as electrophile in EAS on benzene to give chlorobenzene. FeCl₃ is a Lewis acid catalyst.',
        alternativeReagent: 'AlCl₃ can also be used; I₂/FeCl₃ for iodination.',
        limitations: 'Mixture of ortho- and para-chlorobenzene possible if polyhalogenation not controlled.'
      },
      {
        stepNumber: 2,
        from: 'Chlorobenzene (C₆H₅Cl)',
        to: 'Phenol (C₆H₅OH)',
        reagents: ['NaOH (aq)', 'High pressure and temperature (Dow process)'],
        conditions: '300°C, 300 atm, NaOH, then H₃O⁺ workup',
        mechanismType: 'Nucleophilic Aromatic Substitution (NAS)',
        whyThisReagent: 'Chlorobenzene is resistant to normal SN2/SN1 because the C–Cl bond has partial double-bond character through resonance. Forcing conditions (high T, P) are required. NaOH provides OH⁻ nucleophile. Industrial: Dow/Raschig process.',
        whyNotAlternative: 'Normal SN2 conditions fail for aryl halides. The ring must be activated by electron-withdrawing groups for milder NAS.',
        limitations: 'Requires industrial-scale conditions (300°C, 300 atm). Not practical for small-scale lab synthesis.',
        sideReactions: 'Benzene oxidation and degradation at very high temperatures.'
      }
    ],
    overallReaction: 'C₆H₆ → (Cl₂/FeCl₃) → C₆H₅Cl → (NaOH, 300°C, 300 atm, then H₃O⁺) → C₆H₅OH',
    routeSummary: 'Benzene is first chlorinated by EAS to give chlorobenzene, which then undergoes nucleophilic aromatic substitution under harsh industrial conditions (Dow process) to give phenol.',
    keyReagentHighlight: 'NaOH under high temperature/pressure (Dow process) — industrial route to phenol from chlorobenzene. The alternative is the cumene hydroperoxide process in industry.',
    difficulty: 3,
    educationLevels: ['CLASS_12', 'BSC'],
    confidence: 95,
    verificationStatus: 'VERIFIED',
    examTips: [
      'Aryl halides (chlorobenzene) do NOT undergo SN2 or SN1 under normal conditions',
      'Industrial phenol: primarily made from cumene (isopropylbenzene) via cumene hydroperoxide process',
      'In exams: Benzene → Chlorobenzene (EAS) → Phenol (NAS, harsh conditions)'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // Aniline → Nitrobenzene
  // ─────────────────────────────────────────────────────────────
  {
    id: 'aniline_to_nitrobenzene',
    startingCompound: 'Aniline (C₆H₅NH₂)',
    targetCompound: 'Nitrobenzene (C₆H₅NO₂)',
    aliases: ['aniline to nitrobenzene', 'c6h5nh2 to c6h5no2'],
    numberOfSteps: 2,
    steps: [
      {
        stepNumber: 1,
        from: 'Aniline (C₆H₅NH₂)',
        to: 'Acetanilide (C₆H₅NHCOCH₃)',
        reagents: ['Acetic anhydride ((CH₃CO)₂O)'],
        conditions: 'Room temperature or slightly warm',
        mechanismType: 'N-Acylation (Schotten-Baumann)',
        whyThisReagent: 'The –NH₂ group is a powerful ring activator in EAS (directs to ortho/para). Direct nitration of aniline in HNO₃/H₂SO₄ would protonate the –NH₂ to –NH₃⁺ (deactivating group → meta product), and the acidic conditions damage the amine. Acetylation of –NH₂ → –NHCOCH₃ attenuates the activating power and protects the nitrogen from oxidation during nitration.',
        whyNotAlternative: 'Direct nitration of aniline under harsh conditions gives a mixture of meta-nitroaniline, oxidation products, and tar — not selective.'
      },
      {
        stepNumber: 2,
        from: 'Acetanilide (C₆H₅NHCOCH₃)',
        to: 'Para-nitroacetanilide, then hydrolysis to 4-nitroaniline',
        reagents: ['Conc. HNO₃ / Conc. H₂SO₄', 'then dilute HCl (hydrolysis)', 'then NaOH (deprotection)'],
        conditions: '0–5°C for nitration (selective para), then reflux acid for deprotection',
        mechanismType: 'EAS Nitration, then Hydrolysis',
        whyThisReagent: 'The –NHCOCH₃ group is an ortho/para director, and its moderate activating strength allows selective para-nitration. The acetamide group is then hydrolysed (acid) to regenerate –NH₂ in the para-nitroaniline product.',
        limitations: 'The aniline → nitrobenzene conversion shown in syllabus typically involves the diazonium route (below). The above is for 4-nitroaniline synthesis.',
        sideReactions: 'Some ortho-nitroacetanilide forms as minor product (~10–15%).'
      }
    ],
    overallReaction: 'C₆H₅NH₂ → (Acylation) → C₆H₅NHCOCH₃ → (HNO₃/H₂SO₄, then hydrolysis) → 4-O₂N–C₆H₄–NH₂',
    routeSummary: 'Aniline cannot be directly nitrated to nitrobenzene efficiently. The standard exam route for aniline → nitrobenzene: (1) diazotise aniline with NaNO₂/HCl at 0–5°C → benzene diazonium chloride; (2) react with H₃PO₂ (Balz-Schiemann) or warm with Cu (Sandmeyer) to get specific products. For nitrobenzene: start from benzene directly (EAS nitration is far cleaner).',
    keyReagentHighlight: 'Acetic anhydride — amino protecting group agent. Protects –NH₂ from protonation and oxidation during the harsh EAS nitration step.',
    difficulty: 4,
    educationLevels: ['CLASS_12', 'BSC', 'MSC'],
    confidence: 90,
    verificationStatus: 'VERIFIED',
    examTips: [
      'Direct nitration of aniline is not selective — always protect the amine first',
      'Nitrobenzene → Aniline is a common exam reaction (Sn + HCl or Fe + HCl reduction)',
      'Aniline → Diazonium salt → many transformations (Sandmeyer reactions) are more reliable'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // Benzene → Aniline
  // ─────────────────────────────────────────────────────────────
  {
    id: 'benzene_to_aniline',
    startingCompound: 'Benzene (C₆H₆)',
    targetCompound: 'Aniline (C₆H₅NH₂)',
    aliases: ['benzene to aniline', 'c6h6 to c6h5nh2'],
    numberOfSteps: 2,
    steps: [
      {
        stepNumber: 1,
        from: 'Benzene (C₆H₆)',
        to: 'Nitrobenzene (C₆H₅NO₂)',
        reagents: ['Conc. HNO₃', 'Conc. H₂SO₄'],
        conditions: '50–55°C (below 60°C to avoid dinitration)',
        mechanismType: 'EAS Nitration (NO₂⁺ electrophile)',
        whyThisReagent: 'H₂SO₄ generates NO₂⁺ (nitronium ion) from HNO₃. NO₂⁺ is the electrophile in the EAS mechanism. Temperature must be controlled below 60°C to prevent dinitration.',
        limitations: 'Above 60°C: mixture of meta-dinitrobenzene and para-dinitrobenzene formed.'
      },
      {
        stepNumber: 2,
        from: 'Nitrobenzene (C₆H₅NO₂)',
        to: 'Aniline (C₆H₅NH₂)',
        reagents: ['Sn (tin) + conc. HCl', 'then NaOH to free the amine'],
        conditions: 'Sn + HCl (reflux), then base workup',
        mechanismType: 'Reduction (–NO₂ → –NH₂)',
        whyThisReagent: 'Sn/HCl is the classical reducing agent for nitro groups. Sn is oxidised by HCl; nascent H reduces –NO₂ via nitroso and hydroxylamine intermediates to –NH₂. NaOH liberates the free base amine from the aniline-HCl salt.',
        alternativeReagent: 'Fe/HCl (cheaper industrial reduction), H₂/Pd catalyst (catalytic hydrogenation), LiAlH₄ (dry, anhydrous, over-kill but works).',
        limitations: 'Sn/HCl produces Sn waste; Fe/HCl is preferred industrially.'
      }
    ],
    overallReaction: 'C₆H₆ → (HNO₃/H₂SO₄, 50°C) → C₆H₅NO₂ → (Sn/HCl, then NaOH) → C₆H₅NH₂',
    routeSummary: 'Benzene is nitrated via EAS to nitrobenzene, which is then reduced to aniline using Sn/HCl (or Fe/HCl) in a two-step sequence.',
    keyReagentHighlight: 'Sn/conc. HCl — classical reduction of –NO₂ to –NH₂. This is the standard board exam reaction.',
    difficulty: 2,
    educationLevels: ['CLASS_12', 'BSC'],
    confidence: 99,
    verificationStatus: 'VERIFIED',
    examTips: [
      'Nitrobenzene → Aniline: Sn + HCl (or Fe + HCl, or H₂/Pd)',
      'Benzene → Nitrobenzene: HNO₃/H₂SO₄ at 50–55°C (EAS)',
      'Full route: Benzene → Nitrobenzene → Aniline is a classic 2-step synthesis'
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // Ethene → Ethanol
  // ─────────────────────────────────────────────────────────────
  {
    id: 'ethene_to_ethanol',
    startingCompound: 'Ethene (CH₂=CH₂)',
    targetCompound: 'Ethanol (CH₃CH₂OH)',
    aliases: ['ethene to ethanol', 'alkene to alcohol', 'hydration of ethene', 'ch2ch2 to ch3ch2oh'],
    numberOfSteps: 1,
    steps: [
      {
        stepNumber: 1,
        from: 'Ethene (CH₂=CH₂)',
        to: 'Ethanol (CH₃CH₂OH)',
        reagents: ['H₂O (steam)', 'H₃PO₄ (phosphoric acid catalyst)'],
        conditions: '300°C, 60–70 atm, H₃PO₄ on silica catalyst (Wacker/industrial process)',
        mechanismType: 'Acid-Catalysed Electrophilic Addition (Hydration)',
        whyThisReagent: 'H₃PO₄ (or H₂SO₄) protonates the alkene double bond to form a carbocation, which is then attacked by water. Industrial process uses H₃PO₄ on silica support at high T and P for continuous process.',
        alternativeReagent: 'H₂SO₄ + H₂O (lab-scale, two-step via alkyl sulfate): (1) C₂H₄ + H₂SO₄ → CH₃CH₂OSO₃H; (2) hydrolysis with H₂O → C₂H₅OH + H₂SO₄.',
        limitations: 'Equilibrium reaction — conversion per pass is ~5%; unreacted ethene is recycled.'
      }
    ],
    overallReaction: 'CH₂=CH₂ + H₂O → (H₃PO₄ catalyst, 300°C, 60 atm) → CH₃CH₂OH',
    routeSummary: 'Industrial hydration of ethene over phosphoric acid catalyst at high temperature and pressure adds water across the double bond to give ethanol (Markovnikov addition).',
    keyReagentHighlight: 'H₃PO₄ on SiO₂ — industrial catalyst for acid-catalysed addition of water. H₂SO₄ used for lab-scale two-step method.',
    difficulty: 1,
    educationLevels: ['CLASS_12', 'BSC'],
    confidence: 98,
    verificationStatus: 'VERIFIED',
    examTips: [
      'Alkene + H₂O → Alcohol: Markovnikov addition — OH goes to more substituted carbon',
      'Industrial ethanol: catalytic hydration of ethene (H₃PO₄, 300°C, 60 atm)',
      'Exam: "hydration" means addition of water across a double bond with acid catalyst'
    ]
  }
];

// ============================================================
// LOOKUP FUNCTIONS
// ============================================================

export function findConversionRoute(start: string, target: string): OrganicConversionRoute | null {
  if (!start || !target) return null;
  const sLower = start.toLowerCase().trim();
  const tLower = target.toLowerCase().trim();
  
  for (const route of ORGANIC_CONVERSION_DATABASE) {
    const routeAliases = route.aliases.join(' ');
    if (
      (route.startingCompound.toLowerCase().includes(sLower) && route.targetCompound.toLowerCase().includes(tLower)) ||
      route.aliases.some(a => a.includes(sLower) && a.includes(tLower)) ||
      (routeAliases.includes(sLower) && routeAliases.includes(tLower))
    ) {
      return route;
    }
  }
  return null;
}

export function searchConversionRoutes(query: string): OrganicConversionRoute[] {
  if (!query || !query.trim()) return ORGANIC_CONVERSION_DATABASE;
  const qLower = query.toLowerCase();
  return ORGANIC_CONVERSION_DATABASE.filter(r =>
    r.aliases.some(a => qLower.includes(a) || a.includes(qLower)) ||
    r.startingCompound.toLowerCase().includes(qLower) ||
    r.targetCompound.toLowerCase().includes(qLower)
  );
}

export function getAllConversions(): Array<{ id: string; label: string; from: string; to: string; steps: number }> {
  return ORGANIC_CONVERSION_DATABASE.map(r => ({
    id: r.id,
    label: `${r.startingCompound} → ${r.targetCompound}`,
    from: r.startingCompound,
    to: r.targetCompound,
    steps: r.numberOfSteps
  }));
}
