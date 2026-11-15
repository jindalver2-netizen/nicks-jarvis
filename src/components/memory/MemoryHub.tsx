'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Brain, 
  Tag, 
  Plus, 
  ChevronRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Memory, MemoryCategory } from '@/lib/types';

export const MemoryHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Personal',
    'Business',
    'People',
    'Important Dates',
    'Preferences',
    'Ideas',
    'Notes',
    'Financial Commitments'
  ];

  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 'm1',
      user_id: 'default',
      category: 'Business',
      title: 'Pragati Industries Main Business',
      content: 'Pragati Industries specializes in high-density tarpaulin, PVC waterproof fabrics, and commercial shades.',
      tags: ['Business', 'Products', 'Manufacturing'],
      importance: 'high',
      source: 'AI Chat',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'm2',
      user_id: 'default',
      category: 'People',
      title: 'Rajesh (Key Raw Material Supplier)',
      content: 'Rajesh is the main raw material polymer supplier based in New Delhi. Prefers NEFT/RTGS payments on Fridays.',
      tags: ['Supplier', 'Delhi', 'Payments'],
      importance: 'critical',
      source: 'AI Chat',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'm3',
      user_id: 'default',
      category: 'Preferences',
      title: 'Morning Briefing Time Preference',
      content: 'Prefers morning briefing overview delivered at 8:00 AM IST with high priority tasks listed first.',
      tags: ['Routine', 'Briefing'],
      importance: 'normal',
      source: 'System',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);

  const filteredMemories = memories.filter((mem) => {
    const matchesCat = selectedCategory === 'All' || mem.category === selectedCategory;
    const matchesSearch = 
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto text-slate-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Second Brain Memory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Semantic knowledge base & personal facts</p>
        </div>
      </div>

      {/* Semantic Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories semantically or by keyword..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Memories List */}
      <div className="space-y-3">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No memories matched your query. Speak or type to add new facts!
          </div>
        ) : (
          filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {mem.category}
                </span>
                <span className="text-[10px] text-slate-500">
                  Source: {mem.source}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-slate-100 mb-1">
                {mem.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {mem.content}
              </p>

              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
                {mem.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center space-x-1"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-500" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
