/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { elementsData, GridElement } from '../data/elements';
import { Search, Compass, FlaskConical, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface ComponentProps {
  onSearchElement: (symbol: string) => void;
}

export default function PeriodicTable({ onSearchElement }: ComponentProps) {
  const [selectedNum, setSelectedNum] = useState<number>(6); // Default: Carbon
  const [elementSearch, setElementSearch] = useState<string>('');

  const selectedElement = elementsData.find(e => e.number === selectedNum) || elementsData[5];

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
      default: return 'text-emerald-400'; // Synthetic
    }
  };

  // Filter keys based on search text (query name/symbol/number)
  const filteredElements = elementsData.filter(e => {
    const raw = elementSearch.toLowerCase();
    return e.name.toLowerCase().includes(raw) || 
           e.symbol.toLowerCase().includes(raw) || 
           e.number.toString() === raw;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-1">
      {/* LEFT SECTION: Periodic Table Grid block */}
      <div className="flex-1 flex flex-col bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Compass size={16} className="text-cyan-400 animate-spin-slow" />
              Interactive Periodic Table
            </h3>
            <p className="text-xs text-slate-400">Click any element block to view structural properties and configurations.</p>
          </div>

          {/* Quick filter textbox */}
          <div className="relative w-full sm:w-60">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Symbol, Name or No..."
              value={elementSearch}
              onChange={(e) => setElementSearch(e.target.value)}
              className="w-full text-xs bg-[#0A0B0E] pl-9 pr-3 py-1.5 border border-slate-800 focus:border-cyan-500 focus:bg-[#0A0B0E] rounded-lg outline-none transition-all placeholder:text-slate-500 font-medium text-slate-200"
            />
          </div>
        </div>

        {/* The 18-col Periodic Table Viewport (Scrollable container on small viewports) */}
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="min-w-[760px] grid grid-cols-18 gap-1.5 select-none font-mono">
            
            {/* Generate elements on layout places */}
            {elementsData.map((el) => {
              // Highlight matched cells if searching, or keep standard opacity
              const matchedSearch = elementSearch === '' || filteredElements.some(fe => fe.number === el.number);
              const gridStyle = {
                gridColumnStart: el.col,
                gridRowStart: el.row
              };

              // Categories map styles
              const isActive = selectedNum === el.number;
              const cellClasses = getCategoryStyles(el.category, isActive);

              return (
                <div
                  key={el.number}
                  style={gridStyle}
                  onClick={() => setSelectedNum(el.number)}
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

            {/* Empty Spacers labels or markers to fill columns where missing elements reside */}
            <div className="col-start-3 col-end-13 row-start-1 flex items-center justify-center text-[10px] text-slate-500 italic pointer-events-none font-sans">
              * Nonmetals & Gases Group
            </div>
            <div className="col-start-4 col-end-12 row-start-2 flex items-center justify-center text-[9px] text-slate-600 pointer-events-none font-sans">
              Reactive Elements Zone
            </div>
          </div>
        </div>

        {/* Table Color legends */}
        <div className="mt-5 border-t border-slate-800 pt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center">
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

      {/* RIGHT PANEL: Element Spotlight detail display */}
      <div className="w-full lg:w-80 bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          {/* Spotlight Header badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/30 border border-cyan-900/50 rounded-full mb-4">
            <Sparkles size={11} className="text-cyan-400 animate-pulse" /> Element Spotlight
          </span>

          {/* Large Hero Symbol card */}
          <div className={`p-4 rounded-xl border flex justify-between items-center mb-4 ${getCategoryStyles(selectedElement.category, false)} transition-all duration-300`}>
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

          {/* Quick Specifications properties list */}
          <div className="space-y-2 border-b border-slate-800 pb-4 mb-4 select-text">
            <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans font-medium flex items-center gap-1"><FlaskConical size={11} /> Shell Configuration</span>
              <span className="font-mono font-semibold text-slate-200 bg-[#0A0B0E] px-1.5 py-0.5 rounded border border-slate-800">{selectedElement.electronConfig}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-sans font-medium flex items-center gap-1"><Award size={11} /> Discovery Details</span>
              <span className="font-sans font-semibold text-slate-300 text-right max-w-[160px] truncate" title={selectedElement.discovery}>{selectedElement.discovery}</span>
            </div>
            {selectedElement.melt !== undefined && (
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/50">
                <span className="text-slate-400 font-sans font-medium">Melting Point</span>
                <span className="font-mono font-semibold text-slate-200">{selectedElement.melt} K ({Math.floor(selectedElement.melt - 273.15)}°C)</span>
              </div>
            )}
            {selectedElement.boil !== undefined && (
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/50">
                <span className="text-slate-400 font-sans font-medium">Boiling Point</span>
                <span className="font-mono font-semibold text-slate-200">{selectedElement.boil} K ({Math.floor(selectedElement.boil - 273.15)}°C)</span>
              </div>
            )}
            {selectedElement.electronegativity !== undefined && (
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/50">
                <span className="text-slate-400 font-sans font-medium">Electronegativity Pauling</span>
                <span className="font-semibold text-slate-200 bg-[#0A0B0E] border border-slate-800 px-1 py-0.5 rounded">{selectedElement.electronegativity}</span>
              </div>
            )}
          </div>

          {/* Description overview paragraphs */}
          <div className="text-xs text-slate-300 leading-relaxed bg-[#0A0B0E]/60 border border-slate-800 rounded-xl p-3 select-text">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
              <ShieldAlert size={10} className="text-cyan-400" /> Educational Summary
            </h4>
            {selectedElement.summary}
          </div>
        </div>

        {/* Connected search call to action button */}
        <div className="mt-5">
          <button
            onClick={() => onSearchElement(selectedElement.name)}
            className="w-full text-xs font-semibold py-2.5 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FlaskConical size={14} />
            Search {selectedElement.name} Compounds
          </button>
        </div>
      </div>
    </div>
  );
}
