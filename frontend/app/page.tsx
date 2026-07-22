"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTruck,
  // FaLink,
  FaRegCircleQuestion,
  // FaStore,
  // FaShield,
  FaRegHeart,
  FaBagShopping,
  FaUsers,
  FaShieldHeart,
  FaRegStar,
} from "react-icons/fa6";

import { FaStar as FaStarSolid, FaStarHalfAlt } from "react-icons/fa";

import { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getCategoryFallbackImage = (slug: string) => {
  const fallbacks: Record<string, string> = {
    paintings: "/images/painting.jpg",
    textiles: "/images/textile.jpg",
    pottery: "/images/pottery.jpg",
    jewelry: "/images/jewlery.jpg",
    "wood-crafts": "/images/wood.jpg"
  };
  return fallbacks[slug] || "/images/hero-arrangement.jpg";
};

const heroImages = [
  "/images/hero-arrangement.jpg",
  "/images/painting.jpg",
  "/images/wood.jpg",
];

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ name: string; slug: string; image: string }[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Hero auto-scrolling
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Categories
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data && data.categories) {
          const activeCats = data.categories
            .filter((c: any) => c.status === "active")
            .map((c: any) => ({
              name: c.name,
              slug: c.slug || c.name.toLowerCase().replace(/ /g, "-"),
              image: c.image || getCategoryFallbackImage(c.slug || c.name.toLowerCase().replace(/ /g, "-"))
            }));
          setCategories(activeCats);
        }
      })
      .catch(err => {
        console.error("Error loading categories", err);
        setCategories([
          { name: "Paintings", slug: "paintings", image: "/images/painting.jpg" },
          { name: "Textiles", slug: "textiles", image: "/images/textile.jpg" },
          { name: "Pottery", slug: "pottery", image: "/images/pottery.jpg" },
          { name: "Jewelry", slug: "jewelry", image: "/images/jewlery.jpg" },
          { name: "Wood Crafts", slug: "wood-crafts", image: "/images/wood.jpg" },
        ]);
      })
      .finally(() => {
        setLoadingCats(false);
      });
  }, []);

  // Fetch Featured Products
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products/featured`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => {
        console.error("Error loading products", err);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  const defaultProducts = [
    {
      id: 1,
      name: "Sacred Tara Thangka",
      price: "Rs. 18,900",
      rating: 4.9,
      reviews: 124,
      location: "Kathmandu · Cotton Canvas",
      image: "/images/sacredthanka.jpg",
    },
    {
      id: 2,
      name: "Tibetan Singing Bowl",
      price: "Rs. 7,900",
      rating: 4.8,
      reviews: 312,
      location: "Patan · Brass Alloy",
      image: "/images/bowl.jpg",
    },
    {
      id: 3,
      name: "Pashmina Shawl",
      price: "Rs. 12,400",
      rating: 4.9,
      reviews: 87,
      location: "Kathmandu Valley · 100% Pashmina Wool",
      image: "/images/pashmina.jpg",
    },
    {
      id: 4,
      name: "Filigree Turquoise Necklace",
      price: "Rs. 15,600",
      rating: 4.7,
      reviews: 56,
      location: "Patan · Sterling Silver",
      image: "/images/necklace.jpg",
    },
  ];

  const features = [
    {
      icon: <FaRegCircleQuestion className="text-xl" />,
      title: "Authentic Products",
      description: "100% authentic handmade Nepali products",
    },
    {
      icon: <FaUsers className="text-xl" />,
      title: "Direct from Artisans",
      description: "Supporting local artisans and communities",
    },
    {
      icon: <FaShieldHeart className="text-xl" />,
      title: "Secure Payments",
      description: "Safe & secure payments via eSewa, Khalti & more",
    },
    {
      icon: <FaTruck className="text-xl" />,
      title: "Fast Delivery",
      description: "Quick delivery across Nepal",
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStarSolid key={`full-${i}`} className="text-yellow-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-300" />);
    }
    return stars;
  };

  const normalizedProducts = (products.length > 0 ? products : defaultProducts).map((p: any) => {
    const isDB = !!p._id;
    return {
      id: isDB ? p._id : p.id.toString(),
      name: p.name,
      price: isDB ? `Rs. ${p.price.toLocaleString("en-IN")}` : p.price,
      rating: isDB ? (p.avg_rating ?? 5) : p.rating,
      reviewsCount: isDB ? (p.reviews?.length ?? 0) : p.reviews,
      location: isDB ? `${p.region || "Nepal"} · ${p.material || "Handmade"}` : p.location,
      image: isDB ? (p.images?.[0] || "/placeholder.svg") : p.image,
    };
  });

  return (
    <main className="bg-[#f5efe7] font-sans text-[#2d1a16]">
      {/* HERO SECTION */}
      <section className="relative w-[calc(100%-70px)] h-[500px] mx-[35px] my-[55px] rounded-[28px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-[#f4ece1]">
        {/* Background Image Carousel with Fading */}
        {heroImages.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
              idx === currentHeroIdx ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt="Authentic Nepali Handicrafts"
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
        {/* Soft Golden/Cream Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4ece1]/98 via-[#f4ece1]/80 to-transparent z-10" />

        <div className="relative z-20 h-full flex items-center pl-[50px]">
          <div className="max-w-[480px]">
            <h1 className="font-serif text-[56px] md:text-[62px] leading-[1.0] font-medium text-[#3d271f]">
              Discover <br />
              Authentic <br />
              <span className="text-[#7d1d1d]">
                Nepali <br />
                Handicrafts
              </span>
            </h1>

            {/* Custom Divider from Screenshot */}
            <div className="flex items-center gap-2.5 my-6">
              <div className="w-[45px] h-[1.5px] bg-[#c9974a]" />
              <div className="w-1 h-3 bg-[#c9974a]" />
              <div className="w-[45px] h-[1.5px] bg-[#c9974a]" />
            </div>

            <p className="text-[#6b5544] leading-relaxed text-sm md:text-base mb-8 max-w-[380px]">
              Connecting local artisans with the world — every piece tells a story of Himalayan heritage.
            </p>

            <div className="flex gap-4">
              <Link
                href="/shop"
                className="bg-[#7d1d1d] hover:bg-[#651515] text-white px-8 py-3.5 rounded-[8px] text-[11px] font-bold tracking-wider uppercase transition-colors inline-block text-center shadow-md hover:shadow-lg"
              >
                SHOP NOW
              </Link>
              <Link
                href="/categories"
                className="bg-transparent border border-[#7d1d1d] text-[#6b5544] hover:bg-[#7d1d1d]/5 px-8 py-[13px] rounded-[8px] text-[11px] font-bold tracking-wider transition-colors inline-block text-center shadow-sm"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Pagination Indicators */}
        <div className="flex items-center gap-2 absolute left-1/2 bottom-5 -translate-x-1/2 z-20">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIdx(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentHeroIdx
                  ? "w-6 h-1.5 bg-[#7d1d1d]"
                  : "w-1.5 h-1.5 bg-[#7d1d1d]/35 hover:bg-[#7d1d1d]/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 px-[60px] bg-[#f7f2ea] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c8b3_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-35 pointer-events-none" />

        <div className="relative z-10 text-center mb-[60px]">
          <h2 className="font-serif text-[62px] font-medium text-primary-700">
            Shop by Categories
          </h2>
          <div className="flex justify-center items-center gap-2.5 mt-2.5">
            <div className="w-[45px] h-[2px] bg-secondary-500" />
            <span className="text-secondary-500">✦</span>
            <div className="w-[45px] h-[2px] bg-secondary-500" />
          </div>
        </div>

        {/* Circular Categories List with New Font Style */}
        <div className="relative z-10 flex justify-center items-center flex-wrap gap-[42px]">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.slug}`}
              className="text-center group"
            >
              <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden bg-[#ead7bf] border border-[#ead7bf]/10 shadow-md transition-transform duration-300 hover:translate-y-[-8px] hover:scale-105 hover:shadow-lg cursor-pointer">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="250px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="mt-[18px] font-serif text-lg font-bold text-[#2b1713] tracking-wide hover:text-[#7d1d1d] transition-colors">
                • {category.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-[90px] px-[60px] bg-[#f8f3eb] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c8b3_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-35 pointer-events-none" />

        <div className="relative z-10 flex justify-between items-center mb-[55px]">
          <div className="text-center flex-1">
            <h2 className="font-serif text-[60px] font-medium text-primary-700">
              Featured Handicrafts
            </h2>
            <div className="flex justify-center items-center gap-2.5 mt-2.5">
              <div className="w-[45px] h-[2px] bg-secondary-500" />
              <span className="text-secondary-500">✦</span>
              <div className="w-[45px] h-[2px] bg-secondary-500" />
            </div>
          </div>
          <Link
            href="/shop"
            className="text-primary-700 text-sm hover:underline"
          >
            View All Products →
          </Link>
        </div>

        {/* Compact, Premium Featured Products Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {normalizedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              className="bg-[#fdf9f4] rounded-[20px] overflow-hidden border border-[#e7ddd1] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.06)] cursor-pointer flex flex-col justify-between"
            >
              {/* IMAGE */}
              <div className="relative h-[250px] bg-[#efe4d3] overflow-hidden group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 w-[34px] h-[34px] rounded-full bg-white/95 flex justify-center items-center text-[#6e2b22] hover:bg-red-50 transition-colors shadow-sm"
                >
                  <FaRegHeart className="w-4 h-4" />
                </button>
              </div>

              {/* BODY */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[12px] text-[#7a5b3d] mb-1.5 flex items-center gap-1">
                    <div className="flex gap-0.5">{renderStars(product.rating)}</div>
                    <span className="font-medium ml-1">
                      {product.rating} ({product.reviewsCount})
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#2d1a16] line-clamp-1 mb-1">
                    {product.name}
                  </h3>

                  <p className="text-[#7d6d66] text-xs mb-4 line-clamp-1">
                    {product.location}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold text-primary-700">
                    {product.price}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/product/${product.id}`);
                    }}
                    className="bg-primary-700 hover:bg-primary-800 text-white rounded-full px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <FaBagShopping className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT ARTISANS */}
      <section className="py-5 px-[42px] pb-[90px] bg-[#f8f3eb] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c8b3_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-35 pointer-events-none" />

        {/* Banner */}
        <div className="relative h-[325px] rounded-[28px] overflow-hidden border border-[#d8cdbf] flex items-center pl-[65px]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f0e6]/92 via-[#f7f0e6]/78 to-transparent z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/artisan.jpg')" }}
          />
          <div className="relative z-20 max-w-[420px]">
            <h2 className="font-serif text-[58px] leading-[1] text-primary-700 mb-[18px]">
              Support Local Artisans
            </h2>
            <p className="text-[17px] leading-relaxed text-[#5f4f47] mb-7">
              Every purchase helps preserve our rich cultural heritage and
              empowers Nepali craftspeople.
            </p>
            <button className="bg-primary-700 text-white border-none px-6 py-3.5 rounded-xl text-sm font-semibold tracking-[0.5px] cursor-pointer hover:bg-primary-800 transition-colors">
              EXPLORE NOW
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 mt-[42px] grid grid-cols-4 gap-[18px]">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#fcf8f3] border-2 border-[#ddd2c5] rounded-[20px] p-6 flex items-start gap-[18px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
            >
              <div className="min-w-[48px] h-[48px] rounded-full border-2 border-[#e2c79d] flex justify-center items-center text-primary-700 text-lg">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-serif text-[28px] text-[#2d1a16] mb-1.5">
                  {feature.title}
                </h4>
                <p className="text-sm leading-relaxed text-[#6d5c55]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARTISAN + NEWSLETTER */}
      <section className="w-[calc(100%-80px)] mx-auto my-[70px] bg-[#f8f3eb] border-2 border-[#d8cdbf] rounded-[28px] overflow-hidden grid grid-cols-[1.15fr_1fr_1fr] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c8b3_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-25 pointer-events-none" />

        {/* Image */}
        <div className="relative h-full min-h-[500px]">
          <Image
            src="/images/artist.jpg"
            alt="Artisan"
            fill
            sizes="33vw"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-[46px_42px] border-r-2 border-[#ddd2c5]">
          <h2 className="font-serif text-[54px] font-medium text-primary-700 mb-3">
            Meet Our Artisans
          </h2>
          <div className="flex items-center gap-2.5 mb-[26px]">
            <div className="w-[42px] h-[2px] bg-secondary-500" />
            <span className="text-secondary-500">✦</span>
            <div className="w-[42px] h-[2px] bg-secondary-500" />
          </div>
          <p className="text-base leading-relaxed text-[#5f4f47] max-w-[430px] mb-[34px]">
            Our artisans pour their heart and soul into every piece they create.
            By buying from us, you are supporting their dreams and preserving
            centuries-old traditions.
          </p>
          <button className="bg-primary-700 text-white border-none px-6 py-3.5 rounded-xl text-sm font-semibold tracking-[0.5px] cursor-pointer hover:bg-primary-800 transition-colors">
            VIEW THEIR STORIES
          </button>
        </div>

        {/* Newsletter */}
        <div className="relative z-10 p-[46px_42px]">
          <h2 className="font-serif text-[54px] font-medium text-primary-700 mb-3">
            Stay Updated
          </h2>
          <div className="flex items-center gap-2.5 mb-[26px]">
            <div className="w-[42px] h-[2px] bg-secondary-500" />
            <span className="text-secondary-500">✦</span>
            <div className="w-[42px] h-[2px] bg-secondary-500" />
          </div>
          <p className="text-base leading-relaxed text-[#5f4f47] max-w-[430px] mb-[34px]">
            Subscribe to our newsletter for updates on new arrivals, offers and
            more.
          </p>
          <div className="flex items-center gap-3.5">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 h-14 border-2 border-[#ddd2c5] bg-[#fffaf5] rounded-[14px] px-[18px] text-base outline-none focus:border-primary-400 transition-colors"
            />
            <button className="h-14 px-[26px] border-none rounded-[14px] bg-primary-700 text-white text-sm font-semibold cursor-pointer hover:bg-primary-800 transition-colors whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
