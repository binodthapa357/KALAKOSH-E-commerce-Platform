'use client';

import { useState } from 'react';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
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
import { Separator } from "@/components/ui/separator";

import { 
  Mail, 
  Lock, 
  Clock, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet, 
  ShieldCheck, 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info,
  ArrowRight
} from "lucide-react";
import { fetchApi } from '@/lib/api';

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
  const itemsPerPage = 4;

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
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      // Ensure the authenticated user is an admin
      if (data.user?.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      // Store JWT token and session
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      } else {
        localStorage.setItem('adminToken', 'true');
      }
      localStorage.setItem('adminUser', JSON.stringify(data.user || { name: 'Admin', role: 'admin' }));
      document.cookie = `adminAuth=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      router.push('/admin');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('Desktop')) return <Monitor className="h-4 w-4 text-gray-500" />;
    if (device.includes('Mobile')) return <Smartphone className="h-4 w-4 text-gray-500" />;
    if (device.includes('Tablet')) return <Tablet className="h-4 w-4 text-gray-500" />;
    return <Globe className="h-4 w-4 text-gray-500" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Success') {
      return (
        <Badge variant="default" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-xs">
          <CheckCircle2 className="mr-1 h-3 w-3 text-green-600" />
          Success
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 text-xs">
        <XCircle className="mr-1 h-3 w-3 text-red-600" />
        Failed
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5efe7] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-8 bg-white rounded-3xl shadow-xl overflow-hidden border border-[#ead9c6]">
        
        {/* Left Side - Hero Brand Section */}
        <div className="relative p-10 lg:p-12 bg-gradient-to-br from-[#4a1e1a] to-[#2c1612] text-white flex flex-col justify-between min-h-[500px] overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d39a3f_1px,transparent_1px)] bg-[length:20px_20px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#d39a3f] flex items-center justify-center text-primary-950 text-2xl font-serif font-bold shadow-md">
                क
              </div>
              <div>
                <h3 className="font-serif text-2xl tracking-wider font-semibold">KALAKOSH</h3>
                <p className="text-[11px] text-[#e2c79d] tracking-[0.25em] uppercase">Admin Console</p>
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-medium border border-white/15 backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                <span>Encrypted Portal Access</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-serif font-medium leading-tight text-white">
                Steward of <br />
                <span className="italic text-[#f3cf99]">Living Heritage</span>
              </h2>
              <p className="text-sm text-white/80 leading-relaxed pt-2">
                Curate authentic Nepalese crafts, manage local artisan relations, and monitor platform orders.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/15 flex justify-between items-center text-xs text-white/60">
            <span>© KALAKOSH कलाकोष</span>
            <span>Authorized Personnel Only</span>
          </div>
        </div>

        {/* Right Side - Sign in Form */}
        <div className="p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#fdf3e7] text-[#7d1d1d] text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Gateway</span>
            </div>
            <h1 className="text-3xl font-serif font-semibold text-[#2c1612]">Sign in</h1>
            <p className="text-sm text-[#7d6d66] mt-1">Please enter your admin credentials to proceed</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 text-red-800 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-sm font-semibold">Authentication Error</AlertTitle>
              <AlertDescription className="text-xs mt-1">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#4a1e1a]">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kalakosh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-[#ead9c6] rounded-xl text-sm focus-visible:ring-[#7d1d1d]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-[#4a1e1a]">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-[#ead9c6] rounded-xl text-sm focus-visible:ring-[#7d1d1d]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2.5 pt-1">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked as boolean)}
              />
              <Label 
                htmlFor="remember" 
                className="text-xs font-normal text-[#6d5c55] cursor-pointer"
              >
                Keep me signed in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#7d1d1d] hover:bg-[#5c1515] text-white font-medium transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Demo info */}
          <div className="bg-[#fcf8f3] rounded-xl p-3.5 border border-[#ead9c6] mt-5">
            <div className="flex items-center gap-1.5 text-[#7d1d1d] text-xs font-semibold mb-1.5">
              <Info className="h-3.5 w-3.5" />
              <span>Demo Administrator Account</span>
            </div>
            <div className="text-xs text-[#6d5c55] flex flex-wrap gap-x-4 gap-y-1">
              <span>Email: <strong className="text-[#2c1612]">admin@kalakosh.com</strong></span>
              <span>Password: <strong className="text-[#2c1612]">admin123</strong></span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-[#7d6d66] hover:text-[#7d1d1d] gap-1.5 h-8"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{showHistory ? 'Hide Login Log' : 'View Security History'}</span>
            </Button>
          </div>

          {/* Login History */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="border border-[#ead9c6] rounded-xl p-3 bg-white text-xs">
                  <div className="font-semibold text-[#2c1612] mb-2 flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5 text-[#7d1d1d]" />
                    Recent Access Attempts
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {paginatedHistory.map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="font-medium text-[#2c1612]">{entry.timestamp}</div>
                          <div className="text-[10px] text-gray-500">{entry.location} • {entry.ip}</div>
                        </div>
                        {getStatusBadge(entry.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}