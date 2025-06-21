'use client';

import React from 'react';
import { useProductStore } from '@/stores/productStore';
import { Database } from '@/lib/database.types';
import ProductCard from '../ProductCard/ProductCard';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductListProps {
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEditProduct, onDeleteProduct }) => {
  const { products, loading } = useProductStore();

  if (loading && products.length === 0) {
    return (
      <div className="text-center py-10">
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold">Aucun produit trouvé</h3>
        <p className="text-gray-500">Commencez par ajouter votre premier produit.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductList; 