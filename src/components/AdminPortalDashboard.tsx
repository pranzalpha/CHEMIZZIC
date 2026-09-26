/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { UserRole } from '../types';
import { 
  Shield, Users, GraduationCap, Award, Database, 
  Settings, KeyRound, Sparkles, CheckCircle2, AlertTriangle, 
  Trash2, RefreshCw, BarChart3, FileText, Activity
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPortalDashboardProps {
  onSwitchToStudentPortal?: () => void;
  onSwitchToTeacherPortal?: () => void;
  onOpenAuthModal?: () => void;
}

export const AdminPortalDashboard: React.FC<AdminPortalDashboardProps> = ({
  onSwitchToStudentPortal,
  onSwitchToTeacherPortal,
  onOpenAuthModal
}) => {
  const { 
    currentUser, 
    allStudents, 
    assignments, 
    leaderboard, 
    featureLogs, 
    login 
  } = useAuthAndQuiz();

  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'assignments' | 'audit' | 'database'>('users');
  const [searchUser, setSearchUser] = useState('');

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin';

  const handleAdminUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (adminPasscode.trim() === 'pran123.' || adminPasscode.trim() === 'admin123') {
      try {
        await login('admin@chemizic.com', 'PrantikDasAdmin', adminPasscode, 'admin');
      } catch (err: any) {
        setAuthError(err?.message || 'Admin authentication failed.');
      }
    } else {
      setAuthError('Invalid administrator credentials.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center font-mono select-text space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(245,158,11,0.15)]">
          <Shield size={38} />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
            Restricted Core Zone
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Administrator Command Node</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-md mx-auto">
            This terminal governs global user accounts, teacher credentials, assignment logs, and database schemas. Enter master administrative credentials to proceed.
          </p>
        </div>

        <form onSubmit={handleAdminUnlock} className="p-6 rounded-2xl bg-black/50 border border-slate-800 space-y-4 max-w-sm mx-auto">
          {authError && (
            <div className="p-2.5 bg-red-950/40 border border-red-800 text-red-300 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1 text-left">
              Admin Master Passkey:
            </label>
            <input
              type="password"
              required
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              placeholder="Enter admin passkey..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-cyan-200 outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
          >
            <KeyRound size={14} /> Unlock Admin Portal
          </button>

          <p className="text-[10px] text-slate-500 pt-1">
            Demo passkey: <code className="text-amber-300">pran123.</code>
          </p>
        </form>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => onSwitchToStudentPortal?.()}
            className="text-xs text-cyan-400 hover:underline cursor-pointer"
          >
            ← Return to Student Hub
          </button>
          <span className="text-slate-700">•</span>
          <button
            onClick={() => onSwitchToTeacherPortal?.()}
            className="text-xs text-purple-400 hover:underline cursor-pointer"
          >
            Go to Teacher Portal →
          </button>
        </div>
      </div>
    );
  }

  const filteredStudents = allStudents.filter(s => 
    s.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    s.student_id.toLowerCase().includes(searchUser.toLowerCase()) ||
    s.class.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="space-y-8 select-text font-mono">
      {/* 1. ADMIN HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-purple-950/20 border border-amber-500/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.04)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/30 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Shield size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">System Administrator Command Node</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase">
                Root Clearance
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Master control of enrolled student cohorts, faculty credentials, syllabus questions, and audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSwitchToTeacherPortal?.()}
            className="px-3.5 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Users size={13} /> Teacher Portal
          </button>
          <button
            onClick={() => onSwitchToStudentPortal?.()}
            className="px-3.5 py-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <GraduationCap size={13} /> Student Portal
          </button>
        </div>
      </div>

      {/* 2. SYSTEM KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e1117] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Registered Students</span>
          <div className="text-3xl font-black text-white">{allStudents.length}</div>
          <span className="text-[10px] text-cyan-400 block pt-1">Across 3 academic cohorts</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1117] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Active Assignments</span>
          <div className="text-3xl font-black text-purple-300">{assignments.length}</div>
          <span className="text-[10px] text-slate-400 block pt-1">Dispatched homework sets</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1117] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Question Bank Size</span>
          <div className="text-3xl font-black text-amber-400">100+</div>
          <span className="text-[10px] text-emerald-400 block pt-1">Verified Chemistry Questions</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1117] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Audit Log Events</span>
          <div className="text-3xl font-black text-cyan-300">{featureLogs.length}</div>
          <span className="text-[10px] text-cyan-400 block pt-1">Live recorded actions</span>
        </div>
      </div>

      {/* 3. TABS: USERS, ASSIGNMENTS, AUDIT */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'users', label: 'Student & Teacher Rosters 👥' },
          { id: 'assignments', label: 'All Dispatched Assignments 📋' },
          { id: 'audit', label: 'Platform Activity Audit 🔍' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                : 'text-slate-400 hover:text-white bg-black/30 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: USERS ROSTER */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-[#0e1117] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Enrolled Academic Profiles</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Manage student identities, rolls, sections, and roles.</p>
            </div>
            <input
              type="text"
              placeholder="Search by name, ID or class..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="bg-black/50 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-cyan-200 outline-none focus:border-amber-400 w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Student / User</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Class & Section</th>
                  <th className="py-2.5 px-3 text-center">Mastery</th>
                  <th className="py-2.5 px-3 text-center">Streak</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map(student => (
                  <tr key={student.student_id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{student.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {student.student_id}</div>
                    </td>
                    <td className="py-3 px-3 text-cyan-300 font-bold">
                      {student.roll_no || '24'}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {student.class}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-400">
                      {student.overall_mastery}%
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-orange-400">
                      {student.streak} days 🔥
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/40 border border-cyan-800 text-cyan-300 uppercase font-bold">
                        Enrolled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="p-6 rounded-2xl bg-[#0e1117] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">All Dispatched Assignments</h3>
            <span className="text-xs text-slate-500">{assignments.length} Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map(asg => (
              <div key={asg.id} className="p-4 rounded-xl bg-black/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-800 font-bold">
                    {asg.concept_name}
                  </span>
                  <span className="text-slate-400 font-mono">Due: {asg.due_date}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{asg.title}</h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{asg.instructions}</p>
                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-800/80 text-slate-500">
                  <span>Assigned by: <strong className="text-slate-300">{asg.assigned_by}</strong></span>
                  <span className="text-emerald-400 font-bold">{asg.completed_by.length} submissions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PLATFORM AUDIT */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-[#0e1117] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform Live Audit Ledger</h3>
            <span className="text-xs text-cyan-400">{featureLogs.length} events logged</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {featureLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-black/40 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.feature_name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs font-sans mt-0.5">{log.action}</p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    User: {log.student_id} • {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className="text-amber-400 font-bold shrink-0">+{log.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
