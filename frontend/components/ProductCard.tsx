import Image from "next/image";
import Link from "next/link";

interface Product {
    _id: string;
    name: string;
    price: number;
    discount_price?: number;
    images?: string[];
    avg_rating?: number;
    region?: string;
    material?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/product/${product._id}`} className="product-card">
            <div className="image-box">
                <Image
                    src={product.images?.[0] || "/images/placeholder.png"}
                    alt={product.name}
                    fill
                    className="product-image"
                />
                <button className="wish-btn" aria-label="Wishlist" onClick={(e) => e.preventDefault()}>♡</button>
            </div>
            <div className="card-body">
                <div className="rating">
                    <span className="stars">★</span>
                    <span className="rating-num">{product.avg_rating?.toFixed(1) ?? "New"}</span>
                </div>
                <h3>{product.name}</h3>
                <p className="meta">{product.region} • {product.material}</p>
                <div className="card-footer">
                    <span className="price-tag">Rs. {product.discount_price ?? product.price}</span>
                    <button className="add-btn" onClick={(e) => e.preventDefault()}>🛒 Add</button>
                </div>
            </div>
        </Link>
    );
}