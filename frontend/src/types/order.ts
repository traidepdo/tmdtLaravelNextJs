import { Product, ProductVariant } from './product';

export type PaymentMethod = 'cod' | 'vnpay' | 'momo' | 'banking';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipping' | 'completed' | 'cancelled';

export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  id: number;
  code: string;
  title: string;
  description?: string | null;
  type: CouponType;
  value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  usage_limit?: number | null;
  used_count: number;
  usage_limit_per_user?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id?: number | null;
  product_variant_id?: number | null;
  product_name: string;
  sku?: string | null;
  color_name?: string | null;
  size?: string | null;
  image_url?: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  product?: Product;
  product_variant?: ProductVariant;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  user_id?: number | null;
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes?: string | null;
  coupon_id?: number | null;
  coupon_code?: string | null;
  coupon?: Coupon | null;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrderItemPayload {
  product_variant_id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes?: string;
  payment_method?: PaymentMethod;
  shipping_fee?: number;
  discount_amount?: number;
  coupon_code?: string;
  items: CreateOrderItemPayload[];
}

export interface CheckCouponPayload {
  code: string;
  order_amount: number;
}
