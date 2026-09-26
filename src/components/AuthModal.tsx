/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuthAndQuiz } from '../context/AuthAndQuizContext';
import { UserRole } from '../types';
import { X, Mail, ShieldAlert, KeyRound, Sparkles, UserPlus, GraduationCap, Users, Shield, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export interface RememberedAccount {
  name: string;
  email: string;
  role: UserRole;
  roll_no?: string;
  student_class?: string;
  section?: string;
  lastLogin: string;
}

const DEFAULT_REMEMBERED_ACCOUNTS: RememberedAccount[] = [
  {
    name: 'Scholar Student',
    email: 'scholar@chemizic.com',
    role: 'student',
    roll_no: '24',
    student_class: 'Class 12',
    section: 'Section B',
    lastLogin: new Date().toISOString()
  },
  {
    name: 'Prof. Arfwedson',
    email: 'teacher@chemizic.com',
    role: 'teacher',
    lastLogin: new Date().toISOString()
  },
  {
    name: 'PrantikDasAdmin',
    email: 'admin@chemizic.com',
    role: 'admin',
    lastLogin: new Date().toISOString()
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialRole }) => {
  const { login, signup } = useAuthAndQuiz();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Role & portal selection
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'student');
  const [portalType, setPortalType] = useState<UserRole>(initialRole || 'student');

  // Input fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [studentClass, setStudentClass] = useState('Class 12');
  const [section, setSection] = useState('Section B');
  const [department, setDepartment] = useState('Physical & Inorganic Chemistry');

  // Remembered accounts from local storage
  const [rememberedAccounts, setRememberedAccounts] = useState<RememberedAccount[]>(() => {
    try {
      const saved = localStorage.getItem('chemizic_remembered_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return DEFAULT_REMEMBERED_ACCOUNTS;
  });

  const saveRememberedAccount = (account: RememberedAccount) => {
    try {
      const filtered = rememberedAccounts.filter(a => a.email.toLowerCase() !== account.email.toLowerCase());
      const updated = [account, ...filtered].slice(0, 8);
      setRememberedAccounts(updated);
      localStorage.setItem('chemizic_remembered_accounts', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save remembered account:", e);
    }
  };

  const handleSelectRememberedAccount = (acc: RememberedAccount) => {
    setEmail(acc.email);
    setUsername(acc.name);
    setPortalType(acc.role);
    if (acc.roll_no) setRollNo(acc.roll_no);
    if (acc.student_class) setStudentClass(acc.student_class);
    if (acc.section) setSection(acc.section);
  };
  
  // Statuses
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePortalSwitch = (role: UserRole) => {
    setPortalType(role);
    setError(null);
    if (role === 'teacher') {
      setEmail('teacher@chemizic.com');
      setUsername('Prof. Arfwedson');
    } else if (role === 'admin') {
      setEmail('admin@chemizic.com');
      setUsername('PrantikDasAdmin');
    } else {
      setEmail('scholar@chemizic.com');
      setUsername('Scholar_Pro');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!email) {
          setError('Please provide your email address.');
          setLoading(false);
          return;
        }
        await login(email, username, password, portalType);
        saveRememberedAccount({
          name: username || email.split('@')[0],
          email: email,
          role: portalType,
          roll_no: portalType === 'student' ? (rollNo || '24') : undefined,
          student_class: portalType === 'student' ? studentClass : undefined,
          section: portalType === 'student' ? section : undefined,
          lastLogin: new Date().toISOString()
        });
        setSuccessMsg(`Welcome to the ${portalType === 'teacher' ? 'Teacher' : portalType === 'admin' ? 'Admin' : 'Student'} Portal!`);
        setTimeout(() => {
          onClose();
          setEmail('');
          setUsername('');
          setPassword('');
          setSuccessMsg(null);
        }, 1200);
      } else if (activeTab === 'signup') {
        if (!username || !email) {
          setError('Please complete name and email fields.');
          setLoading(false);
          return;
        }

        if (selectedRole === 'student' && !rollNo.trim()) {
          setError('Please provide your Student Roll Number.');
          setLoading(false);
          return;
        }

        const res = await signup(username, email, {
          roll_no: rollNo,
          student_class: studentClass,
          section: section,
          role: selectedRole
        });

        if (res.success) {
          saveRememberedAccount({
            name: username,
            email: email,
            role: selectedRole,
            roll_no: selectedRole === 'student' ? rollNo : undefined,
            student_class: selectedRole === 'student' ? studentClass : undefined,
            section: selectedRole === 'student' ? section : undefined,
            lastLogin: new Date().toISOString()
          });
          setSuccessMsg(`Account created successfully as ${selectedRole.toUpperCase()}! Credentials recorded.`);
          setTimeout(() => {
            onClose();
            setEmail('');
            setUsername('');
            setPassword('');
            setRollNo('');
            setSuccessMsg(null);
          }, 1500);
        } else {
          setError(res.error || 'Registration failed.');
        }
      } else {
        if (!email) {
          setError('Please enter your email.');
          setLoading(false);
          return;
        }
        setSuccessMsg(`Recovery link transmitted to ${email}. Check mailbox for credentials recovery!`);
        setTimeout(() => {
          setActiveTab('login');
          setSuccessMsg(null);
        }, 3500);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication channel disrupted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Black backdrop overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Card content */}
      <div className="bg-[#111318] border border-cyan-500/25 rounded-2xl w-full max-w-md overflow-hidden relative z-10 shadow-[0_0_50px_rgba(34,211,238,0.15)] select-text max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          title="Close Modal"
          className="absolute right-4 top-4 text-slate-500 hover:text-cyan-400 p-1 hover:bg-white/[0.03] rounded-lg transition-all cursor-pointer z-20"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 justify-center mb-3">
            <div className="w-6 h-6 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">⚗</div>
            <span className="font-mono text-xs font-black tracking-[0.2em] text-cyan-400 uppercase">CHEMIZIC ACADEMIC NODE</span>
          </div>

          {/* Tab selector */}
          <div className="flex gap-1 border-b border-slate-800 mt-2">
            {[
              { id: 'login', label: 'Portal Log In' },
              { id: 'signup', label: 'Account Sign Up' },
              { id: 'forgot', label: 'Recover' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-wider font-extrabold focus:outline-none transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body forms content */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 font-mono text-xs text-slate-300">
          
          {error && (
            <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-300 rounded-xl text-[11px] items-start flex gap-2 leading-relaxed">
              <ShieldAlert size={15} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-[11px] items-start flex gap-2 leading-relaxed animate-pulse">
              <Sparkles size={15} className="shrink-0 text-cyan-400 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================= */}
          {/* LOGIN VIEW: PORTAL ROUTING & CREDENTIALS */}
          {/* ========================================= */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Select Target Academic Portal:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'student', label: 'Student', icon: GraduationCap, color: 'text-cyan-300 border-cyan-500/30' },
                    { id: 'teacher', label: 'Teacher', icon: Users, color: 'text-purple-300 border-purple-500/30' },
                    { id: 'admin', label: 'Admin', icon: Shield, color: 'text-amber-300 border-amber-500/30' }
                  ].map(portal => {
                    const Icon = portal.icon;
                    const isSelected = portalType === portal.id;
                    return (
                      <button
                        type="button"
                        key={portal.id}
                        onClick={() => handlePortalSwitch(portal.id as UserRole)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)] font-bold' 
                            : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon size={16} className={isSelected ? 'text-cyan-400' : 'text-slate-500'} />
                        <span className="text-[10px] uppercase font-mono">{portal.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Saved Remembered Accounts on this Device */}
              {rememberedAccounts.length > 0 && (
                <div className="p-3 bg-black/40 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                      Saved Accounts on this Device:
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">Tap to autofill</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {rememberedAccounts.map((acc, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectRememberedAccount(acc)}
                        className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between text-xs font-mono ${
                          email === acc.email
                            ? 'bg-cyan-950/50 border-cyan-400 text-white'
                            : 'bg-black/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-bold flex items-center gap-1.5 text-white text-[11px]">
                            {acc.name}
                            <span className={`text-[8.5px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                              acc.role === 'teacher' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                              acc.role === 'admin' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            }`}>
                              {acc.role}
                            </span>
                          </div>
                          <div className="text-[9.5px] text-slate-500 truncate">
                            {acc.role === 'student' && acc.roll_no ? `Roll: ${acc.roll_no} • ${acc.student_class || ''} (${acc.section || ''})` : acc.email}
                          </div>
                        </div>
                        <span className="text-[10px] text-cyan-400 shrink-0 font-bold">Select →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. scholar@chemizic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-200 outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Username (Handle)
                </label>
                <input
                  type="text"
                  placeholder="Optional username override"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-200 outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Security Passkey (Optional for Demo)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-200 outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Quick Fill Demo Accounts */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 uppercase tracking-wider">Quick Fill:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePortalSwitch('student')}
                    className="text-cyan-400 hover:underline cursor-pointer"
                  >
                    Student
                  </button>
                  <span className="text-slate-700">•</span>
                  <button
                    type="button"
                    onClick={() => handlePortalSwitch('teacher')}
                    className="text-purple-400 hover:underline cursor-pointer"
                  >
                    Teacher
                  </button>
                  <span className="text-slate-700">•</span>
                  <button
                    type="button"
                    onClick={() => handlePortalSwitch('admin')}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* SIGNUP VIEW: NAME, ROLL NO, CLASS, SEC, ROLE */}
          {/* ========================================= */}
          {activeTab === 'signup' && (
            <div className="space-y-3.5">
              
              {/* Role selection: Student or Teacher or Admin */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Is this account for a Student or Faculty/Admin?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      selectedRole === 'student'
                        ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                        : 'bg-black/30 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <GraduationCap size={16} />
                    <span className="text-[10px]">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('teacher')}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      selectedRole === 'teacher'
                        ? 'bg-purple-950/40 border-purple-400 text-purple-300 font-bold shadow-[0_0_12px_rgba(168,85,247,0.15)]'
                        : 'bg-black/30 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Users size={16} />
                    <span className="text-[10px]">Teacher</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('admin')}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      selectedRole === 'admin'
                        ? 'bg-amber-950/40 border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                        : 'bg-black/30 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Shield size={16} />
                    <span className="text-[10px]">Admin</span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Henderson"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Academic Email <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder={selectedRole === 'teacher' ? 'e.g. prof@chemizic.com' : selectedRole === 'admin' ? 'e.g. admin@chemizic.com' : 'e.g. student@school.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              {/* Student Academic Specifics (Roll No, Class, Section) */}
              {selectedRole === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-black/30 border border-cyan-500/20 rounded-xl">
                  {/* Roll No */}
                  <div>
                    <label className="text-[9.5px] font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                      Roll No <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 24"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {/* Class */}
                  <div>
                    <label className="text-[9.5px] font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                      Class
                    </label>
                    <select
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="Undergrad">Undergrad</option>
                    </select>
                  </div>

                  {/* Section */}
                  <div>
                    <label className="text-[9.5px] font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                      Section
                    </label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="Section A">Sec A</option>
                      <option value="Section B">Sec B</option>
                      <option value="Section C">Sec C</option>
                      <option value="Section D">Sec D</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedRole === 'teacher' && (
                <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-[11px] text-purple-300 leading-relaxed font-sans space-y-2">
                  <p>Teacher profiles unlock the **Class Analytics Heatmap**, live student activity records, and the ability to assign custom question sets.</p>
                  <div>
                    <label className="text-[9.5px] font-mono text-slate-400 block mb-1 uppercase">Department / Specialization:</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 leading-relaxed font-sans">
                  Admin profiles possess global system control, user management, syllabus architect permissions, and platform maintenance access.
                </div>
              )}
            </div>
          )}

          {/* Recover Password View */}
          {activeTab === 'forgot' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Enter your registered academic email address to receive password recovery signals.
              </p>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] cursor-pointer flex items-center justify-center gap-2 mt-4 font-mono disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : activeTab === 'login' ? (
              <>Enter {portalType.toUpperCase()} Portal →</>
            ) : activeTab === 'signup' ? (
              <>Register as {selectedRole.toUpperCase()} →</>
            ) : (
              <>Transmit Recovery Signal</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
