"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "./shop.css";
import ProductCard from "@/components/ProductCard";
import { fetchApi } from "@/lib/api";

// Inline SVG icons — avoids react-icons version mismatch
const FaSearch = () => (
  <svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/>
  </svg>
);
const FaTimes = () => (
  <svg viewBox="0 0 352 512" width="1em" height="1em" fill="currentColor">
    <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/>
  </svg>
);
const FaSlidersH = () => (
  <svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
    <path d="M496 384H160v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h80v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h336c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160h-80v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h336v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h80c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16C7.2 64 0 71.2 0 80v32c0 8.8 7.2 16 16 16h208v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h208c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16z"/>
  </svg>
);
const FaRotateRight = () => (
  <svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
    <path d="M468.9 32.11c13.87 0 27.18 10.77 27.18 27.04v145.9c0 10.59-8.584 19.17-19.17 19.17h-145.7c-16.28 0-27.06-13.26-27.06-27.13 0-6.738 2.699-13.47 8.086-18.86l40.01-40c-32.88-43.38-84.23-71.52-142.5-71.52C96.04 66.61 16 146.6 16 246.9c0 100.3 80.04 180.3 180.3 180.3 49.93 0 95.17-20.27 127.9-53.04 6.688-6.699 15.45-10.05 24.23-10.05 18.73 0 33.94 15.21 33.94 33.94 0 8.783-3.357 17.55-10.05 24.24-43.37 43.37-103.3 70.22-176 70.22C89.88 492.6 0 402.6 0 292.5c0-110 89.88-200 199.9-200 55.16 0 105.1 22.44 141.3 58.67l40.09-40.08c5.395-5.395 12.13-8.083 18.86-8.083z"/>
  </svg>
);

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [maxPrice, setMaxPrice] = useState(500);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    if (initialCategory && !selectedCategories.includes(initialCategory)) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prodData, catData] = await Promise.all([
          fetchApi("/products?limit=100"),
          fetchApi("/categories").catch(() => ({ categories: [] })),
        ]);

        const prodList = prodData.products ?? (Array.isArray(prodData) ? prodData : []);
        setProducts(prodList);
        setCategories(catData.categories ?? []);

        // Compute maximum price among products
        if (prodList.length > 0) {
          const highestPrice = Math.max(
            ...prodList.map((p) => p.discount_price ?? p.price)
          );
          setMaxPrice(Math.ceil(highestPrice / 50) * 50 || 500);
        }
      } catch (err) {
        console.error("Shop load error:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Compute available filter options and counts dynamically from products
  const filterOptions = useMemo(() => {
    const catCounts = {};
    const regionCounts = {};
    const materialCounts = {};

    // Seed ALL fetched categories first (with 0 count) so they always appear
    categories.forEach((cat) => {
      const name = cat.name || cat;
      if (name) catCounts[name] = catCounts[name] || 0;
    });

    products.forEach((p) => {
      const catName = p.category_id?.name || p.category_id || "Uncategorized";
      catCounts[catName] = (catCounts[catName] || 0) + 1;

      if (p.region) {
        regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
      }
      if (p.material) {
        materialCounts[p.material] = (materialCounts[p.material] || 0) + 1;
      }
    });

    return {
      categories: Object.keys(catCounts).sort(),
      catCounts,
      regions: Object.keys(regionCounts).sort(),
      regionCounts,
      materials: Object.keys(materialCounts).sort(),
      materialCounts,
    };
  }, [products]);

  // Handle Checkbox Changes
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const toggleMaterial = (mat) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedMaterials([]);
    const highestPrice = Math.max(
      ...products.map((p) => p.discount_price ?? p.price),
      500
    );
    setMaxPrice(Math.ceil(highestPrice / 50) * 50);
    setSortBy("featured");
  };

  // Filtered & Sorted Products
  const visibleProducts = useMemo(() => {
    let result = products.filter((item) => {
      const effectivePrice = item.discount_price ?? item.price;
      const catName = item.category_id?.name || item.category_id || "";

      // 1. Search Query
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(term);
        const matchesDesc = item.description?.toLowerCase().includes(term);
        const matchesRegion = item.region?.toLowerCase().includes(term);
        const matchesMat = item.material?.toLowerCase().includes(term);
        const matchesCraft = item.craft_type?.toLowerCase().includes(term);
        if (!matchesName && !matchesDesc && !matchesRegion && !matchesMat && !matchesCraft) {
          return false;
        }
      }

      // 2. Price filter
      if (effectivePrice > maxPrice) {
        return false;
      }

      // 3. Category filter — match by name OR by id string
      if (selectedCategories.length > 0) {
        const catId = typeof item.category_id === 'string' ? item.category_id : item.category_id?._id;
        const nameMatch = selectedCategories.includes(catName);
        const idMatch = catId && selectedCategories.includes(catId);
        if (!nameMatch && !idMatch) return false;
      }

      // 4. Region filter
      if (selectedRegions.length > 0 && !selectedRegions.includes(item.region)) {
        return false;
      }

      // 5. Material filter
      if (selectedMaterials.length > 0 && !selectedMaterials.includes(item.material)) {
        return false;
      }

      return true;
    });

    // Apply Sorting
    result.sort((a, b) => {
      const priceA = a.discount_price ?? a.price;
      const priceB = b.discount_price ?? b.price;

      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "rating":
          return (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "featured":
        default:
          return (b.avg_rating ?? 0) - (a.avg_rating ?? 0) || priceA - priceB;
      }
    });

    return result;
  }, [
    products,
    searchTerm,
    maxPrice,
    selectedCategories,
    selectedRegions,
    selectedMaterials,
    sortBy,
  ]);

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategories.length > 0 ||
    selectedRegions.length > 0 ||
    selectedMaterials.length > 0;

  return (
    <div className="shop-page">
      {/* HERO BANNER */}
      <section className="shop-hero">
        <p className="hero-subtitle">— ALL TREASURES —</p>
        <h1>Shop the Himalayan Collection</h1>
        <p className="hero-text">
          Authentic handmade crafts, sacred art, and heritage textiles crafted with
          devotion across Nepal.
        </p>
      </section>

      {/* MAIN CONTAINER */}
      <section className="shop-content">
        {/* FILTERS SIDEBAR */}
        <aside className="sidebar">
          <div className="filter-top">
            <div className="flex items-center gap-2">
              <FaSlidersH className="text-[#7d1d1d]" />
              <h3>Filters</h3>
            </div>
            {hasActiveFilters && (
              <button onClick={handleClearAll} className="clear-btn flex items-center gap-1">
                <FaRotateRight className="text-xs" /> Reset
              </button>
            )}
          </div>

          <hr />

          {/* Search Box */}
          <div className="filter-group">
            <h4>SEARCH CRAFTS</h4>
            <div className="relative search-input-box">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search by name, craft..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-sm border border-[#ead9c6] rounded-lg bg-[#fffdfa] focus:outline-none focus:border-[#7d1d1d]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>

          <hr />

          {/* Price Range */}
          <div className="filter-group">
            <h4>MAX PRICE</h4>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price flex justify-between text-xs text-[#6b5544] font-medium mt-1">
              <span>$20</span>
              <span className="text-[#7d1d1d] font-bold font-serif text-sm">
                Up to ${maxPrice}
              </span>
              <span>$500</span>
            </div>
          </div>

          <hr />

          {/* Category Filter */}
          <div className="filter-group">
            <h4>CATEGORIES</h4>
            <div className="filter-list max-h-48 overflow-y-auto pr-1 space-y-1.5">
              {filterOptions.categories.map((c) => (
                <label key={c} className="filter-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c)}
                    onChange={() => toggleCategory(c)}
                  />
                  <span className="flex-1 truncate">{c}</span>
                  <span className="count-badge">{filterOptions.catCounts[c]}</span>
                </label>
              ))}
            </div>
          </div>

          <hr />

          {/* Region Filter */}
          {filterOptions.regions.length > 0 && (
            <>
              <div className="filter-group">
                <h4>ORIGIN / REGION</h4>
                <div className="filter-list max-h-40 overflow-y-auto pr-1 space-y-1.5">
                  {filterOptions.regions.map((r) => (
                    <label key={r} className="filter-label">
                      <input
                        type="checkbox"
                        checked={selectedRegions.includes(r)}
                        onChange={() => toggleRegion(r)}
                      />
                      <span className="flex-1 truncate">{r}</span>
                      <span className="count-badge">{filterOptions.regionCounts[r]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <hr />
            </>
          )}

          {/* Material Filter */}
          {filterOptions.materials.length > 0 && (
            <div className="filter-group">
              <h4>MATERIAL</h4>
              <div className="filter-list max-h-40 overflow-y-auto pr-1 space-y-1.5">
                {filterOptions.materials.map((m) => (
                  <label key={m} className="filter-label">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(m)}
                      onChange={() => toggleMaterial(m)}
                    />
                    <span className="flex-1 truncate">{m}</span>
                    <span className="count-badge">{filterOptions.materialCounts[m]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* PRODUCTS MAIN SECTION */}
        <main className="products">
          {/* Header Controls */}
          <div className="products-header">
            <div>
              <h2>Artisanal Catalog</h2>
              <p className="results">
                {loading
                  ? "Loading treasures..."
                  : `Showing ${visibleProducts.length} of ${products.length} treasures`}
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-3">
              <label htmlFor="sort-select" className="text-xs text-[#7a5b3d] uppercase tracking-wider hidden sm:inline">
                Sort By:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="newest">Newest Additions</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="active-tags-bar flex flex-wrap gap-2 mb-6">
              {searchTerm && (
                <span className="filter-chip">
                  Keyword: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>✕</button>
                </span>
              )}
              {selectedCategories.map((c) => (
                <span key={c} className="filter-chip">
                  {c}
                  <button onClick={() => toggleCategory(c)}>✕</button>
                </span>
              ))}
              {selectedRegions.map((r) => (
                <span key={r} className="filter-chip">
                  Region: {r}
                  <button onClick={() => toggleRegion(r)}>✕</button>
                </span>
              ))}
              {selectedMaterials.map((m) => (
                <span key={m} className="filter-chip">
                  Material: {m}
                  <button onClick={() => toggleMaterial(m)}>✕</button>
                </span>
              ))}
              <button onClick={handleClearAll} className="text-xs text-[#7d1d1d] hover:underline self-center ml-2">
                Clear All
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-[#f4ebe1] rounded-2xl h-80" />
              ))}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              ⚠ {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && visibleProducts.length === 0 && (
            <div className="empty-catalog text-center py-20 bg-white rounded-2xl border border-[#ead9c6]">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-serif text-2xl text-[#2a1a10] mb-2 font-medium">
                No treasures found
              </h3>
              <p className="text-sm text-[#7d6d66] max-w-md mx-auto mb-6">
                We couldn't find any products matching your active filters. Try adjusting
                the price slider or unchecking some filters.
              </p>
              <button
                onClick={handleClearAll}
                className="bg-[#7d1d1d] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#5c1515] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Products Grid */}
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
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdf8f4] flex items-center justify-center">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}