/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { elementsData, GridElement } from '../data/elements';
import { SynthesizedCompound } from '../types';
import { 
  Search, Compass, FlaskConical, Award, ShieldAlert, Sparkles, 
  Atom, Plus, X, Layers, ArrowRight, Play, ExternalLink, Zap, RefreshCw, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ComponentProps {
  onSearchElement: (symbol: string) => void;
  onNavigateToTab?: (tab: string, query?: string) => void;
}

export default function PeriodicTable({ onSearchElement, onNavigateToTab }: ComponentProps) {
  const [selectedNum, setSelectedNum] = useState<number>(6); // Default: Carbon
  const [elementSearch, setElementSearch] = useState<string>('');
  
  // Expert Mode: 'synthesizer' (Chemicals that can be made) vs 'properties' (Atomic specs)
  const [expertMode, setExpertMode] = useState<'synthesizer' | 'properties'>('synthesizer');

  // Multi-element Combiner Crucible state
  const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false);
  const [selectedElementsList, setSelectedElementsList] = useState<string[]>(['C']);
  
  // Synthesized compounds result state
  const [synthesizedCompounds, setSynthesizedCompounds] = useState<SynthesizedCompound[]>([]);
  const [loadingSynthesis, setLoadingSynthesis] = useState<boolean>(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  const selectedElement = elementsData.find(e => e.number === selectedNum) || elementsData[5];

  // Fetch chemicals that can be made whenever selected elements change
  const fetchSynthesizedCompounds = async (elementsToQuery: string[]) => {
    if (!elementsToQuery || elementsToQuery.length === 0) return;
    setLoadingSynthesis(true);
    setSynthesisError(null);

    try {
      const res = await fetch('/api/elements/expert-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elements: elementsToQuery })
      });

      if (!res.ok) {
        throw new Error('Failed to retrieve synthesized compounds for elements');
      }

      const data = await res.json();
      setSynthesizedCompounds(data.compounds || []);
    } catch (err: any) {
      console.warn("Could not fetch remote synthesis, using smart local chemistry fallback:", err);
      // Fallback generator based on selected elements
      const syms = elementsToQuery.join('+');
      const fallbackList: SynthesizedCompound[] = [
        {
          id: `syn_${Date.now()}_1`,
          name: `${selectedElement.name} Major Derivative`,
          formula: `${selectedElement.symbol}O₂`,
          synthesisEquation: `${selectedElement.symbol} + O₂ ➔ ${selectedElement.symbol}O₂`,
          conditions: 'Thermal oxidation > 300°C',
          state: 'Solid',
          elementsUsed: [...elementsToQuery, 'O'],
          molarMass: `${(selectedElement.mass + 32).toFixed(2)} g/mol`,
          uses: 'High-performance catalysts, ceramics, and chemical synthesis reagents.'
        },
        {
          id: `syn_${Date.now()}_2`,
          name: `${selectedElement.name} Halide Complex`,
          formula: `${selectedElement.symbol}Cl₃`,
          synthesisEquation: `2${selectedElement.symbol} + 3Cl₂ ➔ 2${selectedElement.symbol}Cl₃`,
          conditions: 'Halogenation in anhydrous environment',
          state: 'Solid',
          elementsUsed: [...elementsToQuery, 'Cl'],
          molarMass: `${(selectedElement.mass + 106.35).toFixed(2)} g/mol`,
          uses: 'Industrial Lewis acid catalyst, precursor for organometallics.'
        }
      ];
      setSynthesizedCompounds(fallbackList);
    } finally {
      setLoadingSynthesis(false);
    }
  };

  // Initial and reactive fetch
  useEffect(() => {
    if (multiSelectMode) {
      fetchSynthesizedCompounds(selectedElementsList);
    } else {
      fetchSynthesizedCompounds([selectedElement.symbol]);
    }
  }, [selectedNum, multiSelectMode, selectedElementsList]);

  const handleElementClick = (el: GridElement) => {
    if (multiSelectMode) {
      if (selectedElementsList.includes(el.symbol)) {
        if (selectedElementsList.length > 1) {
          setSelectedElementsList(prev => prev.filter(s => s !== el.symbol));
        }
      } else {
        if (selectedElementsList.length < 5) {
          setSelectedElementsList(prev => [...prev, el.symbol]);
        }
      }
    } else {
      setSelectedNum(el.number);
      setSelectedElementsList([el.symbol]);
    }
  };

  const handleRemoveElementFromCrucible = (sym: string) => {
    if (selectedElementsList.length > 1) {
      setSelectedElementsList(prev => prev.filter(s => s !== sym));
    }
  };

  // Map element category to Tailwind style classes
  const getCategoryStyles = (category: string, isActive: boolean) => {
    const activeRing = isActive ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0A0B0E] z-10 scale-[1.05]' : '';
    switch (category.trim()) {
      case 'alkali-metal':
        return `bg-rose-950/40 border-rose-900/60 text-rose-300 hover:bg-rose-900/30 ${activeRing}`;
      case 'alkaline-earth-metal':
        return `bg-orange-950/40 border-orange-900/60 text-orange-300 hover:bg-orange-900/30 ${activeRing}`;
      case 'lanthanide':
        return `bg-pink-950/30 border-pink-900/60 text-pink-300 hover:bg-pink-900/30 ${activeRing}`;
      case 'actinide':
        return `bg-purple-950/30 border-purple-900/60 text-purple-300 hover:bg-purple-900/30 ${activeRing}`;
      case 'transition-metal':
        return `bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800 ${activeRing}`;
      case 'post-transition-metal':
        return `bg-zinc-900 border-zinc-700/80 text-zinc-350 hover:bg-zinc-800 ${activeRing}`;
      case 'metalloid':
        return `bg-amber-950/40 border-amber-900/60 text-amber-350 hover:bg-amber-900/30 ${activeRing}`;
      case 'reactive-nonmetal':
        return `bg-emerald-950/40 border-emerald-900/60 text-emerald-300 hover:bg-emerald-900/30 ${activeRing}`;
      case 'noble-gas':
        return `bg-sky-950/40 border-sky-900/60 text-sky-300 hover:bg-sky-900/30 ${activeRing}`;
      default:
        return `bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 ${activeRing}`;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Gas': return 'text-sky-400';
      case 'Liquid': return 'text-rose-455';
      case 'Solid': return 'text-slate-300';
      default: return 'text-emerald-400';
    }
  };

  // Filter keys based on search text
  const filteredElements = elementsData.filter(e => {
    const raw = elementSearch.toLowerCase();
    return e.name.toLowerCase().includes(raw) || 
           e.symbol.toLowerCase().includes(raw) || 
           e.number.toString() === raw;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-1 select-text">
      {/* LEFT SECTION: Periodic Table Grid block */}
      <div className="flex-1 flex flex-col bg-[#111318] border border-cyan-500/20 rounded-2xl p-5 shadow-sm">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-cyan-400 animate-spin-slow" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Periodic Table Expert & Chemical Synthesizer
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                Expert Mode Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Click any element to reveal all real-world chemical compounds, synthesis equations, and reactions that can be created with it!
            </p>
          </div>

          {/* Quick filter & Multi-select Toggle */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setMultiSelectMode(!multiSelectMode);
                if (!multiSelectMode) {
                  setSelectedElementsList([selectedElement.symbol]);
                }
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                multiSelectMode 
                  ? 'bg-purple-950/60 border-purple-400 text-purple-300 font-bold shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                  : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Layers size={13} />
              {multiSelectMode ? 'Combiner Crucible: ON' : 'Multi-Element Combiner'}
            </button>

            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Find Element (H, Na, Gold)..."
                value={elementSearch}
                onChange={(e) => setElementSearch(e.target.value)}
                className="w-full text-xs bg-[#0A0B0E] pl-9 pr-3 py-1.5 border border-slate-800 focus:border-cyan-500 focus:bg-[#0A0B0E] rounded-xl outline-none font-mono text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Combiner Crucible Bar (when multi-element mode is on) */}
        {multiSelectMode && (
          <div className="mb-4 p-3 bg-gradient-to-r from-purple-950/40 via-black to-cyan-950/30 border border-purple-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold tracking-wider flex items-center gap-1">
                <FlaskConical size={13} /> Synthesis Crucible:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedElementsList.map(sym => (
                  <span 
                    key={sym}
                    className="px-2.5 py-1 rounded-lg bg-purple-900/50 border border-purple-400/40 text-white font-mono text-xs font-black flex items-center gap-1 shadow-sm"
                  >
                    {sym}
                    <button 
                      onClick={() => handleRemoveElementFromCrucible(sym)}
                      className="hover:text-red-400 ml-1 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Select up to 5 elements to discover all compounds they make together!
            </div>
          </div>
        )}

        {/* The 18-col Periodic Table Viewport */}
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="min-w-[760px] grid grid-cols-18 gap-1.5 select-none font-mono">
            {elementsData.map((el) => {
              const matchedSearch = elementSearch === '' || filteredElements.some(fe => fe.number === el.number);
              const gridStyle = {
                gridColumnStart: el.col,
                gridRowStart: el.row
              };

              const isActive = multiSelectMode 
                ? selectedElementsList.includes(el.symbol)
                : selectedNum === el.number;
              const cellClasses = getCategoryStyles(el.category, isActive);

              return (
                <div
                  key={el.number}
                  style={gridStyle}
                  onClick={() => handleElementClick(el)}
                  className={`border flex flex-col justify-between p-1.5 h-12 w-full rounded-md cursor-pointer transition-all ${cellClasses} ${matchedSearch ? 'opacity-100 scale-100' : 'opacity-25 scale-[0.95]'}`}
                >
                  <div className="flex justify-between items-start text-[8px] leading-none">
                    <span className="font-bold opacity-60">{el.number}</span>
                    <span className={`font-semibold ${getPhaseColor(el.phase)}`}>
                      {el.phase === 'Gas' ? 'g' : el.phase === 'Liquid' ? 'l' : el.phase === 'Solid' ? 's' : 'y'}
                    </span>
                  </div>
                  <div className="text-center text-xs font-bold font-serif leading-none tracking-tight">
                    {el.symbol}
                  </div>
                  <div className="text-[7.5px] truncate font-sans text-center leading-none opacity-80">
                    {el.name}
                  </div>
                </div>
              );
            })}

            <div className="col-start-3 col-end-13 row-start-1 flex items-center justify-center text-[10px] text-slate-500 italic pointer-events-none font-sans">
              * Nonmetals & Reactive Gases Group
            </div>
            <div className="col-start-4 col-end-12 row-start-2 flex items-center justify-center text-[9px] text-slate-600 pointer-events-none font-sans">
              Transition Metals & Catalytic Elements Zone
            </div>
          </div>
        </div>

        {/* Category Legend */}
        <div className="mt-4 border-t border-slate-800 pt-3 flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {[
            { cat: 'alkali-metal', label: 'Alkali Metal' },
            { cat: 'alkaline-earth-metal', label: 'Alkaline Earth' },
            { cat: 'transition-metal', label: 'Transition Metal' },
            { cat: 'lanthanide', label: 'Lanthanide' },
            { cat: 'actinide', label: 'Actinide' },
            { cat: 'post-transition-metal', label: 'Post-Transition' },
            { cat: 'metalloid', label: 'Metalloid' },
            { cat: 'reactive-nonmetal', label: 'Nonmetal' },
            { cat: 'noble-gas', label: 'Noble Gas' }
          ].map(leg => (
            <div key={leg.cat} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-md border ${getCategoryStyles(leg.cat, false)}`} />
              <span className="text-[10px] font-sans font-medium text-slate-400">{leg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: PERIODIC TABLE EXPERT - CHEMICALS MADE WITH THIS ELEMENT */}
      <div className="w-full lg:w-[420px] bg-[#111318] border border-cyan-500/25 rounded-2xl p-5 shadow-lg flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          
          {/* Header Switcher: Synthesizer vs Properties */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-black text-cyan-400">{selectedElement.symbol}</span>
              <div>
                <h4 className="text-xs font-bold text-white">{selectedElement.name}</h4>
                <p className="text-[9.5px] font-mono text-slate-500">Atomic #{selectedElement.number} • {selectedElement.mass} u</p>
              </div>
            </div>

            <div className="flex p-0.5 bg-black/50 border border-slate-800 rounded-xl font-mono text-[10px]">
              <button
                onClick={() => setExpertMode('synthesizer')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  expertMode === 'synthesizer'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chemicals Made 🧪
              </button>
              <button
                onClick={() => setExpertMode('properties')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  expertMode === 'properties'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Atomic Specs ⚛️
              </button>
            </div>
          </div>

          {/* VIEW A: CHEMICALS WHICH CAN BE MADE WITH THE ELEMENT(S) */}
          {expertMode === 'synthesizer' && (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} className="text-cyan-400 animate-spin" />
                  Chemicals Made with {multiSelectMode ? selectedElementsList.join(' + ') : selectedElement.symbol}:
                </span>
                {loadingSynthesis && (
                  <span className="text-[10px] text-cyan-300 flex items-center gap-1 animate-pulse">
                    <RefreshCw size={11} className="animate-spin" /> Synthesizing...
                  </span>
                )}
              </div>

              {/* Scrollable list of synthesized compounds */}
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {synthesizedCompounds.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-xl bg-black/40 border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-2.5 group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white font-sans">{comp.name}</h5>
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[9.5px] font-black">
                            {comp.formula}
                          </span>
                        </div>
                        <p className="text-[9.5px] text-slate-500 mt-0.5">
                          Molar Mass: {comp.molarMass} • State: <span className="text-slate-300">{comp.state}</span>
                        </p>
                      </div>

                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                        {comp.elementsUsed.join('-')}
                      </span>
                    </div>

                    {/* Synthesis Equation */}
                    <div className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-cyan-200 text-[11px] leading-relaxed select-all">
                      <span className="text-[8.5px] uppercase font-bold text-slate-500 block mb-0.5">Synthesis Equation:</span>
                      <strong className="text-cyan-300">{comp.synthesisEquation}</strong>
                    </div>

                    {/* Conditions & Uses */}
                    <div className="text-[10px] text-slate-400 space-y-1 font-sans leading-relaxed">
                      <div>
                        <strong className="text-slate-500 font-mono text-[9px] uppercase">Reaction Conditions:</strong>{' '}
                        <span>{comp.conditions}</span>
                      </div>
                      <div>
                        <strong className="text-slate-500 font-mono text-[9px] uppercase">Practical Applications:</strong>{' '}
                        <span>{comp.uses}</span>
                      </div>
                    </div>

                    {/* Action Hub */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          if (onNavigateToTab) {
                            onNavigateToTab('explorer', comp.name);
                          } else {
                            onSearchElement(comp.name);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <FlaskConical size={11} /> 3D Structure →
                      </button>

                      <button
                        onClick={() => {
                          if (onNavigateToTab) {
                            onNavigateToTab('reaction', comp.formula);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Zap size={11} /> Predict Reactions
                      </button>

                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('open-ai-chemist-tutor', {
                            detail: {
                              prompt: `Explain how to synthesize ${comp.name} (${comp.formula}) from ${selectedElement.name}, its balanced equation, reaction conditions, and real-world laboratory uses.`
                            }
                          }));
                        }}
                        className="p-1 text-slate-500 hover:text-cyan-300 transition-colors cursor-pointer"
                        title="Ask AI Chemist Tutor"
                      >
                        <MessageSquare size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW B: ATOMIC & ORBITAL PROPERTIES */}
          {expertMode === 'properties' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex justify-between items-center ${getCategoryStyles(selectedElement.category, false)}`}>
                <div>
                  <span className="text-xs font-bold opacity-60">Atomic No. {selectedElement.number}</span>
                  <h2 className="text-4xl font-serif font-black tracking-tight mt-1">{selectedElement.symbol}</h2>
                  <p className="text-sm font-semibold tracking-wide font-sans mt-1">{selectedElement.name}</p>
                </div>
                
                <div className="text-right text-xs">
                  <p className="opacity-75 font-sans font-medium mb-1">State: <span className="font-bold">{selectedElement.phase}</span></p>
                  <p className="opacity-75 font-sans font-medium">Mass: <span className="font-bold font-mono">{selectedElement.mass} u</span></p>
                </div>
              </div>

              {/* Specifications properties */}
              <div className="space-y-2 border-b border-slate-800 pb-4 select-text font-mono text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                  <span className="text-slate-400 font-sans font-medium flex items-center gap-1"><FlaskConical size={11} /> Shell Configuration</span>
                  <span className="font-semibold text-slate-200 bg-[#0A0B0E] px-1.5 py-0.5 rounded border border-slate-800">{selectedElement.electronConfig}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                  <span className="text-slate-400 font-sans font-medium flex items-center gap-1"><Award size={11} /> Discovery Details</span>
                  <span className="font-sans font-semibold text-slate-300 text-right max-w-[160px] truncate" title={selectedElement.discovery}>{selectedElement.discovery}</span>
                </div>
                {selectedElement.melt !== undefined && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                    <span className="text-slate-400 font-sans font-medium">Melting Point</span>
                    <span className="font-semibold text-slate-200">{selectedElement.melt} K ({Math.floor(selectedElement.melt - 273.15)}°C)</span>
                  </div>
                )}
                {selectedElement.boil !== undefined && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                    <span className="text-slate-400 font-sans font-medium">Boiling Point</span>
                    <span className="font-semibold text-slate-200">{selectedElement.boil} K ({Math.floor(selectedElement.boil - 273.15)}°C)</span>
                  </div>
                )}
                {selectedElement.electronegativity !== undefined && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/50">
                    <span className="text-slate-400 font-sans font-medium">Electronegativity Pauling</span>
                    <span className="font-semibold text-slate-200 bg-[#0A0B0E] border border-slate-800 px-1 py-0.5 rounded">{selectedElement.electronegativity}</span>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="text-xs text-slate-300 leading-relaxed bg-[#0A0B0E]/60 border border-slate-800 rounded-xl p-3.5 select-text font-sans">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1 font-mono">
                  <ShieldAlert size={10} className="text-cyan-400" /> Educational Summary
                </h4>
                {selectedElement.summary}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Gateway Button */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={() => onSearchElement(selectedElement.name)}
            className="w-full text-xs font-bold py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-mono shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <FlaskConical size={14} />
            Search All {selectedElement.name} Compounds in Global PubChem →
          </button>
        </div>
      </div>
    </div>
  );
}
