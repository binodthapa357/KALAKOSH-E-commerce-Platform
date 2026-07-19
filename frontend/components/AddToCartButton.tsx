"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  originalPrice?: number;
  vendorName: string;
  stock: number;
  className?: string;
}

export default function AddToCartButton({
  productId,
  name,
  description,
  image,
  price,
  originalPrice,
  vendorName,
  stock,
  className = '',
}: AddToCartButtonProps) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = () => {
    if (stock <= 0 || adding) return;
    setAdding(true);

    addToCart(
      { productId, name, description, image, price, originalPrice, vendorName, stock },
      1
    );

    router.push("/cart");
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={stock <= 0 || adding}
      className={className || "flex-1 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"}
    >
      {stock <= 0 ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}