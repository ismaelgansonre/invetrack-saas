import { supabase } from './supabase';
import type { Database } from '../types/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

/**
 * Add a new product to the database
 */
export const addProduct = async (
  productData: ProductInsert,
  setErrorMessage?: (message: string) => void
): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      const errorMessage = error.message || 'Failed to add product';
      setErrorMessage?.(errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (
  id: string,
  updates: ProductUpdate,
  setErrorMessage?: (message: string) => void
): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.message || 'Failed to update product';
      setErrorMessage?.(errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (
  id: string,
  setErrorMessage?: (message: string) => void
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      const errorMessage = error.message || 'Failed to delete product';
      setErrorMessage?.(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProduct = async (id: string): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in fetchProduct:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID (alias for fetchProduct)
 */
export const fetchProductById = async (id: string): Promise<Product> => {
  return fetchProduct(id);
};

/**
 * Fetch all products for an organization
 */
export const fetchProducts = async (organizationId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select()
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
}; 