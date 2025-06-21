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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useOrderStore } from '@/stores/orderStore';
import { usePermissions } from '@/hooks/usePermissions';

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  onBack,
  onEdit,
  onDelete,
}) => {
  const { currentOrder, loading, fetchOrder } = useOrderStore();
  const { canUpdateOrders, canDeleteOrders } = usePermissions();

  React.useEffect(() => {
    fetchOrder(orderId);
  }, [orderId, fetchOrder]);

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading order details...</Typography>
      </Box>
    );
  }

  if (!currentOrder) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Order not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            variant="outlined"
          >
            Back to Orders
          </Button>
          <Typography variant="h5" component="h2">
            Order #{currentOrder.id.slice(0, 8)}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {canUpdateOrders() && onEdit && (
            <Button
              startIcon={<Edit />}
              onClick={onEdit}
              variant="outlined"
            >
              Edit
            </Button>
          )}
          {canDeleteOrders() && onDelete && (
            <Button
              startIcon={<Delete />}
              onClick={onDelete}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Order Information" />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Order ID:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    #{currentOrder.id.slice(0, 8)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Date:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(currentOrder.order_date)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Status:
                  </Typography>
                  <Chip
                    label={currentOrder.status}
                    color={getStatusColor(currentOrder.status) as any}
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Total Amount:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {formatCurrency(currentOrder.total_amount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Supplier Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Supplier Information" />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Supplier:
                  </Typography>
                  <Typography variant="body2">
                    {currentOrder.supplier_name || 'N/A'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Supplier ID:
                  </Typography>
                  <Typography variant="body2">
                    {currentOrder.supplier_id ? `#${currentOrder.supplier_id.slice(0, 8)}` : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Order Items" />
            <CardContent>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrder.order_items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No items in this order
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentOrder.order_items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="body2">
                              Product #{item.product_id?.slice(0, 8) || 'Unknown'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {item.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(item.unit_price)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(item.quantity * item.unit_price)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Order Summary */}
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Box display="flex" flexDirection="column" gap={1} minWidth={200}>
                  <Divider />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatCurrency(currentOrder.total_amount)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails; 