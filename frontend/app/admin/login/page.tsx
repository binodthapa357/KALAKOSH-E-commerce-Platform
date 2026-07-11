'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { 
  FaRegEnvelope, 
  FaLock, 
  FaClock,
  FaGlobe,
  FaDesktop,
  FaMobile,
  FaTablet,
  FaEllipsisV,
  FaShieldAlt,
  FaUserLock,
  FaHistory,
  FaChevronRight,
  FaChevronLeft,
} from 'react-icons/fa';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoShieldCheckmarkSharp } from "react-icons/io5";
// import { LuAlertCircle } from "react-icons/lu";
import { CircleAlert } from "lucide-react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { TbDeviceDesktop, TbDeviceMobile, TbDeviceTablet } from "react-icons/tb";

// Mock login history data
const loginHistoryData = [
  { 
    id: 1, 
    timestamp: '2024-03-15 14:23:45', 
    ip: '192.168.1.100', 
    location: 'Kathmandu, Nepal',
    device: 'Desktop - Chrome',
    status: 'Success',
    browser: 'Chrome 122',
    city: 'Kathmandu'
  },
  { 
    id: 2, 
    timestamp: '2024-03-15 10:15:30', 
    ip: '192.168.1.101', 
    location: 'Pokhara, Nepal',
    device: 'Mobile - Safari',
    status: 'Success',
    browser: 'Safari 17',
    city: 'Pokhara'
  },
  { 
    id: 3, 
    timestamp: '2024-03-14 22:45:12', 
    ip: '192.168.1.102', 
    location: 'Lalitpur, Nepal',
    device: 'Tablet - Chrome',
    status: 'Failed',
    browser: 'Chrome 122',
    city: 'Lalitpur'
  },
  { 
    id: 4, 
    timestamp: '2024-03-14 16:30:55', 
    ip: '192.168.1.103', 
    location: 'Kathmandu, Nepal',
    device: 'Desktop - Firefox',
    status: 'Success',
    browser: 'Firefox 123',
    city: 'Kathmandu'
  },
  { 
    id: 5, 
    timestamp: '2024-03-14 09:20:18', 
    ip: '192.168.1.104', 
    location: 'Bhaktapur, Nepal',
    device: 'Mobile - Chrome',
    status: 'Success',
    browser: 'Chrome 122',
    city: 'Bhaktapur'
  },
  { 
    id: 6, 
    timestamp: '2024-03-13 20:10:45', 
    ip: '192.168.1.105', 
    location: 'Kathmandu, Nepal',
    device: 'Desktop - Edge',
    status: 'Failed',
    browser: 'Edge 122',
    city: 'Kathmandu'
  },
  { 
    id: 7, 
    timestamp: '2024-03-13 14:55:33', 
    ip: '192.168.1.106', 
    location: 'Pokhara, Nepal',
    device: 'Tablet - Safari',
    status: 'Success',
    browser: 'Safari 17',
    city: 'Pokhara'
  },
  { 
    id: 8, 
    timestamp: '2024-03-12 11:40:22', 
    ip: '192.168.1.107', 
    location: 'Lalitpur, Nepal',
    device: 'Desktop - Chrome',
    status: 'Success',
    browser: 'Chrome 122',
    city: 'Lalitpur'
  },
];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination
  const totalItems = loginHistoryData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedHistory = loginHistoryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      // Ensure the authenticated user is an admin
      if (data.user?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      // Store JWT token for subsequent API calls
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      router.push('/admin');
    } catch {
      setError('Unable to connect to server. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('Desktop')) return <TbDeviceDesktop className="h-4 w-4" />;
    if (device.includes('Mobile')) return <TbDeviceMobile className="h-4 w-4" />;
    if (device.includes('Tablet')) return <TbDeviceTablet className="h-4 w-4" />;
    return <FaGlobe className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Success') {
      return (
        <Badge variant="default" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
          <FaCheckCircle className="mr-1.5 h-3 w-3" />
          Success
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
        <FaTimesCircle className="mr-1.5 h-3 w-3" />
        Failed
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-stone-50">
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 max-w-7xl mx-auto">
          
          {/* Left Side - Hero Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl hidden lg:block"
          >
            <div className="relative h-full min-h-[600px]">
              <Image 
                src="/images/artisan.jpg"
                fill
                className="object-cover"
                alt="Artisan working on traditional craft"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/70 to-primary-700/50" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center text-primary-900 text-2xl font-bold shadow-lg">
                    क
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-white tracking-wide">KALAKOSH</h3>
                    <p className="text-xs text-amber-200/80 tracking-[0.3em]">ADMIN CONSOLE</p>
                  </div>
                </div>

                {/* Hero Text */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Badge className="bg-amber-400/20 text-amber-100 border-amber-400/30 backdrop-blur-sm">
                      <FaShieldAlt className="mr-2 h-3 w-3" />
                      Secure Access
                    </Badge>
                  </div>
                  <h2 className="text-6xl font-serif font-light leading-[1.1] text-white">
                    Steward of
                    <br />
                    <span className="text-amber-300 font-medium italic">Heritage</span>
                  </h2>
                  <p className="max-w-sm text-white/80 text-lg leading-relaxed">
                    Oversee artisans, curate the catalog, and protect the integrity of Nepal's living craft.
                  </p>
                </div>

                {/* Footer */}
                <div className="text-sm text-white/60 border-t border-white/10 pt-4">
                  © KALAKOSH · कलाकोष — Authorized personnel only
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center"
          >
            <div className="w-full max-w-lg mx-auto">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      <IoShieldCheckmarkSharp className="mr-1.5 h-3.5 w-3.5" />
                      ADMIN PORTAL
                    </Badge>
                  </div>
                  <CardTitle className="text-4xl font-serif text-primary-900">
                    Sign in
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Restricted area. Authorized administrators only.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <CircleAlert className="h-4 w-4" />
                      <AlertTitle>Authentication Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Admin Email
                      </Label>
                      <div className="relative">
                        <FaRegEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <Link 
                          href="#" 
                          className="text-xs text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="remember"
                        checked={remember}
                        onCheckedChange={(checked) => setRemember(checked as boolean)}
                      />
                      <Label 
                        htmlFor="remember" 
                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                      >
                        Remember this device
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-primary-900 hover:bg-primary-800 text-white font-medium transition-all duration-300"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Authenticating...
                        </div>
                      ) : (
                        'Enter Admin Console'
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Not an admin?
                      <Link href="#" className="text-primary-600 hover:text-primary-700 font-medium ml-1 hover:underline">
                        User login
                      </Link>
                    </p>
                  </div>

                  <Separator className="my-6" />

                  <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-800 mb-2">
                      <HiOutlineInformationCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Demo credentials</span>
                    </div>
                    <div className="space-y-1 text-sm text-amber-700">
                      <p>Email: <span className="font-mono bg-amber-100/50 px-2 py-0.5 rounded">admin@kalakosh.com</span></p>
                      <p>Password: <span className="font-mono bg-amber-100/50 px-2 py-0.5 rounded">admin123</span></p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-center border-t border-border/50 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-muted-foreground hover:text-primary-700 gap-2"
                  >
                    <FaClock className="h-4 w-4" />
                    {showHistory ? 'Hide Login History' : 'View Login History'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Login History Dialog */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    <Card className="border shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-50 rounded-xl">
                              <FaHistory className="h-5 w-5 text-primary-700" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">Login History</CardTitle>
                              <CardDescription className="text-xs">
                                Recent login attempts
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {totalItems} entries
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-0">
                        <ScrollArea className="h-[300px]">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/50">
                                <TableHead className="text-xs font-medium">Time</TableHead>
                                <TableHead className="text-xs font-medium">Location</TableHead>
                                <TableHead className="text-xs font-medium">Device</TableHead>
                                <TableHead className="text-xs font-medium text-right">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedHistory.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No login history available
                                  </TableCell>
                                </TableRow>
                              ) : (
                                paginatedHistory.map((entry) => (
                                  <TableRow key={entry.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                      <div className="text-xs">
                                        <div className="font-medium">{entry.timestamp}</div>
                                        <div className="text-muted-foreground text-[10px] font-mono">{entry.ip}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="text-xs">
                                        <div className="font-medium">{entry.location}</div>
                                        <div className="text-muted-foreground text-[10px]">{entry.browser}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-2 text-xs">
                                        <span className="text-muted-foreground">
                                          {getDeviceIcon(entry.device)}
                                        </span>
                                        <span>{entry.device}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {getStatusBadge(entry.status)}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </CardContent>

                      {totalPages > 1 && (
                        <CardFooter className="border-t py-3">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(prev => Math.max(prev - 1, 1));
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
                                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                  }}
                                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </CardFooter>
                      )}
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}