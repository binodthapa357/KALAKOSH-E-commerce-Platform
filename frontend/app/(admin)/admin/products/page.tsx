'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

// Mock product data
const mockProducts = [
  { id: 1, name: 'Sacred Tara Thangka', category: 'Paintings', price: '$299', stock: 45, status: 'In Stock' },
  { id: 2, name: 'Tibetan Singing Bowl', category: 'Instruments', price: '$89', stock: 23, status: 'In Stock' },
  { id: 3, name: 'Maroon Pashmina Shawl', category: 'Textiles', price: '$159', stock: 12, status: 'Low Stock' },
  { id: 4, name: 'Khukuri Heritage Knife', category: 'Weapons', price: '$199', stock: 0, status: 'Out of Stock' },
  { id: 5, name: 'Buddha Statue (Brass)', category: 'Sculptures', price: '$349', stock: 8, status: 'In Stock' },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-700';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">INVENTORY</span>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
            Products
          </h1>
          <Link
            href="/admin/products/create"
            className="flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search products..."
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
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-text-mid text-xs pb-4">PRODUCT</th>
              <th className="text-left text-text-mid text-xs pb-4">CATEGORY</th>
              <th className="text-left text-text-mid text-xs pb-4">PRICE</th>
              <th className="text-left text-text-mid text-xs pb-4">STOCK</th>
              <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
              <th className="text-right text-text-mid text-xs pb-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                  {product.name}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {product.category}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {product.price}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {product.stock}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="py-4 border-t border-black/5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      className="p-2 rounded-lg hover:bg-red-100 text-text-light hover:text-red-600 transition-colors"
                      onClick={() => console.log('Delete product:', product.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-text-light">
            No products found. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
}