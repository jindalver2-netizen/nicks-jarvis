import { NextRequest, NextResponse } from 'next/server';
import { aiProvider } from '@/lib/ai-provider';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId, userId } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const effectiveUserId = userId || '00000000-0000-0000-0000-000000000000';

    // 1. Fetch relevant memories for conversational context
    const { data: recentMemories } = await supabase
      .from('memories')
      .select('category, title, content')
      .eq('user_id', effectiveUserId)
      .limit(5);

    const contextMemories = (recentMemories || []).map(
      (m: any) => `[${m.category}] ${m.title}: ${m.content}`
    );

    // 2. Parse intent and extract actions via Universal AI Provider
    const aiResult = await aiProvider.parseIntentAndExecute(
      message, 
      [], 
      contextMemories
    );

    const executedActions: any[] = [];

    // 3. Execute extracted actions in the database
    for (const action of aiResult.actions) {
      if (action.type === 'create_reminder') {
        const { title, remind_at, priority } = action.params;
        const { data: reminderData, error: reminderErr } = await supabase
          .from('reminders')
          .insert({
            user_id: effectiveUserId,
            title: title || 'Follow up',
            remind_at: remind_at || new Date(Date.now() + 3600000).toISOString(),
            priority: priority || 'medium',
            status: 'pending',
            timezone: 'Asia/Kolkata',
            notification_channel: 'in_app'
          })
          .select()
          .single();

        executedActions.push({
          type: 'create_reminder',
          status: reminderErr ? 'failed' : 'created',
          data: reminderData || action.params
        });
      } else if (action.type === 'create_task') {
        const { title, due_date, due_time, priority, category } = action.params;
        const { data: taskData, error: taskErr } = await supabase
          .from('tasks')
          .insert({
            user_id: effectiveUserId,
            title: title || 'New Task',
            due_date: due_date || null,
            due_time: due_time || null,
            priority: priority || 'medium',
            category: category || 'general',
            status: 'pending',
            timezone: 'Asia/Kolkata'
          })
          .select()
          .single();

        executedActions.push({
          type: 'create_task',
          status: taskErr ? 'failed' : 'created',
          data: taskData || action.params
        });
      } else if (action.type === 'save_memory') {
        const { category, title, content, tags } = action.params;
        const { data: memData, error: memErr } = await supabase
          .from('memories')
          .insert({
            user_id: effectiveUserId,
            category: category || 'Notes',
            title: title || 'Quick Note',
            content: content || message,
            tags: tags || [],
            importance: 'normal',
            source: 'chat'
          })
          .select()
          .single();

        executedActions.push({
          type: 'save_memory',
          status: memErr ? 'failed' : 'saved',
          data: memData || action.params
        });
      }
    }

    return NextResponse.json({
      reply: aiResult.reply,
      detectedLanguage: aiResult.detected_language,
      modelUsed: aiResult.model_used,
      executedActions
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
