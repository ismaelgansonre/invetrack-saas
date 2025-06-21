// components/Inventory/ProductCard/ProductCard.jsx

'use client';

import React from 'react';
import { Database } from '@/lib/database.types';
import { Edit, Trash2 } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const getStatus = () => {
    if (product.quantity === 0) {
      return { text: 'Rupture', color: 'bg-red-100 text-red-800' };
    }
    if (product.quantity <= product.min_quantity) {
      return { text: 'Stock Faible', color: 'bg-orange-100 text-orange-800' };
    }
    return { text: 'En Stock', color: 'bg-green-100 text-green-800' };
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between transition-shadow duration-200 hover:shadow-lg">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
            {status.text}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{product.description}</p>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-700">
            <span className="font-semibold">Quantité:</span> {product.quantity}
          </div>
          <div className="text-gray-700">
            <span className="font-semibold">Prix:</span> {product.price} €
          </div>
        </div>
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Modifier le produit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Supprimer le produit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
