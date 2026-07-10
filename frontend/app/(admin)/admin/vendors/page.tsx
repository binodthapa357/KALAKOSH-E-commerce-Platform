'use client';

import { useEffect, useState, useMemo } from 'react';
import { FaSearch, FaStore, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { getVendors, updateVendorStatus, type AdminVendor } from '@/services/admin/vendor';
import { toast } from 'sonner';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-primary-100 rounded-xl ${className}`} />;
}

const statusConfig: Record<AdminVendor['status'], { label: string; cls: string }> = {
  active: { label: 'Active', cls: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700' },
  suspended: { label: 'Suspended', cls: 'bg-red-100 text-red-700' },
  rejected: { label: 'Rejected', cls: 'bg-gray-100 text-gray-700' },
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchVendors = async () => {
    try {
      setError('');
      const data = await getVendors();
      setVendors(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        v.shop_name.toLowerCase().includes(term) ||
        (v.user_id?.name ?? '').toLowerCase().includes(term) ||
        (v.user_id?.email ?? '').toLowerCase().includes(term);
      const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchTerm, filterStatus]);

  const handleStatusChange = async (vendor: AdminVendor, newStatus: AdminVendor['status']) => {
    setUpdatingId(vendor._id);
    try {
      const updated = await updateVendorStatus(vendor._id, newStatus);
      setVendors((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
      toast.success(`Vendor ${newStatus} successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update vendor status');
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    total: vendors.length,
    active: vendors.filter((v) => v.status === 'active').length,
    pending: vendors.filter((v) => v.status === 'pending').length,
    suspended: vendors.filter((v) => v.status === 'suspended').length,
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">PARTNERS</span>
        <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
          Vendors
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total', value: counts.total, icon: FaStore, color: 'text-primary-700', bg: 'bg-primary-100' },
          { label: 'Active', value: counts.active, icon: FaCheck, color: 'text-green-700', bg: 'bg-green-100' },
          { label: 'Pending', value: counts.pending, icon: FaClock, color: 'text-yellow-700', bg: 'bg-yellow-100' },
          { label: 'Suspended', value: counts.suspended, icon: FaTimes, color: 'text-red-700', bg: 'bg-red-100' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-[#F7F2EA] border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${card.bg}`}>
                  <Icon className={`text-lg ${card.color}`} />
                </div>
                <div>
                  <p className="text-text-light text-xs">{card.label}</p>
                  {loading ? (
                    <div className="animate-pulse bg-primary-100 h-7 w-10 rounded mt-1" />
                  ) : (
                    <p className="font-serif text-primary-700 text-2xl font-semibold">{card.value}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
            placeholder="Search vendors…"
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
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Vendors Table */}
      <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7 overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-text-mid text-xs pb-4">VENDOR / OWNER</th>
                <th className="text-left text-text-mid text-xs pb-4">SHOP NAME</th>
                <th className="text-left text-text-mid text-xs pb-4">BANK</th>
                <th className="text-left text-text-mid text-xs pb-4">COMMISSION</th>
                <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
                <th className="text-left text-text-mid text-xs pb-4">JOINED</th>
                <th className="text-right text-text-mid text-xs pb-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => {
                const sc = statusConfig[vendor.status];
                return (
                  <tr key={vendor._id}>
                    <td className="py-4 border-t border-black/5">
                      <div className="text-text-dark text-sm font-medium">
                        {vendor.user_id?.name ?? '—'}
                      </div>
                      <div className="text-text-light text-xs">{vendor.user_id?.email ?? ''}</div>
                    </td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                      {vendor.shop_name}
                    </td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                      <div>{vendor.bank_details?.bank_name}</div>
                      <div className="text-text-light text-xs">{vendor.bank_details?.account_name}</div>
                    </td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                      {(vendor.commission_rate * 100).toFixed(0)}%
                    </td>
                    <td className="py-4 border-t border-black/5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                      {new Date(vendor.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 border-t border-black/5 text-right">
                      {updatingId === vendor._id ? (
                        <div className="flex justify-end">
                          <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <select
                          value={vendor.status}
                          onChange={(e) => handleStatusChange(vendor, e.target.value as AdminVendor['status'])}
                          className="text-xs border border-border rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
                        >
                          <option value="active">Activate</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspend</option>
                          <option value="rejected">Reject</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && filteredVendors.length === 0 && (
          <div className="text-center py-12 text-text-light">
            No vendors found. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
}