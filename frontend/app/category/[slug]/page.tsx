import "./category.css";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@/types";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string): Promise<Category | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/categories/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.category ?? null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

async function getProductsByCategory(slug: string): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_URL is not set");
    return [];
  }

  try {
    const res = await fetch(`${baseUrl}/api/products/category/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch products: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.products ?? data ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  const title = category ? `${category.name} | KALAKOSH` : "Category | KALAKOSH";
  const description = category
    ? `Shop ${category.name} handicrafts, handmade by Nepali artisans.`
    : "Browse handicraft categories at KALAKOSH.";

  return { title, description };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, products] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug),
  ]);

  const activeProducts = products.filter((p) => p.status === "active");
  const categoryName = category?.name ?? slug;

  return (
    <div className="category-page">
      {/* HERO */}
      <section
        className="category-hero"
        style={
          category?.image
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <p className="hero-subtitle">— CATEGORY —</p>
        <h1>{categoryName}</h1>
        {category?.description && (
          <p className="hero-text">{category.description}</p>
        )}
      </section>

      {/* CONTENT */}
      <section className="category-content">
        {activeProducts.length === 0 ? (
          <div className="category-empty">
            <p>No products available in this category right now.</p>
          </div>
        ) : (
          <div className="category-grid">
            {activeProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}