"use client";

import { useApp } from "@/context/AppContext";

interface WishlistButtonProps {
  product: any;
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useApp();
  const active = isInWishlist(product._id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <button
      className={`wish-btn ${active ? "active" : ""}`}
      aria-label="Wishlist"
      onClick={handleToggleWishlist}
      style={{
        color: active ? "white" : "var(--primary)",
        backgroundColor: active ? "var(--primary)" : "rgba(255, 255, 255, 0.95)"
      }}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}