/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Interactive Daniell Cell & Electrochemical Battery Simulator
 * Real-time dynamic simulation of Zn | Zn²⁺ || Cu²⁺ | Cu
 * Includes:
 * - Live electron flow & ion migration animations
 * - Dynamic Nernst equation EMF calculation from concentration sliders
 * - Clickable components revealing half-reactions and redox roles
 * - Cell notation, oxidation states, and embedded quiz check
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, ArrowRight, Info, CheckCircle2, RefreshCw, 
  HelpCircle, ShieldCheck, Sparkles, Sliders, Play, Award
} from 'lucide-react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';

export const InteractiveDaniellCell: React.FC = () => {
  const { recordFeatureUsage } = useAuthAndQuiz();

  // Concentration sliders (M)
  const [znConc, setZnConc] = useState<number>(1.0);
  const [cuConc, setCuConc] = useState<number>(1.0);
  const [temperatureC, setTemperatureC] = useState<number>(25);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Selected component for inspection modal/callout
  const [selectedComponent, setSelectedComponent] = useState<
    'anode' | 'cathode' | 'salt_bridge' | 'voltmeter' | 'anode_sol' | 'cathode_sol' | null
  >('anode');

  // Real-time Nernst Calculation
  const cellCalculation = useMemo(() => {
    const eStd = 1.10;
    const n = 2;
    const tKelvin = temperatureC + 273.15;
    const slope = (8.314 * tKelvin * 2.303) / (n * 96485); // 0.0591 at 298 K
    const q = Math.max(0.0001, znConc) / Math.max(0.0001, cuConc);
    const logQ = Math.log10(q);
    const emf = Number((eStd - slope * logQ).toFixed(3));
    const deltaG = Number(((-n * 96485 * emf) / 1000).toFixed(1)); // kJ/mol

    return {
      eStd,
      slope: Number(slope.toFixed(4)),
      q: Number(q.toFixed(4)),
      logQ: Number(logQ.toFixed(3)),
      emf,
      deltaG,
      isSpontaneous: emf > 0
    };
  }, [znConc, cuConc, temperatureC]);

  const componentDetails = {
    anode: {
      title: 'Zinc Anode (Negative Electrode)',
      halfReaction: 'Zn(s) ➔ Zn²⁺(aq) + 2e⁻',
      type: 'Oxidation (Anode = An Ox)',
      eStd: '-0.76 V vs SHE',
      notes: 'Zinc metal dissolves into the solution as Zn²⁺ ions, releasing 2 electrons per atom. The zinc strip gradually loses mass over time.',
      color: 'border-amber-500/50 text-amber-300 bg-amber-950/30'
    },
    cathode: {
      title: 'Copper Cathode (Positive Electrode)',
      halfReaction: 'Cu²⁺(aq) + 2e⁻ ➔ Cu(s)',
      type: 'Reduction (Cathode = Red Cat)',
      eStd: '+0.34 V vs SHE',
      notes: 'Copper ions in solution accept electrons flowing from the circuit and deposit as reddish metallic copper on the electrode. The copper strip gains mass.',
      color: 'border-orange-500/50 text-orange-300 bg-orange-950/30'
    },
    salt_bridge: {
      title: 'Inverted U-Tube Salt Bridge (KNO3 / KCl)',
      halfReaction: 'K⁺ ➔ Cathode | NO3⁻ ➔ Anode',
      type: 'Charge Neutrality Facilitator',
      eStd: 'Eliminates Liquid Junction Potential',
      notes: 'Contains agar gel saturated with inert electrolyte (KNO3). As Zn²⁺ accumulates at anode, NO3⁻ anions migrate in to neutralize excess positive charge. As Cu²⁺ is consumed at cathode, K⁺ cations migrate in to balance sulfate counterions.',
      color: 'border-purple-500/50 text-purple-300 bg-purple-950/30'
    },
    voltmeter: {
      title: 'External Voltmeter & Wire',
      halfReaction: 'Electron Migration (Anode ➔ Cathode)',
      type: 'Electrical Work Transducer',
      eStd: 'E°cell = +1.10 V (Standard 1M)',
      notes: 'Directs the flow of electrons from the lower reduction potential (Zn, -0.76 V) to the higher reduction potential (Cu, +0.34 V), powering external loads.',
      color: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/30'
    },
    anode_sol: {
      title: 'Anode Electrolyte (ZnSO4 Aqueous)',
      halfReaction: '[Zn²⁺] Concentration Compartment',
      type: 'Solvation Zone',
      eStd: `Current [Zn²⁺] = ${znConc} M`,
      notes: 'As Zn²⁺ concentration increases, the reaction quotient Q rises, which reduces the driving EMF according to Le Chatelier’s principle.',
      color: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/30'
    },
    cathode_sol: {
      title: 'Cathode Electrolyte (CuSO4 Aqueous)',
      halfReaction: '[Cu²⁺] Concentration Compartment',
      type: 'Depletion Zone',
      eStd: `Current [Cu²⁺] = ${cuConc} M`,
      notes: 'Deep blue solution of hydrated Cu(H2O)6²⁺ ions. Higher [Cu²⁺] enhances cell potential by pulling the equilibrium forward.',
      color: 'border-blue-500/50 text-blue-300 bg-blue-950/30'
    }
  };

  const handleComponentClick = (key: 'anode' | 'cathode' | 'salt_bridge' | 'voltmeter' | 'anode_sol' | 'cathode_sol') => {
    setSelectedComponent(key);
    recordFeatureUsage(
      'explorer',
      'Interactive Daniell Cell',
      `Inspected ${componentDetails[key].title}`,
      'Laboratory',
      10
    );
  };

  return (
    <div className="bg-[#0A0B0E] border border-cyan-500/20 rounded-2xl p-6 md:p-8 space-y-8 select-text">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-sans tracking-tight">
                Interactive Daniell Cell & Nernst Battery Simulator
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Zn(s) | Zn²⁺(aq) ║ Cu²⁺(aq) | Cu(s) • Standard Galvanic Couple
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-2">
            <span>Cell EMF:</span>
            <span className="text-base text-cyan-200">{cellCalculation.emf > 0 ? `+${cellCalculation.emf}` : cellCalculation.emf} V</span>
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isRunning 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Play size={12} className={isRunning ? 'fill-emerald-400' : ''} />
            {isRunning ? 'Cell Active' : 'Cell Paused'}
          </button>
        </div>
      </div>

      {/* Main Visual Display: SVG Interactive Cell Simulation */}
      <div className="relative bg-gradient-to-b from-[#111318] to-[#060709] border border-slate-800 rounded-2xl p-4 md:p-6 overflow-hidden">
        
        {/* SVG Drawing of the Daniell Cell */}
        <div className="relative w-full max-w-3xl mx-auto h-[340px]">
          <svg viewBox="0 0 800 400" className="w-full h-full select-none">
            <defs>
              {/* Beaker gradients */}
              <linearGradient id="znSolutionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#065f46" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#064e3b" stopOpacity="0.7" />
              </linearGradient>

              <linearGradient id="cuSolutionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="saltBridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#581c87" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#581c87" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Left Beaker (Anode Compartment: ZnSO4) */}
            <rect 
              x="120" y="160" width="220" height="200" rx="16" 
              fill="url(#znSolutionGrad)" 
              stroke="#334155" strokeWidth="3"
              className="cursor-pointer hover:stroke-emerald-400 transition"
              onClick={() => handleComponentClick('anode_sol')}
            />
            <text x="230" y="340" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontFamily="monospace" fontWeight="bold">
              ZnSO₄ Solution ({znConc} M)
            </text>

            {/* Right Beaker (Cathode Compartment: CuSO4) */}
            <rect 
              x="460" y="160" width="220" height="200" rx="16" 
              fill="url(#cuSolutionGrad)" 
              stroke="#334155" strokeWidth="3"
              className="cursor-pointer hover:stroke-blue-400 transition"
              onClick={() => handleComponentClick('cathode_sol')}
            />
            <text x="570" y="340" textAnchor="middle" fill="#93c5fd" fontSize="13" fontFamily="monospace" fontWeight="bold">
              CuSO₄ Solution ({cuConc} M)
            </text>

            {/* Inverted U-Tube Salt Bridge */}
            <path 
              d="M 280 240 L 280 120 Q 280 100 300 100 L 500 100 Q 520 100 520 120 L 520 240 L 490 240 L 490 135 L 310 135 L 310 240 Z"
              fill="url(#saltBridgeGrad)"
              stroke="#a855f7" strokeWidth="2"
              className="cursor-pointer hover:stroke-purple-300 transition"
              onClick={() => handleComponentClick('salt_bridge')}
            />
            <text x="400" y="90" textAnchor="middle" fill="#d8b4fe" fontSize="12" fontFamily="monospace" fontWeight="bold">
              KNO₃ Salt Bridge
            </text>

            {/* Ion Migration markers in Salt bridge */}
            {isRunning && (
              <>
                <text x="325" y="125" fill="#f43f5e" fontSize="11" fontFamily="monospace" fontWeight="bold">NO₃⁻ ➔</text>
                <text x="445" y="125" fill="#a855f7" fontSize="11" fontFamily="monospace" fontWeight="bold">➔ K⁺</text>
              </>
            )}

            {/* Zinc Electrode (Anode) */}
            <rect 
              x="180" y="110" width="36" height="210" rx="4"
              fill="#94a3b8" stroke="#cbd5e1" strokeWidth="2"
              className="cursor-pointer hover:stroke-amber-400 transition"
              onClick={() => handleComponentClick('anode')}
            />
            <text x="198" y="100" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily="monospace" fontWeight="bold">
              Zn Anode (-)
            </text>

            {/* Copper Electrode (Cathode) */}
            <rect 
              x="584" y="110" width="36" height="210" rx="4"
              fill="#b45309" stroke="#f97316" strokeWidth="2"
              className="cursor-pointer hover:stroke-orange-400 transition"
              onClick={() => handleComponentClick('cathode')}
            />
            <text x="602" y="100" textAnchor="middle" fill="#fb923c" fontSize="12" fontFamily="monospace" fontWeight="bold">
              Cu Cathode (+)
            </text>

            {/* External Circuit Wire */}
            <path 
              d="M 198 110 L 198 30 L 360 30"
              fill="none" stroke="#22d3ee" strokeWidth="3"
            />
            <path 
              d="M 440 30 L 602 30 L 602 110"
              fill="none" stroke="#22d3ee" strokeWidth="3"
            />

            {/* Voltmeter Gauge in the middle of wire */}
            <circle 
              cx="400" cy="30" r="32" 
              fill="#0f172a" stroke="#22d3ee" strokeWidth="3"
              className="cursor-pointer hover:stroke-cyan-300 transition"
              onClick={() => handleComponentClick('voltmeter')}
            />
            <text x="400" y="27" textAnchor="middle" fill="#67e8f9" fontSize="12" fontFamily="monospace" fontWeight="black">
              V
            </text>
            <text x="400" y="44" textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="monospace" fontWeight="bold">
              {cellCalculation.emf > 0 ? `+${cellCalculation.emf}` : cellCalculation.emf}V
            </text>

            {/* Electron Flow Indicator along wire */}
            {isRunning && cellCalculation.emf > 0 && (
              <>
                <circle cx="260" cy="30" r="4" fill="#facc15" className="animate-ping" />
                <text x="260" y="20" fill="#facc15" fontSize="10" fontFamily="monospace">e⁻ ➔</text>
                <circle cx="530" cy="30" r="4" fill="#facc15" className="animate-ping" />
                <text x="530" y="20" fill="#facc15" fontSize="10" fontFamily="monospace">e⁻ ➔</text>
              </>
            )}
          </svg>
        </div>

        {/* Click hint */}
        <div className="text-center text-[11px] font-mono text-slate-500 pt-2 flex items-center justify-center gap-1.5">
          <Info size={13} className="text-cyan-400" />
          <span>Click any component above (Anode, Cathode, Salt Bridge, Voltmeter, or Solutions) to inspect scientific details.</span>
        </div>
      </div>

      {/* Control Sliders & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Control Panel: Adjust Concentrations & Temperature */}
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-cyan-400" />
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Thermodynamic Variable Controls
              </h3>
            </div>
            <button
              onClick={() => {
                setZnConc(1.0);
                setCuConc(1.0);
                setTemperatureC(25);
              }}
              className="text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} /> Reset Standard (1.0 M, 25°C)
            </button>
          </div>

          {/* Zn2+ Concentration Slider */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Anode [Zn²⁺] Concentration:</span>
              <span className="text-amber-400 font-bold">{znConc.toFixed(3)} M</span>
            </div>
            <input 
              type="range" min="0.001" max="2.000" step="0.005"
              value={znConc}
              onChange={(e) => setZnConc(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.001 M (Dilute)</span>
              <span>1.0 M (Standard)</span>
              <span>2.000 M (Concentrated)</span>
            </div>
          </div>

          {/* Cu2+ Concentration Slider */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Cathode [Cu²⁺] Concentration:</span>
              <span className="text-blue-400 font-bold">{cuConc.toFixed(3)} M</span>
            </div>
            <input 
              type="range" min="0.001" max="2.000" step="0.005"
              value={cuConc}
              onChange={(e) => setCuConc(parseFloat(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.001 M (Dilute)</span>
              <span>1.0 M (Standard)</span>
              <span>2.000 M (Concentrated)</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Cell Temperature:</span>
              <span className="text-cyan-400 font-bold">{temperatureC}°C ({temperatureC + 273.15} K)</span>
            </div>
            <input 
              type="range" min="0" max="80" step="1"
              value={temperatureC}
              onChange={(e) => setTemperatureC(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0°C (Ice)</span>
              <span>25°C (Standard)</span>
              <span>80°C (Hot)</span>
            </div>
          </div>

          {/* Real-time Nernst Breakdown Card */}
          <div className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Nernst Equilibrium Equation:</div>
            <div className="text-cyan-300 font-bold text-sm">
              Ecell = 1.10 - ({cellCalculation.slope}) · log({cellCalculation.q})
            </div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              = 1.10 - ({cellCalculation.slope} × {cellCalculation.logQ}) = <span className="text-cyan-300 font-bold">{cellCalculation.emf} V</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
              <span className="text-slate-500">Gibbs Free Energy ΔG:</span>
              <span className={`font-bold ${cellCalculation.deltaG < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {cellCalculation.deltaG} kJ/mol ({cellCalculation.isSpontaneous ? 'Spontaneous' : 'Non-spontaneous'})
              </span>
            </div>
          </div>
        </div>

        {/* Selected Component Scientific Inspector */}
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
              Electrochemical Component Inspector
            </span>
            <h3 className="font-sans text-md font-bold text-white mt-1">
              {selectedComponent ? componentDetails[selectedComponent].title : 'Select a component from above'}
            </h3>
          </div>

          {selectedComponent && (
            <motion.div
              key={selectedComponent}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-xs font-sans"
            >
              <div className={`p-3.5 rounded-xl border ${componentDetails[selectedComponent].color}`}>
                <div className="font-mono text-[10px] uppercase font-bold tracking-wider opacity-75">Half-Reaction & Potential:</div>
                <div className="text-sm font-bold font-mono mt-0.5">{componentDetails[selectedComponent].halfReaction}</div>
                <div className="text-[11px] opacity-90 mt-1 font-mono">{componentDetails[selectedComponent].eStd} • {componentDetails[selectedComponent].type}</div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block">Scientific Explanation:</span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {componentDetails[selectedComponent].notes}
                </p>
              </div>

              {/* Standard Electrochemical Notation Pill */}
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-1 font-mono text-[11px]">
                <span className="text-slate-500 text-[10px] uppercase block">IUPAC Cell Notation:</span>
                <div className="text-cyan-300 font-bold">
                  Zn(s) | Zn²⁺({znConc} M) ║ Cu²⁺({cuConc} M) | Cu(s)
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Quiz Check */}
          <div className="pt-2 border-t border-slate-800 text-xs">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold block mb-1.5">
              Knowledge Verification Check:
            </span>
            <p className="text-slate-300 mb-2">
              If [Cu²⁺] is increased from 1.0 M to 2.0 M while [Zn²⁺] remains at 1.0 M, what happens to the Daniell cell EMF?
            </p>
            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 p-2 rounded-lg">
              ✓ Cell potential INCREASES because Q = [Zn²⁺]/[Cu²⁺] drops below 1, making log(Q) negative and adding to E°cell!
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
