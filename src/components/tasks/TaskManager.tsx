'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Filter 
} from 'lucide-react';
import { Task, Priority } from '@/lib/types';

export const TaskManager: React.FC = () => {
  const [filter, setFilter] = useState<'today' | 'upcoming' | 'completed' | 'all'>('today');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't1',
      user_id: 'default',
      title: 'Call Rajesh regarding supplier payment',
      description: 'Discuss pending invoice #4092 and NEFT transfer',
      due_date: new Date().toISOString().split('T')[0],
      due_time: '11:00',
      timezone: 'Asia/Kolkata',
      priority: 'high',
      category: 'Business',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 't2',
      user_id: 'default',
      title: 'Review factory stock & inventory',
      due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timezone: 'Asia/Kolkata',
      priority: 'medium',
      category: 'Factory',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 't3',
      user_id: 'default',
      title: 'Pay electricity bill',
      due_date: new Date().toISOString().split('T')[0],
      timezone: 'Asia/Kolkata',
      priority: 'urgent',
      category: 'Finance',
      status: 'completed',
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [isAdding, setIsAdding] = useState(false);

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDone = t.status === 'completed';
          return {
            ...t,
            status: isDone ? 'pending' : 'completed',
            completed_at: isDone ? undefined : new Date().toISOString()
          };
        }
        return t;
      })
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      user_id: 'default',
      title: newTitle.trim(),
      due_date: new Date().toISOString().split('T')[0],
      timezone: 'Asia/Kolkata',
      priority: newPriority,
      category: 'General',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'all') return true;
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return t.due_date === today && t.status !== 'completed';
    }
    if (filter === 'upcoming') {
      const today = new Date().toISOString().split('T')[0];
      return t.due_date !== today && t.status !== 'completed';
    }
    return true;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto text-slate-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Tasks & Actions</h1>
          <p className="text-xs text-slate-400 mt-0.5">Organized by your Second Brain</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center space-x-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Quick Add Form */}
      {isAdding && (
        <form onSubmit={addTask} className="mb-4 p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Priority)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
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
                className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 mb-4 overflow-x-auto">
        {(['today', 'upcoming', 'completed', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
              filter === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isDone = t.status === 'completed';
            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-slate-950/40 border-slate-900 opacity-60'
                    : 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1">
                    <h3
                      className={`text-sm font-medium ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {t.title}
                    </h3>

                    {t.description && (
                      <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                    )}

                    <div className="flex items-center space-x-2.5 mt-2 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {t.category}
                      </span>

                      {t.due_time && (
                        <div className="flex items-center space-x-1 text-indigo-400">
                          <Clock className="w-3 h-3" />
                          <span>{t.due_time}</span>
                        </div>
                      )}

                      <span
                        className={`capitalize font-semibold text-[10px] ${
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
          })
        )}
      </div>

    </div>
  );
};
