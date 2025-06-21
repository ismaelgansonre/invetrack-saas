"use client";

import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import UserProfile from '@/components/AccountSettings/UserProfile';
import { Box, Typography } from '@mui/material';

export default function ProfilePage() {
  return (
    <MainLayout>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Mon Profil
        </Typography>
        <UserProfile />
      </Box>
    </MainLayout>
  );
} 