export interface Product {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  min_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  organization_id: string;
  name: string;
  contact_info: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  organization_id: string;
  supplier_id: string | null;
  status: OrderStatus;
  order_date: string;
  total_amount: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  priceModifier?: number;
} 