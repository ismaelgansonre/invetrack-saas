"use client";

import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import RolePermissions from '@/components/Organization/RolePermissions';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';
import { Box, Typography, Alert } from '@mui/material';

export default function OrganizationPermissionsPage() {
  const { profile } = useAuthStore();
  const userRole = profile?.role;

  // Check if user has permission to view permissions
  if (!hasPermission(userRole, PERMISSIONS.USER_READ)) {
    return (
      <MainLayout>
        <Box p={3}>
          <Alert severity="error">
            You don't have permission to view role permissions.
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Role Permissions Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This page shows what each role can do within the organization.
        </Typography>
        <RolePermissions />
      </Box>
    </MainLayout>
  );
} 