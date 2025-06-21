//components/AccountSettings/SettingsDialog.jsx

/**
 * SettingsDialog Component
 *
 * This component renders a dialog for user profile settings, allowing users to view and edit
 * their profile information, including their name.
 *
 * Key features:
 * - Provides form fields for editing user information
 * - Handles form submission and profile updates
 * - Manages loading states and error messages
 *
 * Props:
 * @param {boolean} open - Controls the visibility of the dialog
 * @param {function} onClose - Function to call when the dialog should be closed
 *
 * @requires React
 * @requires @mui/material
 * @requires react-hook-form
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useProfile } from "@/hooks/useProfile";
import { updateUserProfile } from "@/lib/api/profileService";
import { handleApiError } from "@/lib/utils/errorHandling";
import CancelButton from "../Buttons/CancelButton";
import SubmitButton from "../Buttons/SubmitButton";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { profile, setProfile } = useProfile();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    defaultValues: {
      name: profile?.full_name || "",
    },
  });

  const [loading, setLoading] = useState(false);

  // Clear error message and reset form when dialog opens
  useEffect(() => {
    if (open) {
      setErrorMsg(null);
      reset({
        name: profile?.full_name || "",
      });
    }
  }, [open, profile, reset]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!profile) return;

    const updatedFields: Record<string, string> = {};
    Object.keys(dirtyFields).forEach((key) => {
      const fieldKey = key as keyof FormData;
      if (data[fieldKey] !== profile[fieldKey as keyof typeof profile]) {
        const dbKey = key === "name" ? "full_name" : key;
        updatedFields[dbKey] = data[fieldKey];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(profile.id, updatedFields);
      setProfile({ ...profile, ...updatedFields });
      onClose();
    } catch (error) {
      handleApiError(error, setErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = useCallback(() => {
    setErrorMsg(null);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Account Settings</DialogTitle>
      <DialogContent>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mt: 2 }}
              />
            )}
          />
          <DialogActions>
            <CancelButton
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </CancelButton>
            <SubmitButton
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Save
            </SubmitButton>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
