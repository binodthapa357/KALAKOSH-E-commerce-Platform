"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import "./shop.css";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data.products ?? data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = products.filter((item) => {
    const price = item.discount_price ?? item.price;
    return price <= maxPrice;
  });

  return (
    <>
      {/* <Navbar /> */}
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
              <button onClick={() => setMaxPrice(5000)}>Clear All</button>
            </div>
            <hr />

            <div className="filter-group">
              <h4>CATEGORY</h4>
              {["Paintings", "Textiles", "Pottery", "Jewelry", "Wood Crafts"].map((c) => (
                <label key={c}><input type="checkbox" /> {c}</label>
              ))}
            </div>
            <hr />

            <div className="filter-group">
              <h4>PRICE RANGE</h4>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="price"><span>Rs. 0</span><span>Rs. {maxPrice}</span></div>
            </div>
            <hr />

            <div className="filter-group">
              <h4>REGION</h4>
              {["Kathmandu", "Patan", "Bhaktapur", "Lalitpur"].map((c) => (
                <label key={c}><input type="checkbox" /> {c}</label>
              ))}
            </div>
            <hr />

            <div className="filter-group">
              <h4>MATERIAL</h4>
              {["Cotton Canvas", "Brass Alloy", "Pashmina Wool", "Sterling Silver", "Clay"].map((c) => (
                <label key={c}><input type="checkbox" /> {c}</label>
              ))}
            </div>
          </aside>

          {/* PRODUCTS */}
          <main className="products">
            <div className="products-header">
              <div>
                <h2>Featured Products</h2>
                <p className="results">
                  {loading ? "Loading..." : `Showing ${visibleProducts.length} of ${products.length} treasures`}
                </p>
              </div>
              <select>
                <option>Sort by: Featured</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {loading && <p className="results">Loading products...</p>}
            {error && <p className="results">{error}</p>}
            {!loading && !error && visibleProducts.length === 0 && (
              <p className="results">No products match your filters.</p>
            )}

            {!loading && !error && visibleProducts.length > 0 && (
              <div className="product-grid">
                {visibleProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            )}
          </main>
        </section>
      </div>
      {/* <Footer /> */}
    </>
  );
}