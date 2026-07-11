'use client';

import { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaUserCog } from 'react-icons/fa';
import { Button } from '@/app/components/ui/Button';

// Mock users data
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@kalakosh.com', role: 'Super Admin', status: 'Active', lastActive: '2024-03-15 14:23' },
  { id: 2, name: 'John Doe', email: 'john@kalakosh.com', role: 'Editor', status: 'Active', lastActive: '2024-03-14 09:12' },
  { id: 3, name: 'Jane Smith', email: 'jane@kalakosh.com', role: 'Viewer', status: 'Active', lastActive: '2024-03-13 16:45' },
  { id: 4, name: 'Mike Johnson', email: 'mike@kalakosh.com', role: 'Editor', status: 'Inactive', lastActive: '2024-03-10 11:30' },
  { id: 5, name: 'Sarah Wilson', email: 'sarah@kalakosh.com', role: 'Viewer', status: 'Active', lastActive: '2024-03-15 10:15' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Viewer', password: '' });

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-100 text-purple-700';
      case 'Editor':
        return 'bg-blue-100 text-blue-700';
      case 'Viewer':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      console.log('Adding user:', newUser);
      setNewUser({ name: '', email: '', role: 'Viewer', password: '' });
      setShowAddModal(false);
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
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl"
          >
            <FaUserPlus /> Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-50">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="All">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[#F7F2EA] border border-border rounded-2xl p-7 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-text-mid text-xs pb-4">USER</th>
              <th className="text-left text-text-mid text-xs pb-4">EMAIL</th>
              <th className="text-left text-text-mid text-xs pb-4">ROLE</th>
              <th className="text-left text-text-mid text-xs pb-4">STATUS</th>
              <th className="text-left text-text-mid text-xs pb-4">LAST ACTIVE</th>
              <th className="text-right text-text-mid text-xs pb-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm font-medium">
                  {user.name}
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {user.email}
                </td>
                <td className="py-4 border-t border-black/5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 border-t border-black/5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 border-t border-black/5 text-text-dark text-sm">
                  {user.lastActive}
                </td>
                <td className="py-4 border-t border-black/5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors">
                      <FaUserCog />
                    </Button>
                    <Button className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors">
                      <FaEdit />
                    </Button>
                    <Button className="p-2 rounded-lg hover:bg-red-100 text-text-light hover:text-red-600 transition-colors">
                      <FaTrash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-text-light">
            No users found. Try adjusting your search.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="font-serif text-3xl text-primary-700 mb-6">Add New User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-text-dark text-sm font-medium mb-2">Password *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-primary-700 text-white px-6 py-3 rounded-full hover:bg-primary-800 transition-colors font-semibold"
              >
                Add User
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 border border-border bg-white text-text-mid px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium"
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