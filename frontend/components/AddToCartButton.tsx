"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";

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
  const { addToCart } = useApp();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock <= 0 || adding) return;
    setAdding(true);

    try {
      const productObj = {
        _id: productId,
        name,
        description: description || "",
        price: originalPrice ?? price,
        discount_price: originalPrice ? price : undefined,
        category_id: "",
        vendor_id: { _id: "", shop_name: vendorName },
        stock,
        region: "Unknown",
        material: "Handmade",
        craft_type: "Nepalese Handicraft",
        images: [image],
        avg_rating: 5,
      };

      await addToCart(productObj as any, 1);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={stock <= 0 || adding}
      className={className || "flex-1 bg-[#8B3232] hover:bg-[#722828] text-white font-semibold py-3 px-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"}
    >
      {stock <= 0 ? "Out of Stock" : adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}