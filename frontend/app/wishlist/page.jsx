"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import "./wishlist.css";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="empty-wishlist-state">
          <span className="empty-wishlist-icon">♡</span>
          <h2>Your Wishlist is Empty</h2>
          <p>
            You haven't saved any handcrafted items to your wishlist yet.
            Browse our unique collections to save your favorites.
          </p>
          <Link href="/shop" className="shop-collection-btn">
            Explore Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-wrapper">
        <h1 className="wishlist-title">My Wishlist</h1>
        <p className="wishlist-subtitle">
          Keep track of your favorite artisan pieces from Nepal. Add them to your cart directly from here.
        </p>

        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div className="wishlist-card" key={item.id}>
              <div className="wishlist-image-box">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="wishlist-product-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <button
                  className="remove-wish-btn"
                  onClick={() => removeFromWishlist(item.id)}
                  aria-label="Remove from wishlist"
                >
                  ✕
                </button>
              </div>

              <div className="wishlist-card-body">
                <h3>{item.name}</h3>
                <p className="wishlist-meta">
                  {item.location} • {item.material}
                </p>
                <div className="wishlist-card-footer">
                  <span className="wishlist-price">{item.price}</span>
                  <button
                    className="wishlist-add-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    🛒 Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
