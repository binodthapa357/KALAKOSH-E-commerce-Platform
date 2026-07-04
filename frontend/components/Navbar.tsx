import React from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top Banner */}
      <div className="w-full bg-[#5C1A1A] text-white text-[11px] py-2 px-4 sm:px-8 flex justify-between items-center tracking-wide">
        <div>🚚 FREE SHIPPING on orders above Rs. 5000 within Nepal.</div>
        <div className="flex gap-6 items-center">
          <button className="hover:underline transition-all">📋 Track Order</button>
          <button className="hover:underline transition-all">❓ Help & Support</button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        {/* Brand Text Logo */}
       <Link href="/" className="text-2xl font-serif tracking-widest text-[#5C2E2E] font-bold cursor-pointer select-none hover:text-[#8B3232] transition-colors">
       
        <div className="text-2xl font-serif tracking-widest text-[#5C2E2E] font-bold cursor-pointer select-none">
          KALAKOSH
        </div></Link>

        {/* Links */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-[#5C2E2E]">
        <Link href="/" className="hover:text-[#8B3232] transition-colors">
          <li className="cursor-pointer hover:text-[#8B3232] transition-colors">Home</li>
        </Link>
          <Link href="/shop" className="hover:text-[#8B3232] transition-colors">
          <li className="cursor-pointer hover:text-[#8B3232] transition-colors">Shop</li>
          </Link>
          <Link href="/about" className="hover:text-[#8B3232] transition-colors">
          <li className="cursor-pointer hover:text-[#8B3232] transition-colors">About</li>
          </Link>
          <Link href="/contact" className="hover:text-[#8B3232] transition-colors">
          <li className="cursor-pointer hover:text-[#8B3232] transition-colors">Contact</li>
          </Link>
        </ul>

        {/* Icon Action Group */}
        <div className="flex items-center gap-5 text-[#5C2E2E]">
          <Button className="p-1 hover:text-[#8B3232] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </Button>
          <Button className="p-1 hover:text-[#8B3232] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </Button>
        <Link href="/user-profile" className="hover:text-[#8B3232] transition-colors">
          <Button className="p-1 hover:text-[#8B3232] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </Button>
        </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;