import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vxhjeeacqbkrbnrnzsgp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Dk4u58EKbq-mEsxHF_YxEA_jFpawrIn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});

export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // If serviceKey is missing or is the expired 'sb_secret_nPHLPA...' key, fall back to working publishable key
  if (!serviceKey || serviceKey.startsWith('sb_secret_nPHLPA')) {
    return supabase;
  }
  
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  );
}
