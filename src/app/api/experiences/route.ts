import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    // Experience memories are stored under category 'Experiences' or with source 'experience_logger'
    let query = supabase
      .from('memories')
      .select('*')
      .eq('user_id', userId)
      .eq('category', 'Personal')
      .order('created_at', { ascending: false });

    if (q) {
      query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ experiences: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    const { situation, action_taken, reported_outcome, tags } = body;

    if (!situation || !action_taken) {
      return NextResponse.json({ error: 'Situation and action taken are required' }, { status: 400 });
    }

    const title = `Experience: ${situation.slice(0, 35)}...`;
    const formattedContent = `SITUATION: ${situation}\nACTION TAKEN: ${action_taken}\nOUTCOME: ${reported_outcome || 'Recorded for future reference'}`;

    const { data, error } = await supabase
      .from('memories')
      .insert({
        user_id: userId,
        category: 'Personal',
        title,
        content: formattedContent,
        tags: ['experience', 'mood-to-action', ...(tags || [])],
        importance: 'high',
        source: 'experience_logger'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Experience saved. Jarvis will recall this when you face a similar situation.',
      experience: data
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
