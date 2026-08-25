// app/categories/page.tsx
import "./categories.css";
import Link from "next/link";

export const metadata = {
  title: "Categories | KALAKOSH",
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  status: "active" | "inactive";
}

import { fetchApi } from "@/lib/api";

async function getCategories(): Promise<Category[]> {
  try {
    const data = await fetchApi('/categories', { cache: 'no-store' });
    return data.categories ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  const activeCategories = categories.filter((cat) => cat.status === "active");

  return (
    <div className="categories-page">
      {/* HERO */}
      <section className="categories-hero">
        <p className="hero-subtitle">— EXPLORE —</p>
        <h1>Shop by Category</h1>
        <p className="hero-text">
          Every category tells a story of Nepali craftsmanship, passed down
          through generations of artisans.
        </p>
      </section>

      {/* CONTENT */}
      <section className="categories-content">
        {activeCategories.length === 0 ? (
          <div className="categories-empty">
            <p>No categories available right now. Please check back soon.</p>
          </div>
        ) : (
          <div className="categories-grid">
            {activeCategories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className="category-card"
              >
                <div className="category-image-wrap">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                    />
                  ) : (
                    <div className="category-image-fallback">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
