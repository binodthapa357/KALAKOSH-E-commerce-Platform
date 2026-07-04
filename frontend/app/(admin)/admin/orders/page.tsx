'use client';

import { useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';

// Mock orders data
const mockOrders = [
  { id: 'KLK-3104', user: 'Diya R.', vendor: 'Sita Tamang', date: '2024-03-15', total: '$268', status: 'Delivered', items: 3 },
  { id: 'KLK-3103', user: 'Aarav K.', vendor: 'Krishna Shilpakar', date: '2024-03-14', total: '$98', status: 'Shipped', items: 1 },
  { id: 'KLK-3102', user: 'Maya L.', vendor: 'Ratna Shakya', date: '2024-03-13', total: '$79', status: 'Processing', items: 2 },
  { id: 'KLK-3101', user: 'Bikash T.', vendor: 'Tenzin Lama', date: '2024-03-12', total: '$189', status: 'Delivered', items: 4 },
  { id: 'KLK-3100', user: 'Sita P.', vendor: 'Anita Thapa', date: '2024-03-11', total: '$145', status: 'Shipped', items: 2 },
  { id: 'KLK-3099', user: 'Ram S.', vendor: 'Gopal Shrestha', date: '2024-03-10', total: '$56', status: 'Pending', items: 1 },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pending':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">SALES</span>
        <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
          Orders
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-text-mid text-xs pb-4">ORDER</th>
              <th className="text-left text-text-mid text-xs pb-4">USER</th>
              <th className="text-left text-text-mid text-xs pb-4">VENDOR</th>
              <th className="text-left text-text-mid text-xs pb-4">DATE</th>
              <th className="text-left text-text-mid text-xs pb-4">ITEMS</th>
              <th className="text-left text-text-mid text-xs pb-4">TOTAL</th>
              <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
              <th className="text-right text-text-mid text-xs pb-4">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                  {order.id}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {order.user}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {order.vendor}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {order.date}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {order.items}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                  {order.total}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
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
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-text-light">
            No orders found. Try adjusting your search.
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl text-primary-700">
                Order {selectedOrder.id}
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
                  <p className="text-text-light text-sm">User</p>
                  <p className="text-text-dark font-medium">{selectedOrder.user}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Vendor</p>
                  <p className="text-text-dark font-medium">{selectedOrder.vendor}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Date</p>
                  <p className="text-text-dark font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Status</p>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-text-light text-sm">Items</p>
                  <p className="text-text-dark font-medium">{selectedOrder.items} products</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Total</p>
                  <p className="text-text-dark font-medium text-xl">{selectedOrder.total}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-serif text-xl text-primary-700 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between py-2 border-b border-border/50">
                      <div>
                        <p className="text-text-dark">Product {item}</p>
                        <p className="text-text-light text-sm">Variant: Standard</p>
                      </div>
                      <p className="text-text-dark font-medium">${(Math.random() * 100 + 20).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}