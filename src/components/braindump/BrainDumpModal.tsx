'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Mic, 
  Send, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Layers, 
  Loader2, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { BrainDumpItem } from '@/app/api/braindump/classify/route';

interface BrainDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessCommit?: () => void;
}

export const BrainDumpModal: React.FC<BrainDumpModalProps> = ({
  isOpen,
  onClose,
  onSuccessCommit
}) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [parsedItems, setParsedItems] = useState<BrainDumpItem[]>([]);
  const [summary, setSummary] = useState('');
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClassify = async () => {
    if (!text.trim()) return;
    setIsClassifying(true);

    try {
      const res = await fetch('/api/braindump/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dumpText: text })
      });

      const data = await res.json();
      if (res.ok && data.items) {
        setParsedItems(data.items);
        setSummary(data.summary);
        setStep('preview');
      } else {
        alert(data.error || 'Failed to analyze brain dump');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during classification');
    } finally {
      setIsClassifying(false);
    }
  };

  const handleCommit = async () => {
    if (parsedItems.length === 0) return;
    setIsCommitting(true);

    try {
      const res = await fetch('/api/braindump/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedItems: parsedItems, originalDump: text })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessBanner(data.message || 'Committed to Jarvis OS!');
        setTimeout(() => {
          setSuccessBanner(null);
          setStep('input');
          setText('');
          setParsedItems([]);
          onClose();
          if (onSuccessCommit) onSuccessCommit();
        }, 1500);
      } else {
        alert(data.error || 'Failed to save items');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during commit');
    } finally {
      setIsCommitting(false);
    }
  };

  const removeItem = (id: string) => {
    setParsedItems(parsedItems.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: string, val: any) => {
    setParsedItems(
      parsedItems.map((i) => (i.id === id ? { ...i, [field]: val } : i))
    );
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'hi-IN';
    rec.interimResults = false;

    if (!isRecording) {
      setIsRecording(true);
      rec.start();
      rec.onresult = (e: any) => {
        const trans = e.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${trans}` : trans));
        setIsRecording(false);
      };
      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
    } else {
      rec.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-white">
                {step === 'input' ? "Jarvis Brain Dump" : "Review & Approval Drawer"}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {step === 'input' ? "Unload your mind in one go" : "Confirm before saving to database"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: INPUT STREAM OF CONSCIOUSNESS */}
        {step === 'input' && (
          <div className="mt-4 flex-1 flex flex-col">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Dump everything here (English or Hinglish)...
E.g.: 'Supplier ko call karna hai. Ek naya business idea aaya hai. Mummy ke liye medicine leni hai. Rajesh ne bola kal rate bhej dega. Website banani hai. Factory mein stock check karna hai...'"
              rows={7}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none font-sans leading-relaxed"
              autoFocus
            />

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs font-medium transition-colors ${
                  isRecording
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? "Listening..." : "Voice Dump (Hindi/English)"}</span>
              </button>

              <button
                onClick={handleClassify}
                disabled={!text.trim() || isClassifying}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
              >
                {isClassifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Classify with Jarvis</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STRUCTURED APPROVAL DRAWER */}
        {step === 'preview' && (
          <div className="mt-4 flex-1 flex flex-col overflow-hidden">
            {summary && (
              <div className="mb-3 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 leading-snug">
                {summary}
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {parsedItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase font-bold">
                        {item.type}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {item.area}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />

                  {item.actionable_steps && (
                    <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-900 space-y-0.5">
                      <p><strong className="text-cyan-400">WHAT:</strong> {item.actionable_steps.what}</p>
                      <p><strong className="text-slate-300">HOW:</strong> {item.actionable_steps.how}</p>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500 italic">
                    Original: &quot;{item.original_text}&quot;
                  </p>
                </div>
              ))}
            </div>

            {/* Commit actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Back to text
              </button>

              <button
                onClick={handleCommit}
                disabled={isCommitting || parsedItems.length === 0}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {isCommitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Committing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Save ({parsedItems.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
