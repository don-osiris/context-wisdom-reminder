
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured] = useState(isSupabaseAvailable());
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConfigured) {
      console.warn('Supabase is not configured properly. Authentication will not work.');
      return;
    }
    
    // Only attempt to get session if Supabase is configured
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          toast.error('Authentication error');
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Only set up auth state change listener if Supabase is configured
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isConfigured]);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      toast.error('Authentication is not configured');
      console.error('Cannot sign in: Supabase is not configured properly');
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Signed in successfully');
      navigate('/home');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Error signing in');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    if (!isConfigured) {
      toast.error('Authentication is not configured');
      console.error('Cannot sign up: Supabase is not configured properly');
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Account created! Please check your email for confirmation');
      navigate('/home');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error creating account');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!isConfigured) {
      toast.error('Authentication is not configured');
      console.error('Cannot sign out: Supabase is not configured properly');
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
