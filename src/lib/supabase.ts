
import { createClient } from '@supabase/supabase-js';

// Default to empty strings if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the Supabase URL and key are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create a dummy client if not configured, or the real client if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
      },
    } as any;

// Helper function to check if Supabase is properly configured
export const isSupabaseAvailable = () => isSupabaseConfigured;
