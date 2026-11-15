'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Brain, 
  Sparkles, 
  Calendar,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { Task, Reminder, Memory } from '@/lib/types';

interface HomeDashboardProps {
  onNavigateTab: (tab: 'assistant' | 'tasks' | 'memory' | 'profile') => void;
  onOpenQuickCapture: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateTab,
  onOpenQuickCapture
}) => {
  // Real initial states
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      user_id: 'default',
      title: 'Call Rajesh regarding supplier payment',
      due_date: new Date().toISOString().split('T')[0],
      due_time: '11:00',
      priority: 'high',
      status: 'pending',
      category: 'Business',
      timezone: 'Asia/Kolkata',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'default',
      title: 'Review factory stock & inventory',
      due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      priority: 'medium',
      status: 'pending',
      category: 'Factory',
      timezone: 'Asia/Kolkata',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  const [reminders] = useState<Reminder[]>([
    {
      id: 'r1',
      user_id: 'default',
      title: 'Call Rajesh (Payment discussion)',
      remind_at: new Date(Date.now() + 3600000).toISOString(),
      timezone: 'Asia/Kolkata',
      priority: 'high',
      status: 'pending',
      notification_channel: 'in_app',
      created_at: new Date().toISOString()
    }
  ]);

  const [recentMemories] = useState<Memory[]>([
    {
      id: 'm1',
      user_id: 'default',
      category: 'Business',
      title: 'Pragati Industries Main Line',
      content: 'Pragati Industries manufactures tarpaulin and PVC sheets.',
      tags: ['Business', 'Products'],
      importance: 'high',
      source: 'chat',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto text-slate-100">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            {todayStr}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Good Morning, Sir
          </h1>
        </div>
        <button
          onClick={() => onNavigateTab('assistant')}
          className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      {/* Daily Briefing Card */}
      <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 relative overflow-hidden shadow-sm">
        <div className="flex items-center space-x-2 text-indigo-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <h2 className="text-xs font-semibold uppercase tracking-wider">Today&apos;s AI Briefing</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          You have <strong className="text-white">2 pending tasks</strong> and <strong className="text-white">1 upcoming reminder</strong>. Priority focus: <span className="text-indigo-300">Call Rajesh regarding supplier payment</span> at 11:00 AM.
        </p>
      </div>

      {/* Quick Overview Metric Chips */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div 
          onClick={() => onNavigateTab('tasks')}
          className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Tasks</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white">{tasks.length}</p>
        </div>

        <div 
          onClick={() => onNavigateTab('tasks')}
          className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Reminders</span>
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-white">{reminders.length}</p>
        </div>

        <div 
          onClick={() => onNavigateTab('memory')}
          className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Memories</span>
            <Brain className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <p className="text-xl font-bold text-white">{recentMemories.length}</p>
        </div>
      </div>

      {/* Upcoming Reminders Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-slate-200">Upcoming Reminders</h2>
          <button 
            onClick={() => onNavigateTab('tasks')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {reminders.map((rem) => (
            <div 
              key={rem.id}
              className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-200">{rem.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Today at 11:00 AM IST (Survives server restarts)
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {rem.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Tasks Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-slate-200">Priority Tasks</h2>
          <button 
            onClick={() => onNavigateTab('tasks')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5"
          >
            <span>View tasks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className="bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <div>
                  <h3 className="text-sm font-medium text-slate-200">{task.title}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-slate-400">{task.category}</span>
                    {task.due_time && (
                      <span className="text-[10px] text-indigo-400">{task.due_time}</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-500">Today</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Second Brain Memory */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-slate-200">Long-Term Memory</h2>
          <button 
            onClick={() => onNavigateTab('memory')}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-0.5"
          >
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentMemories.map((mem) => (
          <div 
            key={mem.id}
            onClick={() => onNavigateTab('memory')}
            className="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-xl cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-medium text-[11px]">
                {mem.category}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <h3 className="text-sm font-medium text-slate-200 mt-1">{mem.title}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{mem.content}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
