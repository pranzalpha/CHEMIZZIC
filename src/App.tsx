/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { popularChemicals, LocalChemical } from './data/popularChemicals';
import MoleculeCanvas from './components/MoleculeCanvas';
import PeriodicTable from './components/PeriodicTable';
import ReactionPredictorTab from './components/ReactionPredictorTab';
import AIChemistTab from './components/AIChemistTab';
import { 
  Search, FlaskConical, Scale, GraduationCap, Compass, BookOpen, 
  Settings, Check, Mail, Phone, MapPin, Sparkles, AlertTriangle, 
  CheckCircle2, Flame, AlertOctagon, HelpCircle, Activity 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'periodic' | 'reaction' | 'chemist' | 'about'>('explorer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChemical, setSelectedChemical] = useState<LocalChemical>(popularChemicals[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // About feedback form state
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  // Trigger search on mount to load Water
  useEffect(() => {
    setSelectedChemical(popularChemicals[0]);
  }, []);

  // Chemical search query resolver (checks local first, otherwise API)
  const handleSearch = async (query: string) => {
    const q = (query || searchQuery || '').trim();
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chemical/search?q=${encodeURIComponent(q)}`);
      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to locate chemical compound details.");
      }

      const data = await response.json();
      setSelectedChemical(data.chemical);
      setActiveTab('explorer');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Chemical structure matched, but failed to compile. Verify network connection.");
    } finally {
      setLoading(false);
    }
  };

  // Connected Periodic Table query event handler
  const handlePeriodicElementSearch = (symbol: string) => {
    setSearchQuery(symbol);
    handleSearch(symbol);
  };

  // Handle feedback submit
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.name || !feedback.email || !feedback.message) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedback({ name: '', email: '', message: '' });
      setFeedbackSent(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-slate-300 flex flex-col font-sans selection:bg-cyan-950/40 selection:text-cyan-200 border-t-4 border-cyan-500">
      
      {/* HEADER: Elegant Global logo + high-end navigation */}
      <header className="bg-[#111318] border-b border-slate-800 sticky top-0 z-40 shadow-sm animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-600 border border-cyan-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-cyan-900/30">
              <FlaskConical size={18} className="fill-cyan-100" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
                CHEMIZIC <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 font-normal px-1.5 py-0.5 rounded font-sans">v1.2.4</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Educational Molecular Database & Artificial intelligence</p>
            </div>
          </div>

          {/* Unified search bar */}
          <div className="w-full md:w-[420px] relative">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }} className="flex relative">
              <input
                type="text"
                placeholder="Search compounds... (e.g. Water, Benzene, Caffeine, Methane)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-[#0A0B0E] border border-slate-800 pl-4 pr-12 py-2 focus:border-cyan-500 focus:bg-[#0A0B0E] rounded-lg outline-none font-medium text-slate-200 transition-all placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={loading}
                title="Search Compound Database"
                className="absolute right-1 top-1 text-slate-405 hover:text-cyan-400 p-1 bg-[#111318] hover:bg-slate-800 rounded border border-slate-800 transition-colors cursor-pointer disabled:opacity-40"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin block" />
                ) : (
                  <Search size={14} />
                )}
              </button>
            </form>
          </div>

        </div>
      </header>

      {/* SUBNAV: Styled Swiss tab elements row */}
      <nav className="bg-[#111318] border-b border-slate-800 sticky top-[68px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-1.5 scrollbar-none">
            {[
              { id: 'explorer', label: 'Structure Explorer', icon: FlaskConical },
              { id: 'periodic', label: 'Periodic Table Explorer', icon: Compass },
              { id: 'reaction', label: 'AI Reaction Predictor', icon: Scale },
              { id: 'chemist', label: 'AI Chemist Tutor', icon: GraduationCap },
              { id: 'about', label: 'Documentation & Info', icon: BookOpen }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { 
                    setActiveTab(tab.id as any);
                    if (tab.id === 'explorer') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap ${isActive ? 'bg-cyan-600 text-white font-bold tracking-wide shadow-sm shadow-cyan-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  <Icon size={13} className={isActive ? 'stroke-[2.5px]' : ''} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* CORE WORKSPACE SCREEN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB WORKSPACE 1: Structure Explorer & 3D Molecule Visualizer */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            
            {/* Quick-choice horizontal showcase list */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block mb-3">Popular Inorganic & Organic Showcases</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {popularChemicals.slice(0, 6).map(chem => (
                  <button
                    key={chem.id}
                    onClick={() => { setSelectedChemical(chem); setSearchQuery(chem.name); }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${selectedChemical.name === chem.name ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300 shadow-xs' : 'border-slate-800 hover:border-slate-700 hover:bg-[#0A0B0E]'}`}
                  >
                    <h5 className="text-xs font-bold truncate text-slate-205">{chem.name}</h5>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">{chem.formula}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs font-medium flex gap-3 select-text">
                <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="font-bold">Chemical Profiling Issue</h4>
                  <p className="mt-0.5 opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* Dynamic details dashboard layout */}
            {selectedChemical && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-text">
                
                {/* 3D Simulation canvas viewport block */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="h-[360px] md:h-[420px]">
                    <MoleculeCanvas
                      key={selectedChemical.id} // Re-mount when selected chemical resets
                      smiles={selectedChemical.smiles}
                      formula={selectedChemical.formula}
                      chemicalName={selectedChemical.name}
                      presetAtoms={selectedChemical.atoms as any}
                      presetBonds={selectedChemical.bonds as any}
                    />
                  </div>

                  {/* Summary chemical description card */}
                  <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <span className="inline-flex items-center gap-1 bg-[#0A0B0E] border border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 select-none">
                      <Activity size={10} className="text-slate-505" /> Scientific Profile Descriptor
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium select-text">
                      {selectedChemical.description}
                    </p>

                    {/* Characteristics block */}
                    {selectedChemical.characteristics && selectedChemical.characteristics.length > 0 && (
                      <div className="border-t border-slate-800 pt-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Structure Characteristics</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {selectedChemical.characteristics.map((c, i) => (
                            <div key={i} className="flex gap-2 items-center bg-[#0A0B0E]/60 p-2 rounded-lg border border-slate-850">
                              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0" />
                              <p className="text-slate-305 font-sans font-medium">{c}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right hand details dashboard list (properties, safety GHS, fire diamond) */}
                <div className="space-y-6">
                  
                  {/* IUPAC nomenclature, formula, and standard properties cards */}
                  <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 font-sans">
                    <div className="border-b border-slate-850 pb-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Standard Identity</h4>
                      <h3 className="text-lg font-serif font-semibold text-cyan-400 tracking-tight mt-2 select-all">{selectedChemical.name}</h3>
                      <p className="text-xs text-slate-400 font-mono italic mt-1 select-all">IUPAC Name: {selectedChemical.iupacName || "Pending data lookup"}</p>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                        <span className="text-slate-405 font-sans font-medium">Atomic Formula</span>
                        <span className="font-bold text-cyan-400 bg-[#0A0B0E] border border-slate-800 px-1.5 py-0.5 rounded" dangerouslySetInnerHTML={{ __html: formatFormulaSubscripts(selectedChemical.formula) }} />
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                        <span className="text-slate-405 font-sans font-medium">Molecular Weight</span>
                        <span className="font-bold text-slate-200 font-mono bg-[#0A0B0E] p-1 px-1.5 border border-slate-800 rounded">{selectedChemical.molarMass}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                        <span className="text-slate-405 font-sans font-medium">Appearance</span>
                        <span className="font-semibold text-slate-300 text-right truncate max-w-[170px]" title={selectedChemical.appearance}>{selectedChemical.appearance}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                        <span className="text-slate-405 font-sans font-medium">Odor Profile</span>
                        <span className="font-medium text-slate-305 text-right truncate max-w-[170px]" title={selectedChemical.odor}>{selectedChemical.odor}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                        <span className="text-slate-405 font-sans font-medium">Physical Density</span>
                        <span className="font-bold text-slate-205 text-right">{selectedChemical.density}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-850/50">
                        <span className="text-slate-405 font-sans font-medium">Melting Point</span>
                        <span className="font-medium text-slate-200 text-right">{selectedChemical.meltingPoint}</span>
                      </div>
                      <div className="flex justify-between items-center py-1 pb-1">
                        <span className="text-slate-405 font-sans font-medium">Boiling Point</span>
                        <span className="font-medium text-slate-202 text-right">{selectedChemical.boilingPoint}</span>
                      </div>
                    </div>
                  </div>

                  {/* Safety & NFPA Fire Diamond panel */}
                  <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-slate-550 uppercase tracking-widest border-b border-slate-850 pb-2 mb-3">Safety & NFPA Indicators</h4>
                    
                    <div className="flex bg-[#0A0B0E]/60 p-4 rounded-xl border border-slate-850 items-center justify-between gap-4">
                      {selectedChemical.nfpa ? (
                        <div className="shrink-0">
                          <NfpanDiamondSvg
                            health={selectedChemical.nfpa.health}
                            flammability={selectedChemical.nfpa.flammability}
                            instability={selectedChemical.nfpa.instability}
                            special={selectedChemical.nfpa.special}
                          />
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-505 italic select-none">NFPA data unavailable</div>
                      )}

                      <div className="text-xs flex-1">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-sans">NFPA 704 Standard</span>
                        <ul className="space-y-1 font-sans font-semibold leading-normal text-slate-300">
                          <li>Health Rating: <span className="font-mono text-slate-205">{selectedChemical.nfpa?.health ?? 0}</span>/4</li>
                          <li>Flammability: <span className="font-mono text-slate-205">{selectedChemical.nfpa?.flammability ?? 0}</span>/4</li>
                          <li>Instability: <span className="font-mono text-slate-205">{selectedChemical.nfpa?.instability ?? 0}</span>/4</li>
                        </ul>
                      </div>
                    </div>

                    {/* GHS Pictograms cards list */}
                    {selectedChemical.ghsPictograms && selectedChemical.ghsPictograms.length > 0 && (
                      <div className="border-t border-slate-855 pt-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-sans">GHS Pictogram Alerts</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedChemical.ghsPictograms.map((pic, i) => (
                            <GhsCautionCard key={i} category={pic} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risks listings statements */}
                    <div className="border-t border-slate-855 pt-4 text-xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 font-sans">Standard Hazard Statements</span>
                      <div className="space-y-1 bg-rose-950/20 p-3 rounded-lg border border-rose-900/40">
                        {selectedChemical.hazards.map((haz, i) => (
                          <p key={i} className="text-slate-300 pl-2 border-l-2 border-rose-505 leading-normal font-sans font-medium">{haz}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary applications / industrial uses card */}
                  <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-550 uppercase tracking-widest border-b border-slate-850 pb-2 mb-3">Industrial & Practical Uses</h4>
                    <div className="space-y-2 mt-2 flex flex-col gap-1.5 text-xs text-slate-300 font-sans font-medium">
                      {selectedChemical.uses.map((use, i) => (
                        <div key={i} className="flex gap-2 items-start bg-[#0A0B0E]/60 p-2.5 rounded-lg border border-slate-850">
                          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0 mt-1.5" />
                          <p className="leading-relaxed text-slate-300 font-medium">{use}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB WORKSPACE 2: Elements Periodic Table Grid explorer */}
        {activeTab === 'periodic' && (
          <PeriodicTable onSearchElement={handlePeriodicElementSearch} />
        )}

        {/* TAB WORKSPACE 3: AI Reaction equations stoichiometry solver */}
        {activeTab === 'reaction' && (
          <ReactionPredictorTab />
        )}

        {/* TAB WORKSPACE 4: AI Chemist conversational academic helper */}
        {activeTab === 'chemist' && (
          <AIChemistTab />
        )}

        {/* TAB WORKSPACE 5: About, Documentation and feedback page */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-text leading-normal">
            
            {/* Project Overview & Info block split */}
            <div className="lg:col-span-2 bg-[#111318] border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-955/20 border border-cyan-900/50 rounded-full mb-1">
                Project Description & Innovation
              </span>
              
              <h2 className="text-xl font-serif font-black tracking-tight text-white">About CHEMIZIC</h2>
              
              <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                <strong className="text-white font-semibold">CHEMIZIC</strong> is an advanced visual and cognitive biochemistry database platform developed to support secondary students, scientists, laboratory engineers, and academic researchers in exploring the world of chemical compounds through an intelligent and interactive ecosystem.
              </p>

              <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                The platform integrates real-time chemical compound registries from the <strong className="text-white font-semibold">PubChem REST Database API</strong> provided by the National Library of Medicine, enabling users to access authentic molecular structures, compound characteristics, and scientific data with precision and efficiency. By combining modern Artificial Intelligence techniques with data-structure-driven architecture, CHEMIZIC delivers dynamic visual mapping of chemical properties on demand, creating a smarter and more intuitive learning and research environment.
              </p>

              <div className="bg-cyan-950/10 border border-cyan-900/30 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-sans font-medium">
                Designed and conceptualized by first-year Computer Science & Engineering students of{' '}
                <a 
                  href="https://share.google/M7wIMYupNAiMfZx2e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 font-semibold hover:underline underline-offset-2 decoration-cyan-500/50"
                >
                  Narula Institute of Technology
                </a>
                , this project reflects innovation, technical creativity, and interdisciplinary application of computational science in chemistry.
              </div>

              <div className="border-t border-slate-850 pt-5 space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 pb-2">
                  <GraduationCap size={15} /> Development Team
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Prantik Das',
                    'Ishita Parvin',
                    'Soumodip Khalko',
                    'Priyajeet Ghosh'
                  ].map((member) => (
                    <div key={member} className="flex items-center gap-3 bg-[#0A0B0E]/60 p-3 rounded-lg border border-slate-850 hover:border-cyan-500/30 transition-all">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <div>
                        <p className="text-xs font-bold text-white font-mono">{member}</p>
                        <p className="text-[10px] text-slate-500 font-sans font-medium">CSE Student • Developer</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-850 pt-5">
                <p className="text-xs text-slate-400 leading-relaxed italic font-sans font-medium">
                  CHEMIZIC represents a fusion of scientific intelligence, educational accessibility, and AI-powered visualization — aiming to simplify complex biochemical data for the next generation of learners and researchers.
                </p>
              </div>
            </div>

            {/* User Feedback & Contact panel sidebar block */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-2">Feedback & Lab Support</h3>
              
              {feedbackSent ? (
                <div className="bg-emerald-950/20 border border-emerald-900/50 text-emerald-300 rounded-xl p-4 text-xs font-medium text-center space-y-2 animate-bounce-short">
                  <CheckCircle2 size={24} className="text-emerald-400 mx-auto" />
                  <h4 className="font-bold">Transmission Succeeded</h4>
                  <p className="opacity-90">Your educational suggestions have been loaded to the developer repository.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Submit chemical additions, periodic data corrections, or general application suggestions directly.
                  </p>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={feedback.name}
                      onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                      placeholder="e.g. Prof. Arfwedson"
                      className="w-full text-xs bg-[#0A0B0E] px-3 py-2 border border-slate-800 rounded focus:border-cyan-500 focus:bg-[#0A0B0E] outline-none font-medium text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={feedback.email}
                      onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                      placeholder="e.g. teacher@university.edu"
                      className="w-full text-xs bg-[#0A0B0E] px-3 py-2 border border-slate-800 rounded focus:border-cyan-500 focus:bg-[#0A0B0E] outline-none font-medium text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Inquiry / Suggestion</label>
                    <textarea
                      required
                      rows={3}
                      value={feedback.message}
                      onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                      placeholder="Request custom chemical addition, report data variance..."
                      className="w-full text-xs bg-[#0A0B0E] px-3 py-2 border border-slate-800 rounded focus:border-cyan-500 focus:bg-[#0A0B0E] outline-none font-medium text-slate-200 resize-none leading-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-semibold text-xs rounded transition-colors cursor-pointer text-center"
                  >
                    Transmit Feedback
                  </button>
                </form>
              )}

              {/* Static support tags */}
              <div className="border-t border-slate-850 pt-4 space-y-2 select-text text-slate-350 text-xs font-sans">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Mail size={12} className="text-slate-500 shrink-0" />
                  <span>dasprantik413@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium font-sans">
                  <MapPin size={12} className="text-slate-500 shrink-0" />
                  <span>
                    <a 
                      href="https://share.google/M7wIMYupNAiMfZx2e"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 text-slate-300 transition-colors underline decoration-dotted decoration-cyan-500/50 underline-offset-2"
                    >
                      Narula Institute of Technology
                    </a>
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER: Standard humble scientific credit label */}
      <footer className="bg-[#0A0B0E] border-t border-slate-800 select-none py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10.5px] text-slate-400">
          <div>
            <p className="font-mono">CHEMIZIC DATABASE SYSTEM — UNIVERSITY LAB CO-OP</p>
            <p className="mt-0.5 opacity-60">Connecting visual particle dynamics with artificial reasoning layers.</p>
          </div>
          <p className="opacity-60 text-right">Licensed under Apache-2.0. Open Academic Resource &copy; 2026.</p>
        </div>
      </footer>

    </div>
  );
}

// NFPA 704 standard SVG diamond drawer. Highly precise coordinates layout.
function NfpanDiamondSvg({ health = 0, flammability = 0, instability = 0, special = '' }: { health: number; flammability: number; instability: number; special?: string }) {
  return (
    <svg viewBox="0 0 120 120" className="w-24 h-24 select-none filter drop-shadow font-mono">
      {/* Blue Diamond (Health) - Left quadrant */}
      <polygon points="60,60 30,30 0,60 30,90" fill="#2563eb" stroke="#1e293b" strokeWidth="1.5" />
      <text x="30" y="66" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">{health}</text>

      {/* Red Diamond (Flammability) - Top quadrant */}
      <polygon points="60,60 30,30 60,0 90,30" fill="#dc2626" stroke="#1e293b" strokeWidth="1.5" />
      <text x="60" y="36" fill="#ffffff" fontSize="18" fontWeight="bold" textAnchor="middle">{flammability}</text>

      {/* Yellow Diamond (Instability) - Right quadrant */}
      <polygon points="60,60 90,30 120,60 90,90" fill="#eab308" stroke="#1e293b" strokeWidth="1.5" />
      <text x="90" y="66" fill="#0f172a" fontSize="18" fontWeight="bold" textAnchor="middle">{instability}</text>

      {/* White Diamond (Special Hazards) - Bottom quadrant */}
      <polygon points="60,60 30,90 60,120 90,90" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
      <text x="60" y="96" fill="#030712" fontSize="13" fontWeight="black" textAnchor="middle">{special || 'W'}</text>
    </svg>
  );
}

// Compact warning card for standard GHS Pictograms (caution red diamond design)
function GhsCautionCard({ category }: { category: string; key?: any }) {
  const getLabelInfo = (cat: string) => {
    switch (cat.trim().toLowerCase()) {
      case 'flammable':
        return { text: 'Flammable gas/liquid', icon: <Flame size={14} className="text-red-650" /> };
      case 'toxic-hazard':
        return { text: 'Acute Toxicity', icon: <AlertOctagon size={14} className="text-red-650" /> };
      case 'corrosive':
        return { text: 'Corrosive burn substance', icon: <AlertTriangle size={14} className="text-red-650 animate-pulse" /> };
      case 'explosive':
        return { text: 'Explosion Danger', icon: <span className="text-[10px] text-red-700 font-bold">BOMB</span> };
      case 'environmental':
        return { text: 'Environmental Hazard', icon: <span className="text-[10px] text-red-700 font-bold">ECO</span> };
      case 'danger-health':
        return { text: 'Severe Health Hazard', icon: <AlertOctagon size={14} className="text-red-700" /> };
      case 'gas-cylinder':
        return { text: 'Compressed Gas', icon: <span className="text-[10px] text-red-700 font-bold">CYL</span> };
      default:
        return { text: 'Warning hazard', icon: <AlertTriangle size={14} className="text-red-650" /> };
    }
  };

  const info = getLabelInfo(category);

  return (
    <div className="flex items-center gap-2 border border-red-200/80 bg-red-50/20 px-2 py-1.5 rounded-lg shrink-0 select-none">
      {/* rotated square shape */}
      <div className="w-6 h-6 border-2 border-red-600 bg-white rotate-45 flex items-center justify-center shrink-0">
        <div className="-rotate-45">
          {info.icon}
        </div>
      </div>
      <span className="text-[10px] font-bold text-red-800 tracking-tight leading-none">{info.text}</span>
    </div>
  );
}

// Formula subscripts converter (e.g. converting H2O to H<sub>2</sub>O)
function formatFormulaSubscripts(eq: string) {
  if (!eq) return '';
  return eq.replace(/([A-Za-z])(\d+)/g, '$1<sub>$2</sub>');
}
