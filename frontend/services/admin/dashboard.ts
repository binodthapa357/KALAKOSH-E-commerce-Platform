import { fetchApi } from '@/lib/api';

export interface DashboardStats {
  users: { active: number; suspended: number; total: number };
  products: { active: number; pending: number; inactive: number; total: number };
  vendors: { active: number; pending: number; suspended: number; rejected: number; total: number };
  orders: { pending: number; processing: number; shipped: number; delivered: number; cancelled: number; total: number };
  revenue: { total: number };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const data = await fetchApi('/admin/stats');
  return data.stats;
};
