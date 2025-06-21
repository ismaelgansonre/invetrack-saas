"use client";

import React, { useState, useEffect } from 'react';
import {
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
  Typography,
  Box,
} from '@mui/material';
import { Edit, Delete, PersonAdd } from '@mui/icons-material';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useOrganizationStore } from '@/stores/organizationStore';
import { hasPermission, canManageUsers, UserRole, PERMISSIONS } from '@/lib/permissions';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface Member {
  id: string;
  full_name: string | null;
  email: string;
  role: UserRole;
  created_at: string;
}

interface InviteMemberData {
  email: string;
  role: UserRole;
}

export default function OrganizationMembers() {
  const { profile } = useAuthStore();
  const { currentOrganization } = useOrganizationStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [inviteData, setInviteData] = useState<InviteMemberData>({
    email: '',
    role: 'member',
  });
  const [editData, setEditData] = useState<{ role: UserRole }>({
    role: 'member',
  });

  const userRole = profile?.role as UserRole;

  useEffect(() => {
    if (currentOrganization) {
      fetchMembers();
    }
  }, [currentOrganization]);

  const fetchMembers = async () => {
    if (!currentOrganization) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!currentOrganization) return;

    try {
      const { error } = await supabase
        .from('invitations')
        .insert({
          email: inviteData.email,
          organization_id: currentOrganization.id,
          role: inviteData.role,
          invited_by: profile?.id,
          status: 'pending',
        });

      if (error) throw error;

      setInviteDialogOpen(false);
      setInviteData({ email: '', role: 'member' });
      // You might want to show a success message here
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const handleUpdateMemberRole = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: editData.role })
        .eq('id', selectedMember.id);

      if (error) throw error;

      setEditDialogOpen(false);
      setSelectedMember(null);
      fetchMembers(); // Refresh the list
    } catch (error) {
      console.error('Error updating member role:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!hasPermission(userRole, PERMISSIONS.USER_DELETE)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ organization_id: null })
        .eq('id', memberId);

      if (error) throw error;

      fetchMembers(); // Refresh the list
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const getRoleColor = (role: UserRole) => {
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

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Organization Members</Typography>
        {canManageUsers(userRole) && (
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setInviteDialogOpen(true)}
          >
            Invite Member
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              {canManageUsers(userRole) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.full_name || 'N/A'}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Chip
                    label={member.role}
                    color={getRoleColor(member.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(member.created_at).toLocaleDateString()}
                </TableCell>
                {canManageUsers(userRole) && (
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedMember(member);
                        setEditData({ role: member.role });
                        setEditDialogOpen(true);
                      }}
                      disabled={member.id === profile?.id} // Can't edit own role
                    >
                      <Edit />
                    </IconButton>
                    {hasPermission(userRole, PERMISSIONS.USER_DELETE) && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={member.id === profile?.id} // Can't remove yourself
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
        <DialogTitle>Invite New Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={inviteData.email}
            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={inviteData.role}
              onChange={(e) => setInviteData({ ...inviteData, role: e.target.value as UserRole })}
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleInviteMember} variant="contained">
            Invite
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Member Role Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Member Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={editData.role}
              onChange={(e) => setEditData({ role: e.target.value as UserRole })}
            >
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateMemberRole} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 