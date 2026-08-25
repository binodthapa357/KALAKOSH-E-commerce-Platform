"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
}: AddToCartButtonProps) {
  const router = useRouter();

  const [status, setStatus] = useState<"idle" | "added">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (stock <= 0) return;

    addToCart(
      {
        productId,
        name,
        description,
        image,
        price,
        originalPrice,
        vendorName,
        stock,
      },
      1
    );

    setStatus("added");

    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
    }, 1000);

    // Open product details page
    router.push(`/product/${productId}`);
  };

  return (
    <button
      className="add-btn"
      aria-label={status === "added" ? "Added to cart" : "Add to cart"}
      onClick={handleAddToCart}
      disabled={stock <= 0}
    >
      {stock <= 0
        ? "Out of Stock"
        : status === "added"
        ? "✓ Added"
        : "🛒 Add"}
    </button>
  );
}