"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Person,
  Email,
  CalendarToday,
  Business,
  Security,
  Edit,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { useOrganizationStore } from '@/stores/organizationStore';
import { usePermissions } from '@/hooks/usePermissions';
import SettingsDialog from './SettingsDialog';

export default function UserProfile() {
  const { profile, user } = useAuthStore();
  const { currentOrganization } = useOrganizationStore();
  const { userRole } = usePermissions();
  const [openSettings, setOpenSettings] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'member':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box>
      <Card>
        <CardHeader
          title="Profil Utilisateur"
          action={
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setOpenSettings(true)}
            >
              Modifier
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            {/* Informations personnelles */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations Personnelles
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nom complet"
                    secondary={profile?.full_name || 'Non défini'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user?.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Membre depuis"
                    secondary={profile?.created_at ? formatDate(profile.created_at) : 'Non disponible'}
                  />
                </ListItem>
              </List>
            </Grid>

            {/* Informations organisation */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Organisation
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Business />
                  </ListItemIcon>
                  <ListItemText
                    primary="Organisation"
                    secondary={currentOrganization?.name || 'Aucune organisation'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Rôle"
                    secondary={
                      <Chip
                        label={userRole}
                        color={getRoleColor(userRole)}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Informations techniques */}
          <Typography variant="h6" gutterBottom>
            Informations Techniques
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                ID Utilisateur
              </Typography>
              <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                {user?.id}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                ID Profil
              </Typography>
              <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                {profile?.id}
              </Typography>
            </Grid>
            {profile?.organization_id && (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  ID Organisation
                </Typography>
                <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                  {profile.organization_id}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Dialog de modification */}
      <SettingsDialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </Box>
  );
} 