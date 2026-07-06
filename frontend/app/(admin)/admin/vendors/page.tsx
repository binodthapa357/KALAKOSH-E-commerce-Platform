'use client';

import { useState } from 'react';
import { 
  Table, 
  TableHead, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell,
  TableActions,
  TablePagination,
  Card,
//   CardTitle,
  SearchBar,
  Badge,
  Button
} from '@/app/components/ui';
import { FaEdit, FaTrash, FaEye, FaPlus, FaStore, FaCheck, FaTimes } from 'react-icons/fa';

// Mock vendors data
const mockVendors = [
  { 
    id: 1, 
    name: 'Sita Tamang', 
    store: 'Himalayan Heritage', 
    email: 'sita@himalayan.com',
    phone: '+977 9841234567',
    location: 'Kathmandu',
    products: 45,
    status: 'Active',
    joined: '2023-01-15',
    revenue: '$12,450'
  },
  { 
    id: 2, 
    name: 'Krishna Shilpakar', 
    store: 'Shilpakar Artisans', 
    email: 'krishna@shilpakar.com',
    phone: '+977 9842345678',
    location: 'Lalitpur',
    products: 28,
    status: 'Active',
    joined: '2023-03-20',
    revenue: '$8,230'
  },
  { 
    id: 3, 
    name: 'Ratna Shakya', 
    store: 'Ratna Creations', 
    email: 'ratna@creations.com',
    phone: '+977 9843456789',
    location: 'Bhaktapur',
    products: 32,
    status: 'Inactive',
    joined: '2023-06-10',
    revenue: '$5,120'
  },
  { 
    id: 4, 
    name: 'Tenzin Lama', 
    store: 'Lama Handicrafts', 
    email: 'tenzin@lama.com',
    phone: '+977 9844567890',
    location: 'Pokhara',
    products: 56,
    status: 'Active',
    joined: '2023-08-05',
    revenue: '$18,900'
  },
];

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredVendors = mockVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-text-light text-xs tracking-[0.2em]">PARTNERS</span>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
            Vendors
          </h1>
          <Button leftIcon={<FaPlus />}>
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-xl">
              <FaStore className="text-primary-700 text-xl" />
            </div>
            <div>
              <p className="text-text-light text-xs">Total Vendors</p>
              <p className="font-serif text-primary-700 text-2xl font-semibold">24</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <FaCheck className="text-green-700 text-xl" />
            </div>
            <div>
              <p className="text-text-light text-xs">Active</p>
              <p className="font-serif text-primary-700 text-2xl font-semibold">18</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <FaTimes className="text-red-700 text-xl" />
            </div>
            <div>
              <p className="text-text-light text-xs">Inactive</p>
              <p className="font-serif text-primary-700 text-2xl font-semibold">6</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-text-light text-xs">Total Revenue</p>
              <p className="font-serif text-primary-700 text-2xl font-semibold">$44,700</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <SearchBar 
        placeholder="Search vendors..." 
        onSearch={setSearchTerm} 
        className="max-w-md"
      />

      {/* Vendors Table */}
      <div className="bg-[#F7F2EA] border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Vendor</TableHeader>
              <TableHeader>Store</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Products</TableHeader>
              <TableHeader>Revenue</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader align="right">Actions</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {paginatedVendors.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-text-light">
                  No vendors found
                </td>
              </tr>
            ) : (
              paginatedVendors.map((vendor, index) => (
                <TableRow key={vendor.id} striped hover index={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-text-dark">{vendor.name}</div>
                      <div className="text-text-light text-xs">{vendor.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vendor.store}</div>
                      <div className="text-text-light text-xs">{vendor.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{vendor.location}</TableCell>
                  <TableCell>{vendor.products}</TableCell>
                  <TableCell bold>{vendor.revenue}</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === 'Active' ? 'success' : 'danger'}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    <TableActions>
                      <Button className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors">
                        <FaEye />
                      </Button>
                      <Button className="p-2 rounded-lg hover:bg-primary-100 text-text-light hover:text-primary-700 transition-colors">
                        <FaEdit />
                      </Button>
                      <Button className="p-2 rounded-lg hover:bg-red-100 text-text-light hover:text-red-600 transition-colors">
                        <FaTrash />
                      </Button>
                    </TableActions>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredVendors.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}