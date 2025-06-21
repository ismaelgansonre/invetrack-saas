'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import { useTransactionStore } from '@/stores/transactionStore';

const ReportsPage = () => {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuthStore();
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  const { transactions, loading: transactionsLoading, fetchTransactions } = useTransactionStore();
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('inventory');

  useEffect(() => {
    // Check authentication and organization
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

  // Fetch data when organization is available
  useEffect(() => {
    if (profile?.organization_id) {
      fetchProducts(profile.organization_id);
      fetchTransactions(profile.organization_id);
    }
  }, [profile?.organization_id, fetchProducts, fetchTransactions]);

  // Calculate report data
  const getInventoryStats = () => {
    const totalProducts = products.length;
    const inStock = products.filter(p => p.quantity > 0).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const lowStock = products.filter(p => p.quantity <= (p.min_quantity || 0) && p.quantity > 0).length;
    
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * (p.retail_price_per_unit || 0)), 0);
    
    return {
      totalProducts,
      inStock,
      outOfStock,
      lowStock,
      totalValue: totalValue.toFixed(2)
    };
  };

  const getTransactionStats = () => {
    const totalTransactions = transactions.length;
    const totalRevenue = transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + (t.total_amount || 0), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + (t.total_amount || 0), 0);
    
    const profit = totalRevenue - totalExpenses;
    
    return {
      totalTransactions,
      totalRevenue: totalRevenue.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      profit: profit.toFixed(2)
    };
  };

  const getTopProducts = () => {
    return products
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 5);
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.quantity <= (p.min_quantity || 0) && p.quantity > 0);
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

  const inventoryStats = getInventoryStats();
  const transactionStats = getTransactionStats();
  const topProducts = getTopProducts();
  const lowStockProducts = getLowStockProducts();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Rapports et analyses
        </h1>
        <p className="text-gray-600">
          Analysez vos données et performances
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Période
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de rapport
          </label>
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="inventory">Inventaire</option>
            <option value="transactions">Transactions</option>
            <option value="performance">Performance</option>
          </select>
        </div>
      </div>

      {/* Reports Content */}
      <div className="space-y-6">
        {/* Inventory Report */}
        {selectedReport === 'inventory' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Produits</h3>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalProducts}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">En Stock</h3>
                <p className="text-2xl font-bold text-green-600">{inventoryStats.inStock}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Rupture</h3>
                <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Stock Faible</h3>
                <p className="text-2xl font-bold text-orange-600">{inventoryStats.lowStock}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Valeur Totale</h3>
                <p className="text-2xl font-bold text-blue-600">{inventoryStats.totalValue} €</p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Top 5 des produits en stock
                </h2>
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{product.quantity} unités</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Alertes de stock faible
                  </h2>
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 bg-orange-50 border border-orange-200 rounded">
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        <span className="text-sm text-orange-600">
                          {product.quantity} / {product.min_quantity} (seuil minimum)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transactions Report */}
        {selectedReport === 'transactions' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
                <p className="text-2xl font-bold text-gray-900">{transactionStats.totalTransactions}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Revenus</h3>
                <p className="text-2xl font-bold text-green-600">{transactionStats.totalRevenue} €</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Dépenses</h3>
                <p className="text-2xl font-bold text-red-600">{transactionStats.totalExpenses} €</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Bénéfice</h3>
                <p className={`text-2xl font-bold ${parseFloat(transactionStats.profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transactionStats.profit} €
                </p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Transactions récentes
                </h2>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {transaction.type === 'sale' ? 'Vente' : 'Achat'}
                        </span>
                        <p className="text-xs text-gray-500">{transaction.created_at}</p>
                      </div>
                      <span className={`text-sm font-medium ${
                        transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.total_amount} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Report */}
        {selectedReport === 'performance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Indicateurs de performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {inventoryStats.totalProducts > 0 ? ((inventoryStats.inStock / inventoryStats.totalProducts) * 100).toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-gray-500">Taux de disponibilité</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {transactionStats.totalTransactions}
                    </div>
                    <p className="text-sm text-gray-500">Transactions ce mois</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {inventoryStats.totalValue} €
                    </div>
                    <p className="text-sm text-gray-500">Valeur de l'inventaire</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {(productsLoading || transactionsLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des données...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage; 