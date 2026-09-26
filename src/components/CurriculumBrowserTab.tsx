/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC Complete Curriculum Browser & Academic Topology Station
 * Supports Class 11, Class 12, BSc, MSc, BTech, and MTech
 * Navigates:
 * Education Level ➔ Subject ➔ Unit ➔ Topic ➔ Subtopic ➔ Concept ➔ Prerequisites ➔ Question Pool (1000+ per topic)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Award, BookOpen, Microscope, Cpu, Sparkles, 
  Search, ChevronRight, Play, Layers, Compass, ArrowRight, 
  CheckCircle2, AlertTriangle, ShieldCheck, Filter, GitBranch
} from 'lucide-react';
import { 
  EDUCATION_LEVELS, 
  CURRICULUM_UNITS, 
  CURRICULUM_TOPICS, 
  CURRICULUM_CONCEPTS,
  getUnitsByEducationLevel,
  getTopicsForUnit,
  getConceptsForTopic
} from '../data/curriculumData';
import { EducationLevelId, ConceptDefinition } from '../types/curriculum';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';

interface CurriculumBrowserTabProps {
  onStartPractice?: (conceptId: string, difficulty?: 'easy' | 'medium' | 'hard') => void;
  onOpenMindMap?: (topicId: string) => void;
}

export const CurriculumBrowserTab: React.FC<CurriculumBrowserTabProps> = ({
  onStartPractice,
  onOpenMindMap
}) => {
  const { studentProfile } = useAuthAndQuiz();
  const [selectedLevelId, setSelectedLevelId] = useState<EducationLevelId>('CLASS_12');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedConcept, setSelectedConcept] = useState<ConceptDefinition | null>(null);

  // Icon mapping
  const levelIcons: Record<EducationLevelId, React.ReactNode> = {
    CLASS_11: <GraduationCap size={18} />,
    CLASS_12: <Award size={18} />,
    BSC: <BookOpen size={18} />,
    MSC: <Microscope size={18} />,
    BTECH: <Cpu size={18} />,
    MTECH: <Sparkles size={18} />
  };

  // Units for active level
  const activeUnits = useMemo(() => {
    let units = getUnitsByEducationLevel(selectedLevelId);
    if (selectedBranch !== 'All') {
      units = units.filter(u => u.branch === selectedBranch);
    }
    return units;
  }, [selectedLevelId, selectedBranch]);

  // Total statistics for current level
  const levelStats = useMemo(() => {
    const units = getUnitsByEducationLevel(selectedLevelId);
    let totalTopics = 0;
    let totalConcepts = 0;
    let totalQuestions = 0;

    units.forEach(u => {
      const topics = getTopicsForUnit(u.id);
      totalTopics += topics.length;
      topics.forEach(t => {
        totalQuestions += t.estimatedQuestions || 1000;
        const concepts = getConceptsForTopic(t.id);
        totalConcepts += concepts.length;
      });
    });

    return {
      unitsCount: units.length,
      topicsCount: totalTopics,
      conceptsCount: totalConcepts,
      questionsCount: totalQuestions
    };
  }, [selectedLevelId]);

  // Filtered concepts when searching
  const searchedConcepts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return CURRICULUM_CONCEPTS.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.subtopics.some(s => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 select-text">
      
      {/* Header Banner */}
      <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Compass className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Chemistry Curriculum & Topic Intelligence Station
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              6 Academic Tracks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Structured curriculum across Class 11, Class 12, BSc, MSc, BTech, and MTech with data-driven units, subtopics, prerequisites, and 1000+ question bank scale per topic.
          </p>
        </div>

        {/* Global Search within Curriculum */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts or subtopics..."
            className="w-full bg-black/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:border-cyan-400 font-sans"
          />
        </div>
      </div>

      {/* 1. Education Level Navigation Pills */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {EDUCATION_LEVELS.map(level => {
          const isActive = selectedLevelId === level.id;
          return (
            <button
              key={level.id}
              onClick={() => {
                setSelectedLevelId(level.id);
                setSelectedConcept(null);
                setSearchQuery('');
              }}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between h-[105px] cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-b from-cyan-950/60 to-black border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] text-white' 
                  : 'bg-[#111318]/90 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`p-2 rounded-xl ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-black/40 text-slate-500'}`}>
                  {levelIcons[level.id]}
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{level.id.replace('_', ' ')}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold font-sans line-clamp-1">{level.label}</h4>
                <p className="text-[10px] text-slate-500 truncate font-mono">{level.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Statistics Strip for Selected Level */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111318] border border-slate-800 text-center font-mono">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Curriculum Units</span>
          <span className="text-lg font-bold text-cyan-300">{levelStats.unitsCount} Units</span>
        </div>
        <div className="p-4 rounded-xl bg-[#111318] border border-slate-800 text-center font-mono">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Specialized Topics</span>
          <span className="text-lg font-bold text-purple-300">{levelStats.topicsCount} Topics</span>
        </div>
        <div className="p-4 rounded-xl bg-[#111318] border border-slate-800 text-center font-mono">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Prerequisite Concepts</span>
          <span className="text-lg font-bold text-emerald-300">{levelStats.conceptsCount} Concepts</span>
        </div>
        <div className="p-4 rounded-xl bg-[#111318] border border-slate-800 text-center font-mono">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Virtual Question Capacity</span>
          <span className="text-lg font-bold text-amber-300">{levelStats.questionsCount.toLocaleString()}+ Questions</span>
        </div>
      </div>

      {/* Search Results if query exists */}
      {searchQuery.trim() && (
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
            Matching Concepts for "{searchQuery}" ({searchedConcepts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchedConcepts.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedConcept(c)}
                className="p-3.5 rounded-xl bg-black/40 border border-slate-800 hover:border-cyan-400 cursor-pointer transition space-y-1"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>{c.educationLevel.replace('_', ' ')}</span>
                  <span className="text-cyan-400 font-bold">{c.branch}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-sans">{c.name}</h4>
                <p className="text-xs text-slate-400 font-sans line-clamp-2">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Units & Topics Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Units & Topics Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              {EDUCATION_LEVELS.find(l => l.id === selectedLevelId)?.label} Units
            </h3>

            {/* Branch Filter */}
            <div className="flex gap-1.5 text-[11px] font-mono">
              {['All', 'Physical', 'Inorganic', 'Organic', 'Engineering'].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    selectedBranch === b 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {activeUnits.map(unit => {
              const topics = getTopicsForUnit(unit.id);
              return (
                <div 
                  key={unit.id}
                  className="bg-[#111318] border border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                          Unit {unit.unitNumber} • {unit.branch}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white font-sans">{unit.name}</h4>
                      <p className="text-xs text-slate-400 font-sans">{unit.description}</p>
                    </div>
                  </div>

                  {/* Topics List for Unit */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                      Core Topics & Question Pools:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {topics.map(t => {
                        const concepts = getConceptsForTopic(t.id);
                        return (
                          <div 
                            key={t.id}
                            className="p-3 rounded-xl bg-black/40 border border-slate-800/80 hover:border-cyan-500/30 transition space-y-2 flex flex-col justify-between"
                          >
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                                <span>{concepts.length} Concepts</span>
                                <span className="text-cyan-400 font-bold">{t.estimatedQuestions}+ Qs</span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-200 font-sans">{t.name}</h5>
                              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">{t.description}</p>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                              <div className="flex flex-wrap gap-1">
                                {concepts.slice(0, 2).map(c => (
                                  <button
                                    key={c.id}
                                    onClick={() => setSelectedConcept(c)}
                                    className="px-2 py-0.5 rounded text-[9.5px] font-mono bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 hover:border-cyan-400 cursor-pointer"
                                  >
                                    {c.name}
                                  </button>
                                ))}
                              </div>

                              {onOpenMindMap && (
                                <button
                                  onClick={() => onOpenMindMap(t.id)}
                                  className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  <GitBranch size={11} /> Topology
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Concept Detail Inspector */}
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-5 h-fit">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
              Concept Detail & Direct Practice
            </span>
            <h3 className="font-sans text-lg font-bold text-white mt-1">
              {selectedConcept ? selectedConcept.name : 'Select a concept from left'}
            </h3>
          </div>

          {selectedConcept ? (
            <div className="space-y-4 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Scientific Definition:</span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {selectedConcept.description}
                </p>
              </div>

              {/* Prerequisites Chain */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Prerequisite Concepts:</span>
                {selectedConcept.prerequisites.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedConcept.prerequisites.map(pid => {
                      const prereq = CURRICULUM_CONCEPTS.find(c => c.id === pid);
                      return (
                        <span 
                          key={pid} 
                          className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-purple-950/40 border border-purple-500/30 text-purple-300"
                        >
                          {prereq?.name || pid}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500 italic">None (Foundational Entry Concept)</span>
                )}
              </div>

              {/* Key Formulas */}
              {selectedConcept.keyFormulasAndRules && selectedConcept.keyFormulasAndRules.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Key Formulas & Rules:</span>
                  <div className="space-y-1 font-mono text-[11px] text-cyan-300 bg-cyan-950/20 border border-cyan-500/20 p-3 rounded-xl">
                    {selectedConcept.keyFormulasAndRules.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Mastery */}
              {studentProfile.masteries[selectedConcept.id] && (
                <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-1 font-mono">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Current Student Mastery:</span>
                    <strong className="text-cyan-300">{studentProfile.masteries[selectedConcept.id].mastery_score}%</strong>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {onStartPractice && (
                  <button
                    onClick={() => onStartPractice(selectedConcept.id, 'medium')}
                    className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  >
                    <Play size={13} className="fill-black" /> Launch Practice Questions (1000+ Pool)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-ai-chemist-tutor', {
                      detail: {
                        prompt: `Teach me the concept of "${selectedConcept.name}" including formulas, step-by-step example problem, and common exam traps.`
                      }
                    }));
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-mono text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={13} className="text-cyan-400" /> Ask AI Tutor to Teach This Concept
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 space-y-3 font-sans">
              <p>
                Click any topic or concept tag on the left to examine its scientific description, prerequisite graph, key formulas, and launch practice sets from the scalable 1000+ question bank.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
