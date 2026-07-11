'use client';

import { useState } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaBorderAll,
  FaRegUser,
    FaStore,
  FaCube,
  FaTags,
  FaRegClipboard,
  //   FaTicket,
  FaRegStar,
  //   FaRegFileLines,
  FaGear,
  FaArrowRightFromBracket,
  //   FaTag,
  //   FaTruckFast,
  //   FaRegCircleQuestion,
  FaImage,        // ✅ For Banners
  FaUsers,        // ✅ For Customers
} from 'react-icons/fa6';
// import { IoShieldCheckmarkSharp } from "react-icons/io5";

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: FaBorderAll },
  { href: '/admin/users', label: 'Users', icon: FaRegUser },
  { href: '/admin/customers', label: 'Customers', icon: FaUsers },   // ✅ NEW
    { href: '/admin/vendors', label: 'Vendors', icon: FaStore },
  { href: '/admin/products', label: 'Products', icon: FaCube },
  { href: '/admin/categories', label: 'Categories', icon: FaTags },
  { href: '/admin/orders', label: 'Orders', icon: FaRegClipboard },
  { href: '/admin/banners', label: 'Banners', icon: FaImage },       // ✅ NEW
  { href: '/admin/reviews', label: 'Reviews', icon: FaRegStar },
  { href: '/admin/settings', label: 'Settings', icon: FaGear },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout?')) return;
    setIsLoggingOut(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore logout API errors
    }

    // Clear all stored auth data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.clear();
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    router.push('/admin/login');
  };

  return (
    <>
      {/* Top Bar */}
      {/* <div className="bg-primary-700 text-white/90 text-xs tracking-wide py-2 px-4 md:px-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <FaTag className="text-secondary-500" />
            FREE SHIPPING on orders above Rs. 5000 within Nepal
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="admin/orders" className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors">
              <FaTruckFast /> Track Order
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors">
              <FaRegCircleQuestion /> Help & Support
            </Link>
            <Link href="/admin/vendors" className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors">
              <FaStore /> Vendor
            </Link>
            <Link href="#" className="flex items-center gap-1.5 text-secondary-300 hover:text-secondary-200 transition-colors">
              <IoShieldCheckmarkSharp /> Admin
            </Link>
          </div>
        </div>
      </div> */}

      {/* Header */}
      {/* <header className="bg-warm-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3.5 no-underline">
              <div className="w-12 h-12 rounded-full bg-secondary-500 flex items-center justify-center overflow-hidden">
                <Image src="/images/logo.png" alt="Logo"
                height={100}
                width={100}
                className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-xl text-primary-700 font-bold uppercase leading-tight font-sans">KALAKOSH</h2>
                <p className="text-sm text-text-light leading-tight font-sans">कलाकोष</p>
              </div>
            </Link>

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
      </header> */}

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[290px_1fr] gap-8 p-4 md:p-8 pb-20 min-h-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMSAxIEwgMTEgMjEgTSAxIDExIEwgMjEgMTEiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]">

        {/* Sidebar */}
        <aside className="bg-[#F7F2EA] border border-border rounded-2xl p-6 h-fit sticky top-4">
          <div>
            <span className="text-text-light text-xs tracking-[0.2em]">CONTROL CENTER</span>
            <h2 className="font-serif text-primary-700 text-[44px] mt-1.5 font-semibold">Admin</h2>
          </div>

          <ul className="list-none mt-7">
            {/* Menu Items */}
            {menuItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.href} className={`rounded-2xl cursor-pointer mb-2 transition-colors ${isActive ? 'bg-primary-700' : 'hover:bg-primary-700/10'}`}>
                  <Link
                    href={item.href}
                    className={`h-13 flex items-center gap-3.5 px-4 rounded-2xl no-underline w-full transition-colors ${isActive ? 'text-white' : 'text-text-dark hover:text-primary-700'
                      }`}
                  >
                    <Icon className={isActive ? 'text-white' : ''} />
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {/* Divider */}
            <li className="mt-4 border-t border-border pt-4"></li>

            {/* Logout Button */}
            <li className="rounded-2xl cursor-pointer mb-2 transition-colors hover:bg-red-50">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="h-13 flex items-center gap-3.5 px-4 rounded-2xl no-underline w-full text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaArrowRightFromBracket />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <section className="min-h-screen">
          {children}
        </section>
      </div>

      {/* Footer */}
      {/* <footer className="bg-primary-700 text-white pt-[72px] relative overflow-hidden">
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
      </footer> */}
    </>
  );
}