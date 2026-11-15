'use client';

import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Zap, 
  Clock, 
  Mic, 
  Factory, 
  Flame, 
  Brain, 
  CheckCircle2 
} from 'lucide-react';

interface AppTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppTourModal: React.FC<AppTourModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      badge: 'WELCOME TO NICK\'S JARVIS',
      title: 'Your Personal AI Life OS & External Brain',
      description: 'Nick\'s Jarvis is built to manage your everyday life, factory operations, suppliers, and finances so you never have to hold stress in your head.',
      icon: <Sparkles className="w-10 h-10 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-600/20',
      borderColor: 'border-cyan-500/40',
      tips: [
        'Works seamlessly on Android Mobile and Desktop',
        'Speaks and understands English, Hindi & Hinglish',
        'Persistent cloud memory with zero data loss'
      ]
    },
    {
      badge: 'ACTION CENTER',
      title: '⚡ No-Brainer Tasks & 5-Minute Steps',
      description: 'Stop procrastinating on big projects. Jarvis breaks complex work into simple micro-steps with clear WHAT, HOW, and WHEN instructions.',
      icon: <Zap className="w-10 h-10 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-600/20',
      borderColor: 'border-emerald-500/40',
      tips: [
        'Filter specifically for 5-minute or phone-call tasks',
        'Check off items directly from the Home Dashboard',
        'Prioritized color-coded badges (Urgent, High, Low)'
      ]
    },
    {
      badge: 'TIME-AWARE ALARMS',
      title: '⏰ Persistent Cloud Reminders',
      description: 'Set exact reminders in Asia/Kolkata timezone. They survive server reboots, ring audio chimes when due, and offer 10-minute snoozes.',
      icon: <Clock className="w-10 h-10 text-cyan-400" />,
      color: 'from-cyan-500/20 to-indigo-600/20',
      borderColor: 'border-cyan-500/40',
      tips: [
        'Pop-up HUD banner + audible chime alert',
        'One-tap "Snooze 10m" and "Mark Done" buttons',
        'Past-due items automatically flagged with red overdue badges'
      ]
    },
    {
      badge: 'STREAM OF CONSCIOUSNESS',
      title: '🎙️ Voice & Text Brain Dump',
      description: 'When your mind is racing with multiple thoughts, tap Brain Dump and speak or type everything. Jarvis automatically organizes it.',
      icon: <Mic className="w-10 h-10 text-violet-400" />,
      color: 'from-violet-500/20 to-purple-600/20',
      borderColor: 'border-violet-500/40',
      tips: [
        'Identifies tasks, reminders, people, and expenses',
        'Interactive Approval Drawer lets you edit before saving',
        'Deduplicates and preserves your raw original thoughts'
      ]
    },
    {
      badge: 'BUSINESS & PLANT',
      title: '🏭 Factory Operations & People CRM',
      description: 'Keep Pragati Industries, Gayatri Polymers, and supplier profiles like Rajesh Sharma at your fingertips.',
      icon: <Factory className="w-10 h-10 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-600/20',
      borderColor: 'border-amber-500/40',
      tips: [
        'Daily machine checklists (Extrusion Line 1 & Line 2)',
        'Track raw materials, dispatches, and petty cash outlays',
        'Supplier payment terms & customer receivable ledgers'
      ]
    },
    {
      badge: 'ANTI-BURNOUT',
      title: '🔋 Low-Energy Mode',
      description: 'Having a low-energy or stressful day? Turn on Low-Energy Mode. Jarvis hides all clutter and suggests only 1 easy 5-minute action to keep momentum.',
      icon: <Flame className="w-10 h-10 text-amber-400" />,
      color: 'from-amber-500/20 to-rose-600/20',
      borderColor: 'border-amber-500/40',
      tips: [
        'Zero pressure, calming interface',
        'Procrastination Buster: remembers what worked in past slumps',
        'One-tap toggle from Home Dashboard anytime'
      ]
    }
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 text-slate-100">
      <div className={`w-full max-w-lg bg-slate-900 border ${slide.borderColor} rounded-3xl p-6 shadow-2xl relative transition-all`}>
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>APP TOUR ({currentSlide + 1} OF {slides.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="py-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${slide.color} border ${slide.borderColor} flex items-center justify-center mb-4 shadow-lg`}>
            {slide.icon}
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
            {slide.badge}
          </span>
          <h3 className="text-xl font-bold text-white mt-1 mb-2">
            {slide.title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {slide.description}
          </p>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
              Key Capabilities:
            </span>
            {slide.tips.map((t, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation & Progress */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex space-x-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center space-x-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center space-x-1 transition-colors shadow-md shadow-cyan-500/20"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center space-x-1 transition-colors shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Get Started!</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
