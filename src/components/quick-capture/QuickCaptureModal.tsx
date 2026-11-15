'use client';

import React, { useState } from 'react';
import { X, Mic, Send, Image as ImageIcon, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessCapture?: () => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onSuccessCapture
}) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCapture = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.reply || 'Captured successfully!');
        setText('');
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
          if (onSuccessCapture) onSuccessCapture();
        }, 1500);
      } else {
        alert(data.error || 'Failed to capture');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while capturing');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported on this browser. Please type your message.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    } else {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-950 border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative text-slate-100 mb-0 sm:mb-10">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-400 font-mono">
                JARVIS QUICK CAPTURE
              </h3>
              <p className="text-[10px] text-slate-400">Speak or write in English or Hinglish</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Area */}
        <div className="mt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="E.g.: 'Remind me today at 5:30 PM to call the supplier' or 'Factory stock review complete'..."
            rows={3}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none font-sans"
            autoFocus
          />
        </div>

        {/* Success message banner */}
        {successMsg && (
          <div className="mt-2 flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mt-4 flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
                isRecording 
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' 
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Voice recording (Hindi/English)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => alert('Document & bill OCR intelligence is active in Document Library!')}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
              title="Attach Document or Receipt"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleCapture}
            disabled={!text.trim() || isLoading}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Commit</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
