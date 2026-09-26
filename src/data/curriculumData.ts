/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Complete Chemistry Curriculum Data Model
 * Multi-tier educational hierarchy:
 * Education Level -> Program / Class -> Subject -> Unit -> Topic -> Subtopic -> Concept -> Prerequisites
 * 
 * Covers:
 * - CLASS 11 (13 comprehensive units)
 * - CLASS 12 (16 core board/competitive units)
 * - BSc (Physical, Organic, Inorganic, Analytical)
 * - MSc (Advanced Physical, Organic, Inorganic, Analytical)
 * - BTech (Engineering Chemistry, Materials, Electrochemistry, Water, Nanotechnology)
 * - MTech (Advanced Energy Materials, Nanochemistry, Catalysis, Characterization, Sensors)
 */

import { 
  EducationLevelDefinition, 
  UnitDefinition, 
  TopicDefinition, 
  ConceptDefinition,
  MindMapNode
} from '../types/curriculum';

// ==========================================
// 1. EDUCATION LEVELS
// ==========================================

export const EDUCATION_LEVELS: EducationLevelDefinition[] = [
  {
    id: 'CLASS_11',
    label: 'Class 11 Chemistry',
    subtitle: 'Higher Secondary • Foundational Principles',
    description: 'Core physical chemistry concepts, atomic structure, periodic classification, chemical bonding, thermodynamics, and organic basics.',
    iconName: 'GraduationCap',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30',
    programs: [
      {
        id: 'cbse_11',
        name: 'Higher Secondary Standard / CBSE / State Boards',
        educationLevel: 'CLASS_11',
        description: 'Standard 11th Grade Chemistry Syllabus',
        subjectIds: ['chem_11_core']
      }
    ]
  },
  {
    id: 'CLASS_12',
    label: 'Class 12 Chemistry',
    subtitle: 'Senior Secondary • Board & Competitive Excellence',
    description: 'Advanced electrochemistry, chemical kinetics, coordination complexes, organic functional groups, biomolecules, and polymers.',
    iconName: 'Award',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
    programs: [
      {
        id: 'cbse_12',
        name: 'Senior Secondary Standard / CBSE / JEE / NEET',
        educationLevel: 'CLASS_12',
        description: 'Standard 12th Grade Chemistry Syllabus with entrance examination focus',
        subjectIds: ['chem_12_core']
      }
    ]
  },
  {
    id: 'BSC',
    label: 'BSc Chemistry',
    subtitle: 'Undergraduate Degree Program',
    description: 'Rigorous deep-dive across Physical, Inorganic, Organic, and Analytical chemistry, laboratory instrumentations, and reaction mechanisms.',
    iconName: 'BookOpen',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-950/30',
    programs: [
      {
        id: 'bsc_chem_hons',
        name: 'BSc (Honours) Chemistry',
        educationLevel: 'BSC',
        description: 'Comprehensive 3-year Undergraduate Chemistry Curriculum',
        subjectIds: ['bsc_physical', 'bsc_organic', 'bsc_inorganic', 'bsc_analytical']
      }
    ]
  },
  {
    id: 'MSC',
    label: 'MSc Chemistry',
    subtitle: 'Postgraduate & Research Specialization',
    description: 'Advanced quantum chemistry, molecular spectroscopy, retrosynthetic analysis, organometallics, and instrumental characterization.',
    iconName: 'Microscope',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
    programs: [
      {
        id: 'msc_chem_postgrad',
        name: 'MSc in Chemical Sciences',
        educationLevel: 'MSC',
        description: '2-year Master of Science specialized research syllabus',
        subjectIds: ['msc_physical', 'msc_organic', 'msc_inorganic', 'msc_analytical']
      }
    ]
  },
  {
    id: 'BTECH',
    label: 'BTech Chemistry',
    subtitle: 'Engineering Chemistry & Applied Sciences',
    description: 'Applied electrochemistry, corrosion protection, high-energy batteries, fuel cells, water treatment, engineering polymers, and green processes.',
    iconName: 'Cpu',
    badgeColor: 'border-orange-500/40 text-orange-300 bg-orange-950/30',
    programs: [
      {
        id: 'btech_eng_chem',
        name: 'BTech Engineering Chemistry & Materials Science',
        educationLevel: 'BTECH',
        description: 'Applied Chemistry across Electrical, Mechanical, Chemical & Computer Engineering disciplines',
        subjectIds: ['btech_eng_chem_core']
      }
    ]
  },
  {
    id: 'MTECH',
    label: 'MTech Chemistry',
    subtitle: 'Advanced Materials & Nanotechnology',
    description: 'Interdisciplinary nanochemistry, semiconductor chemistry, advanced battery cathodes/anodes, surface engineering, and computational materials science.',
    iconName: 'Sparkles',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-950/30',
    programs: [
      {
        id: 'mtech_mat_chem',
        name: 'MTech in Chemical Technology & Advanced Materials',
        educationLevel: 'MTECH',
        description: 'Advanced technology, clean energy storage, device chemistry, and functional nanomaterials',
        subjectIds: ['mtech_mat_chem_core']
      }
    ]
  }
];

// ==========================================
// 2. UNITS DATABASE
// ==========================================

export const CURRICULUM_UNITS: UnitDefinition[] = [
  // --- CLASS 11 UNITS ---
  {
    id: 'u11_basic_concepts',
    unitNumber: 1,
    name: 'Some Basic Concepts of Chemistry',
    subjectId: 'chem_11_core',
    branch: 'Physical',
    description: 'Mole concept, stoichiometry, atomic & molecular mass, concentration units, and empirical formulas.',
    topicIds: ['t_mole_concept', 't_stoichiometry', 't_concentration_terms']
  },
  {
    id: 'u11_structure_atom',
    unitNumber: 2,
    name: 'Structure of Atom',
    subjectId: 'chem_11_core',
    branch: 'Physical',
    description: 'Bohr model, quantum theory, quantum numbers, orbitals, and electronic configurations.',
    topicIds: ['t_atomic_models', 't_quantum_numbers', 't_electronic_config']
  },
  {
    id: 'u11_periodicity',
    unitNumber: 3,
    name: 'Classification of Elements and Periodicity in Properties',
    subjectId: 'chem_11_core',
    branch: 'Inorganic',
    description: 'Modern periodic law, ionization energy, electron gain enthalpy, electronegativity, and periodic trends.',
    topicIds: ['t_periodic_table', 't_periodic_trends']
  },
  {
    id: 'u11_bonding',
    unitNumber: 4,
    name: 'Chemical Bonding and Molecular Structure',
    subjectId: 'chem_11_core',
    branch: 'Inorganic',
    description: 'Ionic & covalent bonds, Lewis dot structures, VSEPR theory, hybridization, and molecular orbital theory.',
    topicIds: ['t_lewis_octet', 't_vsepr_geometry', 't_hybridization', 't_mot']
  },
  {
    id: 'u11_states_matter',
    unitNumber: 5,
    name: 'States of Matter: Gases and Liquids',
    subjectId: 'chem_11_core',
    branch: 'Physical',
    description: 'Ideal and real gas laws, kinetic molecular theory, van der Waals equation, and liquid properties.',
    topicIds: ['t_gas_laws', 't_real_gases', 't_liquids']
  },
  {
    id: 'u11_thermodynamics',
    unitNumber: 6,
    name: 'Chemical Thermodynamics',
    subjectId: 'chem_11_core',
    branch: 'Physical',
    description: 'Internal energy, enthalpy, Hess’s law, entropy, Gibbs free energy, and spontaneity criteria.',
    topicIds: ['t_first_law_enthalpy', 't_hess_law', 't_entropy_gibbs']
  },
  {
    id: 'u11_equilibrium',
    unitNumber: 7,
    name: 'Equilibrium (Chemical & Ionic)',
    subjectId: 'chem_11_core',
    branch: 'Physical',
    description: 'Dynamic equilibrium, Le Chatelier’s principle, acid-base ionization, pH, buffers, and solubility product.',
    topicIds: ['t_chemical_equilibrium', 't_ionic_equilibrium', 't_ph_buffers']
  },
  {
    id: 'u11_redox',
    unitNumber: 8,
    name: 'Redox Reactions',
    subjectId: 'chem_11_core',
    branch: 'Physical',
    description: 'Oxidation numbers, redox balancing methods, and disproportionation reactions.',
    topicIds: ['t_oxidation_numbers', 't_redox_balancing']
  },
  {
    id: 'u11_hydrogen',
    unitNumber: 9,
    name: 'Hydrogen',
    subjectId: 'chem_11_core',
    branch: 'Inorganic',
    description: 'Isotopes of hydrogen, hydrides, water anomalies, and hydrogen peroxide chemistry.',
    topicIds: ['t_hydrogen_hydrides', 't_hydrogen_peroxide']
  },
  {
    id: 'u11_sblock',
    unitNumber: 10,
    name: 'The s-Block Elements (Alkali & Alkaline Earth Metals)',
    subjectId: 'chem_11_core',
    branch: 'Inorganic',
    description: 'Group 1 and Group 2 elements, diagonal relationships, anomalous behaviors, and industrial compounds.',
    topicIds: ['t_alkali_metals', 't_alkaline_earth_metals']
  },
  {
    id: 'u11_organic_basics',
    unitNumber: 11,
    name: 'Organic Chemistry – Basic Principles & Techniques',
    subjectId: 'chem_11_core',
    branch: 'Organic',
    description: 'IUPAC nomenclature, isomerism, inductive effect, resonance, hyperconjugation, and reactive intermediates.',
    topicIds: ['t_iupac_nomenclature', 't_electronic_effects', 't_reactive_intermediates']
  },
  {
    id: 'u11_hydrocarbons',
    unitNumber: 12,
    name: 'Hydrocarbons',
    subjectId: 'chem_11_core',
    branch: 'Organic',
    description: 'Alkanes, alkenes, alkynes, aromatic hydrocarbons, Markovnikov addition, and electrophilic substitution.',
    topicIds: ['t_alkanes_alkenes', 't_alkynes', 't_aromatic_hydrocarbons']
  },
  {
    id: 'u11_environmental',
    unitNumber: 13,
    name: 'Environmental Chemistry',
    subjectId: 'chem_11_core',
    branch: 'Environmental',
    description: 'Atmospheric pollutants, smog, greenhouse effect, ozone depletion, and green chemistry principles.',
    topicIds: ['t_atmospheric_pollution', 't_green_chemistry']
  },

  // --- CLASS 12 UNITS ---
  {
    id: 'u12_solid_state',
    unitNumber: 1,
    name: 'Solid State',
    subjectId: 'chem_12_core',
    branch: 'Physical',
    description: 'Crystal lattices, unit cells, close packing, voids, packing efficiency, and crystal defects.',
    topicIds: ['t_crystal_lattices', 't_solid_defects']
  },
  {
    id: 'u12_solutions',
    unitNumber: 2,
    name: 'Solutions',
    subjectId: 'chem_12_core',
    branch: 'Physical',
    description: 'Raoult’s law, ideal vs non-ideal solutions, colligative properties, and van ’t Hoff factor.',
    topicIds: ['t_raoult_law', 't_colligative_properties']
  },
  {
    id: 'u12_electrochemistry',
    unitNumber: 3,
    name: 'Electrochemistry',
    subjectId: 'chem_12_core',
    branch: 'Physical',
    description: 'Galvanic cells, Daniell cell, Nernst equation, electrolytic conductance, Kohlrausch’s law, and Faraday’s laws.',
    topicIds: ['t_galvanic_daniell_cell', 't_nernst_equation', 't_electrolytic_conductance']
  },
  {
    id: 'u12_kinetics',
    unitNumber: 4,
    name: 'Chemical Kinetics',
    subjectId: 'chem_12_core',
    branch: 'Physical',
    description: 'Rate laws, order, molecularity, integrated rate equations, Arrhenius equation, and collision theory.',
    topicIds: ['t_rate_laws_orders', 't_integrated_rates', 't_arrhenius_activation']
  },
  {
    id: 'u12_surface',
    unitNumber: 5,
    name: 'Surface Chemistry',
    subjectId: 'chem_12_core',
    branch: 'Physical',
    description: 'Adsorption isotherms (Freundlich), catalysis, colloids, Tyndall effect, and coagulation (Hardy-Schulze rule).',
    topicIds: ['t_adsorption', 't_colloids_emulsions']
  },
  {
    id: 'u12_metallurgy',
    unitNumber: 6,
    name: 'General Principles and Processes of Isolation of Elements',
    subjectId: 'chem_12_core',
    branch: 'Inorganic',
    description: 'Concentration of ores, roasting, calcination, Ellingham diagrams, and zone refining.',
    topicIds: ['t_extraction_metallurgy', 't_ellingham_diagrams']
  },
  {
    id: 'u12_pblock',
    unitNumber: 7,
    name: 'The p-Block Elements (Groups 15, 16, 17, 18)',
    subjectId: 'chem_12_core',
    branch: 'Inorganic',
    description: 'Nitrogen family, chalcogens, halogens, noble gases, oxoacids, and interhalogen compounds.',
    topicIds: ['t_group15_nitrogen', 't_group16_chalcogens', 't_group17_halogens', 't_group18_noblegases']
  },
  {
    id: 'u12_d_f_block',
    unitNumber: 8,
    name: 'The d- and f-Block Elements',
    subjectId: 'chem_12_core',
    branch: 'Inorganic',
    description: 'Transition metal characteristics, variable oxidation states, lanthanoid contraction, and actinoids.',
    topicIds: ['t_transition_metals', 't_lanthanoids_actinoids']
  },
  {
    id: 'u12_coordination',
    unitNumber: 9,
    name: 'Coordination Compounds',
    subjectId: 'chem_12_core',
    branch: 'Inorganic',
    description: 'Werner’s theory, IUPAC naming, isomerism, Crystal Field Theory (CFT), and spectrochemical series.',
    topicIds: ['t_coordination_basics', 't_crystal_field_theory', 't_coordination_isomerism']
  },
  {
    id: 'u12_haloalkanes',
    unitNumber: 10,
    name: 'Haloalkanes and Haloarenes',
    subjectId: 'chem_12_core',
    branch: 'Organic',
    description: 'SN1 vs SN2 nucleophilic substitutions, elimination (Zaitsev), stereochemical inversion, and polyhalogen compounds.',
    topicIds: ['t_sn1_sn2_mechanisms', 't_haloorganic_reactions']
  },
  {
    id: 'u12_alcohols_phenols',
    unitNumber: 11,
    name: 'Alcohols, Phenols and Ethers',
    subjectId: 'chem_12_core',
    branch: 'Organic',
    description: 'Hydroboration-oxidation, Kolbe reaction, Reimer-Tiemann reaction, Williamson ether synthesis, and acidity of phenols.',
    topicIds: ['t_alcohols_synthesis', 't_phenols_reactions', 't_williamson_ethers']
  },
  {
    id: 'u12_carbonyls',
    unitNumber: 12,
    name: 'Aldehydes, Ketones and Carboxylic Acids',
    subjectId: 'chem_12_core',
    branch: 'Organic',
    description: 'Nucleophilic addition, Aldol condensation, Cannizzaro reaction, Tollens/Fehling tests, and HVZ reaction.',
    topicIds: ['t_nucleophilic_addition', 't_aldol_cannizzaro', 't_carboxylic_acids']
  },
  {
    id: 'u12_amines',
    unitNumber: 13,
    name: 'Amines',
    subjectId: 'chem_12_core',
    branch: 'Organic',
    description: 'Basicity order of amines, Gabriel phthalimide synthesis, Hoffmann bromamide, and diazonium coupling reactions.',
    topicIds: ['t_amines_basicity', 't_diazonium_salts']
  },
  {
    id: 'u12_biomolecules',
    unitNumber: 14,
    name: 'Biomolecules',
    subjectId: 'chem_12_core',
    branch: 'Biochemistry',
    description: 'Carbohydrates (glucose mutarotation), proteins (peptide bonds, denaturation), and nucleic acids (DNA/RNA).',
    topicIds: ['t_carbohydrates_glucose', 't_amino_acids_proteins', 't_nucleic_acids']
  },
  {
    id: 'u12_polymers',
    unitNumber: 15,
    name: 'Polymers',
    subjectId: 'chem_12_core',
    branch: 'Materials',
    description: 'Addition vs condensation polymerization, copolymerization, Bakelite, Nylon, Dacron, and biodegradable polymers.',
    topicIds: ['t_addition_condensation_polymers', 't_synthetic_rubbers']
  },
  {
    id: 'u12_everyday_chem',
    unitNumber: 16,
    name: 'Chemistry in Everyday Life',
    subjectId: 'chem_12_core',
    branch: 'Organic',
    description: 'Drugs, analgesics, antibiotics, food preservatives, artificial sweeteners, soaps, and synthetic detergents.',
    topicIds: ['t_pharmaceutical_agents', 't_soaps_detergents']
  },

  // --- BSC CHEMISTRY UNITS ---
  {
    id: 'ubsc_phys_quantum',
    unitNumber: 1,
    name: 'Undergraduate Quantum Chemistry & Spectroscopy',
    subjectId: 'bsc_physical',
    branch: 'Physical',
    description: 'Schrödinger wave equation, particle in a 1D/3D box, rotational, vibrational, and Raman spectroscopy.',
    topicIds: ['t_bsc_schrodinger', 't_bsc_molecular_spectroscopy']
  },
  {
    id: 'ubsc_org_mechanisms',
    unitNumber: 2,
    name: 'Advanced Organic Mechanisms & Stereochemistry',
    subjectId: 'bsc_organic',
    branch: 'Organic',
    description: 'Conformational analysis, optical activity, enantiomeric excess, named rearrangements, and aromatic substitutions.',
    topicIds: ['t_bsc_stereochemistry', 't_bsc_named_reactions']
  },
  {
    id: 'ubsc_inorg_coordination',
    unitNumber: 3,
    name: 'Inorganic Coordination & Organometallic Chemistry',
    subjectId: 'bsc_inorganic',
    branch: 'Inorganic',
    description: 'Crystal field splitting, Jahn-Teller distortion, 18-electron rule, and metal carbonyl backbonding.',
    topicIds: ['t_bsc_crystal_field', 't_bsc_organometallics_18e']
  },
  {
    id: 'ubsc_analytical_methods',
    unitNumber: 4,
    name: 'Analytical Chemistry & Instrumentation',
    subjectId: 'bsc_analytical',
    branch: 'Analytical',
    description: 'Gravimetry, complexometric EDTA titrations, chromatography (HPLC, GC), and spectrophotometry.',
    topicIds: ['t_bsc_titrimetry_edta', 't_bsc_chromatography']
  },

  // --- MSC CHEMISTRY UNITS ---
  {
    id: 'umsc_advanced_quantum',
    unitNumber: 1,
    name: 'Advanced Quantum Chemistry & Group Theory',
    subjectId: 'msc_physical',
    branch: 'Physical',
    description: 'Perturbation theory, Hartree-Fock SCF method, point groups, character tables, and molecular symmetry.',
    topicIds: ['t_msc_hartree_fock', 't_msc_group_theory']
  },
  {
    id: 'umsc_organic_synthesis',
    unitNumber: 2,
    name: 'Retrosynthetic Analysis & Asymmetric Synthesis',
    subjectId: 'msc_organic',
    branch: 'Organic',
    description: 'Disconnections, synthons, chiral auxiliaries, Sharpless epoxidation, and cross-coupling catalysis.',
    topicIds: ['t_msc_retrosynthesis', 't_msc_asymmetric_catalysis']
  },
  {
    id: 'umsc_bioinorganic',
    unitNumber: 3,
    name: 'Advanced Bioinorganic Chemistry & Catalysis',
    subjectId: 'msc_inorganic',
    branch: 'Inorganic',
    description: 'Metalloenzymes, nitrogenase, hemoglobin oxygen transport, Heck/Suzuki reactions, and olefin metathesis.',
    topicIds: ['t_msc_metalloenzymes', 't_msc_cross_coupling']
  },
  {
    id: 'umsc_instrumental_analysis',
    unitNumber: 4,
    name: 'High-Resolution Spectroscopy & Mass Spectrometry',
    subjectId: 'msc_analytical',
    branch: 'Analytical',
    description: '2D NMR (COSY, NOESY), HRMS, MALDI-TOF, XPS, and cyclic voltammetry.',
    topicIds: ['t_msc_2d_nmr', 't_msc_mass_spectrometry']
  },

  // --- BTECH CHEMISTRY UNITS ---
  {
    id: 'ubtech_energy_corrosion',
    unitNumber: 1,
    name: 'Electrochemistry, Corrosion & Energy Storage',
    subjectId: 'btech_eng_chem_core',
    branch: 'Engineering',
    description: 'Electrochemical corrosion mechanisms, cathodic protection, Lithium-ion batteries, supercapacitors, and fuel cells.',
    topicIds: ['t_btech_corrosion', 't_btech_batteries_fuel_cells']
  },
  {
    id: 'ubtech_water_materials',
    unitNumber: 2,
    name: 'Water Treatment Technology & Engineering Materials',
    subjectId: 'btech_eng_chem_core',
    branch: 'Engineering',
    description: 'Hardness estimation (EDTA), reverse osmosis, boiler troubles, engineering polymers, composites, and lubricants.',
    topicIds: ['t_btech_water_treatment', 't_btech_engineering_polymers']
  },

  // --- MTECH CHEMISTRY UNITS ---
  {
    id: 'umtech_nanomaterials',
    unitNumber: 1,
    name: 'Nanochemistry & Functional Materials Technology',
    subjectId: 'mtech_mat_chem_core',
    branch: 'Materials',
    description: 'Quantum dots, graphene, MOFs (metal-organic frameworks), Perovskites, and solid-state battery electrolytes.',
    topicIds: ['t_mtech_nanostructures', 't_mtech_energy_materials']
  },
  {
    id: 'umtech_characterization',
    unitNumber: 2,
    name: 'Advanced Surface Engineering & Device Characterization',
    subjectId: 'mtech_mat_chem_core',
    branch: 'Materials',
    description: 'X-ray diffraction (Rietveld refinement), electron microscopy (TEM/SEM), thin-film deposition, and biosensors.',
    topicIds: ['t_mtech_surface_analysis', 't_mtech_sensors']
  }
];

// ==========================================
// 3. TOPICS DATABASE
// ==========================================

export const CURRICULUM_TOPICS: TopicDefinition[] = [
  // Class 11 Topics
  {
    id: 't_mole_concept',
    name: 'Mole Concept & Stoichiometry',
    unitId: 'u11_basic_concepts',
    branch: 'Physical',
    description: 'Avogadro’s number, molar mass, stoichiometry calculations, and limiting reagent determination.',
    subtopicIds: ['sub_mole_basics', 'sub_limiting_reagent'],
    conceptIds: ['c_mole_concept', 'c_limiting_reagent', 'c_percentage_composition'],
    prerequisites: [],
    estimatedQuestions: 1200
  },
  {
    id: 't_concentration_terms',
    name: 'Concentration Terms & Equivalent Mass',
    unitId: 'u11_basic_concepts',
    branch: 'Physical',
    description: 'Molarity, Molality, Normality, Mole Fraction, ppm, and Equivalent weight in redox.',
    subtopicIds: ['sub_molarity_molality', 'sub_normality_equivalents'],
    conceptIds: ['c_molarity_molality', 'c_equivalent_mass'],
    prerequisites: ['c_mole_concept'],
    estimatedQuestions: 1100
  },
  {
    id: 't_atomic_models',
    name: 'Atomic Structure & Bohr Model',
    unitId: 'u11_structure_atom',
    branch: 'Physical',
    description: 'Rutherford alpha scattering, Planck quantum theory, Bohr postulates, and hydrogen spectrum lines.',
    subtopicIds: ['sub_bohr_spectrum'],
    conceptIds: ['c_bohr_model', 'c_hydrogen_spectrum'],
    prerequisites: [],
    estimatedQuestions: 1050
  },
  {
    id: 't_quantum_numbers',
    name: 'Quantum Mechanical Model & Orbitals',
    unitId: 'u11_structure_atom',
    branch: 'Physical',
    description: 'Principal, azimuthal, magnetic, and spin quantum numbers; de Broglie wavelength; Heisenberg uncertainty.',
    subtopicIds: ['sub_quantum_numbers', 'sub_debroglie_heisenberg'],
    conceptIds: ['c_quantum_numbers', 'c_heisenberg_debroglie'],
    prerequisites: ['c_bohr_model'],
    estimatedQuestions: 1150
  },
  {
    id: 't_periodic_trends',
    name: 'Periodic Classification & Trends',
    unitId: 'u11_periodicity',
    branch: 'Inorganic',
    description: 'Atomic & ionic radii, first & second ionization energy, electron gain enthalpy, and electronegativity.',
    subtopicIds: ['sub_radii_trends', 'sub_ie_ea_trends'],
    conceptIds: ['c_atomic_radii', 'c_ionization_enthalpy', 'c_electronegativity'],
    prerequisites: ['c_quantum_numbers'],
    estimatedQuestions: 1300
  },
  {
    id: 't_vsepr_geometry',
    name: 'VSEPR Theory & Molecular Geometry',
    unitId: 'u11_bonding',
    branch: 'Inorganic',
    description: 'Valence Shell Electron Pair Repulsion, lone pair distortions, bond angles, and steric numbers.',
    subtopicIds: ['sub_vsepr_shapes', 'sub_lone_pair_repulsion'],
    conceptIds: ['c_vsepr_theory', 'c_molecular_geometry'],
    prerequisites: ['c_electronegativity'],
    estimatedQuestions: 1250
  },
  {
    id: 't_hybridization',
    name: 'Orbital Hybridization & Polarity',
    unitId: 'u11_bonding',
    branch: 'Inorganic',
    description: 'sp, sp2, sp3, sp3d, sp3d2 hybridizations, sigma/pi bonds, dipole moments, and hydrogen bonding.',
    subtopicIds: ['sub_hybrid_schemes', 'sub_dipole_hbond'],
    conceptIds: ['c_hybridization', 'c_dipole_moment'],
    prerequisites: ['c_vsepr_theory'],
    estimatedQuestions: 1200
  },
  {
    id: 't_first_law_enthalpy',
    name: 'First Law of Thermodynamics & Enthalpy',
    unitId: 'u11_thermodynamics',
    branch: 'Physical',
    description: 'State functions, internal energy (ΔU = q + w), enthalpy (ΔH), heat capacities (Cp, Cv), and Hess’s law.',
    subtopicIds: ['sub_first_law', 'sub_enthalpy_reactions'],
    conceptIds: ['c_internal_energy', 'c_enthalpy_hess_law'],
    prerequisites: ['c_mole_concept'],
    estimatedQuestions: 1100
  },
  {
    id: 't_entropy_gibbs',
    name: 'Entropy & Gibbs Free Energy (Spontaneity)',
    unitId: 'u11_thermodynamics',
    branch: 'Physical',
    description: 'Second and third laws, entropy changes (ΔS), Gibbs-Helmholtz equation (ΔG = ΔH - TΔS), and spontaneity.',
    subtopicIds: ['sub_entropy_second_law', 'sub_gibbs_spontaneity'],
    conceptIds: ['c_entropy', 'c_gibbs_free_energy'],
    prerequisites: ['c_enthalpy_hess_law'],
    estimatedQuestions: 1400
  },
  {
    id: 't_chemical_equilibrium',
    name: 'Chemical Equilibrium & Le Chatelier',
    unitId: 'u11_equilibrium',
    branch: 'Physical',
    description: 'Equilibrium constants (Kc, Kp), reaction quotient (Q), and Le Chatelier’s principle (P, T, concentration).',
    subtopicIds: ['sub_kc_kp', 'sub_le_chatelier'],
    conceptIds: ['c_equilibrium_constant', 'c_le_chatelier_principle'],
    prerequisites: ['c_gibbs_free_energy'],
    estimatedQuestions: 1350
  },
  {
    id: 't_ph_buffers',
    name: 'Ionic Equilibrium, pH & Buffers',
    unitId: 'u11_equilibrium',
    branch: 'Physical',
    description: 'Ostwald dilution law, pH/pOH scale, buffer solutions (Henderson-Hasselbalch), and solubility product (Ksp).',
    subtopicIds: ['sub_ph_scale', 'sub_buffer_solutions', 'sub_ksp'],
    conceptIds: ['c_ph_calculations', 'c_buffer_action', 'c_solubility_product'],
    prerequisites: ['c_equilibrium_constant'],
    estimatedQuestions: 1500
  },
  {
    id: 't_redox_balancing',
    name: 'Redox Reactions & Balancing',
    unitId: 'u11_redox',
    branch: 'Physical',
    description: 'Oxidation numbers, ion-electron half-reaction method, oxidation number method, and redox titrations.',
    subtopicIds: ['sub_ox_states', 'sub_half_reactions'],
    conceptIds: ['c_oxidation_states', 'c_redox_half_reactions'],
    prerequisites: [],
    estimatedQuestions: 1100
  },
  {
    id: 't_electronic_effects',
    name: 'Organic Electronic Effects & Intermediates',
    unitId: 'u11_organic_basics',
    branch: 'Organic',
    description: 'Inductive effect, resonance / mesomeric effect, hyperconjugation, carbocations, carbanions, and free radicals.',
    subtopicIds: ['sub_resonance_inductive', 'sub_carbocation_stability'],
    conceptIds: ['c_resonance_hyperconjugation', 'c_carbocation_stability'],
    prerequisites: ['c_hybridization'],
    estimatedQuestions: 1300
  },

  // Class 12 Topics
  {
    id: 't_galvanic_daniell_cell',
    name: 'Galvanic Cells & Daniell Cell Architecture',
    unitId: 'u12_electrochemistry',
    branch: 'Physical',
    description: 'Anode oxidation, cathode reduction, salt bridge function, electron flow, standard reduction potentials, and EMF.',
    subtopicIds: ['sub_daniell_cell', 'sub_cell_potential'],
    conceptIds: ['c_daniell_cell', 'c_standard_electrode_potentials'],
    prerequisites: ['c_redox_half_reactions'],
    estimatedQuestions: 1450
  },
  {
    id: 't_nernst_equation',
    name: 'Nernst Equation & Concentration Cells',
    unitId: 'u12_electrochemistry',
    branch: 'Physical',
    description: 'Nernst equation EMF calculation, equilibrium constant relation (ΔG° = -nFE° = -RT ln K), and concentration cells.',
    subtopicIds: ['sub_nernst_calc', 'sub_gibbs_cell_emf'],
    conceptIds: ['c_nernst_equation', 'c_gibbs_cell_relation'],
    prerequisites: ['c_daniell_cell', 'c_gibbs_free_energy'],
    estimatedQuestions: 1600
  },
  {
    id: 't_rate_laws_orders',
    name: 'Chemical Kinetics: Rate Laws & Reaction Order',
    unitId: 'u12_kinetics',
    branch: 'Physical',
    description: 'Rate of reaction, rate constant k, order (0, 1st, 2nd, pseudo-first), molecularity, and differential rate laws.',
    subtopicIds: ['sub_rate_laws', 'sub_reaction_order'],
    conceptIds: ['c_rate_laws', 'c_order_molecularity'],
    prerequisites: ['c_concentration_terms'],
    estimatedQuestions: 1350
  },
  {
    id: 't_arrhenius_activation',
    name: 'Arrhenius Equation & Activation Energy',
    unitId: 'u12_kinetics',
    branch: 'Physical',
    description: 'Temperature dependence of reaction rates, activation energy (Ea), Arrhenius plot ln(k) vs 1/T, and catalysts.',
    subtopicIds: ['sub_arrhenius_plots', 'sub_catalysis_kinetics'],
    conceptIds: ['c_arrhenius_equation', 'c_activation_energy'],
    prerequisites: ['c_rate_laws'],
    estimatedQuestions: 1250
  },
  {
    id: 't_crystal_field_theory',
    name: 'Crystal Field Theory & Coordination Chemistry',
    unitId: 'u12_coordination',
    branch: 'Inorganic',
    description: 'Octahedral and tetrahedral splitting (Δo, Δt), high spin vs low spin, spectrochemical series, and magnetic moments.',
    subtopicIds: ['sub_cft_octahedral', 'sub_spectrochemical_series'],
    conceptIds: ['c_crystal_field_splitting', 'c_spectrochemical_series'],
    prerequisites: ['c_quantum_numbers', 'c_hybridization'],
    estimatedQuestions: 1400
  },
  {
    id: 't_sn1_sn2_mechanisms',
    name: 'Nucleophilic Substitution: SN1 vs SN2 Mechanisms',
    unitId: 'u12_haloalkanes',
    branch: 'Organic',
    description: 'Kinetics, stereochemical inversion vs racemization, carbocation rearrangement, substrate reactivity, and solvents.',
    subtopicIds: ['sub_sn1_mechanism', 'sub_sn2_mechanism'],
    conceptIds: ['c_sn1_mechanism', 'c_sn2_mechanism'],
    prerequisites: ['c_carbocation_stability'],
    estimatedQuestions: 1550
  },
  {
    id: 't_aldol_cannizzaro',
    name: 'Aldol Condensation & Cannizzaro Reactions',
    unitId: 'u12_carbonyls',
    branch: 'Organic',
    description: 'Enolate generation, nucleophilic carbonyl addition, dehydration to α,β-unsaturated carbonyls, and hydride transfer.',
    subtopicIds: ['sub_aldol_condensation', 'sub_cannizzaro_reaction'],
    conceptIds: ['c_aldol_condensation', 'c_cannizzaro_reaction'],
    prerequisites: ['c_resonance_hyperconjugation'],
    estimatedQuestions: 1400
  },

  // Undergraduate BSc / Engineering Topics
  {
    id: 't_btech_batteries_fuel_cells',
    name: 'Engineering Batteries, Fuel Cells & Supercapacitors',
    unitId: 'ubtech_energy_corrosion',
    branch: 'Engineering',
    description: 'Lead-acid, Nickel-Cadmium, Lithium-ion intercalation dynamics, PEM fuel cells, and energy density metrics.',
    subtopicIds: ['sub_li_ion_cells', 'sub_pem_fuel_cells'],
    conceptIds: ['c_li_ion_batteries', 'c_fuel_cell_thermodynamics'],
    prerequisites: ['c_daniell_cell', 'c_nernst_equation'],
    estimatedQuestions: 1200
  },
  {
    id: 't_btech_corrosion',
    name: 'Corrosion Engineering & Cathodic Protection',
    unitId: 'ubtech_energy_corrosion',
    branch: 'Engineering',
    description: 'Electrochemical theory of rusting, sacrificial anode cathodic protection, impressed current, and Pourbaix diagrams.',
    subtopicIds: ['sub_corrosion_mechanisms', 'sub_cathodic_protection'],
    conceptIds: ['c_corrosion_mechanisms', 'c_cathodic_protection'],
    prerequisites: ['c_daniell_cell'],
    estimatedQuestions: 1100
  },
  {
    id: 't_mtech_nanostructures',
    name: 'Nanochemistry & Functional Energy Materials',
    unitId: 'umtech_nanomaterials',
    branch: 'Materials',
    description: 'Quantum confinement, surface-to-volume ratio, carbon nanotubes, metal-organic frameworks, and perovskites.',
    subtopicIds: ['sub_quantum_dots', 'sub_perovskites_mofs'],
    conceptIds: ['c_nanochemistry_confinement', 'c_perovskites_energy'],
    prerequisites: ['c_crystal_field_splitting', 'c_li_ion_batteries'],
    estimatedQuestions: 1050
  }
];

// ==========================================
// 4. CONCEPTS DATABASE (Deep Prerequisite Graph)
// ==========================================

export const CURRICULUM_CONCEPTS: ConceptDefinition[] = [
  // Class 11 Concepts
  {
    id: 'c_mole_concept',
    name: 'Mole Concept & Avogadro Number',
    branch: 'Physical',
    description: '1 mole contains 6.022 × 10²³ particles (atoms, molecules, or ions). Relates microscopic count to macroscopic mass.',
    prerequisites: [],
    keyFormulasAndRules: ['n = mass / MolarMass', 'n = N / NA', 'n = V(gas at STP) / 22.4 L'],
    subtopics: ['Avogadro Constant', 'Molar Mass', 'Gram Atomic Mass'],
    unitId: 'u11_basic_concepts',
    topicId: 't_mole_concept',
    educationLevel: 'CLASS_11',
    realWorldApplications: ['Dosage formulation in pharmaceuticals', 'Industrial chemical yield monitoring']
  },
  {
    id: 'c_limiting_reagent',
    name: 'Stoichiometry & Limiting Reagent',
    branch: 'Physical',
    description: 'The reactant that is completely consumed first in a chemical reaction, limiting the theoretical amount of product formed.',
    prerequisites: ['c_mole_concept'],
    keyFormulasAndRules: ['Mole ratio = Moles given / Stoichiometric coefficient', 'Lowest ratio reactant = Limiting reagent'],
    subtopics: ['Theoretical Yield', 'Percentage Yield', 'Excess Reactant'],
    unitId: 'u11_basic_concepts',
    topicId: 't_mole_concept',
    educationLevel: 'CLASS_11',
    realWorldApplications: ['Optimizing combustion efficiency in aerospace rockets', 'Economic scaling of drug synthesis']
  },
  {
    id: 'c_percentage_composition',
    name: 'Percentage Composition & Empirical Formula',
    branch: 'Physical',
    description: 'Mass percentage of each element in a compound and determination of simplest whole-number atomic ratio.',
    prerequisites: ['c_mole_concept'],
    keyFormulasAndRules: ['% Element = (Mass of element in 1 mol / Molar mass) × 100', 'Molecular Formula = (Empirical Formula) × n'],
    subtopics: ['Empirical Formula', 'Molecular Formula Determination'],
    unitId: 'u11_basic_concepts',
    topicId: 't_mole_concept',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_molarity_molality',
    name: 'Molarity & Molality Solutions',
    branch: 'Physical',
    description: 'Quantitative measurement of solute dissolved in solution (Molarity, M) or mass of solvent (Molality, m).',
    prerequisites: ['c_mole_concept'],
    keyFormulasAndRules: ['M = moles of solute / Volume of solution (L)', 'm = moles of solute / Mass of solvent (kg)', 'M1V1 = M2V2 (Dilution)'],
    subtopics: ['Molarity', 'Molality', 'Dilution Law'],
    unitId: 'u11_basic_concepts',
    topicId: 't_concentration_terms',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_equivalent_mass',
    name: 'Normality & Equivalent Mass',
    branch: 'Physical',
    description: 'Equivalent weight = Molar mass / n-factor (valency, acidity, basicity, or electrons transferred in redox).',
    prerequisites: ['c_molarity_molality'],
    keyFormulasAndRules: ['Equivalent Weight = M / n-factor', 'Normality N = M × n-factor', 'N1V1 = N2V2 at equivalence'],
    subtopics: ['n-Factor in Redox', 'Equivalent Titration'],
    unitId: 'u11_basic_concepts',
    topicId: 't_concentration_terms',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_bohr_model',
    name: 'Bohr Atomic Model & Quantized Orbits',
    branch: 'Physical',
    description: 'Electrons revolve in discrete non-radiating orbits with quantized angular momentum mvr = nh / 2π.',
    prerequisites: [],
    keyFormulasAndRules: ['mvr = nh / 2π', 'En = -13.6 × (Z² / n²) eV', 'rn = 0.529 × (n² / Z) Å'],
    subtopics: ['Postulates of Bohr', 'Energy Levels', 'Radius of Orbits'],
    unitId: 'u11_structure_atom',
    topicId: 't_atomic_models',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_hydrogen_spectrum',
    name: 'Hydrogen Atomic Spectrum & Rydberg Equation',
    branch: 'Physical',
    description: 'Emission spectral lines produced when excited electrons de-excite to lower principal energy levels.',
    prerequisites: ['c_bohr_model'],
    keyFormulasAndRules: ['1/λ = R_H × Z² × (1/n1² - 1/n2²)', 'R_H = 1.097 × 10⁷ m⁻¹', 'Lyman (UV, n1=1), Balmer (Visible, n1=2), Paschen (IR, n1=3)'],
    subtopics: ['Spectral Series', 'Photon Wave Number'],
    unitId: 'u11_structure_atom',
    topicId: 't_atomic_models',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_quantum_numbers',
    name: 'Quantum Numbers (n, l, ml, ms)',
    branch: 'Physical',
    description: 'Four quantum numbers designating orbital size (n), shape (l), spatial orientation (ml), and electron spin (ms).',
    prerequisites: ['c_bohr_model'],
    keyFormulasAndRules: ['n = 1, 2, 3...', 'l = 0 to (n-1)', 'ml = -l to +l', 'ms = +1/2 or -1/2', 'Max electrons in shell = 2n²'],
    subtopics: ['Principal & Azimuthal Numbers', 'Magnetic & Spin Numbers', 'Orbital Nodes'],
    unitId: 'u11_structure_atom',
    topicId: 't_quantum_numbers',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_heisenberg_debroglie',
    name: 'Dual Nature of Matter & Heisenberg Uncertainty',
    branch: 'Physical',
    description: 'Microscopic particles exhibit wave-particle duality (λ = h/p) and impossible simultaneous precision in position and momentum.',
    prerequisites: ['c_quantum_numbers'],
    keyFormulasAndRules: ['λ = h / (mv)', 'Δx · Δp ≥ h / (4π)'],
    subtopics: ['de Broglie Wavelength', 'Uncertainty Principle'],
    unitId: 'u11_structure_atom',
    topicId: 't_quantum_numbers',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_atomic_radii',
    name: 'Atomic & Ionic Radii Trends',
    branch: 'Inorganic',
    description: 'Atomic radius decreases across a period due to increasing effective nuclear charge (Zeff) and increases down a group due to new electron shells.',
    prerequisites: ['c_quantum_numbers'],
    keyFormulasAndRules: ['Zeff = Z - S (Slater Rules)', 'Cation radius < Neutral atom < Anion radius', 'Isoelectronic series: Higher Z gives smaller radius'],
    subtopics: ['Covalent & Metallic Radii', 'Isoelectronic Species'],
    unitId: 'u11_periodicity',
    topicId: 't_periodic_trends',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_ionization_enthalpy',
    name: 'Ionization Enthalpy & Electron Affinity',
    branch: 'Inorganic',
    description: 'Energy required to remove the outermost electron from an isolated gaseous atom. Displays anomalies in half-filled and fully filled subshells.',
    prerequisites: ['c_atomic_radii'],
    keyFormulasAndRules: ['IE1 < IE2 < IE3', 'High stability of 2p³ (N) over 2p⁴ (O)', 'Highest electron affinity = Chlorine'],
    subtopics: ['First vs Second IE', 'Subshell Stability Anomalies'],
    unitId: 'u11_periodicity',
    topicId: 't_periodic_trends',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_electronegativity',
    name: 'Electronegativity (Pauling & Mulliken)',
    branch: 'Inorganic',
    description: 'Tendency of an atom in a covalent molecule to attract shared pairs of bonding electrons toward itself.',
    prerequisites: ['c_ionization_enthalpy'],
    keyFormulasAndRules: ['Fluorine is the most electronegative element (χ = 4.0)', 'Pauling scale: |χA - χB| = 0.208 × √Δ'],
    subtopics: ['Periodic Trends', 'Percent Ionic Character'],
    unitId: 'u11_periodicity',
    topicId: 't_periodic_trends',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_vsepr_theory',
    name: 'VSEPR Theory & Lone Pair Repulsion',
    branch: 'Inorganic',
    description: 'Electron pairs around a central atom repel each other, dictating geometry. Repulsion order: Lone Pair-Lone Pair > Lone Pair-Bond Pair > Bond Pair-Bond Pair.',
    prerequisites: ['c_electronegativity'],
    keyFormulasAndRules: ['Steric Number = Bond Pairs + Lone Pairs', 'SN 2: Linear (180°)', 'SN 3: Trigonal planar (120°)', 'SN 4: Tetrahedral (109.5°)', 'H2O angle = 104.5° (2 lone pairs)'],
    subtopics: ['Steric Number Rules', 'Bond Angle Distortions'],
    unitId: 'u11_bonding',
    topicId: 't_vsepr_geometry',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_molecular_geometry',
    name: 'Molecular Geometries & Shapes',
    branch: 'Inorganic',
    description: 'Bent, trigonal pyramidal, T-shaped, seesaw, square planar, and octahedral geometries derived from VSEPR.',
    prerequisites: ['c_vsepr_theory'],
    keyFormulasAndRules: ['NH3: Trigonal pyramidal (107°)', 'SF4: Seesaw (SN 5, 1 lone pair)', 'XeF4: Square planar (SN 6, 2 lone pairs)'],
    subtopics: ['ABnEm Classification', 'Equatorial vs Axial Ligand Positions'],
    unitId: 'u11_bonding',
    topicId: 't_vsepr_geometry',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_hybridization',
    name: 'Orbital Hybridization (sp, sp², sp³, d-orbitals)',
    branch: 'Inorganic',
    description: 'Intermixing of atomic orbitals of slightly differing energies to form equivalent hybridized orbitals with identical shapes and orientations.',
    prerequisites: ['c_vsepr_theory'],
    keyFormulasAndRules: ['sp: 50% s character (linear)', 'sp²: 33.3% s character (trigonal)', 'sp³: 25% s character (tetrahedral)', 'sp³d: PCl5 (trigonal bipyramidal)'],
    subtopics: ['Sigma and Pi Bonds', 'Percentage s-Character & Acidity'],
    unitId: 'u11_bonding',
    topicId: 't_hybridization',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_dipole_moment',
    name: 'Dipole Moments & Molecular Polarity',
    branch: 'Physical',
    description: 'Vector measure of electrical polarity in a chemical bond: μ = q × d (Debye units). Symmetrical molecules have net μ = 0.',
    prerequisites: ['c_hybridization', 'c_molecular_geometry'],
    keyFormulasAndRules: ['μ = q × d', 'CO2 is linear, net μ = 0', 'H2O is bent, net μ = 1.85 D', 'cis-isomer typically has higher μ than trans-isomer'],
    subtopics: ['Vector Summation', 'Solvent Polarity'],
    unitId: 'u11_bonding',
    topicId: 't_hybridization',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_internal_energy',
    name: 'First Law of Thermodynamics & Internal Energy',
    branch: 'Physical',
    description: 'Energy cannot be created or destroyed: ΔU = q + w. Work done in gas expansion w = -Pext · ΔV.',
    prerequisites: ['c_mole_concept'],
    keyFormulasAndRules: ['ΔU = q + w', 'w = -Pext · ΔV', 'Isothermal reversible gas expansion: w = -2.303 nRT log(V2/V1)'],
    subtopics: ['State vs Path Functions', 'Reversible vs Irreversible Work'],
    unitId: 'u11_thermodynamics',
    topicId: 't_first_law_enthalpy',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_enthalpy_hess_law',
    name: 'Enthalpy (ΔH) & Hess’s Law of Heat Summation',
    branch: 'Physical',
    description: 'Total enthalpy change for a chemical process is independent of the pathway taken. ΔH = ΔU + ΔngRT.',
    prerequisites: ['c_internal_energy'],
    keyFormulasAndRules: ['ΔH = ΔU + Δng · RT', 'ΔH°rxn = ΣΔH°f(products) - ΣΔH°f(reactants)', 'Hess Law: ΔH_total = ΔH1 + ΔH2 + ΔH3'],
    subtopics: ['Standard Enthalpy of Formation', 'Calorimetry'],
    unitId: 'u11_thermodynamics',
    topicId: 't_first_law_enthalpy',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_entropy',
    name: 'Entropy (S) & Second Law of Thermodynamics',
    branch: 'Physical',
    description: 'Measure of molecular disorder and energy dispersion. In spontaneous processes, total entropy of the universe increases: ΔSuniv > 0.',
    prerequisites: ['c_enthalpy_hess_law'],
    keyFormulasAndRules: ['ΔS = q_rev / T', 'ΔSuniv = ΔSsys + ΔSsurr > 0', 'S(gas) >> S(liquid) > S(solid)'],
    subtopics: ['Boltzmann Formula S = k ln Ω', 'Third Law of Thermodynamics'],
    unitId: 'u11_thermodynamics',
    topicId: 't_entropy_gibbs',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_gibbs_free_energy',
    name: 'Gibbs Free Energy (ΔG) & Spontaneity',
    branch: 'Physical',
    description: 'Gibbs energy determines reaction spontaneity at constant T and P. Spontaneous when ΔG < 0, equilibrium when ΔG = 0.',
    prerequisites: ['c_entropy'],
    keyFormulasAndRules: ['ΔG = ΔH - TΔS', 'ΔG° = -RT ln K = -2.303 RT log K', 'Spontaneous at all T if ΔH < 0 and ΔS > 0'],
    subtopics: ['Spontaneity Matrix', 'Standard Free Energy'],
    unitId: 'u11_thermodynamics',
    topicId: 't_entropy_gibbs',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_equilibrium_constant',
    name: 'Equilibrium Constants (Kc, Kp) & Law of Mass Action',
    branch: 'Physical',
    description: 'Ratio of product concentrations to reactant concentrations raised to stoichiometric coefficients at dynamic equilibrium.',
    prerequisites: ['c_gibbs_free_energy'],
    keyFormulasAndRules: ['Kp = Kc · (RT)^Δng', 'Reaction Quotient Q vs K: If Q < K, forward reaction proceeds'],
    subtopics: ['Homogeneous & Heterogeneous Equilibria', 'Reaction Quotient Q'],
    unitId: 'u11_equilibrium',
    topicId: 't_chemical_equilibrium',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_le_chatelier_principle',
    name: 'Le Chatelier’s Principle',
    branch: 'Physical',
    description: 'If a system in dynamic chemical equilibrium is subjected to a disturbance (concentration, pressure, temperature), it counteracts the change.',
    prerequisites: ['c_equilibrium_constant'],
    keyFormulasAndRules: ['Increasing pressure favors side with fewer moles of gas', 'Increasing temperature favors endothermic direction (ΔH > 0)'],
    subtopics: ['Industrial Haber-Bosch Optimization', 'Inert Gas Addition Rules'],
    unitId: 'u11_equilibrium',
    topicId: 't_chemical_equilibrium',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_ph_calculations',
    name: 'pH, pOH & Ion Product of Water (Kw)',
    branch: 'Physical',
    description: 'Logarithmic acidity scale: pH = -log[H⁺]. Water auto-ionization: Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25°C.',
    prerequisites: ['c_equilibrium_constant'],
    keyFormulasAndRules: ['pH = -log[H⁺]', 'pOH = -log[OH⁻]', 'pH + pOH = 14 (at 25°C)', 'Weak acid: [H⁺] = √(Ka · C)'],
    subtopics: ['Strong vs Weak Acids/Bases', 'Temperature effect on Kw'],
    unitId: 'u11_equilibrium',
    topicId: 't_ph_buffers',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_buffer_action',
    name: 'Buffer Solutions & Henderson-Hasselbalch Equation',
    branch: 'Physical',
    description: 'Solutions resisting pH changes upon addition of small amounts of strong acid or base. Composed of weak acid + conjugate base salt.',
    prerequisites: ['c_ph_calculations'],
    keyFormulasAndRules: ['Acidic Buffer: pH = pKa + log([Salt] / [Acid])', 'Basic Buffer: pOH = pKb + log([Salt] / [Base])', 'Buffer Capacity maximum when [Salt] = [Acid] (pH = pKa)'],
    subtopics: ['Acidic & Basic Buffers', 'Buffer Capacity'],
    unitId: 'u11_equilibrium',
    topicId: 't_ph_buffers',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_solubility_product',
    name: 'Solubility Product (Ksp) & Common Ion Effect',
    branch: 'Physical',
    description: 'Equilibrium constant for sparingly soluble salts. Precipitation occurs when Ionic Product (Qsp) exceeds Ksp.',
    prerequisites: ['c_ph_calculations'],
    keyFormulasAndRules: ['For AxBy: Ksp = [A^y+]^x · [B^x-]^y', 'Qsp > Ksp: Precipitation occurs', 'Common ion suppresses solubility'],
    subtopics: ['Precipitation Criteria', 'Selective Precipitation in Qualitative Analysis'],
    unitId: 'u11_equilibrium',
    topicId: 't_ph_buffers',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_oxidation_states',
    name: 'Oxidation Number Rules & Disproportionation',
    branch: 'Physical',
    description: 'Apparent or real electrical charge on an atom in a molecule. In disproportionation, the same element is simultaneously oxidized and reduced.',
    prerequisites: [],
    keyFormulasAndRules: ['Elemental form = 0', 'Fluorine = -1 always', 'Group 1 = +1, Group 2 = +2', 'Disproportionation: 2H2O2 ➔ 2H2O + O2'],
    subtopics: ['Oxidation Rules', 'Disproportionation Reactions'],
    unitId: 'u11_redox',
    topicId: 't_redox_balancing',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_redox_half_reactions',
    name: 'Redox Half-Reaction Balancing',
    branch: 'Physical',
    description: 'Systematic balancing of complex redox reactions in acidic or basic media by conserving mass, oxygen (via H2O), hydrogen (via H⁺), and charge (via e⁻).',
    prerequisites: ['c_oxidation_states'],
    keyFormulasAndRules: ['LEO: Loss of Electrons is Oxidation', 'GER: Gain of Electrons is Reduction', 'Equalize electrons before summing half-reactions'],
    subtopics: ['Acidic Media Balancing', 'Basic Media Balancing with OH⁻'],
    unitId: 'u11_redox',
    topicId: 't_redox_balancing',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_resonance_hyperconjugation',
    name: 'Resonance, Inductive Effect & Hyperconjugation',
    branch: 'Organic',
    description: 'Delocalization of π-electrons (resonance) and σ-electrons of C-H bonds with adjacent vacant p-orbital (hyperconjugation / no-bond resonance).',
    prerequisites: ['c_hybridization'],
    keyFormulasAndRules: ['Resonance energy stabilizes benzene by 152 kJ/mol', 'Hyperconjugation: Alkyl group with α-hydrogens stabilizes carbocations', 'Stability: 3° > 2° > 1° > Methyl'],
    subtopics: ['Resonance Structures & Hybrids', 'Baker-Nathan Effect'],
    unitId: 'u11_organic_basics',
    topicId: 't_electronic_effects',
    educationLevel: 'CLASS_11'
  },
  {
    id: 'c_carbocation_stability',
    name: 'Reactive Intermediates: Carbocations, Carbanions & Radicals',
    branch: 'Organic',
    description: 'Short-lived chemical species formed during organic bond cleavage. Governs reaction rate and regioselectivity.',
    prerequisites: ['c_resonance_hyperconjugation'],
    keyFormulasAndRules: ['Carbocation stability: 3° > 2° > 1° (due to +I and hyperconjugation)', 'Carbanion stability: 1° > 2° > 3° (due to inductive destabilization)', 'Allylic & Benzylic resonance stabilization'],
    subtopics: ['Rearrangements (Hydride & Alkyl Shifts)', 'Electrophiles & Nucleophiles'],
    unitId: 'u11_organic_basics',
    topicId: 't_electronic_effects',
    educationLevel: 'CLASS_11'
  },

  // Class 12 Concepts
  {
    id: 'c_daniell_cell',
    name: 'Daniell Galvanic Cell (Zn-Cu Couple)',
    branch: 'Physical',
    description: 'Electrochemical cell converting chemical energy of Zn + Cu²⁺ ➔ Zn²⁺ + Cu into electrical energy. Zn is anode (oxidation), Cu is cathode (reduction).',
    prerequisites: ['c_redox_half_reactions'],
    keyFormulasAndRules: ['Anode (Oxidation): Zn(s) ➔ Zn²⁺(aq) + 2e⁻', 'Cathode (Reduction): Cu²⁺(aq) + 2e⁻ ➔ Cu(s)', 'Cell Notation: Zn | Zn²⁺(1M) || Cu²⁺(1M) | Cu', 'Standard EMF E°cell = +1.10 V'],
    subtopics: ['Salt Bridge Role', 'Electrode Half-Reactions', 'Standard Reduction Potentials'],
    unitId: 'u12_electrochemistry',
    topicId: 't_galvanic_daniell_cell',
    educationLevel: 'CLASS_12',
    realWorldApplications: ['Battery energy generation', 'Voltaic pile historical development']
  },
  {
    id: 'c_standard_electrode_potentials',
    name: 'Standard Reduction Potentials & Electrochemical Series',
    branch: 'Physical',
    description: 'Reduction potentials measured against the Standard Hydrogen Electrode (SHE, E° = 0.00 V). Elements with negative E° are strong reducing agents.',
    prerequisites: ['c_daniell_cell'],
    keyFormulasAndRules: ['E°cell = E°(cathode) - E°(anode)', 'ΔG° = -n F E°cell', 'F = 96485 C/mol', 'Positive E°cell denotes spontaneous forward redox'],
    subtopics: ['Standard Hydrogen Electrode (SHE)', 'Electrochemical Series Reactivity'],
    unitId: 'u12_electrochemistry',
    topicId: 't_galvanic_daniell_cell',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_nernst_equation',
    name: 'Nernst Equation for Non-Standard EMF',
    branch: 'Physical',
    description: 'Relates cell electromotive force to temperature and ion concentrations away from standard 1.0 M conditions.',
    prerequisites: ['c_daniell_cell', 'c_gibbs_free_energy'],
    keyFormulasAndRules: ['Ecell = E°cell - (RT / nF) ln Q', 'At 298 K: Ecell = E°cell - (0.0591 / n) log Q', 'For Daniell Cell: Ecell = 1.10 - (0.0591/2) log([Zn²⁺]/[Cu²⁺])'],
    subtopics: ['Reaction Quotient in Cells', 'Concentration Cells'],
    unitId: 'u12_electrochemistry',
    topicId: 't_nernst_equation',
    educationLevel: 'CLASS_12',
    realWorldApplications: ['pH meter glass electrodes', 'Biological nerve impulse potentials']
  },
  {
    id: 'c_gibbs_cell_relation',
    name: 'Electrochemical Equilibrium & Gibbs Free Energy',
    branch: 'Physical',
    description: 'Direct thermodynamic bridge connecting electrical potential to Gibbs free energy and equilibrium constant: ΔG° = -nFE°cell = -RT ln K.',
    prerequisites: ['c_nernst_equation'],
    keyFormulasAndRules: ['ΔG° = -n F E°cell', 'log K = (n · E°cell) / 0.0591 at 25°C', 'Maximum electrical work Wmax = -ΔG'],
    subtopics: ['Thermodynamic Efficiency', 'Equilibrium Constant from EMF'],
    unitId: 'u12_electrochemistry',
    topicId: 't_nernst_equation',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_rate_laws',
    name: 'Rate Laws & Rate Constants (k)',
    branch: 'Physical',
    description: 'Mathematical expression relating the speed of a reaction to the molar concentrations of reactants raised to experimentally determined powers.',
    prerequisites: ['c_molarity_molality'],
    keyFormulasAndRules: ['Rate = k [A]^x [B]^y', 'Overall order n = x + y', 'Units of k = (mol/L)^(1-n) · s⁻¹'],
    subtopics: ['Differential Rate Equations', 'Initial Rates Method'],
    unitId: 'u12_kinetics',
    topicId: 't_rate_laws_orders',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_order_molecularity',
    name: 'Order of Reaction vs Molecularity',
    branch: 'Physical',
    description: 'Order is experimental (can be fractional, zero, negative); molecularity is theoretical (number of colliding particles in elementary step, integer ≥ 1).',
    prerequisites: ['c_rate_laws'],
    keyFormulasAndRules: ['Zero order: [A] = [A]0 - kt, t_half = [A]0 / (2k)', 'First order: ln[A] = ln[A]0 - kt, t_half = 0.693 / k', 'First order half-life is independent of initial concentration'],
    subtopics: ['Zero and First Order Integrated Kinetics', 'Half-Life Calculations'],
    unitId: 'u12_kinetics',
    topicId: 't_rate_laws_orders',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_arrhenius_equation',
    name: 'Arrhenius Equation & Temperature Coefficient',
    branch: 'Physical',
    description: 'Quantitative relationship showing exponential increase of reaction rate constant with temperature due to higher fraction of colliding molecules with E ≥ Ea.',
    prerequisites: ['c_rate_laws'],
    keyFormulasAndRules: ['k = A · e^(-Ea / RT)', 'log(k2 / k1) = (Ea / 2.303 R) · [(T2 - T1) / (T1 · T2)]', 'Slope of ln k vs 1/T plot is -Ea / R'],
    subtopics: ['Activation Energy Calculation', 'Catalyst Energy Profile Modification'],
    unitId: 'u12_kinetics',
    topicId: 't_arrhenius_activation',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_crystal_field_splitting',
    name: 'Crystal Field Splitting (Octahedral & Tetrahedral)',
    branch: 'Inorganic',
    description: 'Electrostatic repulsion between ligand lone pairs and transition metal d-orbitals splits degenerate d-subshell into t2g and eg orbital sets.',
    prerequisites: ['c_quantum_numbers'],
    keyFormulasAndRules: ['Octahedral: eg (higher, +0.6 Δo), t2g (lower, -0.4 Δo)', 'Tetrahedral splitting Δt = (4/9) Δo', 'Crystal Field Stabilization Energy (CFSE) = (-0.4 n_t2g + 0.6 n_eg) Δo + mP'],
    subtopics: ['t2g and eg Orbital Splitting', 'CFSE Calculation'],
    unitId: 'u12_coordination',
    topicId: 't_crystal_field_theory',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_spectrochemical_series',
    name: 'Spectrochemical Series & High/Low Spin Complexes',
    branch: 'Inorganic',
    description: 'Empirical ranking of ligands according to splitting power (Δo). Strong field ligands (CN⁻, CO) cause pairing (low spin); weak field (I⁻, Br⁻, Cl⁻) give high spin.',
    prerequisites: ['c_crystal_field_splitting'],
    keyFormulasAndRules: ['I⁻ < Br⁻ < S²⁻ < Cl⁻ < F⁻ < OH⁻ < H2O < NH3 < en < CN⁻ < CO', 'If Δo > P (Pairing Energy): Low-spin configuration', 'Magnetic moment μ = √(n(n+2)) Bohr Magnetons'],
    subtopics: ['Ligand Field Strength', 'Magnetic Properties from Unpaired Electrons'],
    unitId: 'u12_coordination',
    topicId: 't_crystal_field_theory',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_sn1_mechanism',
    name: 'SN1 Mechanism (Substitution Nucleophilic Unimolecular)',
    branch: 'Organic',
    description: 'Two-step substitution via planar carbocation intermediate. Governed by 1st-order kinetics, favored by 3° alkyl halides and polar protic solvents, yields racemization.',
    prerequisites: ['c_carbocation_stability'],
    keyFormulasAndRules: ['Rate = k [Substrate]', 'Step 1: Leaving group departs (slow, rate-determining) forming carbocation', 'Step 2: Nucleophile attacks from either face (fast)', 'Reactivity: 3° > 2° > 1° > Methyl'],
    subtopics: ['Racemization', 'Polar Protic Solvent Stabilization'],
    unitId: 'u12_haloalkanes',
    topicId: 't_sn1_sn2_mechanisms',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_sn2_mechanism',
    name: 'SN2 Mechanism (Substitution Nucleophilic Biomolecular)',
    branch: 'Organic',
    description: 'Concerted single-step backside attack by nucleophile as leaving group departs via pentacoordinated transition state. Yields complete Walden inversion of stereochemistry.',
    prerequisites: ['c_carbocation_stability'],
    keyFormulasAndRules: ['Rate = k [Substrate] [Nucleophile]', 'Concerted transition state [‡]', 'Walden Inversion (umbrella flip)', 'Steric hindrance governs rate: Methyl > 1° > 2° >> 3°'],
    subtopics: ['Walden Inversion', 'Polar Aprotic Solvents (DMSO, DMF, Acetone)'],
    unitId: 'u12_haloalkanes',
    topicId: 't_sn1_sn2_mechanisms',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_aldol_condensation',
    name: 'Aldol Condensation & Cross-Aldol Reactions',
    branch: 'Organic',
    description: 'Carbonyl compounds containing α-hydrogen react with dilute base to form β-hydroxy aldehydes/ketones, which dehydrate upon heating to α,β-unsaturated compounds.',
    prerequisites: ['c_resonance_hyperconjugation'],
    keyFormulasAndRules: ['Requires presence of α-hydrogen atom', '2 CH3CHO + dil. NaOH ➔ CH3-CH(OH)-CH2-CHO (Aldol)', 'Heat gives CH3-CH=CH-CHO (Crotonaldehyde) via E1cB elimination'],
    subtopics: ['Enolate Resonance', 'Cross-Aldol Multi-Product Control'],
    unitId: 'u12_carbonyls',
    topicId: 't_aldol_cannizzaro',
    educationLevel: 'CLASS_12'
  },
  {
    id: 'c_cannizzaro_reaction',
    name: 'Cannizzaro Disproportionation Reaction',
    branch: 'Organic',
    description: 'Aldehydes with NO α-hydrogen (e.g. formaldehyde, benzaldehyde) undergo self oxidation-reduction in concentrated alkali to form an alcohol and a carboxylate salt.',
    prerequisites: ['c_resonance_hyperconjugation'],
    keyFormulasAndRules: ['No α-hydrogen permitted (e.g. HCHO, C6H5CHO)', '2 HCHO + 50% NaOH ➔ CH3OH + HCOONa', 'Hydride ion transfer in rate-determining step'],
    subtopics: ['Cross-Cannizzaro with Formaldehyde', 'Hydride Shift Mechanism'],
    unitId: 'u12_carbonyls',
    topicId: 't_aldol_cannizzaro',
    educationLevel: 'CLASS_12'
  },

  // BTech / Advanced Engineering Concepts
  {
    id: 'c_li_ion_batteries',
    name: 'Lithium-Ion Battery Intercalation Dynamics',
    branch: 'Engineering',
    description: 'Reversible electrochemical intercalation of Li⁺ ions between graphite anode (LiC6) and transition metal oxide cathode (LiCoO2) during charge/discharge.',
    prerequisites: ['c_daniell_cell', 'c_nernst_equation'],
    keyFormulasAndRules: ['Anode discharge: LiC6 ➔ C6 + Li⁺ + e⁻', 'Cathode discharge: CoO2 + Li⁺ + e⁻ ➔ LiCoO2', 'Cell potential ~ 3.7 V', 'Energy density = (Specific capacity × Voltage)'],
    subtopics: ['Solid Electrolyte Interphase (SEI)', 'Thermal Runaway Chemistry'],
    unitId: 'ubtech_energy_corrosion',
    topicId: 't_btech_batteries_fuel_cells',
    educationLevel: 'BTECH',
    realWorldApplications: ['Electric vehicle power packs (Tesla, BYD)', 'Smartphones and consumer electronics']
  },
  {
    id: 'c_fuel_cell_thermodynamics',
    name: 'Proton Exchange Membrane (PEM) Fuel Cells',
    branch: 'Engineering',
    description: 'Electrochemical device directly converting hydrogen and oxygen chemical fuel into water and electricity with zero tailpipe emissions.',
    prerequisites: ['c_daniell_cell', 'c_gibbs_free_energy'],
    keyFormulasAndRules: ['Anode: 2 H2 ➔ 4 H⁺ + 4 e⁻ (Pt catalyst)', 'Cathode: O2 + 4 H⁺ + 4 e⁻ ➔ 2 H2O', 'Theoretical efficiency η = ΔG° / ΔH° ≈ 83%'],
    subtopics: ['Nafion Membrane Proton Conduction', 'Platinum Electrocatalyst Poisoning by CO'],
    unitId: 'ubtech_energy_corrosion',
    topicId: 't_btech_batteries_fuel_cells',
    educationLevel: 'BTECH',
    realWorldApplications: ['Hydrogen fuel-cell heavy transport & maritime ships']
  },
  {
    id: 'c_corrosion_mechanisms',
    name: 'Electrochemical Theory of Corrosion',
    branch: 'Engineering',
    description: 'Oxidation of metal surfaces forming microscopic galvanic microcells in the presence of moisture and electrolyte.',
    prerequisites: ['c_daniell_cell'],
    keyFormulasAndRules: ['Anodic area: Fe(s) ➔ Fe²⁺ + 2e⁻', 'Cathodic area (neutral aerated): O2 + 2H2O + 4e⁻ ➔ 4OH⁻', 'Rust = Fe2O3 · xH2O'],
    subtopics: ['Galvanic Series & Contact Corrosion', 'Differential Aeration Cells'],
    unitId: 'ubtech_energy_corrosion',
    topicId: 't_btech_corrosion',
    educationLevel: 'BTECH'
  },
  {
    id: 'c_cathodic_protection',
    name: 'Cathodic Protection & Sacrificial Anodes',
    branch: 'Engineering',
    description: 'Technique used to control corrosion of a metal surface by making it the cathode of an electrochemical cell via sacrificial zinc/magnesium anodes or impressed current.',
    prerequisites: ['c_corrosion_mechanisms'],
    keyFormulasAndRules: ['More active metal (Zn, Mg) has lower reduction potential and corrodes preferentially', 'Protects underground steel oil pipelines and ship hulls'],
    subtopics: ['Impressed Current Cathodic Protection (ICCP)', 'Galvanizing of Steel'],
    unitId: 'ubtech_energy_corrosion',
    topicId: 't_btech_corrosion',
    educationLevel: 'BTECH'
  },

  // MTech Advanced Materials Concepts
  {
    id: 'c_nanochemistry_confinement',
    name: 'Quantum Confinement & Nanomaterials',
    branch: 'Materials',
    description: 'When material dimensions shrink below the exciton Bohr radius (<10 nm), continuous energy bands split into discrete quantum levels, altering bandgap and optical fluorescence.',
    prerequisites: ['c_quantum_numbers', 'c_crystal_field_splitting'],
    keyFormulasAndRules: ['Brus equation for quantum dots: E_gap(R) = E_bulk + (h² / 8 m* R²) - Coulomb', 'Size-tunable absorption and emission wavelengths'],
    subtopics: ['Quantum Dots (CdSe, InP)', 'Surface-to-Volume Ratio Catalytic Enhancements'],
    unitId: 'umtech_nanomaterials',
    topicId: 't_mtech_nanostructures',
    educationLevel: 'MTECH',
    realWorldApplications: ['QLED high-gamut displays', 'Targeted biological imaging probes']
  },
  {
    id: 'c_perovskites_energy',
    name: 'Halide Perovskites for Solar Energy & LEDs',
    branch: 'Materials',
    description: 'Crystal structure ABX3 (e.g. CH3NH3PbI3) exhibiting high optical absorption, long carrier diffusion lengths, and defect tolerance for next-generation photovoltaics.',
    prerequisites: ['c_nanochemistry_confinement'],
    keyFormulasAndRules: ['Goldschmidt tolerance factor t = (rA + rX) / [√2 (rB + rX)]', 'Perovskite solar cell efficiency exceeded 26% from 3.8% in 15 years'],
    subtopics: ['Lead Halide Perovskite Lattices', 'Tandem Silicon-Perovskite Cells'],
    unitId: 'umtech_nanomaterials',
    topicId: 't_mtech_nanostructures',
    educationLevel: 'MTECH'
  }
];

// ==========================================
// 5. CURRICULUM HELPER UTILITIES
// ==========================================

export function getUnitsByEducationLevel(levelId: string): UnitDefinition[] {
  const subjectPrefixMap: Record<string, string[]> = {
    'CLASS_11': ['chem_11_core'],
    'CLASS_12': ['chem_12_core'],
    'BSC': ['bsc_physical', 'bsc_organic', 'bsc_inorganic', 'bsc_analytical'],
    'MSC': ['msc_physical', 'msc_organic', 'msc_inorganic', 'msc_analytical'],
    'BTECH': ['btech_eng_chem_core'],
    'MTECH': ['mtech_mat_chem_core']
  };

  const allowedSubjects = subjectPrefixMap[levelId] || ['chem_11_core'];
  return CURRICULUM_UNITS.filter(u => allowedSubjects.includes(u.subjectId));
}

export function getTopicsForUnit(unitId: string): TopicDefinition[] {
  return CURRICULUM_TOPICS.filter(t => t.unitId === unitId);
}

export function getConceptsForTopic(topicId: string): ConceptDefinition[] {
  return CURRICULUM_CONCEPTS.filter(c => c.topicId === topicId);
}

export function getConceptsByEducationLevel(levelId: string): ConceptDefinition[] {
  return CURRICULUM_CONCEPTS.filter(c => c.educationLevel === levelId);
}

/**
 * Builds an interactive Mind Map Node hierarchy for any given topic or concept
 */
export function buildTopicMindMap(topicId: string, studentMasteries: Record<string, number> = {}): MindMapNode {
  const topic = CURRICULUM_TOPICS.find(t => t.id === topicId) || CURRICULUM_TOPICS[0];
  const concepts = getConceptsForTopic(topic.id);

  const conceptNodes: MindMapNode[] = concepts.map(c => {
    const score = studentMasteries[c.id] ?? 50;
    return {
      id: c.id,
      label: c.name,
      conceptId: c.id,
      type: 'concept',
      summary: c.description,
      masteryScore: score,
      isWeak: score < 50,
      prerequisites: c.prerequisites,
      formulas: c.keyFormulasAndRules,
      questionsCount: 1200,
      children: (c.subtopics || []).map((sub, sIdx) => ({
        id: `${c.id}_sub_${sIdx}`,
        label: sub,
        type: 'subtopic',
        summary: `Subtopic drill in ${c.name}`
      }))
    };
  });

  const avgMastery = conceptNodes.length > 0
    ? Math.round(conceptNodes.reduce((acc, n) => acc + (n.masteryScore || 50), 0) / conceptNodes.length)
    : 50;

  return {
    id: topic.id,
    label: topic.name,
    type: 'topic',
    summary: topic.description,
    masteryScore: avgMastery,
    isWeak: avgMastery < 50,
    questionsCount: topic.estimatedQuestions,
    children: conceptNodes
  };
}
