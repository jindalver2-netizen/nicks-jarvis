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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pb-safe max-w-lg mx-auto">
      <div className="flex items-center justify-around h-16 relative">
        
        {/* 1. HUD / HOME */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            currentTab === 'home' ? 'text-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-mono tracking-wider">HUD</span>
        </button>

        {/* 2. JARVIS AI */}
        <button
          onClick={() => onSelectTab('assistant')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
            currentTab === 'assistant' ? 'text-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Terminal className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-mono tracking-wider">Jarvis</span>
        </button>

        {/* CENTER FLOATING QUICK CAPTURE BUTTON */}
        <div className="flex items-center justify-center px-1">
          <button
            onClick={onOpenQuickCapture}
            aria-label="Quick Action"
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center transform active:scale-95 transition-transform -translate-y-2 border border-cyan-300/40 hover:brightness-110"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 3. TASKS */}
        <button
          onClick={() => onSelectTab('tasks')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
            currentTab === 'tasks' ? 'text-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-mono tracking-wider">Tasks</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          )}
        </button>

        {/* 4. MEMORY */}
        <button
          onClick={() => onSelectTab('memory')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            currentTab === 'memory' ? 'text-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Brain className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-mono tracking-wider">Brain</span>
        </button>

        {/* 5. CONFIG */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            currentTab === 'profile' ? 'text-cyan-400 font-semibold' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sliders className="w-5 h-5 mb-1" />
          <span className="text-[10px] uppercase font-mono tracking-wider">Config</span>
        </button>

      </div>
    </nav>
  );
};
