'use client';

import React from 'react';
import { 
  Terminal, 
  CheckSquare, 
  Brain, 
  Sliders, 
  Plus, 
  Home
} from 'lucide-react';

export type NavTab = 'home' | 'assistant' | 'tasks' | 'memory' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickCapture: () => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickCapture,
  unreadCount = 0
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-3 pb-safe max-w-lg mx-auto shadow-2xl">
      <div className="flex items-center justify-around h-16 relative">
        
        {/* 1. HUD / HOME */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 transition-all ${
            currentTab === 'home' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>

        {/* 2. JARVIS AI */}
        <button
          onClick={() => onSelectTab('assistant')}
          className={`flex flex-col items-center justify-center flex-1 transition-all relative ${
            currentTab === 'assistant' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Jarvis</span>
        </button>

        {/* CENTER FLOATING QUICK ACTION BUTTON */}
        <div className="flex items-center justify-center px-1">
          <button
            onClick={onOpenQuickCapture}
            aria-label="Quick Action"
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center transform active:scale-95 transition-transform -translate-y-2.5 border-2 border-cyan-300 hover:brightness-110"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 3. TASKS */}
        <button
          onClick={() => onSelectTab('tasks')}
          className={`flex flex-col items-center justify-center flex-1 transition-all relative ${
            currentTab === 'tasks' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Tasks</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          )}
        </button>

        {/* 4. MEMORY */}
        <button
          onClick={() => onSelectTab('memory')}
          className={`flex flex-col items-center justify-center flex-1 transition-all ${
            currentTab === 'memory' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Brain</span>
        </button>

        {/* 5. CONFIG */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 transition-all ${
            currentTab === 'profile' ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">Settings</span>
        </button>

      </div>
    </nav>
  );
};
