"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { ROLE_PERMISSIONS, PERMISSIONS, UserRole } from '@/lib/permissions';

const permissionCategories = {
  'Product Management': [
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_READ,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_DELETE,
  ],
  'Supplier Management': [
    PERMISSIONS.SUPPLIER_CREATE,
    PERMISSIONS.SUPPLIER_READ,
    PERMISSIONS.SUPPLIER_UPDATE,
    PERMISSIONS.SUPPLIER_DELETE,
  ],
  'Order Management': [
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.ORDER_DELETE,
    PERMISSIONS.ORDER_APPROVE,
  ],
  'User Management': [
    PERMISSIONS.USER_INVITE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_ROLE_UPDATE,
  ],
  'Organization Management': [
    PERMISSIONS.ORG_SETTINGS_UPDATE,
    PERMISSIONS.ORG_DELETE,
  ],
  'Reports': [
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
  ],
};

const permissionLabels: Record<string, string> = {
  [PERMISSIONS.PRODUCT_CREATE]: 'Create Products',
  [PERMISSIONS.PRODUCT_READ]: 'View Products',
  [PERMISSIONS.PRODUCT_UPDATE]: 'Edit Products',
  [PERMISSIONS.PRODUCT_DELETE]: 'Delete Products',
  [PERMISSIONS.SUPPLIER_CREATE]: 'Create Suppliers',
  [PERMISSIONS.SUPPLIER_READ]: 'View Suppliers',
  [PERMISSIONS.SUPPLIER_UPDATE]: 'Edit Suppliers',
  [PERMISSIONS.SUPPLIER_DELETE]: 'Delete Suppliers',
  [PERMISSIONS.ORDER_CREATE]: 'Create Orders',
  [PERMISSIONS.ORDER_READ]: 'View Orders',
  [PERMISSIONS.ORDER_UPDATE]: 'Edit Orders',
  [PERMISSIONS.ORDER_DELETE]: 'Delete Orders',
  [PERMISSIONS.ORDER_APPROVE]: 'Approve Orders',
  [PERMISSIONS.USER_INVITE]: 'Invite Users',
  [PERMISSIONS.USER_READ]: 'View Users',
  [PERMISSIONS.USER_UPDATE]: 'Edit Users',
  [PERMISSIONS.USER_DELETE]: 'Remove Users',
  [PERMISSIONS.USER_ROLE_UPDATE]: 'Change User Roles',
  [PERMISSIONS.ORG_SETTINGS_UPDATE]: 'Update Organization Settings',
  [PERMISSIONS.ORG_DELETE]: 'Delete Organization',
  [PERMISSIONS.REPORTS_VIEW]: 'View Reports',
  [PERMISSIONS.REPORTS_EXPORT]: 'Export Reports',
};

const roleColors: Record<UserRole, 'error' | 'warning' | 'default'> = {
  admin: 'error',
  manager: 'warning',
  member: 'default',
};

export default function RolePermissions() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Role Permissions
      </Typography>
      
      <Grid container spacing={3}>
        {ROLE_PERMISSIONS.map((rolePerm) => (
          <Grid item xs={12} md={4} key={rolePerm.role}>
            <Card>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" textTransform="capitalize">
                      {rolePerm.role}
                    </Typography>
                    <Chip
                      label={rolePerm.role}
                      color={roleColors[rolePerm.role]}
                      size="small"
                    />
                  </Box>
                }
              />
              <CardContent>
                {Object.entries(permissionCategories).map(([category, permissions]) => (
                  <Accordion key={category} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2">{category}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {permissions.map((permission) => {
                          const hasPermission = rolePerm.permissions.includes(permission);
                          return (
                            <Chip
                              key={permission}
                              label={permissionLabels[permission]}
                              size="small"
                              color={hasPermission ? 'success' : 'default'}
                              variant={hasPermission ? 'filled' : 'outlined'}
                            />
                          );
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 