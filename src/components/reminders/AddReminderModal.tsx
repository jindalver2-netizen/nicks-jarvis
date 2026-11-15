'use client';

import React, { useState } from 'react';
import { X, Clock, Bell, Calendar, Loader2 } from 'lucide-react';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReminderCreated: () => void;
}

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  isOpen,
  onClose,
  onReminderCreated
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [remindDate, setRemindDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Default to 1 hour from now formatted as HH:mm
  const defaultHour = new Date(Date.now() + 60 * 60 * 1000);
  const defaultTimeStr = defaultHour.toTimeString().slice(0, 5);
  const [remindTime, setRemindTime] = useState(defaultTimeStr);
  
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // Create ISO timestamp in Asia/Kolkata
      const [year, month, day] = remindDate.split('-');
      const [hours, minutes] = remindTime.split(':');
      const targetDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        0
      );

      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          remind_at: targetDate.toISOString(),
          priority,
          notification_channel: 'in_app'
        })
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        onReminderCreated();
        onClose();
      } else {
        alert('Failed to schedule reminder.');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating reminder.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl relative text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Set Time Reminder</h3>
              <p className="text-xs text-slate-400">Audio chime & pop-up alarm at exact time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              What should Jarvis remind you? *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g.: Bank jaakar cheque deposit karna"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Details / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g.: Check Surat dealer ledger before depositing"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Date
              </label>
              <input
                type="date"
                value={remindDate}
                onChange={(e) => setRemindDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Time (Asia/Kolkata)
              </label>
              <input
                type="time"
                value={remindTime}
                onChange={(e) => setRemindTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
              Urgency Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="urgent">🚨 Critical (Alarm & loud chime)</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Normal Reminder</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scheduling Alarm in Cloud...</span>
                </>
              ) : (
                <>
                  <Bell className="w-5 h-5" />
                  <span>Set Active Reminder</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
