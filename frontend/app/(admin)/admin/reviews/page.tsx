'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  MoreHorizontal,
  Trash2,
  Star,
  StarOff,
  ChevronDown,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { getReviews, deleteReview, type AdminReview } from '@/services/admin/review';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const itemsPerPage = 8;

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getReviews();
      setReviews(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setDeletingId(id);
    try {
      const res = await deleteReview(id);
      if (res.success) {
        toast.success(res.message || 'Review deleted successfully');
        setReviews((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const term = searchTerm.toLowerCase();
      const productName = (review.product_id?.name || '').toLowerCase();
      const userName = (review.user_id?.name || '').toLowerCase();
      const comment = (review.comment || '').toLowerCase();
      return productName.includes(term) || userName.includes(term) || comment.includes(term);
    });
  }, [reviews, searchTerm]);

  // Sort reviews
  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });
  }, [filteredReviews, sortBy]);

  // Paginated reviews
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedReviews.slice(start, start + itemsPerPage);
  }, [sortedReviews, currentPage]);

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
      } else {
        stars.push(<StarOff key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  }, [reviews]);

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <span className="text-text-light text-xs tracking-[0.2em]">FEEDBACK</span>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-primary-700 text-[70px] font-semibold leading-none mt-2.5">
            Reviews
          </h1>
          <div className="flex items-center gap-3 text-sm text-text-mid">
            <span className="bg-card border border-border rounded-full px-4 py-2 shadow-2xs">
              Total: <strong className="text-primary-700">{reviews.length}</strong>
            </span>
            <span className="bg-green-50 border border-green-200 rounded-full px-4 py-2 text-green-700">
              Avg Rating: <strong>{averageRating.toFixed(1)} ★</strong>
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <Input
            placeholder="Search reviews by product, customer, or keyword…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-full bg-white focus-visible:ring-primary-400"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] border border-border rounded-full bg-white text-sm focus:ring-primary-400">
            <ChevronDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews Table Card */}
      <Card className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F7F2EA]/40">
                  <TableHead className="font-semibold text-text-mid pb-4 pl-6 pt-4">PRODUCT</TableHead>
                  <TableHead className="font-semibold text-text-mid pb-4 pt-4">CUSTOMER</TableHead>
                  <TableHead className="font-semibold text-text-mid pb-4 pt-4">RATING</TableHead>
                  <TableHead className="font-semibold text-text-mid pb-4 pt-4">COMMENT</TableHead>
                  <TableHead className="font-semibold text-text-mid pb-4 pt-4">DATE</TableHead>
                  <TableHead className="font-semibold text-text-mid text-right pb-4 pr-6 pt-4">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6} className="py-6 text-center">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare className="w-12 h-12 text-text-light" />
                        <p className="text-text-mid font-medium">No reviews found</p>
                        <p className="text-sm text-text-light">
                          Customer feedback will appear here once submitted.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReviews.map((review) => (
                    <TableRow
                      key={review._id}
                      className="border-t border-black/5 hover:bg-black/5/5 transition-colors"
                    >
                      <td className="py-4 pl-6 text-text-dark text-sm font-medium">
                        {review.product_id?.name || 'Deleted Product'}
                      </td>
                      <td className="py-4 text-text-dark text-sm">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-8 h-8 bg-primary-100">
                            <AvatarFallback className="text-primary-700 text-xs font-semibold">
                              {(review.user_id?.name || 'U').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{review.user_id?.name || 'Unknown User'}</div>
                            <div className="text-text-light text-xs">{review.user_id?.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-text-dark text-sm">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-text-mid ml-1">({review.rating})</span>
                        </div>
                      </td>
                      <td className="py-4 text-text-mid text-sm max-w-xs truncate" title={review.comment}>
                        {review.comment}
                      </td>
                      <td className="py-4 text-text-dark text-sm">
                        <div className="flex items-center gap-1 text-text-mid">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white border border-border rounded-xl shadow-lg">
                              <DropdownMenuLabel className="text-text-mid">Moderate Review</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-border/60" />
                              <DropdownMenuItem
                                onClick={() => handleDelete(review._id)}
                                disabled={deletingId === review._id}
                                className="gap-2 text-red-600 focus:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Review
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-black/5">
              <p className="text-sm text-text-mid">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredReviews.length)} of{' '}
                {filteredReviews.length} reviews
              </p>
              <Pagination>
                <PaginationContent className="flex gap-1.5">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.max(1, p - 1));
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}