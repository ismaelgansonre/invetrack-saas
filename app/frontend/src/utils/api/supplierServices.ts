import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type Supplier = Database['public']['Tables']['suppliers']['Row'];
type SupplierInsert = Database['public']['Tables']['suppliers']['Insert'];
type SupplierUpdate = Database['public']['Tables']['suppliers']['Update'];

/**
 * Add a new supplier to the database
 */
export const addSupplier = async (
  supplierData: SupplierInsert,
  setErrorMessage?: (message: string) => void
): Promise<Supplier> => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
      .select()
      .single();

    if (error) {
      console.error('Error adding supplier:', error);
      const errorMessage = error.message || 'Failed to add supplier';
      setErrorMessage?.(errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error in addSupplier:', error);
    throw error;
  }
};

/**
 * Update an existing supplier
 */
export const updateSupplier = async (
  id: string,
  updates: SupplierUpdate,
  setErrorMessage?: (message: string) => void
): Promise<Supplier> => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating supplier:', error);
      const errorMessage = error.message || 'Failed to update supplier';
      setErrorMessage?.(errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error in updateSupplier:', error);
    throw error;
  }
};

/**
 * Delete a supplier
 */
export const deleteSupplier = async (
  id: string,
  setErrorMessage?: (message: string) => void
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting supplier:', error);
      const errorMessage = error.message || 'Failed to delete supplier';
      setErrorMessage?.(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error in deleteSupplier:', error);
    throw error;
  }
};

/**
 * Fetch a single supplier by ID
 */
export const fetchSupplier = async (id: string): Promise<Supplier> => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching supplier:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in fetchSupplier:', error);
    throw error;
  }
};

/**
 * Fetch a single supplier by ID (alias for fetchSupplier)
 */
export const fetchSupplierById = async (id: string): Promise<Supplier> => {
  return fetchSupplier(id);
};

/**
 * Fetch all suppliers for an organization
 */
export const fetchSuppliers = async (organizationId: string): Promise<Supplier[]> => {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select()
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching suppliers:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchSuppliers:', error);
    throw error;
  }
}; 