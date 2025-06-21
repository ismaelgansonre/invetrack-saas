"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';
import { useOrderStore } from '@/stores/orderStore';
import { useOrganizationStore } from '@/stores/organizationStore';
import { usePermissions } from '@/hooks/usePermissions';
import OrderForm from './OrderForm';

const OrderList: React.FC = () => {
  const { orders, loading, fetchOrders, searchOrders, getOrdersByStatus, deleteOrder } = useOrderStore();
  const { currentOrganization } = useOrganizationStore();
  const { canCreateOrders, canUpdateOrders, canDeleteOrders } = usePermissions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [orderFormOpen, setOrderFormOpen] = useState(false);

  React.useEffect(() => {
    if (currentOrganization?.id) {
      fetchOrders(currentOrganization.id);
    }
  }, [currentOrganization?.id, fetchOrders]);

  const handleSearch = () => {
    if (currentOrganization?.id) {
      if (searchQuery.trim()) {
        searchOrders(searchQuery, currentOrganization.id);
      } else {
        fetchOrders(currentOrganization.id);
      }
    }
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (currentOrganization?.id) {
      if (status === 'all') {
        fetchOrders(currentOrganization.id);
      } else {
        getOrdersByStatus(status, currentOrganization.id);
      }
    }
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete);
        setDeleteDialogOpen(false);
        setOrderToDelete(null);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleCreateOrder = () => {
    setOrderFormOpen(true);
  };

  const handleOrderFormClose = () => {
    setOrderFormOpen(false);
    // Refresh the orders list
    if (currentOrganization?.id) {
      fetchOrders(currentOrganization.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading orders...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header and Filters */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Orders
        </Typography>
        {canCreateOrders() && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateOrder}
          >
            New Order
          </Button>
        )}
      </Box>

      {/* Search and Filter Bar */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{order.id.slice(0, 8)}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell>
                    {order.supplier_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(order.total_amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => {/* TODO: Navigate to view order */}}
                      title="View Order"
                    >
                      <Visibility />
                    </IconButton>
                    {canUpdateOrders() && (
                      <IconButton
                        size="small"
                        onClick={() => {/* TODO: Navigate to edit order */}}
                        title="Edit Order"
                      >
                        <Edit />
                      </IconButton>
                    )}
                    {canDeleteOrders() && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(order.id)}
                        title="Delete Order"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Form Dialog */}
      <OrderForm
        open={orderFormOpen}
        onClose={handleOrderFormClose}
      />
    </Box>
  );
};

export default OrderList; 