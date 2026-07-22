"use client";

import { useApp } from "@/context/AppContext";
import { Heart } from "lucide-react";

interface ProductDetailWishlistButtonProps {
  product: any;
}

export default function ProductDetailWishlistButton({
  product,
}: ProductDetailWishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useApp();
  const active = isInWishlist(product._id);

  const handleToggle = () => {
    toggleWishlist(product);
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-3 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center ${
        active
          ? "border-red-200 bg-red-50 text-red-600 shadow-sm scale-105"
          : "border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 shadow-sm"
      }`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`w-5 h-5 transition-transform ${active ? "fill-current text-red-600 scale-110" : ""}`} />
    </button>
  );
}
