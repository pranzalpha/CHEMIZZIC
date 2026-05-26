/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Atom3D {
  id: number;
  element: string;
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface Bond3D {
  atom1: number;
  atom2: number;
  order: number; // 1 = single, 2 = double, 3 = triple
}

export interface ChemicalProp {
  id: number;
  name: string;
  iupacName: string;
  formula: string;
  molarMass: string;
  smiles: string;
  cid?: number;
  structureImage?: string;
  density: string;
  meltingPoint: string;
  boilingPoint: string;
  appearance: string;
  odor: string;
  hazards: string[];
  uses: string[];
  characteristics: string[];
  nfpa?: {
    health: number;
    flammability: number;
    instability: number;
    special?: string;
  };
  ghsPictograms?: string[]; // flammable, toxic, corrosive, explosive, etc.
}

export interface ElementDetail {
  number: number;
  symbol: string;
  name: string;
  mass: number;
  category: string; // alkali, transition, noble-gas, etc.
  phase: 'Solid' | 'Liquid' | 'Gas' | 'Synthetic';
  electronConfig: string;
  melt?: number; // Kelvin
  boil?: number; // Kelvin
  electronegativity?: number;
  discovery: string;
  summary: string;
}

export interface ReactionDetail {
  reactantText: string;
  balancedEquation: string;
  reactionType: string;
  thermalType: 'Exothermic' | 'Endothermic' | 'Neutral';
  energyChange: string;
  activationEnergy: string;
  catalysts: string[];
  equationBalanced: {
    reactants: { formula: string; coefficient: number; name: string }[];
    products: { formula: string; coefficient: number; name: string }[];
  };
  keyInsights: string[];
  uses: string[];
}

export interface ExplainResponse {
  chemicalName: string;
  studentExplanation: string;
  scientistExplanation: string;
  safetySummary: string;
  funFact: string;
}
