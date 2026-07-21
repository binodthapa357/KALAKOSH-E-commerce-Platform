"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useApp();

  const handleRemove = (product: any) => {
    toggleWishlist(product);
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">Wishlist</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-border pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary-800 tracking-wide">
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-2">
              Save your favorite Nepalese handicrafts and track them here.
            </p>
          </div>
          <span className="text-sm font-semibold text-primary-700 mt-2 md:mt-0">
            {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border shadow-sm px-4 text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-6 text-primary-500 animate-pulse">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
              Explore our collection of authentic, handcrafted masterpieces from Nepalese artisans and save your favorites here.
            </p>
            <Link
              href="/shop"
              className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((product) => {
              const mainImage = product.images?.[0] || "/placeholder.svg";
              const hasDiscount =
                product.discount_price !== undefined &&
                product.discount_price < product.price;
              const effectivePrice = product.discount_price ?? product.price;

              return (
                <div
                  key={product._id}
                  className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                >
                  {/* Remove Button overlay */}
                  <button
                    onClick={() => handleRemove(product)}
                    className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 hover:bg-red-50 text-muted-foreground hover:text-red-600 rounded-full flex items-center justify-center shadow-sm transition-all border border-border"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Image link */}
                  <Link
                    href={`/product/${product._id}`}
                    className="relative block aspect-square bg-muted overflow-hidden"
                  >
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {hasDiscount && (
                      <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        Sale
                      </span>
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-secondary-500 mb-2">
                        <span className="text-sm">★</span>
                        <span className="text-xs font-semibold text-foreground">
                          {product.avg_rating?.toFixed(1) ?? "New"}
                        </span>
                      </div>

                      <Link
                        href={`/product/${product._id}`}
                        className="font-serif text-lg font-bold text-foreground hover:text-primary-700 line-clamp-1 mb-1 transition-all"
                      >
                        {product.name}
                      </Link>

                      <p className="text-xs text-muted-foreground mb-3 font-medium">
                        {product.region} • {product.material}
                      </p>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold text-primary-700">
                          Rs. {effectivePrice.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-muted-foreground line-through">
                            Rs. {product.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border mt-auto">
                      <AddToCartButton
                        productId={product._id}
                        name={product.name}
                        description={product.description}
                        image={mainImage}
                        price={effectivePrice}
                        originalPrice={hasDiscount ? product.price : undefined}
                        vendorName={
                          typeof product.vendor_id === "object"
                            ? product.vendor_id?.shop_name
                            : "Kalakosh Artisan"
                        }
                        stock={product.stock ?? 10}
                        className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2.5 px-4 rounded-full transition-all text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
