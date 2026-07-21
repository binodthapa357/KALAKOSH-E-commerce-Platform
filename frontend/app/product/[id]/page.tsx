import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ProductDetailWishlistButton from "@/components/ProductDetailWishlistButton";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface Review {
  _id: string;
  user_id: { name: string; email: string };
  rating: number;
  comment?: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category_id: { _id: string; name: string; slug?: string };
  vendor_id: { _id: string; shop_name: string };
  stock: number;
  region: string;
  material: string;
  craft_type: string;
  images: string[];
  avg_rating: number;
  status: string;
  createdAt: string;
  reviews?: Review[];
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-primary-700">
          Product not found
        </h1>
        <Link href="/shop" className="text-secondary-500 underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const mainImage = product.images?.[0] || "/placeholder.svg";
  const galleryImages = product.images?.slice(1) || [];
  const discountPrice = product.discount_price;
  const hasDiscount =
    discountPrice !== undefined && discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - discountPrice) / product.price) * 100)
    : 0;
  const reviews = product.reviews || [];
  const effectivePrice = hasDiscount ? discountPrice! : product.price;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-primary-700">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ===== IMAGE GALLERY ===== */}
          <div>
            <div className="relative w-full h-96 lg:h-[500px] rounded-xl overflow-hidden bg-muted mb-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {galleryImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto">
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== PRODUCT INFO ===== */}
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary-800 mb-2">
              {product.name}
            </h1>

            {/* Rating + Stock */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-secondary-500">
                <span className="text-lg">★</span>
                <span className="font-semibold text-foreground">
                  {product.avg_rating?.toFixed(1)}
                </span>
              </div>
              <span className="text-muted-foreground">
                ({reviews.length} reviews)
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                  product.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary-700">
                    Rs. {discountPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    Rs. {product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded">
                    -{discountPercent}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-primary-700">
                  Rs. {product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Region / Material / Craft Type Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-xl">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Region
                </span>
                <p className="font-medium text-foreground">{product.region}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Material
                </span>
                <p className="font-medium text-foreground">
                  {product.material}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Craft Type
                </span>
                <p className="font-medium text-foreground">
                  {product.craft_type}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Category
                </span>
                <p className="font-medium text-foreground">
                  {product.category_id?.name}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Artisan
                </span>
                <p className="font-medium text-foreground">
                  {product.vendor_id?.shop_name || "Kalakosh Artisan"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Stock
                </span>
                <p className="font-medium text-foreground">
                  {product.stock} pieces
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <AddToCartButton
                productId={product._id}
                name={product.name}
                description={product.description}
                image={mainImage}
                price={effectivePrice}
                originalPrice={hasDiscount ? product.price : undefined}
                vendorName={product.vendor_id?.shop_name || "Kalakosh Artisan"}
                stock={product.stock}
              />
              <ProductDetailWishlistButton product={product} />
            </div>
          </div>
        </div>

        {/* ===== REVIEWS SECTION ===== */}
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-primary-800 mb-6">
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 border border-border rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {review.user_id?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {review.user_id?.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-secondary-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-muted-foreground mt-2">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}