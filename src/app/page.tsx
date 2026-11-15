'use client';

import React, { useState } from 'react';
import { BottomNav, NavTab } from '@/components/navigation/BottomNav';
import { HomeDashboard } from '@/components/dashboard/HomeDashboard';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { TaskManager } from '@/components/tasks/TaskManager';
import { MemoryHub } from '@/components/memory/MemoryHub';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { QuickCaptureModal } from '@/components/quick-capture/QuickCaptureModal';
import { BrainDumpModal } from '@/components/braindump/BrainDumpModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isBrainDumpOpen, setIsBrainDumpOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Dynamic Screen View */}
      <div className="flex-1 w-full max-w-4xl mx-auto">
        {currentTab === 'home' && (
          <HomeDashboard 
            onNavigateTab={(tab) => setCurrentTab(tab)} 
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            onOpenBrainDump={() => setIsBrainDumpOpen(true)}
          />
        )}

        {currentTab === 'assistant' && (
          <ChatInterface />
        )}

        {currentTab === 'tasks' && (
          <TaskManager />
        )}

        {currentTab === 'memory' && (
          <MemoryHub />
        )}

        {currentTab === 'profile' && (
          <ProfileSettings />
        )}
      </div>

      {/* Quick Capture Floating Modal */}
      <QuickCaptureModal 
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
      />

      {/* Stream-of-Consciousness Brain Dump + Approval Drawer Modal */}
      <BrainDumpModal
        isOpen={isBrainDumpOpen}
        onClose={() => setIsBrainDumpOpen(false)}
        onSuccessCommit={() => setCurrentTab('tasks')}
      />

      {/* Jarvis Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
      />

    </main>
  );
}
