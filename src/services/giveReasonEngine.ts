/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChemiZIC Give Reason Engine
 * Provides structured, level-appropriate "give reason" answers for
 * common chemistry anomaly and conceptual questions.
 */

import { EducationLevelId } from '../types/curriculum';

export interface GiveReasonResponse {
  question: string;
  topic: string;
  concept: string;
  educationLevel: EducationLevelId[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  
  // Three mandatory sections
  coreScientificPrinciple: string;
  detailedChemicalCause: string;
  oneLineExamAnswer: string;
  
  // Supporting detail
  keyTerms: string[];
  relatedConcepts: string[];
  examTip: string;
  
  verificationStatus: 'VERIFIED' | 'PREDICTED';
  confidence: number;
}

export const GIVE_REASON_DATABASE: GiveReasonResponse[] = [
  {
    question: 'Why does water have a higher boiling point than H₂S?',
    topic: 'Chemical Bonding',
    concept: 'Hydrogen Bonding',
    educationLevel: ['CLASS_11', 'CLASS_12'],
    difficulty: 2,
    coreScientificPrinciple:
      'Water (H₂O) forms extensive intermolecular hydrogen bonds due to the high electronegativity and small size of oxygen. These strong attractive forces require significantly more energy to overcome than the weaker van der Waals / London dispersion forces between H₂S molecules.',
    detailedChemicalCause:
      'Oxygen (EN = 3.44) is highly electronegative and small enough to carry a large partial negative charge (δ⁻). Each water molecule can form up to 4 hydrogen bonds (2 as donor via O–H groups, 2 as acceptor via lone pairs). This creates a cooperative network of O–H···O bonds (~20–25 kJ/mol each). In contrast, H₂S has a sulfur atom that is larger (EN = 2.58) and less electronegative — the S–H bond polarity is insufficient to sustain genuine hydrogen bonds. Instead, H₂S molecules interact only through weak London dispersion forces (~4–5 kJ/mol). As a result, the energy required to vaporise water (ΔHvap ≈ 40.7 kJ/mol) is vastly higher than for H₂S (ΔHvap ≈ 18.7 kJ/mol), directly accounting for the 100°C vs −60°C boiling points.',
    oneLineExamAnswer:
      'Water has a much higher boiling point than H₂S because water molecules are held together by strong intermolecular hydrogen bonds (O–H···O), whereas H₂S molecules can only form weak van der Waals forces — more energy is required to vaporise water.',
    keyTerms: ['Hydrogen bond', 'Electronegativity', 'Van der Waals forces', 'Boiling point', 'Intermolecular forces'],
    relatedConcepts: ['Anomalous properties of water', 'Group 16 hydrides', 'Polarity and dipole moment'],
    examTip: 'Compare the boiling points of Group 16 hydrides: H₂O (100°C) >> H₂S (−60°C) > H₂Se (−41°C) > H₂Te (−2°C). The anomalously high value for H₂O is the key fact for boards.',
    verificationStatus: 'VERIFIED',
    confidence: 99
  },
  {
    question: 'Why do transition metals form coloured compounds?',
    topic: 'Chemistry of d-Block Elements',
    concept: 'd-d Electronic Transitions',
    educationLevel: ['CLASS_12', 'BSC'],
    difficulty: 3,
    coreScientificPrinciple:
      'Transition metal compounds are coloured because their d orbitals are split into energy levels of different energies by surrounding ligands (crystal field splitting). Electrons can absorb visible light photons to jump between these split d levels (d-d transitions). The unabsorbed wavelengths are transmitted as the complementary colour.',
    detailedChemicalCause:
      'In a free transition metal ion, all five d orbitals are degenerate (equal energy). When ligands coordinate, they create an electrostatic field (crystal field) that splits the d orbitals into groups: in an octahedral complex, into eg (higher energy) and t₂g (lower energy) sets, with a splitting energy Δₒ (crystal field splitting energy). If Δₒ falls in the energy range of visible light (1.8–3.1 eV, 400–700 nm), an electron can absorb that photon and jump from t₂g to eg. The compound appears the colour complementary to the absorbed wavelength. For example, [Ti(H₂O)₆]³⁺ absorbs at ~510 nm (green) and appears violet-purple. Zinc(II) complexes are colourless because Zn²⁺ has a d¹⁰ configuration — all d orbitals are completely filled and no d-d transition is possible.',
    oneLineExamAnswer:
      'Transition metals form coloured compounds because the ligand field splits their d orbitals into two energy sets, and electrons absorb visible-light photons to make d-d transitions; the observed colour is complementary to the absorbed wavelength.',
    keyTerms: ['d-d transition', 'Crystal field splitting (Δₒ)', 'Complementary colour', 'eg and t₂g orbitals', 'Ligand field'],
    relatedConcepts: ['Crystal Field Theory (CFT)', 'Spectrochemical series', 'Why Zn²⁺ is colourless', 'Colour of coordination compounds'],
    examTip: 'Always mention: (1) splitting of d orbitals by ligand field, (2) absorption of visible light, (3) complementary colour observed. Sc³⁺, Ti⁴⁺, Zn²⁺, Cu⁺ are colourless due to d⁰ or d¹⁰ configurations.',
    verificationStatus: 'VERIFIED',
    confidence: 99
  },
  {
    question: 'Why is ortho-nitrophenol more volatile than para-nitrophenol?',
    topic: 'Phenols',
    concept: 'Intramolecular vs Intermolecular Hydrogen Bonding',
    educationLevel: ['CLASS_12', 'BSC'],
    difficulty: 3,
    coreScientificPrinciple:
      'In ortho-nitrophenol, the nitro group is close enough to the hydroxyl group to form an intramolecular hydrogen bond within the same molecule. This locks the O–H proton away, preventing it from forming intermolecular hydrogen bonds with other molecules. Para-nitrophenol cannot form intramolecular hydrogen bonds; its O–H remains free to form intermolecular hydrogen bonds with neighbouring molecules, creating a strongly associated liquid with a much higher boiling point (hence lower volatility).',
    detailedChemicalCause:
      'In ortho-nitrophenol: the –OH and –NO₂ groups at positions 1 and 2 are geometrically close (ortho). The O–H hydrogen forms an intramolecular hydrogen bond to the oxygen of the adjacent –NO₂ group (forming a six-membered ring), effectively "using up" the hydrogen bonding capacity internally. This leaves no free O–H to interact with other molecules intermolecularly → fewer intermolecular attractions → lower boiling point (214°C) → more volatile, steam-distillable. In para-nitrophenol: the –OH and –NO₂ are at opposite ends of the ring, too far for intramolecular H-bonding. The free –OH forms extensive intermolecular H-bonds with other para-nitrophenol molecules, creating a higher-melting, less volatile solid (bp = 279°C).',
    oneLineExamAnswer:
      'Ortho-nitrophenol is more volatile because it forms intramolecular hydrogen bonds (within the molecule), making it self-satisfied and unable to associate with other molecules, whereas para-nitrophenol forms intermolecular hydrogen bonds between molecules, creating stronger intermolecular attractions and a higher boiling point.',
    keyTerms: ['Intramolecular H-bond', 'Intermolecular H-bond', 'Volatility', 'Boiling point', 'ortho effect'],
    relatedConcepts: ['Steam distillation of ortho vs para isomers', 'Ortho/para separation techniques', 'Hydrogen bonding in phenols'],
    examTip: 'Ortho-nitrophenol can be separated from para-nitrophenol by steam distillation. The ortho isomer is the more volatile one — this is a direct consequence of intramolecular H-bonding. Boards frequently ask this.',
    verificationStatus: 'VERIFIED',
    confidence: 98
  },
  {
    question: 'Why is benzene unusually stable even though it is unsaturated?',
    topic: 'Aromaticity',
    concept: 'Resonance and Aromatic Stabilisation',
    educationLevel: ['CLASS_11', 'CLASS_12', 'BSC'],
    difficulty: 2,
    coreScientificPrinciple:
      'Benzene is stabilised by resonance (delocalisation of π electrons). The six π electrons are not localised in three double bonds but are fully delocalised over all six carbons in a continuous π cloud above and below the ring. This resonance energy (≈150 kJ/mol) stabilises benzene far beyond what would be expected for a cyclohexatriene with three isolated double bonds.',
    detailedChemicalCause:
      'By Hückel\'s rule, benzene satisfies aromaticity criteria: (1) cyclic planar structure, (2) continuous overlapping p orbitals on all carbons, (3) 4n+2 = 6 π electrons (n=1). The six p orbitals perpendicular to the ring overlap laterally to give three bonding molecular orbitals, each filled with two electrons. This gives a lower total energy than three isolated double bonds — the "aromatic stabilisation energy." Evidence: hydrogenation of benzene releases only 208 kJ/mol vs. the predicted 360 kJ/mol for cyclohexatriene (difference of ~152 kJ/mol = resonance energy). Benzene preferentially undergoes substitution (EAS) rather than addition, to preserve this energetically favourable delocalised π system.',
    oneLineExamAnswer:
      'Benzene is unusually stable because its six π electrons are fully delocalised (resonance) over the planar ring system, giving it an aromatic stabilisation energy of ~150 kJ/mol — far lower in energy than a hypothetical cyclohexatriene with localised double bonds.',
    keyTerms: ['Aromaticity', 'Resonance energy', 'Delocalisation', 'Hückel rule (4n+2)', 'π system'],
    relatedConcepts: ['Hückel\'s rule', 'Kekulé structures vs molecular orbital picture', 'Why benzene reacts by substitution'],
    examTip: 'Benzene resonance energy = 150 kJ/mol — this is frequently asked. State: planar ring, 6 π electrons (4n+2, n=1), fully delocalised π cloud. Prefers EAS because addition would destroy aromaticity.',
    verificationStatus: 'VERIFIED',
    confidence: 99
  },
  {
    question: 'Why does HF have a higher boiling point than HCl despite lower molar mass?',
    topic: 'Chemical Bonding',
    concept: 'Hydrogen Bonding in Hydrogen Halides',
    educationLevel: ['CLASS_11', 'CLASS_12'],
    difficulty: 2,
    coreScientificPrinciple:
      'HF forms strong intermolecular hydrogen bonds (F–H···F) due to fluorine\'s extreme electronegativity (4.0) and small size. HCl cannot form hydrogen bonds because chlorine (EN = 3.16) is less electronegative and larger. Despite HCl having the higher molar mass (and therefore higher London dispersion forces), these are far weaker than HF\'s hydrogen bonds.',
    detailedChemicalCause:
      'The F–H bond is strongly polarised (F^δ⁻–H^δ⁺). Fluorine\'s small size concentrates the electron density, making both the δ⁻ end and the δ⁺ hydrogen very effective for H-bonding. Each HF molecule can form approximately 2 hydrogen bonds (~29 kJ/mol each). The association causes HF to have an anomalously high boiling point of +19.5°C. HCl, on the other hand, interacts primarily through London dispersion forces and weak dipole-dipole interactions; its boiling point is −85°C. Within the Group 17 hydrides, the normal boiling point trend (HI > HBr > HCl) based on molar mass/dispersion forces is followed, but HF is anomalously high due to H-bonding.',
    oneLineExamAnswer:
      'HF has a higher boiling point than HCl despite its lower molar mass because HF molecules form strong intermolecular hydrogen bonds (F–H···F) — fluorine\'s extreme electronegativity enables this — whereas HCl can only form weaker van der Waals forces.',
    keyTerms: ['Hydrogen bonding', 'Electronegativity', 'Boiling point anomaly', 'Group 17 hydrides', 'van der Waals forces'],
    relatedConcepts: ['Anomalous properties of HF', 'Comparison of Group 17 hydride boiling points', 'Hydrogen bonding criteria'],
    examTip: 'Among hydrogen halides: HF has anomalously HIGH bp (+19.5°C) due to H-bonding. Normal London dispersion trend: HI(−35°C) > HBr(−66°C) > HCl(−85°C). HF breaks the trend because of H-bonding.',
    verificationStatus: 'VERIFIED',
    confidence: 99
  },
  {
    question: 'Why does the second ionisation energy of sodium have such a large increase over the first?',
    topic: 'Periodic Properties',
    concept: 'Ionisation Energy Trends',
    educationLevel: ['CLASS_11'],
    difficulty: 2,
    coreScientificPrinciple:
      'After removing the first valence electron, sodium achieves the stable noble gas configuration of neon (1s² 2s² 2p⁶). Removing the second electron now requires breaking into this completed, compact, highly stable core shell — requiring a vastly greater amount of energy.',
    detailedChemicalCause:
      'Sodium\'s electron configuration is [Ne] 3s¹. The 3s electron is a lone valence electron in the outermost shell, well-shielded from the nucleus (effective nuclear charge Zeff ≈ 2.2) and relatively easy to remove (IE₁ = 496 kJ/mol). After removal, Na⁺ has the configuration 1s² 2s² 2p⁶ — identical to neon. The second electron must be removed from the 2p shell: it is much closer to the nucleus, experiences much less shielding (Zeff ≈ 6.8), is held in a filled inner subshell, and there is no electron-electron repulsion advantage. IE₂ of sodium = 4562 kJ/mol — nearly 10× the IE₁. This jump is a reliable indicator of group number: the large jump after n-th ionisation energy means the element is in Group n.',
    oneLineExamAnswer:
      'The second ionisation energy of sodium is dramatically larger than the first because removing the first electron gives Na⁺ the stable neon core configuration; the second electron must come from an inner, compact, fully-filled shell that is much more strongly held by the nucleus.',
    keyTerms: ['Ionisation energy', 'Noble gas configuration', 'Effective nuclear charge', 'Shielding', 'Core electrons'],
    relatedConcepts: ['Trends in ionisation energies across periods', 'Using IE jumps to identify group number', 'Stability of noble gas configurations'],
    examTip: 'A large jump between IE_n and IE_(n+1) means the element is in Group n. For Na, the jump is between IE₁ and IE₂ → Group 1. For Mg, the jump is between IE₂ and IE₃ → Group 2.',
    verificationStatus: 'VERIFIED',
    confidence: 99
  },
  {
    question: 'Why is diamond hard while graphite is soft and slippery?',
    topic: 'Allotropes of Carbon',
    concept: 'Crystal Structure and Bonding',
    educationLevel: ['CLASS_11', 'CLASS_12'],
    difficulty: 2,
    coreScientificPrinciple:
      'Diamond has a rigid, three-dimensional covalent network structure where every carbon is sp³ hybridised and covalently bonded to four other carbons in a tetrahedral arrangement. Graphite has a layered structure of sp² hybridised carbons; layers are held together only by weak van der Waals forces and can slide easily over each other.',
    detailedChemicalCause:
      'Diamond: Each C forms 4 strong covalent bonds (C–C bond enthalpy = 347 kJ/mol) to 4 neighbouring carbons at 109.5° tetrahedral angles. This creates a giant, rigid, 3D lattice with no weak points — making diamond the hardest natural substance (Mohs scale 10). Graphite: Each C is sp² hybridised and forms 3 σ bonds within a flat hexagonal layer (like fused benzene rings). The fourth valence electron is in an unhybridised p orbital that overlaps laterally to form delocalized π electrons across the layer (making graphite a conductor). Adjacent layers are spaced 0.335 nm apart and held together only by weak van der Waals forces (~5 kJ/mol). These layers slide easily under shear — hence graphite is a lubricant. Graphite has high conductivity and diamond does not, for the same reason.',
    oneLineExamAnswer:
      'Diamond is hard because each carbon forms four strong tetrahedral covalent bonds in a rigid 3D network (sp³); graphite is soft because its planar layers of sp² carbons are held together only by weak van der Waals forces and can slide easily over one another.',
    keyTerms: ['sp³ hybridisation', 'sp² hybridisation', 'Covalent network solid', 'Van der Waals forces', 'Graphite layers'],
    relatedConcepts: ['Allotropes of carbon (diamond, graphite, fullerene, graphene)', 'Electrical conductivity of graphite vs diamond', 'Applications of diamond and graphite'],
    examTip: 'Diamond: sp³, tetrahedral, 3D covalent network, non-conductor, hardest. Graphite: sp², hexagonal layers, van der Waals between layers, electrical conductor, lubricant. These contrasting properties come directly from bonding.',
    verificationStatus: 'VERIFIED',
    confidence: 99
  },
  {
    question: 'Why do noble gases not form chemical bonds under normal conditions?',
    topic: 'Noble Gases',
    concept: 'Closed-Shell Electronic Configuration',
    educationLevel: ['CLASS_11'],
    difficulty: 1,
    coreScientificPrinciple:
      'Noble gases have completely filled valence shells (s² p⁶ for He it is just 1s²) — the most stable electronic configuration. There is no driving force (no half-filled or empty orbital) to form bonds, and bond formation would require disrupting this maximum-stability configuration.',
    detailedChemicalCause:
      'The ionisation energies of noble gases are exceptionally high (He: 2372 kJ/mol; Ne: 2081 kJ/mol; Ar: 1521 kJ/mol) because the nuclear charge is fully unshielded by the filled shells. The electron affinity is essentially zero or slightly negative — noble gases gain no stability by accepting electrons either. Bond formation requires either electron sharing (covalent) or electron transfer (ionic), both of which would require either losing, gaining, or sharing electrons — all energetically unfavourable when the octet (or duet) is already perfectly filled. Exception: heavier noble gases like Xe can form compounds (e.g. XeF₂, XeF₄) under extreme conditions because Xe\'s valence shell (n=5) is large enough to accommodate expanded octet and its IE is lower (~1170 kJ/mol).',
    oneLineExamAnswer:
      'Noble gases do not form bonds under normal conditions because their valence shells are completely filled (stable octet/duet), giving them very high ionisation energies, near-zero electron affinity, and no tendency to share, lose, or gain electrons.',
    keyTerms: ['Octet rule', 'Ionisation energy', 'Electron affinity', 'Closed-shell configuration', 'Inert pair effect'],
    relatedConcepts: ['Exceptions — XeF₂ and XeF₄', 'Applications of noble gases', 'Atomic radius trend of noble gases'],
    examTip: 'Noble gas compounds of Xe (XeF₂, XeF₄, XeO₃) can form. He, Ne, and Ar do not form any compounds. Reason: larger atoms have expanded octets and lower ionisation energies.',
    verificationStatus: 'VERIFIED',
    confidence: 99
  },
  {
    question: 'Why does pH decrease when a strong acid is diluted?',
    topic: 'Ionic Equilibrium',
    concept: 'pH and Concentration of Strong Acids',
    educationLevel: ['CLASS_11', 'CLASS_12'],
    difficulty: 1,
    coreScientificPrinciple:
      'pH = −log₁₀[H⁺]. Diluting a strong acid reduces [H⁺] (the molar concentration of hydronium ions). Since pH is inversely related to [H⁺] on a log scale, as [H⁺] decreases, pH increases (becomes less acidic, moves towards neutral pH 7).',
    detailedChemicalCause:
      'A strong acid (HCl, HNO₃) dissociates completely: HCl → H⁺ + Cl⁻. For a 0.1 M HCl solution, [H⁺] = 0.1 M, so pH = −log(0.1) = 1.0. When diluted 10× to 0.01 M, [H⁺] = 0.01 M and pH = −log(0.01) = 2.0. Further dilution raises pH towards 7.0. It is physically impossible for pH to exceed 7.0 for an acid upon dilution (the autoionisation of water maintains [H⁺][OH⁻] = 10⁻¹⁴ at 25°C). The pH can approach but never exceed 7 — a common board exam question and common student misconception.',
    oneLineExamAnswer:
      'pH increases (acid becomes less acidic) upon dilution because dilution reduces [H⁺]; since pH = −log[H⁺], a lower [H⁺] gives a higher pH — but pH can never exceed 7 for an acid, no matter how much it is diluted.',
    keyTerms: ['pH', 'Dilution', 'Strong acid', '[H⁺] concentration', 'Water autoionisation'],
    relatedConcepts: ['Strong vs weak acid dilution behaviour', 'Buffer solutions resist pH changes', 'pH scale and neutrality at 25°C'],
    examTip: 'Classic board question: "pH of an acid cannot exceed 7 on dilution." Also: "Diluting 1 L of pH 1 HCl to 100 L still gives pH ≈ 3, not pH = 7."',
    verificationStatus: 'VERIFIED',
    confidence: 99
  },
  {
    question: 'Why do alkali metals react vigorously with water?',
    topic: 'Alkali Metals (Group 1)',
    concept: 'Reactivity with Water',
    educationLevel: ['CLASS_11'],
    difficulty: 1,
    coreScientificPrinciple:
      'Alkali metals have a single valence electron in a large, diffuse orbital with very low ionisation energy. This electron is readily donated to water, which is oxidised slightly, producing hydrogen gas and the metal hydroxide. The reaction is thermodynamically very exothermic.',
    detailedChemicalCause:
      '2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g) ΔH = −184 kJ/mol for Na. The low IE₁ of alkali metals (Na: 496 kJ/mol; K: 418 kJ/mol; Li: 520 kJ/mol) means the valence electron is easily transferred to water. Water is both the oxidant (H⁺ accepts electrons → H₂) and the solvent. The reaction produces H₂ gas (which may ignite) and a strongly alkaline MOH solution. Reactivity increases down the group (Li < Na < K < Rb < Cs) because the IE₁ decreases down Group 1 as the valence electron gets further from the nucleus and more shielded. Cs can explode on contact with water at room temperature.',
    oneLineExamAnswer:
      'Alkali metals react vigorously with water because they have very low ionisation energies and readily donate their single valence electron to water, forming hydrogen gas and metal hydroxide in a highly exothermic reaction.',
    keyTerms: ['Ionisation energy', 'Reducing power', 'Exothermic reaction', 'Hydrogen evolution', 'Alkali metal hydroxide'],
    relatedConcepts: ['Trend in reactivity of Group 1 elements', 'Why Li reacts less vigorously than Na or K', 'Storage of alkali metals in oil/kerosene'],
    examTip: 'Reactivity with water: Li < Na < K < Rb < Cs. Li does not ignite because H₂ is released slowly; K always ignites the H₂; Cs explodes. Store alkali metals under oil or dry kerosene to prevent reaction with air and water.',
    verificationStatus: 'VERIFIED',
    confidence: 99
  }
];

// ============================================================
// LOOKUP FUNCTIONS
// ============================================================

export function findGiveReasonAnswer(query: string): GiveReasonResponse | null {
  if (!query || !query.trim()) return null;
  const qLower = query.toLowerCase();
  
  // Try question text match
  for (const gr of GIVE_REASON_DATABASE) {
    if (gr.question.toLowerCase().includes(qLower.substring(0, 25))) {
      return gr;
    }
  }
  
  // Try topic/concept match
  for (const gr of GIVE_REASON_DATABASE) {
    if (
      qLower.includes(gr.concept.toLowerCase().split(' ')[0]) ||
      qLower.includes(gr.topic.toLowerCase().split(' ')[0]) ||
      gr.keyTerms.some(t => qLower.includes(t.toLowerCase()))
    ) {
      return gr;
    }
  }
  
  return null;
}

export function searchGiveReasonBank(query: string, level?: EducationLevelId): GiveReasonResponse[] {
  let results = GIVE_REASON_DATABASE;
  if (level) {
    results = results.filter(gr => gr.educationLevel.includes(level));
  }
  if (!query || !query.trim()) return results;
  const qLower = query.toLowerCase();
  return results.filter(gr =>
    gr.question.toLowerCase().includes(qLower) ||
    gr.concept.toLowerCase().includes(qLower) ||
    gr.topic.toLowerCase().includes(qLower) ||
    gr.keyTerms.some(t => t.toLowerCase().includes(qLower))
  );
}

export function getAllGiveReasonTopics(): string[] {
  return [...new Set(GIVE_REASON_DATABASE.map(gr => gr.topic))];
}
