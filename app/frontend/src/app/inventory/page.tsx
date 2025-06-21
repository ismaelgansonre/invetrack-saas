'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import Add from '@mui/icons-material/Add';

// Import des composants
import ProductList from '@/components/Inventory/ProductList/ProductList';
import ProductForm from '@/components/Forms/ProductForm/ProductForm';

const InventoryPage = () => {
  const router = useRouter();
  const { profile, isAuthenticated, loading: authLoading } = useAuthStore();
  const { products, loading: productsLoading, fetchProducts, deleteProduct } = useProductStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check authentication and organization
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (!profile?.organization_id) {
        router.push('/organization-select');
        return;
      }
    }
  }, [isAuthenticated, profile, authLoading, router]);

  // Fetch products when organization is available
  useEffect(() => {
    if (profile?.organization_id) {
      fetchProducts(profile.organization_id);
    }
  }, [profile?.organization_id, fetchProducts]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };


  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  // No organization selected
  if (!profile?.organization_id) {
    return null; // Will redirect to organization select
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion de l'inventaire
          </h1>
          <p className="text-gray-600">
            Gérez vos produits et votre stock
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Add className="w-4 h-4 mr-2" />
          Ajouter un produit
        </button>
      </div>

      {/* Main Content */}
      {showAddForm ? (
        <div className="max-w-4xl mx-auto">
          <ProductForm
            initialData={editingProduct ?? {}}
            onSubmit={() => {}}
            onCancel={handleFormCancel}
            isNewProduct={!editingProduct}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Produits</h3>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">En Stock</h3>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.quantity > 0).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Rupture</h3>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => p.quantity === 0).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Stock Faible</h3>
              <p className="text-2xl font-bold text-orange-600">
                {products.filter(p => p.quantity <= p.min_quantity && p.quantity > 0).length}
              </p>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Liste des produits
              </h2>
              <ProductList
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {productsLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des produits...</p>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      {isMobile && !showAddForm && (
        <button
          onClick={handleAddProduct}
          className="fixed z-50 flex items-center justify-center text-white transition-colors duration-300 bg-blue-500 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 focus:outline-none hover:bg-blue-600"
          aria-label="Ajouter un produit"
        >
          <Add />
        </button>
      )}
    </div>
  );
};

export default InventoryPage; 