// components/Suppliers/SupplierCard/SupplierCard.jsx

'use client';

import React from 'react';
import { Database } from '@/lib/database.types';
import { Edit, Trash2, Mail, Phone } from 'lucide-react';

type Supplier = Database['public']['Tables']['suppliers']['Row'];

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onEdit, onDelete }) => {
  // Since contact_info is a text field, we display it directly.
  // We can't assume it's a JSON object with email/phone.
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between transition-shadow duration-200 hover:shadow-lg">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">{supplier.name}</h3>
        </div>
        {supplier.contact_info && (
          <p className="text-sm text-gray-600 mt-2">{supplier.contact_info}</p>
        )}
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          onClick={() => onEdit(supplier)}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Modifier le fournisseur"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(supplier.id)}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Supprimer le fournisseur"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SupplierCard;
