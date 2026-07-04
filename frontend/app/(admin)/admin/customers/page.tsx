'use client';

import { useState } from 'react';
import { FaSearch, FaEnvelope, FaPhone, FaMapPin } from 'react-icons/fa';
// import { FaRegEdit } from "react-icons/fa";
// Mock customers data
const mockCustomers = [
  { id: 1, name: 'Diya R.', email: 'diya@example.com', phone: '+977 9841234567', location: 'Kathmandu', orders: 12, spent: '$1,234', joined: '2023-06-15' },
  { id: 2, name: 'Aarav K.', email: 'aarav@example.com', phone: '+977 9842345678', location: 'Pokhara', orders: 8, spent: '$876', joined: '2023-08-22' },
  { id: 3, name: 'Maya L.', email: 'maya@example.com', phone: '+977 9843456789', location: 'Lalitpur', orders: 5, spent: '$543', joined: '2023-10-01' },
  { id: 4, name: 'Bikash T.', email: 'bikash@example.com', phone: '+977 9844567890', location: 'Bhaktapur', orders: 15, spent: '$1,987', joined: '2023-05-10' },
  { id: 5, name: 'Sita P.', email: 'sita@example.com', phone: '+977 9845678901', location: 'Kathmandu', orders: 3, spent: '$234', joined: '2024-01-20' },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">PEOPLE</span>
        <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
          Customers
        </h1>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-[#F7F2EA] border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl text-primary-700">{customer.name}</h3>
                <p className="text-text-light text-sm flex items-center gap-1.5">
                  <FaEnvelope className="text-xs" /> {customer.email}
                </p>
              </div>
              <div className="text-right">
                <p className="text-text-dark font-bold">{customer.spent}</p>
                <p className="text-text-light text-xs">{customer.orders} orders</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <p className="text-text-mid flex items-center gap-2">
                <FaPhone className="text-text-light" /> {customer.phone}
              </p>
              <p className="text-text-mid flex items-center gap-2">
                <FaMapPin className="text-text-light" /> {customer.location}
              </p>
              <p className="text-text-light text-xs">Joined: {customer.joined}</p>
            </div>
          </div>
        ))}
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
                  <p className="text-text-dark">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Phone</p>
                  <p className="text-text-dark">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Location</p>
                  <p className="text-text-dark">{selectedCustomer.location}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Joined</p>
                  <p className="text-text-dark">{selectedCustomer.joined}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Total Orders</p>
                  <p className="text-text-dark">{selectedCustomer.orders}</p>
                </div>
                <div>
                  <p className="text-text-light text-sm">Total Spent</p>
                  <p className="text-text-dark font-bold text-xl">{selectedCustomer.spent}</p>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-border">
                <button className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors">
                  View Orders
                </button>
                <button className="flex-1 border border-border bg-white text-text-mid px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}