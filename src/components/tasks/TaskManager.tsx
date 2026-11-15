'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Filter, 
  Sparkles, 
  Zap, 
  PhoneCall, 
  Laptop, 
  Factory, 
  Coffee,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { Task, Priority } from '@/lib/types';

export const TaskManager: React.FC = () => {
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'no-brainer' | 'completed' | 'all'>('today');
  const [contextFilter, setContextFilter] = useState<string>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Quick add form state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState('General');
  const [howTo, setHowTo] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks?status=all');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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
    } catch (err) {
      console.error(err);
      fetchTasks(); // Rollback if error
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: howTo ? `HOW: ${howTo}` : undefined,
          priority: newPriority,
          category: newCategory,
          due_date: new Date().toISOString().split('T')[0]
        })
      });

      if (res.ok) {
        setNewTitle('');
        setHowTo('');
        setIsAdding(false);
        fetchTasks();
      }
    } catch (err) {
      console.error('Create task error:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'all') return true;
    if (filter === 'no-brainer') {
      return t.status !== 'completed' && (
        t.priority === 'low' || 
        t.category.toLowerCase().includes('phone') ||
        (t.description && t.description.includes('HOW:'))
      );
    }
    const today = new Date().toISOString().split('T')[0];
    if (filter === 'today') {
      return (t.due_date === today || !t.due_date) && t.status !== 'completed';
    }
    if (filter === 'upcoming') {
      return t.due_date && t.due_date > today && t.status !== 'completed';
    }
    return true;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto text-slate-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Action Center</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">Executable Tasks & No-Brainer Steps</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Quick Add Form */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="mb-4 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
          <div>
            <label className="block text-[11px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
              WHAT TO DO
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="E.g.: Call Rajesh for polymer rates"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
              HOW TO DO IT (Clear Step)
            </label>
            <input
              type="text"
              value={howTo}
              onChange={(e) => setHowTo(e.target.value)}
              placeholder="E.g.: Open phone, ask for 500m rate, note payment terms"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as Priority)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="General">General</option>
                <option value="Factory">Factory</option>
                <option value="Pragati Industries">Pragati Industries</option>
                <option value="DS Polymers">DS Polymers</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main Tabs */}
      <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 mb-3 overflow-x-auto">
        {(['today', 'no-brainer', 'upcoming', 'completed', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap px-2 transition-colors ${
              filter === tab
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'no-brainer' ? '⚡ No-Brainer' : tab}
          </button>
        ))}
      </div>

      {/* No-Brainer Context Filters Bar */}
      {filter === 'no-brainer' && (
        <div className="mb-3 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
          <span className="text-cyan-400 font-bold flex items-center mr-1">
            <Zap className="w-3.5 h-3.5 mr-0.5" />
            Filter:
          </span>
          <button 
            onClick={() => setContextFilter('all')}
            className={`px-2 py-0.5 rounded-md ${contextFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'}`}
          >
            All
          </button>
          <button 
            onClick={() => setContextFilter('5m')}
            className={`px-2 py-0.5 rounded-md ${contextFilter === '5m' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'}`}
          >
            5 Mins
          </button>
          <button 
            onClick={() => setContextFilter('phone')}
            className={`px-2 py-0.5 rounded-md ${contextFilter === 'phone' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'}`}
          >
            Phone Call
          </button>
          <button 
            onClick={() => setContextFilter('low')}
            className={`px-2 py-0.5 rounded-md ${contextFilter === 'low' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 bg-slate-900'}`}
          >
            Low Energy
          </button>
        </div>
      )}

      {/* Task List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-xs flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Loading tasks from database...</span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-900">
          No tasks found in this view. Use Quick Capture or Brain Dump to add tasks!
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((t) => {
            const isDone = t.status === 'completed';
            const isExpanded = expandedTaskId === t.id;

            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-slate-950/40 border-slate-900 opacity-60'
                    : 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTaskStatus(t.id, t.status)}
                    className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3
                        className={`text-sm font-medium ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {t.title}
                      </h3>

                      {t.description && (
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : t.id)}
                          className="text-slate-500 hover:text-slate-300 p-0.5"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    {/* Breakdown accordion: What, How, When */}
                    {isExpanded && t.description && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                        <p className="text-slate-300">
                          <strong className="text-cyan-400">EXECUTION STEP:</strong> {t.description.replace(/^HOW:\s*/, '')}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          <strong>WHEN:</strong> {t.due_date ? t.due_date : 'Next available slot'}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2.5 mt-2 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {t.category}
                      </span>

                      {t.due_time && (
                        <div className="flex items-center space-x-1 text-cyan-400 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{t.due_time}</span>
                        </div>
                      )}

                      <span
                        className={`capitalize font-bold text-[10px] ${
                          t.priority === 'urgent'
                            ? 'text-rose-400'
                            : t.priority === 'high'
                            ? 'text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        ● {t.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
