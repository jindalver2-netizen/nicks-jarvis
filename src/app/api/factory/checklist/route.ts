import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

const DEFAULT_FACTORY_TASKS = [
  { title: 'Check raw material stock (PVC resin, Tarpaulin rolls)', category: 'Factory Operations' },
  { title: 'Verify daily production output & machine status', category: 'Factory Operations' },
  { title: 'Review pending dispatch & transporter booking', category: 'Factory Operations' },
  { title: 'Check supplier raw material deliveries & invoices', category: 'Factory Operations' },
  { title: 'Record daily factory expenses & cash outlays', category: 'Factory Operations' }
];

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';
    const today = new Date().toISOString().split('T')[0];

    // Fetch existing factory tasks for today
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('category', 'Factory Operations')
      .eq('due_date', today);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      date: today,
      tasks: data || [],
      default_templates: DEFAULT_FACTORY_TASKS
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';
    const today = new Date().toISOString().split('T')[0];

    // Initialize today's factory checklist if not already created
    const created = [];
    for (const t of DEFAULT_FACTORY_TASKS) {
      const { data } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: t.title,
          category: t.category,
          due_date: today,
          priority: 'high',
          status: 'pending',
          timezone: 'Asia/Kolkata'
        })
        .select()
        .single();

      if (data) created.push(data);
    }

    return NextResponse.json({
      success: true,
      message: `Initialized ${created.length} factory checklist items for today.`,
      tasks: created
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
