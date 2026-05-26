/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChemicalProp } from '../types';

export interface LocalChemical extends ChemicalProp {
  description: string;
  atoms?: { id: number; element: string; x: number; y: number; z: number }[];
  bonds?: { atom1: number; atom2: number; order: number }[];
}

export const popularChemicals: LocalChemical[] = [
  {
    id: 1,
    name: "Water",
    iupacName: "oxidane",
    formula: "H2O",
    molarMass: "18.015 g/mol",
    smiles: "O",
    cid: 962,
    density: "1.000 g/cm³",
    meltingPoint: "0.0 °C (32.0 °F)",
    boilingPoint: "100.0 °C (212.0 °F)",
    appearance: "Colorless, transparent liquid",
    odor: "Odorless",
    description: "Water is a polar inorganic compound that is the main constituent of Earth's hydrosphere and the fluids of all known living organisms. It is vital for all known forms of life, despite providing no energy, nutrients, or organic micronutrients.",
    hazards: [
      "Non-hazardous at normal physiological states.",
      "Scalding danger when at vapor state (steam)."
    ],
    uses: [
      "Universal industrial solvent",
      "Biological hydration agent",
      "Agriculture and crops irrigation",
      "Heat transfer fluid (cooling loops)"
    ],
    characteristics: [
      "Strong polar covalent molecule",
      "Exceptional hydrogen bonding capacity",
      "High specific heat capacity",
      "Maximum density occurs at 4.0 °C"
    ],
    nfpa: {
      health: 0,
      flammability: 0,
      instability: 0
    },
    ghsPictograms: [],
    // Water exact geometrical coordinates
    atoms: [
      { id: 1, element: 'O', x: 0.0, y: 0.12, z: 0.0 },
      { id: 2, element: 'H', x: 0.82, y: -0.48, z: 0.0 },
      { id: 3, element: 'H', x: -0.82, y: -0.48, z: 0.0 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 1, atom2: 3, order: 1 }
    ]
  },
  {
    id: 2,
    name: "Benzene",
    iupacName: "benzene",
    formula: "C6H6",
    molarMass: "78.11 g/mol",
    smiles: "C1=CC=CC=C1",
    cid: 241,
    density: "0.876 g/cm³",
    meltingPoint: "5.5 °C (41.9 °F)",
    boilingPoint: "80.1 °C (176.2 °F)",
    appearance: "Colorless, highly refractive liquid",
    odor: "Highly sweet, aromatic, gasoline-like",
    description: "Benzene is an organic chemical compound with the molecular formula C6H6. It is a classic aromatic hydrocarbon displaying cyclic resonance stability, and acts as a widely processed raw material for synthesizing plastics, resins, and synthetic fibers.",
    hazards: [
      "H225: Highly flammable liquid and vapor.",
      "H340: May cause genetic defects.",
      "H350: May cause cancer (leukemia risk).",
      "H304: May be fatal if swallowed and enters airways."
    ],
    uses: [
      "Precursor for styrene, cumene, cyclohexane, and ethylbenzene",
      "Synthesis of nylon, resins, polycarbonates, and phenolics",
      "Octane-boosting fuel additive component"
    ],
    characteristics: [
      "Classic cyclic planar hexagonal structure",
      "Delocalized pi-bonding cyclic system (resonance ring)",
      "High refractive index",
      "Relatively immiscible with water"
    ],
    nfpa: {
      health: 2,
      flammability: 3,
      instability: 0
    },
    ghsPictograms: ["flammable", "danger-health", "environmental"],
    // Regular hexagon coordinates for Carbon, outer radiating links for Hydrogens
    atoms: [
      // 6 carbons in hex
      { id: 1, element: 'C', x: 0.0, y: 1.4, z: 0.0 },
      { id: 2, element: 'C', x: 1.21, y: 0.7, z: 0.0 },
      { id: 3, element: 'C', x: 1.21, y: -0.7, z: 0.0 },
      { id: 4, element: 'C', x: 0.0, y: -1.4, z: 0.0 },
      { id: 5, element: 'C', x: -1.21, y: -0.7, z: 0.0 },
      { id: 6, element: 'C', x: -1.21, y: 0.7, z: 0.0 },
      // 6 hydrogens radiating
      { id: 7, element: 'H', x: 0.0, y: 2.48, z: 0.0 },
      { id: 8, element: 'H', x: 2.15, y: 1.24, z: 0.0 },
      { id: 9, element: 'H', x: 2.15, y: -1.24, z: 0.0 },
      { id: 10, element: 'H', x: 0.0, y: -2.48, z: 0.0 },
      { id: 11, element: 'H', x: -2.15, y: -1.24, z: 0.0 },
      { id: 12, element: 'H', x: -2.15, y: 1.24, z: 0.0 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 2 },
      { atom1: 2, atom2: 3, order: 1 },
      { atom1: 3, atom2: 4, order: 2 },
      { atom1: 4, atom2: 5, order: 1 },
      { atom1: 5, atom2: 6, order: 2 },
      { atom1: 6, atom2: 1, order: 1 },

      { atom1: 1, atom2: 7, order: 1 },
      { atom1: 2, atom2: 8, order: 1 },
      { atom1: 3, atom2: 9, order: 1 },
      { atom1: 4, atom2: 10, order: 1 },
      { atom1: 5, atom2: 11, order: 1 },
      { atom1: 6, atom2: 12, order: 1 }
    ]
  },
  {
    id: 3,
    name: "Ethanol",
    iupacName: "ethanol",
    formula: "C2H5OH",
    molarMass: "46.07 g/mol",
    smiles: "CCO",
    cid: 702,
    density: "0.789 g/cm³",
    meltingPoint: "-114.1 °C (-173.4 °F)",
    boilingPoint: "78.37 °C (173.1 °F)",
    appearance: "Clear, colorless liquid",
    odor: "Pleasant, vinous, characteristic",
    description: "Ethanol (also called ethyl alcohol) is a volatile, flammable, colorless liquid. It is a simple primary alcohol and acts as the active drug component in recreational alcoholic beverages, a major industrial solvent, and an eco-friendly biofuel.",
    hazards: [
      "H225: Highly flammable liquid and vapor.",
      "H319: Causes serious eye irritation."
    ],
    uses: [
      "Recreational beverages",
      "Industrial organic solvent used in paints and cosmetics",
      "Biofuel blend additive (e.g., E10/E85)",
      "Medical antiseptic and hand sanitizer"
    ],
    characteristics: [
      "Miscible at all concentrations with water",
      "forms a positive-boiling azeotrope at 95.6% concentration",
      "Weaker hydrogen bonding than water"
    ],
    nfpa: {
      health: 2,
      flammability: 3,
      instability: 0
    },
    ghsPictograms: ["flammable", "toxic-hazard"],
    atoms: [
      { id: 1, element: 'C', x: -1.2, y: -0.2, z: 0.0 },
      { id: 2, element: 'C', x: 0.2, y: 0.4, z: 0.0 },
      { id: 3, element: 'O', x: 1.2, y: -0.6, z: 0.0 },
      { id: 4, element: 'H', x: 2.1, y: -0.2, z: 0.0 },
      // H on original Carbon C1
      { id: 5, element: 'H', x: -1.3, y: -0.8, z: 0.8 },
      { id: 6, element: 'H', x: -1.3, y: -0.8, z: -0.8 },
      { id: 7, element: 'H', x: -1.9, y: 0.6, z: 0.0 },
      // H on Carbon C2
      { id: 8, element: 'H', x: 0.3, y: 1.0, z: 0.8 },
      { id: 9, element: 'H', x: 0.3, y: 1.0, z: -0.8 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 3, order: 1 },
      { atom1: 3, atom2: 4, order: 1 },
      { atom1: 1, atom2: 5, order: 1 },
      { atom1: 1, atom2: 6, order: 1 },
      { atom1: 1, atom2: 7, order: 1 },
      { atom1: 2, atom2: 8, order: 1 },
      { atom1: 2, atom2: 9, order: 1 }
    ]
  },
  {
    id: 4,
    name: "Carbon Dioxide",
    iupacName: "carbon dioxide",
    formula: "CO2",
    molarMass: "44.01 g/mol",
    smiles: "C(=O)=O",
    cid: 280,
    density: "1.56 g/cm³ (solid), 1.977 g/L (gas)",
    meltingPoint: "-56.6 °C (-69.8 °F) (at 5.18 atm)",
    boilingPoint: "-78.5 °C (-109.3 °F) (sublimes)",
    appearance: "Colorless gas",
    odor: "Odorless (or slightly sharp in high levels)",
    description: "Carbon dioxide (CO2) is an acidic colorless gas, central to Earth's carbon cycle. It acts as a greenhouse gas that traps atmospheric heat, a key reactant in plant photosynthesis, and an industrial cooling medium (dry ice).",
    hazards: [
      "H280: Contains gas under pressure; may explode if heated.",
      "Asphyxiant in enclosed spaces at high concentrations.",
      "Cryogenic skin burn danger when in solid form (dry ice)."
    ],
    uses: [
      "Carbonation in modern soft drinks",
      "Fire extinguisher smothering agent",
      "Solid dry ice for cold transport refrigeration",
      "Supercritical extraction fluid (essential oil / decaf cycles)"
    ],
    characteristics: [
      "Linear molecular geometry",
      "Non-polar despite polar carbon-oxygen double bonds (dipoles cancel)",
      "Sublimes directly from solid to gaseous state at atmospheric pressure"
    ],
    nfpa: {
      health: 1,
      flammability: 0,
      instability: 0
    },
    ghsPictograms: ["gas-cylinder"],
    atoms: [
      { id: 1, element: 'C', x: 0.0, y: 0.0, z: 0.0 },
      { id: 2, element: 'O', x: -1.16, y: 0.0, z: 0.0 },
      { id: 3, element: 'O', x: 1.16, y: 0.0, z: 0.0 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 2 },
      { atom1: 1, atom2: 3, order: 2 }
    ]
  },
  {
    id: 5,
    name: "Methane",
    iupacName: "methane",
    formula: "CH4",
    molarMass: "16.04 g/mol",
    smiles: "C",
    cid: 297,
    density: "0.422 g/cm³ (liquefied)",
    meltingPoint: "-182.5 °C (-296.5 °F)",
    boilingPoint: "-161.5 °C (-258.7 °F)",
    appearance: "Colorless gas",
    odor: "Odorless (additive mercaptans used for safety leaks)",
    description: "Methane is a tetrahedral chemical compound that is the primary component of natural gas. It is the simplest alkane and acts as a potent greenhouse gas, but serves as a cheap clean-burning fuel resource globally.",
    hazards: [
      "H220: Extremely flammable gas.",
      "H280: Contains gas under pressure; may explode if heated.",
      "Asphyxiation hazard."
    ],
    uses: [
      "Domestic gas heating and electricity generation",
      "Primary feedstock for steam reforming to synthesize gaseous Hydrogen",
      "Liquefied Natural Gas (LNG) heavy transport fuel"
    ],
    characteristics: [
      "Perfect tetrahedral shape",
      "Sp3 hybrid carbon bonds",
      "Extremely clean combustion products (water and CO2)"
    ],
    nfpa: {
      health: 1,
      flammability: 4,
      instability: 0
    },
    ghsPictograms: ["flammable", "gas-cylinder"],
    atoms: [
      { id: 1, element: 'C', x: 0.0, y: 0.0, z: 0.0 },
      { id: 2, element: 'H', x: 0.63, y: 0.63, z: 0.63 },
      { id: 3, element: 'H', x: -0.63, y: -0.63, z: 0.63 },
      { id: 4, element: 'H', x: -0.63, y: 0.63, z: -0.63 },
      { id: 5, element: 'H', x: 0.63, y: -0.63, z: -0.63 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 1, atom2: 3, order: 1 },
      { atom1: 1, atom2: 4, order: 1 },
      { atom1: 1, atom2: 5, order: 1 }
    ]
  },
  {
    id: 6,
    name: "Caffeine",
    iupacName: "1,3,7-trimethylpurine-2,6-dione",
    formula: "C8H10N4O2",
    molarMass: "194.19 g/mol",
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    cid: 2519,
    density: "1.230 g/cm³",
    meltingPoint: "235.0 °C (455.0 °F)",
    boilingPoint: "Sublimes at 178 °C",
    appearance: "White, odorless crystalline powder",
    odor: "Odorless (very bitter taste)",
    description: "Caffeine is a central nervous system stimulant of the methylxanthine class. It is the world's most widely consumed psychoactive substance, occurring naturally in coffee beans, tea leaves, and cacao pods to block adenosine receptors.",
    hazards: [
      "H302: Harmful if swallowed in large quantities.",
      "Cardiovascular acceleration and nervous tremors under extreme overdose."
    ],
    uses: [
      "Beverages (coffee, tea, sodas, energy formulations)",
      "Adjuvant pain reliever components in pharmaceuticals",
      "alertness pills and sports boosters"
    ],
    characteristics: [
      "Fused bicyclic nitrogenous ring structure (purine core)",
      "Mildly basic alkaloid",
      "Inhibits adenosine transmission within synapses"
    ],
    nfpa: {
      health: 2,
      flammability: 1,
      instability: 0
    },
    ghsPictograms: ["toxic-hazard"],
    atoms: [
      // Fused rings: 6-ring and 5-ring
      // Ring C/N nodes
      { id: 1, element: 'N', x: -0.4, y: 1.3, z: 0.1 },
      { id: 2, element: 'C', x: 0.8, y: 0.7, z: 0.0 },
      { id: 3, element: 'C', x: 0.8, y: -0.7, z: -0.1 },
      { id: 4, element: 'N', x: -0.4, y: -1.3, z: 0.0 },
      { id: 5, element: 'C', x: -1.5, y: -0.6, z: 0.1 },
      { id: 6, element: 'C', x: -1.5, y: 0.7, z: 0.2 },
      
      // 5-ring off the 6-ring (nodes 2 & 3)
      { id: 7, element: 'N', x: 2.1, y: 1.1, z: -0.1 },
      { id: 8, element: 'C', x: 2.9, y: 0.0, z: -0.2 },
      { id: 9, element: 'N', x: 2.1, y: -1.1, z: -0.2 },

      // Carbonyl oxygens on nodes 5 and 6 context
      { id: 10, element: 'O', x: -2.6, y: -1.2, z: 0.1 },
      { id: 11, element: 'O', x: -2.6, y: 1.3, z: 0.3 },

      // Methyl groups on N nodes (1, 4, 7)
      { id: 12, element: 'C', x: -0.4, y: 2.7, z: 0.2 }, // Methyl 1
      { id: 13, element: 'C', x: -0.4, y: -2.7, z: -0.1 }, // Methyl 2
      { id: 14, element: 'C', x: 2.6, y: 2.4, z: 0.0 } // Methyl 3
    ],
    bonds: [
      // 6-ring connections
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 3, order: 2 },
      { atom1: 3, atom2: 4, order: 1 },
      { atom1: 4, atom2: 5, order: 1 },
      { atom1: 5, atom2: 6, order: 1 },
      { atom1: 6, atom2: 1, order: 1 },

      // oxygens
      { atom1: 5, atom2: 10, order: 2 },
      { atom1: 6, atom2: 11, order: 2 },

      // 5-ring connections
      { atom1: 2, atom2: 7, order: 1 },
      { atom1: 7, atom2: 8, order: 2 },
      { atom1: 8, atom2: 9, order: 1 },
      { atom1: 9, atom2: 3, order: 1 },

      // methyl attachments
      { atom1: 1, atom2: 12, order: 1 },
      { atom1: 4, atom2: 13, order: 1 },
      { atom1: 7, atom2: 14, order: 1 }
    ]
  },
  {
    id: 7,
    name: "Acetone",
    iupacName: "propan-2-one",
    formula: "C3H6O",
    molarMass: "58.08 g/mol",
    smiles: "CC(=O)C",
    cid: 180,
    density: "0.784 g/cm³",
    meltingPoint: "-94.9 °C (-138.8 °F)",
    boilingPoint: "56.08 °C (132.9 °F)",
    appearance: "Colorless, highly volatile liquid",
    odor: "Pungent, sweetish, fruity, highly distinctive",
    description: "Acetone is a volatile, highly flammable liquid. It is the simplest and smallest ketone organic chemical, serving as an exceptional industrial solvent for cleaning grease, thinning resins, and wiping away nail polishes.",
    hazards: [
      "H225: Highly flammable liquid and vapor.",
      "H319: Causes serious eye irritation.",
      "H336: May cause drowsiness or dizziness."
    ],
    uses: [
      "Nail polish remover formulation solvent",
      "Industrial thinners for polyester resins, epoxies, and paints",
      "Laboratory cleaning and rinsing glassware agent"
    ],
    characteristics: [
      "Miscible at all portions with water, ethanol, and ethers",
      "Strong polar aprotic solvent characteristics",
      "Highly volatile with rapid room evaporation rates"
    ],
    nfpa: {
      health: 1,
      flammability: 3,
      instability: 0
    },
    ghsPictograms: ["flammable", "toxic-hazard"],
    atoms: [
      { id: 1, element: 'C', x: 0.0, y: 0.2, z: 0.0 }, // Central carbon
      { id: 2, element: 'O', x: 0.0, y: 1.4, z: 0.0 }, // Double bonded oxygen
      { id: 3, element: 'C', x: -1.2, y: -0.6, z: 0.0 }, // Methyl carbon left
      { id: 4, element: 'C', x: 1.2, y: -0.6, z: 0.0 }, // Methyl carbon right
      // Hydrogens on Left methyl
      { id: 5, element: 'H', x: -2.1, y: 0.0, z: 0.0 },
      { id: 6, element: 'H', x: -1.2, y: -1.3, z: 0.8 },
      { id: 7, element: 'H', x: -1.2, y: -1.3, z: -0.8 },
      // Hydrogens on right methyl
      { id: 8, element: 'H', x: 2.1, y: 0.0, z: 0.0 },
      { id: 9, element: 'H', x: 1.2, y: -1.3, z: 0.8 },
      { id: 10, element: 'H', x: 1.2, y: -1.3, z: -0.8 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 2 },
      { atom1: 1, atom2: 3, order: 1 },
      { atom1: 1, atom2: 4, order: 1 },
      { atom1: 3, atom2: 5, order: 1 },
      { atom1: 3, atom2: 6, order: 1 },
      { atom1: 3, atom2: 7, order: 1 },
      { atom1: 4, atom2: 8, order: 1 },
      { atom1: 4, atom2: 9, order: 1 },
      { atom1: 4, atom2: 10, order: 1 }
    ]
  },
  {
    id: 8,
    name: "Acetylsalicylic Acid (Aspirin)",
    iupacName: "2-acetyloxybenzoic acid",
    formula: "C9H8O4",
    molarMass: "180.16 g/mol",
    smiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    cid: 2244,
    density: "1.400 g/cm³",
    meltingPoint: "136.0 °C (276.8 °F)",
    boilingPoint: "140 °C (284 °F) (decomposes)",
    appearance: "White, odorless crystalline solid",
    odor: "Odorless (acidic vinegar odor when damp)",
    description: "Aspirin, also known as acetylsalicylic acid (ASA), is a common pharmaceutical medication used to reduce pain, fever, or localized inflammation. It acts as a nonsteroidal anti-inflammatory drug (NSAID) by locking cyclooxygenase enzyme actions.",
    hazards: [
      "H302: Harmful if swallowed in drug overdoses.",
      "H315: Causes mild skin irritation.",
      "Gastrointestinal bleeding risk under prolonged abuse."
    ],
    uses: [
      "Pain reducer (headaches, muscular aches)",
      "Anti-fever control (antipyretic limits)",
      "Low-dose blood thinner for heart attack prevention"
    ],
    characteristics: [
      "Salicylate ester derivative",
      "Slightly acidic crystals",
      "Irreversibly acetylates active serine sites of prostaglandins"
    ],
    nfpa: {
      health: 1,
      flammability: 1,
      instability: 0
    },
    ghsPictograms: ["toxic-hazard"],
    atoms: [
      // Benzene core ring carbons
      { id: 1, element: 'C', x: -0.6, y: -0.7, z: 0.0 }, // connection 1 to ester
      { id: 2, element: 'C', x: 0.6, y: -1.3, z: 0.0 }, // connection 2 to carboxylic acid
      { id: 3, element: 'C', x: 1.7, y: -0.5, z: 0.1 },
      { id: 4, element: 'C', x: 1.6, y: 0.9, z: 0.1 },
      { id: 5, element: 'C', x: 0.4, y: 1.5, z: 0.0 },
      { id: 6, element: 'C', x: -0.7, y: 0.7, z: 0.0 },

      // Carboxylic acid C(=O)O on Carbon 2
      { id: 7, element: 'C', x: 0.8, y: -2.8, z: -0.1 },
      { id: 8, element: 'O', x: 1.9, y: -3.3, z: -0.1 },
      { id: 9, element: 'O', x: -0.3, y: -3.5, z: -0.2 },

      // Ester oxygen on carbon 1
      { id: 10, element: 'O', x: -1.8, y: -1.4, z: -0.1 },
      { id: 11, element: 'C', x: -2.9, y: -0.7, z: -0.1 },
      { id: 12, element: 'O', x: -2.9, y: 0.5, z: 0.0 }, // Acetyl carbonyl O
      { id: 13, element: 'C', x: -4.1, y: -1.6, z: -0.2 } // Acetyl methyl C
    ],
    bonds: [
      // ring
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 3, order: 2 },
      { atom1: 3, atom2: 4, order: 1 },
      { atom1: 4, atom2: 5, order: 2 },
      { atom1: 5, atom2: 6, order: 1 },
      { atom1: 6, atom2: 1, order: 2 },

      // Carboxylic acid attachments
      { atom1: 2, atom2: 7, order: 1 },
      { atom1: 7, atom2: 8, order: 2 },
      { atom1: 7, atom2: 9, order: 1 },

      // Ester attachments
      { atom1: 1, atom2: 10, order: 1 },
      { atom1: 10, atom2: 11, order: 1 },
      { atom1: 11, atom2: 12, order: 2 },
      { atom1: 11, atom2: 13, order: 1 }
    ]
  },
  {
    id: 9,
    name: "Ammonia",
    iupacName: "azane",
    formula: "NH3",
    molarMass: "17.031 g/mol",
    smiles: "N",
    cid: 222,
    density: "0.73 kg/m³ (gas)",
    meltingPoint: "-77.73 °C (-107.9 °F)",
    boilingPoint: "-33.33 °C (-28.0 °F)",
    appearance: "Colorless gas",
    odor: "Sharply pungent, suffocation-inducing",
    description: "Ammonia (NH3) is a stable binary hydride and a simple pnictogen hydride. It is a colorless gas with a characteristic pungent smell, and acts as a major precursor in the manufacturing of nitrogen fertilizers and household cleaners.",
    hazards: [
      "H314: Causes severe skin burns and serious eye damage.",
      "H331: Toxic if inhaled in concentrated industrial streams.",
      "H400: Very toxic to aquatic life."
    ],
    uses: [
      "Agricultural urea and ammonium nitrate fertilizers",
      "Refrigerant gas in deep industrial cooling lines (R-717)",
      "cleaning solvents and nitric acid industrial precursors"
    ],
    characteristics: [
      "Trigonal pyramidal shape with lone pairs on Nitrogen",
      "Highly basic alkaline fluid in aqueous solutions",
      "Forms density-altering hydrogen bonds with water"
    ],
    nfpa: {
      health: 3,
      flammability: 1,
      instability: 0
    },
    ghsPictograms: ["toxic-hazard", "corrosive", "environmental"],
    atoms: [
      { id: 1, element: 'N', x: 0.0, y: 0.0, z: 0.1 },
      { id: 2, element: 'H', x: 0.94, y: 0.0, z: -0.2 },
      { id: 3, element: 'H', x: -0.47, y: 0.81, z: -0.2 },
      { id: 4, element: 'H', x: -0.47, y: -0.81, z: -0.2 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 1, atom2: 3, order: 1 },
      { atom1: 1, atom2: 4, order: 1 }
    ]
  },
  {
    id: 10,
    name: "Sodium Chloride (Table Salt)",
    iupacName: "sodium chloride",
    formula: "NaCl",
    molarMass: "58.44 g/mol",
    smiles: "[Na+].[Cl-]",
    cid: 5234,
    density: "2.16 g/cm³",
    meltingPoint: "801.0 °C (1473.8 °F)",
    boilingPoint: "1465.0 °C (2669.0 °F)",
    appearance: "Colorless, cubic crystals or dry white powder",
    odor: "Odorless",
    description: "Sodium chloride is an ionic compound representing table salt, forming cubic mineral crystals (halite). It is the major salt compound contributing to the salinity of ocean waters and the extracellular biological fluids of organisms.",
    hazards: [
      "Non-hazardous in normal amounts.",
      "High concentrations cause severe dehydrative irritation, soil degradation."
    ],
    uses: [
      "Food seasoning and curing preservative",
      "Road de-icing in winter climates",
      "Feedstock for synthesizing chlorine and sodium hydroxide (Chloralkali process)"
    ],
    characteristics: [
      "Ionic crystal lattice network structure",
      "Highly soluble in water",
      "Molten state conducts electricity extremely efficiently"
    ],
    nfpa: {
      health: 1,
      flammability: 0,
      instability: 0
    },
    ghsPictograms: [],
    atoms: [
      { id: 1, element: 'Na', x: -0.8, y: 0.0, z: 0.0 },
      { id: 2, element: 'Cl', x: 0.8, y: 0.0, z: 0.0 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 1 }
    ]
  },
  {
    id: 11,
    name: "Sulfuric Acid",
    iupacName: "sulfuric acid",
    formula: "H2SO4",
    molarMass: "98.08 g/mol",
    smiles: "OS(=O)(=O)O",
    cid: 1118,
    density: "1.830 g/cm³",
    meltingPoint: "10.31 °C (50.6 °F)",
    boilingPoint: "337.0 °C (638.6 °F)",
    appearance: "Clear, colorless oily viscous liquid",
    odor: "Odorless (sharp choking odor when hot)",
    description: "Sulfuric acid is a highly corrosive mineral acid. Known historically as 'oil of vitriol', it is a powerful dehydrating agent that carbonizes organic tissue and is a major index of a nation's chemical manufacturing capacity.",
    hazards: [
      "H314: Causes severe skin burns and serious eye damage.",
      "Violent exothermic reaction when water is mixed into concentrated acid."
    ],
    uses: [
      "Phosphate fertilizer manufacturing",
      "Lead-acid automotive car batteries",
      "Acid catalysts in petrochemical refining"
    ],
    characteristics: [
      "Diprotic strong mineral acid",
      "Extremely hydrophilic (pulls water from carbohydrates, leaving charcoal)",
      "High boiling point and dense density"
    ],
    nfpa: {
      health: 3,
      flammability: 0,
      instability: 2,
      special: "W"
    },
    ghsPictograms: ["corrosive", "toxic-hazard"],
    atoms: [
      { id: 1, element: 'S', x: 0.0, y: 0.0, z: 0.0 },
      { id: 2, element: 'O', x: 0.0, y: 1.45, z: 0.0 }, // Double bond O
      { id: 3, element: 'O', x: 0.0, y: -1.45, z: 0.0 }, // Double bond O
      { id: 4, element: 'O', x: 1.4, y: 0.0, z: 0.6 },  // Single bond O-H
      { id: 5, element: 'O', x: -1.4, y: 0.0, z: -0.6 }, // Single bond O-H
      { id: 6, element: 'H', x: 2.1, y: 0.0, z: 0.1 },
      { id: 7, element: 'H', x: -2.1, y: 0.0, z: -0.1 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 2 },
      { atom1: 1, atom2: 3, order: 2 },
      { atom1: 1, atom2: 4, order: 1 },
      { atom1: 1, atom2: 5, order: 1 },
      { atom1: 4, atom2: 6, order: 1 },
      { atom1: 5, atom2: 7, order: 1 }
    ]
  },
  {
    id: 12,
    name: "Glucose",
    iupacName: "D-glucose",
    formula: "C6H12O6",
    molarMass: "180.16 g/mol",
    smiles: "C(C1C(C(C(C(O1)O)O)O)O)O",
    cid: 5793,
    density: "1.54 g/cm³",
    meltingPoint: "146.0 °C (294.8 °F)",
    boilingPoint: "Decomposes at high heat",
    appearance: "White crystalline solid or sweet powder",
    odor: "Odorless",
    description: "Glucose is a simple monosaccharide sugar that is the primary energy source in biology. Plants produce glucose through photosynthesis, and cellular respiration oxidizes glucose to release critical energy (ATP) in animals.",
    hazards: [
      "Generally non-hazardous.",
      "High physiological blood glucose levels represent diabetes pathways."
    ],
    uses: [
      "Direct cellular energy source in intravenous fluids",
      "Biological food sweetening agent",
      "Feedstock for ethanol fermentation cycles"
    ],
    characteristics: [
      "Hexose ring structure (mostly pyranose ring in solution)",
      "Multiple hydrophilic hydroxyl (-OH) groups",
      "Optically active dextrorotatory properties"
    ],
    nfpa: {
      health: 0,
      flammability: 1,
      instability: 0
    },
    ghsPictograms: [],
    atoms: [
      // Ring carbons and oxygen
      { id: 1, element: 'C', x: -1.2, y: -0.3, z: 0.0 }, // C1
      { id: 2, element: 'C', x: -0.4, y: 0.9, z: 0.0 },  // C2
      { id: 3, element: 'C', x: 1.0, y: 0.8, z: 0.0 },   // C3
      { id: 4, element: 'C', x: 1.5, y: -0.5, z: 0.0 },  // C4
      { id: 5, element: 'C', x: 0.6, y: -1.6, z: 0.0 },  // C5
      { id: 6, element: 'O', x: -0.7, y: -1.4, z: 0.0 }, // Pyranose oxygen linking C5 and C1

      // Outside side carbon (C6) off C5
      { id: 7, element: 'C', x: 1.1, y: -2.9, z: 0.1 },
      { id: 8, element: 'O', x: 2.4, y: -3.0, z: 0.1 }, // OH on C6

      // Hydroxyl groups on ring C1, C2, C3, C4
      { id: 9, element: 'O', x: -2.5, y: -0.2, z: 0.1 },  // OH on C1
      { id: 10, element: 'O', x: -0.9, y: 1.9, z: -0.6 }, // OH on C2
      { id: 11, element: 'O', x: 1.6, y: 1.8, z: 0.6 },   // OH on C3
      { id: 12, element: 'O', x: 2.8, y: -0.6, z: -0.3 },  // OH on C4

      // Representative Hydrogens to form connections
      { id: 13, element: 'H', x: -1.2, y: -0.3, z: 0.9 },
      { id: 14, element: 'H', x: -0.4, y: 0.9, z: 0.9 },
      { id: 15, element: 'H', x: 1.0, y: 0.8, z: -0.9 },
      { id: 16, element: 'H', x: 1.5, y: -0.5, z: 0.9 }
    ],
    bonds: [
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 3, order: 1 },
      { atom1: 3, atom2: 4, order: 1 },
      { atom1: 4, atom2: 5, order: 1 },
      { atom1: 5, atom2: 6, order: 1 },
      { atom1: 6, atom2: 1, order: 1 },

      // C6 attachments
      { atom1: 5, atom2: 7, order: 1 },
      { atom1: 7, atom2: 8, order: 1 },

      // OH attachments
      { atom1: 1, atom2: 9, order: 1 },
      { atom1: 2, atom2: 10, order: 1 },
      { atom1: 3, atom2: 11, order: 1 },
      { atom1: 4, atom2: 12, order: 1 },

      // Hydrogens
      { atom1: 1, atom2: 13, order: 1 },
      { atom1: 2, atom2: 14, order: 1 },
      { atom1: 3, atom2: 15, order: 1 },
      { atom1: 4, atom2: 16, order: 1 }
    ]
  }
];
