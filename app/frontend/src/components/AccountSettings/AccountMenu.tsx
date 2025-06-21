"use client";

import * as React from "react";

import { useAuthStore } from "@/stores/authStore";
import SettingsDialog from "./SettingsDialog";
import Image from "next/image";
import { useState } from "react";
import { Box, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Settings, Logout, AdminPanelSettings } from "@mui/icons-material";
import { User } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

/**
 * ======================================== SUMMARY ========================================
 * AccountMenu Component
 *
 * Purpose:
 * - This component provides a dropdown menu for account-related actions such as
 *   accessing account settings, viewing the profile, and logging out.
 * - It uses MUI's `Menu`, `MenuItem`, and `Avatar` components to display the account menu.
 *
 * Functionality:
 * - Displays the user's profile picture (fetched from Zustand store) in the avatar.
 * - Allows the user to access "My Account", "Settings", and "Logout" functionalities.
 * - Utilizes Zustand store to fetch the current user's profile, including the profile image.
 *
 * Props:
 * - None (as it relies on store data and local state).
 *
 * Usage:
 * - This component is typically used in the application's header or navigation bar.
 *
 * Features:
 * - Loads the user's profile image and displays it in the account avatar.
 * - Opens a settings dialog where the user can update profile details such as name, cell number, and image.
 * - Displays a loading spinner while fetching profile data.
 *
 * ===========================================================================================
 */

export default function AccountMenu() {
  // Fetch the profile from Zustand store
  const { profile, loading, signOut } = useAuthStore();
  const { userRole, canManageUsers } = usePermissions();

  // Local state for handling the menu open/close behavior
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSettings, setOpenSettings] = useState(false); // For opening settings dialog

  const open = Boolean(anchorEl);

  // Open the menu when the user clicks on the avatar
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Open the settings dialog
  const handleOpenSettings = () => {
    setOpenSettings(true); // Open settings dialog when user selects "Settings"
    handleClose();
  };

  return (
    <>
      {/* User Avatar */}
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="medium"
            sx={{ ml: 0 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {/* Show a loading spinner if profile data is still being loaded */}
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Avatar sx={{ width: 46, height: 46 }}>
                <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </Avatar>
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* "My Account" menu item */}
        <MenuItem onClick={() => {
          window.location.href = '/profile';
          handleClose();
        }}>
          <Avatar /> Mon compte
        </MenuItem>

        {/* Divider */}
        <Divider />

        {/* "Settings" menu item */}
        <MenuItem onClick={handleOpenSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Paramètres
        </MenuItem>

        {/* "Admin" menu item - only for admins */}
        {userRole === 'admin' && (
          <MenuItem onClick={() => {
            window.location.href = '/admin';
            handleClose();
          }}>
            <ListItemIcon>
              <AdminPanelSettings fontSize="small" />
            </ListItemIcon>
            Administration
          </MenuItem>
        )}

        {/* "Logout" menu item */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Déconnexion
        </MenuItem>
      </Menu>

      {/* Settings Dialog for updating profile details */}
      <SettingsDialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
} 