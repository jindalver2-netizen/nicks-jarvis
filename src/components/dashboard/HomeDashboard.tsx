'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Circle,
  AlertCircle, 
  Brain, 
  Zap, 
  Factory, 
  Flame, 
  Send, 
  Mic, 
  Plus, 
  BookOpen,
  Calendar,
  ChevronRight,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { Task, Reminder, Memory } from '@/lib/types';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { AddReminderModal } from '@/components/reminders/AddReminderModal';
import { AppTourModal } from '@/components/tour/AppTourModal';

interface HomeDashboardProps {
  onNavigateTab: (tab: 'assistant' | 'tasks' | 'memory' | 'profile') => void;
  onOpenQuickCapture: () => void;
  onOpenBrainDump?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateTab,
  onOpenBrainDump
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [factoryCount, setFactoryCount] = useState(0);
  const [lowEnergyMode, setLowEnergyMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Modals state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Quick Command state
  const [quickInput, setQuickInput] = useState('');
  const [isProcessingQuick, setIsProcessingQuick] = useState(false);
  const [quickReply, setQuickReply] = useState<string | null>(null);

  // Load live data from real database endpoints
  const loadDashboardData = async () => {
    try {
      const [remRes, taskRes, memRes, factRes] = await Promise.all([
        fetch('/api/reminders?status=all'),
        fetch('/api/tasks?status=all'),
        fetch('/api/memories'),
        fetch('/api/factory/checklist')
      ]);

      if (remRes.ok) {
        const d = await remRes.json();
        setReminders(d.reminders || []);
      }
      if (taskRes.ok) {
        const d = await taskRes.json();
        setTasks(d.tasks || []);
      }
      if (memRes.ok) {
        const d = await memRes.json();
        setMemories(d.memories || []);
      }
      if (factRes.ok) {
        const d = await factRes.json();
        setFactoryCount((d.tasks || []).length);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Real-time clock (Asia/Kolkata)
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    // Optimistic UI update
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: nextStatus as any } : t)));

    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      loadDashboardData();
    } catch (err) {
      console.error(err);
      loadDashboardData();
    }
  };

  const handleQuickCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim() || isProcessingQuick) return;

    setIsProcessingQuick(true);
    setQuickReply(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: quickInput.trim() })
      });

      const d = await res.json();
      if (res.ok) {
        setQuickReply(d.reply || 'Command processed.');
        setQuickInput('');
        loadDashboardData();
        setTimeout(() => setQuickReply(null), 6000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingQuick(false);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const activeReminders = reminders.filter((r) => r.status === 'pending');

  const todayDateStr = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  }).format(new Date());

  return (
    <div className="pb-28 pt-4 px-3 sm:px-6 max-w-4xl mx-auto text-slate-100 font-sans">
      
      {/* TOP COMMAND HUD HEADER */}
      <div className="flex items-center justify-between py-3 border-b border-slate-800/80 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/40">
            NJ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold tracking-wider text-white font-mono">NICK&apos;S JARVIS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {todayDateStr} • {currentTime} IST
            </p>
          </div>
        </div>

        {/* Right side controls: App Tour, Low-Energy & Notifications */}
        <div className="flex items-center space-x-2">
          {/* App Tour Pill */}
          <button
            onClick={() => setIsTourOpen(true)}
            className="px-3 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            title="Open App Tour"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tour</span>
          </button>

          {/* Low-Energy Mode Toggle */}
          <button
            onClick={() => setLowEnergyMode(!lowEnergyMode)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              lowEnergyMode
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Low-Energy Mode"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{lowEnergyMode ? 'Low-Energy' : 'Normal'}</span>
          </button>

          <NotificationCenter onReminderAction={loadDashboardData} />
        </div>
      </div>

      {/* 3 CLEAR GRAPHICAL ACTION CARDS (No Duplicate confusion) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
        
        {/* 1. Add Task Card */}
        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] group flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">+ New Task</h3>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">No-Brainer step</p>
          </div>
        </button>

        {/* 2. Set Reminder Card */}
        <button
          onClick={() => setIsAddReminderOpen(true)}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] group flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">+ Reminder</h3>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Audio alarm & due time</p>
          </div>
        </button>

        {/* 3. Brain Dump Card */}
        <button
          onClick={onOpenBrainDump}
          className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-900 border border-violet-500/40 hover:border-violet-400 text-left transition-all shadow-[0_0_20px_rgba(139,92,246,0.1)] group flex flex-col justify-between"
        >
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/40 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Brain Dump</h3>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Voice stream unload</p>
          </div>
        </button>

      </div>

      {/* QUICK COMMAND BAR (Ask Jarvis natural language) */}
      <form onSubmit={handleQuickCommand} className="mb-6 relative">
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl p-2 shadow-lg focus-within:border-cyan-400 transition-colors">
          <span className="pl-3 pr-2 text-cyan-400 font-mono text-sm font-bold">JARVIS &gt;</span>
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Type or speak in Hindi/English (e.g.: 'Kal 11 baje Ramesh ko phone karna hai')..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none py-1"
          />
          <button
            type="submit"
            disabled={!quickInput.trim() || isProcessingQuick}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {quickReply && (
          <div className="mt-2.5 p-3.5 bg-cyan-950/60 border border-cyan-500/50 rounded-xl text-sm text-cyan-200 leading-relaxed shadow-lg animate-in fade-in">
            <strong className="text-cyan-400 font-mono mr-1.5 font-bold">JARVIS:</strong>
            {quickReply}
          </div>
        )}
      </form>

      {/* LOW-ENERGY MODE VIEW */}
      {lowEnergyMode ? (
        <div className="p-6 rounded-3xl bg-amber-950/30 border-2 border-amber-500/50 mb-6 shadow-xl">
          <div className="flex items-center space-x-2.5 text-amber-400 mb-2">
            <Flame className="w-6 h-6" />
            <h3 className="text-base font-bold tracking-wide">Low-Energy Mode Active</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Zero pressure today. Let&apos;s not overwhelm yourself. We only focus on **one small 5-minute action** to keep momentum going.
          </p>

          {pendingTasks.length > 0 ? (
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/40">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                YOUR SINGLE NEXT ACTION
              </span>
              <h4 className="text-base font-bold text-white">{pendingTasks[0].title}</h4>
              <p className="text-sm text-slate-300 mt-1">{pendingTasks[0].description || 'Just start for 5 minutes.'}</p>
              <button
                onClick={() => toggleTaskStatus(pendingTasks[0].id, pendingTasks[0].status)}
                className="mt-3 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark This 5-Min Task Done</span>
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400">All caught up! Take some rest.</p>
          )}
        </div>
      ) : (
        /* NORMAL DASHBOARD */
        <>
          {/* STATS TILES (Visual & High Contrast) */}
          <div className="grid grid-cols-4 gap-2.5 mb-6">
            <div 
              onClick={() => onNavigateTab('tasks')}
              className="bg-slate-900 border border-slate-800 p-3 rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">Tasks</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{pendingTasks.length}</p>
            </div>

            <div 
              onClick={() => onNavigateTab('tasks')}
              className="bg-slate-900 border border-slate-800 p-3 rounded-2xl cursor-pointer hover:border-cyan-500/50 transition-colors"
            >
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">Reminders</span>
              <p className="text-2xl font-black text-cyan-400 mt-1">{activeReminders.length}</p>
            </div>

            <div 
              onClick={() => onNavigateTab('memory')}
              className="bg-slate-900 border border-slate-800 p-3 rounded-2xl cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">Brain CRM</span>
              <p className="text-2xl font-black text-violet-400 mt-1">{memories.length}</p>
            </div>

            <div 
              onClick={() => onNavigateTab('tasks')}
              className="bg-slate-900 border border-slate-800 p-3 rounded-2xl cursor-pointer hover:border-amber-500/50 transition-colors"
            >
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold block">Factory</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{factoryCount}</p>
            </div>
          </div>

          {/* ⚡ TODAY'S ACTION TASKS (SHOW DIRECTLY ON DASHBOARD!) */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  Today&apos;s Action Tasks
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAddTaskOpen(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
                <button
                  onClick={() => onNavigateTab('tasks')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5 ml-2 font-mono"
                >
                  <span>View All ({tasks.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {tasks.length === 0 ? (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-sm text-slate-400">
                  No tasks saved yet. Tap <strong className="text-emerald-400">+ New Task</strong> above to add your first task!
                </div>
              ) : (
                tasks.slice(0, 5).map((t) => {
                  const isDone = t.status === 'completed';
                  return (
                    <div
                      key={t.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                        isDone
                          ? 'bg-slate-950/50 border-slate-900 opacity-60'
                          : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40 shadow-sm'
                      }`}
                    >
                      <button
                        onClick={() => toggleTaskStatus(t.id, t.status)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                        title={isDone ? 'Mark Pending' : 'Mark Completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-500 hover:text-emerald-400" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4
                            className={`text-sm font-semibold ${
                              isDone ? 'line-through text-slate-500' : 'text-white'
                            }`}
                          >
                            {t.title}
                          </h4>

                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded font-mono ${
                            t.priority === 'urgent'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : t.priority === 'high'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {t.priority}
                          </span>
                        </div>

                        {t.description && (
                          <p className="text-xs text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
                            {t.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                            {t.category}
                          </span>
                          {t.due_date && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              Due: {t.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ACTIVE CLOUD REMINDERS */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  Active Reminders
                </h2>
              </div>

              <button
                onClick={() => setIsAddReminderOpen(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set Reminder</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {activeReminders.length === 0 ? (
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-sm text-slate-400">
                  No upcoming reminders. Tap <strong className="text-cyan-400">+ Reminder</strong> above to set one with audio alarms!
                </div>
              ) : (
                activeReminders.slice(0, 4).map((r) => {
                  const isPast = new Date(r.remind_at) <= new Date();
                  return (
                    <div 
                      key={r.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                        isPast
                          ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                          : 'bg-slate-900 border-slate-800 hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className={`p-2 rounded-xl mt-0.5 ${
                          isPast ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{r.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(r.remind_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                            {new Date(r.remind_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                        {isPast ? 'OVERDUE' : r.priority}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SECOND BRAIN & PEOPLE CRM HIGHLIGHTS */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/40">
                  <Brain className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white tracking-wide">
                  Second Brain Knowledge & CRM
                </h2>
              </div>

              <button
                onClick={() => onNavigateTab('memory')}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center space-x-0.5 font-mono"
              >
                <span>View All ({memories.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {memories.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  onClick={() => onNavigateTab('memory')}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/60 font-bold uppercase">
                      {m.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Cloud Synced</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{m.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MODALS */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onTaskCreated={loadDashboardData}
      />

      <AddReminderModal
        isOpen={isAddReminderOpen}
        onClose={() => setIsAddReminderOpen(false)}
        onReminderCreated={loadDashboardData}
      />

      <AppTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

    </div>
  );
};
