import React from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { ConceptMastery } from '../types';

export const StudentPersonaSwitcher: React.FC = () => {
  const { activePersona, switchStudentPersona, studentProfile } = useAuthAndQuiz();

  const masteriesList = (Object.values(studentProfile.masteries) as ConceptMastery[]) || [];
  const lowestConcept = [...masteriesList].sort((a, b) => (a?.mastery_score ?? 50) - (b?.mastery_score ?? 50))[0];
  const highestConcept = [...masteriesList].sort((a, b) => (b?.mastery_score ?? 50) - (a?.mastery_score ?? 50))[0];

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-3 shadow-lg shadow-indigo-950/20 mb-4 backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Header / Context indicator */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white text-sm shadow-md">
            2S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Two-Student Deterministic Demo</span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                LIVE ADAPTIVE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Active: <strong className="text-white">{studentProfile.name}</strong> • Overall Mastery: <span className="font-semibold text-cyan-300">{studentProfile.overall_mastery}%</span>
            </p>
          </div>
        </div>

        {/* Persona Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Student A button */}
          <button
            onClick={() => switchStudentPersona('student_a')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border ${
              activePersona === 'student_a'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-md shadow-amber-900/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
            title="Student A is strong in Atomic Structure & Bonding, weak in Electrochemistry. Will receive Electrochemistry-focused path."
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Student A: Alex</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-amber-200">
              Weak: Electrochemistry (28%)
            </span>
          </button>

          {/* Student B button */}
          <button
            onClick={() => switchStudentPersona('student_b')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 border ${
              activePersona === 'student_b'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-900/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
            title="Student B is strong in Electrochemistry, weak in Chemical Bonding. Will receive Bonding-focused path."
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Student B: Riya</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-cyan-200">
              Weak: Bonding (24%)
            </span>
          </button>

          {/* Custom / Scholar button */}
          <button
            onClick={() => switchStudentPersona('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              activePersona === 'custom'
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            Custom Student
          </button>
        </div>
      </div>

      {/* Path preview banner */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span>
            Strongest: <span className="text-emerald-400 font-medium">{highestConcept?.concept_name} ({highestConcept?.mastery_score}%)</span>
          </span>
          <span>•</span>
          <span>
            Critical Weakness: <span className="text-rose-400 font-medium">{lowestConcept?.concept_name} ({lowestConcept?.mastery_score}%)</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
          <span className="font-semibold">Adaptive Intervention:</span>
          <span>
            {activePersona === 'student_a'
              ? 'Electrochemistry-focused recovery path with Nernst & Daniell modules'
              : activePersona === 'student_b'
              ? 'Chemical Bonding-focused path with VSEPR & Hybridization geometry'
              : 'Balanced curriculum path'}
          </span>
        </div>
      </div>
    </div>
  );
};
