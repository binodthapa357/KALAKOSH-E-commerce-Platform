import { fetchApi } from '@/lib/api';

export interface AdminProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  stock: number;
  status: 'active' | 'pending' | 'inactive';
  avg_rating: number;
  images: string[];
  region: string;
  material: string;
  craft_type: string;
  category_id: { _id: string; name: string } | null;
  vendor_id: { _id: string; shop_name: string } | null;
  createdAt: string;
}

export const getProducts = async (filters?: { status?: string }): Promise<AdminProduct[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  const query = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchApi(`/admin/products${query}`);
  return data.products;
};
