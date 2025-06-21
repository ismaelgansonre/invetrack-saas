import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
type OrganizationUpdate = Database['public']['Tables']['organizations']['Update'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface OrganizationState {
  // State
  organizations: Organization[];
  currentOrganization: Organization | null;
  userOrganizations: Organization[];
  loading: boolean;
  error: string | null;

  // Actions
  setOrganizations: (organizations: Organization[]) => void;
  setCurrentOrganization: (organization: Organization | null) => void;
  setUserOrganizations: (organizations: Organization[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Organization methods
  fetchOrganizations: (userId: string) => Promise<void>;
  fetchOrganization: (id: string) => Promise<void>;
  createOrganization: (organization: OrganizationInsert) => Promise<Organization>;
  updateOrganization: (id: string, updates: OrganizationUpdate) => Promise<Organization>;
  deleteOrganization: (id: string) => Promise<void>;
  
  // User organization methods
  getUserOrganizations: (userId: string) => Promise<void>;
  joinOrganization: (organizationId: string, userId: string, role?: string) => Promise<void>;
  leaveOrganization: (organizationId: string, userId: string) => Promise<void>;
  
  // Multi-tenant methods
  switchOrganization: (organizationId: string) => Promise<void>;
  getCurrentUserRole: (organizationId: string, userId: string) => Promise<string | null>;
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
    // Initial state
    organizations: [],
    currentOrganization: null,
    userOrganizations: [],
    loading: false,
    error: null,

    // Actions
  setOrganizations: (organizations) => set({ organizations }),
  setCurrentOrganization: (organization) => set({ currentOrganization: organization }),
  setUserOrganizations: (organizations) => set({ userOrganizations: organizations }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

    // Organization methods
    fetchOrganizations: async (userId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching organizations:', error);
        throw new Error(error.message || 'Failed to fetch organizations');
      }

        set({ organizations: data || [] });
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organizations';
      console.error('Error fetching organizations:', errorMessage);
      set({ error: errorMessage });
      } finally {
        set({ loading: false });
      }
    },

    fetchOrganization: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', id)
          .single();

      if (error) {
        console.error('Supabase error fetching organization:', error);
        throw new Error(error.message || 'Failed to fetch organization');
      }

        set({ currentOrganization: data });
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch organization';
      console.error('Error fetching organization:', errorMessage);
      set({ error: errorMessage });
      } finally {
        set({ loading: false });
      }
    },

    createOrganization: async (organization: OrganizationInsert) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('organizations')
          .insert(organization)
          .select()
          .single();

      if (error) {
        console.error('Supabase error creating organization:', error);
        
        // Gérer les erreurs spécifiques
        if (error.code === '23505' && error.message.includes('organizations_slug_key')) {
          throw new Error('Un organisation avec cet identifiant existe déjà. Veuillez choisir un autre nom.');
        }
        
        if (error.code === '23505') {
          throw new Error('Une contrainte unique a été violée. Veuillez vérifier vos données.');
        }
        
        throw new Error(error.message || 'Failed to create organization');
      }

        // Add to organizations list
        const { organizations } = get();
        set({ organizations: [data, ...organizations] });

        return data;
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create organization';
      console.error('Error creating organization:', errorMessage);
      set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateOrganization: async (id: string, updates: OrganizationUpdate) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('organizations')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

      if (error) {
        console.error('Supabase error updating organization:', error);
        throw new Error(error.message || 'Failed to update organization');
      }

        // Update in organizations list
        const { organizations } = get();
        const updatedOrganizations = organizations.map(o => o.id === id ? data : o);
        set({ organizations: updatedOrganizations, currentOrganization: data });

        return data;
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update organization';
      console.error('Error updating organization:', errorMessage);
      set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    deleteOrganization: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { error } = await supabase
          .from('organizations')
          .delete()
          .eq('id', id);

      if (error) {
        console.error('Supabase error deleting organization:', error);
        throw new Error(error.message || 'Failed to delete organization');
      }

        // Remove from organizations list
        const { organizations } = get();
        const filteredOrganizations = organizations.filter(o => o.id !== id);
        set({ organizations: filteredOrganizations });

        // Clear current organization if it was deleted
        const { currentOrganization } = get();
        if (currentOrganization?.id === id) {
          set({ currentOrganization: null });
        }
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete organization';
      console.error('Error deleting organization:', errorMessage);
      set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    getUserOrganizations: async (userId: string) => {
      set({ loading: true, error: null });
      try {
      // Get user's profile to see which organization they belong to.
      // `authStore` is now responsible for creating the profile if it doesn't exist.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id, role')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to avoid errors if the profile is momentarily unavailable.

      if (profileError) {
        // If an actual error occurs (not just 'not found'), log it.
        console.error('Supabase error fetching user profile for orgs:', profileError);
        throw new Error(profileError.message || 'Failed to fetch user profile');
      }

      if (profile?.organization_id) {
        // Fetch the organization details
        const { data: organization, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profile.organization_id)
          .single();

        if (orgError) {
          console.error('Supabase error fetching organization details:', orgError);
          throw new Error(orgError.message || 'Failed to fetch organization');
        }

        const userOrg = {
          ...organization,
          userRole: profile.role,
        };
        
        set({ userOrganizations: [userOrg] });
      } else {
        // If the user is not part of any organization, the list is empty.
        set({ userOrganizations: [] });
      }
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user organizations';
      console.error('Error in getUserOrganizations:', errorMessage);
      set({ error: errorMessage });
      } finally {
        set({ loading: false });
      }
    },

    joinOrganization: async (organizationId: string, userId: string, role = 'member') => {
      set({ loading: true, error: null });
      try {
      // Update user's profile to join the organization
        const { error } = await supabase
        .from('profiles')
        .update({
            organization_id: organizationId,
            role: role
        })
        .eq('id', userId);

      if (error) {
        console.error('Supabase error joining organization:', error);
        throw new Error(error.message || 'Failed to join organization');
      }

        // Refresh user organizations list
        await get().getUserOrganizations(userId);
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join organization';
      console.error('Error joining organization:', errorMessage);
      set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    leaveOrganization: async (organizationId: string, userId: string) => {
      set({ loading: true, error: null });
      try {
      // Update user's profile to leave the organization
        const { error } = await supabase
        .from('profiles')
        .update({
          organization_id: null,
          role: 'user'
        })
        .eq('id', userId)
        .eq('organization_id', organizationId);

      if (error) {
        console.error('Supabase error leaving organization:', error);
        throw new Error(error.message || 'Failed to leave organization');
      }

        // Refresh user organizations list
        await get().getUserOrganizations(userId);
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave organization';
      console.error('Error leaving organization:', errorMessage);
      set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    switchOrganization: async (organizationId: string) => {
      set({ loading: true, error: null });
      try {
        // Fetch the organization details
        await get().fetchOrganization(organizationId);
        
        // Update user's current organization in profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .update({ organization_id: organizationId })
            .eq('id', user.id);

        if (error) {
          console.error('Supabase error updating profile:', error);
          throw new Error(error.message || 'Failed to update profile');
        }
        }
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch organization';
      console.error('Error switching organization:', errorMessage);
      set({ error: errorMessage });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    getCurrentUserRole: async (organizationId: string, userId: string) => {
      try {
        const { data, error } = await supabase
        .from('profiles')
          .select('role')
          .eq('organization_id', organizationId)
        .eq('id', userId)
          .single();

      if (error) {
        console.error('Supabase error fetching user role:', error);
        throw new Error(error.message || 'Failed to fetch user role');
      }

        return data?.role || null;
      } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user role';
      console.error('Error fetching user role:', errorMessage);
        return null;
      }
    },
})); 