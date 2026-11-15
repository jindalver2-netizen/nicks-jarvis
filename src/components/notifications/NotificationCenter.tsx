'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle2, RotateCcw, X, AlertTriangle } from 'lucide-react';
import { Reminder } from '@/lib/types';

interface NotificationCenterProps {
  onReminderAction?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onReminderAction }) => {
  const [activeAlert, setActiveAlert] = useState<Reminder | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const fetchDueReminders = async () => {
    try {
      const res = await fetch('/api/reminders?status=all');
      if (!res.ok) return;
      const data = await res.json();
      const list: Reminder[] = data.reminders || [];
      setReminders(list);

      const now = new Date();
      // Find due reminders that are pending
      const due = list.filter((r) => {
        const rTime = new Date(r.remind_at);
        return r.status === 'pending' && rTime <= now;
      });

      setUnreadCount(due.length);

      // Trigger pop-up alert for the most urgent due reminder if not already alerting
      if (due.length > 0 && !activeAlert) {
        setActiveAlert(due[0]);
      }
    } catch (err) {
      console.error('Error checking reminders:', err);
    }
  };

  useEffect(() => {
    fetchDueReminders();
    const interval = setInterval(fetchDueReminders, 25000); // Check every 25 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSnooze = async (id: string, minutes: number = 10) => {
    try {
      await fetch('/api/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, snooze_minutes: minutes })
      });
      setActiveAlert(null);
      fetchDueReminders();
      if (onReminderAction) onReminderAction();
    } catch (err) {
      console.error('Snooze error:', err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await fetch('/api/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'delivered' })
      });
      setActiveAlert(null);
      fetchDueReminders();
      if (onReminderAction) onReminderAction();
    } catch (err) {
      console.error('Complete error:', err);
    }
  };

  return (
    <>
      {/* Top HUD Floating Notification Alert Banner */}
      {activeAlert && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-slate-900/95 border-2 border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.35)] rounded-2xl p-4 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 mt-0.5 animate-pulse">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">
                  JARVIS ALERT — TIME DUE
                </span>
                <h4 className="text-sm font-semibold text-white mt-0.5">
                  {activeAlert.title}
                </h4>
                {activeAlert.description && (
                  <p className="text-xs text-slate-300 mt-0.5">{activeAlert.description}</p>
                )}
                <span className="text-[11px] text-slate-400 block mt-1">
                  Scheduled for {new Date(activeAlert.remind_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveAlert(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-end space-x-2">
            <button
              onClick={() => handleSnooze(activeAlert.id, 10)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Snooze 10m</span>
            </button>
            <button
              onClick={() => handleComplete(activeAlert.id)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </button>
          </div>
        </div>
      )}

      {/* Bell Icon Trigger */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          fetchDueReminders();
        }}
        className="relative p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        title="Notifications & Reminders"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px] flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-out Notification Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-950 border-l border-slate-800/80 h-full p-4 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">Reminder History & Alerts</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
                {reminders.length === 0 ? (
                  <p className="text-center py-10 text-xs text-slate-500">No scheduled reminders found.</p>
                ) : (
                  reminders.map((r) => {
                    const isDue = r.status === 'pending' && new Date(r.remind_at) <= new Date();
                    return (
                      <div
                        key={r.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isDue
                            ? 'bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : r.status === 'delivered'
                            ? 'bg-slate-900/40 border-slate-900 opacity-60'
                            : 'bg-slate-900/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-semibold text-white">{r.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {new Date(r.remind_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                              {new Date(r.remind_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                              r.status === 'delivered'
                                ? 'bg-slate-800 text-slate-400'
                                : isDue
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {r.status === 'delivered' ? 'Completed' : isDue ? 'Due Now' : 'Scheduled'}
                          </span>
                        </div>

                        {r.status === 'pending' && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleSnooze(r.id, 15)}
                              className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center space-x-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>+15m</span>
                            </button>
                            <button
                              onClick={() => handleComplete(r.id)}
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Mark Done</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
