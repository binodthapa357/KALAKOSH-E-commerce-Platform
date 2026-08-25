"use client";

import "./ProductCard.css";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

// Inline SVG icons — avoids react-icons version mismatch
const HeartIcon = ({ filled }: { filled: boolean }) =>
  filled ? (
    <svg viewBox="0 0 512 512" width="16" height="16" fill="#ef4444">
      <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
    </svg>
  ) : (
    <svg viewBox="0 0 512 512" width="16" height="16" fill="currentColor">
      <path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 198.8L259.4 441.5c-1.9 1.9-4.4 3.1-7.4 3.1-3 0-5.5-1.1-7.4-3.1L69.2 263.1c-40.4-41.2-47.1-112.1 7.8-160.8 35.1-29.5 87.9-36.6 130.3 9.7L256 174.1l48.7-62.1c42.4-46.2 95.1-39.3 130.3-9.7 54.9 48.7 48.2 119.6 7.8 160.8z" />
    </svg>
  );

const BagIcon = () => (
  <svg viewBox="0 0 448 512" width="14" height="14" fill="currentColor">
    <path d="M352 160v-32C352 57.3 294.7 0 224 0 153.3 0 96 57.3 96 128v32H0v304c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V160h-96zm-192-32c0-35.3 28.7-64 64-64s64 28.7 64 64v32H160v-32zm192 208c0 8.8-7.2 16-16 16H112c-8.8 0-16-7.2-16-16v-16c0-8.8 7.2-16 16-16h224c8.8 0 16 7.2 16 16v16z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 576 512" width="12" height="12" fill="#f59e0b">
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
  </svg>
);

interface Product {
  _id: string;
  name: string;
  price: number;
  discount_price?: number;
  images?: string[];
  avg_rating?: number;
  region?: string;
  material?: string;
  craft_type?: string;
  category_id?: { _id: string; name: string } | string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    toast[nextState ? "success" : "info"](
      nextState
        ? `Added "${product.name}" to wishlist!`
        : `Removed "${product.name}" from wishlist.`
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      toast.success(`"${product.name}" added to bag!`, {
        description: `Rs. ${product.discount_price ?? product.price}`,
      });
    }, 250);
  };

  const hasDiscount = Boolean(
    product.discount_price && product.discount_price < product.price
  );
  const displayPrice = product.discount_price ?? product.price;

  return (
    <Link href={`/product/${product._id}`} className="product-card group">
      {/* Image Section */}
      <div className="image-box">
        <Image
          src={product.images?.[0] || "/images/painting.jpg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="product-image"
        />
        {hasDiscount && (
          <span className="sale-badge">SALE</span>
        )}
        <button
          className={`wish-btn${isWishlisted ? " wishlisted" : ""}`}
          aria-label="Wishlist"
          onClick={toggleWishlist}
        >
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      {/* Info Section */}
      <div className="card-body">
        {/* Rating + Region row */}
        <div className="card-meta-row">
          <div className="rating-pill">
            <StarIcon />
            <span>{product.avg_rating ? product.avg_rating.toFixed(1) : "5.0"}</span>
          </div>
          {product.region && (
            <span className="region-label">{product.region.toUpperCase()}</span>
          )}
        </div>

        {/* Name */}
        <h3 className="card-title">{product.name}</h3>

        {/* Material */}
        <p className="card-material">
          {product.material || "Handmade Authentic Craft"}
        </p>

        {/* Price + Add footer */}
        <div className="card-footer">
          <div className="price-block">
            <span className="price-main">Rs. {displayPrice}</span>
            {hasDiscount && (
              <span className="price-orig">Rs. {product.price}</span>
            )}
          </div>
          <button
            className="add-btn"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <BagIcon />
            <span>{isAdding ? "Adding…" : "Add"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}