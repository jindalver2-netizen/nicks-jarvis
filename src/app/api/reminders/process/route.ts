import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Verify secret if configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized scheduler trigger' }, { status: 401 });
    }

    const supabase = getServiceSupabase();
    const now = new Date().toISOString();

    // Query due reminders that survive server restarts
    const { data: dueReminders, error } = await supabase
      .from('reminders')
      .select('*, recurring_rules(*)')
      .eq('status', 'pending')
      .lte('remind_at', now);

    if (error) {
      console.error('Error fetching due reminders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!dueReminders || dueReminders.length === 0) {
      return NextResponse.json({ message: 'No reminders due', processed: 0 });
    }

    let deliveredCount = 0;

    for (const reminder of dueReminders) {
      // 1. Mark reminder as delivered
      await supabase
        .from('reminders')
        .update({
          status: 'delivered',
          delivered_at: now,
          updated_at: now
        })
        .eq('id', reminder.id);

      // 2. Deliver into in-app notification center
      await supabase
        .from('notifications')
        .insert({
          user_id: reminder.user_id,
          title: `Reminder: ${reminder.title}`,
          message: reminder.description || `It's time for: ${reminder.title}`,
          type: 'reminder',
          link: '/tasks',
          is_read: false,
          metadata: { reminder_id: reminder.id }
        });

      // 3. Log delivery status
      await supabase
        .from('notification_logs')
        .insert({
          user_id: reminder.user_id,
          reminder_id: reminder.id,
          channel: reminder.notification_channel || 'in_app',
          status: 'success',
          sent_at: now
        });

      // 4. Handle recurring schedules if attached
      if (reminder.recurring_rules) {
        const rule = reminder.recurring_rules;
        const nextDate = new Date(reminder.remind_at);

        if (rule.frequency === 'daily') {
          nextDate.setDate(nextDate.getDate() + (rule.interval_value || 1));
        } else if (rule.frequency === 'weekly') {
          nextDate.setDate(nextDate.getDate() + 7 * (rule.interval_value || 1));
        } else if (rule.frequency === 'monthly') {
          nextDate.setMonth(nextDate.getMonth() + (rule.interval_value || 1));
        }

        // Schedule next persistent occurrence
        await supabase
          .from('reminders')
          .insert({
            user_id: reminder.user_id,
            task_id: reminder.task_id,
            title: reminder.title,
            description: reminder.description,
            remind_at: nextDate.toISOString(),
            timezone: reminder.timezone,
            recurrence_rule_id: rule.id,
            priority: reminder.priority,
            status: 'pending',
            notification_channel: reminder.notification_channel
          });
      }

      deliveredCount++;
    }

    return NextResponse.json({
      message: 'Processed reminders successfully',
      processed: dueReminders.length,
      delivered: deliveredCount
    });
  } catch (err: any) {
    console.error('Reminder worker error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
