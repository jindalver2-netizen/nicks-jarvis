import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { approvedItems, originalDump } = await req.json();

    if (!Array.isArray(approvedItems) || approvedItems.length === 0) {
      return NextResponse.json({ error: 'No approved items to save' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    const savedRecords: any[] = [];

    for (const item of approvedItems) {
      if (item.type === 'task' || item.type === 'project') {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            user_id: userId,
            title: item.title,
            description: item.actionable_steps ? `HOW: ${item.actionable_steps.how}` : item.original_text,
            due_date: item.suggested_date || null,
            due_time: item.suggested_time || null,
            priority: item.priority || 'medium',
            category: item.area || 'General',
            status: 'pending',
            timezone: 'Asia/Kolkata'
          })
          .select()
          .single();

        if (!error && data) {
          savedRecords.push({ type: 'task', id: data.id, title: data.title });
        }
      } else if (item.type === 'reminder') {
        const remindDate = item.suggested_date 
          ? new Date(`${item.suggested_date}T${item.suggested_time || '10:00'}:00+05:30`)
          : new Date(Date.now() + 86400000);

        const { data, error } = await supabase
          .from('reminders')
          .insert({
            user_id: userId,
            title: item.title,
            description: item.original_text,
            remind_at: remindDate.toISOString(),
            priority: item.priority || 'medium',
            timezone: 'Asia/Kolkata',
            status: 'pending',
            notification_channel: 'in_app'
          })
          .select()
          .single();

        if (!error && data) {
          savedRecords.push({ type: 'reminder', id: data.id, title: data.title });
        }
      } else {
        // Idea, commitment, journal, note -> memories table
        const categoryMap: Record<string, string> = {
          'idea': 'Ideas',
          'commitment': 'Financial Commitments',
          'expense': 'Financial Commitments',
          'journal': 'Notes',
          'question': 'Notes'
        };

        const { data, error } = await supabase
          .from('memories')
          .insert({
            user_id: userId,
            category: categoryMap[item.type] || 'Business',
            title: item.title,
            content: item.original_text,
            tags: [item.area, item.type, ...(item.context_tags || [])],
            importance: item.priority === 'urgent' || item.priority === 'high' ? 'high' : 'normal',
            source: 'brain_dump'
          })
          .select()
          .single();

        if (!error && data) {
          savedRecords.push({ type: 'memory', id: data.id, title: data.title });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Committed ${savedRecords.length} items to your Jarvis OS.`,
      savedRecords
    });
  } catch (err: any) {
    console.error('Brain dump commit error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
