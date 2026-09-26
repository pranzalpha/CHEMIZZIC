import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, Pipette, HelpCircle, AlertTriangle, Info, Sparkles, CheckCircle2, Droplets } from 'lucide-react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';

interface PHSample {
  name: string;
  formula: string;
  ph: number;
  type: string;
  description: string;
  safety: string;
}

const standardSamples: PHSample[] = [
  { name: "Hydrochloric Acid", formula: "HCl", ph: 1.0, type: "Strong Acid", description: "Fully dissociates in aqueous solution, releasing a high density of hydronium ions. It is highly corrosive and is a key constituent of mammalian gastric acid.", safety: "Extremely corrosive! Always handle with protective gloves and eyewear." },
  { name: "Lemon Juice (Citric Acid)", formula: "C₆H₈O₇", ph: 2.2, type: "Weak Acid", description: "A natural organic tricarboxylic acid found in abundance in citrus fruits. It acts as a natural preservative and gives a sharp, sour taste.", safety: "Safe for consumption, but can cause stinging on open wounds or eyes." },
  { name: "Vinegar (Acetic Acid)", formula: "CH₃COOH", ph: 2.9, type: "Weak Acid", description: "A dilute household organic carboxylic acid created through the fermentation of ethanol by acetobacter. Only partially dissociates in water.", safety: "Relatively safe in household concentrations, can be an irritant in concentrated forms." },
  { name: "Black Coffee", formula: "Complex Mix", ph: 5.0, type: "Weak Acid", description: "Contains dozens of organic acids (chlorogenic, citric, malic) roasted and extracted from coffee beans, alongside caffeic alkaloids.", safety: "Completely safe to handle and ingest." },
  { name: "Pure Water", formula: "H₂O", ph: 7.0, type: "Neutral", description: "Undergoes self-ionization to yield exactly equal concentration densities of hydronium and hydroxide particles (1.0 × 10⁻⁷ mol/L) at 25°C.", safety: "Perfectly safe. Standard solvent." },
  { name: "Human Blood", formula: "H₂CO₃ / HCO₃⁻", ph: 7.4, type: "Weak Base", description: "Maintained in an extremely tight homeostatic buffer range (7.35–7.45) by carbon dioxide respiration and carbonate kidney clearance.", safety: "Safe, but biological fluids carry standard contact protocols in laboratories." },
  { name: "Baking Soda solution", formula: "NaHCO₃", ph: 8.3, type: "Weak Base", description: "Sodium bicarbonate solution. Releases mild carbonate ions that buffer acids, making it popular for baking, neutralizing spills, and antacids.", safety: "Completely safe under normal lab conditions." },
  { name: "Ammonia solution", formula: "NH₃ (aq)", ph: 11.5, type: "Weak Base", description: "A weak volatile alkaline solution. Ammonia molecules establish equilibrium with water, forming ammonium and corrosive hydroxide ions.", safety: "Pungent suffocating vapors! Avoid direct inhalation or skin contact." },
  { name: "Bleach solution", formula: "NaClO", ph: 12.5, type: "Strong Base", description: "Sodium hypochlorite. A highly reactive alkaline compound used widely as a disinfectant, sanitizer, and textile bleaching reagent.", safety: "Corrosive! Destroys organic tissue and fabrics. Use in well-ventilated areas." },
  { name: "Sodium Hydroxide (Lye)", formula: "NaOH", ph: 13.8, type: "Strong Base", description: "A strong metallic hydroxide alkali that fully dissociates in water to release extreme concentrations of caustic hydroxide ions.", safety: "Severely caustic! Causes deep chemical burns. Always handle with extreme caution." }
];

export const PHMeterTab: React.FC = () => {
  const { recordFeatureUsage } = useAuthAndQuiz();
  const [selectedSample, setSelectedSample] = useState<PHSample>(standardSamples[4]); // Water
  const [phValue, setPhValue] = useState<number>(7.0);
  const [activeIndicator, setActiveIndicator] = useState<'none' | 'methyl-orange' | 'phenolphthalein' | 'universal'>('none');
  const [litmusTest, setLitmusTest] = useState<'none' | 'red' | 'blue'>('none');
  const [isLitmusDipped, setIsLitmusDipped] = useState<boolean>(false);
  const [isDripping, setIsDripping] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('Custom Solution');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Sync phValue when sample changes
  useEffect(() => {
    if (!isCustomMode) {
      setPhValue(selectedSample.ph);
      // Reset indicator state for fresh test
      setIsLitmusDipped(false);
    }
  }, [selectedSample, isCustomMode]);

  // Handle manual pH slider changes
  const handlePHSliderChange = (val: number) => {
    setIsCustomMode(true);
    setPhValue(val);
    setIsLitmusDipped(false);
  };

  // Trigger indicator drop dripping animation
  const triggerDrip = (indicator: 'none' | 'methyl-orange' | 'phenolphthalein' | 'universal') => {
    setIsDripping(true);
    setTimeout(() => {
      setActiveIndicator(indicator);
      setIsDripping(false);
      recordFeatureUsage(
        'phmeter',
        'pH Meter & Indicator Lab',
        `Conducted ${indicator} drop test on ${isCustomMode ? customName : selectedSample.name} (pH ${phValue.toFixed(1)})`,
        'Laboratory',
        20
      );
    }, 1200);
  };

  // Determine Chemical Class Text
  const getPHClassification = (ph: number) => {
    if (ph < 2.0) return { label: 'Strongly Acidic', color: 'text-red-500 bg-red-950/20 border-red-500/30' };
    if (ph < 6.0) return { label: 'Weakly Acidic', color: 'text-orange-400 bg-orange-950/20 border-orange-500/30' };
    if (ph >= 6.0 && ph <= 8.0) return { label: 'Neutral (Balanced)', color: 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30' };
    if (ph < 12.0) return { label: 'Weakly Alkaline', color: 'text-cyan-400 bg-cyan-950/20 border-cyan-500/30' };
    return { label: 'Strongly Alkaline (Caustic)', color: 'text-purple-400 bg-purple-950/20 border-purple-500/30' };
  };

  // Calculate ion concentrations based on pH
  // pH = -log10[H3O+] => [H3O+] = 10^-pH
  // pOH = 14 - pH => [OH-] = 10^-pOH
  const h3oConc = Math.pow(10, -phValue);
  const ohConc = Math.pow(10, -(14 - phValue));

  const formatScientific = (num: number) => {
    if (num === 1) return "1.0 × 10⁰";
    const exponent = Math.floor(Math.log10(num));
    const mantissa = num / Math.pow(10, exponent);
    return `${mantissa.toFixed(2)} × 10${getSuperscript(exponent)}`;
  };

  const getSuperscript = (num: number) => {
    const sups: { [key: string]: string } = {
      '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return String(num).split('').map(char => sups[char] || char).join('');
  };

  // Calculate Universal Indicator Color based on pH
  const getUniversalColor = (ph: number) => {
    // Return CSS color matching typical pH color spectrum
    if (ph <= 1) return 'rgba(239, 68, 68, 0.85)'; // Red
    if (ph <= 3) return 'rgba(249, 115, 22, 0.85)'; // Orange-Red
    if (ph <= 5) return 'rgba(234, 179, 8, 0.85)'; // Orange/Yellow
    if (ph <= 6.5) return 'rgba(132, 204, 22, 0.85)'; // Lime Green
    if (ph <= 7.5) return 'rgba(34, 197, 94, 0.85)'; // True Green
    if (ph <= 8.5) return 'rgba(20, 184, 166, 0.85)'; // Teal
    if (ph <= 10) return 'rgba(59, 130, 246, 0.85)'; // Blue
    if (ph <= 12) return 'rgba(99, 102, 241, 0.85)'; // Indigo
    return 'rgba(168, 85, 247, 0.9)'; // Deep Purple
  };

  // Calculate Phenolphthalein color based on pH
  // Colorless below pH 8.2, transitions to fuchsia up to 10
  const getPhenolphthaleinColor = (ph: number) => {
    if (ph <= 8.2) {
      return 'rgba(224, 242, 254, 0.15)'; // Completely colorless/light blue tint
    }
    if (ph >= 10.0) {
      return 'rgba(236, 72, 153, 0.85)'; // Deep Fuchsia pink
    }
    // Interpolate opacity/intensity
    const ratio = (ph - 8.2) / 1.8;
    return `rgba(236, 72, 153, ${0.15 + ratio * 0.7})`;
  };

  // Calculate Methyl Orange color based on pH
  // Red below pH 3.1, Orange from 3.1 to 4.4, Yellow above 4.4
  const getMethylOrangeColor = (ph: number) => {
    if (ph <= 3.1) {
      return 'rgba(239, 68, 68, 0.85)'; // Vibrant Red
    }
    if (ph >= 4.4) {
      return 'rgba(234, 179, 8, 0.8)'; // Yellow
    }
    // Transition (Orange)
    const ratio = (ph - 3.1) / 1.3;
    const r = Math.round(239 + (234 - 239) * ratio);
    const g = Math.round(68 + (179 - 68) * ratio);
    const b = Math.round(68 + (8 - 68) * ratio);
    return `rgba(${r}, ${g}, ${b}, 0.83)`;
  };

  // Standard (no indicator) color represents natural chemical tint
  const getBaseColor = (ph: number) => {
    // Strongly acidic has mild yellow/red warmth, strongly basic has mild heavy blue-purple density
    if (ph < 3) return 'rgba(239, 68, 68, 0.08)'; // faint reddish tint
    if (ph > 11) return 'rgba(168, 85, 247, 0.08)'; // faint purple tint
    return 'rgba(34, 211, 238, 0.05)'; // neutral clean water blue
  };

  // Get active solution color inside beaker
  const getActiveSolutionColor = () => {
    switch (activeIndicator) {
      case 'methyl-orange':
        return getMethylOrangeColor(phValue);
      case 'phenolphthalein':
        return getPhenolphthaleinColor(phValue);
      case 'universal':
        return getUniversalColor(phValue);
      default:
        return getBaseColor(phValue);
    }
  };

  // Calculate litmus paper result color
  // Red litmus stays red in acid/neutral, turns blue in base
  // Blue litmus stays blue in base/neutral, turns red in acid
  const getLitmusPaperColor = (type: 'red' | 'blue', submerged: boolean) => {
    if (!submerged) {
      return type === 'red' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)';
    }
    // Submerged color based on pH
    if (phValue < 5.0) {
      return 'rgba(239, 68, 68, 0.8)'; // turns red (acidic)
    }
    if (phValue > 8.0) {
      return 'rgba(59, 130, 246, 0.8)'; // turns blue (alkaline)
    }
    // Transition / neutral zone
    if (type === 'red') {
      return 'rgba(239, 68, 68, 0.7)'; // stays red
    } else {
      return 'rgba(59, 130, 246, 0.7)'; // stays blue
    }
  };

  const activeClassification = getPHClassification(phValue);

  return (
    <div className="space-y-8 select-text" id="ph-meter-tab">
      
      {/* Overview Intro Banner */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-1 text-[9px] font-mono font-bold text-cyan-400 border border-cyan-500/20 bg-cyan-950/25 rounded-full">
              LABORATORY DEPT: ANALYTICAL SENSORS
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-black text-white tracking-tight mt-1">
              Virtual pH Meter & Indicator Lab
            </h2>
            <p className="text-slate-400 text-xs font-sans max-w-xl">
              An interactive molecular sandbox to explore hydronium ionization densities, test standard school reagents, observe transitions of classic indicators, and run litmus tests on standard or custom chemical solutions.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveIndicator('none');
                setLitmusTest('none');
                setIsLitmusDipped(false);
              }}
              className="px-4 py-2 bg-black/40 hover:bg-black/80 border border-slate-800 rounded-xl text-[10.5px] font-mono uppercase font-bold text-slate-350 transition-all cursor-pointer"
            >
              Clear Indicators
            </button>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Control Console (6 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Solution Selector Panel */}
          <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                1. Select Specimen or Compound
              </span>
              <button
                onClick={() => {
                  setIsCustomMode(prev => !prev);
                  if (!isCustomMode) {
                    setCustomName('Custom Solution');
                  }
                }}
                className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded uppercase transition-all ${isCustomMode ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 hover:border-slate-700 text-slate-500'}`}
              >
                {isCustomMode ? 'Locked: Custom' : 'Switch to Custom Slider'}
              </button>
            </div>

            {/* Standard Samples dropdown */}
            {!isCustomMode ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {standardSamples.map((sample) => (
                    <button
                      key={sample.name}
                      onClick={() => {
                        setSelectedSample(sample);
                        setIsCustomMode(false);
                      }}
                      className={`p-2.5 rounded-lg border text-left font-mono transition-all text-[11px] flex flex-col justify-between h-[64px] ${selectedSample.name === sample.name ? 'border-cyan-500 bg-cyan-950/15 text-cyan-200' : 'border-slate-850 hover:border-slate-800 bg-black/15 text-slate-400'}`}
                    >
                      <span className="font-bold truncate w-full">{sample.name}</span>
                      <div className="flex justify-between items-center w-full text-[9px] opacity-75 mt-1 font-mono">
                        <span className="text-slate-500">{sample.formula}</span>
                        <span className="text-cyan-400 font-bold bg-cyan-950/40 px-1.5 rounded">pH {sample.ph.toFixed(1)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-slate-500 uppercase">Custom Specimen Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.slice(0, 30))}
                    className="w-full text-xs bg-black/50 border border-slate-800 focus:border-cyan-500 p-2.5 rounded-xl text-slate-200 outline-none font-mono"
                  />
                </div>
                <div className="p-3 bg-black/25 rounded-lg border border-slate-850 text-[10px] text-slate-500 leading-normal">
                  You have activated <strong className="text-cyan-300">Infinite Slidability</strong>. Use the pH sensor readout slider below to dynamically calibrate acid-alkali proportions in real-time.
                </div>
              </div>
            )}
          </div>

          {/* Interactive pH Sensor Calibrator Slider */}
          <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                2. pH Calibrator (0.0 to 14.0)
              </label>
              <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold uppercase ${activeClassification.color}`}>
                {activeClassification.label}
              </span>
            </div>

            <div className="space-y-4">
              {/* Giant Digital Readout */}
              <div className="bg-black/60 border border-slate-850 rounded-xl p-4 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono font-bold text-slate-550 block uppercase tracking-wide">Chemical Class</span>
                  <span className="text-xs font-bold text-slate-350">{isCustomMode ? customName : selectedSample.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Calculated pH</span>
                  <span className="text-3xl font-black font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                    {phValue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.0"
                  max="14.0"
                  step="0.1"
                  value={phValue}
                  onChange={(e) => handlePHSliderChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 via-green-500 via-teal-400 via-blue-500 to-purple-600 rounded-full appearance-none cursor-pointer focus:outline-none"
                  style={{
                    backgroundSize: '100% 100%'
                  }}
                />
                
                {/* Scale markers */}
                <div className="flex justify-between text-[9px] font-mono text-slate-550 px-1">
                  <span>0 (Acid)</span>
                  <span>4</span>
                  <span>7 (Neutral)</span>
                  <span>10</span>
                  <span>14 (Alkali)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reagents / Chemical Indicators Laboratory Selector */}
          <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                3. Apply Chemical Indicator Drop
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                Trigger a chemical reaction drop. Watch the molecular color density spread in the flask.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: 'methyl-orange',
                  name: 'Methyl Orange',
                  range: 'pH 3.1–4.4',
                  color: 'Red (acid) ↔ Yellow (alkali)',
                  desc: 'A synthetic azo dye that displays sharp protonated transformations.'
                },
                {
                  id: 'phenolphthalein',
                  name: 'Phenolphthalein',
                  range: 'pH 8.2–10.0',
                  color: 'Colorless ↔ Fuchsia Pink',
                  desc: 'A weak phthalein dye acid that is colorless in standard acids but intensely pink in base.'
                },
                {
                  id: 'universal',
                  name: 'Universal Reagent',
                  range: 'pH 0.0–14.0',
                  color: 'Full Spectrum Rainbow',
                  desc: 'A mixed formulation of multiple indicators showing continuous color steps.'
                },
                {
                  id: 'none',
                  name: 'Pure Specimen (None)',
                  range: 'N/A',
                  color: 'No Indicator Added',
                  desc: 'Remove dyes to analyze the pure native appearance of the liquid.'
                }
              ].map(ind => (
                <button
                  key={ind.id}
                  disabled={isDripping}
                  onClick={() => triggerDrip(ind.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all h-[105px] flex flex-col justify-between cursor-pointer ${activeIndicator === ind.id ? 'border-cyan-500 bg-cyan-950/10' : 'border-slate-850 hover:border-slate-800 bg-black/15 disabled:opacity-40'}`}
                >
                  <div className="space-y-0.5">
                    <span className={`text-[11px] font-bold font-mono block ${activeIndicator === ind.id ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {ind.name}
                    </span>
                    <span className="text-[9px] text-slate-550 font-mono block">{ind.range}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-sans leading-tight mt-1 line-clamp-2">
                    {ind.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Litmus Paper Laboratory Tests */}
            <div className="border-t border-slate-850 pt-4 space-y-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  4. Litmus Paper Analytical Strips
                </span>
                <p className="text-[10px] text-slate-500 mt-1 font-sans">
                  Choose a paper strip formulation, then dip it into the beaker solution to test for acid/base.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setLitmusTest('red');
                    setIsLitmusDipped(false);
                  }}
                  className={`flex-1 py-2.5 rounded-lg border font-mono text-[10.5px] font-bold transition-all ${litmusTest === 'red' ? 'border-red-500/55 bg-red-950/20 text-red-300' : 'border-slate-850 hover:border-slate-800 text-slate-400'}`}
                >
                  🔴 Prepare Red Litmus
                </button>
                <button
                  onClick={() => {
                    setLitmusTest('blue');
                    setIsLitmusDipped(false);
                  }}
                  className={`flex-1 py-2.5 rounded-lg border font-mono text-[10.5px] font-bold transition-all ${litmusTest === 'blue' ? 'border-blue-500/55 bg-blue-950/20 text-blue-300' : 'border-slate-850 hover:border-slate-800 text-slate-400'}`}
                >
                  🔵 Prepare Blue Litmus
                </button>
              </div>

              {litmusTest !== 'none' && (
                <div className="flex items-center justify-between p-3 bg-black/45 rounded-xl border border-slate-850 animate-fadeIn">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-mono font-bold text-amber-400 uppercase block">Strip Status ready</span>
                    <span className="text-[10.5px] font-sans text-slate-350">
                      {litmusTest === 'red' ? 'Acid-sensitive Red Litmus' : 'Alkali-sensitive Blue Litmus'} loaded on clamp.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsLitmusDipped(prev => !prev)}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] uppercase font-mono font-black rounded-lg transition-all"
                  >
                    {isLitmusDipped ? 'Retract Clamp' : 'Dip Strip into Flask'}
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Side: Beaker Visualization & Ion calculations (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          {/* Beaker Lab Simulation Stage */}
          <div className="bg-[#111318] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm flex-1 relative overflow-hidden">
            
            {/* Visual Beaker Flask display */}
            <div className="relative w-full md:w-1/2 flex justify-center items-center h-[290px]">
              
              {/* Dropper pipette on top when dripping indicator */}
              <AnimatePresence>
                {isDripping && (
                  <motion.div
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: -10, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-2 z-20 flex flex-col items-center"
                  >
                    <Pipette className="text-cyan-400" size={32} />
                    {/* Drip droplet */}
                    <motion.div
                      initial={{ y: 0, scale: 1, opacity: 1 }}
                      animate={{ y: 130, scale: 0.8, opacity: [1, 1, 0] }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="w-2.5 h-2.5 rounded-full mt-1"
                      style={{
                        backgroundColor: activeIndicator === 'methyl-orange' ? 'rgba(239,68,68,0.9)' :
                                         activeIndicator === 'phenolphthalein' ? 'rgba(236,72,153,0.9)' :
                                         activeIndicator === 'universal' ? 'rgba(168,85,247,0.9)' : 'rgba(34,211,238,0.8)'
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Litmus Paper Clamped Mechanism */}
              <AnimatePresence>
                {litmusTest !== 'none' && (
                  <motion.div
                    initial={{ y: -150 }}
                    animate={{ y: isLitmusDipped ? 0 : -80 }}
                    exit={{ y: -150 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="absolute top-4 left-1/2 -ml-6 w-12 h-44 z-20 pointer-events-none flex flex-col items-center"
                  >
                    {/* Clamping device body */}
                    <div className="w-8 h-8 bg-zinc-700 rounded-t border-t border-zinc-500 shadow-md flex items-center justify-center font-mono text-[8px] text-zinc-300">
                      CLAMP
                    </div>
                    {/* Upper paper (not submerged) */}
                    <div
                      className="w-4 h-16 transition-colors duration-500 shadow"
                      style={{ backgroundColor: getLitmusPaperColor(litmusTest as any, false) }}
                    />
                    {/* Submerged paper line (submerges fully in beaker) */}
                    <div
                      className="w-4 h-20 transition-colors duration-500 shadow border-t border-slate-900/10"
                      style={{ backgroundColor: getLitmusPaperColor(litmusTest as any, isLitmusDipped) }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Beaker Container */}
              <div className="relative w-44 h-56 border-4 border-slate-700/80 rounded-b-3xl border-t-0 shadow-lg flex items-end overflow-hidden">
                
                {/* Side volume graduation notches */}
                <div className="absolute right-2 top-4 bottom-4 w-4 flex flex-col justify-between text-[7px] font-mono text-slate-550 select-none pointer-events-none">
                  <span>- 400ml</span>
                  <span>- 300ml</span>
                  <span>- 200ml</span>
                  <span>- 100ml</span>
                </div>

                {/* Submerged liquid */}
                <motion.div
                  className="w-full h-[65%] transition-colors duration-700 ease-out relative"
                  style={{ backgroundColor: getActiveSolutionColor() }}
                  animate={isDripping ? {
                    scaleY: [1, 1.03, 0.98, 1],
                  } : {}}
                  transition={{ duration: 0.6 }}
                >
                  {/* Ripples on surface of liquid */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 animate-pulse rounded-t-full" />

                  {/* Scientific bubbles floating */}
                  {[...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        y: [-10, -110],
                        opacity: [0, 0.7, 0],
                        x: [0, Math.sin(i) * 10]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3 + i,
                        delay: i * 0.4,
                        ease: 'linear'
                      }}
                      className="absolute w-1 h-1 rounded-full border border-white/30 bg-white/10"
                      style={{
                        bottom: '5%',
                        left: `${20 + i * 12}%`
                      }}
                    />
                  ))}
                </motion.div>

                {/* Cyber display tag inside beaker container */}
                <div className="absolute left-4 top-4 bg-black/70 border border-slate-800 p-1.5 rounded text-[8px] font-mono text-slate-500 tracking-tight z-10 select-none">
                  TEMP: 25.0°C <br />
                  PRES: 1.0 ATM
                </div>

                {/* Submersion limit indicator line */}
                <div className="absolute left-0 right-0 bottom-[65%] border-t border-cyan-400/20 border-dashed pointer-events-none" />

              </div>

            </div>

            {/* Science details panel alongside the beaker */}
            <div className="flex-1 space-y-4 font-mono text-xs w-full">
              <div className="border-b border-slate-850 pb-2 flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan-400" />
                <span className="font-bold text-cyan-300 uppercase">Chemical Reaction Details</span>
              </div>

              {/* Chemical metadata descriptors */}
              {!isCustomMode ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Compound Class:</span>
                    <span className="text-slate-300 font-bold">{selectedSample.type}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Molecule Formula:</span>
                    <span className="text-cyan-350 font-bold">{selectedSample.formula}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans font-medium">
                    {selectedSample.description}
                  </p>
                  <div className="p-2.5 bg-red-950/10 border border-red-900/35 rounded-lg flex gap-1.5 items-start text-[9.5px] leading-normal font-sans">
                    <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong className="text-red-300 block font-mono text-[8px] uppercase tracking-wider">Safety Hazard Level</strong>
                      <span className="text-slate-350">{selectedSample.safety}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Specimen Name:</span>
                    <span className="text-slate-300 font-bold truncate max-w-[120px]">{customName}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">State:</span>
                    <span className="text-amber-400 font-bold">Dynamic Calibration Mode</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans font-medium">
                    You are manually adjusting the concentration of acid (H₃O⁺) versus alkali (OH⁻). Acidic pH values represent abundance of hydronium cations, while basic/alkaline solutions indicate a saturation of hydroxide anions.
                  </p>
                  <div className="p-2.5 bg-cyan-950/20 border border-cyan-850 rounded-lg flex gap-1.5 items-center text-[10px] font-sans">
                    <CheckCircle2 size={13} className="text-cyan-400 shrink-0" />
                    <span className="text-slate-300 font-medium">Fully balanced equilibrium simulated at 25°C.</span>
                  </div>
                </div>
              )}

              {/* Indicator summary readout */}
              <div className="pt-2 border-t border-slate-850 text-[10.5px]">
                <span className="text-slate-500 block uppercase text-[9px] tracking-wider mb-1 font-bold">Active Indicator Dye</span>
                <div className="flex justify-between items-center bg-black/40 p-2 border border-slate-850 rounded-lg">
                  <span className="text-slate-400">
                    {activeIndicator === 'none' ? 'None (Pure Water Appearance)' :
                     activeIndicator === 'methyl-orange' ? 'Methyl Orange (Azo Dye)' :
                     activeIndicator === 'phenolphthalein' ? 'Phenolphthalein (pH Probe)' : 'Universal Indicator Reagent'}
                  </span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: getActiveSolutionColor() }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Quantitative Ion Concentration Panel */}
          <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm font-mono text-xs">
            <div className="border-b border-slate-850 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                5. Spectral Quantitative Log: Ion Concentrations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Hydronium display */}
              <div className="bg-black/40 border border-slate-850 p-3.5 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-red-400 font-bold uppercase tracking-wider">[H₃O⁺] Hydronium Ion</span>
                  <span className="text-[8.5px] text-slate-500">Acidic density</span>
                </div>
                <div className="text-xl font-bold text-slate-200">
                  {formatScientific(h3oConc)} <span className="text-xs text-slate-500 font-normal">M</span>
                </div>
                <div className="text-[9px] text-slate-550 leading-relaxed font-sans">
                  Represents the moles of hydrogen cations per liter of solvent. Higher values represent stronger acids.
                </div>
                <div className="absolute right-3 bottom-3 text-red-500/10 pointer-events-none select-none text-2xl font-black">
                  H⁺
                </div>
              </div>

              {/* Hydroxide display */}
              <div className="bg-black/40 border border-slate-850 p-3.5 rounded-xl space-y-2 relative">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-purple-400 font-bold uppercase tracking-wider">[OH⁻] Hydroxide Ion</span>
                  <span className="text-[8.5px] text-slate-500">Alkaline density</span>
                </div>
                <div className="text-xl font-bold text-slate-200">
                  {formatScientific(ohConc)} <span className="text-xs text-slate-500 font-normal">M</span>
                </div>
                <div className="text-[9px] text-slate-550 leading-relaxed font-sans">
                  Represents the moles of hydroxide anions per liter of solvent. Higher values represent stronger alkalis.
                </div>
                <div className="absolute right-3 bottom-3 text-purple-500/10 pointer-events-none select-none text-2xl font-black">
                  OH⁻
                </div>
              </div>

            </div>

            {/* Autoionization Constant Equation */}
            <div className="bg-black/60 border border-slate-900 p-3 rounded-lg text-center text-[10px] text-slate-500 font-bold flex flex-col md:flex-row md:justify-between items-center gap-2">
              <span>Autoionization Product: K_w = [H₃O⁺] × [OH⁻] = 1.00 × 10⁻¹⁴</span>
              <span className="text-cyan-405">
                Current Product: {(h3oConc * ohConc).toExponential(2)} M²
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Educational Indicator Reference charts */}
      <div className="bg-[#111318] border border-slate-800 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="border-b border-slate-850 pb-2">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Laboratory Indicator Reference Standards
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
          
          <div className="space-y-2">
            <strong className="text-slate-350 block font-mono text-[10.5px]">Methyl Orange (pH 3.1–4.4)</strong>
            <p className="text-slate-450 leading-relaxed text-[10px]">
              Methyl Orange is an azo dye which exhibits a transition color change from red in acidic media to yellow in basic media. Under pH 3.1, it exists predominantly as the protonated red quinoid structure. Between 3.1 and 4.4, an equilibrium mix creates an orange intermediate. Above 4.4, it is deprotonated yellow.
            </p>
            <div className="h-3 w-full rounded overflow-hidden flex text-[8.5px] text-black font-bold text-center">
              <div className="bg-red-500 w-[25%] flex items-center justify-center">pH &lt; 3.1 (Red)</div>
              <div className="bg-orange-500 w-[20%] flex items-center justify-center">Orange</div>
              <div className="bg-yellow-400 w-[55%] flex items-center justify-center">pH &gt; 4.4 (Yellow)</div>
            </div>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-350 block font-mono text-[10.5px]">Phenolphthalein (pH 8.2–10.0)</strong>
            <p className="text-slate-450 leading-relaxed text-[10px]">
              Phenolphthalein is a weak acid chemical sensor. Below pH 8.2, the lactone form is colorless and lacks visible light absorption in the visible spectrum. As pH exceeds 8.2, hydroxide ions remove phenolic protons, opening the lactone ring to form a quinoid structure with conjugation that strongly absorbs green light, reflecting a fuchsia/magenta color.
            </p>
            <div className="h-3 w-full rounded overflow-hidden flex text-[8.5px] text-black font-bold text-center">
              <div className="bg-sky-950/20 text-slate-500 border border-slate-850 w-[60%] flex items-center justify-center">pH &lt; 8.2 (Colorless)</div>
              <div className="bg-pink-300 w-[20%] flex items-center justify-center">Pink</div>
              <div className="bg-pink-600 text-white w-[20%] flex items-center justify-center">pH &gt; 10 (Fuchsia)</div>
            </div>
          </div>

          <div className="space-y-2">
            <strong className="text-slate-350 block font-mono text-[10.5px]">Universal Indicator (pH 0.0–14.0)</strong>
            <p className="text-slate-450 leading-relaxed text-[10px]">
              Unlike single-dye indicator systems, Universal indicator is a custom solution consisting of a mixture of methyl red, bromothymol blue, phenolphthalein, and thymol blue. This creates a highly descriptive rainbow color transition across the entire scale from pH 0.0 to 14.0, serving as an excellent visual index.
            </p>
            <div className="h-3 w-full rounded overflow-hidden flex text-[8px] text-black font-black text-center">
              <div className="bg-red-500 w-[20%]">Red</div>
              <div className="bg-orange-400 w-[20%]">Orange</div>
              <div className="bg-green-500 w-[20%]">Green</div>
              <div className="bg-blue-500 w-[20%]">Blue</div>
              <div className="bg-purple-600 text-white w-[20%]">Purple</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
