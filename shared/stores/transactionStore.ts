import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

interface TransactionState {
  // State
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: string | null;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Transaction methods
  fetchTransactions: (organizationId: string) => Promise<void>;
  fetchTransaction: (id: string) => Promise<void>;
  createTransaction: (transaction: TransactionInsert) => Promise<Transaction>;
  updateTransaction: (id: string, updates: TransactionUpdate) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Filtering and analytics
  getTransactionsByType: (organizationId: string, type: 'in' | 'out') => Promise<void>;
  getTransactionsByDateRange: (organizationId: string, startDate: string, endDate: string) => Promise<void>;
  getTransactionsByProduct: (organizationId: string, productId: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    transactions: [],
    currentTransaction: null,
    loading: false,
    error: null,

    // Actions
    setTransactions: (transactions) => {
      set({ transactions });
    },

    setCurrentTransaction: (transaction) => {
      set({ currentTransaction: transaction });
    },

    setLoading: (loading) => {
      set({ loading });
    },

    setError: (error) => {
      set({ error });
    },

    // Transaction methods
    fetchTransactions: async (organizationId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            products (name)
          `)
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        set({ transactions: data || [] });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        set({ error: 'Failed to fetch transactions' });
      } finally {
        set({ loading: false });
      }
    },

    fetchTransaction: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            products (name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        set({ currentTransaction: data });
      } catch (error) {
        console.error('Error fetching transaction:', error);
        set({ error: 'Failed to fetch transaction' });
      } finally {
        set({ loading: false });
      }
    },

    createTransaction: async (transaction: TransactionInsert) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('transactions')
          .insert(transaction)
          .select(`
            *,
            products (name)
          `)
          .single();

        if (error) throw error;

        // Add to transactions list
        const { transactions } = get();
        set({ transactions: [data, ...transactions] });

        return data;
      } catch (error) {
        console.error('Error creating transaction:', error);
        set({ error: 'Failed to create transaction' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateTransaction: async (id: string, updates: TransactionUpdate) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('transactions')
          .update(updates)
          .eq('id', id)
          .select(`
            *,
            products (name)
          `)
          .single();

        if (error) throw error;

        // Update in transactions list
        const { transactions } = get();
        const updatedTransactions = transactions.map(t => t.id === id ? data : t);
        set({ transactions: updatedTransactions, currentTransaction: data });

        return data;
      } catch (error) {
        console.error('Error updating transaction:', error);
        set({ error: 'Failed to update transaction' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    deleteTransaction: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Remove from transactions list
        const { transactions } = get();
        const filteredTransactions = transactions.filter(t => t.id !== id);
        set({ transactions: filteredTransactions });

        // Clear current transaction if it was deleted
        const { currentTransaction } = get();
        if (currentTransaction?.id === id) {
          set({ currentTransaction: null });
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
        set({ error: 'Failed to delete transaction' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    getTransactionsByType: async (organizationId: string, type: 'in' | 'out') => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            products (name)
          `)
          .eq('organization_id', organizationId)
          .eq('type', type)
          .order('created_at', { ascending: false });

        if (error) throw error;

        set({ transactions: data || [] });
      } catch (error) {
        console.error('Error fetching transactions by type:', error);
        set({ error: 'Failed to fetch transactions by type' });
      } finally {
        set({ loading: false });
      }
    },

    getTransactionsByDateRange: async (organizationId: string, startDate: string, endDate: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            products (name)
          `)
          .eq('organization_id', organizationId)
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .order('created_at', { ascending: false });

        if (error) throw error;

        set({ transactions: data || [] });
      } catch (error) {
        console.error('Error fetching transactions by date range:', error);
        set({ error: 'Failed to fetch transactions by date range' });
      } finally {
        set({ loading: false });
      }
    },

    getTransactionsByProduct: async (organizationId: string, productId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            products (name)
          `)
          .eq('organization_id', organizationId)
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        set({ transactions: data || [] });
      } catch (error) {
        console.error('Error fetching transactions by product:', error);
        set({ error: 'Failed to fetch transactions by product' });
      } finally {
        set({ loading: false });
      }
    },
  }))
); 