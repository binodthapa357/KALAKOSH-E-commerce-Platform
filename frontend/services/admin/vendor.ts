import { fetchApi } from '@/lib/api';

export interface AdminVendor {
  _id: string;
  shop_name: string;
  pan_number: string;
  commission_rate: number;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  user_id: { _id: string; name: string; email: string } | null;
  bank_details: {
    bank_name: string;
    account_name: string;
    account_number: string;
    branch?: string;
  };
  createdAt: string;
}

export const getVendors = async (filters?: { status?: string }): Promise<AdminVendor[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  const query = params.toString() ? `?${params.toString()}` : '';
  const data = await fetchApi(`/admin/vendors${query}`);
  return data.vendors;
};

export const updateVendorStatus = async (
  vendorId: string,
  status: AdminVendor['status']
): Promise<AdminVendor> => {
  const data = await fetchApi(`/admin/vendors/${vendorId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return data.vendor;
};
