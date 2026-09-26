/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Universal Chemistry Omnibar & Intelligent Query Router
 * Intelligently recognizes:
 * - Compounds & Formulas ➔ Molecular Explorer
 * - Chemical Equations & Reactions ➔ Equation Solver / Reaction Predictor
 * - pH Queries ➔ pH Meter Lab
 * - Concepts & Reasoning ➔ AI Chemist Tutor / Knowledge Graph
 * - Numericals ➔ AI Numerical Solver
 * - Elements ➔ Periodic Predictor & Table
 * - Mind Maps & Curriculum ➔ Mind Map / Curriculum Browser
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, Sparkles, ArrowRight, Calculator, Beaker, 
  FlaskConical, Compass, GitBranch, Atom, HelpCircle, BookOpen
} from 'lucide-react';
import { popularChemicals } from '../data/popularChemicals';
import { CURRICULUM_CONCEPTS, CURRICULUM_TOPICS } from '../data/curriculumData';
import { PH_DATABASE } from '../services/phEngine';

export interface UniversalSearchResult {
  category: 'compound' | 'reaction' | 'ph' | 'concept' | 'numerical' | 'element' | 'mindmap';
  title: string;
  subtitle: string;
  targetTab: string;
  queryPayload?: any;
}

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string, payload?: any) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-universal-search'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Intelligent Classification of User Query
  const searchResults: UniversalSearchResult[] = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [
        { category: 'compound', title: 'Benzene (C₆H₆)', subtitle: 'Aromatic hydrocarbon with 6π delocalized ring', targetTab: 'explorer', queryPayload: 'benzene' },
        { category: 'reaction', title: 'KMnO₄ + HCl', subtitle: 'Classic redox equation balancing & chlorine generation', targetTab: 'equation_solver', queryPayload: 'KMnO4 + HCl' },
        { category: 'ph', title: 'Calculate pH of 0.1 M Acetic Acid', subtitle: 'Weak acid thermodynamic ionization', targetTab: 'phmeter', queryPayload: 'ch3cooh' },
        { category: 'concept', title: 'Daniell Cell & Nernst Equation', subtitle: 'Interactive battery simulation and EMF calculation', targetTab: 'daniell_cell' },
        { category: 'mindmap', title: 'Electrochemistry Mind Map', subtitle: 'View concept topology and prerequisites', targetTab: 'mindmap', queryPayload: 't_galvanic_daniell_cell' },
        { category: 'numerical', title: 'AI Numerical Solver', subtitle: 'Solve step-by-step with dimensional analysis', targetTab: 'numerical_solver' }
      ];
    }

    const results: UniversalSearchResult[] = [];

    // 1. Reaction / Equation / Product Prediction query (contains +, ->, ➔, 'predict', 'guess', 'product', or 'react')
    if (q.includes('+') || q.includes('->') || q.includes('➔') || q.includes('predict') || q.includes('guess') || q.includes('product') || q.startsWith('react') || q.includes('balance')) {
      if (q.includes('predict') || q.includes('guess') || q.includes('product')) {
        results.push({
          category: 'reaction',
          title: `Guess The Products: "${query}"`,
          subtitle: 'Test your product prediction mastery across 120+ reaction challenges',
          targetTab: 'guess_products',
          queryPayload: query
        });
      }
      results.push({
        category: 'reaction',
        title: `Solve & Balance Reaction: "${query}"`,
        subtitle: 'Determine oxidation states, half-reactions, and stoichiometric coefficients',
        targetTab: 'equation_solver',
        queryPayload: query
      });
      results.push({
        category: 'reaction',
        title: `Predict Products & Pathways: "${query}"`,
        subtitle: 'Simulate thermodynamic ΔG, ΔH, and condition-dependent products',
        targetTab: 'reaction',
        queryPayload: query
      });
    }

    // 2. pH Query (contains 'ph', 'poh', 'acid', 'base', 'buffer', 'hcl', 'naoh')
    if (q.includes('ph') || q.includes('poh') || q.includes('acid') || q.includes('buffer') || q.includes('indicator')) {
      results.push({
        category: 'ph',
        title: `Calculate Thermodynamic pH: "${query}"`,
        subtitle: 'Route to pH Meter Lab with equilibrium solver & experimental data',
        targetTab: 'phmeter',
        queryPayload: query
      });
    }

    // 3. Numerical query (contains 'calculate', 'emf', 'nernst', 't1/2', 'half life', 'entropy', 'moles', 'molar')
    if (q.includes('calculate') || q.includes('emf') || q.includes('nernst') || q.includes('half-life') || q.includes('half life') || q.includes('crossover') || q.includes('joules') || q.includes('grams') || q.includes('moles') || q.includes('molar')) {
      results.push({
        category: 'numerical',
        title: `Solve Chemistry Numerical: "${query}"`,
        subtitle: 'Step-by-step dimensional analysis & programmatic calculation',
        targetTab: 'numerical_solver',
        queryPayload: query
      });
    }

    // 3b. Direct Conceptual / Question query (e.g. "what is entropy")
    if (/^(what is|why|how|explain|define)\b/i.test(q) || q.includes('entropy')) {
      results.push({
        category: 'concept',
        title: `Ask AI Chemist Tutor: "${query}"`,
        subtitle: 'Get multi-turn pedagogical explanation and step-by-step guidance',
        targetTab: 'chemist',
        queryPayload: query
      });
    }

    // 4. Mind map query
    if (q.includes('mind map') || q.includes('topology') || q.includes('prerequisite') || q.includes('map')) {
      results.push({
        category: 'mindmap',
        title: `Generate Mind Map for "${query}"`,
        subtitle: 'Visual hierarchical tree of chemistry concepts & mastery',
        targetTab: 'mindmap',
        queryPayload: query
      });
    }

    // 5. Daniell Cell / Battery query
    if (q.includes('daniell') || q.includes('galvanic') || q.includes('battery') || q.includes('cell potential') || (q.includes('zn') && q.includes('cu'))) {
      results.push({
        category: 'reaction',
        title: 'Interactive Daniell Cell Simulator',
        subtitle: 'Dynamic Zn | Zn²⁺ || Cu²⁺ | Cu electron flow & Nernst potential',
        targetTab: 'daniell_cell'
      });
    }

    // 6. Match in local popular chemicals & PubChem
    const matchedChems = popularChemicals.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.formula.toLowerCase().includes(q) ||
      (c.iupacName && c.iupacName.toLowerCase().includes(q))
    );
    matchedChems.slice(0, 3).forEach(c => {
      results.push({
        category: 'compound',
        title: `${c.name} (${c.formula})`,
        subtitle: `${c.iupacName || 'Chemical Compound'} • Molar Mass: ${c.molarMass}`,
        targetTab: 'explorer',
        queryPayload: c.name
      });
    });

    // 7. Match in curriculum concepts
    const matchedConcepts = CURRICULUM_CONCEPTS.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
    matchedConcepts.slice(0, 3).forEach(c => {
      results.push({
        category: 'concept',
        title: c.name,
        subtitle: `${c.branch} Chemistry • ${c.educationLevel.replace('_', ' ')}`,
        targetTab: 'curriculum',
        queryPayload: c
      });
    });

    // 8. Always offer AI Chemist consultation
    results.push({
      category: 'concept',
      title: `Ask AI Chemist Tutor: "${query}"`,
      subtitle: 'Get multi-turn pedagogical explanation and step-by-step guidance',
      targetTab: 'chemist',
      queryPayload: query
    });

    return results;
  }, [query]);

  const handleSelectResult = (result: UniversalSearchResult) => {
    onClose();
    onNavigate(result.targetTab, result.queryPayload);
  };

  const getCategoryIcon = (category: UniversalSearchResult['category']) => {
    switch (category) {
      case 'compound': return <Atom size={16} className="text-cyan-400" />;
      case 'reaction': return <FlaskConical size={16} className="text-emerald-400" />;
      case 'ph': return <Beaker size={16} className="text-blue-400" />;
      case 'numerical': return <Calculator size={16} className="text-amber-400" />;
      case 'mindmap': return <GitBranch size={16} className="text-purple-400" />;
      case 'element': return <Sparkles size={16} className="text-orange-400" />;
      default: return <BookOpen size={16} className="text-cyan-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0e1117] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden select-text"
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search size={18} className="text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any compound, formula, reaction (e.g. HCl + NaOH), pH query, or concept..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-500 hover:text-white cursor-pointer">
              <X size={16} />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {searchResults.map((result, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectResult(result)}
              className="p-3 rounded-xl hover:bg-cyan-950/30 hover:border-cyan-500/30 border border-transparent cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-center shrink-0">
                  {getCategoryIcon(result.category)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors font-sans">
                    {result.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                    {result.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>OPEN</span>
                <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>Intelligent Universal Chemistry Router</span>
          <span>Press <strong>Enter</strong> to launch</span>
        </div>
      </motion.div>
    </div>
  );
};
