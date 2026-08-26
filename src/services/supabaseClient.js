import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder')
  );
};

// Create client with fallback placeholder to prevent crash when env is missing
const configured = isSupabaseConfigured();

export const supabase = createClient(
  configured ? supabaseUrl : 'https://placeholder.supabase.co',
  configured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken: configured,
      persistSession: configured,
      detectSessionInUrl: configured
    }
  }
);
