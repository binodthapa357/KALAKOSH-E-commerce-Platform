'use client';

import { useEffect, useState, useMemo } from 'react';
import { FaSearch, FaUserCog, FaUserSlash, FaUserCheck } from 'react-icons/fa';
import { getUsers, toggleUserStatus, type AdminUser } from '@/services/admin/user';
import { toast } from 'sonner';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-primary-100 rounded-xl ${className}`} />;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-700';
    case 'vendor': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setError('');
      const data = await getUsers();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && user.is_active) ||
        (filterStatus === 'suspended' && !user.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const handleToggle = async (user: AdminUser) => {
    setTogglingId(user._id);
    try {
      const updated = await toggleUserStatus(user._id);
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
      toast.success(`User ${updated.is_active ? 'activated' : 'suspended'} successfully`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user status');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">ACCESS</span>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
            Users
          </h1>
          <div className="flex items-center gap-3 text-sm text-text-mid">
            <span className="bg-[#F7F2EA] border border-border rounded-full px-4 py-2">
              Total: <strong className="text-primary-700">{users.length}</strong>
            </span>
            <span className="bg-green-50 border border-green-200 rounded-full px-4 py-2 text-green-700">
              Active: <strong>{users.filter((u) => u.is_active).length}</strong>
            </span>
            <span className="bg-red-50 border border-red-200 rounded-full px-4 py-2 text-red-700">
              Suspended: <strong>{users.filter((u) => !u.is_active).length}</strong>
            </span>
          </div>
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
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl p-7 overflow-x-auto shadow-sm">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-text-mid text-xs pb-4">USER</th>
                <th className="text-left text-text-mid text-xs pb-4">EMAIL</th>
                <th className="text-left text-text-mid text-xs pb-4">ROLE</th>
                <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
                <th className="text-left text-text-mid text-xs pb-4">JOINED</th>
                <th className="text-right text-text-mid text-xs pb-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                    {user.name}
                  </td>
                  <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                    {user.email}
                  </td>
                  <td className="py-4 border-t border-black/5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 border-t border-black/5">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td className="py-4 border-t border-black/5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(user)}
                        disabled={togglingId === user._id}
                        title={user.is_active ? 'Suspend user' : 'Activate user'}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                          user.is_active
                            ? 'hover:bg-red-100 text-text-light hover:text-red-600'
                            : 'hover:bg-green-100 text-text-light hover:text-green-600'
                        }`}
                      >
                        {togglingId === user._id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : user.is_active ? (
                          <FaUserSlash />
                        ) : (
                          <FaUserCheck />
                        )}
                      </button>
                      <button
                        title="Manage user"
                        className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors"
                      >
                        <FaUserCog />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center py-12 text-text-light">
            No users match your filters.
          </div>
        )}
      </div>
    </div>
  );
}