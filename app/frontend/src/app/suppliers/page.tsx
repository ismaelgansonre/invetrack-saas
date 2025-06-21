'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useSupplierStore } from '@/stores/supplierStore';

// Import des composants
import SupplierList from '@/components/Suppliers/SupplierList/SupplierList';
import SupplierForm from '@/components/Forms/SupplierForm/SupplierForm';

const SuppliersPage = () => {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuthStore();
  const { 
    suppliers, 
    loading: suppliersLoading, 
    fetchSuppliers, 
    deleteSupplier,
    createSupplier,
    updateSupplier 
  } = useSupplierStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
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

  // Fetch suppliers when organization is available
  useEffect(() => {
    if (profile?.organization_id) {
      fetchSuppliers(profile.organization_id);
    }
  }, [profile?.organization_id, fetchSuppliers]);

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowAddForm(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier);
    setShowAddForm(true);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      try {
        await deleteSupplier(supplierId);
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingSupplier(null);
    if (profile?.organization_id) {
      fetchSuppliers(profile.organization_id);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!profile?.organization_id) {
      console.error("No organization selected");
      return;
    }

    try {
      if (editingSupplier) {
        // Update existing supplier
        await updateSupplier(editingSupplier.id, formData);
      } else {
        // Create new supplier
        await createSupplier({ ...formData, organization_id: profile.organization_id });
      }
      handleFormSuccess();
    } catch (error) {
      console.error("Failed to save supplier:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingSupplier(null);
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
            Gestion des fournisseurs
          </h1>
          <p className="text-gray-600">
            Gérez vos fournisseurs et partenaires
          </p>
        </div>
        <button
          onClick={handleAddSupplier}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter un fournisseur
        </button>
      </div>

      {/* Main Content */}
      {showAddForm ? (
        <div className="max-w-4xl mx-auto">
          <SupplierForm
            initialData={editingSupplier}
            isNewSupplier={!editingSupplier}
            onSubmit={handleSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Fournisseurs</h3>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Actifs</h3>
              <p className="text-2xl font-bold text-green-600">
                {suppliers.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Inactifs</h3>
              <p className="text-2xl font-bold text-gray-600">
                {suppliers.filter(s => s.status === 'inactive').length}
              </p>
            </div>
          </div>

          {/* Suppliers List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Liste des fournisseurs
              </h2>
              <SupplierList
                onEditSupplier={handleEditSupplier}
                onDeleteSupplier={handleDeleteSupplier}
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {suppliersLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des fournisseurs...</p>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      {isMobile && !showAddForm && (
        <button
          onClick={handleAddSupplier}
          className="fixed z-50 flex items-center justify-center text-white transition-colors duration-300 bg-blue-500 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 focus:outline-none hover:bg-blue-600"
          aria-label="Ajouter un fournisseur"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SuppliersPage; 