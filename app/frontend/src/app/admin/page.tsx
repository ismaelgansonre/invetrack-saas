"use client";

import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useAuthStore } from '@/stores/authStore';
import { usePermissions } from '@/hooks/usePermissions';
import { Box, Typography, Alert, Card, CardContent, Grid, Chip } from '@mui/material';
import OrganizationMembers from '@/components/Organization/OrganizationMembers';
import InvitationsManager from '@/components/Organization/InvitationsManager';
import RolePermissions from '@/components/Organization/RolePermissions';

export default function AdminPage() {
  const { profile, user } = useAuthStore();
  const { userRole, canManageUsers, canManageOrganization } = usePermissions();

  // Vérifier si l'utilisateur est admin
  if (userRole !== 'admin') {
    return (
      <MainLayout>
        <Box p={3}>
          <Alert severity="error">
            Accès refusé. Cette page est réservée aux administrateurs.
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Administration
        </Typography>
        
        {/* Informations utilisateur */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profil Administrateur
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Nom complet
                </Typography>
                <Typography variant="body1">
                  {profile?.full_name || 'Non défini'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Rôle
                </Typography>
                <Chip 
                  label={userRole} 
                  color="error" 
                  size="small" 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  ID Utilisateur
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {user?.id}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Gestion des membres */}
        {canManageUsers() && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gestion des Membres
              </Typography>
              <OrganizationMembers />
            </CardContent>
          </Card>
        )}

        {/* Gestion des invitations */}
        {canManageUsers() && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invitations
              </Typography>
              <InvitationsManager />
            </CardContent>
          </Card>
        )}

        {/* Permissions des rôles */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Permissions des Rôles
            </Typography>
            <RolePermissions />
          </CardContent>
        </Card>

        {/* Paramètres de l'organisation */}
        {canManageOrganization() && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Paramètres de l'Organisation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configuration avancée de l'organisation (à implémenter)
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </MainLayout>
  );
} 