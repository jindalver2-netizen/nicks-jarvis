import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    const { data: pref, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching settings:', error);
    }

    // Default configuration with environment fallbacks
    const settings = {
      ai_provider: pref?.ai_provider || process.env.AI_PROVIDER || 'nvidia',
      ai_model: pref?.ai_model || process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b',
      assistant_name: pref?.settings?.assistant_name || 'Jarvis',
      language: pref?.voice_transcription_lang || 'hinglish',
      timezone: pref?.settings?.timezone || process.env.NEXT_PUBLIC_APP_TIMEZONE || 'Asia/Kolkata',
      briefing_time: pref?.settings?.briefing_time || '08:00',
      theme: pref?.theme || 'dark',
      low_energy_mode: Boolean(pref?.settings?.low_energy_mode)
    };

    return NextResponse.json({ settings });
  } catch (err: any) {
    console.error('Settings GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getServiceSupabase();
    const userId = process.env.DEFAULT_USER_ID || '15aa37f0-28fb-42bc-bbc1-956e3bb6a84d';

    const {
      ai_provider,
      ai_model,
      assistant_name,
      language,
      timezone,
      briefing_time,
      low_energy_mode
    } = body;

    // Check if record exists
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('id, settings')
      .eq('user_id', userId)
      .maybeSingle();

    const currentSettings = existing?.settings || {};
    const updatedSettings = {
      ...currentSettings,
      assistant_name: assistant_name ?? currentSettings.assistant_name ?? 'Jarvis',
      timezone: timezone ?? currentSettings.timezone ?? 'Asia/Kolkata',
      briefing_time: briefing_time ?? currentSettings.briefing_time ?? '08:00',
      low_energy_mode: low_energy_mode !== undefined ? low_energy_mode : currentSettings.low_energy_mode
    };

    const updatePayload: any = {
      user_id: userId,
      ai_provider: ai_provider || 'nvidia',
      ai_model: ai_model || 'nvidia/nemotron-3-ultra-550b-a55b',
      voice_transcription_lang: language || 'hinglish',
      settings: updatedSettings,
      updated_at: new Date().toISOString()
    };

    let resultError = null;
    if (existing) {
      const { error } = await supabase
        .from('user_preferences')
        .update(updatePayload)
        .eq('id', existing.id);
      resultError = error;
    } else {
      const { error } = await supabase
        .from('user_preferences')
        .insert(updatePayload);
      resultError = error;
    }

    if (resultError) {
      console.error('Failed to save settings:', resultError);
      return NextResponse.json({ error: resultError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved permanently to database.',
      settings: updatePayload
    });
  } catch (err: any) {
    console.error('Settings POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
