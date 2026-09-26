/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ChemiZIC AI Mind Map Generator & Concept Topology Navigator
 * Dynamically visualizes hierarchical concept structures, prerequisites,
 * mastery scores, and links directly to targeted practice and revision.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitBranch, ChevronRight, ChevronDown, Sparkles, BookOpen, 
  Target, AlertTriangle, CheckCircle2, Play, RefreshCw, Zap,
  Layers, Search, Compass, Info
} from 'lucide-react';
import { CURRICULUM_TOPICS, buildTopicMindMap } from '../data/curriculumData';
import { MindMapNode } from '../types/curriculum';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';

interface MindMapTabProps {
  onStartPractice?: (conceptId: string, difficulty?: 'easy' | 'medium' | 'hard') => void;
  onLaunchPractice?: (conceptId: string, difficulty?: 'easy' | 'medium' | 'hard') => void;
}

export const MindMapTab: React.FC<MindMapTabProps> = ({ onStartPractice, onLaunchPractice }) => {
  const triggerPractice = onLaunchPractice || onStartPractice;
  const { studentProfile, recordFeatureUsage } = useAuthAndQuiz();
  const [selectedTopicId, setSelectedTopicId] = useState<string>('t_galvanic_daniell_cell');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    root: true,
    t_galvanic_daniell_cell: true,
    c_daniell_cell: true,
    c_standard_electrode_potentials: true
  });
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);

  // Extract student mastery scores mapped by concept id
  const masteryScores = useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(studentProfile.masteries).forEach(([cid, m]: [string, any]) => {
      map[cid] = m?.mastery_score ?? 50;
    });
    return map;
  }, [studentProfile.masteries]);

  // Build the hierarchical mind map tree
  const mindMapTree = useMemo(() => {
    return buildTopicMindMap(selectedTopicId, masteryScores);
  }, [selectedTopicId, masteryScores]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setSelectedNode(null);
    setExpandedNodes({ [topicId]: true });
    recordFeatureUsage(
      'explorer',
      'AI Mind Map Generator',
      `Generated hierarchical mind map for topic: ${topicId}`,
      'Exploration',
      20
    );
  };

  // Node Component for recursive tree rendering
  const renderNode = (node: MindMapNode, depth: number = 0) => {
    const isExpanded = expandedNodes[node.id] ?? depth < 2;
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;
    const mastery = node.masteryScore ?? 50;

    let badgeColor = 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30';
    if (mastery >= 75) badgeColor = 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40';
    else if (mastery < 50) badgeColor = 'bg-rose-950/40 text-rose-300 border-rose-500/40';
    else badgeColor = 'bg-amber-950/40 text-amber-300 border-amber-500/40';

    return (
      <div key={node.id} className="relative select-text">
        {/* Connection Branch Lines */}
        {depth > 0 && (
          <div 
            className="absolute -left-6 top-5 w-6 h-0.5 bg-cyan-500/30"
            style={{ borderBottom: '1px dashed rgba(34, 211, 238, 0.4)' }}
          />
        )}

        <div className="flex items-start gap-2 py-1.5">
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className="mt-2 w-6 h-6 rounded-lg bg-black/60 border border-slate-800 hover:border-cyan-400 flex items-center justify-center text-slate-400 hover:text-cyan-300 transition cursor-pointer"
            >
              {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
          ) : (
            <div className="w-6 h-6 mt-2 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-cyan-500/40" />
            </div>
          )}

          {/* Node Content Card */}
          <div
            onClick={() => setSelectedNode(node)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex-1 max-w-xl ${
              isSelected 
                ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]' 
                : 'bg-[#111318]/90 border-slate-800/80 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  {node.type}
                </span>
                <h4 className="text-sm font-bold text-white font-sans">{node.label}</h4>
              </div>

              {node.masteryScore !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badgeColor}`}>
                  {node.masteryScore}% Mastery
                </span>
              )}
            </div>

            {node.summary && (
              <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-2">
                {node.summary}
              </p>
            )}

            {node.isWeak && (
              <div className="mt-2 text-[10px] font-mono text-rose-300 flex items-center gap-1">
                <AlertTriangle size={11} className="text-rose-400" />
                <span>Weak concept • Recommended for revision</span>
              </div>
            )}
          </div>
        </div>

        {/* Render Children Recursively */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-8 border-l border-cyan-500/20 ml-3 space-y-1"
            >
              {node.children!.map(child => renderNode(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6 select-text">
      
      {/* Header Banner */}
      <div className="bg-[#111318] border border-cyan-500/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <GitBranch className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              AI Chemistry Mind Map Generator
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
              Interactive Topology
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Explore hierarchical chemical concepts, prerequisite chains, weak concept indicators, and real-time mastery tracking across the curriculum.
          </p>
        </div>

        {/* Topic Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400 shrink-0">Topic:</label>
          <select
            value={selectedTopicId}
            onChange={(e) => handleSelectTopic(e.target.value)}
            className="bg-black/60 border border-slate-800 text-cyan-200 text-xs font-mono rounded-xl p-2.5 outline-none focus:border-cyan-400 cursor-pointer"
          >
            {CURRICULUM_TOPICS.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.branch})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Mind Map Tree on Left, Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mind Map Tree Column */}
        <div className="lg:col-span-2 bg-[#0A0B0E] border border-slate-800 rounded-2xl p-6 overflow-x-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-2">
              <Compass size={14} className="text-cyan-400" />
              <span>Hierarchical Concept Graph for <strong>{mindMapTree.label}</strong></span>
            </span>
            <button
              onClick={() => {
                const allKeys: Record<string, boolean> = {};
                const markAll = (n: MindMapNode) => {
                  allKeys[n.id] = true;
                  n.children?.forEach(markAll);
                };
                markAll(mindMapTree);
                setExpandedNodes(allKeys);
              }}
              className="text-cyan-400 hover:text-cyan-300 text-[11px] font-bold cursor-pointer"
            >
              Expand All
            </button>
          </div>

          <div className="pt-2">
            {renderNode(mindMapTree, 0)}
          </div>
        </div>

        {/* Selected Concept / Node Inspector Column */}
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-5 h-fit">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
              Concept Detail & Diagnostics
            </span>
            <h3 className="font-sans text-lg font-bold text-white mt-1">
              {selectedNode ? selectedNode.label : mindMapTree.label}
            </h3>
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Summary:</span>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {selectedNode.summary || 'Hierarchical branch node inside topic structure.'}
                </p>
              </div>

              {selectedNode.masteryScore !== undefined && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-400">Current Student Mastery:</span>
                    <span className={`font-bold ${selectedNode.masteryScore >= 75 ? 'text-emerald-400' : selectedNode.masteryScore < 50 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {selectedNode.masteryScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${selectedNode.masteryScore >= 75 ? 'bg-emerald-400' : selectedNode.masteryScore < 50 ? 'bg-rose-500' : 'bg-amber-400'}`}
                      style={{ width: `${selectedNode.masteryScore}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedNode.formulas && selectedNode.formulas.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Key Formulas & Rules:</span>
                  <div className="space-y-1 font-mono text-[11px] text-cyan-300 bg-cyan-950/20 border border-cyan-500/20 p-3 rounded-xl">
                    {selectedNode.formulas.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {triggerPractice && selectedNode.conceptId && (
                  <button
                    onClick={() => triggerPractice(selectedNode.conceptId!, 'medium')}
                    className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  >
                    <Play size={13} className="fill-black" /> Practice Questions for this Concept
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-ai-chemist-tutor', {
                      detail: {
                        prompt: `Explain the concept "${selectedNode.label}" from the perspective of our chemistry syllabus, covering core formulas and common exam misconceptions.`
                      }
                    }));
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-mono text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={13} className="text-cyan-400" /> Consult AI Chemist on this Node
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 space-y-3 font-sans">
              <p>
                Click on any node in the interactive tree to inspect its conceptual summary, key formulas, prerequisite dependencies, and launch targeted practice sessions.
              </p>
              <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-1 text-[11px] font-mono">
                <div className="text-slate-500 uppercase font-bold">Total Virtual Question Pool:</div>
                <div className="text-cyan-300 font-bold">{mindMapTree.questionsCount || 1200} Questions Available</div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
