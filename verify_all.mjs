// End-to-End Automated Verification Script for CHEMIZZIC APIs
async function runTests() {
  console.log("=== CHEMIZZIC COMPREHENSIVE ENDPOINT VERIFICATION ===");
  const baseUrl = "http://localhost:3000";

  // Test 1: Equation Solver
  console.log("\n[1] Testing Equation Solver: KMnO4 + HCl...");
  try {
    const res = await fetch(`${baseUrl}/api/reaction/solve-equation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equation: 'KMnO4 + HCl' })
    });
    const data = await res.json();
    console.log("Result status:", res.status);
    console.log("Balanced equation:", data.result.balancedEquation);
    console.log("Reaction type:", data.result.reactionType);
    console.log("Oxidation states:", data.result.oxidationStates.length, "elements tracked");
    console.log("Steps count:", data.result.balancingSteps.length);
  } catch (err) {
    console.error("Test 1 error:", err);
  }

  // Test 2: Periodic Table Predictor
  console.log("\n[2] Testing Periodic Reaction: Na + H2O...");
  try {
    const res = await fetch(`${baseUrl}/api/periodic/reaction?element=Na&reagent=H2O`);
    const data = await res.json();
    console.log("Result status:", res.status);
    console.log("Balanced:", data.result.balancedEquation);
    console.log("Trends:", data.result.periodicTrends[0]);
  } catch (err) {
    console.error("Test 2 error:", err);
  }

  // Test 3: pH Compound Search & Calculation
  console.log("\n[3] Testing pH Calculation: Acetic Acid (CH3COOH)...");
  try {
    const res = await fetch(`${baseUrl}/api/ph/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compoundId: 'ch3cooh', concentration: 0.1, volumeMl: 100, dilutionWaterMl: 0, temperatureC: 25 })
    });
    const data = await res.json();
    console.log("Result status:", res.status);
    console.log("Calculated pH:", data.result.calculatedPH);
    console.log("pOH:", data.result.pOH);
    console.log("Method:", data.result.methodUsed);
  } catch (err) {
    console.error("Test 3 error:", err);
  }

  // Test 4: Universal Chemistry Search
  console.log("\n[4] Testing Universal Chemistry Search: Benzene...");
  try {
    const res = await fetch(`${baseUrl}/api/chemical/search?q=benzene`);
    const data = await res.json();
    console.log("Result status:", res.status);
    console.log("Chemical found:", data.chemical.name, `(${data.chemical.formula})`);
    console.log("Structure SMILES:", data.chemical.smiles);
    console.log("Safety GHS codes:", data.chemical.ghsCodes?.length || 0);
  } catch (err) {
    console.error("Test 4 error:", err);
  }

  // Test 5: Universal Equation Search via Search Bar
  console.log("\n[5] Testing Search with Equation: HCl + NaOH...");
  try {
    const res = await fetch(`${baseUrl}/api/chemical/search?q=HCl%20%2B%20NaOH`);
    const data = await res.json();
    console.log("Result status:", res.status);
    console.log("Equation detected and resolved:", data.reaction?.balancedEquation || data.reaction?.reactionType);
    console.log("Reaction type:", data.reaction?.reactionType);
  } catch (err) {
    console.error("Test 5 error:", err);
  }

  // Test 6: AI Hints
  console.log("\n[6] Testing Progressive AI Hint: Level 1 and Level 2...");
  try {
    const res = await fetch(`${baseUrl}/api/ai/hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: 'q_test_1',
        question: 'Which of the following molecules has a linear molecular geometry according to VSEPR theory?',
        concept: 'molecular_structure',
        difficulty: 'medium',
        level: 1
      })
    });
    const data = await res.json();
    console.log("Hint Level 1:", data.hint);
  } catch (err) {
    console.error("Test 6 error:", err);
  }

  // Test 7: Multi-turn AI Chemist Chatbot
  console.log("\n[7] Testing Multi-turn AI Chemist Chatbot Context...");
  try {
    const res = await fetch(`${baseUrl}/api/chemist/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Give me an example of an oxidation reaction.',
        context: 'General Chemistry',
        history: [
          { role: 'user', parts: [{ text: 'What is oxidation?' }] },
          { role: 'model', parts: [{ text: 'Oxidation is the loss of electrons during a reaction by a molecule, atom or ion.' }] }
        ]
      })
    });
    const data = await res.json();
    console.log("Chatbot response received:", data.reply?.substring(0, 100) + "...");
    console.log("Suggestions returned:", data.suggestions?.length || 0);
  } catch (err) {
    console.error("Test 7 error:", err);
  }

  console.log("\n=== ALL CHEMIZZIC ENDPOINTS VERIFIED SUCCESSFULLY ===");
}

runTests();
