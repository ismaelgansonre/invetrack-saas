'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useOrganizationStore } from '@/stores/organizationStore';
import { useRouter } from 'next/navigation';

// Import des composants dashboard
import KPIGrid from "@/components/Dashboard/KPIGrid";
import InventoryOverview from "@/components/Dashboard/InventoryOverview";
import QuickActions from "@/components/Dashboard/QuickActions";
import ProductAlerts from "@/components/Dashboard/ProductAlerts";
import RecentActivity from "@/components/Dashboard/RecentActivity";

/**
 * DashboardPage Component
 *
 * This component serves as the main dashboard for the inventory tracking application.
 * It displays various sections with key information and actions for inventory management.
 * The layout is optimized for both mobile and desktop views, ensuring equal height rows
 * and consistent card sizes.
 *
 * @component
 */
const DashboardPage = () => {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading: authLoading } = useAuthStore();
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  const { transactions, loading: transactionsLoading, fetchTransactions } = useTransactionStore();
  const { currentOrganization, loading: orgLoading } = useOrganizationStore();
  
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

  // Fetch data when organization is available
  useEffect(() => {
    if (profile?.organization_id) {
      fetchProducts(profile.organization_id);
      fetchTransactions(profile.organization_id);
    }
  }, [profile?.organization_id, fetchProducts, fetchTransactions]);

  // Loading state
  if (authLoading || orgLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue dans {currentOrganization?.name || 'votre organisation'}
        </p>
      </div>

      {/* Dashboard Grid */}
      <div
        className={`grid h-full gap-4 ${
          isMobile
            ? "grid-cols-1 overflow-auto"
            : "grid-cols-6 grid-rows-2 overflow-hidden"
        }`}
      >
        <div className={`${isMobile ? "" : "col-span-3 row-span-1"}`}>
          <KPIGrid />
        </div>
        <div
          className={`flex flex-row gap-4 ${
            isMobile ? "flex-col" : "flex-row col-span-3 row-span-1"
          }`}
        >
          <div className="flex-2">
            <ProductAlerts />
          </div>
          <div className="flex-1">
            <QuickActions />
          </div>
        </div>
        <div className={`${isMobile ? "" : "col-span-4 row-span-1"}`}>
          <InventoryOverview />
        </div>
        <div className={`${isMobile ? "" : "col-span-2 row-span-1"}`}>
          <RecentActivity />
        </div>
      </div>

      {/* Loading overlay for data */}
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

export default DashboardPage; 