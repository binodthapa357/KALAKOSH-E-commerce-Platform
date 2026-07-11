// app/product/[id]/page.tsx
import "./product.css";
import type { Product } from "@/types";

interface ProductPageProps {
  params: { id: string };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.product ?? null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  return {
    title: product ? `${product.name} | KALAKOSH` : "Product | KALAKOSH",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-not-found">
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.discount_price !== undefined &&
    product.discount_price < product.price;

  const metaParts = [product.region, product.material].filter(Boolean);

  return (
    <div className="product-page">
      <div className="product-detail">
        {/* IMAGE */}
        <div className="product-detail-image-wrap">
          {product.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <div className="product-detail-image-fallback">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="product-detail-info">
          {product.category?.name && (
            <p className="product-detail-category">{product.category.name}</p>
          )}

          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-rating">
            <span className="stars">★</span>
            <span className="rating-num">
              {product.avg_rating?.toFixed(1) ?? "New"}
            </span>
          </div>

          {metaParts.length > 0 && (
            <p className="product-detail-meta">{metaParts.join(" • ")}</p>
          )}

          <div className="product-detail-price-row">
            <span className="product-detail-price">
              Rs. {(product.discount_price ?? product.price).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="product-detail-compare-price">
                Rs. {product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {product.description && (
            <p className="product-detail-description">{product.description}</p>
          )}

          <p className="product-detail-stock">
            {product.stock && product.stock > 0
              ? `In stock (${product.stock} available)`
              : "Out of stock"}
          </p>

          <button className="product-detail-cta" disabled={!product.stock}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}