'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Globe, 
  Clock, 
  Cpu, 
  Smartphone,
  Save,
  CheckCircle2,
  AlertCircle,
  Activity,
  Loader2
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const [assistantName, setAssistantName] = useState('Jarvis');
  const [language, setLanguage] = useState('hinglish');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [aiProvider, setAiProvider] = useState<'nvidia' | 'openai'>('nvidia');
  const [aiModel, setAiModel] = useState('nvidia/nemotron-3-ultra-550b-a55b');
  const [briefingTime, setBriefingTime] = useState('08:00');
  const [lowEnergyMode, setLowEnergyMode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{
    testing: boolean;
    success?: boolean;
    message?: string;
    latencyMs?: number;
  }>({ testing: false });

  // 1. Fetch persisted settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          const s = data.settings;
          if (s) {
            setAssistantName(s.assistant_name || 'Jarvis');
            setLanguage(s.language || 'hinglish');
            setTimezone(s.timezone || 'Asia/Kolkata');
            setAiProvider(s.ai_provider || 'nvidia');
            setAiModel(s.ai_model || 'nvidia/nemotron-3-ultra-550b-a55b');
            setBriefingTime(s.briefing_time || '08:00');
            setLowEnergyMode(Boolean(s.low_energy_mode));
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. Test active API connection
  const handleTestConnection = async () => {
    setTestResult({ testing: true });
    try {
      const res = await fetch('/api/settings/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          model: aiModel
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          testing: false,
          success: true,
          message: `${data.message} (Latency: ${data.latencyMs}ms)`,
          latencyMs: data.latencyMs
        });
      } else {
        setTestResult({
          testing: false,
          success: false,
          message: data.error || 'Connection failed'
        });
      }
    } catch (err: any) {
      setTestResult({
        testing: false,
        success: false,
        message: err.message || 'Network error'
      });
    }
  };

  // 3. Save permanently to database
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistant_name: assistantName,
          language,
          timezone,
          ai_provider: aiProvider,
          ai_model: aiModel,
          briefing_time: briefingTime,
          low_energy_mode: lowEnergyMode
        })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const d = await res.json();
        alert(`Failed to save: ${d.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving preferences to server');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-cyan-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-xs uppercase tracking-widest font-mono">Loading Jarvis Preferences...</span>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto text-slate-100">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
          NJ
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Nick&apos;s Jarvis OS Core</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">System Configuration & Memory Controls</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-4 flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Preferences saved permanently to Supabase database.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* AI Provider Configuration (Persistent) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>AI Provider & Neural Model</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
              Active: {aiProvider.toUpperCase()}
            </span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Active Engine</label>
            <select
              value={aiProvider}
              onChange={(e) => {
                const prov = e.target.value as 'nvidia' | 'openai';
                setAiProvider(prov);
                if (prov === 'nvidia') {
                  setAiModel('nvidia/nemotron-3-ultra-550b-a55b');
                } else {
                  setAiModel('gpt-4o-mini');
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="nvidia">NVIDIA NIM (Active 550B Nemotron-Ultra)</option>
              <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Model Name</label>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Test connection button */}
          <div className="pt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testResult.testing}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium flex items-center space-x-1.5 transition-colors border border-slate-700 disabled:opacity-50"
            >
              {testResult.testing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing Connection...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5" />
                  <span>Test API Connection</span>
                </>
              )}
            </button>
          </div>

          {/* Connection test result banner */}
          {testResult.message && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 border ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-400'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span className="leading-snug">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Assistant Identity & Behavior */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Assistant Personality & Voice</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">AI Name</label>
            <input
              type="text"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Language Recognition</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none"
            >
              <option value="hinglish">Hinglish (Hindi + English)</option>
              <option value="en">English (Official)</option>
              <option value="hi">Hindi (Devanagari)</option>
            </select>
          </div>
        </div>

        {/* Regional & Timezone (IST Asia/Kolkata) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Timezone & Routine Schedule</span>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Timezone for Reminders</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 font-mono focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">Default: Asia/Kolkata (Indian Standard Time)</p>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Daily Morning Briefing Time</label>
            <input
              type="time"
              value={briefingTime}
              onChange={(e) => setBriefingTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/30 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Saving Configuration...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes Permanently</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
};
