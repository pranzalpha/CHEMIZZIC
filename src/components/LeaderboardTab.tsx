import React from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { Trophy, Award, Sparkles, Star, Users, Zap, Calendar } from 'lucide-react';

export const LeaderboardTab: React.FC = () => {
  const { leaderboard, currentUser } = useAuthAndQuiz();

  // Preset badging standards detail
  const ACHIEVEMENTS_SPECS = [
    { title: 'First Breakthrough', description: 'Complete your first chemistry quiz examination in the arena.', icon: '🎯', criteria: '1 quiz attempt' },
    { title: 'Organic Master', description: 'Answer at least 4 questions correctly in an Organic Chemistry exam.', icon: '🌿', criteria: 'Organic score >= 40' },
    { title: 'Acid Master', description: 'Answer at least 4 questions correctly in an Inorganic Chemistry exam.', icon: '⚗', criteria: 'Inorganic score >= 40' },
    { title: 'Physical Champion', description: 'Answer at least 4 questions correctly in a Physical Chemistry exam.', icon: '⚡', criteria: 'Physical score >= 40' },
    { title: 'Speed Demon', description: 'Secure a high score in Timed countdown mode.', icon: '⏱', criteria: 'Fast reaction answers' },
    { title: 'Lab Scientist', description: 'Reach Experience Level 5 or higher.', icon: '🔬', criteria: 'Level >= 5 reached' },
    { title: 'Molecular Master', description: 'Reach Experience Level 10 or higher.', icon: '🌌', criteria: 'Level >= 10 reached' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-text leading-normal">
      
      {/* LEFT & MID COL: THE RANKINGS DISPLAY TABLE */}
      <div className="lg:col-span-2 bg-[#111318] border border-slate-800 rounded-2xl p-6 space-y-6">
        
        <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="text-yellow-400 animate-pulse" size={20} />
            <div>
              <h3 className="font-serif text-lg font-black text-white">🏆 TOP CHEMISTRY SCHOLARS</h3>
              <p className="text-[10px] text-slate-500 font-mono">Dynamic rankings index updated in real-time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold text-cyan-400 border border-cyan-500/20 bg-cyan-950/20 rounded-full select-none">
            <Calendar size={10} /> WEEKLY LEAGUE ACTIVE
          </div>
        </div>

        {/* Podium visualization of the top 3 */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-center select-none">
          {/* Rank 2 (Left) */}
          {leaderboard[1] && (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between items-center h-full relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-400 text-black text-[9px] font-bold flex items-center justify-center">2</span>
              <div className="pt-2 font-mono">
                <p className="text-xs font-bold text-slate-100 truncate w-full px-1">{leaderboard[1].username}</p>
                <p className="text-cyan-400 text-[10.5px] font-bold mt-1">{leaderboard[1].score} pts</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Lv. {leaderboard[1].level}</p>
              </div>
            </div>
          )}

          {/* Rank 1 (Center) */}
          {leaderboard[0] && (
            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between items-center h-full relative transform scale-105 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-yellow-400 text-black text-[11px] font-black flex items-center justify-center animate-bounce-short">👑</span>
              <div className="pt-2 font-mono">
                <p className="text-xs font-black text-yellow-300 truncate w-full px-1 uppercase tracking-wider">{leaderboard[0].username}</p>
                <p className="text-cyan-300 text-xs font-black mt-1">{leaderboard[0].score} pts</p>
                <p className="text-[9.5px] text-slate-450 mt-0.5 font-bold">Lv. {leaderboard[0].level}</p>
              </div>
            </div>
          )}

          {/* Rank 3 (Right) */}
          {leaderboard[2] && (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 flex flex-col justify-between items-center h-full relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">3</span>
              <div className="pt-2 font-mono">
                <p className="text-xs font-bold text-slate-200 truncate w-full px-1">{leaderboard[2].username}</p>
                <p className="text-cyan-400 text-[10.5px] font-bold mt-1">{leaderboard[2].score} pts</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Lv. {leaderboard[2].level}</p>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Leaderboard Table list */}
        <div className="space-y-2.5 pt-2">
          {leaderboard.map((entry, idx) => {
            const isCurrentUser = currentUser && entry.userId === currentUser.id;
            
            return (
              <div 
                key={entry.userId}
                className={`flex items-center justify-between p-3.5 rounded-xl border font-mono transition-all duration-200 ${isCurrentUser ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-black/20 border-slate-800/80 hover:border-slate-705'}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`w-6 text-center text-xs font-black ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-500' : 'text-slate-600'}`}>
                    #{idx + 1}
                  </span>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${isCurrentUser ? 'text-cyan-300' : 'text-white'}`}>{entry.username}</span>
                      {isCurrentUser && (
                        <span className="px-1.5 py-0.5 text-[8px] bg-cyan-400/20 text-cyan-300 uppercase tracking-widest font-black rounded select-none">YOU</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[9.5px] text-slate-500 mt-0.5">
                      <span>Lv. {entry.level}</span>
                      <span className="h-2 w-px bg-slate-805" />
                      <span>{entry.quizAttempts} Quizzes</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-cyan-300">{entry.score} pts</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {entry.badges.slice(0, 2).map((badge, bIdx) => (
                      <span key={bIdx} className="text-[8.5px]" title={badge}>🏆</span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT SIDEBAR: GAMIFIED CHALLENGES & BADGES SPECS */}
      <div className="space-y-6">
        
        {/* Achievements grid overview */}
        <div className="bg-[#111318] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-805 pb-2">
            <Award className="text-cyan-450 animate-pulse" size={16} />
            <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Research Badges Index</span>
          </div>

          <p className="text-[10px] text-slate-500 leading-normal font-sans">
            Earn research badges and upgrade your title from Beginner Chemist up to Molecular Master by scoring well in chemistry quizzes.
          </p>

          <div className="space-y-3 pt-1">
            {ACHIEVEMENTS_SPECS.map((badgeSpec, idx) => {
              const hasBadge = currentUser && currentUser.role !== 'guest' && currentUser.badges.includes(badgeSpec.title);
              
              return (
                <div 
                  key={idx}
                  className={`flex gap-3 p-3 rounded-xl border text-xs transition-all duration-200 ${hasBadge ? 'border-cyan-500/25 bg-cyan-950/15' : 'border-slate-850 bg-black/15 opacity-60'}`}
                >
                  <span className="text-xl shrink-0 self-center select-none">{badgeSpec.icon}</span>
                  <div className="font-sans min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <h5 className={`font-bold uppercase text-[10px] ${hasBadge ? 'text-cyan-300 font-extrabold' : 'text-slate-400'}`}>
                        {badgeSpec.title}
                      </h5>
                      {hasBadge ? (
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-mono select-none">UNLOCKED</span>
                      ) : (
                        <span className="text-[8px] bg-slate-800 text-slate-500 px-1 py-0.2 rounded font-mono select-none">LOCKED</span>
                      )}
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">{badgeSpec.description}</p>
                    <p className="text-[8.5px] text-slate-550 font-mono uppercase tracking-tight mt-1">{badgeSpec.criteria}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
