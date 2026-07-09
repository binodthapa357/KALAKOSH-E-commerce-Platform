import Link from "next/link";
import Image from "next/image";
import { Truck, FileText, Headphones, Heart, ShoppingBag, User } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-[#5C1A1A] px-6 py-2 text-xs text-white sm:px-10">
        <div className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5" />
          <span>FREE SHIPPING on orders above Rs. 5000 within Nepal</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/track-order" className="flex items-center gap-1.5 hover:underline">
            <FileText className="h-3.5 w-3.5" /> Track Order
          </Link>
          <Link href="/contact" className="flex items-center gap-1.5 hover:underline">
            <Headphones className="h-3.5 w-3.5" /> Help & Support
          </Link>
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