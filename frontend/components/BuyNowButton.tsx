"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { isLoggedIn } from "@/lib/auth";
import { toast } from "sonner";

interface BuyNowButtonProps {
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

export default function BuyNowButton({
  productId,
  name,
  description,
  image,
  price,
  originalPrice,
  vendorName,
  stock,
  className = '',
}: BuyNowButtonProps) {
  const router = useRouter();
  const { addToCart, cart } = useApp();
  const [buying, setBuying] = useState(false);

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock <= 0 || buying) return;
    setBuying(true);

    try {
      // Check if item is already in cart
      const inCart = cart.some(item => item.product && item.product._id === productId);
      if (!inCart) {
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
      }

      // Check if logged in
      if (!isLoggedIn()) {
        toast.info("Please sign in to complete your purchase");
        router.push(`/signin?redirect=/checkout`);
      } else {
        router.push("/checkout");
      }
    } catch (err) {
      console.error("Error in Buy Now:", err);
    } finally {
      setBuying(false);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={stock <= 0 || buying}
      className={className || "flex-1 bg-[#D87D4A] hover:bg-[#c9713e] text-white font-semibold py-3 px-6 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"}
    >
      {stock <= 0 ? "Out of Stock" : buying ? "Processing..." : "Buy Now"}
    </button>
  );
}
