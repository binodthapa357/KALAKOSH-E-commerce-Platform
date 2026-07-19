import { getUsers } from './user';
import { getOrders } from './order';

export interface CustomerData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  spent: string;
  joined: string;
  is_active: boolean;
}

export const getCustomers = async (): Promise<CustomerData[]> => {
  const users = await getUsers({ role: 'user' });

  let orders: any[] = [];
  try {
    const ordersRes = await getOrders({ limit: 1000 });
    orders = ordersRes.orders || [];
  } catch (err) {
    console.error('Failed to load orders for customer calculations:', err);
  }

  const ordersByUser: Record<string, { count: number; spent: number }> = {};
  orders.forEach((o) => {
    const uId = o.user_id?._id || o.user_id;
    if (uId) {
      if (!ordersByUser[uId]) {
        ordersByUser[uId] = { count: 0, spent: 0 };
      }
      ordersByUser[uId].count += 1;
      ordersByUser[uId].spent += o.total_amount || 0;
    }
  });

  return users.map((u: any) => {
    const stats = ordersByUser[u._id] || { count: 0, spent: 0 };
    const defaultAddress = u.addresses?.find((a: any) => a.is_default) || u.addresses?.[0];
    return {
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: defaultAddress?.phone || '—',
      location: defaultAddress ? `${defaultAddress.city}, ${defaultAddress.country}` : '—',
      orders: stats.count,
      spent: `Rs. ${stats.spent.toLocaleString()}`,
      joined: new Date(u.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      is_active: u.is_active,
    };
  });
};
