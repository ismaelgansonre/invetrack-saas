"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useOrderStore } from '@/stores/orderStore';
import { useProductStore } from '@/stores/productStore';
import { useSupplierStore } from '@/stores/supplierStore';
import { useOrganizationStore } from '@/stores/organizationStore';
import type { Database } from '@/lib/database.types';

type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
type Product = Database['public']['Tables']['products']['Row'];
type Supplier = Database['public']['Tables']['suppliers']['Row'];

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  orderId?: string; // If provided, we're editing an existing order
}

interface OrderItemForm {
  product_id: string;
  quantity: number;
  unit_price: number;
}

const OrderForm: React.FC<OrderFormProps> = ({ open, onClose, orderId }) => {
  const { createOrder, currentOrder, fetchOrder } = useOrderStore();
  const { products, fetchProducts } = useProductStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const { currentOrganization } = useOrganizationStore();

  const [formData, setFormData] = useState({
    supplier_id: '',
    status: 'pending',
  });
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([
    { product_id: '', quantity: 1, unit_price: 0 }
  ]);
  const [loading, setLoading] = useState(false);

  const isEditing = !!orderId;

  useEffect(() => {
    if (open && currentOrganization?.id) {
      fetchProducts(currentOrganization.id);
      fetchSuppliers(currentOrganization.id);
    }
  }, [open, currentOrganization?.id, fetchProducts, fetchSuppliers]);

  useEffect(() => {
    if (orderId && open) {
      fetchOrder(orderId);
    }
  }, [orderId, open, fetchOrder]);

  useEffect(() => {
    if (currentOrder && isEditing) {
      setFormData({
        supplier_id: currentOrder.supplier_id || '',
        status: currentOrder.status,
      });
      setOrderItems(
        currentOrder.order_items.map(item => ({
          product_id: item.product_id || '',
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      );
    }
  }, [currentOrder, isEditing]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItemForm, value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setOrderItems(newItems);
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { product_id: '', quantity: 1, unit_price: 0 }
    ]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.price || 0;
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.quantity * item.unit_price);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!currentOrganization?.id) return;

    setLoading(true);
    try {
      const orderData: OrderInsert = {
        organization_id: currentOrganization.id,
        supplier_id: formData.supplier_id || null,
        status: formData.status,
        order_date: new Date().toISOString(),
        total_amount: calculateTotal(),
      };

      const orderItemsData: OrderItemInsert[] = orderItems.map(item => ({
        product_id: item.product_id || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      await createOrder(orderData, orderItemsData);
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ supplier_id: '', status: 'pending' });
    setOrderItems([{ product_id: '', quantity: 1, unit_price: 0 }]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Order' : 'Create New Order'}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          {/* Order Details */}
          <Box display="flex" gap={2}>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={formData.supplier_id}
                label="Supplier"
                onChange={(e) => handleInputChange('supplier_id', e.target.value)}
              >
                <MenuItem value="">No Supplier</MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Order Items */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Order Items</Typography>
              <Button
                startIcon={<Add />}
                onClick={addOrderItem}
                variant="outlined"
                size="small"
              >
                Add Item
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={item.product_id}
                            onChange={(e) => {
                              handleItemChange(index, 'product_id', e.target.value);
                              if (e.target.value) {
                                const price = getProductPrice(e.target.value);
                                handleItemChange(index, 'unit_price', price);
                              }
                            }}
                          >
                            <MenuItem value="">Select Product</MenuItem>
                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          inputProps={{ min: 1 }}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          inputProps={{ min: 0, step: 0.01 }}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => removeOrderItem(index)}
                          disabled={orderItems.length === 1}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Order Total */}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Box display="flex" flexDirection="column" gap={1} minWidth={200}>
                <Divider />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || orderItems.some(item => !item.product_id)}
        >
          {loading ? 'Saving...' : (isEditing ? 'Update Order' : 'Create Order')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderForm; 