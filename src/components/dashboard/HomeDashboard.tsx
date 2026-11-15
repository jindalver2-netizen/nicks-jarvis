'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Brain, 
  Zap, 
  Factory, 
  Cpu, 
  ChevronRight, 
  ArrowUpRight,
  Flame,
  Shield,
  Send,
  Mic,
  RotateCcw,
  Plus
} from 'lucide-react';
import { Task, Reminder, Memory } from '@/lib/types';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

interface HomeDashboardProps {
  onNavigateTab: (tab: 'assistant' | 'tasks' | 'memory' | 'profile') => void;
  onOpenQuickCapture: () => void;
  onOpenBrainDump?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateTab,
  onOpenQuickCapture,
  onOpenBrainDump
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [factoryCount, setFactoryCount] = useState(0);
  const [lowEnergyMode, setLowEnergyMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
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

    // Update real-time clock (Asia/Kolkata)
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
        setTimeout(() => setQuickReply(null), 5000);
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
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  return (
    <div className="pb-24 pt-3 px-3 sm:px-6 max-w-4xl mx-auto text-slate-100 font-sans">
      
      {/* TOP COMMAND HUD HEADER */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-400/40">
            NJ
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold tracking-widest text-cyan-400 font-mono">NICK&apos;S JARVIS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              {todayDateStr} • {currentTime} IST
            </p>
          </div>
        </div>

        {/* Right side controls: Notification Bell & Low-Energy Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLowEnergyMode(!lowEnergyMode)}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center space-x-1 transition-all ${
              lowEnergyMode
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Low-Energy Mode"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{lowEnergyMode ? 'Low-Energy ON' : 'Normal'}</span>
          </button>

          <NotificationCenter onReminderAction={loadDashboardData} />
        </div>
      </div>

      {/* QUICK COMMAND TERMINAL BAR */}
      <form onSubmit={handleQuickCommand} className="mb-5 relative">
        <div className="flex items-center bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-1.5 shadow-[0_0_25px_rgba(6,182,212,0.1)] focus-within:border-cyan-400 transition-colors">
          <span className="pl-3 pr-2 text-cyan-400 font-mono text-xs font-bold">JARVIS &gt;</span>
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Talk or command (English, Hindi, Hinglish)..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none py-1.5"
          />
          <button
            type="submit"
            disabled={!quickInput.trim() || isProcessingQuick}
            className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
          >
            <span>Run</span>
            <Send className="w-3 h-3" />
          </button>
        </div>

        {quickReply && (
          <div className="mt-2 p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs text-cyan-200 leading-relaxed animate-in fade-in">
            <strong className="text-cyan-400 font-mono mr-1">JARVIS:</strong>
            {quickReply}
          </div>
        )}
      </form>

      {/* BRAIN DUMP & QUICK ACTION LAUNCHERS */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <button
          onClick={onOpenBrainDump}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/40 text-left hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              STREAM OF CONSCIOUSNESS
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          </div>
          <h3 className="text-sm font-bold text-white">Brain Dump</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Unload everything; Jarvis classifies with preview.</p>
        </button>

        <button
          onClick={() => onNavigateTab('tasks')}
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              EXECUTION READY
            </span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-bold text-white">No-Brainer Tasks</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">5-min, low-energy & phone-call actions.</p>
        </button>
      </div>

      {/* LOW-ENERGY MODE VIEW (CALM & FOCUSED) */}
      {lowEnergyMode ? (
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 mb-6">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <Flame className="w-5 h-5" />
            <h3 className="text-sm font-bold tracking-wide">Low-Energy Mode Active</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Zero pressure today. Let&apos;s not overwhelm yourself. We only focus on **one small action** to keep momentum going.
          </p>

          {pendingTasks.length > 0 ? (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block mb-1">
                YOUR SINGLE NEXT ACTION
              </span>
              <h4 className="text-sm font-bold text-white">{pendingTasks[0].title}</h4>
              <p className="text-xs text-slate-400 mt-1">{pendingTasks[0].description || 'Just start for 5 minutes.'}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-400">All caught up! Take some rest.</p>
          )}
        </div>
      ) : (
        /* NORMAL FULL DASHBOARD */
        <>
          {/* AI MORNING BRIEFING BANNER */}
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/30 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <h2 className="text-xs font-bold uppercase tracking-wider font-mono">Today&apos;s OS Briefing</h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Asia/Kolkata</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have <strong className="text-cyan-300 font-bold">{pendingTasks.length} pending tasks</strong> and{' '}
              <strong className="text-cyan-300 font-bold">{activeReminders.length} scheduled reminders</strong>. 
              {activeReminders.length > 0 && (
                <span> Next up: <strong className="text-white">{activeReminders[0].title}</strong>.</span>
              )}
            </p>
          </div>

          {/* METRIC CHIPS HUD */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            <div 
              onClick={() => onNavigateTab('tasks')}
              className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Tasks</span>
              <p className="text-lg font-black text-white mt-0.5">{pendingTasks.length}</p>
            </div>

            <div 
              onClick={() => onNavigateTab('tasks')}
              className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Reminders</span>
              <p className="text-lg font-black text-cyan-400 mt-0.5">{activeReminders.length}</p>
            </div>

            <div 
              onClick={() => onNavigateTab('memory')}
              className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Memory</span>
              <p className="text-lg font-black text-violet-400 mt-0.5">{memories.length}</p>
            </div>

            <div 
              onClick={() => onNavigateTab('tasks')}
              className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl cursor-pointer hover:border-cyan-500/40 transition-colors"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Factory</span>
              <p className="text-lg font-black text-emerald-400 mt-0.5">{factoryCount}</p>
            </div>
          </div>

          {/* UPCOMING REMINDERS HUD */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Active Cloud Reminders</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Server-Restart Protected</span>
            </div>

            <div className="space-y-2">
              {activeReminders.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-900 text-center text-xs text-slate-500">
                  No pending reminders scheduled. Tell Jarvis e.g.: &quot;Remind me at 5:30 PM to call supplier.&quot;
                </div>
              ) : (
                activeReminders.slice(0, 3).map((r) => (
                  <div 
                    key={r.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{r.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(r.remind_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                          {new Date(r.remind_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">
                      {r.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RECENT FACTORY OPERATIONS & MEMORY */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5 text-violet-400" />
                <span>Second Brain Records</span>
              </h3>
              <button
                onClick={() => onNavigateTab('memory')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5 font-mono"
              >
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {memories.slice(0, 2).map((m) => (
              <div
                key={m.id}
                onClick={() => onNavigateTab('memory')}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors mb-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                    {m.category}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100">{m.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{m.content}</p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};
