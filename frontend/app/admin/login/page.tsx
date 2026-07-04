'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Button, 
//   Input, 
//   Card, 
//   CardTitle, 
  Badge,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TablePagination
} from '@/app/components/ui';
import { 
  FaRegEnvelope, 
  FaLock, 
  FaTag, 
  FaTruckFast, 
  FaRegCircleQuestion, 
  FaStore,
  FaClock,
 
  FaGlobe,
  FaDesktop,
  FaMobile,
  FaTablet
} from 'react-icons/fa6';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoShieldCheckmarkSharp } from "react-icons/io5";

// Mock login history data
const loginHistoryData = [
  { 
    id: 1, 
    timestamp: '2024-03-15 14:23:45', 
    ip: '192.168.1.100', 
    location: 'Kathmandu, Nepal',
    device: 'Desktop - Chrome',
    status: 'Success',
    browser: 'Chrome 122'
  },
  { 
    id: 2, 
    timestamp: '2024-03-15 10:15:30', 
    ip: '192.168.1.101', 
    location: 'Pokhara, Nepal',
    device: 'Mobile - Safari',
    status: 'Success',
    browser: 'Safari 17'
  },
  { 
    id: 3, 
    timestamp: '2024-03-14 22:45:12', 
    ip: '192.168.1.102', 
    location: 'Lalitpur, Nepal',
    device: 'Tablet - Chrome',
    status: 'Failed',
    browser: 'Chrome 122'
  },
  { 
    id: 4, 
    timestamp: '2024-03-14 16:30:55', 
    ip: '192.168.1.103', 
    location: 'Kathmandu, Nepal',
    device: 'Desktop - Firefox',
    status: 'Success',
    browser: 'Firefox 123'
  },
  { 
    id: 5, 
    timestamp: '2024-03-14 09:20:18', 
    ip: '192.168.1.104', 
    location: 'Bhaktapur, Nepal',
    device: 'Mobile - Chrome',
    status: 'Success',
    browser: 'Chrome 122'
  },
  { 
    id: 6, 
    timestamp: '2024-03-13 20:10:45', 
    ip: '192.168.1.105', 
    location: 'Kathmandu, Nepal',
    device: 'Desktop - Edge',
    status: 'Failed',
    browser: 'Edge 122'
  },
  { 
    id: 7, 
    timestamp: '2024-03-13 14:55:33', 
    ip: '192.168.1.106', 
    location: 'Pokhara, Nepal',
    device: 'Tablet - Safari',
    status: 'Success',
    browser: 'Safari 17'
  },
  { 
    id: 8, 
    timestamp: '2024-03-12 11:40:22', 
    ip: '192.168.1.107', 
    location: 'Lalitpur, Nepal',
    device: 'Desktop - Chrome',
    status: 'Success',
    browser: 'Chrome 122'
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
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

      if (cleanEmail === 'admin@kalakosh.com' && cleanPassword === 'admin123') {
        // Success - add to history
        const newLogin = {
          id: loginHistoryData.length + 1,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          ip: '192.168.1.100',
          location: 'Kathmandu, Nepal',
          device: 'Desktop - Chrome',
          status: 'Success',
          browser: 'Chrome 122'
        };
        loginHistoryData.unshift(newLogin);
        
        localStorage.setItem('adminAuth', 'true');
        router.push('/admin');
      } else {
        // Failed - add to history
        const failedLogin = {
          id: loginHistoryData.length + 1,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          ip: '192.168.1.100',
          location: 'Kathmandu, Nepal',
          device: 'Desktop - Chrome',
          status: 'Failed',
          browser: 'Chrome 122'
        };
        loginHistoryData.unshift(failedLogin);
        
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('Desktop')) return <FaDesktop className="text-sm" />;
    if (device.includes('Mobile')) return <FaMobile className="text-sm" />;
    if (device.includes('Tablet')) return <FaTablet className="text-sm" />;
    return <FaGlobe className="text-sm" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Success') {
      return <Badge variant="success"><FaCheckCircle className="mr-1" /> Success</Badge>;
    }
    return <Badge variant="danger"><FaTimesCircle className="mr-1" /> Failed</Badge>;
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-700 text-white/90 text-xs tracking-wide py-2 px-4 md:px-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <FaTag className="text-secondary-500" />
            FREE SHIPPING on orders above Rs. 5000 within Nepal
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#" className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors">
              <FaTruckFast /> Track Order
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors">
              <FaRegCircleQuestion /> Help & Support
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors">
              <FaStore /> Vendor
            </Link>
            <Link href="/admin/login" className="flex items-center gap-1.5 text-secondary-300 hover:text-secondary-200 transition-colors">
              <IoShieldCheckmarkSharp /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-warm-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3.5 no-underline">
              <div className="w-12 h-12 rounded-full bg-secondary-500 flex items-center justify-center overflow-hidden">
                <Image src="/images/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-xl text-primary-700 font-bold uppercase leading-tight font-sans">KALAKOSH</h2>
                <p className="text-sm text-text-light leading-tight font-sans">कलाकोष</p>
              </div>
            </Link>

            <nav className="hidden lg:block">
              <ul className="flex gap-11 list-none">
                <li><Link href="#" className="text-text-mid text-sm font-medium hover:text-primary-700 transition-colors">Home</Link></li>
                <li><Link href="#" className="text-text-mid text-sm font-medium hover:text-primary-700 transition-colors">Shop</Link></li>
                <li><Link href="#" className="text-text-mid text-sm font-medium hover:text-primary-700 transition-colors">Categories</Link></li>
                <li><Link href="#" className="text-text-mid text-sm font-medium hover:text-primary-700 transition-colors">About</Link></li>
                <li><Link href="#" className="text-text-mid text-sm font-medium hover:text-primary-700 transition-colors">Contact</Link></li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <Button className="border-none bg-transparent text-xl cursor-pointer text-text-dark hover:text-primary-700 transition-colors">
                <i className="fa-regular fa-heart"></i>
              </Button>
              <Button className="border-none bg-transparent text-xl cursor-pointer text-text-dark hover:text-primary-700 transition-colors">
                <i className="fa-solid fa-bag-shopping"></i>
              </Button>
              <Button className="border-none bg-transparent text-xl cursor-pointer text-text-dark hover:text-primary-700 transition-colors">
                <i className="fa-regular fa-user"></i>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login */}
      <main className="grid md:grid-cols-[1.08fr_1fr] min-h-190">
        {/* Left Side - Hero */}
        <div className="relative overflow-hidden hidden md:block">
          <Image src="/images/artisian1.jpg" alt="artisan image" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-700/82 to-primary-700/88 z-10"></div>
          <div className="absolute inset-0 z-20 p-12 flex flex-col justify-between text-white">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-secondary-500 flex items-center justify-center text-primary-700 text-2xl font-bold">क</div>
              <div>
                <h3 className="font-serif text-3xl tracking-wide">KALAKOSH</h3>
                <span className="text-xs tracking-[0.3em]">ADMIN CONSOLE</span>
              </div>
            </div>
            <div className="mt-auto mb-[270px]">
              <h2 className="text-7xl font-serif leading-[0.95] font-medium mb-7">
                Steward of <br />
                <span className="text-secondary-300 italic">Heritage</span>
              </h2>
              <p className="max-w-130 leading-relaxed text-white/90 text-xl">
                Oversee artisans, curate the catalog, and protect the integrity of Nepal's living craft.
              </p>
            </div>
            <div className="text-sm text-white/80">© KALAKOSH · कलाकोष — Authorized personnel only</div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-[#FBF7F0] flex items-start justify-center relative p-5 overflow-y-auto">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[length:22px_22px] opacity-30"></div>
          
          <div className="w-full max-w-[470px] relative z-10 py-8">
            {/* Login Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
              <div className="inline-flex items-center gap-2 bg-[#EBD7B4] text-primary-700 px-4 py-2 rounded-full text-xs tracking-[0.18em] mb-6">
                <IoShieldCheckmarkSharp /> ADMIN PORTAL
              </div>
              <h1 className="font-serif text-5xl text-primary-700 font-medium mb-2">Sign in</h1>
              <p className="text-text-light mb-6 text-sm">Restricted area. Authorized administrators only.</p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 text-text-dark text-sm font-medium">Admin Email</label>
                  <div className="h-12 border border-border bg-white rounded-[18px] px-4 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-primary-400">
                    <FaRegEnvelope className="text-text-light" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-none outline-none w-full text-sm text-text-mid bg-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-text-dark text-sm font-medium">Password</label>
                  <div className="h-12 border border-border bg-white rounded-[18px] px-4 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-primary-400 focus-within:border-primary-400">
                    <FaLock className="text-text-light" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-none outline-none w-full text-sm text-text-mid bg-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 text-sm text-text-light cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="accent-primary-700"
                    />
                    Remember this device
                  </label>
                  <Link href="#" className="text-primary-700 text-sm hover:underline">Forgot password?</Link>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={loading}
                  className="h-12 text-base"
                >
                  Enter Admin Console
                </Button>
              </form>

              <div className="text-center mt-4 text-text-light text-sm">
                Not an admin?
                <Link href="#" className="text-primary-700 font-semibold hover:underline ml-1">User login</Link>
              </div>

              <div className="mt-4 p-3 bg-[#F3E7D3] rounded-xl">
                <h4 className="text-primary-700 font-semibold text-sm">Demo credentials</h4>
                <p className="text-xs text-text-mid mt-1">Email: admin@kalakosh.com</p>
                <p className="text-xs text-text-mid">Password: admin123</p>
              </div>
            </div>

            {/* View History Button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-center gap-2 text-text-light hover:text-primary-700 transition-colors text-sm py-2"
            >
              <FaClock />
              {showHistory ? 'Hide Login History' : 'View Login History'}
            </button>

            {/* Login History Table */}
            {showHistory && (
              <div className="mt-4 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-serif text-xl text-primary-700">Login History</h3>
                  <p className="text-text-light text-xs">Recent login attempts</p>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHead>
                      <tr>
                        <TableHeader>Time</TableHeader>
                        <TableHeader>Location</TableHeader>
                        <TableHeader>Device</TableHeader>
                        <TableHeader>Status</TableHeader>
                      </tr>
                    </TableHead>
                    <TableBody>
                      {paginatedHistory.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-text-light">
                            No login history available
                          </td>
                        </tr>
                      ) : (
                        paginatedHistory.map((entry, index) => (
                          <TableRow key={entry.id} striped hover index={index}>
                            <TableCell>
                              <div className="text-xs">
                                <div className="font-medium text-text-dark">{entry.timestamp}</div>
                                <div className="text-text-light text-xs">{entry.ip}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{entry.location}</div>
                                <div className="text-text-light text-xs">{entry.browser}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                {getDeviceIcon(entry.device)}
                                <span>{entry.device}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(entry.status)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-700 text-white pt-[72px] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-1.5">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary-500 flex items-center justify-center text-primary-700 text-xl font-bold">क</div>
              <div>
                <h3 className="font-serif text-4xl">KALAKOSH</h3>
                <span className="text-sm opacity-80">कला कोष</span>
              </div>
            </div>
            <p className="leading-relaxed text-white/80 max-w-[300px]">
              A platform dedicated to preserving and promoting authentic Nepali handicrafts worldwide.
            </p>
            <div className="flex gap-3.5 mt-6">
              <Link href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <i className="fa-brands fa-facebook-f"></i>
              </Link>
              <Link href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <i className="fa-brands fa-instagram"></i>
              </Link>
              <Link href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <i className="fa-brands fa-youtube"></i>
              </Link>
              <Link href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <i className="fa-brands fa-twitter"></i>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-secondary-300 font-serif text-3xl mb-5 font-medium">Categories</h4>
            <ul className="list-none space-y-3.5">
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Paintings</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Textiles</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Pottery</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Jewelry</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Wood Crafts</li>
            </ul>
          </div>

          <div>
            <h4 className="text-secondary-300 font-serif text-3xl mb-5 font-medium">Customer Service</h4>
            <ul className="list-none space-y-3.5">
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">About Us</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Contact Us</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Track Order</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Shipping & Delivery</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Returns & Refunds</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-secondary-300 font-serif text-3xl mb-5 font-medium">Quick Links</h4>
            <ul className="list-none space-y-3.5">
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">My Account</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Wishlist</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Cart</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Terms & Conditions</li>
              <li className="text-white/90 cursor-pointer hover:text-white transition-colors">Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-secondary-300 font-serif text-3xl mb-5 font-medium">Contact Us</h4>
            <ul className="list-none space-y-3.5">
              <li className="flex items-center gap-3 text-white/90">
                <i className="fa-solid fa-phone"></i> +977 1 1234567
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <i className="fa-regular fa-envelope"></i> info@kalakosh.com
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <i className="fa-solid fa-location-dot"></i> Kathmandu, Nepal
              </li>
            </ul>
            <div className="flex gap-2.5 mt-7 flex-wrap">
              <span className="bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full">eSewa</span>
              <span className="bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full">Khalti</span>
              <span className="bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full">VISA</span>
              <span className="bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full">MC</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-6 text-sm text-white/70">
          © 2024 KALAKOSH. All rights reserved.
        </div>
      </footer>
    </>
  );
}