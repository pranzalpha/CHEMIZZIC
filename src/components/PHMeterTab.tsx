import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  Pipette, 
  HelpCircle, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  Droplets,
  Search,
  Sliders,
  Database,
  BarChart2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Thermometer
} from 'lucide-react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { 
  searchPHDatabase, 
  calculatePH, 
  PH_DATABASE, 
  SAMPLE_REAL_WORLD_MEASUREMENTS 
} from '../services/phEngine';
import { PHCompoundData, PHCalculationResult, RealWorldPHMeasurement } from '../types';

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
  
  // Tab mode: Simulation vs Real-World Data
  const [activeTab, setActiveTab] = useState<'simulation' | 'real-data'>('simulation');

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<PHCompoundData[]>([]);
  const [selectedCompound, setSelectedCompound] = useState<PHCompoundData | null>(PH_DATABASE[0]); // HCl

  // Solution conditions
  const [concentration, setConcentration] = useState<number>(0.1);
  const [volumeMl, setVolumeMl] = useState<number>(100);
  const [addedWaterMl, setAddedWaterMl] = useState<number>(0);
  const [temperatureC, setTemperatureC] = useState<number>(25);

  // Thermodynamic Calculation Result
  const [calcResult, setCalcResult] = useState<PHCalculationResult>(() => 
    calculatePH(PH_DATABASE[0].id, 0.1, 100, 0, 25)
  );

  // Standard legacy sample state
  const [selectedSample, setSelectedSample] = useState<PHSample>(standardSamples[0]);
  const [phValue, setPhValue] = useState<number>(1.0);
  const [activeIndicator, setActiveIndicator] = useState<'none' | 'methyl-orange' | 'phenolphthalein' | 'universal'>('none');
  const [litmusTest, setLitmusTest] = useState<'none' | 'red' | 'blue'>('none');
  const [isLitmusDipped, setIsLitmusDipped] = useState<boolean>(false);
  const [isDripping, setIsDripping] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('Custom Solution');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Real world data table
  const [realWorldData, setRealWorldData] = useState<RealWorldPHMeasurement[]>(SAMPLE_REAL_WORLD_MEASUREMENTS);
  const [newSampleName, setNewSampleName] = useState<string>('Bench Sample');
  const [newMeasuredPH, setNewMeasuredPH] = useState<string>('7.15');

  // Handle Search Input
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchPHDatabase(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Recalculate pH when compound or conditions change
  useEffect(() => {
    if (selectedCompound) {
      const res = calculatePH(selectedCompound.id, concentration, volumeMl, addedWaterMl, temperatureC);
      setCalcResult(res);
      if (!isCustomMode) {
        setPhValue(res.calculatedPH);
      }
    }
  }, [selectedCompound, concentration, volumeMl, addedWaterMl, temperatureC, isCustomMode]);

  // When a compound from search is clicked
  const handleSelectCompound = (compound: PHCompoundData) => {
    setSelectedCompound(compound);
    setConcentration(compound.standardConcentration || 0.1);
    setAddedWaterMl(0);
    setSearchQuery('');
    setSearchResults([]);
    setIsCustomMode(false);
    
    // Also update legacy sample representation
    setSelectedSample({
      name: compound.name,
      formula: compound.formula,
      ph: compound.theoreticalPH,
      type: compound.type,
      description: compound.description,
      safety: compound.safety
    });

    recordFeatureUsage(
      'phmeter',
      'pH Compound Search & Lab',
      `Calculated thermodynamic pH for ${compound.name} (${compound.formula})`,
      'Laboratory',
      15
    );
  };

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
        `Conducted ${indicator} drop test on ${isCustomMode ? customName : (selectedCompound?.name || selectedSample.name)} (pH ${phValue.toFixed(2)})`,
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

  const h3oConc = Math.pow(10, -phValue);
  const ohConc = Math.pow(10, -(14 - phValue));

  const formatScientific = (num: number) => {
    if (num <= 0) return "0.0";
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

  const getUniversalColor = (ph: number) => {
    if (ph <= 1) return 'rgba(239, 68, 68, 0.85)';
    if (ph <= 3) return 'rgba(249, 115, 22, 0.85)';
    if (ph <= 5) return 'rgba(234, 179, 8, 0.85)';
    if (ph <= 6.5) return 'rgba(132, 204, 22, 0.85)';
    if (ph <= 7.5) return 'rgba(34, 197, 94, 0.85)';
    if (ph <= 8.5) return 'rgba(20, 184, 166, 0.85)';
    if (ph <= 10) return 'rgba(59, 130, 246, 0.85)';
    if (ph <= 12) return 'rgba(99, 102, 241, 0.85)';
    return 'rgba(168, 85, 247, 0.9)';
  };

  const getPhenolphthaleinColor = (ph: number) => {
    if (ph <= 8.2) return 'rgba(224, 242, 254, 0.15)';
    if (ph >= 10.0) return 'rgba(236, 72, 153, 0.85)';
    const ratio = (ph - 8.2) / 1.8;
    return `rgba(236, 72, 153, ${0.15 + ratio * 0.7})`;
  };

  const getMethylOrangeColor = (ph: number) => {
    if (ph <= 3.1) return 'rgba(239, 68, 68, 0.85)';
    if (ph >= 4.4) return 'rgba(234, 179, 8, 0.8)';
    const ratio = (ph - 3.1) / 1.3;
    const r = Math.round(239 + (234 - 239) * ratio);
    const g = Math.round(68 + (179 - 68) * ratio);
    const b = Math.round(68 + (8 - 68) * ratio);
    return `rgba(${r}, ${g}, ${b}, 0.83)`;
  };

  const getBaseColor = (ph: number) => {
    if (ph < 3) return 'rgba(239, 68, 68, 0.08)';
    if (ph > 11) return 'rgba(168, 85, 247, 0.08)';
    return 'rgba(34, 211, 238, 0.05)';
  };

  const getActiveSolutionColor = () => {
    switch (activeIndicator) {
      case 'methyl-orange': return getMethylOrangeColor(phValue);
      case 'phenolphthalein': return getPhenolphthaleinColor(phValue);
      case 'universal': return getUniversalColor(phValue);
      default: return getBaseColor(phValue);
    }
  };

  const getLitmusPaperColor = (type: 'red' | 'blue', submerged: boolean) => {
    if (!submerged) {
      return type === 'red' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)';
    }
    if (phValue < 5.0) return 'rgba(239, 68, 68, 0.8)';
    if (phValue > 8.0) return 'rgba(59, 130, 246, 0.8)';
    return type === 'red' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)';
  };

  const handleAddManualMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const phNum = parseFloat(newMeasuredPH);
    if (isNaN(phNum) || phNum < 0 || phNum > 14) return;

    const newEntry: RealWorldPHMeasurement = {
      id: `meas-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      sampleName: newSampleName || 'Lab Sample',
      formula: selectedCompound?.formula || 'Solution',
      concentration: concentration,
      temperature: temperatureC,
      temperatureC: temperatureC,
      measuredPH: phNum,
      theoreticalPH: calcResult.calculatedPH,
      sensorError: parseFloat((phNum - calcResult.calculatedPH).toFixed(2)),
      operator: 'Student Analyst'
    };

    setRealWorldData([newEntry, ...realWorldData]);
    setNewSampleName('');
    setNewMeasuredPH('');
  };

  const activeClassification = getPHClassification(phValue);

  return (
    <div className="space-y-8 select-text" id="ph-meter-tab">
      
      {/* Top Banner */}
      <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[50px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-[9px] font-mono font-bold text-cyan-400 border border-cyan-500/20 bg-cyan-950/25 rounded-full">
                LABORATORY DEPT: THERMODYNAMIC EQUILIBRIUM & ANALYTICAL SENSORS
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-950/20 rounded-full">
                Ka / Kb Quad Solver Active
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-black text-white tracking-tight mt-1">
              Virtual pH Meter & Analytical Lab
            </h2>
            <p className="text-slate-400 text-xs font-sans max-w-2xl">
              Search any chemical compound, calculate theoretical pH via quadratic equilibrium constants, 
              simulate volume dilution, test indicator transitions, and compare calculated vs experimental sensor data.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                  activeTab === 'simulation' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lab Simulation
              </button>
              <button
                onClick={() => setActiveTab('real-data')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition flex items-center space-x-1 ${
                  activeTab === 'real-data' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5 mr-1" />
                Real-World Data
              </button>
            </div>
            <button
              onClick={() => {
                setActiveIndicator('none');
                setLitmusTest('none');
                setIsLitmusDipped(false);
              }}
              className="px-3 py-2 bg-black/40 hover:bg-black/80 border border-slate-800 rounded-xl text-[10.5px] font-mono uppercase font-bold text-slate-300 transition-all cursor-pointer"
            >
              Clear Dyes
            </button>
          </div>
        </div>

        {/* Phase 14 Prominent Compound Search Box */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search a compound... (e.g., HCl, NaOH, CH3COOH, NH3, H2SO4, HNO3, NaCl, KOH, HBr, Citric Acid)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
            />
          </div>

          {/* Autocomplete Search Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto divide-y divide-slate-800">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectCompound(item)}
                  className="p-3 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-xs transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white font-mono">{item.name}</span>
                      <span className="font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded text-[11px] border border-cyan-800/40">
                        {item.formula}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{item.description}</span>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="text-[10px] font-mono text-slate-400 block">{item.type}</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">pH ~{item.theoreticalPH.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeTab === 'simulation' ? (
        /* Main Sandbox Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Control Console (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Compound & Dilution Calibration Panel */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center">
                  <Sliders className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  1. Chemical Specimen & Dilution
                </span>
                <button
                  onClick={() => setIsCustomMode(prev => !prev)}
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded uppercase transition-all ${
                    isCustomMode ? 'border-cyan-400 bg-cyan-950/20 text-cyan-300' : 'border-slate-800 hover:border-slate-700 text-slate-500'
                  }`}
                >
                  {isCustomMode ? 'Locked: Custom' : 'Switch to Slider'}
                </button>
              </div>

              {/* Selected Compound Badge */}
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase">Selected Compound</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white font-mono">
                      {selectedCompound ? selectedCompound.name : selectedSample.name}
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-semibold">
                      ({selectedCompound ? selectedCompound.formula : selectedSample.formula})
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 font-mono rounded border border-slate-700">
                  {selectedCompound ? selectedCompound.type : selectedSample.type}
                </span>
              </div>

              {/* Quick Select Carousel */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase">Quick Standards</span>
                <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {standardSamples.map((sample) => (
                    <button
                      key={sample.name}
                      onClick={() => {
                        const foundInDb = PH_DATABASE.find(c => c.formula.toLowerCase() === sample.formula.toLowerCase());
                        if (foundInDb) {
                          handleSelectCompound(foundInDb);
                        } else {
                          setSelectedSample(sample);
                          setSelectedCompound(null);
                          setPhValue(sample.ph);
                          setIsCustomMode(false);
                        }
                      }}
                      className={`p-2 rounded-lg border text-left font-mono transition text-[10px] flex items-center justify-between ${
                        (selectedCompound?.name === sample.name || selectedSample.name === sample.name)
                          ? 'border-cyan-500 bg-cyan-950/20 text-cyan-200' 
                          : 'border-slate-850 hover:border-slate-800 bg-black/20 text-slate-400'
                      }`}
                    >
                      <span className="truncate mr-1">{sample.name}</span>
                      <span className="text-cyan-400 font-bold flex-shrink-0">pH {sample.ph.toFixed(1)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phase 14: Modify Concentration & Dilution */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Concentration (C):</span>
                  <span className="text-cyan-400 font-bold">{concentration.toFixed(3)} M</span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="1.0"
                  step="0.005"
                  value={concentration}
                  onChange={(e) => setConcentration(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                
                {/* Dilution Control */}
                <div className="flex justify-between items-center text-xs font-mono pt-1">
                  <span className="text-slate-400 flex items-center">
                    <Droplets className="w-3.5 h-3.5 mr-1 text-blue-400" />
                    Water Added (Dilution):
                  </span>
                  <span className="text-blue-400 font-bold">+{addedWaterMl} mL ({volumeMl + addedWaterMl} mL total)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="900"
                  step="50"
                  value={addedWaterMl}
                  onChange={(e) => setAddedWaterMl(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />

                {/* Temperature */}
                <div className="flex justify-between items-center text-xs font-mono pt-1">
                  <span className="text-slate-400 flex items-center">
                    <Thermometer className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    Temperature:
                  </span>
                  <span className="text-amber-400 font-bold">{temperatureC}°C</span>
                </div>
              </div>
            </div>

            {/* 2. Interactive pH Sensor Calibrator Slider */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  2. Dynamic Sensor Calibration (0.0 to 14.0)
                </label>
                <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-bold uppercase ${activeClassification.color}`}>
                  {activeClassification.label}
                </span>
              </div>

              <div className="space-y-4">
                {/* Digital Readout */}
                <div className="bg-black/60 border border-slate-850 rounded-xl p-4 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold text-slate-500 block uppercase tracking-wide">
                      {isCustomMode ? 'Sensor Mode' : 'Theoretical Equilibrium pH'}
                    </span>
                    <span className="text-xs font-bold text-slate-350">
                      {isCustomMode ? customName : (selectedCompound?.name || selectedSample.name)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase">Sensor pH</span>
                    <span className="text-3xl font-black font-mono text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                      {phValue.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0.0"
                    max="14.0"
                    step="0.1"
                    value={phValue}
                    onChange={(e) => handlePHSliderChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 via-green-500 via-teal-400 via-blue-500 to-purple-600 rounded-full appearance-none cursor-pointer focus:outline-none"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 px-1">
                    <span>0 (Acid)</span>
                    <span>4</span>
                    <span>7 (Neutral)</span>
                    <span>10</span>
                    <span>14 (Alkali)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Reagents / Chemical Indicators */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  3. Chemical Indicator Drop
                </span>
                <p className="text-[10px] text-slate-500 mt-1">
                  Trigger indicator drop and watch the molecular color change in the beaker flask.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'methyl-orange', name: 'Methyl Orange', range: 'pH 3.1–4.4', desc: 'Red in acid, Yellow in alkali' },
                  { id: 'phenolphthalein', name: 'Phenolphthalein', range: 'pH 8.2–10.0', desc: 'Colorless in acid, Fuchsia pink in base' },
                  { id: 'universal', name: 'Universal Reagent', range: 'pH 0.0–14.0', desc: 'Continuous rainbow spectrum' },
                  { id: 'none', name: 'Pure Solution', range: 'N/A', desc: 'Remove dyes to view native appearance' }
                ].map(ind => (
                  <button
                    key={ind.id}
                    disabled={isDripping}
                    onClick={() => triggerDrip(ind.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      activeIndicator === ind.id ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-850 hover:border-slate-800 bg-black/20 disabled:opacity-40'
                    }`}
                  >
                    <div>
                      <span className={`text-[11px] font-bold font-mono block ${activeIndicator === ind.id ? 'text-cyan-300' : 'text-slate-400'}`}>
                        {ind.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono block">{ind.range}</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-sans leading-tight mt-1 line-clamp-1">
                      {ind.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Litmus Paper Tests */}
              <div className="border-t border-slate-850 pt-3 space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  4. Litmus Analytical Strips
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setLitmusTest('red'); setIsLitmusDipped(false); }}
                    className={`flex-1 py-2 rounded-lg border font-mono text-[10px] font-bold transition ${
                      litmusTest === 'red' ? 'border-red-500/60 bg-red-950/20 text-red-300' : 'border-slate-850 hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    🔴 Red Litmus Strip
                  </button>
                  <button
                    onClick={() => { setLitmusTest('blue'); setIsLitmusDipped(false); }}
                    className={`flex-1 py-2 rounded-lg border font-mono text-[10px] font-bold transition ${
                      litmusTest === 'blue' ? 'border-blue-500/60 bg-blue-950/20 text-blue-300' : 'border-slate-850 hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    🔵 Blue Litmus Strip
                  </button>
                </div>

                {litmusTest !== 'none' && (
                  <div className="flex items-center justify-between p-2.5 bg-black/45 rounded-xl border border-slate-850">
                    <span className="text-[10px] font-mono text-slate-300">
                      Strip ready: {litmusTest === 'red' ? 'Acid-sensitive' : 'Alkali-sensitive'}
                    </span>
                    <button
                      onClick={() => setIsLitmusDipped(prev => !prev)}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-black text-[9.5px] uppercase font-mono font-black rounded-lg transition"
                    >
                      {isLitmusDipped ? 'Retract Strip' : 'Dip into Beaker'}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Side: Beaker Visualization & Rigorous Thermodynamic Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col">
            
            {/* Beaker Lab Simulation Stage */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm flex-1 relative overflow-hidden">
              
              {/* Visual Beaker Flask display */}
              <div className="relative w-full md:w-1/2 flex justify-center items-center h-[280px]">
                
                {/* Dropper pipette animation */}
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
                      <div className="w-8 h-8 bg-zinc-700 rounded-t border-t border-zinc-500 shadow-md flex items-center justify-center font-mono text-[8px] text-zinc-300">
                        CLAMP
                      </div>
                      <div
                        className="w-4 h-16 transition-colors duration-500 shadow"
                        style={{ backgroundColor: getLitmusPaperColor(litmusTest as any, false) }}
                      />
                      <div
                        className="w-4 h-20 transition-colors duration-500 shadow border-t border-slate-900/10"
                        style={{ backgroundColor: getLitmusPaperColor(litmusTest as any, isLitmusDipped) }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Beaker Container */}
                <div className="relative w-44 h-56 border-4 border-slate-700/80 rounded-b-3xl border-t-0 shadow-lg flex items-end overflow-hidden">
                  
                  {/* Graduations */}
                  <div className="absolute right-2 top-4 bottom-4 w-4 flex flex-col justify-between text-[7px] font-mono text-slate-500 select-none pointer-events-none">
                    <span>- 500ml</span>
                    <span>- 350ml</span>
                    <span>- 200ml</span>
                    <span>- 100ml</span>
                  </div>

                  {/* Submerged liquid */}
                  <motion.div
                    className="w-full h-[65%] transition-colors duration-700 ease-out relative"
                    style={{ backgroundColor: getActiveSolutionColor() }}
                    animate={isDripping ? { scaleY: [1, 1.03, 0.98, 1] } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 animate-pulse rounded-t-full" />
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
                        style={{ bottom: '5%', left: `${20 + i * 12}%` }}
                      />
                    ))}
                  </motion.div>

                  <div className="absolute left-4 top-4 bg-black/70 border border-slate-800 p-1.5 rounded text-[8px] font-mono text-slate-500 tracking-tight z-10 select-none">
                    TEMP: {temperatureC}.0°C <br />
                    VOL: {volumeMl + addedWaterMl} mL
                  </div>
                  <div className="absolute left-0 right-0 bottom-[65%] border-t border-cyan-400/20 border-dashed pointer-events-none" />
                </div>

              </div>

              {/* Science details panel */}
              <div className="flex-1 space-y-3 font-mono text-xs w-full">
                <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-cyan-400" />
                    <span className="font-bold text-cyan-300 uppercase">Chemical Identity</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    THEORETICAL MODEL
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Class:</span>
                    <span className="text-slate-200 font-bold">{selectedCompound ? selectedCompound.type : selectedSample.type}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Formula:</span>
                    <span className="text-cyan-300 font-bold">{selectedCompound ? selectedCompound.formula : selectedSample.formula}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans font-medium">
                    {selectedCompound ? selectedCompound.description : selectedSample.description}
                  </p>
                  
                  {/* Safety */}
                  <div className="p-2 bg-red-950/10 border border-red-900/35 rounded-lg flex gap-1.5 items-start text-[9.5px] leading-normal font-sans">
                    <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-red-300 block font-mono text-[8px] uppercase tracking-wider">Safety Hazard</strong>
                      <span className="text-slate-350">{selectedCompound ? selectedCompound.safety : selectedSample.safety}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Phase 14 & 21: Full Scientific Breakdown Result */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm font-mono text-xs">
              <div className="border-b border-slate-850 pb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-350 uppercase tracking-wider block">
                  Thermodynamic Solution Properties
                </span>
                <span className="text-[9px] text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded font-mono">
                  Confidence: {calcResult.confidence}%
                </span>
              </div>

              {/* 4 Quantitative Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-black/50 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 uppercase block">pH</span>
                  <span className="text-lg font-bold text-cyan-300">{calcResult.calculatedPH.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-black/50 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 uppercase block">pOH</span>
                  <span className="text-lg font-bold text-purple-300">{calcResult.calculatedPOH.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-black/50 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 uppercase block">[H₃O⁺]</span>
                  <span className="text-sm font-bold text-red-300">{formatScientific(calcResult.hConcentration)} M</span>
                </div>
                <div className="p-3 bg-black/50 border border-slate-850 rounded-xl text-center">
                  <span className="text-[9px] text-slate-500 uppercase block">[OH⁻]</span>
                  <span className="text-sm font-bold text-blue-300">{formatScientific(calcResult.ohConcentration)} M</span>
                </div>
              </div>

              {/* Method & Scientific Reference */}
              <div className="space-y-2 text-[10px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                <div className="flex items-start space-x-2">
                  <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-300 block">Calculation Method:</strong>
                    <span>{calcResult.method}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2 pt-1 border-t border-slate-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-300 block">Assumptions & Authority Source:</strong>
                    <span>{calcResult.assumptions} • Source: {calcResult.dataSource}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Real-World Data Tab (Phase 14 & 21) */
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center">
                <Database className="w-4 h-4 mr-2 text-cyan-400" />
                Real-World Bench Measurements vs Theoretical Predictions
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Authoritative comparison tracking experimental sensor drift, temperature calibration, and ionic activity coefficients.
              </p>
            </div>
            
            {/* Manual Entry Form */}
            <form onSubmit={handleAddManualMeasurement} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Sample Name"
                value={newSampleName}
                onChange={(e) => setNewSampleName(e.target.value)}
                className="bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white rounded-lg font-mono focus:outline-none focus:border-cyan-500 w-32"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Meas. pH"
                value={newMeasuredPH}
                onChange={(e) => setNewMeasuredPH(e.target.value)}
                className="bg-slate-950 border border-slate-700 px-2.5 py-1.5 text-xs text-white rounded-lg font-mono focus:outline-none focus:border-cyan-500 w-24"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center transition"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Reading
              </button>
            </form>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Sample Specimen</th>
                  <th className="p-3">Formula</th>
                  <th className="p-3">Conc. (M)</th>
                  <th className="p-3">Temp (°C)</th>
                  <th className="p-3 text-cyan-400">Calculated pH</th>
                  <th className="p-3 text-emerald-400">Measured pH</th>
                  <th className="p-3">Sensor Delta (Δ)</th>
                  <th className="p-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {realWorldData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-500 text-[11px]">{row.timestamp}</td>
                    <td className="p-3 font-semibold text-white">{row.sampleName}</td>
                    <td className="p-3 text-cyan-400">{row.formula || '—'}</td>
                    <td className="p-3">{row.concentration !== undefined ? row.concentration : '—'}</td>
                    <td className="p-3">{(row.temperatureC ?? row.temperature)}°C</td>
                    <td className="p-3 font-bold text-cyan-300">{row.theoreticalPH !== undefined ? row.theoreticalPH.toFixed(2) : '—'}</td>
                    <td className="p-3 font-bold text-emerald-300">{row.measuredPH.toFixed(2)}</td>
                    <td className="p-3">
                      {row.sensorError !== undefined ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          Math.abs(row.sensorError) <= 0.05 
                            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/40' 
                            : 'bg-amber-950/50 text-amber-400 border border-amber-800/40'
                        }`}>
                          {row.sensorError > 0 ? `+${row.sensorError.toFixed(2)}` : row.sensorError.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">{row.operator || 'Bench Analyst'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              Azo dye with sharp protonated transformations. Below pH 3.1, exists predominantly as protonated red quinoid structure. Between 3.1 and 4.4, equilibrium mix creates orange. Above 4.4, deprotonated yellow.
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
              Weak acid chemical probe. Below pH 8.2, colorless lactone form without visible light absorption. Above 8.2, hydroxide ions remove phenolic protons, opening the lactone ring to form conjugated fuchsia pink.
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
              Custom composite formulation consisting of methyl red, bromothymol blue, phenolphthalein, and thymol blue, yielding a continuous rainbow spectrum across the entire 0.0 to 14.0 scale.
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
