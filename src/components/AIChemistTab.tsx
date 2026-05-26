/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExplainResponse } from '../types';
import { Send, HelpCircle, GraduationCap, Microscope, ShieldAlert, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export default function AIChemistTab() {
  const [topicInput, setTopicInput] = useState<string>('Sodium Chloride');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ExplainResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active view toggle on small screen (Student mode vs scientific mode)
  const [activeTab, setActiveTab] = useState<'student' | 'scientist'>('student');

  // Interactive templates
  const presets = [
    { label: "Water Hydrodynamics", text: "Water" },
    { label: "Benzene Ring Resonance", text: "Benzene and aromatic stability" },
    { label: "Caffeine Synapses", text: "Caffeine" },
    { label: "Sulfuric Acid Acidity", text: "Sulfuric Acid" },
    { label: "Glucose Energy Metabolism", text: "Glucose in cells" }
  ];

  const handleAsk = async (chemical: string, customQuestion?: string) => {
    const chemicalName = chemical.trim();
    if (!chemicalName) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/chemical/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chemicalName, customQuestion })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Chemist database.");
      }

      const data: ExplainResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("AI explanation generated an issue. Verify your API configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search selection block */}
      <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">AI Chemist Academic Advisor</h3>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Ask our educational assistant to break down any chemical compound, periodic element, or general chemistry topic. Click the topic chips or formulate a custom question.
        </p>

        {/* Input form */}
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleAsk(topicInput, customQuery); 
          }} 
          className="space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Target Subject / Compound</label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g., Benzene, Ethanol, Covalent Bond"
                className="w-full text-xs bg-[#0A0B0E] px-3.5 py-2.5 border border-slate-800 focus:border-cyan-500 focus:bg-[#0A0B0E] rounded-lg outline-none font-sans font-semibold text-slate-200"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Custom Inquiry (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Explain its stereochemistry orbital bonds / or simplify with analogy..."
                  className="w-full text-xs bg-[#0A0B0E] pl-3.5 pr-12 py-2.5 border border-slate-800 focus:border-cyan-500 focus:bg-[#0A0B0E] rounded-lg outline-none text-slate-200 font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 text-xs top-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-800 text-white rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Send size={11} className="fill-white" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Quick presets list */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Quick Topics:</span>
          {presets.map((p) => (
            <button
              key={p.text}
              type="button"
              onClick={() => { 
                setTopicInput(p.text); 
                setCustomQuery('');
                handleAsk(p.text); 
              }}
              className="px-2.5 py-1 text-[10px] bg-[#0A0B0E] border border-slate-800 hover:bg-cyan-950/40 hover:border-cyan-800 hover:text-cyan-400 text-slate-400 rounded-md transition-all font-sans font-medium cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 text-rose-800 text-xs">
          <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">AI Assistant Request Error</h4>
            <p className="mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* LOADING SECTION */}
      {loading && (
        <div className="bg-[#111318] border border-slate-800 rounded-xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative mb-4 flex items-center justify-center">
            <span className="w-12 h-12 border-2 border-slate-800 border-t-cyan-500 rounded-full animate-spin absolute" />
            <GraduationCap size={20} className="text-cyan-400 animate-pulse" />
          </div>
          <h4 className="text-xs font-semibold text-slate-200 animate-pulse">Consulting Chemistry Core...</h4>
          <p className="text-[10px] text-slate-400 mt-1 max-w-sm">
            Gemini is compiling two complementary learning perspectives: simplified high-school analogies and advanced university-level quantum molecular mechanics.
          </p>
        </div>
      )}

      {/* RESULTS DISPLAY split mode */}
      {result && (
        <div className="space-y-6 select-text">
          
          {/* Main header result title card */}
          <div className="bg-cyan-950/25 border border-cyan-900/50 text-white rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] bg-cyan-900/30 border border-cyan-800/35 text-cyan-300 uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-full">
                Interactive Chemistry Briefing
              </span>
              <h2 className="text-xl font-serif font-semibold tracking-tight mt-3">{result.chemicalName}</h2>
              {customQuery && (
                <p className="text-xs text-slate-400 mt-1.5 italic font-sans font-medium">Inquiry: "{customQuery}"</p>
              )}
            </div>
            {/* Ambient pattern decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-900 rounded-full blur-2xl opacity-20 transform translate-x-12 -translate-y-12" />
          </div>

          {/* Desktop Dual Column split / Mobile toggle view */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
            
            {/* Student perspective card */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-750 transition-colors flex flex-col justify-between font-sans">
              <div>
                <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-3 select-none pb-2 border-b border-slate-850/60">
                  <GraduationCap size={15} /> Student Mode (Simplified Analogies)
                </h4>
                <div 
                  className="text-xs text-slate-300 leading-relaxed font-sans font-medium space-y-2 select-text" 
                  dangerouslySetInnerHTML={{ __html: formatMarkdownParagraphs(result.studentExplanation) }}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-850 bg-cyan-950/10 p-3 rounded-lg border border-cyan-900/10">
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Learning Fact</span>
                <p className="text-[11px] leading-relaxed text-slate-300 italic font-sans font-semibold">"{result.funFact}"</p>
              </div>
            </div>

            {/* Scientist perspective card */}
            <div className="bg-[#111318] border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-750 transition-colors flex flex-col border-l-light-indigo font-sans">
              <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-3 select-none pb-2 border-b border-slate-850/60">
                <Microscope size={15} /> Scientist Mode (Structure & Quantum Physics)
              </h4>
              <div 
                className="text-xs text-slate-300 leading-relaxed font-sans font-medium space-y-2 select-text" 
                dangerouslySetInnerHTML={{ __html: formatMarkdownParagraphs(result.scientistExplanation) }}
              />
            </div>

          </div>

          {/* Laboratory handling safety box at the bottom */}
          <div className="bg-yellow-950/10 border border-yellow-900/30 rounded-xl p-5 shadow-sm">
            <h4 className="text-xs font-medium text-yellow-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-yellow-900/30 mb-3">
              <ShieldAlert size={14} className="text-yellow-400 animate-pulse" /> Laboratory Handling & Safety Precautions
            </h4>
            <div 
              className="text-xs text-slate-300 leading-relaxed font-sans font-medium select-text"
              dangerouslySetInnerHTML={{ __html: formatMarkdownParagraphs(result.safetySummary) }}
            />
          </div>

        </div>
      )}
    </div>
  );
}

// Custom simple parser converting standard bold and lists to HTML styled tags
function formatMarkdownParagraphs(md: string) {
  if (!md) return '';
  let html = md;
  
  // Format bold markers
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  
  // Format list markers
  html = html.replace(/^\*\s(.*)$/gm, '<li class="ml-4 list-disc pl-1 mb-1 font-sans text-slate-300 font-medium">$1</li>');
  html = html.replace(/^\-\s(.*)$/gm, '<li class="ml-4 list-disc pl-1 mb-1 font-sans text-slate-300 font-medium">$1</li>');

  // Format line breaks to paragraphs
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<li')) {
      return p;
    }
    return `<p class="mb-3 pl-0.5 text-slate-300 leading-relaxed font-sans font-medium select-text">${p}</p>`;
  }).join('');

  return html;
}
