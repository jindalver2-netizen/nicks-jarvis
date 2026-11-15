'use client';

import React, { useState } from 'react';
import { BottomNav, NavTab } from '@/components/navigation/BottomNav';
import { HomeDashboard } from '@/components/dashboard/HomeDashboard';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { TaskManager } from '@/components/tasks/TaskManager';
import { MemoryHub } from '@/components/memory/MemoryHub';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { QuickCaptureModal } from '@/components/quick-capture/QuickCaptureModal';
import { BrainDumpModal } from '@/components/braindump/BrainDumpModal';
import { 
  Home, 
  Terminal, 
  CheckSquare, 
  Brain, 
  Sliders, 
  Plus, 
  Sparkles,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false);

  const navItems: { tab: NavTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'home', label: 'HUD Command', icon: <Home className="w-4 h-4" /> },
    { tab: 'assistant', label: 'Jarvis Terminal', icon: <Terminal className="w-4 h-4" /> },
    { tab: 'tasks', label: 'Action Center', icon: <CheckSquare className="w-4 h-4" /> },
    { tab: 'memory', label: 'Second Brain', icon: <Brain className="w-4 h-4" /> },
    { tab: 'profile', label: 'OS Config', icon: <Sliders className="w-4 h-4" /> }
  ];

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 text-slate-100">
      
      {/* DESKTOP TOP COMMAND BAR (Visible on md and larger screens) */}
      <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/40">
            NJ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-wider text-white font-mono">NICK&apos;S JARVIS</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono font-bold">
                LIFE OS v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>NVIDIA Nemotron-550B Connected</span>
              <span className="text-slate-600">•</span>
              <span>Supabase Cloud Synced</span>
            </p>
          </div>
        </div>

        {/* Desktop Nav Pills */}
        <nav className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setCurrentTab(item.tab)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)] font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsBrainDumpOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Brain Dump</span>
          </button>

          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Quick Action</span>
          </button>
        </div>
      </header>

      {/* Dynamic Screen View */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4">
        {currentTab === 'home' && (
          <HomeDashboard 
            onNavigateTab={(tab) => setCurrentTab(tab)} 
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            onOpenBrainDump={() => setIsBrainDumpOpen(true)}
          />
        )}

        {currentTab === 'assistant' && (
          <ChatInterface />
        )}

        {currentTab === 'tasks' && (
          <TaskManager />
        )}

        {currentTab === 'memory' && (
          <MemoryHub />
        )}

        {currentTab === 'profile' && (
          <ProfileSettings />
        )}
      </div>

      {/* Quick Capture Floating Modal */}
      <QuickCaptureModal 
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
      />

      {/* Stream-of-Consciousness Brain Dump + Approval Drawer Modal */}
      <BrainDumpModal
        isOpen={isBrainDumpOpen}
        onClose={() => setIsBrainDumpOpen(false)}
        onSuccessCommit={() => setCurrentTab('tasks')}
      />

      {/* Mobile Jarvis Bottom Navigation (Hidden on md and larger screens) */}
      <div className="md:hidden">
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        />
      </div>

    </main>
  );
}
