"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import { isLoggedIn, getRole } from "@/lib/auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const hideNavbar = pathname?.startsWith('/signin') || pathname?.startsWith('/signup') || pathname?.startsWith('/admin');
  
  if (hideNavbar) return null;

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      router.push("/signin");
      return;
    }

    const role = getRole();
    router.push(role === "vendor" ? "/vendor/dashboard" : "/dashboard");
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      router.push("/signin?redirect=/wishlist");
      return;
    }
    router.push("/wishlist");
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      router.push("/signin?redirect=/cart");
      return;
    }
    router.push("/cart");
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top Banner */}
      <div className="w-full bg-[#5C1A1A] text-white text-[11px] py-2 px-4 sm:px-8 flex justify-between items-center tracking-wide">
        <div>FREE SHIPPING on orders above Rs. 5000 within Nepal.</div>
        <div className="flex gap-6 items-center">
          <Link href="/track-order" className="hover:underline transition-all">
            📋 Track Order
          </Link>
          <Link href="/help" className="hover:underline transition-all">
            ❓ Help & Support
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between bg-[#FBF3E7] px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              sizes="(max-width:768px) 100px, 120px"
              className="object-contain"
            />
          </div>
          <span className="text-xl font-serif uppercase tracking-[0.15em] text-[#5C2E2E]">
            Kalakosh
          </span>
        </Link>

        <ul className="hidden gap-10 text-sm text-[#5C2E2E] md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition hover:text-[#8B3232]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5 text-[#5C2E2E]">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            onClick={handleWishlistClick}
          >
            <Heart className="h-5 w-5 hover:text-[#8B3232]" />
          </Link>
          <Link href="/cart" aria-label="Cart" onClick={handleCartClick}>
            <ShoppingBag className="h-5 w-5 hover:text-[#8B3232]" />
          </Link>
          <Link
            href="/signin"
            aria-label="Account"
            onClick={handleAccountClick}
          >
            <User className="h-5 w-5 hover:text-[#8B3232]" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
