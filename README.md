# 🧪 CHEMIZZIC — Universal AI Chemistry Study Toolkit & Intelligent Learning Ecosystem

### **Visual Chemistry Intelligence, Adaptive Practice, Mechanistic Reasoning & Interactive Lab Simulations**

> **Transforming Chemistry Education from Rote Memorization into an Adaptive, Highly Visual, and Mathematically Rigorous Learning Experience.**

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Express%20Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![PubChem](https://img.shields.io/badge/Data-PubChem%20NCBI-0066CC)](https://pubchem.ncbi.nlm.nih.gov/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🚀 Overview

**CHEMIZZIC** is an end-to-end, full-stack AI chemistry learning, practice, revision, simulation, and exam preparation platform. Traditional chemistry platforms present fragmented static tables of formulas and molecular weights. CHEMIZZIC unites **generative AI reasoning**, **deterministic scientific computing**, **interactive SVG/Canvas physical simulations**, and an **adaptive mastery learning engine** into a single cohesive ecosystem.

Whether a high-school student tackling Class 11 stoichiometry or a postgraduate researcher investigating organometallic pathways and lithium-ion battery kinetics, CHEMIZZIC adapts to the learner's academic depth and guides them along a continuous learning loop:

```
ASSESS ➔ IDENTIFY WEAKNESS ➔ EXPLAIN ➔ PRACTICE ➔ SIMULATE ➔ CALCULATE ➔ REASSESS ➔ MASTER
```

---

## 🎯 Problem Statement

Chemistry education suffers from deep systemic bottlenecks:
1. **Disconnected Modalities**: Students read theory in one textbook, search PubChem or Google for properties, memorize organic mechanisms without curved-arrow intuition, and perform labs in isolation.
2. **Abstract Microscopic Phenomena**: Concepts like electrochemical double-layers, phase transitions, and electron flow during $S_N1$ vs $S_N2$ substitutions are invisible, leading to rote memorization.
3. **Condition Sensitivity**: AI tools frequently hallucinate chemical outcomes by failing to account for temperature, pressure, solvent, or catalyst dependencies (e.g. alcohol dehydration yielding ether at 140°C vs alkene at 170°C).
4. **Lack of Adaptive Differentiation**: High-school students and master's researchers are forced into one-size-fits-all question banks that lack intelligent prerequisite mapping and spaced repetition.

---

## 💡 Solution

CHEMIZZIC delivers a unified platform featuring:
* **Deterministic Scientific Verification**: Atom-conserved stoichiometry, charge-balanced half-reactions, and verified standard thermodynamic quantities combined with Google Gemini AI.
* **Interactive Physics & Lab Simulators**: Real-time interactive models of electrochemical cells (Galvanic, Daniell, Lead-Acid, Li-ion, Fuel Cell, Chlor-Alkali, Molten NaCl), pH titrations, phase diagrams, and kinetics chambers.
* **Curved-Arrow Reaction Mechanism Explainer**: Step-by-step electronic movement, reactive intermediates (carbocations, carbanions, free radicals), electrophile/nucleophile roles, and stereochemical outcomes.
* **Organic Conversion Lab**: Retrosynthetic and forward multi-step conversion pathways with reagent selection rationale ("Why this reagent? Why not another?").
* **Conceptual Anomaly & "Give Reason" Engine**: Multi-tiered explanations across core scientific principles, chemical causes, and one-line concise exam answers.
* **Mastery-Driven Question Engine**: Over 1,000+ curriculum-aligned questions across Assertion-Reason, Short Answer, Numericals, Flashcards, and Guess-The-Products.

---

## ⭐ Why CHEMIZZIC

| Dimension | Traditional Resources | Generic AI Chatbots | CHEMIZZIC Universal Toolkit |
| :--- | :--- | :--- | :--- |
| **Reaction Mechanisms** | Static textbook diagrams | Textual descriptions with hallucinations | Step-by-step interactive player with intermediate inspection & electron movement |
| **Electrochemistry** | Static Daniell Cell drawings | Equations without spatial context | Universal Cell & Battery Lab with live electron/ion animations & Nernst potential updates |
| **Organic Conversions** | Rote memory flowcharts | High error rate in reagent conditions | Multi-step pathway generator with reagent justification and side-reaction warnings |
| **Reasoning / "Give Reasons"**| Fragmented answer keys | Overly verbose generic answers | Tri-part structure: Core Principle + Chemical Mechanism + One-Line Exam Answer |
| **Reliability & Auditability**| Fixed content | Unchecked hallucinations | Strict AI Reliability Badges (`VERIFIED`, `CALCULATED`, `PREDICTED`, `AI-GENERATED`, `DEFAULT ASSUMPTION`) |
| **Adaptive Learning** | None | Ephemeral session memory | Persistent Bayesian-style mastery tracking, spaced repetition & teacher analytics |

---

## 🎓 Supported Education Levels

CHEMIZZIC tailors its vocabulary, question generation, mathematical rigor, and simulation parameters to six distinct tiers:

1. **Class 11 (CBSE / ISC / State Boards / AP Chemistry)**: Atomic structure, periodic trends, chemical bonding, states of matter, basic thermodynamics, redox reactions, hydrogen, s-block, basic organic chemistry.
2. **Class 12 (Board Exams / JEE Main / NEET / SAT Subject)**: Solid state, solutions, electrochemistry, chemical kinetics, surface chemistry, p/d/f-block elements, coordination compounds, haloalkanes, alcohols, aldehydes, ketones, amines, biomolecules.
3. **BSc Chemistry (Undergraduate Degree)**: Stereochemistry, conformational analysis, reaction kinetics & mechanism, quantum chemistry fundamentals, group theory, spectroscopy (UV, IR, NMR), coordination chemistry (CFT, LFT).
4. **MSc Chemistry (Postgraduate Degree)**: Advanced organic synthesis, asymmetric catalysis, pericyclic reactions, organometallics, advanced computational chemistry, statistical mechanics, molecular orbital theory.
5. **BTech (Engineering Chemistry)**: Fuel cells, corrosion engineering, polymer technology, water treatment, phase rule, battery chemistry, lubricants, industrial nanomaterials.
6. **MTech (Chemical & Materials Engineering)**: Heterogeneous catalysis, electrochemical energy storage, advanced materials characterization, transport phenomena, reactor design.

---

## 🏛️ Curriculum Architecture

The curriculum system (`src/data/curriculumData.ts`) organizes subjects, chapters, and concepts into structured graphs with explicit prerequisites, difficulty indices (1–5), and question mappings:

```text
Education Level (e.g. Class 12)
  └── Subject (Physical / Inorganic / Organic)
        └── Unit / Chapter (e.g., Electrochemistry)
              ├── Concept Nodes (e.g., Nernst Equation, Galvanic Cells, Kohlrausch's Law)
              │     ├── Prerequisite Concepts (e.g., Redox Potentials, Gibbs Free Energy)
              │     ├── Core Formulas & Reactions
              │     └── Direct Links to Simulator / Calculator / Practice / AI Tutor
              └── Scalable Question Banks (MCQs, Assertion-Reason, Numericals)
```

---

## 🧠 Adaptive Learning

CHEMIZZIC includes a complete, data-driven learning cycle:

* **Diagnostic Assessment**: Initial baseline testing to calculate starting concept proficiency across physical, inorganic, and organic chemistry.
* **Concept Mastery Engine**: Bayesian-inspired mastery progression ($0.0 \to 1.0$) updated dynamically based on quiz performance, streak consistency, and question difficulty.
* **Adaptive Difficulty**: Real-time adjustment of question difficulty (Easy $\to$ Medium $\to$ Hard $\to$ Olympiad/Advanced) based on recent response accuracy.
* **Recommendation Engine**: Automatically identifies weak concepts and generates tailored remediation pathways (e.g. "Trigger flashcard review for Raoult's Law before re-attempting colligative property calculations").
* **Spaced Repetition (SuperMemo SM-2)**: Calculates optimal review intervals based on user recall ratings, scheduling overdue cards automatically.
* **Student Dashboard**: Live progress tracking, chapter mastery heatmaps, XP points, study streaks, and weak-area alerts.
* **Teacher Analytics Dashboard**: Aggregated class metrics, concept failure distributions, student leaderboard, and targeted intervention suggestions.

---

## 🤖 AI Chemistry Tutor

Accessible from every module via the **"Ask AI Chemist"** integration:
* Context-aware prompt bridging: Automatically passes current reaction equations, cell configurations, numerical inputs, or quiz questions directly to the tutor without forcing the user to retype.
* Socratic guidance mode: Prompts students to think through curved-arrow electron movements, Le Chatelier shifts, or oxidation state assignments before revealing final answers.
* Multi-modal explanations: Combines LaTeX equations, structured markdown tables, and step-by-step verification markers.

---

## 🔍 Universal Search

A unified natural-language intent router (`src/components/UniversalSearchModal.tsx`) that intelligently categorizes search queries and opens the corresponding tool:
* **Compound Search**: "Benzene", "Aspirin", "Ethanol" $\to$ Opens PubChem Chemical Profile & 3D Structure Viewer.
* **Reaction Predictor**: "CH3Br + OH-", "Combustion of propane" $\to$ Opens AI Reaction Predictor.
* **Mechanism Explainer**: "Dehydration of ethanol", "SN1 vs SN2", "Acid-catalyzed esterification" $\to$ Routes to Reaction Mechanism Explainer.
* **Organic Conversion**: "Convert ethanol to ethanoic acid", "Benzene to aniline" $\to$ Routes to Organic Conversion Lab.
* **Cell Simulation**: "Daniell cell", "Lead acid battery", "Molten NaCl electrolysis" $\to$ Opens Interactive Cell & Battery Lab.
* **Conceptual Reason**: "Why does H2O have higher boiling point than H2S?" $\to$ Routes to Give Reason Engine.
* **Revision Flashcards**: "Flashcards for coordination chemistry" $\to$ Generates topic flashcards.
* **Numerical Solver**: "Calculate pH of 0.01M HCl", "Nernst equation at 298K" $\to$ Opens Scientific Calculators.

---

## 🔬 Chemistry Intelligence

* **Reaction Predictor**: Predicts chemical products, stoichiometry, reaction classification, and thermodynamic favorability for organic and inorganic mixtures.
* **Periodic Reaction Predictor**: Systematically tracks periodic table trends (alkali metals, halogens, transition metals) across oxidation states and reactivity series.
* **Equation Balancer & Solver**: Programmatic matrix-based balancing of complex redox and molecular equations with charge and atom conservation checks.
* **Guess The Products**: Interactive gamified challenge containing 100+ verified organic, inorganic, and physical reaction challenges with streak tracking and instant feedback.

---

## 🧮 Scientific Calculators

Deterministic, programmatically verified numerical solvers with step-by-step intermediate derivations:
1. **pH & Buffer Calculator**: Strong/weak acids, strong/weak bases, Henderson-Hasselbalch buffer calculations, and neutralization curves.
2. **Nernst Equation Calculator**: Cell potential under non-standard conditions ($E = E^\circ - \frac{RT}{nF} \ln Q$).
3. **Faraday's Laws of Electrolysis**: Mass deposited and gas volume liberated as functions of current, time, and valence factor.
4. **Gibbs Free Energy & Spontaneity**: $\Delta G^\circ = \Delta H^\circ - T\Delta S^\circ = -nFE^\circ = -RT \ln K_{eq}$.
5. **Arrhenius Activation Energy**: Rate constant variation with temperature ($k = A e^{-E_a/RT}$).
6. **Colligative Properties**: Boiling point elevation ($\Delta T_b = i K_b m$), freezing point depression ($\Delta T_f = i K_f m$), and osmotic pressure ($\Pi = iCRT$).
7. **Chemical Equilibrium ($K_p / K_c$)**: Heterogeneous and homogeneous gas-phase equilibrium reaction quotient calculations.

---

## ⚡ Interactive Chemistry Labs

1. **Interactive Cell & Battery Lab** (`src/components/InteractiveDaniellCell.tsx`):
   * **Presets**: Daniell Cell, General Galvanic Cell, Electrolytic Cell, Lead-Acid Battery, Lithium-Ion Battery (intercalation model), Hydrogen-Oxygen Fuel Cell, Corrosion / Rusting cell, Molten NaCl Electrolysis, Aqueous NaCl (Chlor-Alkali) Electrolysis.
   * **Dynamic Physics Engine**: Real-time electron flow animation, ion migration through salt bridges / semi-permeable membranes, dynamic $E^\circ$ and Nernst $E_{cell}$ calculation from a single source of truth.
   * **User Customization**: Real-time electrode swapping (Zn, Cu, Ag, Fe, Ni, Pb, Pt, Carbon), electrolyte concentration sliders ($0.01\text{ M} \to 2.0\text{ M}$), and external voltage polarity switching.
2. **pH Lab & Titration Simulator** (`src/components/PHMeterTab.tsx`):
   * Dynamic indicator color transitions, buret drop animation, real-time pH titration curves, and equivalence point detection.
3. **Thermodynamics & Phase Simulators**:
   * Interactive phase diagrams, Maxwell-Boltzmann kinetic energy distributions, and Le Chatelier equilibrium shifts.

---

## 🛠️ AI Study Toolkit

### 1. Reaction Mechanism Explainer (`src/services/mechanismEngine.ts`)
* Analyzes reaction equations, named reactions, and natural language descriptions.
* Displays reactants, reagents, conditions, intermediates, and final products.
* Curates step-by-step electron movement, catalytic cycles, nucleophile/electrophile/leaving-group identification, and stereochemical consequences ($S_N2$ Walden inversion, $S_N1$ racemization).
* Built-in Step Player: Next Step, Previous Step, Auto-Play, Pause, and uncertainty markers for condition-dependent mechanisms.

### 2. Organic Conversion Lab (`src/services/organicConversionEngine.ts`)
* Solves multi-step synthetic routes (e.g. Ethanol $\to$ Ethanoic Acid, Benzene $\to$ Phenol, Aniline $\to$ Nitrobenzene).
* Outlines reagents, solvent, temperature, reaction type, and mechanism for each stage.
* **"Why This Reagent?" Analysis**: Explains why specific reagents (e.g. PCC vs $KMnO_4$) are chosen over alternatives to prevent over-oxidation or unwanted side reactions.

### 3. Give Reason Engine (`src/services/giveReasonEngine.ts`)
* Specifically tailored for high-frequency conceptual exam questions (e.g., "Why does $H_2O$ have a higher boiling point than $H_2S$?", "Why do transition metals exhibit variable oxidation states?").
* Outputs a structured 3-part response:
  1. **Core Scientific Principle** (Fundamental law or force).
  2. **Detailed Chemical Cause** (Molecular orbitals, electronegativity, crystal field splitting).
  3. **One-Line Exam Answer** (Concise, high-scoring answer formatted for marking schemes).

### 4. Assertion-Reason Engine (`src/services/questionEngine.ts`)
* Covers all curriculum tiers with Assertion (A) and Reason (R) statements.
* Evaluates truth values and causal explanatory validity with randomized options (A, B, C, D).
* Provides comprehensive rationale, underlying concept analysis, and exam tips post-submission.

### 5. AI Revision Flashcards (`src/services/flashcardEngine.ts`)
* Generates 1-mark definitions, 2-mark conceptual questions, 3-mark derivations, key formulas, and common exam pitfalls for any chemistry topic.
* Interactive 3D flip card UI with "Mark Difficult", "Mark Known", and SuperMemo SM-2 spaced repetition tracking.

### 6. Interactive Mind Map Generator (`src/components/MindMapTab.tsx`)
* Generates hierarchical concept trees for any entered chemistry topic.
* Interactive zoom, pan, node expansion/collapse, prerequisite tracking, and direct "Practice Concept" links.

---

## 🎯 Question Engine & Scalability

* **1,000+ Scalable Questions**: Scalable architecture (`src/services/scalableQuestionBank.ts`) combining pre-verified question banks with on-demand parameterized generators.
* **Diverse Formats**: Multiple Choice, Assertion-Reason, Short Answer, Multi-step Numerical, Mechanism Sequence, and Reaction Product Prediction.
* **Anti-Repetition & Randomization**: Questions and option sequences are shuffled deterministically per session, preventing memorization of option letters.
* **Strict Validation**: All algorithmic questions undergo conservation and unit sanity checks prior to rendering.

---

## 🕸️ Knowledge Graph

* Interactive SVG graph visualizing relationships between elements, compounds, functional groups, and named reactions.
* Clickable nodes providing chemical summaries, related concepts, PubChem IDs, and direct links to simulation labs.

---

## 📚 Data Sources & Integrations

* **PubChem REST API (NCBI)**: Direct fetching of molecular formulas, IUPAC names, 2D/3D structure depictions, molecular weights, Canonical SMILES, and InChIKeys.
* **Curated Verified Chemistry Data**: Standard reduction potentials ($E^\circ$), acid dissociation constants ($pK_a$), bond dissociation energies, and thermodynamic constants ($H^\circ, S^\circ, G^\circ$).
* **Deterministic Scientific Algorithms**: Matrix linear algebra for equation balancing and thermodynamic equilibrium solving.
* **Google Gemini AI (1.5 / 2.0 / Flash)**: Deep mechanistic reasoning, natural language question answering, and contextual tutoring.

---

## 🛡️ AI Reliability & Verification Model

To maintain scientific integrity and prevent uncritical reliance on AI outputs, CHEMIZZIC applies explicit verification labels across all views:

* `[VERIFIED]`: Sourced from peer-reviewed literature, standard reference databases, or validated curriculum banks.
* `[CALCULATED]`: Output computed using deterministic mathematical and thermodynamic equations.
* `[PREDICTED]`: Chemically reasoned outcome using established reactivity series and rules.
* `[AI-GENERATED]`: Generated via Google Gemini with structured JSON schema enforcement.
* `[EXPERIMENTAL]`: Empirical laboratory data under specific documented conditions.
* `[DEFAULT ASSUMPTION]`: Standard state conditions applied ($25^\circ\text{C}, 1\text{ atm}, 1.0\text{ M}$) when parameters are omitted by the user.
* `[USER-PROVIDED]`: Custom values provided directly by the learner.

---

## 📐 System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CHEMIZZIC CLIENT (React + Vite)                  │
├───────────────────┬───────────────────┬────────────────────────────────┤
│   AI Study Tools  │  Interactive Labs │     Adaptive Learning          │
│  - Mechanism Expl │  - Cell & Battery │    - Diagnostic Assessment     │
│  - Conversion Lab │  - pH Titration   │    - Mastery Engine            │
│  - Give Reason    │  - Kinetics Lab   │    - Spaced Repetition (SM-2)  │
│  - Flashcards     │  - Phase Explorer │    - Student/Teacher Analytics │
│  - Mind Maps      │  - Thermo Chamber │    - Universal Search Intent   │
└─────────┬─────────┴─────────┬─────────┴────────────────┬───────────────┘
          │                   │                          │
          ▼                   ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   EXPRESS API BACKEND (server.ts)                       │
├────────────────────────────────────────────────────────────────────────┤
│  Endpoints:                                                            │
│  • /api/mechanism          • /api/organic-conversion                   │
│  • /api/give-reason        • /api/ai/flashcards                        │
│  • /api/search             • /api/ai/chat (Contextual Tutor)           │
│  • /api/ai/reaction        • /api/analytics & leaderboard              │
└─────────┬───────────────────┬──────────────────────────┬───────────────┘
          │                   │                          │
          ▼                   ▼                          ▼
┌──────────────────┐ ┌──────────────────┐  ┌─────────────────────────────┐
│  Google Gemini   │ │  PubChem REST    │  │ Deterministic Compute       │
│  API (LLM Core)  │ │  API (NCBI)      │  │ (Stoichiometry, Nernst, pH) │
└──────────────────┘ └──────────────────┘  └─────────────────────────────┘
```

---

## 📁 Project Structure

```text
chemizzic/
├── package.json                   # Dependencies, scripts, project metadata
├── server.ts                      # Express API server & Gemini proxy endpoints
├── vite.config.ts                 # Vite frontend build configuration
├── tailwind.config.js             # Styling tokens and color palettes
├── tsconfig.json                  # TypeScript compiler options
├── src/
│   ├── App.tsx                    # Main portal hub, navigation & view routers
│   ├── main.tsx                   # React root entry point
│   ├── index.css                  # Global styles & Tailwind directives
│   ├── types.ts                   # Core interfaces and shared type models
│   ├── context/
│   │   └── AuthAndQuizContext.tsx # User session, quiz state & telemetry provider
│   ├── components/
│   │   ├── CurriculumBrowserTab.tsx     # Curriculum explorer across 6 education tiers
│   │   ├── EquationSolverTab.tsx        # Matrix equation balancer & redox solver
│   │   ├── FlashcardTab.tsx             # Revision flashcards with 3D flip UI
│   │   ├── GiveReasonTab.tsx            # Conceptual anomaly "Give Reason" engine
│   │   ├── GlobalAIChemistChatbot.tsx   # Context-aware AI Chemist Tutor modal
│   │   ├── GuessTheProductsTab.tsx      # Gamified reaction product challenge (100+)
│   │   ├── InteractiveDaniellCell.tsx   # Universal Cell & Battery Lab animator
│   │   ├── KnowledgeGraphTab.tsx        # Interactive SVG chemical ontology graph
│   │   ├── MindMapTab.tsx               # Hierarchical concept mind map renderer
│   │   ├── NumericalSolverTab.tsx       # Scientific numerical calculators
│   │   ├── OrganicConversionTab.tsx     # Multi-step organic conversion lab
│   │   ├── PeriodicPredictorTab.tsx     # Periodic trend reactivity predictor
│   │   ├── PHMeterTab.tsx               # pH meter lab & titration simulator
│   │   ├── QuizArenaTab.tsx             # Adaptive quiz arena (MCQ, Assertion-Reason)
│   │   ├── ReactionMechanismTab.tsx     # Step-by-step reaction mechanism explainer
│   │   ├── ReactionPredictorTab.tsx     # AI reaction outcome predictor
│   │   ├── StudentAnalyticsDashboard.tsx# Student mastery & learning telemetry
│   │   ├── StudentPersonaSwitcher.tsx   # Demo persona switcher (Class 11 to MTech)
│   │   ├── TeacherAnalyticsDashboard.tsx# Teacher classroom intelligence dashboard
│   │   └── UniversalSearchModal.tsx     # Natural language intent search modal
│   ├── services/
│   │   ├── adaptiveEngine.ts            # Mastery calculations & recommendation logic
│   │   ├── chemistryEngine.ts           # Stoichiometric math & PubChem client
│   │   ├── equationSolver.ts            # Deterministic linear algebra balancer
│   │   ├── flashcardEngine.ts           # Flashcard generation & SM-2 repetition
│   │   ├── giveReasonEngine.ts          # Conceptual anomaly scientific explainer
│   │   ├── mechanismEngine.ts           # Reaction pathway & step-by-step engine
│   │   ├── numericalEngine.ts           # Nernst, Faraday, Gibbs, Arrhenius engines
│   │   ├── organicConversionEngine.ts   # Retrosynthetic conversion pathway planner
│   │   ├── periodicReactionEngine.ts    # Group/period reactivity trends
│   │   ├── phEngine.ts                  # Acid-base dissociation & buffer physics
│   │   ├── questionEngine.ts            # Assertion-Reason & question formatting
│   │   ├── scalableQuestionBank.ts      # 1,000+ scalable question architecture
│   │   └── spacedRepetition.ts          # SuperMemo SM-2 interval scheduler
│   └── data/
│       ├── curriculumData.ts            # Comprehensive curriculum across 6 levels
│       └── guessProductsData.ts         # 100+ verified chemical reaction challenges
└── test-bundle.mjs                # Verification test suite for all modules
```

---

## 🔌 API Documentation

### 1. `POST /api/mechanism`
Explains a chemical reaction mechanism step-by-step.
* **Body**: `{ "query": "Dehydration of ethanol to ethene", "level": "Class 12" }`
* **Response**:
  ```json
  {
    "reactionName": "Acid-Catalyzed Dehydration of Ethanol",
    "startingMaterials": ["CH3CH2OH", "H+"],
    "reagents": "Concentrated H2SO4",
    "conditions": "170 °C (443 K)",
    "intermediates": ["Protonated ethanol", "Ethyl carbocation"],
    "products": ["CH2=CH2", "H3O+"],
    "reactionType": "E1 Elimination",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Protonation of Hydroxyl Group",
        "description": "Oxygen lone pair attacks proton to generate a good leaving group (-OH2+)",
        "electronMovement": "Lone pair on oxygen forms bond with H+",
        "speciesInvolved": ["CH3CH2OH", "H+"]
      }
    ],
    "verificationStatus": "VERIFIED",
    "confidence": 0.98
  }
  ```

### 2. `POST /api/give-reason`
Returns a 3-part conceptual explanation adapted to the education level.
* **Body**: `{ "question": "Why does H2O have a higher boiling point than H2S?", "level": "Class 11" }`
* **Response**:
  ```json
  {
    "corePrinciple": "Intermolecular Hydrogen Bonding",
    "detailedCause": "Oxygen is significantly more electronegative than sulfur, forming strong intermolecular hydrogen bonds in water.",
    "examAnswer": "Water molecules form extensive intermolecular hydrogen bonds due to high electronegativity of oxygen, whereas H2S only exhibits weaker dipole-dipole interactions.",
    "concept": "Chemical Bonding",
    "difficulty": "Medium",
    "verificationStatus": "VERIFIED"
  }
  ```

### 3. `POST /api/organic-conversion`
Computes multi-step organic conversion pathways with reagent justification.
* **Body**: `{ "fromCompound": "Ethanol", "toCompound": "Ethanoic Acid", "level": "Class 12" }`
* **Response**:
  ```json
  {
    "overallRoute": "Ethanol → Ethanoic Acid",
    "steps": [
      {
        "step": 1,
        "from": "Ethanol",
        "to": "Ethanoic Acid",
        "reagent": "Alkaline KMnO4, heat (or acidified K2Cr2O7)",
        "conditions": "Reflux",
        "reactionType": "Oxidation",
        "whyThisReagent": "Strong oxidizing agent capable of directly converting primary alcohols to carboxylic acids.",
        "whyNotOthers": "PCC or Collins reagent would stop oxidation at the aldehyde stage."
      }
    ],
    "verificationStatus": "VERIFIED"
  }
  ```

### 4. `POST /api/ai/flashcards`
Generates comprehensive revision flashcards for any entered concept.
* **Body**: `{ "topic": "Electrochemistry", "level": "Class 12" }`
* **Response**: Array of flashcard objects containing question, answer, category (1-Mark, 2-Mark, Formula, Pitfall), and difficulty.

### 5. `POST /api/ai/chat`
Contextual AI Chemist Tutor endpoint supporting real-time chat with injected tool context.

---

## 💾 Data Models

```typescript
// Core Reaction Mechanism Model
export interface ReactionMechanismResult {
  id: string;
  reactionName: string;
  startingMaterials: string[];
  reagents: string;
  conditions: string;
  intermediates: string[];
  products: string[];
  reactionType: string;
  steps: MechanismStep[];
  catalystRole?: string;
  nucleophile?: string;
  electrophile?: string;
  leavingGroup?: string;
  stereochemicalConsequence?: string;
  whyEachStepOccurs: string[];
  balancedEquation: string;
  verificationStatus: 'VERIFIED' | 'PREDICTED' | 'AI-GENERATED' | 'UNCERTAIN';
  confidence: number;
}

// Conceptual Anomaly Model
export interface GiveReasonResult {
  question: string;
  corePrinciple: string;
  detailedCause: string;
  examAnswer: string;
  topic: string;
  concept: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  educationLevel: string;
  verificationStatus: 'VERIFIED' | 'AI-GENERATED';
}

// Organic Conversion Model
export interface OrganicConversionResult {
  fromCompound: string;
  toCompound: string;
  routeFound: boolean;
  steps: ConversionStep[];
  verificationStatus: 'VERIFIED' | 'PREDICTED' | 'ROUTE_UNCONFIRMED';
}
```

---

## 💻 Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/pranzalpha/CHEMIZZIC.git

# Navigate into project directory
cd chemizzic

# Install dependencies
npm install
```

### Running Locally

```bash
# Start frontend and backend concurrently
npm run dev

# Or run individual services:
npm run server      # Starts the Express backend on port 5000 / configured port
npm run client      # Starts the Vite development server on port 3000
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API Key for Chemistry Intelligence
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

> **Security Note**: Never commit your real API keys to version control. The `.gitignore` file is configured to exclude `.env` files automatically.

---

## 🧪 Testing

Execute the comprehensive automated test suite verifying all 22 phases:

```bash
# Run the complete test suite (Mechanisms, Cells, Conversions, Reasons, Flashcards)
node test-bundle.mjs

# Run TypeScript compilation check
npm run typecheck   # or: node node_modules/typescript/bin/tsc --noEmit
```

---

## 🏆 Hackathon Demonstration Flow (5–10 Minutes)

1. **Diagnostic & Persona Setup (0:00 - 1:30)**:
   * Open CHEMIZZIC and select an academic persona (e.g. *Class 12 - Board & JEE Aspirant*).
   * Take the 3-question diagnostic assessment in the **Quiz Arena** to initialize concept mastery.
2. **Interactive Cell & Battery Lab (1:30 - 3:00)**:
   * Switch to the **Daniell Cell / Battery Lab** tab.
   * Switch between **Daniell Cell**, **Lead-Acid Battery**, and **Molten NaCl Electrolysis**.
   * Adjust Zn²⁺ and Cu²⁺ concentrations and observe the dynamic Nernst potential update and animated ion migration.
3. **Reaction Mechanism Explainer (3:00 - 4:30)**:
   * Navigate to **Mechanisms ⚡**.
   * Run *"Dehydration of ethanol to ethene"*.
   * Step through the mechanism using the **Next Step** button, inspecting carbocation intermediates and curved electron movement.
4. **Organic Conversion Lab & "Give Reason" (4:30 - 6:00)**:
   * Navigate to **Organic Lab 🧫** and execute *"Ethanol → Ethanoic Acid"*.
   * Inspect the *"Why This Reagent?"* card showing why alkaline $KMnO_4$ is selected over PCC.
   * Open **Give Reason 🔍** and enter *"Why does H2O have a higher boiling point than H2S?"* to observe the 3-part exam answer.
5. **Revision Flashcards & Mind Map (6:00 - 7:30)**:
   * Open **Flashcards 📇** to review high-yield 1-mark and 2-mark cards with 3D flip animation.
   * View the **Mind Map** to visualize hierarchical topic relationships.
6. **Teacher Analytics & AI Tutor (7:30 - 9:00)**:
   * Click **"Ask AI Chemist"** from any view to demonstrate seamless contextual question answering.
   * Open **Teacher Dashboard** to inspect classroom mastery distributions, weak concepts, and leaderboards.

---

## ⚠️ Limitations

* **Browser 3D Acceleration**: Complex molecular surface renderings depend on client WebGL capabilities.
* **Condition Ambiguity**: Reactions that yield divergent products based on undisclosed conditions (e.g., cold dilute vs hot concentrated $HNO_3$) will explicitly flag an `UNCERTAIN` or `CONDITION-DEPENDENT` verification status.
* **Offline AI Mode**: Generative explanations require an active internet connection to communicate with Google Gemini API endpoints; deterministic calculations and cached questions remain functional offline.

---

## 🗺️ Future Roadmap

* **[PLANNED]** WebAssembly integration of RDKit for client-side stereochemical SMILES parsing.
* **[PLANNED]** AR/VR lab simulation module using WebXR for immersive virtual laboratory experiments.
* **[PLANNED]** LMS integration (Canvas, Google Classroom, Moodle) via LTI 1.3 standard.
* **[PLANNED]** Voice-driven conversational Socratic chemistry tutor.

---

## 🧑‍💻 Team

### **CHEMIZZIC**
Built with passion as an advanced student innovation project at the intersection of **Artificial Intelligence × Scientific Computing × Chemistry Education × Interactive Visualization**.

**Team Members**:
* **Prantik Das** — *Lead Full-Stack & Systems Architecture*
* **Agnidipta sarkar** — *AI Engineering & Scientific Computing*
* **Shruti Saha** — *Interactive UI/UX & Simulation Engineering*
* **Kuntal Banerjee** — *Chemistry Curriculum Architecture & Pedagogy*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

* **PubChem / National Center for Biotechnology Information (NCBI)** for providing open chemical property datasets and structure representations.
* **Google Gemini** for multimodal generative AI capabilities.
* The open-source React, Vite, and Tailwind communities.

---

### 🧪 CHEMIZZIC — *Chemistry, Visualized. Intelligence, Integrated.*
