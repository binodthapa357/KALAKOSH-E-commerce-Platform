'use client';

import { useEffect, useState, useMemo } from 'react';
import { FaSearch, FaEnvelope, FaPhone, FaMapPin } from 'react-icons/fa';
import { getCustomers, type CustomerData } from '@/services/admin/customer';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-primary-100 rounded-2xl ${className}`} />;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);

  const fetchCustomerList = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCustomers();
      setCustomers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const term = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term)
      );
    });
  }, [customers, searchTerm]);

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">PEOPLE</span>
        <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
          Customers
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-50">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48" />)
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-light">
            No customers found.
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer._id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer shadow-sm"
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-serif text-2xl text-primary-700">{customer.name}</h3>
                  <p className="text-text-light text-sm flex items-center gap-1.5 mt-1">
                    <FaEnvelope className="text-xs shrink-0" /> <span className="truncate max-w-[150px]">{customer.email}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-primary-700 font-bold text-lg">{customer.spent}</p>
                  <p className="text-text-light text-xs mt-0.5">{customer.orders} orders</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm border-t border-black/5 pt-4 mt-2">
                <p className="text-text-mid flex items-center gap-2">
                  <FaPhone className="text-text-light" /> {customer.phone}
                </p>
                <p className="text-text-mid flex items-center gap-2">
                  <FaMapPin className="text-text-light" /> {customer.location}
                </p>
                <p className="text-text-light text-xs mt-3 pt-1">Joined: {customer.joined}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl text-primary-700">
                {selectedCustomer.name}
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-text-light hover:text-primary-700 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-light text-sm">Email</p>
                  <p className="text-text-dark font-medium">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Phone</p>
                  <p className="text-text-dark font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Location</p>
                  <p className="text-text-dark font-medium">{selectedCustomer.location}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Joined</p>
                  <p className="text-text-dark font-medium">{selectedCustomer.joined}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Total Orders</p>
                  <p className="text-text-dark font-medium">{selectedCustomer.orders}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Total Spent</p>
                  <p className="text-primary-700 font-bold text-xl">{selectedCustomer.spent}</p>
                </div>
              </div>
              <div className="flex gap-4 pt-6 border-t border-border mt-4">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}