import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];
type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update'];

interface SupplierState {
  // State
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  loading: boolean;
  error: string | null;

  // Actions
  setSuppliers: (suppliers: Supplier[]) => void;
  setSelectedSupplier: (supplier: Supplier | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Supplier methods
  fetchSuppliers: (organizationId: string) => Promise<void>;
  fetchSupplier: (id: string) => Promise<void>;
  createSupplier: (supplier: SupplierInsert) => Promise<Supplier>;
  updateSupplier: (id: string, updates: SupplierUpdate) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
  
  // Filtering and search
  searchSuppliers: (query: string) => Supplier[];
  filterSuppliersByStatus: (status: string) => Supplier[];
}

export const useSupplierStore = create<SupplierState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    suppliers: [],
    selectedSupplier: null,
    loading: false,
    error: null,

    // Actions
    setSuppliers: (suppliers) => {
      set({ suppliers });
    },

    setSelectedSupplier: (supplier) => {
      set({ selectedSupplier: supplier });
    },

    setLoading: (loading) => {
      set({ loading });
    },

    setError: (error) => {
      set({ error });
    },

    // Supplier methods
    fetchSuppliers: async (organizationId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .eq('organization_id', organizationId)
          .order('name', { ascending: true });

        if (error) throw error;

        set({ suppliers: data || [] });
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        set({ error: 'Failed to fetch suppliers' });
      } finally {
        set({ loading: false });
      }
    },

    fetchSupplier: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        set({ selectedSupplier: data });
      } catch (error) {
        console.error('Error fetching supplier:', error);
        set({ error: 'Failed to fetch supplier' });
      } finally {
        set({ loading: false });
      }
    },

    createSupplier: async (supplier: SupplierInsert) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .insert(supplier)
          .select()
          .single();

        if (error) throw error;

        // Add to suppliers list
        const { suppliers } = get();
        set({ suppliers: [data, ...suppliers] });

        return data;
      } catch (error) {
        console.error('Error creating supplier:', error);
        set({ error: 'Failed to create supplier' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateSupplier: async (id: string, updates: SupplierUpdate) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        // Update in suppliers list
        const { suppliers } = get();
        const updatedSuppliers = suppliers.map(s => s.id === id ? data : s);
        set({ suppliers: updatedSuppliers, selectedSupplier: data });

        return data;
      } catch (error) {
        console.error('Error updating supplier:', error);
        set({ error: 'Failed to update supplier' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    deleteSupplier: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { error } = await supabase
          .from('suppliers')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Remove from suppliers list
        const { suppliers } = get();
        const filteredSuppliers = suppliers.filter(s => s.id !== id);
        set({ suppliers: filteredSuppliers });

        // Clear selected supplier if it was deleted
        const { selectedSupplier } = get();
        if (selectedSupplier?.id === id) {
          set({ selectedSupplier: null });
        }
      } catch (error) {
        console.error('Error deleting supplier:', error);
        set({ error: 'Failed to delete supplier' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    // Filtering and search
    searchSuppliers: (query: string) => {
      const { suppliers } = get();
      if (!query.trim()) return suppliers;
      
      const lowercaseQuery = query.toLowerCase();
      return suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(lowercaseQuery) ||
        supplier.contact_info?.toLowerCase().includes(lowercaseQuery)
      );
    },

    filterSuppliersByStatus: (status: string) => {
      return [];
    },
  }))
); 