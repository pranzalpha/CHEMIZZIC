# 🧪 CHEMIZZIC

### **Visual Chemistry Intelligence for Smarter Learning & Research**

> **Making Chemistry understandable through data, visualization and AI.**

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google\&logoColor=white)](https://ai.google.dev/)
[![PubChem](https://img.shields.io/badge/Data-PubChem-0066CC)](https://pubchem.ncbi.nlm.nih.gov/)

---

## 🚀 Overview

**CHEMIZZIC** is an AI-powered visual chemistry platform designed to make chemical information easier to **search, understand, visualize and explore**.

Traditional chemistry resources often present compounds as isolated tables of formulas, molecular weights and technical terminology. While this information is scientifically valuable, it can be difficult for students and non-specialist learners to connect the data with:

* Molecular structures
* Physical properties
* Chemical behavior
* Applications
* Safety information
* Reactions
* Real-world relevance

CHEMIZZIC addresses this gap by combining a structured chemical database with **AI-generated explanations and visual learning interfaces**.

Instead of simply returning a chemical name, CHEMIZZIC attempts to build a complete **chemical profile** around the compound.

---

# 🎯 Problem Statement

### The problem

Chemistry learners frequently have to move between multiple resources to understand a single compound.

For example, a student searching for **benzene** may need to separately find:

1. Molecular formula
2. Molecular mass
3. IUPAC name
4. Molecular structure
5. SMILES representation
6. Physical properties
7. Applications
8. Hazards
9. Safety information
10. Chemical reactions

This fragmented workflow makes chemistry:

* Difficult to visualize
* Time-consuming to research
* Harder for beginners to understand
* Less interactive
* Difficult to connect with real-world applications

### Our approach

CHEMIZZIC creates a unified interface where users can search for a compound and explore its information through a **visual, structured and AI-assisted experience**.

---

# 💡 Our Solution

CHEMIZZIC combines three major components:

```text
                ┌──────────────────────┐
                │       USER           │
                │  Chemical Query      │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   CHEMIZZIC ENGINE   │
                │ Search & Processing  │
                └──────────┬───────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌────────────────┐        ┌────────────────┐
     │    PubChem     │        │ Google Gemini  │
     │ Chemical Data  │        │ AI Enrichment  │
     └───────┬────────┘        └────────┬───────┘
             │                          │
             └────────────┬─────────────┘
                          ▼
                ┌──────────────────────┐
                │ Visual Chemical      │
                │ Profile              │
                └──────────────────────┘
```

The platform uses **PubChem as a source for core chemical identifiers and properties**, while Gemini is used to enrich the profile with contextual information such as descriptions, uses, characteristics and safety-oriented information.

---

# ✨ Key Features

## 🔍 1. Intelligent Chemical Search

Users can search chemicals using different identifiers, including:

* Chemical name
* Molecular formula
* PubChem CID

The backend first checks locally available chemical information and can then query the **PubChem PUG REST API** when necessary.

### Example

```text
Search:
Benzene

↓

CHEMIZZIC

↓

Formula: C6H6
Molecular Mass: 78.11 g/mol
IUPAC Name: Benzene
SMILES: c1ccccc1
CID: ...
```

---

# 🧬 2. Molecular Information

CHEMIZZIC presents important molecular information in a structured format.

Depending on availability, the system can display:

* Molecular formula
* Molecular weight
* IUPAC name
* Canonical SMILES
* PubChem CID
* Molecular structure image

The implementation retrieves these core properties directly through PubChem's REST endpoints.

---

# 🤖 3. AI-Powered Chemical Enrichment

Instead of presenting raw database information, CHEMIZZIC uses **Google Gemini** to generate contextual information around a chemical compound.

AI enrichment includes areas such as:

* Compound description
* Physical characteristics
* Applications
* Safety information
* Hazards
* NFPA-related information
* Educational explanations

The backend uses structured JSON responses for several AI-generated chemistry workflows, allowing the frontend to consume information in a predictable format.

> **Important:** AI-generated information is intended for educational and exploratory assistance and should be independently verified before being used for laboratory, industrial or safety-critical decisions.

---

# 🧪 4. Chemical Reaction Intelligence

CHEMIZZIC extends beyond static compound information by using AI to structure reaction information.

The reaction engine can represent information such as:

* Reactants
* Products
* Chemical equations
* Reaction type
* Thermal classification
* Energy change
* Activation energy
* Catalysts
* Reaction conditions

This allows users to explore chemistry as a **process**, rather than only as a collection of compounds.

---

# 🧠 5. Multi-Level Learning

A major goal of CHEMIZZIC is to make the same chemical information useful for different types of users.

### 🎓 Student Mode

Focuses on:

* Simple explanations
* Key concepts
* Important properties
* Applications
* Learning-oriented descriptions
* Visual understanding

### 🔬 Research / Advanced Mode

Provides a more technical perspective involving:

* IUPAC information
* Molecular identifiers
* SMILES
* Chemical properties
* Reaction information
* Safety information
* Scientific terminology

This creates a bridge between **beginner-friendly learning and deeper chemical exploration**.

---

# 🧩 6. Visual-First Learning

CHEMIZZIC is built around the idea that chemistry should not be represented only through paragraphs and tables.

The platform focuses on turning chemical information into:

```text
Chemical Name
      ↓
Molecular Formula
      ↓
Molecular Structure
      ↓
Properties
      ↓
Applications
      ↓
Reactions
      ↓
Safety
      ↓
Real-World Context
```

This makes it easier for learners to connect abstract chemical concepts with something visually understandable.

---

# ⚛️ 7. Element-Based Compound Exploration

CHEMIZZIC also supports exploration of compounds associated with combinations of chemical elements.

The backend contains curated compound mappings for common combinations and can use Gemini-based generation for broader exploration when a curated match is unavailable.

For example:

```text
C + O

↓

CO₂
Carbon Dioxide

C + H

↓

CH₄
Methane

H + O

↓

H₂O
Water
```

This creates an intuitive way to explore the relationship between **elements and compounds**.

---

# 🛡️ 8. Safety-Oriented Information

Chemical education should not ignore safety.

CHEMIZZIC attempts to surface:

* Hazard descriptions
* Safety notes
* GHS-related pictograms
* NFPA-style indicators
* Laboratory precautions

The backend derives GHS-related pictogram information from the enriched hazard data and structures NFPA fields for the chemical profile.

### Safety Principle

CHEMIZZIC is an **educational and informational platform**.

It does **not** replace:

* Safety Data Sheets (SDS)
* Laboratory protocols
* Institutional safety procedures
* Qualified chemists
* Professional scientific judgment

---

# 🏗️ Technical Architecture

## Frontend

```text
React
   │
   ├── Interactive UI
   ├── Chemical Search
   ├── Visual Profiles
   ├── Learning Interface
   └── Data Visualization
```

The project uses React 19, Vite and TypeScript, with libraries including Lucide React and Motion for interface components and interactions.

---

## Backend

```text
Node.js
   │
Express
   │
REST API
   │
├── Local Chemical Data
├── PubChem API
├── Gemini AI
└── Chemical Processing
```

The Express backend exposes chemistry-focused API routes and handles external data retrieval and AI enrichment.

---

# 🔌 Data & AI Pipeline

CHEMIZZIC follows a layered information pipeline.

### Step 1 — User Query

```text
"Benzene"
```

### Step 2 — Local Search

The system checks whether the compound is available in its local/curated dataset.

### Step 3 — PubChem Lookup

If required, the backend queries PubChem for:

```text
CID
Formula
Molecular Weight
IUPAC Name
Canonical SMILES
```

### Step 4 — AI Enrichment

Gemini processes the validated chemical information to generate contextual information.

### Step 5 — Structured Response

The backend combines the information into a unified chemical object.

### Step 6 — Visual Interface

The frontend converts the structured response into an interactive chemical profile.

---

# 🧰 Technology Stack

| Layer             | Technology        |
| ----------------- | ----------------- |
| Frontend          | React             |
| Language          | TypeScript        |
| Build Tool        | Vite              |
| Backend           | Node.js + Express |
| AI                | Google Gemini     |
| Chemical Database | PubChem PUG REST  |
| UI Icons          | Lucide React      |
| Animation         | Motion            |
| Styling           | Tailwind CSS      |
| API Architecture  | REST              |

The current repository's `package.json` confirms the React, Vite, TypeScript, Express, Gemini, Tailwind and Motion stack.

---

# 📁 Project Structure

```text
CHEMIZZIC/
│
├── assets/
│
├── src/
│   └── frontend application
│
├── server.ts
│   └── Express backend
│
├── index.html
│
├── package.json
│
├── tsconfig.json
│
├── vite.config.ts
│
├── metadata.json
│
├── .env.example
│
└── README.md
```

The repository currently contains the frontend source, server implementation, Vite configuration, TypeScript configuration, environment template and package configuration.

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have:

* Node.js
* npm
* Google Gemini API key

---

## 1. Clone the repository

```bash
git clone https://github.com/pranzalpha/CHEMIZZIC.git
```

```bash
cd CHEMIZZIC
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create:

```text
.env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

Never commit API keys or other secrets to GitHub.

---

## 4. Start the development server

```bash
npm run dev
```

The current project configuration uses `tsx server.ts` for the development command.

---

## 5. Build for production

```bash
npm run build
```

Then:

```bash
npm start
```

---

# 🔐 Security & Responsible AI

CHEMIZZIC follows a **human-in-the-loop** approach.

The system is designed to assist users in understanding chemistry, not to make unsupervised scientific or laboratory decisions.

### AI limitations

AI-generated information may contain:

* Incomplete information
* Contextual errors
* Outdated information
* Incorrect interpretations

Therefore:

> **AI output should always be verified against authoritative scientific sources before laboratory, medical, industrial or safety-critical use.**

PubChem is used as the source for core compound identifiers and properties, while AI is primarily used to enrich and explain the information.

---

# 🏆 Why CHEMIZZIC Is Hackathon-Ready

CHEMIZZIC is not simply a chemistry database.

It combines:

### 🧪 Scientific Data

Real chemical identifiers and properties.

### 🤖 Generative AI

Contextual explanations and chemical intelligence.

### 👁️ Visualization

Making molecular information easier to understand.

### 🎓 Education

Helping students learn chemistry interactively.

### 🔬 Research Support

Providing structured access to chemical information.

### 🛡️ Safety Awareness

Surfacing hazards and safety-oriented information.

---

# 🌍 Potential Impact

CHEMIZZIC can be useful across multiple environments.

## Schools & Colleges

Students can explore compounds without switching between multiple resources.

## Chemistry Laboratories

Researchers and students can quickly inspect basic compound information before deeper investigation.

## STEM Education

Visual chemical profiles can help bridge the gap between textbook theory and practical understanding.

## Self-Learning

Students can use the platform to explore unfamiliar compounds and understand their real-world relevance.

## Science Communication

Complex chemical information can be transformed into more accessible explanations.

---

# 🔮 Future Roadmap

CHEMIZZIC can evolve into a broader **AI Chemistry Intelligence Platform**.

### Phase 1 — Current Platform

* Chemical search
* PubChem integration
* AI enrichment
* Molecular information
* Reaction intelligence
* Safety information
* Visual learning

### Phase 2 — Advanced Chemistry

* Molecular 3D visualization
* Reaction mechanism visualization
* Interactive molecular manipulation
* Chemical equation balancing
* Reaction pathway exploration
* Advanced search filters

### Phase 3 — AI Chemistry Tutor

```text
Student
   ↓
Ask Chemistry Question
   ↓
AI Chemistry Tutor
   ↓
Visual Explanation
   ↓
Interactive Example
   ↓
Quiz
   ↓
Performance Analysis
```

### Phase 4 — Research Intelligence

Potential additions include:

* Scientific literature discovery
* Citation-backed answers
* Reaction literature search
* Compound comparison
* Molecular similarity search
* Research workspace
* Experiment planning assistance

---

# 💡 Innovation

The core innovation behind CHEMIZZIC is the **combination of structured chemical data + AI interpretation + visual learning**.

Instead of:

```text
Database → Information
```

CHEMIZZIC aims for:

```text
Database
    +
AI
    +
Visualization
    +
Education
    +
Safety
        ↓
CHEMIZZIC
```

The result is a chemistry interface designed around **understanding**, not simply retrieving information.

---

# 🎯 Hackathon Value Proposition

### The challenge

Chemistry information exists in enormous quantities, but accessing and understanding it efficiently remains difficult for many learners.

### Our solution

CHEMIZZIC transforms fragmented chemical information into an interactive AI-assisted learning experience.

### What makes it different

**1. Data-backed**

Core chemical information is retrieved from a recognized chemical database.

**2. AI-enhanced**

Generative AI provides contextual explanations rather than merely displaying raw fields.

**3. Visual**

Molecular information is presented through an interactive interface.

**4. Educational**

The platform is designed to serve both beginners and advanced learners.

**5. Scalable**

The architecture can be expanded from individual compound lookup to reactions, molecular intelligence and chemistry education.

---

# 📊 Example User Journey

```text
User searches "H₂O"
        ↓
CHEMIZZIC identifies compound
        ↓
PubChem data retrieved
        ↓
Formula + molecular mass + IUPAC + SMILES
        ↓
Gemini enriches contextual information
        ↓
Properties + uses + characteristics + safety
        ↓
Visual chemical profile
        ↓
User explores related chemistry
```

---

# 👥 Target Users

| User                   | Primary Use                    |
| ---------------------- | ------------------------------ |
| 🎓 Students            | Learning & revision            |
| 👨‍🏫 Teachers         | Demonstration & explanation    |
| 🔬 Researchers         | Chemical information lookup    |
| 🧪 Laboratory Students | Compound exploration           |
| 🧠 Self-learners       | Interactive chemistry learning |
| 💻 Developers          | Chemistry-data applications    |

---

# 📜 Project Status

CHEMIZZIC is an active hackathon-oriented prototype focused on demonstrating how **AI and scientific data can be combined to improve chemistry education and exploration**.

The current repository already contains the React/Vite frontend, Express backend, PubChem integration and Gemini-powered chemistry workflows.

---

# 🧑‍💻 Team

### **CHEMIZZIC**

Built as a student innovation project focused on:

> **Artificial Intelligence × Chemistry × Education × Visualization**

**Team Members**

* Prantik Das
* Ishita Parvin
* Soumodip Khalko
* Priyajeet Ghosh

---

# 🌟 Vision

> **"Make chemistry searchable, visual, understandable and intelligent."**

CHEMIZZIC aims to move chemistry learning from:

```text
Read → Memorize → Forget
```

towards:

```text
Search → Visualize → Understand → Explore → Learn
```

---

# 📄 License

Add the project's chosen open-source license here.

For example:

```text
MIT License
```

if the team decides to release the project under MIT.

---

# 🙌 Acknowledgements

* **PubChem / National Center for Biotechnology Information** for chemical data access.
* **Google Gemini** for generative AI capabilities.
* Open-source technologies used throughout the project.
* The hackathon organizers, mentors and evaluators supporting student innovation.

---

## 🔗 Project

**GitHub:**
https://github.com/pranzalpha/CHEMIZZIC

---

### 🧪 CHEMIZZIC

**Chemistry, visualized. Intelligence, integrated.**

