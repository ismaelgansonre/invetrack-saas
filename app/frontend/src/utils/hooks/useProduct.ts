import { useProductStore } from '@/stores/productStore';

/**
 * Custom hook for product management using Zustand store
 * Provides access to product state and actions
 */
export const useProduct = () => {
  const {
    products,
    currentProduct,
    loading,
    error,
    snackbar,
    setProducts,
    setCurrentProduct,
    setLoading,
    setError,
    setSnackbar,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    snackbar,
    
    // Actions
    setProducts,
    setCurrentProduct,
    setLoading,
    setError,
    setSnackbar,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}; 