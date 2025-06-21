"use client";

import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import OrganizationMembers from '@/components/Organization/OrganizationMembers';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission, PERMISSIONS, UserRole } from '@/lib/permissions';
import { Box, Typography, Alert } from '@mui/material';

// Helper function to validate and cast UserRole
const validateUserRole = (role: string | null | undefined): UserRole => {
  if (role === 'admin' || role === 'manager' || role === 'member') {
    return role as UserRole;
  }
  return 'member'; // Default fallback
};

export default function OrganizationMembersPage() {
  const { profile } = useAuthStore();
  const userRole = validateUserRole(profile?.role);
  // Check if user has permission to view members
  if (!hasPermission(userRole, PERMISSIONS.USER_READ)) {
    return (
      <MainLayout>
        <Box p={3}>
          <Alert severity="error">
            You don't have permission to view organization members.
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Organization Members
        </Typography>
        <OrganizationMembers />
      </Box>
    </MainLayout>
  );
} 