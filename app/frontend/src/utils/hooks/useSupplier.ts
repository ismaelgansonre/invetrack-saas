import { useSupplierStore } from '@/stores/supplierStore';

/**
 * Custom hook for supplier management using Zustand store
 * Provides access to supplier state and actions
 */
export const useSupplier = () => {
  const {
    suppliers,
    selectedSupplier,
    loading,
    error,
    setSuppliers,
    setSelectedSupplier,
    setLoading,
    setError,
    fetchSuppliers,
    fetchSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    filterSuppliersByStatus,
  } = useSupplierStore();

  return {
    // State
    suppliers,
    currentSupplier: selectedSupplier, // Alias for compatibility
    selectedSupplier,
    loading,
    error,
    
    // Actions
    setSuppliers,
    setCurrentSupplier: setSelectedSupplier, // Alias for compatibility
    setSelectedSupplier,
    setLoading,
    setError,
    fetchSuppliers,
    fetchSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    filterSuppliersByStatus,
  };
}; 