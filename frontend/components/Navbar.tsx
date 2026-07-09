"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const Navbar = () => {
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <div className="navbar-wrapper">
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <p className="top-bar-note">✦ Free shipping worldwide on orders over $150</p>
          <div className="top-bar-links">
            <a href="#">Track Order</a>
            <a href="#">Help & Support</a>
            <a href="#">Vendors</a>
            <a href="#">Admin</a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="site-header">
        {/* Left: Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="logo">
            <h2>KALAKOSH</h2>
            <span>कलाकोष</span>
          </div>
        </Link>
        
        {/* Middle: Main Navigation */}
        <nav className="main-nav">
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link href="/shop" className={pathname === "/shop" ? "active" : ""}>
            Shop
          </Link>
          <a href="#">Categories</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        {/* Right: Cart, Wishlist, Profile Icons */}
        <div className="header-actions">
          <Link href="/wishlist" className="header-action-btn" aria-label="Wishlist">
            <span className="icon">♡</span>
            {wishlistCount > 0 && <span className="header-action-badge">{wishlistCount}</span>}
          </Link>
          <Link href="/cart" className="header-action-btn" aria-label="Cart">
            <span className="icon">🛒</span>
            {cartCount > 0 && <span className="header-action-badge">{cartCount}</span>}
          </Link>
          <a href="#" className="header-action-btn" aria-label="Account">
            <span className="icon">👤</span>
          </a>
        </div>
      </header>

      <style jsx>{`
        .navbar-wrapper {
          width: 100%;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-action-btn {
          color: #4a1e1a;
          text-decoration: none;
          font-size: 18px;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          transition: all 0.2s ease;
          border: 1px solid #ead9c6;
          background: #fff;
        }
        .header-action-btn:hover {
          background-color: #ead9c6;
          transform: scale(1.05);
        }
        .header-action-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #c9974a;
          color: #fff;
          font-size: 10px;
          font-weight: bold;
          border-radius: 50%;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 1px solid #4a1e1a;
        }
        .icon {
          line-height: 1;
        }
      `}</style>
    </div>
   
  );
};

export default Navbar;