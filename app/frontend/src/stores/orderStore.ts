import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';
import { logSupabaseError } from '@/lib/utils/errorHandling';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

interface OrderWithItems extends Order {
  order_items: OrderItem[];
  supplier_name?: string;
}

interface OrderState {
  // State
  orders: OrderWithItems[];
  currentOrder: OrderWithItems | null;
  loading: boolean;
  error: string | null;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };

  // Actions
  setOrders: (orders: OrderWithItems[]) => void;
  setCurrentOrder: (order: OrderWithItems | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSnackbar: (snackbar: { open: boolean; message: string; severity: 'success' | 'error' | 'warning' | 'info' }) => void;

  // Order methods
  fetchOrders: (organizationId: string) => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (order: OrderInsert, orderItems: OrderItemInsert[]) => Promise<OrderWithItems>;
  updateOrder: (id: string, updates: OrderUpdate) => Promise<OrderWithItems>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  
  // Search and filter
  searchOrders: (query: string, organizationId: string) => Promise<void>;
  getOrdersByStatus: (status: string, organizationId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    snackbar: {
      open: false,
      message: '',
      severity: 'success',
    },

    // Actions
    setOrders: (orders) => {
      set({ orders });
    },

    setCurrentOrder: (order) => {
      set({ currentOrder: order });
    },

    setLoading: (loading) => {
      set({ loading });
    },

    setError: (error) => {
      set({ error });
    },

    setSnackbar: (snackbar) => {
      set({ snackbar });
    },

    // Order methods
    fetchOrders: async (organizationId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                price
              )
            ),
            suppliers (
              name
            )
          `)
          .eq('organization_id', organizationId)
          .order('order_date', { ascending: false });

        if (error) throw error;

        const ordersWithItems = (data || []).map(order => ({
          ...order,
          supplier_name: order.suppliers?.name,
        }));

        set({ orders: ordersWithItems });
      } catch (error) {
        logSupabaseError('Error fetching orders', error);
        set({ error: 'Failed to fetch orders' });
      } finally {
        set({ loading: false });
      }
    },

    fetchOrder: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                price
              )
            ),
            suppliers (
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        const orderWithItems = {
          ...data,
          supplier_name: data.suppliers?.name,
        };

        set({ currentOrder: orderWithItems });
      } catch (error) {
        logSupabaseError('Error fetching order', error);
        set({ error: 'Failed to fetch order' });
      } finally {
        set({ loading: false });
      }
    },

    createOrder: async (order: OrderInsert, orderItems: OrderItemInsert[]) => {
      set({ loading: true, error: null });
      try {
        // Start a transaction
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert(order)
          .select()
          .single();

        if (orderError) throw orderError;

        // Add order_id to order items
        const itemsWithOrderId = orderItems.map(item => ({
          ...item,
          order_id: newOrder.id,
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(itemsWithOrderId);

        if (itemsError) throw itemsError;

        // Fetch the complete order with items
        await get().fetchOrder(newOrder.id);

        set({ 
          snackbar: { 
            open: true, 
            message: 'Order created successfully', 
            severity: 'success' 
          } 
        });

        return get().currentOrder!;
      } catch (error) {
        logSupabaseError('Error creating order', error);
        set({ error: 'Failed to create order' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateOrder: async (id: string, updates: OrderUpdate) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('orders')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        // Update the order in the list
        const updatedOrders = get().orders.map(order => 
          order.id === id ? { ...order, ...data } : order
        );

        set({ orders: updatedOrders });

        set({ 
          snackbar: { 
            open: true, 
            message: 'Order updated successfully', 
            severity: 'success' 
          } 
        });

        return get().currentOrder!;
      } catch (error) {
        logSupabaseError('Error updating order', error);
        set({ error: 'Failed to update order' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    deleteOrder: async (id: string) => {
      set({ loading: true, error: null });
      try {
        // Delete order items first (due to foreign key constraint)
        const { error: itemsError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', id);

        if (itemsError) throw itemsError;

        // Delete the order
        const { error: orderError } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);

        if (orderError) throw orderError;

        // Remove from state
        const updatedOrders = get().orders.filter(order => order.id !== id);
        set({ orders: updatedOrders });

        set({ 
          snackbar: { 
            open: true, 
            message: 'Order deleted successfully', 
            severity: 'success' 
          } 
        });
      } catch (error) {
        logSupabaseError('Error deleting order', error);
        set({ error: 'Failed to delete order' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateOrderStatus: async (id: string, status: string) => {
      set({ loading: true, error: null });
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id);

        if (error) throw error;

        // Update the order in the list
        const updatedOrders = get().orders.map(order => 
          order.id === id ? { ...order, status } : order
        );

        set({ orders: updatedOrders });

        set({ 
          snackbar: { 
            open: true, 
            message: 'Order status updated successfully', 
            severity: 'success' 
          } 
        });
      } catch (error) {
        logSupabaseError('Error updating order status', error);
        set({ error: 'Failed to update order status' });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    searchOrders: async (query: string, organizationId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                price
              )
            ),
            suppliers (
              name
            )
          `)
          .eq('organization_id', organizationId)
          .or(`suppliers.name.ilike.%${query}%,status.ilike.%${query}%`)
          .order('order_date', { ascending: false });

        if (error) throw error;

        const ordersWithItems = (data || []).map(order => ({
          ...order,
          supplier_name: order.suppliers?.name,
        }));

        set({ orders: ordersWithItems });
      } catch (error) {
        logSupabaseError('Error searching orders', error);
        set({ error: 'Failed to search orders' });
      } finally {
        set({ loading: false });
      }
    },

    getOrdersByStatus: async (status: string, organizationId: string) => {
      set({ loading: true, error: null });
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                name,
                price
              )
            ),
            suppliers (
              name
            )
          `)
          .eq('organization_id', organizationId)
          .eq('status', status)
          .order('order_date', { ascending: false });

        if (error) throw error;

        const ordersWithItems = (data || []).map(order => ({
          ...order,
          supplier_name: order.suppliers?.name,
        }));

        set({ orders: ordersWithItems });
      } catch (error) {
        logSupabaseError('Error fetching orders by status', error);
        set({ error: 'Failed to fetch orders by status' });
      } finally {
        set({ loading: false });
      }
    },
  }))
); 