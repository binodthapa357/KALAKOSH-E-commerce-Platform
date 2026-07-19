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
  const [selectedVendor, setSelectedVendor] = useState<AdminVendor | null>(null);

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
            <div key={card.label} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
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
      <div className="bg-card border border-border rounded-2xl p-7 overflow-x-auto shadow-sm">
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
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline px-3 py-1.5 rounded-full bg-primary-100/50 hover:bg-primary-100 transition"
                        >
                          Review PAN
                        </button>
                        {updatingId === vendor._id ? (
                          <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
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
                      </div>
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

      {/* Detailed Review Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#EADCC9] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 relative flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-stone-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-semibold tracking-wider text-text-light uppercase">VENDOR VERIFICATION PROFILE</span>
                <h2 className="text-2xl font-serif font-bold text-primary-700 mt-1">{selectedVendor.shop_name}</h2>
              </div>
              <button 
                onClick={() => setSelectedVendor(null)}
                className="text-stone-400 hover:text-stone-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 flex-1">
              {/* Profile details */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Shop Name</span>
                  <span className="font-semibold text-stone-800">{selectedVendor.shop_name}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Owner Name</span>
                  <span className="font-semibold text-stone-800">{selectedVendor.user_id?.name ?? '—'}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">Email Address</span>
                  <span className="font-semibold text-stone-800">{selectedVendor.user_id?.email ?? '—'}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-stone-400">9-Digit PAN Number</span>
                  <span className="font-mono font-semibold text-stone-800">{selectedVendor.pan_number}</span>
                </div>
              </div>

              {/* Bank payout details */}
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Bank Details</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm bg-stone-50 p-4 rounded-xl">
                  <div>
                    <span className="block text-xs text-stone-450">Bank Name</span>
                    <span className="font-semibold text-stone-800">{selectedVendor.bank_details?.bank_name}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-stone-450">Account Name</span>
                    <span className="font-semibold text-stone-800">{selectedVendor.bank_details?.account_name}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-stone-450">Account Number</span>
                    <span className="font-mono font-semibold text-stone-800">{selectedVendor.bank_details?.account_number}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-stone-450">Branch</span>
                    <span className="font-semibold text-stone-800">{selectedVendor.bank_details?.branch || 'Main Branch'}</span>
                  </div>
                </div>
              </div>

              {/* PAN Photo Preview */}
              <div className="pt-4 border-t border-stone-100">
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">PAN Uploaded Document</span>
                {selectedVendor.pan_photo ? (
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center p-2 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedVendor.pan_photo} 
                      alt={`${selectedVendor.shop_name} PAN Card`} 
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="w-full py-8 text-center border border-dashed border-stone-200 rounded-2xl text-stone-400 text-xs">
                    No PAN card photo uploaded.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex gap-4 border-t border-stone-100 pt-6 mt-6">
              <button
                onClick={async () => {
                  await handleStatusChange(selectedVendor, 'active');
                  setSelectedVendor(null);
                }}
                disabled={updatingId === selectedVendor._id}
                className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
              >
                Approve (Activate)
              </button>
              <button
                onClick={async () => {
                  await handleStatusChange(selectedVendor, 'rejected');
                  setSelectedVendor(null);
                }}
                disabled={updatingId === selectedVendor._id}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
              >
                Reject Profile
              </button>
              <button
                onClick={() => setSelectedVendor(null)}
                className="py-3 px-5 border border-stone-200 hover:bg-stone-50 text-stone-600 text-sm font-medium rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}