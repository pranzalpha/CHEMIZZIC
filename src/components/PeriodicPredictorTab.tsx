/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Periodic Reaction & Trends Predictor Tab
 * Interactively select Element A + Reagent/Element B to predict products,
 * view balanced equations, and understand periodic trend mechanisms.
 */

import React, { useState } from 'react';
import { 
  Atom, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  BookOpen,
  Info,
  ShieldCheck,
  Thermometer,
  RotateCcw
} from 'lucide-react';
import { predictPeriodicReaction, COMMON_PERIODIC_REAGENTS } from '../services/periodicReactionEngine';
import { PeriodicReactionResult } from '../types';

interface ElementChoice {
  symbol: string;
  name: string;
  group: string;
  atomicNumber: number;
  category: 'alkali' | 'alkaline-earth' | 'transition' | 'non-metal' | 'halogen' | 'metalloid';
}

const COMMON_ELEMENTS: ElementChoice[] = [
  { symbol: 'Li', name: 'Lithium', group: 'Group 1', atomicNumber: 3, category: 'alkali' },
  { symbol: 'Na', name: 'Sodium', group: 'Group 1', atomicNumber: 11, category: 'alkali' },
  { symbol: 'K', name: 'Potassium', group: 'Group 1', atomicNumber: 19, category: 'alkali' },
  { symbol: 'Mg', name: 'Magnesium', group: 'Group 2', atomicNumber: 12, category: 'alkaline-earth' },
  { symbol: 'Ca', name: 'Calcium', group: 'Group 2', atomicNumber: 20, category: 'alkaline-earth' },
  { symbol: 'Ba', name: 'Barium', group: 'Group 2', atomicNumber: 56, category: 'alkaline-earth' },
  { symbol: 'Fe', name: 'Iron', group: 'Group 8', atomicNumber: 26, category: 'transition' },
  { symbol: 'Cu', name: 'Copper', group: 'Group 11', atomicNumber: 29, category: 'transition' },
  { symbol: 'Zn', name: 'Zinc', group: 'Group 12', atomicNumber: 30, category: 'transition' },
  { symbol: 'Al', name: 'Aluminium', group: 'Group 13', atomicNumber: 13, category: 'transition' },
  { symbol: 'C', name: 'Carbon', group: 'Group 14', atomicNumber: 6, category: 'non-metal' },
  { symbol: 'N', name: 'Nitrogen', group: 'Group 15', atomicNumber: 7, category: 'non-metal' },
  { symbol: 'F', name: 'Fluorine', group: 'Group 17', atomicNumber: 9, category: 'halogen' },
  { symbol: 'Cl', name: 'Chlorine', group: 'Group 17', atomicNumber: 17, category: 'halogen' },
  { symbol: 'Br', name: 'Bromine', group: 'Group 17', atomicNumber: 35, category: 'halogen' },
  { symbol: 'I', name: 'Iodine', group: 'Group 17', atomicNumber: 53, category: 'halogen' },
];

export const PeriodicPredictorTab: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<string>('Na');
  const [selectedReagent, setSelectedReagent] = useState<string>('H₂O');
  const [customReagent, setCustomReagent] = useState<string>('');
  const [result, setResult] = useState<PeriodicReactionResult>(() => predictPeriodicReaction('Na', 'H₂O'));

  const handlePredict = (elem: string, reagent: string) => {
    setSelectedElement(elem);
    setSelectedReagent(reagent);
    const res = predictPeriodicReaction(elem, reagent);
    setResult(res);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReagent.trim()) return;
    handlePredict(selectedElement, customReagent.trim());
  };

  const PRESETS = [
    { el: 'Na', rg: 'H₂O', label: 'Na + H₂O (Violent Alkali)' },
    { el: 'Mg', rg: 'O₂', label: 'Mg + O₂ (Bright White Flame)' },
    { el: 'Fe', rg: 'O₂', label: 'Fe + O₂ (Rust / Combustion)' },
    { el: 'Cl', rg: 'Na', label: 'Cl₂ + Na (Table Salt Synthesis)' },
    { el: 'Ca', rg: 'H₂O', label: 'Ca + H₂O (Alkaline Earth)' },
    { el: 'Zn', rg: 'HCl', label: 'Zn + HCl (Hydrogen Evolution)' },
    { el: 'Cu', rg: 'HNO3', label: 'Cu + HNO₃ (Redox Acid Attack)' }
  ];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'alkali': return 'border-amber-500/50 text-amber-300 bg-amber-950/20 hover:bg-amber-900/30';
      case 'alkaline-earth': return 'border-emerald-500/50 text-emerald-300 bg-emerald-950/20 hover:bg-emerald-900/30';
      case 'transition': return 'border-cyan-500/50 text-cyan-300 bg-cyan-950/20 hover:bg-cyan-900/30';
      case 'halogen': return 'border-purple-500/50 text-purple-300 bg-purple-950/20 hover:bg-purple-900/30';
      default: return 'border-blue-500/50 text-blue-300 bg-blue-950/20 hover:bg-blue-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg text-white shadow-lg shadow-cyan-500/20">
                <Atom className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Periodic Reaction & Trends Predictor</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl">
              Model elemental reactions grounded in fundamental periodic properties: electronegativity differentials, 
              ionization energies, standard reduction potentials, and activity series rules.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold rounded-full flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Thermodynamic Rules
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePredict(p.el, p.rg)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center space-x-1"
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Element & Reagent Selectors */}
        <div className="lg:col-span-5 space-y-6">
          {/* Element Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center">
                <Layers className="w-4 h-4 mr-2 text-cyan-400" />
                Step 1: Choose Element A
              </h3>
              <span className="text-xs text-cyan-400 font-mono">Selected: {selectedElement}</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
              {COMMON_ELEMENTS.map((el) => {
                const isSelected = selectedElement.toLowerCase() === el.symbol.toLowerCase();
                return (
                  <button
                    key={el.symbol}
                    onClick={() => handlePredict(el.symbol, selectedReagent)}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center relative ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                        : getCategoryColor(el.category)
                    }`}
                  >
                    <span className="text-xs text-slate-400 font-mono absolute top-1 left-2">{el.atomicNumber}</span>
                    <span className="text-lg font-bold font-mono tracking-tight mt-1">{el.symbol}</span>
                    <span className="text-[10px] text-slate-300 truncate w-full">{el.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reagent Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center">
                <Flame className="w-4 h-4 mr-2 text-amber-400" />
                Step 2: Choose Reactant B / Reagent
              </h3>
              <span className="text-xs text-amber-400 font-mono">Selected: {selectedReagent}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {COMMON_PERIODIC_REAGENTS.map((rg) => {
                const isSelected = selectedReagent.toLowerCase() === rg.formula.toLowerCase() || 
                                  selectedReagent.toLowerCase() === rg.id.toLowerCase();
                return (
                  <button
                    key={rg.id}
                    onClick={() => handlePredict(selectedElement, rg.formula)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 text-white shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs font-mono">{rg.formula}</div>
                      <div className="text-[11px] text-slate-400 truncate">{rg.name}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <form onSubmit={handleCustomSubmit} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Or custom reagent (e.g. Cl2, HCl, HNO3)"
                value={customReagent}
                onChange={(e) => setCustomReagent(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-medium rounded-lg transition"
              >
                Apply
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Prediction & Periodic Mechanism */}
        <div className="lg:col-span-7 space-y-6">
          {result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold font-mono text-cyan-400">{result.elementA}</span>
                  <span className="text-slate-500">+</span>
                  <span className="text-xl font-bold font-mono text-amber-400">{result.elementBOrReagent}</span>
                  <ArrowRight className="w-5 h-5 text-slate-400 mx-1" />
                  <span className="text-sm font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    Reaction Output
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold uppercase ${
                    result.verificationStatus === 'VERIFIED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : result.verificationStatus === 'CALCULATED'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {result.verificationStatus} ({result.confidence}%)
                  </span>
                </div>
              </div>

              {/* Balanced Chemical Equation Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Balanced Chemical Equation
                </span>
                <div className="text-lg md:text-xl font-mono font-bold text-white tracking-wide overflow-x-auto py-1">
                  {result.balancedEquation}
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="text-xs text-slate-400">Reaction Type:</span>
                  <span className="text-xs text-cyan-300 font-medium px-2 py-0.5 bg-cyan-950/50 rounded border border-cyan-800/40">
                    {result.reactionType}
                  </span>
                </div>
              </div>

              {/* Likely Products */}
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 block">
                  Predicted Products
                </span>
                <p className="text-slate-200 text-sm font-mono bg-slate-800/40 p-3 rounded-lg border border-slate-700/60">
                  {result.likelyProducts}
                </p>
              </div>

              {/* Oxidation States & Redox */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40">
                <div className="flex items-center space-x-2 mb-2 text-blue-300 font-semibold text-xs uppercase tracking-wide">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Oxidation States & Electron Flow</span>
                </div>
                <p className="text-sm font-mono text-blue-200 leading-relaxed">
                  {result.oxidationStates}
                </p>
              </div>

              {/* Periodic Trends In Action */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-cyan-300 font-semibold text-xs uppercase tracking-wide">
                  <Atom className="w-4 h-4 text-cyan-400" />
                  <span>Periodic Principles Governing This Reaction</span>
                </div>
                <div className="space-y-2">
                  {result.periodicTrends.map((trend, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{trend}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reactivity & Mechanistic Explanation */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs uppercase tracking-wide">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Mechanistic Explanation</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-lg border border-slate-800">
                  {result.reactivityExplanation}
                </p>
              </div>

              {/* Conditions & Reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 flex items-start space-x-2">
                  <Thermometer className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block font-medium">Optimal Conditions:</span>
                    <span className="text-slate-200">{result.conditions}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block font-medium">Scientific Reference:</span>
                    <span className="text-slate-200">{result.source}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
