'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, type DashboardStats } from '@/services/admin/dashboard';
import { getOrders, type AdminOrder } from '@/services/admin/order';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'shipped': return 'bg-blue-100 text-blue-700';
    case 'processing': return 'bg-yellow-100 text-yellow-700';
    case 'pending': return 'bg-orange-100 text-orange-700';
    case 'confirmed': return 'bg-purple-100 text-purple-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <span className="text-text-light text-xs">{label}</span>
      <h2 className="font-serif text-primary-700 text-[48px] font-semibold mt-2 leading-none">
        {value}
      </h2>
      {sub && <p className="text-text-mid text-sm mt-2">{sub}</p>}
    </div>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-primary-100 rounded-2xl ${className}`} />;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          getDashboardStats(),
          getOrders({ limit: 5 }),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.orders);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">OVERVIEW</span>
        <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
          Platform Health
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          ⚠ {error} — Make sure the backend is running on port 5000.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-7">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[160px]" />)
        ) : (
          <>
            <StatCard
              label="TOTAL USERS"
              value={stats?.users.total ?? 0}
              sub={`${stats?.users.active ?? 0} active · ${stats?.users.suspended ?? 0} suspended`}
            />
            <StatCard
              label="TOTAL VENDORS"
              value={stats?.vendors.total ?? 0}
              sub={`${stats?.vendors.active ?? 0} active · ${stats?.vendors.pending ?? 0} pending`}
            />
            <StatCard
              label="TOTAL ORDERS"
              value={stats?.orders.total ?? 0}
              sub={`${stats?.orders.delivered ?? 0} delivered · ${stats?.orders.pending ?? 0} pending`}
            />
            <StatCard
              label="TOTAL REVENUE"
              value={formatCurrency(stats?.revenue.total ?? 0)}
              sub="From paid orders"
            />
          </>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Recent Orders Table */}
        <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">
          <h2 className="font-serif text-primary-700 text-5xl mb-7">Recent Orders</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-text-light text-center py-10">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-text-mid text-xs pb-4">ORDER</th>
                    <th className="text-left text-text-mid text-xs pb-4">CUSTOMER</th>
                    <th className="text-left text-text-mid text-xs pb-4">TOTAL</th>
                    <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                        {order.order_number}
                      </td>
                      <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                        {order.user_id?.name ?? 'Unknown'}
                      </td>
                      <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                        ${order.total_amount.toFixed(2)}
                      </td>
                      <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                        <span className={`px-3.5 py-2 rounded-full text-xs font-medium capitalize ${getStatusColor(order.order_status)}`}>
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-7 shadow-sm">
          <h2 className="font-serif text-primary-700 text-5xl mb-7">Order Status</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Pending', value: stats?.orders.pending ?? 0, color: 'bg-orange-400' },
                { label: 'Processing', value: stats?.orders.processing ?? 0, color: 'bg-yellow-400' },
                { label: 'Shipped', value: stats?.orders.shipped ?? 0, color: 'bg-blue-400' },
                { label: 'Delivered', value: stats?.orders.delivered ?? 0, color: 'bg-green-400' },
                { label: 'Cancelled', value: stats?.orders.cancelled ?? 0, color: 'bg-red-400' },
              ].map((item) => {
                const total = stats?.orders.total || 1;
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-text-dark text-sm">{item.label}</span>
                      <span className="text-text-mid text-sm font-medium">{item.value}</span>
                    </div>
                    <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}