'use client';

import { useEffect, useState, useMemo } from 'react';
import { FaSearch, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getOrders, type AdminOrder } from '@/services/admin/order';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-primary-100 rounded-xl ${className}`} />;
}

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

const getPaymentColor = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-700';
    case 'failed': return 'bg-red-100 text-red-700';
    case 'refunded': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  const fetchOrders = async (currentPage: number, status: string) => {
    setLoading(true);
    try {
      setError('');
      const data = await getOrders({
        order_status: status !== 'all' ? status : undefined,
        page: currentPage,
        limit: LIMIT,
      });
      setOrders(data.orders);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchOrders(1, filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    fetchOrders(page, filterStatus);
  }, [page]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((o) =>
      o.order_number.toLowerCase().includes(term) ||
      (o.user_id?.name ?? '').toLowerCase().includes(term) ||
      (o.user_id?.email ?? '').toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">SALES</span>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
            Orders
          </h1>
          {!loading && (
            <span className="bg-[#F7F2EA] border border-border rounded-full px-5 py-2 text-sm text-text-mid">
              Total: <strong className="text-primary-700">{total}</strong>
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search by order # or customer…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7 overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-text-mid text-xs pb-4">ORDER #</th>
                <th className="text-left text-text-mid text-xs pb-4">CUSTOMER</th>
                <th className="text-left text-text-mid text-xs pb-4">DATE</th>
                <th className="text-left text-text-mid text-xs pb-4">TOTAL</th>
                <th className="text-left text-text-mid text-xs pb-4">PAYMENT</th>
                <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
                <th className="text-right text-text-mid text-xs pb-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium font-mono">
                    {order.order_number}
                  </td>
                  <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                    <div>{order.user_id?.name ?? 'Unknown'}</div>
                    <div className="text-text-light text-xs">{order.user_id?.email}</div>
                  </td>
                  <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="py-4 border-t border-black/5 text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getPaymentColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-4 border-t border-black/5 text-sm">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="py-4 border-t border-black/5 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12 text-text-light">
            No orders found.
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5">
            <p className="text-text-mid text-sm">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border hover:bg-white transition-colors disabled:opacity-40"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-white transition-colors disabled:opacity-40"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl text-primary-700">
                Order {selectedOrder.order_number}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-text-light hover:text-primary-700 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-light text-sm">Customer</p>
                  <p className="text-text-dark font-medium">{selectedOrder.user_id?.name ?? 'Unknown'}</p>
                  <p className="text-text-light text-xs">{selectedOrder.user_id?.email}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Order Date</p>
                  <p className="text-text-dark font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Order Status</p>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedOrder.order_status)}`}>
                    {selectedOrder.order_status}
                  </span>
                </div>
                <div>
                  <p className="text-text-light text-sm">Payment</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getPaymentColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status}
                    </span>
                    <span className="text-text-light text-xs">{selectedOrder.payment_method}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-border pt-4">
                <h3 className="font-serif text-xl text-primary-700 mb-3">Shipping Address</h3>
                <p className="text-text-dark text-sm">{selectedOrder.shipping_address.name}</p>
                <p className="text-text-mid text-sm">{selectedOrder.shipping_address.street}</p>
                <p className="text-text-mid text-sm">
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}
                </p>
                <p className="text-text-mid text-sm">{selectedOrder.shipping_address.country}</p>
                <p className="text-text-light text-sm mt-1">📞 {selectedOrder.shipping_address.phone}</p>
              </div>

              {/* Cost Breakdown */}
              <div className="border-t border-border pt-4">
                <h3 className="font-serif text-xl text-primary-700 mb-3">Cost Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-mid">
                    <span>Subtotal</span><span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-mid">
                    <span>Shipping</span><span>${selectedOrder.shipping_cost.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span><span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-text-dark border-t border-border pt-2">
                    <span>Total</span><span>${selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}