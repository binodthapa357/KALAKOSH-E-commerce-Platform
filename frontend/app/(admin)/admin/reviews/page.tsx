'use client';

import { useState } from 'react';
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
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  PaginationEllipsis,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  StarHalf,
  StarOff,
  Filter,
  ChevronDown,
  MessageSquare,
  User,
  Calendar,
  TrendingUp,
} from 'lucide-react';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    product: 'Sacred Tara Thangka',
    user: 'Diya R.',
    rating: 5,
    comment: 'Beautiful craftsmanship! The colors are vibrant and the details are incredible.',
    date: '2024-03-15',
    status: 'Approved',
    avatar: 'DR',
    helpful: 24,
  },
  {
    id: 2,
    product: 'Tibetan Singing Bowl',
    user: 'Aarav K.',
    rating: 4,
    comment: 'Great quality, produces a beautiful sound. Shipping was fast.',
    date: '2024-03-14',
    status: 'Approved',
    avatar: 'AK',
    helpful: 18,
  },
  {
    id: 3,
    product: 'Maroon Pashmina Shawl',
    user: 'Maya L.',
    rating: 3,
    comment: 'Soft and warm but color is slightly different from the picture.',
    date: '2024-03-13',
    status: 'Pending',
    avatar: 'ML',
    helpful: 7,
  },
  {
    id: 4,
    product: 'Khukuri Heritage Knife',
    user: 'Bikash T.',
    rating: 5,
    comment: 'Excellent quality! The blade is sharp and the handle is beautifully carved.',
    date: '2024-03-12',
    status: 'Approved',
    avatar: 'BT',
    helpful: 32,
  },
];

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const itemsPerPage = 5;

  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return 0;
  });

  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<StarOff key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
      case 'Pending':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
      case 'Rejected':
        return 'bg-rose-100 text-rose-700 hover:bg-rose-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const averageRating = mockReviews.reduce((acc, rev) => acc + rev.rating, 0) / mockReviews.length;
  const totalReviews = mockReviews.length;
  const pendingReviews = mockReviews.filter((r) => r.status === 'Pending').length;
  const approvedReviews = mockReviews.filter((r) => r.status === 'Approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-amber-600 tracking-wider uppercase">
              Customer Feedback
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                  Reviews
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage and moderate customer reviews
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Export Report
                </Button>
                <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
                  <MessageSquare className="w-4 h-4" />
                  Review Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Reviews</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalReviews}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Average Rating</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {averageRating.toFixed(1)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">{approvedReviews}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Badge className="bg-emerald-600">✓</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Review</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{pendingReviews}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Badge className="bg-amber-600">⏳</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search reviews by product, user, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-amber-200/50 focus-visible:ring-amber-500"
                />
              </div>
              <div className="flex gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px] border-amber-200/50 focus:ring-amber-500">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] border-amber-200/50 focus:ring-amber-500">
                    <ChevronDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rated</SelectItem>
                    <SelectItem value="lowest">Lowest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card className="border-amber-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-200/50 bg-amber-50/50">
                    <TableHead className="font-semibold text-gray-700">Product</TableHead>
                    <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                    <TableHead className="font-semibold text-gray-700">Rating</TableHead>
                    <TableHead className="font-semibold text-gray-700">Review</TableHead>
                    <TableHead className="font-semibold text-gray-700">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <MessageSquare className="w-12 h-12 text-gray-300" />
                          <p className="text-gray-500 font-medium">No reviews found</p>
                          <p className="text-sm text-gray-400">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedReviews.map((review) => (
                      <TableRow
                        key={review.id}
                        className="border-amber-200/30 hover:bg-amber-50/50 transition-colors"
                      >
                        <TableCell>
                          <div className="font-medium text-gray-900">{review.product}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 bg-amber-100">
                              <AvatarFallback className="text-amber-700 text-xs font-medium">
                                {review.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-700">{review.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-500 ml-1">({review.rating})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="max-w-xs truncate text-sm text-gray-600 cursor-help">
                                  {review.comment}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>{review.comment}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Helpful: {review.helpful} people
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {review.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(review.status)} font-medium`}>
                            {review.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-amber-100 hover:text-amber-700"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View review</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-amber-100 hover:text-amber-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit review</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-amber-100 hover:text-amber-700"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2">
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <Edit className="w-4 h-4" />
                                  Edit Review
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 text-rose-600 focus:text-rose-600">
                                  <Trash2 className="w-4 h-4" />
                                  Delete Review
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredReviews.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-amber-200/50">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredReviews.length)} of{' '}
                  {filteredReviews.length} reviews
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(Math.max(1, currentPage - 1));
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
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
                          setCurrentPage(Math.min(totalPages, currentPage + 1));
                        }}
                        className={
                          currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}