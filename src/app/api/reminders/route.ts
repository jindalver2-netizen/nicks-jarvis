import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('reminders')
      .select('*')
      .eq('user_id', userId)
      .order('remind_at', { ascending: true });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reminders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const now = new Date();
    // Add computed overdue flag
    const remindersWithMeta = (data || []).map((r) => {
      const isOverdue = r.status === 'pending' && new Date(r.remind_at) < now;
      return {
        ...r,
        is_overdue: isOverdue
      };
    });

    return NextResponse.json({ reminders: remindersWithMeta });
  } catch (err: any) {
    console.error('Reminders GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    const { title, description, remind_at, priority, timezone, notification_channel } = body;

    if (!title || !remind_at) {
      return NextResponse.json({ error: 'Title and remind_at are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reminders')
      .insert({
        user_id: userId,
        title,
        description: description || null,
        remind_at: new Date(remind_at).toISOString(),
        priority: priority || 'medium',
        timezone: timezone || 'Asia/Kolkata',
        status: 'pending',
        notification_channel: notification_channel || 'in_app'
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create reminder:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder scheduled and persisted permanently.',
      reminder: data
    });
  } catch (err: any) {
    console.error('Reminders POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    const { id, status, snooze_minutes, remind_at } = body;

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 });
    }

    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (status) {
      updates.status = status;
      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }
    }

    if (snooze_minutes) {
      const snoozeDate = new Date(Date.now() + snooze_minutes * 60000);
      updates.remind_at = snoozeDate.toISOString();
      updates.status = 'pending';
      updates.snooze_until = snoozeDate.toISOString();
    } else if (remind_at) {
      updates.remind_at = new Date(remind_at).toISOString();
      updates.status = 'pending';
    }

    const { data, error } = await supabase
      .from('reminders')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder updated successfully.',
      reminder: data
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    if (!id) {
      return NextResponse.json({ error: 'Reminder ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Reminder deleted.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
