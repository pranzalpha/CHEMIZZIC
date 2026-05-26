/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { popularChemicals } from './src/data/popularChemicals';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Google GenAI SDK
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.warn("WARNING: GEMINI_API_KEY is not configured or in placeholder state. Server-side AI features will be unavailable.");
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// -------------------------------------------------------------------
// API ROUTE 1: Search Chemistry Database
// Matches local chemicals first, otherwise proxies PubChem PUG REST API
// and enriches using server-side Gemini model
// -------------------------------------------------------------------
app.get('/api/chemical/search', async (req, res) => {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }

  // 1. Check in popular chemicals database
  const queryLower = query.toLowerCase();
  const matchedLocal = popularChemicals.find(chem => 
    chem.name.toLowerCase() === queryLower ||
    chem.formula.toLowerCase() === queryLower ||
    chem.smiles.toLowerCase() === queryLower ||
    (chem.iupacName && chem.iupacName.toLowerCase() === queryLower)
  );

  if (matchedLocal) {
    res.json({ source: 'local', chemical: matchedLocal });
    return;
  }

  // 2. Fetch from PubChem PUG REST API
  try {
    let pubChemData: any = null;

    // A. Direct Property Fetch by Name
    try {
      const pcRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES/JSON`);
      if (pcRes.ok) {
        const json: any = await pcRes.json();
        pubChemData = json.PropertyTable?.Properties?.[0];
      }
    } catch (_) {
      // Fallback
    }

    // B. Direct Property Fetch by Formula (Fast Formula)
    if (!pubChemData) {
      try {
        const pcRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastformula/${encodeURIComponent(query)}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES/JSON`);
        if (pcRes.ok) {
          const json: any = await pcRes.json();
          // Take first matching compound
          pubChemData = json.PropertyTable?.Properties?.[0];
        }
      } catch (_) {
        // Fallback
      }
    }

    // C. Search CID directly if numeric search
    if (!pubChemData && /^\d+$/.test(query)) {
      try {
        const pcRes = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${query}/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES/JSON`);
        if (pcRes.ok) {
          const json: any = await pcRes.json();
          pubChemData = json.PropertyTable?.Properties?.[0];
        }
      } catch (_) {
        // Fallback
      }
    }

    if (!pubChemData) {
      res.status(404).json({ error: `Could not find chemical details for '${query}' on PubChem or in local database.` });
      return;
    }

    // Prepare chemical core properties
    const cid = pubChemData.CID;
    const formula = pubChemData.MolecularFormula || "Unknown Formula";
    const molarMass = pubChemData.MolecularWeight ? `${pubChemData.MolecularWeight} g/mol` : "Unknown Molar Mass";
    const iupacName = pubChemData.IUPACName || query;
    const smiles = pubChemData.CanonicalSMILES || "";
    const structureImage = cid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG` : undefined;

    // 3. Ask Gemini to enrich safety profile, uses, physical properties and descriptions
    const ai = getGeminiClient();
    let enrichedData: any = {
      density: "N/A",
      meltingPoint: "N/A",
      boilingPoint: "N/A",
      appearance: "Spectral data pending verification",
      odor: "Odorless or unclassified",
      description: `Scientific profile for chemical identifier (CID ${cid}). Formula is ${formula}. Details fetched on-demand from the PubChem chemical repository.`,
      hazards: ["Check MSDS for full hazards safety instructions."],
      uses: ["Industrial catalyst or chemical research synthesis precursor."],
      characteristics: ["Chemical compound identifier (CID) matched from chemical repository."],
      nfpa: { health: 1, flammability: 0, instability: 0 }
    };

    if (ai) {
      try {
        const prompt = `You are a scientific database enricher. Analyze this validated chemical compound:
Name: ${query}
IUPAC Name: ${iupacName}
Formula: ${formula}
Molar Mass: ${molarMass}
SMILES: ${smiles}
CID: ${cid}

Provide a deep chemical profile with physical properties, standard uses, hazards (citing standard H-statements if possible), physical characteristics, and standard NFPA 704 fire diamond values. Respond ONLY in structured JSON matching this schema exactly. Do not include markdown wraps or code boxes.

JSON Fields expected:
- density (string, e.g., "1.84 g/cm³")
- meltingPoint (string, e.g., "10.3 °C")
- boilingPoint (string, e.g., "337 °C")
- appearance (string)
- odor (string)
- description (string, 2-3 sentences overview)
- hazards (array of strings, hazard statements like H225)
- uses (array of strings, list applications)
- characteristics (array of strings, descriptive chemical features)
- nfpaHealth (integer, 0-4)
- nfpaFlammability (integer, 0-4)
- nfpaInstability (integer, 0-4)
- nfpaSpecial (string, optional like "W" or "OX")`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                density: { type: Type.STRING },
                meltingPoint: { type: Type.STRING },
                boilingPoint: { type: Type.STRING },
                appearance: { type: Type.STRING },
                odor: { type: Type.STRING },
                description: { type: Type.STRING },
                hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
                uses: { type: Type.ARRAY, items: { type: Type.STRING } },
                characteristics: { type: Type.ARRAY, items: { type: Type.STRING } },
                nfpaHealth: { type: Type.INTEGER },
                nfpaFlammability: { type: Type.INTEGER },
                nfpaInstability: { type: Type.INTEGER },
                nfpaSpecial: { type: Type.STRING }
              },
              required: ["density", "meltingPoint", "boilingPoint", "appearance", "odor", "description", "hazards", "uses", "characteristics", "nfpaHealth", "nfpaFlammability", "nfpaInstability"]
            }
          }
        });

        const resText = response.text?.trim() || "";
        const geminiJson = JSON.parse(resText);
        
        enrichedData = {
          density: geminiJson.density || "N/A",
          meltingPoint: geminiJson.meltingPoint || "N/A",
          boilingPoint: geminiJson.boilingPoint || "N/A",
          appearance: geminiJson.appearance || "N/A",
          odor: geminiJson.odor || "N/A",
          description: geminiJson.description || "Expanded data pending verification.",
          hazards: geminiJson.hazards || ["Refer to standard laboratory specifications."],
          uses: geminiJson.uses || ["Precursor in chemical processes."],
          characteristics: geminiJson.characteristics || [],
          nfpa: {
            health: geminiJson.nfpaHealth ?? 1,
            flammability: geminiJson.nfpaFlammability ?? 0,
            instability: geminiJson.nfpaInstability ?? 0,
            special: geminiJson.nfpaSpecial || undefined
          }
        };
      } catch (geminiErr) {
        console.error("Gemini enrichment failed, using default PubChem fallbacks:", geminiErr);
      }
    }

    // Determine GHS pictograms based on hazards text
    const ghsPictograms: string[] = [];
    const hazardsCollapsed = [...enrichedData.hazards].join(' ').toLowerCase();
    if (hazardsCollapsed.includes('flam') || hazardsCollapsed.includes('h220') || hazardsCollapsed.includes('h225')) {
      ghsPictograms.push('flammable');
    }
    if (hazardsCollapsed.includes('tox') || hazardsCollapsed.includes('h302') || hazardsCollapsed.includes('lethal') || hazardsCollapsed.includes('h301') || hazardsCollapsed.includes('h331')) {
      ghsPictograms.push('toxic-hazard');
    }
    if (hazardsCollapsed.includes('corros') || hazardsCollapsed.includes('burn') || hazardsCollapsed.includes('h314') || hazardsCollapsed.includes('acid')) {
      ghsPictograms.push('corrosive');
    }
    if (hazardsCollapsed.includes('explos') || hazardsCollapsed.includes('h203')) {
      ghsPictograms.push('explosive');
    }
    if (hazardsCollapsed.includes('aquatic') || hazardsCollapsed.includes('environment') || hazardsCollapsed.includes('h400') || hazardsCollapsed.includes('h410')) {
      ghsPictograms.push('environmental');
    }
    if (hazardsCollapsed.includes('cancer') || hazardsCollapsed.includes('defect') || hazardsCollapsed.includes('h340') || hazardsCollapsed.includes('h350') || hazardsCollapsed.includes('fatal')) {
      ghsPictograms.push('danger-health');
    }
    if (hazardsCollapsed.includes('press') || hazardsCollapsed.includes('h280') || hazardsCollapsed.includes('cylinder')) {
      ghsPictograms.push('gas-cylinder');
    }

    const compiledChemical = {
      id: Math.floor(1000 + Math.random() * 9000), // Random temporary key
      name: query.charAt(0).toUpperCase() + query.slice(1),
      iupacName,
      formula,
      molarMass,
      smiles,
      cid,
      structureImage,
      ...enrichedData,
      ghsPictograms
    };

    res.json({ source: 'pubchem', chemical: compiledChemical });

  } catch (err: any) {
    console.error("PubChem lookup error:", err);
    res.status(500).json({ error: "Failed to search chemical database due to network error." });
  }
});

// -------------------------------------------------------------------
// API ROUTE 2: Chemical Chat / Split-Mode Explanation
// Multi-Perspective explanation engine (Student Mode vs Scientist Mode)
// -------------------------------------------------------------------
app.post('/api/chemical/explain', async (req, res) => {
  const { chemicalName, customQuestion } = req.body;
  if (!chemicalName) {
    res.status(400).json({ error: "chemicalName is required" });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.json({
      chemicalName,
      studentExplanation: `Greetings! I'm your AI Chemistry Guide. To answer your custom inquiry or explain ${chemicalName} in detail, please configure your Gemini API Key in the Settings > Secrets menu. Local static summaries are running successfully!`,
      scientistExplanation: `Gemini API key is currently absent. To get quantum orbital configurations, stereochemistry mechanisms, and synthesis pathways, configure process.env.GEMINI_API_KEY.`,
      safetySummary: `Wear personal protective equipment (PPE), work inside a fume hood when heating, and check safety cards.`,
      funFact: `Chemistry is the science of elements that bond to create the entire physical universe!`
    });
    return;
  }

  try {
    const userPrompt = customQuestion 
      ? `Explain "${chemicalName}" specifically answering this: "${customQuestion}"`
      : `Provide an extensive educational profile of the compound "${chemicalName}".`;

    const prompt = `You are a professional chemistry academic advisor. Explain the chemical compound "${chemicalName}" from two contrast perspectives:
1) Student Mode: Simple terms, high-quality real-world analogies, bite-sized, engaging, easy for a high-schooler to read.
2) Scientist Mode: Advanced quantum chemistry parameters, stereochemistry, crystal lattice structures, synthesis mechanisms, thermodynamic properties, molecular orbital theory.

Also summarize critical laboratory safety and handling notes, and end with an educational fun fact about this chemical.

User context: ${userPrompt}

Respond ONLY in structured JSON matching this schema exactly. Ensure all fields are filled. Do not include markdown wrappers or code blocks.

JSON Fields expected:
- chemicalName (string)
- studentExplanation (string, detailed markdown format permitted)
- scientistExplanation (string, detailed markdown format permitted)
- safetySummary (string, markdown list of precautions)
- funFact (string, short punchy fact)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chemicalName: { type: Type.STRING },
            studentExplanation: { type: Type.STRING },
            scientistExplanation: { type: Type.STRING },
            safetySummary: { type: Type.STRING },
            funFact: { type: Type.STRING }
          },
          required: ["chemicalName", "studentExplanation", "scientistExplanation", "safetySummary", "funFact"]
        }
      }
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);
    res.json(parsed);

  } catch (err: any) {
    console.error("AI Explain compound error:", err);
    res.status(500).json({ error: "AI Assistant failed to generate the explanation. Please check your connections." });
  }
});

// -------------------------------------------------------------------
// API ROUTE 3: Reaction Equation Predictor (HCl + NaOH -> NaCl + H2O)
// Solves, scales, classifies, and balances any set of reactant formulas
// -------------------------------------------------------------------
app.post('/api/reaction/predict', async (req, res) => {
  const { reactants } = req.body;
  if (!reactants || reactants.trim().length === 0) {
    res.status(400).json({ error: "Reactants are required. e.g. 'HCl + NaOH'" });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Elegant fallback simulation
    res.json({
      reactantText: reactants,
      balancedEquation: `${reactants} ➔ [Products Pending API Key]`,
      reactionType: "Unpredicted Reaction",
      thermalType: "Neutral",
      energyChange: "0 kJ/mol",
      activationEnergy: "Requires API",
      catalysts: ["None"],
      equationBalanced: {
        reactants: [{ formula: reactants, coefficient: 1, name: "Reactant Substance" }],
        products: [{ formula: "?", coefficient: 1, name: "Unbalanced Products" }]
      },
      keyInsights: [
        "To run the physical AI Reaction Predictor engine, connect your Google Gemini API Key inside Settings > Secrets.",
        "A balanced equation uses stoichiometric coefficients to show chemical conservation of mass."
      ],
      uses: ["Educational chemistry illustration."]
    });
    return;
  }

  try {
    const prompt = `You are an AI Chemical Reaction Engine. Balance, classify, and predict the chemical reaction for the given reactants: "${reactants}".
Identify the products generated, stoichiometric balance coefficients, thermo-chemical categorization (Exothermic / Endothermic), activation energies, catalytic triggers, uses, and critical mechanical insights into the electron displacement or collision details.

Respond ONLY in structured JSON matching this schema exactly. Do not wrap in markdown loops.

JSON Fields expected:
- balancedEquation (string, e.g., "HCl(aq) + NaOH(aq) -> NaCl(aq) + H2O(l)")
- reactionType (string, e.g. "Acid-Base Neutralization", "Redox", "Single Displacement")
- thermalType (string, exactly "Exothermic", "Endothermic", or "Neutral")
- energyChange (string, heat of reaction e.g., "-57.3 kJ/mol")
- activationEnergy (string, e.g. "Low", "32 kJ/mol")
- catalysts (array of strings)
- equationBalanced (object with reactants and products arrays. Each array item has formula: string, coefficient: integer, name: string)
- keyInsights (array of detailed strings explaining why this reaction takes place)
- uses (array of strings, e.g. industrial or biological applications)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            balancedEquation: { type: Type.STRING },
            reactionType: { type: Type.STRING },
            thermalType: { type: Type.STRING },
            energyChange: { type: Type.STRING },
            activationEnergy: { type: Type.STRING },
            catalysts: { type: Type.ARRAY, items: { type: Type.STRING } },
            equationBalanced: {
              type: Type.OBJECT,
              properties: {
                reactants: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      formula: { type: Type.STRING },
                      coefficient: { type: Type.INTEGER },
                      name: { type: Type.STRING }
                    },
                    required: ["formula", "coefficient", "name"]
                  }
                },
                products: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      formula: { type: Type.STRING },
                      coefficient: { type: Type.INTEGER },
                      name: { type: Type.STRING }
                    },
                    required: ["formula", "coefficient", "name"]
                  }
                }
              },
              required: ["reactants", "products"]
            },
            keyInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            uses: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["balancedEquation", "reactionType", "thermalType", "energyChange", "activationEnergy", "catalysts", "equationBalanced", "keyInsights", "uses"]
        }
      }
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);
    res.json({ reactantText: reactants, ...parsed });

  } catch (err: any) {
    console.error("AI Reaction prediction failed:", err);
    res.status(500).json({ error: "AI Reaction Engine failed to predict products. Verify that your reactant formula is chemically possible." });
  }
});

// -------------------------------------------------------------------
// VITE OR STATIC FILE MIDDLEWARE BOOTSTRAPPING
// Handles assets resolution for both dev environment and production build
// -------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Chemical Database Server successfully running in port http://localhost:${PORT}`);
  });
}

startServer();
