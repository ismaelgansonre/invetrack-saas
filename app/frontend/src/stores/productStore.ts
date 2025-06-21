import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

interface ProductState {
  // State
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Product methods
  fetchProducts: (organizationId: string) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  createProduct: (product: ProductInsert) => Promise<Product>;
  updateProduct: (id: string, updates: ProductUpdate) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Search and filter
  searchProducts: (query: string, organizationId: string) => Promise<void>;
  getLowStockProducts: (organizationId: string, threshold?: number) => Promise<void>;
}

export const useProductStore = create<ProductState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    products: [],
    currentProduct: null,
    loading: false,
    error: null,

    // Actions
    setProducts: (products) => {
      set({ products });
    },

    setCurrentProduct: (product) => {
      set({ currentProduct: product });
    },

    setLoading: (loading) => {
      set({ loading });
    },

    setError: (error) => {
      set({ error });
    },

    // Product methods
    fetchProducts: async (organizationId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        set({ products: data || [] });
      } catch (error) {
        console.error('Error fetching products:', error);
        set({ error: 'Failed to fetch products' });
      } finally {
        set({ loading: false });
      }
    },

    fetchProduct: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        set({ currentProduct: data });
      } catch (error) {
        console.error('Error fetching product:', error);
        set({ error: 'Failed to fetch product' });
      } finally {
        set({ loading: false });
      }
    },

    createProduct: async (product: ProductInsert) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('products')
          .insert(product)
          .select()
          .single();

        if (error) throw error;

        // Add to products list
        const { products } = get();
        set({ products: [data, ...products] });

        return data;
      } catch (error) {
        console.error('Error creating product:', error);
        set({ error: 'Failed to create product' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateProduct: async (id: string, updates: ProductUpdate) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        // Update in products list
        const { products } = get();
        const updatedProducts = products.map(p => p.id === id ? data : p);
        set({ products: updatedProducts, currentProduct: data });

        return data;
      } catch (error) {
        console.error('Error updating product:', error);
        set({ error: 'Failed to update product' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    deleteProduct: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Remove from products list
        const { products } = get();
        const filteredProducts = products.filter(p => p.id !== id);
        set({ products: filteredProducts });

        // Clear current product if it was deleted
        const { currentProduct } = get();
        if (currentProduct?.id === id) {
          set({ currentProduct: null });
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        set({ error: 'Failed to delete product' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    searchProducts: async (query: string, organizationId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('organization_id', organizationId)
          .ilike('name', `%${query}%`)
          .order('name', { ascending: true });

        if (error) throw error;

        set({ products: data || [] });
      } catch (error) {
        console.error('Error searching products:', error);
        set({ error: 'Failed to search products' });
      } finally {
        set({ loading: false });
      }
    },

    getLowStockProducts: async (organizationId: string, threshold = 10) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('organization_id', organizationId)
          .lte('quantity', threshold)
          .order('quantity', { ascending: true });

        if (error) throw error;

        set({ products: data || [] });
      } catch (error) {
        console.error('Error fetching low stock products:', error);
        set({ error: 'Failed to fetch low stock products' });
      } finally {
        set({ loading: false });
      }
    },
  }))
); 