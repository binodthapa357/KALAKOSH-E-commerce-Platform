// app/shop/page.jsx
"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const products = [
  { id: 1, name: "Himalayan Landscape Painting", price: "$120", rating: 4.9, reviews: 128, location: "Kathmandu", material: "Cotton Canvas", image: "/images/product1.jpg" },
  { id: 2, name: "Handwoven Pashmina Shawl",     price: "$85",  rating: 4.8, reviews: 96,  location: "Patan",     material: "Pashmina Wool", image: "/images/product2.jpg" },
  { id: 3, name: "Traditional Clay Pot",         price: "$45",  rating: 4.7, reviews: 54,  location: "Bhaktapur", material: "Clay",          image: "/images/product3.jpg" },
  { id: 4, name: "Silver Mandala Necklace",      price: "$95",  rating: 4.9, reviews: 210, location: "Patan",     material: "Sterling Silver", image: "/images/product4.jpg" },
  { id: 5, name: "Wooden Buddha Sculpture",      price: "$150", rating: 5.0, reviews: 76,  location: "Bhaktapur", material: "Sal Wood",      image: "/images/product5.jpg" },
  { id: 6, name: "Dhaka Fabric",                 price: "$65",  rating: 4.6, reviews: 42,  location: "Kathmandu", material: "Cotton",        image: "/images/product6.jpg" },
  { id: 7, name: "Felt Handmade Bag",            price: "$70",  rating: 4.8, reviews: 88,  location: "Lalitpur",  material: "Wool Felt",     image: "/images/product7.jpg" },
  { id: 8, name: "Khukuri Knife",                price: "$110", rating: 4.9, reviews: 65,  location: "Bhojpur",   material: "Steel & Wood",  image: "/images/product8.jpg" },
];

export default function Shop() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="shop-page">
      {/* HERO */}
      <section className="shop-hero">
        <p className="hero-subtitle">— ALL TREASURES —</p>
        <h1>Shop the Collection</h1>
        <p className="hero-text">
          Every piece is handmade in Nepal by master artisans and ships worldwide with care.
        </p>
      </section>

      {/* CONTENT */}
      <section className="shop-content">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="filter-top">
            <h3>Filters</h3>
            <button>Clear All</button>
          </div>
          <hr />

          <div className="filter-group">
            <h4>CATEGORY</h4>
            {["Paintings","Textiles","Pottery","Jewelry","Wood Crafts"].map(c => (
              <label key={c}><input type="checkbox" /> {c}</label>
            ))}
          </div>
          <hr />

          <div className="filter-group">
            <h4>PRICE RANGE</h4>
            <input type="range" min="0" max="300" defaultValue="150" />
            <div className="price"><span>$0</span><span>$300</span></div>
          </div>
          <hr />

          <div className="filter-group">
            <h4>REGION</h4>
            {["Kathmandu","Patan","Bhaktapur","Lalitpur"].map(c => (
              <label key={c}><input type="checkbox" /> {c}</label>
            ))}
          </div>
          <hr />

          <div className="filter-group">
            <h4>MATERIAL</h4>
            {["Cotton Canvas","Brass Alloy","Pashmina Wool","Sterling Silver","Clay"].map(c => (
              <label key={c}><input type="checkbox" /> {c}</label>
            ))}
          </div>
        </aside>

        {/* PRODUCTS */}
        <main className="products">
          <div className="products-header">
            <div>
              <h2>Featured Products</h2>
              <p className="results">Showing {products.length} of 48 treasures</p>
            </div>
            <select defaultValue="Featured">
              <option value="Featured">Sort by: Featured</option>
              <option value="Newest">Newest</option>
              <option value="LowToHigh">Price: Low to High</option>
              <option value="HighToLow">Price: High to Low</option>
            </select>
          </div>

          <div className="product-grid">
            {products.map((item) => {
              const isWish = isInWishlist(item.id);
              return (
                <div className="product-card" key={item.id}>
                  <div className="image-box">
                    <Image src={item.image} alt={item.name} fill className="product-image" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" priority={item.id <= 4} />
                    <button 
                      className={`wish-btn ${isWish ? "active" : ""}`} 
                      aria-label="Wishlist"
                      onClick={() => toggleWishlist(item)}
                    >
                      {isWish ? "♥" : "♡"}
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="rating">
                      <span className="stars">★</span>
                      <span className="rating-num">{item.rating}</span>
                      <span className="rating-count">({item.reviews})</span>
                    </div>
                    <h3>{item.name}</h3>
                    <p className="meta">{item.location} • {item.material}</p>
                    <div className="card-footer">
                      <span className="price-tag">{item.price}</span>
                      <button 
                        className="add-btn" 
                        onClick={() => addToCart(item)}
                      >
                        🛒 Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </section>
    </div>
  );
}