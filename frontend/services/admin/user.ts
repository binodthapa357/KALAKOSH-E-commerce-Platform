import { fetchApi } from '@/lib/api';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  createdAt: string;
}

export const getUsers = async (filters?: { is_active?: boolean; role?: string }): Promise<AdminUser[]> => {
  const params = new URLSearchParams();
  if (filters?.is_active !== undefined) params.set('is_active', String(filters.is_active));
  if (filters?.role) params.set('role', filters.role);
  const query = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchApi(`/admin/users${query}`);
  return data.users;
};

export const toggleUserStatus = async (userId: string): Promise<AdminUser> => {
  const data = await fetchApi(`/admin/users/${userId}/toggle-status`, { method: 'PATCH' });
  return data.user;
};
