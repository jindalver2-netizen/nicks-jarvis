'use client';

import React from 'react';
import { 
  Home, 
  MessageSquare, 
  CheckSquare, 
  Brain, 
  User, 
  Plus 
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-2 pb-safe max-w-lg mx-auto">
      <div className="flex items-center justify-around h-16 relative">
        
        {/* 1. HOME */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            currentTab === 'home' ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Home</span>
        </button>

        {/* 2. AI ASSISTANT */}
        <button
          onClick={() => onSelectTab('assistant')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
            currentTab === 'assistant' ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Assistant</span>
        </button>

        {/* CENTER FLOATING QUICK CAPTURE BUTTON */}
        <div className="flex items-center justify-center px-1">
          <button
            onClick={onOpenQuickCapture}
            aria-label="Quick Capture"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transform active:scale-95 transition-transform -translate-y-2 hover:brightness-110"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 3. TASKS */}
        <button
          onClick={() => onSelectTab('tasks')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors relative ${
            currentTab === 'tasks' ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Tasks</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        {/* 4. MEMORY */}
        <button
          onClick={() => onSelectTab('memory')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            currentTab === 'memory' ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Memory</span>
        </button>

        {/* 5. PROFILE */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            currentTab === 'profile' ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-[11px]">Profile</span>
        </button>

      </div>
    </nav>
  );
};
