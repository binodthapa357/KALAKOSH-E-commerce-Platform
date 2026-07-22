"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart } = useApp();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const changeQuantity = (productId: string, quantity: number) => {
    updateCartQuantity(productId, quantity);
  };

  const remove = (productId: string) => {
    removeFromCart(productId);
  };

  const items = cart
    .filter((item) => item && item.product)
    .map((item) => {
      const p = item.product;
      const hasDiscount =
        p.discount_price !== undefined && p.discount_price < p.price;
      const effectivePrice = p.discount_price ?? p.price;
      const originalPrice = hasDiscount ? p.price : undefined;

      return {
        productId: p._id,
        name: p.name,
        description: p.description,
        image: p.images?.[0] || "/placeholder.svg",
        price: effectivePrice,
        originalPrice: originalPrice,
        vendorName:
          typeof p.vendor_id === "object" && p.vendor_id
            ? p.vendor_id.shop_name
            : "Kalakosh Artisan",
        stock: p.stock ?? Infinity,
        quantity: item.quantity,
      };
    });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Cart</span>
        </nav>

        <h1 className="text-3xl font-serif font-bold text-primary-800 mb-2">
          Your Cart
        </h1>
        <p className="text-muted-foreground mb-8">
          {itemCount === 0
            ? "Your cart is empty."
            : `${itemCount} item${itemCount === 1 ? "" : "s"} in your cart.`}
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              href="/shop"
              className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-full transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 border border-border rounded-xl"
                >
                  <Link
                    href={`/shop/${item.productId}`}
                    className="relative w-28 h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link
                        href={`/shop/${item.productId}`}
                        className="font-semibold text-foreground hover:text-primary-700 line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        by {item.vendorName}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      <div className="flex items-center gap-3 border border-border rounded-full px-2 py-1">
                        <button
                          onClick={() =>
                            changeQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted text-foreground"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            changeQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-primary-700">
                            Rs.{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                          {item.originalPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              Rs.{" "}
                              {(
                                item.originalPrice * item.quantity
                              ).toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => remove(item.productId)}
                          className="text-sm text-red-600 hover:underline"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/shop"
                className="inline-block text-sm text-secondary-500 hover:underline mt-2"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div className="h-fit border border-border rounded-xl p-6">
              <h2 className="text-xl font-serif font-bold text-primary-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
                  </span>
                  <span className="font-medium text-foreground">
                    Rs. {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary-700">
                    Rs. {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full mt-6 bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 rounded-full transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}