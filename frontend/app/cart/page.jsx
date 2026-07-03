"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import "./cart.css";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Helper to extract numeric price from string if numericPrice doesn't exist
  const getPriceNum = (item) => {
    if (typeof item.numericPrice === "number") return item.numericPrice;
    return parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + getPriceNum(item) * item.quantity,
    0
  );

  const shipping = subtotal === 0 ? 0 : subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart-state">
          <span className="empty-icon">🛒</span>
          <h2>Your Cart is Empty</h2>
          <p>
            You haven't added any Nepalese artisan treasures to your cart yet.
            Explore our curated collections to find something special.
          </p>
          <Link href="/shop" className="shop-now-btn">
            Shop the Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-wrapper">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <p className="cart-subtitle">
          Review your handcrafted items before checking out. Free worldwide shipping on orders over $150.
        </p>

        <div className="cart-layout">
          {/* ITEMS LIST */}
          <div className="cart-items-column">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div className="cart-item-card" key={item.id}>
                  <div className="cart-item-image">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="100px"
                    />
                  </div>

                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-meta">
                      {item.location} • {item.material}
                    </p>
                    <span className="cart-item-price">{item.price}</span>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Entire Cart
            </button>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? subtotal > 150
                    ? "Free"
                    : "$0.00"
                  : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <p style={{ fontSize: "12px", color: "#9a6b4d", margin: "10px 0" }}>
                Add <strong>${(150 - subtotal).toFixed(2)}</strong> more to get Free Shipping!
              </p>
            )}

            <div className="summary-row total">
              <span>Order Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() =>
                alert("Thank you for shopping! Checkout is not implemented in this demo.")
              }
            >
              Proceed to Secure Checkout
            </button>

            <div style={{ textAlign: "center" }}>
              <Link href="/shop" className="continue-shopping">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
