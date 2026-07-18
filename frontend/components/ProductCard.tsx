import Image from "next/image";
import Link from "next/link";
import "./ProductCard.css";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    images?: string[];
    avg_rating?: number;
    region?: string;
    material?: string;
    stock?: number;
    vendor_id?: { _id: string; shop_name: string };
}

export default function ProductCard({ product }: { product: Product }) {
    const hasDiscount =
        product.discount_price !== undefined &&
        product.discount_price < product.price;

    const metaParts = [product.region, product.material].filter(Boolean);
    const mainImage = product.images?.[0] || "/images/placeholder.png";
    const effectivePrice = product.discount_price ?? product.price;

    return (
        <Link href={`/product/${product._id}`} className="product-card">
            <div className="image-box">
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="product-image"
                    sizes="(max-width: 460px) 100vw, (max-width: 700px) 50vw, (max-width: 992px) 33vw, 25vw"
                />
                {hasDiscount && <span className="discount-badge">Sale</span>}
                <WishlistButton productId={product._id} />
            </div>

            <div className="card-body">
                <div className="rating">
                    <span className="stars">★</span>
                    <span className="rating-num">
                        {product.avg_rating?.toFixed(1) ?? "New"}
                    </span>
                </div>

                <h3 className="product-name">{product.name}</h3>

                {metaParts.length > 0 && (
                    <p className="meta">{metaParts.join(" • ")}</p>
                )}

                <div className="card-footer">
                    <div className="price-group">
                        <span className="price-tag">
                            Rs. {effectivePrice.toLocaleString("en-IN")}
                        </span>
                        {hasDiscount && (
                            <span className="price-compare">
                                Rs. {product.price.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                    <AddToCartButton
                        productId={product._id}
                        name={product.name}
                        description={product.description}
                        image={mainImage}
                        price={effectivePrice}
                        originalPrice={hasDiscount ? product.price : undefined}
                        vendorName={product.vendor_id?.shop_name || "Kalakosh Artisan"}
                        stock={product.stock ?? Infinity}
                    />
                </div>
            </div>
        </Link>
    );
}