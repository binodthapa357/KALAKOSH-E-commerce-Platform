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
//   Card,
//   CardTitle,
  SearchBar,
  Badge,
  Button
} from '@/app/components/ui';
import { FaEdit, FaTrash, FaEye, FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa';

// Mock reviews data
const mockReviews = [
  { 
    id: 1, 
    product: 'Sacred Tara Thangka', 
    user: 'Diya R.',
    rating: 5,
    comment: 'Beautiful craftsmanship! The colors are vibrant and the details are incredible.',
    date: '2024-03-15',
    status: 'Approved'
  },
  { 
    id: 2, 
    product: 'Tibetan Singing Bowl', 
    user: 'Aarav K.',
    rating: 4,
    comment: 'Great quality, produces a beautiful sound. Shipping was fast.',
    date: '2024-03-14',
    status: 'Approved'
  },
  { 
    id: 3, 
    product: 'Maroon Pashmina Shawl', 
    user: 'Maya L.',
    rating: 3,
    comment: 'Soft and warm but color is slightly different from the picture.',
    date: '2024-03-13',
    status: 'Pending'
  },
  { 
    id: 4, 
    product: 'Khukuri Heritage Knife', 
    user: 'Bikash T.',
    rating: 5,
    comment: 'Excellent quality! The blade is sharp and the handle is beautifully carved.',
    date: '2024-03-12',
    status: 'Approved'
  },
];

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All');
  const itemsPerPage = 5;

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || review.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalf key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-300" />);
      }
    }
    return stars;
  };

  const averageRating = mockReviews.reduce((acc, rev) => acc + rev.rating, 0) / mockReviews.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-text-light text-xs tracking-[0.2em]">FEEDBACK</span>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
            Reviews
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl px-4 py-2 border border-border">
              <p className="text-text-light text-xs">Average Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary-700">{averageRating.toFixed(1)}</span>
                <div className="flex">{renderStars(Math.round(averageRating))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <SearchBar 
          placeholder="Search reviews..." 
          onSearch={setSearchTerm} 
          className="flex-1 min-w-50"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <option value="All">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div className="bg-[#F7F2EA] border border-border rounded-2xl overflow-hidden">
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Product</TableHeader>
              <TableHeader>User</TableHeader>
              <TableHeader>Rating</TableHeader>
              <TableHeader>Review</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader align="right">Actions</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {paginatedReviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-text-light">
                  No reviews found
                </td>
              </tr>
            ) : (
              paginatedReviews.map((review, index) => (
                <TableRow key={review.id} striped hover index={index}>
                  <TableCell>
                    <div className="font-medium text-text-dark">{review.product}</div>
                  </TableCell>
                  <TableCell>{review.user}</TableCell>
                  <TableCell>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{review.comment}</div>
                  </TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>
                    <Badge variant={review.status === 'Approved' ? 'success' : 'warning'}>
                      {review.status}
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
          totalItems={filteredReviews.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}