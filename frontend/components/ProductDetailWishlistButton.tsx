"use client";

import { useApp } from "@/context/AppContext";

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
      className={`flex-1 border-2 font-semibold py-3 px-6 rounded-full transition-colors cursor-pointer ${
        active
          ? "border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700"
          : "border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white"
      }`}
    >
      {active ? "♥ In Wishlist" : "♡ Add to Wishlist"}
    </button>
  );
}
