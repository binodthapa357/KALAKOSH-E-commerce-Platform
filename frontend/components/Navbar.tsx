import React from 'react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Heart, ShoppingBag, User} from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/shop",
    label: "Shop",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

const Navbar = () => {
  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top Banner */}
      <div className="w-full bg-[#5C1A1A] text-white text-[11px] py-2 px-4 sm:px-8 flex justify-between items-center tracking-wide">
        <div>FREE SHIPPING on orders above Rs. 5000 within Nepal.</div>
        <div className="flex gap-6 items-center">
          <button className="hover:underline transition-all">📋 Track Order</button>
          <button className="hover:underline transition-all">❓ Help & Support</button>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between bg-[#FBF3E7] px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-full">
            <Image src="/images/logo.png" alt="Kalakosh logo" fill className="object-cover" />
          </div>
          <span className="text-lg font-serif uppercase tracking-[0.15em] text-[#5C2E2E]">
            Kalakosh
          </span>
        </Link>

        <ul className="hidden gap-10 text-sm text-[#5C2E2E] md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition hover:text-[#8B3232]">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5 text-[#5C2E2E]">
          <Link href="/wishlist" aria-label="Wishlist">
            <Heart className="h-5 w-5 hover:text-[#8B3232]" />
          </Link>
          <Link href="/cart" aria-label="Cart">
            <ShoppingBag className="h-5 w-5 hover:text-[#8B3232]" />
          </Link>
          <Link href="/user-profile" aria-label="Account">
            <User className="h-5 w-5 hover:text-[#8B3232]" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;