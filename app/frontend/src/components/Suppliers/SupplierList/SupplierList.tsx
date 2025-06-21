'use client';

import React from 'react';
import { useSupplierStore } from '@/stores/supplierStore';
import { Database } from '@/lib/database.types';
import SupplierCard from '../SupplierCard/SupplierCard';

type Supplier = Database['public']['Tables']['suppliers']['Row'];

interface SupplierListProps {
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
}

const SupplierList: React.FC<SupplierListProps> = ({ onEditSupplier, onDeleteSupplier }) => {
  const { suppliers, loading } = useSupplierStore();

  if (loading && suppliers.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Chargement des fournisseurs...</p>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">Aucun fournisseur trouvé</h3>
        <p className="text-gray-500">Commencez par ajouter votre premier fournisseur.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map((supplier) => (
        <SupplierCard
          key={supplier.id}
          supplier={supplier}
          onEdit={onEditSupplier}
          onDelete={onDeleteSupplier}
        />
      ))}
    </div>
  );
};

export default SupplierList; 