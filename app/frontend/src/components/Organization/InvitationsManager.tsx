"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Delete, Send } from "@mui/icons-material";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useOrganizationStore } from "@/stores/organizationStore";
import { UserRole } from "@/lib/permissions";

interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  invited_by: string;
  created_at: string;
}

export default function InvitationsManager() {
  const { profile } = useAuthStore();
  const { currentOrganization } = useOrganizationStore();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("member");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentOrganization) {
      fetchInvitations();
    }
    // eslint-disable-next-line
  }, [currentOrganization]);

  const fetchInvitations = async () => {
    setLoading(true);
    if (!currentOrganization) return;
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("organization_id", currentOrganization.id)
      .order("created_at", { ascending: false });
    if (!error) setInvitations(data || []);
    setLoading(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setSubmitting(true);
    const { error } = await supabase.from("invitations").insert({
      organization_id: currentOrganization.id,
      email: inviteEmail,
      role: inviteRole,
      invited_by: profile?.id,
      status: "pending",
    });
    setSubmitting(false);
    if (!error) {
      setOpenDialog(false);
      setInviteEmail("");
      setInviteRole("member");
      fetchInvitations();
    }
  };

  const handleCancel = async (id: string) => {
    setSubmitting(true);
    // Option 1: supprimer l'invitation
    await supabase.from("invitations").delete().eq("id", id);
    // Option 2: ou bien update status à 'declined'
    // await supabase.from("invitations").update({ status: "declined" }).eq("id", id);
    setSubmitting(false);
    fetchInvitations();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Invitations</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Inviter un membre
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Invité par</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.email}</TableCell>
                  <TableCell>
                    <Chip label={inv.role} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={inv.status}
                      color={
                        inv.status === "pending"
                          ? "warning"
                          : inv.status === "accepted"
                          ? "success"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{inv.invited_by}</TableCell>
                  <TableCell>
                    {new Date(inv.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {inv.status === "pending" && (
                      <Tooltip title="Annuler l'invitation">
                        <span>
                          <IconButton
                            onClick={() => handleCancel(inv.id)}
                            disabled={submitting}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Inviter un membre</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Rôle</InputLabel>
            <Select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
            >
              <MenuItem value="member">Membre</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={handleInvite}
            variant="contained"
            disabled={submitting || !inviteEmail}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 