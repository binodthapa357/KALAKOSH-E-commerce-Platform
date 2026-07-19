'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { getProducts, type AdminProduct } from '@/services/admin/product';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-primary-100 rounded-xl ${className}`} />;
}

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' };
  if (stock <= 10) return { label: 'Low Stock', cls: 'bg-yellow-100 text-yellow-700' };
  return { label: 'In Stock', cls: 'bg-green-100 text-green-700' };
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setError('');
      const data = await getProducts();
      setProducts(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, filterStatus]);

  const handleDelete = async (product: AdminProduct) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product._id);
    try {
      await fetchApi(`/products/${product._id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success('Product deleted successfully');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeletingId(null);
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

      {/* Summary badges */}
      {!loading && (
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: 'Total', value: products.length, cls: 'bg-[#F7F2EA] border-border text-text-dark' },
            { label: 'Active', value: products.filter((p) => p.status === 'active').length, cls: 'bg-green-50 border-green-200 text-green-700' },
            { label: 'Pending', value: products.filter((p) => p.status === 'pending').length, cls: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
            { label: 'Inactive', value: products.filter((p) => p.status === 'inactive').length, cls: 'bg-gray-50 border-gray-200 text-gray-700' },
          ].map((b) => (
            <span key={b.label} className={`border rounded-full px-4 py-2 text-sm font-medium ${b.cls}`}>
              {b.label}: <strong>{b.value}</strong>
            </span>
          ))}
        </div>
      )}

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
            placeholder="Search products…"
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
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7 overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-text-mid text-xs pb-4">PRODUCT</th>
                <th className="text-left text-text-mid text-xs pb-4">CATEGORY</th>
                <th className="text-left text-text-mid text-xs pb-4">VENDOR</th>
                <th className="text-left text-text-mid text-xs pb-4">PRICE</th>
                <th className="text-left text-text-mid text-xs pb-4">STOCK</th>
                <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
                <th className="text-right text-text-mid text-xs pb-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product._id}>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium max-w-[200px] truncate">
                      {product.name}
                    </td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                      {product.category_id?.name ?? '—'}
                    </td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                      {product.vendor_id?.shop_name ?? '—'}
                    </td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                      {product.discount_price ? (
                        <span>
                          <span className="line-through text-text-light mr-1">${product.price}</span>
                          <span className="text-primary-700 font-medium">${product.discount_price}</span>
                        </span>
                      ) : (
                        `$${product.price}`
                      )}
                    </td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${stockStatus.cls}`}>
                        {product.stock} · {stockStatus.label}
                      </span>
                    </td>
                    <td className="py-4 border-t border-black/5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 border-t border-black/5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product._id}
                          className="p-2 rounded-lg hover:bg-red-100 text-text-light hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          {deletingId === product._id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12 text-text-light">
            No products found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}