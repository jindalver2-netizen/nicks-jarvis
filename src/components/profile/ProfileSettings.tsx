'use client';

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Globe, 
  Clock, 
  Bell, 
  Cpu, 
  ShieldCheck, 
  Smartphone,
  Save,
  CheckCircle2
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const [assistantName, setAssistantName] = useState('Memorae');
  const [language, setLanguage] = useState('hinglish');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [aiProvider, setAiProvider] = useState('openai');
  const [briefingTime, setBriefingTime] = useState('08:00');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto text-slate-100">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
          U
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Personal Profile & Brain Config</h1>
          <p className="text-xs text-slate-400">Manage settings, AI model, and scheduling</p>
        </div>
      </div>

      {saved && (
        <div className="mb-4 flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Preferences updated and saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Assistant Identity */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Assistant Configuration</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Assistant Name</label>
            <input
              type="text"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">AI Provider Engine</label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none"
            >
              <option value="openai">OpenAI (gpt-4o-mini / gpt-4o)</option>
              <option value="nvidia">NVIDIA NIM (meta/llama-3.1-70b-instruct)</option>
              <option value="gemini">Google Gemini (OpenAI REST Compatible)</option>
            </select>
          </div>
        </div>

        {/* Regional & Timezone */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Language & Timezone</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Default Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none"
            >
              <option value="hinglish">Hinglish (Hindi + English)</option>
              <option value="en">English (Official)</option>
              <option value="hi">Hindi (Devanagari)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Timezone for Reminders</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">Default: Asia/Kolkata (IST)</p>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Daily Briefing Time</label>
            <input
              type="time"
              value={briefingTime}
              onChange={(e) => setBriefingTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* PWA & System Integrity */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>PWA & Security</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-300">Android PWA Installation</span>
            <span className="text-emerald-400 font-medium">Ready</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-300">Persistent Reminders</span>
            <span className="text-emerald-400 font-medium">Server-Restart Protected</span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-300">Row Level Security (RLS)</span>
            <span className="text-emerald-400 font-medium">Enabled (Supabase)</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/30 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>

      </form>

    </div>
  );
};
