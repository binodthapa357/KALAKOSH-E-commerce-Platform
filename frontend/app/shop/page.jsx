"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState, useCallback } from "react";
import "./shop.css";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["Paintings", "Textiles", "Pottery", "Jewelry", "Wood Crafts"];
const REGIONS = ["Kathmandu", "Patan", "Bhaktapur", "Lalitpur"];
const MATERIALS = ["Cotton Canvas", "Brass Alloy", "Pashmina Wool", "Sterling Silver", "Clay"];
const SORT_OPTIONS = [
  { label: "Sort by: Featured", value: "" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("");

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedRegion) params.set("region", selectedRegion);
    if (selectedMaterial) params.set("material", selectedMaterial);
    if (maxPrice < 5000) params.set("maxPrice", String(maxPrice));
    if (sort) params.set("sort", sort);
    return params.toString();
  }, [selectedCategory, selectedRegion, selectedMaterial, maxPrice, sort]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQuery();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products${qs ? "?" + qs : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data.products ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [buildQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedRegion("");
    setSelectedMaterial("");
    setMaxPrice(5000);
    setSort("");
  };

  const toggleFilter = (value, current, setter) => {
    setter(value === current ? "" : value);
  };

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
              <button onClick={clearFilters}>Clear All</button>
            </div>
            <hr />

            <div className="filter-group">
              <h4>CATEGORY</h4>
              {CATEGORIES.map((c) => (
                <label key={c}>
                  <input
                    type="checkbox"
                    checked={selectedCategory === c}
                    onChange={() => toggleFilter(c, selectedCategory, setSelectedCategory)}
                  /> {c}
                </label>
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
              {REGIONS.map((r) => (
                <label key={r}>
                  <input
                    type="checkbox"
                    checked={selectedRegion === r}
                    onChange={() => toggleFilter(r, selectedRegion, setSelectedRegion)}
                  /> {r}
                </label>
              ))}
            </div>
            <hr />

            <div className="filter-group">
              <h4>MATERIAL</h4>
              {MATERIALS.map((m) => (
                <label key={m}>
                  <input
                    type="checkbox"
                    checked={selectedMaterial === m}
                    onChange={() => toggleFilter(m, selectedMaterial, setSelectedMaterial)}
                  /> {m}
                </label>
              ))}
            </div>
          </aside>

          {/* PRODUCTS */}
          <main className="products">
            <div className="products-header">
              <div>
                <h2>Featured Products</h2>
                <p className="results">
                  {loading ? "Loading..." : `Showing ${products.length} treasures`}
                </p>
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {loading && <p className="results">Loading products...</p>}
            {error && <p className="results">{error}</p>}
            {!loading && !error && products.length === 0 && (
              <p className="results">No products match your filters.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="product-grid">
                {products.map((item) => (
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