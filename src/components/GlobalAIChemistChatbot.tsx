/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { ChatMessage } from '../types';
import { 
  Bot, Send, X, Sparkles, MessageSquare, 
  HelpCircle, ChevronRight, Zap, RefreshCw, 
  Minimize2, Maximize2, GraduationCap, Lightbulb, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalAIChemistChatbotProps {
  currentTabContext?: string;
}

export const GlobalAIChemistChatbot: React.FC<GlobalAIChemistChatbotProps> = ({
  currentTabContext = 'General Chemistry'
}) => {
  const { currentUser, recordFeatureUsage } = useAuthAndQuiz();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat message thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Greetings! I am your **AI Chemist Tutor** 🔬. I am connected live across all sections of CHEMIZIC to help you solve problems step-by-step, balance reactions, explain formulas, or guide you through quiz questions!`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Explain the Nernst Equation',
        'How to balance redox reactions?',
        'VSEPR shapes & hybridization',
        'Help with my current topic'
      ],
      stepByStepSolution: [
        'Ask about any chemistry concept or problem you encounter in the lab.',
        'I provide step-by-step logic, relevant formulas, and units checks.',
        'You can also ask for hints without giving away quiz answers!'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Listen for global help requests from any problem or assignment
  useEffect(() => {
    const handleGlobalTrigger = (e: any) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e.detail?.prompt) {
        handleSendMessage(e.detail.prompt);
      }
    };
    window.addEventListener('open-ai-chemist-tutor', handleGlobalTrigger as EventListener);
    return () => window.removeEventListener('open-ai-chemist-tutor', handleGlobalTrigger as EventListener);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Prepare multi-turn conversation history for context continuity
      const chatHistory = messages
        .filter(m => m.id !== 'msg_welcome')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      const response = await fetch('/api/chemist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: `User is on tab: ${currentTabContext}`,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error('Chat service temporarily unavailable.');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the chemical explanation for your query.',
        timestamp: new Date().toISOString(),
        source: data.source || 'ai',
        suggestions: data.suggestions || ['Ask another question', 'Explain further', 'Give a practice problem'],
        stepByStepSolution: data.stepByStepSolution
      };

      setMessages(prev => [...prev, botMsg]);

      // Record feature activity
      recordFeatureUsage(
        'chemist',
        'AI Chemist Tutor Chatbot',
        `Asked tutor: "${query.substring(0, 40)}..." in ${currentTabContext}`,
        'AI Consultation',
        15
      );
    } catch (err: any) {
      console.warn("Chatbot request failed, using intelligent local tutor fallback:", err);
      const fallbackMsg: ChatMessage = {
        id: `bot_fb_${Date.now()}`,
        sender: 'assistant',
        text: `AI service unavailable right now. Using local chemistry reasoning for **"${query}"**:\n- Review stoichiometric atomic balances and oxidation states.\n- Convert temperature to absolute Kelvin: $T(K) = \\theta(^\\circ C) + 273.15$.\n- In equilibrium expressions, pure solids ($s$) and liquids ($l$) have an activity of 1.\nWould you like a step-by-step derivation or a practice question?`,
        timestamp: new Date().toISOString(),
        source: 'local_fallback',
        isError: true,
        suggestions: ['Explain Nernst Equation', 'How to balance Redox reactions?', 'Give a hint']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-text font-mono">
      {/* TRIGGER BUTTON (when closed or minimized) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-cyan-950/90 via-[#0e1117] to-purple-950/90 border border-cyan-400/40 hover:border-cyan-300 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all cursor-pointer backdrop-blur-xl"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-black font-bold shadow-lg">
              <Bot size={20} className="text-black" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-black rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-black rounded-full" />
          </div>

          <div className="text-left hidden sm:block pr-1">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>AI Chemist Tutor</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                ACTIVE
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Need help? Ask for solutions & hints 🔬
            </div>
          </div>
        </motion.button>
      )}

      {/* CHATBOT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`w-[92vw] sm:w-[420px] bg-[#0c0e14]/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden flex flex-col transition-all ${
              isMinimized ? 'h-[64px]' : 'h-[580px] max-h-[85vh]'
            }`}
          >
            {/* CHATBOT TOP BAR */}
            <div className="p-3.5 px-4 bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-purple-950/60 border-b border-cyan-500/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-black font-black">
                  <Bot size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white tracking-wide">ChemiZIC AI Tutor</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[9.5px] text-cyan-300/80 font-mono">
                    Context: <span className="capitalize">{currentTabContext}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Quick Solutions Bar for Chemistry Problems */}
            {!isMinimized && (
              <div className="p-2 bg-black/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] shrink-0">
                <span className="text-slate-500 uppercase font-mono text-[9px] shrink-0 px-1">Solve:</span>
                {[
                  { label: '⚖️ Balance Reaction', prompt: 'Help me balance this chemical equation step-by-step: ' },
                  { label: '⚡ Nernst EMF', prompt: 'Explain how to calculate cell EMF using the Nernst Equation' },
                  { label: '🧪 pH / pOH', prompt: 'How do I calculate pH, pOH, [H+], and [OH-] for strong and weak acids?' },
                  { label: '📐 VSEPR Shapes', prompt: 'Summarize VSEPR molecular geometry, lone pairs, and bond angles' },
                  { label: '🌡️ Gibbs Free Energy', prompt: 'Explain Gibbs free energy spontaneity conditions ΔG = ΔH - TΔS' },
                  { label: '❌ Diagnose Mistake', prompt: 'Why is my answer wrong? Help me identify the misconception in my work' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 text-cyan-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 whitespace-nowrap cursor-pointer transition-all shrink-0 font-mono"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* CHAT BODY & MESSAGE STREAM */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
                  {messages.map(msg => (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {/* Scientific Status Badge */}
                      {msg.sender === 'assistant' && msg.id !== 'msg_welcome' && (
                        <div className="flex items-center gap-1.5 mb-1 ml-0.5">
                          {msg.source === 'ai' ? (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono font-bold flex items-center gap-1">
                              <Sparkles size={9} /> AI RESPONSE
                            </span>
                          ) : (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono font-bold flex items-center gap-1">
                              <BookOpen size={9} /> LOCAL CHEMISTRY FALLBACK
                            </span>
                          )}
                          {msg.isError && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30 font-mono">
                              OFFLINE
                            </span>
                          )}
                        </div>
                      )}

                      <div 
                        className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-sans text-xs rounded-br-none shadow-md'
                            : 'bg-slate-900/90 border border-cyan-500/20 text-slate-200 font-sans text-xs rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.text}

                        {/* Step by step solution box if available */}
                        {msg.stepByStepSolution && msg.stepByStepSolution.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1.5 font-mono text-[11px] text-cyan-200 bg-black/30 p-2.5 rounded-xl">
                            <div className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
                              <Lightbulb size={12} /> Step-by-Step Problem Solving:
                            </div>
                            {msg.stepByStepSolution.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span className="text-cyan-400 font-bold shrink-0">→</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Retry Button if Fallback */}
                      {msg.source === 'local_fallback' && msg.id !== 'msg_welcome' && (
                        <button
                          onClick={() => {
                            const idx = messages.findIndex(m => m.id === msg.id);
                            const prevUserMsg = idx > 0 ? messages[idx - 1] : null;
                            if (prevUserMsg) handleSendMessage(prevUserMsg.text);
                          }}
                          className="mt-1.5 text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-mono ml-1 hover:underline"
                        >
                          <RefreshCw size={10} /> Retry with Gemini AI
                        </button>
                      )}

                      {/* Clickable prompt suggestions */}
                      {msg.suggestions && msg.suggestions.length > 0 && msg.sender === 'assistant' && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              className="px-2.5 py-1 rounded-full bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>{sug}</span>
                              <ChevronRight size={10} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2 p-3 bg-slate-900/70 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 w-fit">
                      <Sparkles size={14} className="animate-spin text-cyan-400" />
                      <span className="font-mono text-[11px]">AI Chemist solving problem...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* INPUT BAR */}
                <div className="p-3 border-t border-slate-800 bg-black/40 shrink-0">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }} 
                    className="flex items-center gap-2 relative"
                  >
                    <input
                      type="text"
                      placeholder="Ask any chemistry problem, equation, or homework query..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#111318] border border-cyan-500/25 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder:text-slate-500 outline-none font-mono transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || loading}
                      title="Send question to AI Chemist"
                      className="absolute right-1.5 p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all disabled:opacity-30 disabled:hover:bg-cyan-500 cursor-pointer"
                    >
                      <Send size={13} />
                    </button>
                  </form>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1.5 px-1 font-mono">
                    <span>Press Enter to send</span>
                    <span>AI Chemist reasoning live</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
