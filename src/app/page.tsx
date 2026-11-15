'use client';

import React, { useState } from 'react';
import { BottomNav, NavTab } from '@/components/navigation/BottomNav';
import { HomeDashboard } from '@/components/dashboard/HomeDashboard';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { TaskManager } from '@/components/tasks/TaskManager';
import { MemoryHub } from '@/components/memory/MemoryHub';
import { ProfileSettings } from '@/components/profile/ProfileSettings';
import { QuickCaptureModal } from '@/components/quick-capture/QuickCaptureModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-between">
      
      {/* Dynamic Screen View */}
      <div className="flex-1 w-full max-w-lg mx-auto">
        {currentTab === 'home' && (
          <HomeDashboard 
            onNavigateTab={(tab) => setCurrentTab(tab)} 
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
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

      {/* Floating Quick Capture Modal */}
      <QuickCaptureModal 
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
      />

      {/* Native-feeling Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        unreadCount={1}
      />

    </main>
  );
}
