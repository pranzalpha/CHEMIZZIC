/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ReactionDetail } from '../types';
import { Play, Sparkles, AlertCircle, History, RefreshCcw, Flame, ThermometerSun, Zap, ArrowRight, HelpCircle } from 'lucide-react';

export default function ReactionPredictorTab() {
  const [reactantsInput, setReactantsInput] = useState<string>('CH4 + O2');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ReactionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Predefined reaction examples
  const examples = [
    { label: "Methane Combustion", text: "CH4 + O2" },
    { label: "Neutralization", text: "HCl + NaOH" },
    { label: "Haber Process", text: "N2 + H2" },
    { label: "Photosynthesis", text: "CO2 + H2O" },
    { label: "Rust Formation", text: "Fe + O2" }
  ];

  const handlePredict = async (inputStr: string) => {
    const reactants = (inputStr || '').trim();
    if (!reactants) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/reaction/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactants })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to solve chemical equation.");
      }

      const data: ReactionDetail = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected network error occurred predicting this reaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input bar and example nodes */}
      <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConicalIcon className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Stoichiometric Reaction Predictor</h3>
        </div>
        
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Enter reactants (e.g. formulas separated by a "+" sign) to predict the resulting chemical products, balance the chemical equation, and determine heat flow energetics.
        </p>

        {/* Form elements */}
        <form onSubmit={(e) => { e.preventDefault(); handlePredict(reactantsInput); }} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={reactantsInput}
            onChange={(e) => setReactantsInput(e.target.value)}
            placeholder="Type reactants... (e.g. HCl + NaOH, Propane + Oxygen)"
            className="flex-1 text-xs bg-[#0A0B0E] px-4 py-2.5 border border-slate-800 focus:border-cyan-500 focus:bg-[#0A0B0E] rounded-lg outline-none font-mono text-slate-200 font-semibold"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="w-4.5 h-4.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <Play size={13} className="fill-white" />
            )}
            Predict Products
          </button>
        </form>

        {/* Examples chips list bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Templates:</span>
          {examples.map((item) => (
            <button
              key={item.text}
              type="button"
              onClick={() => { setReactantsInput(item.text); handlePredict(item.text); }}
              className="px-2.5 py-1 text-[10px] bg-[#0A0B0E] border border-slate-800 hover:bg-cyan-950/40 hover:border-cyan-800 hover:text-cyan-400 text-slate-400 rounded-md transition-all font-sans font-medium cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 text-rose-800 text-xs">
          <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Equation Unbalanced or Solvability Error</h4>
            <p className="mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* LOADING placeholder screen */}
      {loading && (
        <div className="bg-[#111318] border border-slate-800 rounded-xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative mb-4 flex items-center justify-center">
            <span className="w-12 h-12 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin absolute" />
            <Sparkles size={20} className="text-cyan-400 animate-pulse" />
          </div>
          <h4 className="text-xs font-semibold text-slate-200 animate-pulse">Running chemical balance calculations...</h4>
          <p className="text-[10px] text-slate-400 mt-1 max-w-sm">
            Gemini is currently balancing stoichiometry structures, validating enthalpy vectors, and verifying mass conservation scales.
          </p>
        </div>
      )}

      {/* RESULTS GRID */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-text">
          
          {/* Reaction Equation Flow Block */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Display Equation summary banner */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/30 border border-cyan-900/50 rounded-full mb-3">
                Balanced Stoichiometric System
              </span>

              <div className="p-4 bg-[#0A0B0E] border border-slate-850 rounded-xl text-center select-all group relative">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">Equation (Shorthand)</p>
                <h2 className="text-xl sm:text-2xl font-serif font-semibold text-white tracking-tight leading-relaxed select-text font-mono" dangerouslySetInnerHTML={{ __html: formatSubscripts(result.balancedEquation) }} />
              </div>

              {/* Grid with side-by-side components reactants and products */}
              <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 mt-6">
                
                {/* Reactants list block */}
                <div className="md:col-span-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block mb-1 font-sans">Reactants</span>
                  {result.equationBalanced.reactants.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#0A0B0E]/60 hover:bg-[#0A0B0E] border border-slate-850 rounded-lg p-2 px-3 transition-colors">
                      <span className="font-mono text-xs font-bold text-slate-300 bg-[#111318] border border-slate-800 rounded px-1.5 py-0.5">
                        {item.coefficient} ×
                      </span>
                      <span className="font-mono text-xs font-bold text-cyan-400 select-all" dangerouslySetInnerHTML={{ __html: formatSubscripts(item.formula) }} />
                      <span className="text-xs text-slate-400 font-sans font-medium truncate max-w-[140px] text-right" title={item.name}>{item.name}</span>
                    </div>
                  ))}
                </div>

                {/* React icon arrow arrow right divider */}
                <div className="md:col-span-1 flex justify-center text-slate-500 font-bold text-lg select-none">
                  <ArrowRight size={20} className="text-cyan-400 transform rotate-90 md:rotate-0" />
                </div>

                {/* Products list block */}
                <div className="md:col-span-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block mb-1 font-sans">Products</span>
                  {result.equationBalanced.products.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-cyan-950/10 hover:bg-cyan-950/30 border border-cyan-900/40 rounded-lg p-2 px-3 transition-colors">
                      <span className="font-mono text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-900/60 rounded px-1.5 py-0.5">
                        {item.coefficient} ×
                      </span>
                      <span className="font-mono text-xs font-black text-cyan-400 select-all" dangerouslySetInnerHTML={{ __html: formatSubscripts(item.formula) }} />
                      <span className="text-xs text-slate-400 font-sans font-medium truncate max-w-[140px] text-right" title={item.name}>{item.name}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Reaction insights block from Gemini */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-850 pb-2 mb-3 font-sans">Reaction Mechanisms</h4>
              <div className="grid grid-cols-1 gap-2">
                {result.keyInsights.map((insight, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-300 bg-[#0A0B0E]/60 p-2.5 rounded-lg border border-slate-850">
                    <span className="w-5 h-5 bg-cyan-950/40 border border-cyan-900/60 rounded-full flex items-center justify-center text-cyan-400 font-bold shrink-0 text-[10px]">{idx + 1}</span>
                    <p className="flex-1 leading-relaxed font-sans font-medium">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Thermal Energetics Sidebar Panel */}
          <div className="space-y-6">
            
            {/* Thermochemistry gauge card */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-855 pb-2">Thermochemistry & Energetics</h4>
                
                {/* Big Thermal state block */}
                <div className={`p-4 rounded-xl border flex items-center gap-3.5 mb-4 ${
                  result.thermalType === 'Exothermic'
                    ? 'bg-orange-950/20 border-orange-900/60 text-orange-200'
                    : result.thermalType === 'Endothermic'
                      ? 'bg-sky-950/20 border-sky-900/60 text-sky-200'
                      : 'bg-slate-900 border-slate-800 text-slate-250'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    result.thermalType === 'Exothermic' ? 'bg-orange-600 text-white' : 'bg-sky-500 text-white'
                  }`}>
                    {result.thermalType === 'Exothermic' ? <Flame size={18} /> : <ThermometerSun size={18} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-none">Energetic Flow</span>
                    <h3 className="text-sm font-bold tracking-tight mt-0.5">{result.thermalType} Reaction</h3>
                  </div>
                </div>

                {/* Energy parameters lists */}
                <div className="space-y-3 font-sans mt-5 leading-normal text-slate-300">
                  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-850">
                    <span className="text-slate-400 font-medium">Standard enthalpy dH</span>
                    <span className="font-mono font-bold text-slate-200 bg-[#0A0B0E] px-2 py-0.5 border border-slate-800 rounded">{result.energyChange}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-850">
                    <span className="text-slate-400 font-medium">Activation Energy</span>
                    <span className="font-semibold text-slate-200 bg-[#0A0B0E] px-2 py-0.5 border border-slate-800 rounded">{result.activationEnergy}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-850">
                    <span className="text-slate-400 font-medium">Catalysts / Promoters</span>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {result.catalysts.length > 0 && result.catalysts[0] !== 'None' ? (
                        result.catalysts.map((cat, i) => (
                          <span key={i} className="text-[9px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-900/60 px-1.5 py-0.5 rounded">{cat}</span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">No external catalyst needed</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-slate-400 font-medium font-sans">Reaction Classification</span>
                    <span className="font-bold text-cyan-400">{result.reactionType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Practical applications card */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-550 uppercase tracking-widest border-b border-slate-850 pb-2 mb-3">Applications & Uses</h4>
              <div className="flex flex-col gap-2 font-sans select-text text-slate-300 text-xs">
                {result.uses.map((use, i) => (
                  <div key={i} className="flex gap-2 items-start bg-[#0A0B0E]/60 p-2.5 rounded-lg border border-slate-850">
                    <Zap size={11} className="text-cyan-400 shrink-0 mt-0.5" />
                    <p className="font-medium text-slate-300 leading-normal">{use}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Utility icon
function FlaskConicalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 2v7.5" />
      <path d="M14 2v7.5" />
      <path d="M8.5 2h7" />
      <path d="m14 9.5 5.5 10c1.2 2.1-.3 4.5-2.7 4.5H7.2c-2.4 0-3.9-2.4-2.7-4.5l5.5-10" />
      <path d="M6 17c1.3.8 2.6.4 4 0s2.7-.8 4 0l1 .5" />
    </svg>
  );
}

// Simple subscript mapper HTML utility (e.g. converting CO2 to CO<sub>2</sub>)
function formatSubscripts(eq: string) {
  if (!eq) return '';
  return eq.replace(/([A-Za-z])(\d+)/g, '$1<sub>$2</sub>');
}
