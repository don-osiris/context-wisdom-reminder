
import { createClient } from '@supabase/supabase-js';

// Default to empty strings if environment variables are not available
// This prevents runtime errors, but the client won't be functional until proper values are provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the Supabase URL and key are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseAvailable = () => isSupabaseConfigured;
