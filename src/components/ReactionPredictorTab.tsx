/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ReactionDetail, ReactionMatrixResult } from '../types';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { 
  Play, Sparkles, AlertCircle, RefreshCw, Flame, ThermometerSun, 
  Zap, ArrowRight, FlaskConical, Sliders, ShieldAlert, BookOpen, 
  HelpCircle, Layers, ChevronRight, Activity, Clock, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ReactionPredictorTab() {
  const { recordFeatureUsage } = useAuthAndQuiz();
  
  // Tab Mode: 'predictor' (Universal Predictor for any compound) vs 'editor' (Run every possible reaction matrix)
  const [activeMode, setActiveMode] = useState<'predictor' | 'editor'>('predictor');

  // ==========================================
  // MODE 1: UNIVERSAL REACTION PREDICTOR STATE
  // ==========================================
  const [reactantsInput, setReactantsInput] = useState<string>('Na + H2O');
  const [loadingPredict, setLoadingPredict] = useState<boolean>(false);
  const [predictResult, setPredictResult] = useState<ReactionDetail | null>(null);
  const [predictError, setPredictError] = useState<string | null>(null);

  // Reaction Conditions Panel state
  const [showConditionsPanel, setShowConditionsPanel] = useState<boolean>(false);
  const [useStandardConditions, setUseStandardConditions] = useState<boolean>(true);
  const [condTemp, setCondTemp] = useState<string>('25 °C');
  const [condPressure, setCondPressure] = useState<string>('1 atm');
  const [condSolvent, setCondSolvent] = useState<string>('Water / Aqueous');
  const [condConcentration, setCondConcentration] = useState<string>('1.0 M');
  const [condCatalyst, setCondCatalyst] = useState<string>('None');
  const [condReagent, setCondReagent] = useState<string>('Stoichiometric');
  const [condLight, setCondLight] = useState<string>('None (Ambient)');
  const [condAtmosphere, setCondAtmosphere] = useState<string>('Ambient Air');
  const [condReactionTime, setCondReactionTime] = useState<string>('Immediate');
  const [condPhase, setCondPhase] = useState<string>('Aqueous / Solution');

  // Predefined reaction examples covering inorganic, organic, and condition-dependent benchmarks
  const universalExamples = [
    { label: "Na + H2O", text: "Na + H2O", category: "Displacement / Redox" },
    { label: "HCl + NaOH", text: "HCl + NaOH", category: "Neutralization" },
    { label: "Mg + O2", text: "Mg + O2", category: "Combustion / Redox" },
    { label: "CaCO3 (Calcination)", text: "CaCO3", category: "Thermal Decomposition" },
    { label: "CH3COOH + NaOH", text: "CH3COOH + NaOH", category: "Weak Acid-Base" },
    { label: "CH3Br + NaOH (SN2)", text: "CH3Br + NaOH", category: "Nucleophilic Substitution" },
    { label: "KMnO4 + HCl", text: "KMnO4 + HCl", category: "Permanganate Redox" },
    { label: "Ethanol + H2SO4 (Condition Dependent)", text: "Ethanol + H2SO4", category: "Elimination vs Ether" },
    { label: "Methane Combustion", text: "CH4 + O2", category: "Combustion" },
    { label: "Haber-Bosch", text: "N2 + H2", category: "Industrial" }
  ];

  const handlePredict = async (inputStr?: string, forceStandard?: boolean) => {
    const reactants = (inputStr || reactantsInput || '').trim();
    if (!reactants) return;

    const isStandard = forceStandard !== undefined ? forceStandard : useStandardConditions;

    setLoadingPredict(true);
    setPredictError(null);
    setPredictResult(null);

    const conditionsPayload = isStandard ? undefined : {
      temperature: condTemp,
      pressure: condPressure,
      solvent: condSolvent,
      concentration: condConcentration,
      catalyst: condCatalyst,
      reagent: condReagent,
      light: condLight,
      atmosphere: condAtmosphere,
      reactionTime: condReactionTime,
      phase: condPhase
    };

    try {
      const response = await fetch('/api/reaction/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reactants,
          conditions: conditionsPayload
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to solve chemical reaction equation.");
      }

      const data: ReactionDetail = await response.json();
      setPredictResult(data);
      recordFeatureUsage(
        'reaction',
        'AI Universal Reaction Predictor',
        `Predicted reaction: ${data.balancedEquation || reactants} (${data.reactionType})`,
        'Calculations',
        25
      );
    } catch (err: any) {
      console.error(err);
      setPredictError(err.message || "An unexpected error occurred predicting this reaction.");
    } finally {
      setLoadingPredict(false);
    }
  };

  // ==========================================
  // MODE 2: AI PREDICTION EDITOR STATE
  // ==========================================
  const [editorReactants, setEditorReactants] = useState<string>('Ethanol + Acetic Acid');
  const [editorTemp, setEditorTemp] = useState<number>(85); // Celsius
  const [editorPressure, setEditorPressure] = useState<string>('1 atm');
  const [editorSolvent, setEditorSolvent] = useState<string>('Toluene');
  const [editorCatalyst, setEditorCatalyst] = useState<string>('Concentrated H2SO4');
  const [editorAtmosphere, setEditorAtmosphere] = useState<string>('Inert N2 Gas');
  
  const [loadingEditor, setLoadingEditor] = useState<boolean>(false);
  const [editorResult, setEditorResult] = useState<ReactionMatrixResult | null>(null);
  const [editorError, setEditorError] = useState<string | null>(null);

  const handleRunAllPathways = async () => {
    const reactants = editorReactants.trim();
    if (!reactants) return;

    setLoadingEditor(true);
    setEditorError(null);

    try {
      const response = await fetch('/api/reaction/editor-run-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reactants,
          conditions: {
            temperature: `${editorTemp}°C`,
            pressure: editorPressure,
            solvent: editorSolvent,
            catalyst: editorCatalyst,
            atmosphere: editorAtmosphere
          }
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to simulate reaction matrix.");
      }

      const data: ReactionMatrixResult = await response.json();
      setEditorResult(data);
      recordFeatureUsage(
        'reaction',
        'AI Reaction Prediction Editor',
        `Simulated reaction matrix for ${reactants} at ${editorTemp}°C (${data.primaryPathway?.yieldPercentage || '85%'} yield)`,
        'Calculations',
        35
      );
    } catch (err: any) {
      console.error(err);
      setEditorError(err.message || "Failed to execute reaction prediction matrix.");
    } finally {
      setLoadingEditor(false);
    }
  };

  return (
    <div className="space-y-6 select-text">
      
      {/* HEADER & DUAL MODE SELECTOR */}
      <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="text-cyan-400" size={20} />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Universal AI Reaction Predictor & Prediction Editor
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 uppercase">
                Internet Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate chemical transformations for <strong className="text-cyan-300">every compound available in the world</strong>, or tune reaction conditions to uncover all competitive pathways!
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-black/60 border border-slate-800 rounded-xl font-mono text-xs shrink-0">
            <button
              onClick={() => setActiveMode('predictor')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'predictor'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap size={13} /> Universal Predictor
            </button>
            <button
              onClick={() => setActiveMode('editor')}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'editor'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders size={13} /> AI Prediction Editor
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: UNIVERSAL REACTION PREDICTOR (FOR EVERY COMPOUND IN THE WORLD) */}
        {/* ========================================================================= */}
        {activeMode === 'predictor' && (
          <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handlePredict(reactantsInput); }} className="space-y-3">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Enter Any Compound or Mixture in the World (Formula, Name, or Equation):
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={reactantsInput}
                  onChange={(e) => setReactantsInput(e.target.value)}
                  placeholder="e.g. Caffeine, Glucose + O2, Benzene + Br2, Fe + O2, HCl + NaOH..."
                  className="flex-1 text-xs bg-[#0A0B0E] px-4 py-3 border border-slate-800 focus:border-cyan-400 focus:bg-[#0A0B0E] rounded-xl outline-none font-mono text-cyan-200 font-bold shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loadingPredict}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider font-mono rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                >
                  {loadingPredict ? (
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play size={13} className="fill-black" />
                  )}
                  Predict Reactions
                </button>
              </div>

              {/* Optional Reaction Conditions Panel & Standard Conditions Toggle */}
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUseStandardConditions(!useStandardConditions)}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        useStandardConditions
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Check size={12} className={useStandardConditions ? 'text-emerald-400' : 'opacity-0'} />
                      Use Standard Conditions (25 °C, 1 atm, Ambient)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUseStandardConditions(true);
                        handlePredict(reactantsInput, true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Apply Standard & Predict
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowConditionsPanel(!showConditionsPanel)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer underline"
                  >
                    <Sliders size={12} />
                    {showConditionsPanel ? 'Hide Conditions Panel ▲' : 'Reaction Conditions Panel (Optional) ▼'}
                  </button>
                </div>

                {/* Collapsible 10-Field Conditions Panel */}
                {showConditionsPanel && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800 text-[11px]"
                  >
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Temperature:</label>
                      <input
                        type="text"
                        value={condTemp}
                        onChange={(e) => { setCondTemp(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. 25 °C, 170 °C"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Pressure:</label>
                      <input
                        type="text"
                        value={condPressure}
                        onChange={(e) => { setCondPressure(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. 1 atm, 50 atm"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Solvent:</label>
                      <input
                        type="text"
                        value={condSolvent}
                        onChange={(e) => { setCondSolvent(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. Water, Acetone, DCM"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Concentration:</label>
                      <input
                        type="text"
                        value={condConcentration}
                        onChange={(e) => { setCondConcentration(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. 1.0 M, Dilute, Conc."
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Catalyst:</label>
                      <input
                        type="text"
                        value={condCatalyst}
                        onChange={(e) => { setCondCatalyst(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. H2SO4, Fe, Pt"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Reagent Ratio:</label>
                      <input
                        type="text"
                        value={condReagent}
                        onChange={(e) => { setCondReagent(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. Excess, 1:1"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Light / Radiation:</label>
                      <input
                        type="text"
                        value={condLight}
                        onChange={(e) => { setCondLight(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. None, UV hv"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Atmosphere:</label>
                      <input
                        type="text"
                        value={condAtmosphere}
                        onChange={(e) => { setCondAtmosphere(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. Air, N2, Argon"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Reaction Time:</label>
                      <input
                        type="text"
                        value={condReactionTime}
                        onChange={(e) => { setCondReactionTime(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. Immediate, 2h"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block mb-1">Phase:</label>
                      <input
                        type="text"
                        value={condPhase}
                        onChange={(e) => { setCondPhase(e.target.value); setUseStandardConditions(false); }}
                        placeholder="e.g. Aqueous, Solid, Gas"
                        className="w-full bg-[#111318] border border-slate-800 rounded-lg p-1.5 text-cyan-200 outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </form>

            {/* Curated compound and reaction templates */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
              <span className="text-slate-500 uppercase tracking-wider">Quick Presets:</span>
              {universalExamples.map((item) => (
                <button
                  key={item.text}
                  type="button"
                  onClick={() => { setReactantsInput(item.text); handlePredict(item.text); }}
                  className="px-2.5 py-1 bg-black/40 border border-slate-800 hover:bg-cyan-950/40 hover:border-cyan-500/40 hover:text-cyan-300 text-slate-400 rounded-lg transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: AI PREDICTION EDITOR (RUN EVERY POSSIBLE REACTION FROM INTERNET) */}
        {/* ========================================================================= */}
        {activeMode === 'editor' && (
          <div className="space-y-5">
            <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-purple-200 font-sans leading-relaxed">
              <strong>🔬 AI Prediction Editor Mode:</strong> Configure physical reaction parameters (temperature, pressure, solvent, and catalyst) to run a comprehensive reaction matrix that identifies major products, side reactions, decomposition kinetics, and electron mechanism pathways from internet literature data!
            </div>

            {/* Reactants input */}
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Reaction Mixture / Substrate & Reagents:
              </label>
              <input
                type="text"
                value={editorReactants}
                onChange={(e) => setEditorReactants(e.target.value)}
                placeholder="e.g. Ethanol + Acetic Acid, Benzene + Chloromethane, Propene + HBr..."
                className="w-full text-xs bg-[#0A0B0E] px-4 py-2.5 border border-slate-800 focus:border-purple-400 rounded-xl outline-none font-mono text-purple-200 font-bold"
              />
            </div>

            {/* Multi-parameter interactive controls grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              
              {/* Temperature Slider */}
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400 uppercase font-bold flex items-center gap-1">
                    <ThermometerSun size={12} className="text-amber-400" /> Temperature:
                  </span>
                  <span className="text-cyan-300 font-black">{editorTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="-78"
                  max="1000"
                  step="5"
                  value={editorTemp}
                  onChange={(e) => setEditorTemp(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>-78°C (Cold)</span>
                  <span>25°C (RT)</span>
                  <span>1000°C (Pyrolysis)</span>
                </div>
              </div>

              {/* Pressure */}
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Operating Pressure:</span>
                <select
                  value={editorPressure}
                  onChange={(e) => setEditorPressure(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white outline-none"
                >
                  <option value="0.01 atm (High Vacuum)">0.01 atm (High Vacuum)</option>
                  <option value="1 atm (Ambient Standard)">1 atm (Ambient Standard)</option>
                  <option value="10 atm (Moderate Pressure)">10 atm (Moderate Pressure)</option>
                  <option value="50 atm (High Pressure Autoclave)">50 atm (High Pressure Autoclave)</option>
                  <option value="200 atm (Industrial Haber-Bosch Scale)">200 atm (Ultra Industrial)</option>
                </select>
              </div>

              {/* Solvent */}
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Reaction Solvent:</span>
                <select
                  value={editorSolvent}
                  onChange={(e) => setEditorSolvent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white outline-none"
                >
                  <option value="Water (Aqueous H2O)">Water (Aqueous H2O)</option>
                  <option value="Ethanol (Polar Protic)">Ethanol (Polar Protic)</option>
                  <option value="Dichloromethane / DCM (Polar Aprotic)">DCM (Polar Aprotic)</option>
                  <option value="Acetone">Acetone</option>
                  <option value="Tetrahydrofuran / THF">THF (Ethereal)</option>
                  <option value="Toluene (Aromatic Nonpolar)">Toluene (Aromatic Nonpolar)</option>
                  <option value="Neat / Solvent-free">Neat / Solvent-Free</option>
                  <option value="Supercritical CO2">Supercritical CO2</option>
                </select>
              </div>

              {/* Catalyst & Atmosphere */}
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Catalytic Trigger:</span>
                <select
                  value={editorCatalyst}
                  onChange={(e) => setEditorCatalyst(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white outline-none"
                >
                  <option value="None (Uncatalyzed)">None (Uncatalyzed)</option>
                  <option value="Concentrated H2SO4 (Acid Catalysis)">Acid (H2SO4)</option>
                  <option value="Sodium Ethoxide (Strong Base)">Base (Alkoxide / OH-)</option>
                  <option value="Palladium on Carbon / Pd-C">Palladium on Carbon (Pd/C)</option>
                  <option value="AlCl3 (Lewis Acid)">AlCl3 (Lewis Acid)</option>
                  <option value="UV Photochemical (hv light)">UV Light (hv)</option>
                  <option value="Biocatalytic Enzyme">Enzyme Biocatalyst</option>
                </select>
              </div>

            </div>

            {/* Run Matrix Button */}
            <button
              onClick={handleRunAllPathways}
              disabled={loadingEditor}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider font-mono transition-all cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
            >
              {loadingEditor ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap size={14} className="fill-white" />
              )}
              Run Every Possible Reaction (Internet Data / AI Grounding) →
            </button>
          </div>
        )}
      </div>

      {/* ERROR DISPLAY */}
      {(predictError || editorError) && (
        <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-4 flex gap-3 text-rose-200 text-xs font-mono">
          <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Reaction Simulation Notice</h4>
            <p className="mt-1 opacity-90">{predictError || editorError}</p>
          </div>
        </div>
      )}

      {/* LOADING SPINNER */}
      {(loadingPredict || loadingEditor) && (
        <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-12 text-center space-y-3 font-mono">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-white">Simulating Reaction Chemistry & Collision Energetics...</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Querying real-world thermodynamic databases, balancing orbital electron shifts, and computing competitive pathways.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1 RESULT: UNIVERSAL PREDICTOR CARD */}
      {/* ========================================================================= */}
      {activeMode === 'predictor' && predictResult && !loadingPredict && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Default Assumptions Banner */}
          {predictResult.conditionsUsed?.isDefaultAssumption && (
            <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded-xl text-amber-200 text-xs font-mono flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-400/50 text-[10px] font-bold shrink-0">
                DEFAULT ASSUMPTION
              </span>
              <span>
                {predictResult.conditionsUsed.defaultAssumptionsSummary || "Conditions not provided. Using default standard assumptions: 25 °C, 1 atm, standard ambient aqueous medium."}
              </span>
            </div>
          )}

          {/* Condition Dependent Reaction Alternatives */}
          {predictResult.conditionDependent && (
            <div className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-2xl space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <AlertCircle size={16} className="text-purple-400 shrink-0" />
                <span>Product prediction depends on reaction conditions!</span>
              </div>
              <p className="text-slate-300 text-xs font-sans">
                Operating parameters such as temperature, solvent, or catalyst divert this reaction between different distinct chemical pathways:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {predictResult.alternativePathways?.map((path, pIdx) => (
                  <div key={pIdx} className="p-3.5 rounded-xl bg-black/40 border border-purple-500/30 space-y-1.5">
                    <div className="text-[10px] text-purple-400 font-bold uppercase">{path.condition}</div>
                    <div className="text-cyan-300 font-bold text-sm">{path.equation}</div>
                    <div className="text-emerald-300 text-xs font-bold">→ Products: {path.products}</div>
                    <div className="text-slate-400 text-[11px] leading-relaxed font-sans">{path.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Balanced Reaction Card */}
          <div className="bg-gradient-to-r from-cyan-950/30 via-[#111318] to-purple-950/20 border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase">
                  {predictResult.reactionType}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
                  PREDICTED
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                predictResult.thermalType === 'Exothermic' 
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/30' 
                  : 'bg-sky-950/40 text-sky-300 border-sky-500/30'
              }`}>
                {predictResult.thermalType} Reaction (ΔH: {predictResult.energyChange})
              </span>
            </div>

            {/* Conditions Applied Bar */}
            {predictResult.conditionsUsed && (
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl font-mono text-[11px] flex flex-wrap gap-x-4 gap-y-1 text-slate-400">
                <span className="text-slate-500 uppercase font-bold text-[10px] block w-full mb-0.5">Conditions Applied:</span>
                <span>Temp: <strong className="text-cyan-300">{predictResult.conditionsUsed.temperature}</strong></span>
                <span>Pressure: <strong className="text-cyan-300">{predictResult.conditionsUsed.pressure}</strong></span>
                <span>Solvent: <strong className="text-cyan-300">{predictResult.conditionsUsed.solvent}</strong></span>
                <span>Catalyst: <strong className="text-cyan-300">{predictResult.conditionsUsed.catalyst}</strong></span>
                <span>Atmosphere: <strong className="text-cyan-300">{predictResult.conditionsUsed.atmosphere}</strong></span>
              </div>
            )}

            {/* Glowing Equation Display */}
            <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/30 text-center font-mono select-all shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]">
              <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold tracking-wider">Stoichiometrically Balanced Equation</span>
              <h2 className="text-lg sm:text-2xl font-black text-cyan-300 tracking-tight leading-relaxed">
                {predictResult.balancedEquation}
              </h2>
            </div>

            {/* Stoichiometric Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Reactants */}
              <div className="p-3.5 bg-black/30 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Reactants Consumed:</span>
                <div className="space-y-1.5 font-mono text-xs">
                  {predictResult.equationBalanced?.reactants?.map((r, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-white font-bold">{r.coefficient} × {r.formula}</span>
                      <span className="text-slate-400 text-[11px]">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products */}
              <div className="p-3.5 bg-black/30 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Products Formed:</span>
                <div className="space-y-1.5 font-mono text-xs">
                  {predictResult.equationBalanced?.products?.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                      <span className="text-emerald-300 font-bold">{p.coefficient} × {p.formula}</span>
                      <span className="text-slate-300 text-[11px]">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Mechanistic Insights */}
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2 text-xs font-sans leading-relaxed">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                Chemical Insights & Mechanism:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {predictResult.keyInsights?.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 shrink-0 font-bold">→</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications & Uses */}
            {predictResult.uses && predictResult.uses.length > 0 && (
              <div className="p-3.5 bg-black/30 border border-slate-800 rounded-xl text-xs text-slate-400 font-sans leading-relaxed">
                <strong className="text-slate-300 font-mono text-[10px] uppercase block mb-1">Industrial & Biological Uses:</strong>
                <p>{predictResult.uses.join(' • ')}</p>
              </div>
            )}

            {/* Switch to Editor Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setEditorReactants(reactantsInput);
                  setActiveMode('editor');
                }}
                className="px-4 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/40 text-purple-300 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sliders size={13} /> Open in AI Prediction Editor to Run All Pathways →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2 RESULT: AI PREDICTION EDITOR COMPREHENSIVE MATRIX */}
      {/* ========================================================================= */}
      {activeMode === 'editor' && editorResult && !loadingEditor && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 1. PRIMARY / MAJOR REACTION PATHWAY */}
          <div className="bg-gradient-to-r from-purple-950/30 via-[#111318] to-cyan-950/30 border border-purple-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40 uppercase">
                  Primary Pathway: {editorResult.primaryPathway.reactionType}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Yield: {editorResult.primaryPathway.yieldPercentage}
                </span>
              </div>

              <span className="text-xs font-mono text-slate-400">
                ΔG: <strong className="text-emerald-400">{editorResult.primaryPathway.gibbsFreeEnergy}</strong> • ΔH: <strong className="text-rose-400">{editorResult.primaryPathway.energyChange}</strong>
              </span>
            </div>

            {/* Major Equation */}
            <div className="p-4 rounded-xl bg-black/60 border border-purple-500/40 text-center font-mono select-all">
              <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold">Major Desired Reaction Equation</span>
              <h3 className="text-lg sm:text-2xl font-black text-purple-200">
                {editorResult.primaryPathway.balancedEquation}
              </h3>
            </div>

            {/* Primary Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg">
                <span className="text-[9.5px] text-slate-500 block uppercase">Activation Energy</span>
                <span className="font-bold text-white">{editorResult.primaryPathway.activationEnergy}</span>
              </div>
              <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg">
                <span className="text-[9.5px] text-slate-500 block uppercase">Rate Law</span>
                <span className="font-bold text-cyan-300">{editorResult.primaryPathway.rateLaw}</span>
              </div>
              <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg">
                <span className="text-[9.5px] text-slate-500 block uppercase">Mechanism Type</span>
                <span className="font-bold text-purple-300">{editorResult.primaryPathway.mechanismType}</span>
              </div>
              <div className="p-2.5 bg-black/40 border border-slate-800 rounded-lg">
                <span className="text-[9.5px] text-slate-500 block uppercase">Thermal State</span>
                <span className="font-bold text-amber-300">{editorResult.primaryPathway.thermalType}</span>
              </div>
            </div>
          </div>

          {/* 2. COMPETITIVE & SIDE REACTION PATHWAYS */}
          {editorResult.competitivePathways && editorResult.competitivePathways.length > 0 && (
            <div className="bg-[#111318] border border-amber-500/25 rounded-2xl p-6 shadow-sm space-y-4 font-mono">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Competitive & Side Reaction Pathways (Taking Data from Internet)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {editorResult.competitivePathways.map((path, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="text-xs font-bold text-amber-300">{path.pathwayName}</h5>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-200">
                        {path.selectivity}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800 text-xs text-slate-200">
                      {path.balancedEquation}
                    </div>

                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      <strong>When Favored:</strong> {path.conditionsFavored}
                    </p>
                    <p className="text-[10px] text-rose-300/80 font-sans leading-relaxed">
                      <strong>Byproduct Risk:</strong> {path.byproductHazards}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. STEP-BY-STEP REACTION MECHANISM */}
          {editorResult.mechanismSteps && editorResult.mechanismSteps.length > 0 && (
            <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 space-y-4 font-mono">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-cyan-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Step-by-Step Electron Mechanism & Intermediates
                </h4>
              </div>

              <div className="space-y-3">
                {editorResult.mechanismSteps.map((step) => (
                  <div key={step.stepNumber} className="flex gap-3 p-3.5 bg-black/30 border border-slate-800 rounded-xl">
                    <span className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center justify-center text-xs font-black shrink-0">
                      {step.stepNumber}
                    </span>
                    <div className="space-y-1 text-xs">
                      <h5 className="font-bold text-white">{step.title}</h5>
                      <p className="text-slate-300 font-sans leading-relaxed">{step.description}</p>
                      <div className="flex flex-wrap gap-2 text-[10.5px] pt-1 text-cyan-200">
                        <span>Electron Shift: <strong className="text-cyan-300">{step.electronMovement}</strong></span>
                        <span className="text-slate-600">•</span>
                        <span>Intermediate: <strong className="text-purple-300">{step.intermediateSpecies}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. THERMAL DECOMPOSITION & LABORATORY SAFETY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Decomposition */}
            {editorResult.decompositionPathway && (
              <div className="p-5 bg-[#111318] border border-rose-500/30 rounded-2xl space-y-2">
                <span className="text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1">
                  <Flame size={13} /> Thermal Decomposition & Pyrolysis:
                </span>
                <p className="text-white font-bold">{editorResult.decompositionPathway.balancedEquation}</p>
                <p className="text-slate-400 text-[11px] font-sans">
                  <strong>Threshold:</strong> {editorResult.decompositionPathway.tempThreshold}
                </p>
                <p className="text-rose-300 text-[11px] font-sans">
                  <strong>Hazard:</strong> {editorResult.decompositionPathway.hazardWarning}
                </p>
              </div>
            )}

            {/* Laboratory Safety */}
            {editorResult.laboratorySafety && (
              <div className="p-5 bg-[#111318] border border-slate-800 rounded-2xl space-y-2 font-sans">
                <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold flex items-center gap-1">
                  <ShieldAlert size={13} /> Lab Safety & Quenching Matrix:
                </span>
                <p className="text-xs text-slate-300">
                  <strong>Exotherm Risk:</strong> {editorResult.laboratorySafety.exothermHazard}
                </p>
                <p className="text-xs text-slate-300">
                  <strong>Quenching Protocol:</strong> {editorResult.laboratorySafety.quenchingProtocol}
                </p>
                <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                  {editorResult.laboratorySafety.ppeRequired?.map((ppe, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300">
                      ✓ {ppe}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. INTERNET LITERATURE GROUNDING */}
          {editorResult.internetGroundingData && (
            <div className="p-4 bg-black/40 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-cyan-400 uppercase font-bold text-[10px] block">Literature Sources & Grounding:</span>
                <span>{editorResult.internetGroundingData.literatureSources?.join(' • ')}</span>
              </div>
              <span className="text-[10px] text-slate-500">{editorResult.internetGroundingData.industrialRelevance}</span>
            </div>
          )}

        </motion.div>
      )}

    </div>
  );
}
