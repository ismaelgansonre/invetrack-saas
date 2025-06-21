import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { logSupabaseError, handleSupabaseError } from '../lib/utils/errorHandling';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  // State
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  
  // Initialize auth
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    user: null,
    profile: null,
    loading: true,
    isAuthenticated: false,

    // Actions
    setUser: (user) => {
      set({ user, isAuthenticated: !!user });
    },

    setProfile: (profile) => {
      set({ profile });
    },

    setLoading: (loading) => {
      set({ loading });
    },

    // Auth methods
    signIn: async (email: string, password: string) => {
      set({ loading: true });
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        set({ user: data.user, isAuthenticated: !!data.user });
        
        if (data.user) {
          await get().fetchProfile(data.user.id);
        }
      } catch (error) {
        logSupabaseError('Sign in error', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    signUp: async (email: string, password: string, fullName: string) => {
      set({ loading: true });
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        set({ user: data.user, isAuthenticated: !!data.user });
        
        if (data.user) {
          await get().fetchProfile(data.user.id);
        }
      } catch (error) {
        logSupabaseError('Sign up error', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    signOut: async () => {
      set({ loading: true });
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        set({ 
          user: null, 
          profile: null, 
          isAuthenticated: false 
        });
      } catch (error) {
        logSupabaseError('Sign out error', error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateProfile: async (updates: Partial<Profile>) => {
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      try {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;

        set({ profile: data });
        return data;
      } catch (error) {
        logSupabaseError('Update profile error', error);
        throw error;
      }
    },

    fetchProfile: async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          logSupabaseError('Error fetching profile', error);
          set({ profile: null });
          return;
        }

        if (profile) {
          set({ profile });
        } else {
          console.log('Profile not found, creating new profile for user:', userId);
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({ id: userId })
            .select()
            .single();

          if (createError) {
            logSupabaseError('Error creating profile after not finding one', createError);
            set({ profile: null });
            return;
          }

          console.log('New profile created:', newProfile);
          set({ profile: newProfile });
        }
      } catch (error) {
        logSupabaseError('A critical error occurred in fetchProfile', error);
        set({ profile: null });
      }
    },

    initialize: async () => {
      set({ loading: true });
      
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          set({ user: session.user, isAuthenticated: true });
          await get().fetchProfile(session.user.id);
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
          set({ user: session?.user ?? null, isAuthenticated: !!session?.user });
          
          if (session?.user) {
            await get().fetchProfile(session.user.id);
          } else {
            set({ profile: null });
          }
        });
      } catch (error) {
        logSupabaseError('Auth initialization error', error);
      } finally {
        set({ loading: false });
      }
    },
  }))
); 