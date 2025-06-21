"use client";
import React from 'react';
import MainLayout from "@/layouts/MainLayout";
import OrderList from "@/components/Orders/OrderList";
import { useAuthStore } from '@/stores/authStore';
import { hasPermission, PERMISSIONS, UserRole } from '@/lib/permissions';
import { Box, Alert } from '@mui/material';

// Helper function to validate and cast UserRole
const validateUserRole = (role: string | null | undefined): UserRole => {
  if (role === 'admin' || role === 'manager' || role === 'member') {
    return role as UserRole;
  }
  return 'member'; // Default fallback
};

const OrdersPage = () => {
  const { profile } = useAuthStore();
  const userRole = validateUserRole(profile?.role);

  // Check if user has permission to view orders
  if (!hasPermission(userRole, PERMISSIONS.ORDER_READ)) {
    return (
      <MainLayout>
        <Box p={3}>
          <Alert severity="error">
            You don't have permission to view orders.
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box p={3}>
        <OrderList />
      </Box>
    </MainLayout>
  );
};

export default OrdersPage;
