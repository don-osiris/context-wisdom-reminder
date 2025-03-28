
import { createClient } from '@supabase/supabase-js';

// Use the values from the Supabase integration
const supabaseUrl = "https://abpynthibmcuyxzkjcvn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicHludGhpYm1jdXl4emtqY3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMjgxMTgsImV4cCI6MjA1ODcwNDExOH0.WRQLBksvxLoLhEScPCacIUVM5oKpXozWeiUNAhSW_DY";

// Create the Supabase client with the proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  }
});

// Helper function to check if Supabase is properly configured
export const isSupabaseAvailable = () => true; // Always true now since we have hardcoded values
