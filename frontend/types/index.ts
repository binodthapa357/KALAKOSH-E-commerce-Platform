export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status: "active" | "inactive";
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  discount_price?: number;
  images?: string[];
  avg_rating?: number;
  region?: string;
  material?: string;
  description?: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  status: "active" | "inactive";
  stock?: number;
}