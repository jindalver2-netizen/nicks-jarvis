'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle2, RotateCcw, X, AlertTriangle, Volume2 } from 'lucide-react';
import { Reminder } from '@/lib/types';

interface NotificationCenterProps {
  onReminderAction?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onReminderAction }) => {
  const [activeAlert, setActiveAlert] = useState<Reminder | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Futuristic Web Audio Synthesizer Chime
  const playAlarmChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.15); // D6
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.3); // E6
      
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio playback not allowed or not supported:', e);
    }
  };

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
        playAlarmChime();

        // Native Browser Push Notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(`JARVIS REMINDER: ${due[0].title}`, {
              body: due[0].description || 'Scheduled reminder due right now.',
              icon: '/favicon.ico'
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (err) {
      console.error('Error checking reminders:', err);
    }
  };

  useEffect(() => {
    // Request notification permission once
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchDueReminders();
    const interval = setInterval(fetchDueReminders, 20000); // Check every 20 seconds
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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg bg-slate-900 border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.5)] rounded-2xl p-5 backdrop-blur-xl animate-in slide-in-from-top-6 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400 mt-0.5 animate-pulse">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-cyan-400 font-mono flex items-center space-x-1">
                  <span>⚡ TIME DUE REMINDER</span>
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  {activeAlert.title}
                </h4>
                {activeAlert.description && (
                  <p className="text-sm text-slate-300 mt-1 leading-snug">{activeAlert.description}</p>
                )}
                <span className="text-xs text-slate-400 block mt-2 font-mono">
                  Scheduled for {new Date(activeAlert.remind_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveAlert(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-end space-x-2.5">
            <button
              onClick={() => handleSnooze(activeAlert.id, 10)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Snooze 10 Min</span>
            </button>

            <button
              onClick={() => handleComplete(activeAlert.id)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-md shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Done</span>
            </button>
          </div>
        </div>
      )}

      {/* Bell Icon in Top Bar */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notifications"
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-xs font-black flex items-center justify-center animate-pulse border-2 border-slate-950">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Drawer */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Scheduled Reminders</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Asia/Kolkata</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {reminders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No scheduled reminders</p>
              ) : (
                reminders.map((r) => {
                  const isPast = new Date(r.remind_at) <= new Date() && r.status === 'pending';
                  const isDone = r.status === 'delivered';

                  return (
                    <div
                      key={r.id}
                      className={`p-3 rounded-xl border text-xs transition-colors ${
                        isPast
                          ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                          : isDone
                          ? 'bg-slate-950/40 border-slate-800/60 text-slate-400 opacity-60'
                          : 'bg-slate-950/80 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            {isPast && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                            <span className="font-semibold text-white">{r.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-1">
                            {new Date(r.remind_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                            {new Date(r.remind_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        {r.status === 'pending' && (
                          <button
                            onClick={() => handleComplete(r.id)}
                            className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            title="Mark Done"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
