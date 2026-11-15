'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Brain, 
  Tag, 
  Plus, 
  Sparkles,
  BookOpen,
  User,
  Heart,
  Briefcase,
  Flame,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Memory } from '@/lib/types';

export const MemoryHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Experience capture form state
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [situation, setSituation] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [outcome, setOutcome] = useState('');
  const [isSavingExp, setIsSavingExp] = useState(false);

  const categories = [
    'All',
    'Experiences',
    'Business',
    'People',
    'Personal',
    'Important Dates',
    'Preferences',
    'Ideas',
    'Financial Commitments'
  ];

  const fetchMemories = async () => {
    try {
      const res = await fetch(`/api/memories${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [searchQuery]);

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim() || !actionTaken.trim()) return;

    setIsSavingExp(true);
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation,
          action_taken: actionTaken,
          reported_outcome: outcome,
          tags: ['mood-to-action', 'routine']
        })
      });

      if (res.ok) {
        setSituation('');
        setActionTaken('');
        setOutcome('');
        setIsAddingExperience(false);
        fetchMemories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingExp(false);
    }
  };

  const filteredMemories = memories.filter((mem) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Experiences') {
      return mem.tags.includes('experience') || mem.source === 'experience_logger';
    }
    return mem.category === selectedCategory;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto text-slate-100 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Second Brain Hub</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">Semantic Memory, People CRM & Experience Recall</p>
        </div>

        <button
          onClick={() => setIsAddingExperience(!isAddingExperience)}
          className="px-3 py-1.5 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <Flame className="w-3.5 h-3.5 text-violet-400" />
          <span>Log Experience</span>
        </button>
      </div>

      {/* Experience Logger Form (Part 9: Mood-to-Action) */}
      {isAddingExperience && (
        <form onSubmit={handleSaveExperience} className="mb-4 p-4 bg-slate-900 border border-violet-500/40 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center space-x-2 text-violet-400 text-xs font-bold font-mono uppercase">
            <Flame className="w-4 h-4" />
            <span>Record What Helped (Mood-to-Action)</span>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">What was the situation? (Distracted, unmotivated, low mood)</label>
            <input
              type="text"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="E.g.: Feeling unmotivated and procrastinating on factory work"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Action taken to restart?</label>
            <input
              type="text"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="E.g.: Washed face, went for 10-minute walk, drank water"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Reported outcome?</label>
            <input
              type="text"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="E.g.: Started working calmly, spent 2 hours productively"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingExperience(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingExp}
              className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold"
            >
              Save Experience
            </button>
          </div>
        </form>
      )}

      {/* Semantic Search Input */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-cyan-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories, people, supplier commitments..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Memories List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-xs flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Searching Second Brain database...</span>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-900">
          No memories match your query. Talk to Jarvis to save facts, people, or experiences!
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase">
                  {mem.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(mem.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white mb-1">
                {mem.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-3 whitespace-pre-wrap">
                {mem.content}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
                {mem.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center space-x-1 font-mono"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
