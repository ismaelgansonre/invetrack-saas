import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
type OrganizationUpdate = Database['public']['Tables']['organizations']['Update'];

interface OrganizationState {
  // State
  organizations: Organization[];
  currentOrganization: Organization | null;
  loading: boolean;
  error: string | null;

  // Actions
  setOrganizations: (organizations: Organization[]) => void;
  setCurrentOrganization: (organization: Organization | null) => void;
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
  joinOrganization: (organizationId: string, userId: string) => Promise<void>;
  leaveOrganization: (organizationId: string, userId: string) => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    organizations: [],
    currentOrganization: null,
    loading: false,
    error: null,

    // Actions
    setOrganizations: (organizations) => {
      set({ organizations });
    },

    setCurrentOrganization: (organization) => {
      set({ currentOrganization: organization });
    },

    setLoading: (loading) => {
      set({ loading });
    },

    setError: (error) => {
      set({ error });
    },

    // Organization methods
    fetchOrganizations: async (userId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select(`
            *,
            organization_members!inner(user_id)
          `)
          .eq('organization_members.user_id', userId)
          .order('name', { ascending: true });

        if (error) throw error;

        set({ organizations: data || [] });
      } catch (error) {
        console.error('Error fetching organizations:', error);
        set({ error: 'Failed to fetch organizations' });
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

        if (error) throw error;

        set({ currentOrganization: data });
      } catch (error) {
        console.error('Error fetching organization:', error);
        set({ error: 'Failed to fetch organization' });
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

        if (error) throw error;

        // Add to organizations list
        const { organizations } = get();
        set({ organizations: [data, ...organizations] });

        return data;
      } catch (error) {
        console.error('Error creating organization:', error);
        set({ error: 'Failed to create organization' });
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

        if (error) throw error;

        // Update in organizations list
        const { organizations } = get();
        const updatedOrganizations = organizations.map(o => o.id === id ? data : o);
        set({ organizations: updatedOrganizations, currentOrganization: data });

        return data;
      } catch (error) {
        console.error('Error updating organization:', error);
        set({ error: 'Failed to update organization' });
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

        if (error) throw error;

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
        console.error('Error deleting organization:', error);
        set({ error: 'Failed to delete organization' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    getUserOrganizations: async (userId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('organization_members')
          .select(`
            organization_id,
            organizations (*)
          `)
          .eq('user_id', userId);

        if (error) throw error;

        const organizations = data?.map(item => item.organizations).filter(Boolean) || [];
        set({ organizations });
      } catch (error) {
        console.error('Error fetching user organizations:', error);
        set({ error: 'Failed to fetch user organizations' });
      } finally {
        set({ loading: false });
      }
    },

    joinOrganization: async (organizationId: string, userId: string) => {
      set({ loading: true, error: null });
      try {
        const { error } = await supabase
          .from('organization_members')
          .insert({
            organization_id: organizationId,
            user_id: userId,
            role: 'member'
          });

        if (error) throw error;

        // Refresh organizations list
        await get().getUserOrganizations(userId);
      } catch (error) {
        console.error('Error joining organization:', error);
        set({ error: 'Failed to join organization' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    leaveOrganization: async (organizationId: string, userId: string) => {
      set({ loading: true, error: null });
      try {
        const { error } = await supabase
          .from('organization_members')
          .delete()
          .eq('organization_id', organizationId)
          .eq('user_id', userId);

        if (error) throw error;

        // Refresh organizations list
        await get().getUserOrganizations(userId);
      } catch (error) {
        console.error('Error leaving organization:', error);
        set({ error: 'Failed to leave organization' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },
  }))
); 