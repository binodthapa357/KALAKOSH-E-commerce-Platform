import { fetchApi } from '@/lib/api';

export interface AdminOrder {
  _id: string;
  order_number: string;
  user_id: { _id: string; name: string; email: string } | null;
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code?: string;
    country: string;
    phone: string;
  };
  createdAt: string;
}

export interface OrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  pages: number;
}

export const getOrders = async (filters?: {
  order_status?: string;
  page?: number;
  limit?: number;
}): Promise<OrdersResponse> => {
  const params = new URLSearchParams();
  if (filters?.order_status) params.set('order_status', filters.order_status);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  const query = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchApi(`/admin/orders${query}`);
  return { orders: data.orders, total: data.total, page: data.page, pages: data.pages };
};
