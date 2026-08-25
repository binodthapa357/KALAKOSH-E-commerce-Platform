"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaTruck,
  FaRegCircleQuestion,
  FaUsers,
  FaShieldHeart,
} from 'react-icons/fa6';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Paintings', image: '/images/painting.jpg' },
    { name: 'Textiles', image: '/images/textile.jpg' },
    { name: 'Pottery', image: '/images/pottery.jpg' },
    { name: 'Jewelry', image: '/images/jewlery.jpg' },
    { name: 'Wood Crafts', image: '/images/wood.jpg' },
    { name: 'Handicraft', image: '/images/heritage.png' },
  ];

  const features = [
    {
      icon: <FaRegCircleQuestion className="text-lg sm:text-xl" />,
      title: "Authentic Products",
      description: "100% authentic handmade Nepali products",
    },
    {
      icon: <FaUsers className="text-lg sm:text-xl" />,
      title: "Direct from Artisans",
      description: "Supporting local artisans and communities",
    },
    {
      icon: <FaShieldHeart className="text-lg sm:text-xl" />,
      title: "Secure Payments",
      description: "Safe & secure payments via eSewa, Khalti & more",
    },
    {
      icon: <FaTruck className="text-xl" />,
      title: 'Fast Delivery',
      description: 'Quick delivery across Nepal & Worldwide',
    },
  ];

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchApi('/products/featured').catch(() => null);
        if (data && Array.isArray(data) && data.length > 0) {
          setFeaturedProducts(data.slice(0, 4));
        } else {
          // Fallback to top products from /products
          const allData = await fetchApi('/products').catch(() => null);
          const list = allData?.products || (Array.isArray(allData) ? allData : []);
          setFeaturedProducts(list.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      toast.success('Thank you for subscribing!', {
        description: 'You will receive authentic craft stories and exclusive offers.',
      });
      setNewsletterEmail('');
    }, 400);
  };

  return (
    <main className="bg-[#f5efe7] font-sans text-[#2d1a16] min-h-screen">
      {/* HERO SECTION */}
      <section className="relative w-[calc(100%-70px)] min-h-[520px] mx-[35px] my-[45px] rounded-[28px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-cover bg-center" style={{ backgroundImage: "url('/images/heritage.png')" }}>
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#f5efe7]/98 via-[#f5efe7]/85 to-transparent z-10"
        />
        <div className="relative z-10 h-full min-h-[520px] flex items-center pl-[50px] py-12">
          <div className="max-w-[460px]">
            <span className="text-[#7d1d1d] text-xs font-bold tracking-[0.25em] uppercase mb-3 block">
              Direct from the Himalayas
            </span>
            <h1 className="font-serif text-[64px] md:text-[72px] leading-[0.95] font-medium text-[#2c1612]">
              Discover <br />
              Authentic <br />
              <span className="text-[#7d1d1d]">
                Nepali <br />
                Handicrafts
              </span>
            </h1>

            <div className="flex items-center gap-2.5 my-[22px]">
              <div className="w-[45px] h-[2px] bg-secondary-500" />
              <span className="text-secondary-500">✦</span>
              <div className="w-[45px] h-[2px] bg-secondary-500" />
            </div>

            <p className="text-[#5f4f47] leading-relaxed text-base mb-[28px]">
              Connecting master artisans with the world — every piece carries centuries of living Nepalese heritage and devotion.
            </p>

            <div className="flex flex-wrap gap-3.5">
              <Link
                href="/shop"
                className="bg-[#7d1d1d] text-white border-none px-8 py-4 rounded-[12px] text-sm font-semibold cursor-pointer hover:bg-[#5c1515] transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                SHOP NOW →
              </Link>
              <Link
                href="/categories"
                className="bg-transparent border-2 border-[#7d1d1d] text-[#7d1d1d] px-7 py-[14px] rounded-[12px] text-sm font-semibold tracking-[0.5px] cursor-pointer hover:bg-[#7d1d1d]/10 transition-colors inline-flex items-center"
              >
                EXPLORE CATEGORIES
              </Link>
            </div>
          </div>
        </div>

        <div className="w-[22px] h-[6px] bg-[#7d1d1d] rounded-[30px] absolute left-1/2 bottom-[18px] -translate-x-1/2" />
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 px-6 sm:px-[60px] bg-[#f7f2ea] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c8b3_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-35 pointer-events-none" />

        <div className="relative z-10 text-center mb-[50px]">
          <h2 className="font-serif text-[44px] md:text-[56px] font-medium text-primary-700">
            Shop by Categories
          </h2>
          <div className="flex justify-center items-center gap-2.5 mt-2.5">
            <div className="w-[35px] sm:w-[45px] h-[2px] bg-secondary-500" />
            <span className="text-secondary-500">✦</span>
            <div className="w-[35px] sm:w-[45px] h-[2px] bg-secondary-500" />
          </div>
        </div>

        <div className="relative z-10 flex justify-center items-center flex-wrap gap-8 md:gap-[42px]">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className="text-center group no-underline"
            >
              <div className="w-[200px] h-[200px] md:w-[230px] md:h-[230px] rounded-full overflow-hidden bg-[#ead7bf] border-4 border-white shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 group-hover:shadow-xl relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={230}
                  height={230}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="mt-[14px] text-lg font-medium text-[#2b1713] group-hover:text-[#7d1d1d] transition-colors">
                • {category.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-14 px-6 sm:px-14 bg-[#f8f3eb] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c8b3_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-35 pointer-events-none" />

        {/* Section header */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-3">
          <div>
            <p className="text-[#7d1d1d] text-xs font-bold tracking-[0.2em] uppercase mb-1">— HANDPICKED FOR YOU —</p>
            <h2 className="font-serif text-[32px] md:text-[40px] font-semibold text-[#2c1612] leading-tight">
              Featured Handicrafts
            </h2>
            <p className="text-sm text-[#7a5b3d] mt-1">
              Curated masterworks of living Nepali heritage
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[#7d1d1d] text-sm font-semibold bg-white px-5 py-2.5 rounded-full border border-[#ead9c6] shadow-sm transition-all hover:bg-[#7d1d1d] hover:text-white hover:border-[#7d1d1d] flex-shrink-0"
          >
            View All Products →
          </Link>
        </div>

        {loading ? (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#f2e6d8] rounded-2xl h-[370px]" />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="relative z-10 text-center py-16 text-[#7d6d66]">
            <p className="text-lg font-serif">No featured products yet.</p>
            <Link href="/shop" className="text-[#7d1d1d] text-sm mt-2 inline-block hover:underline">Browse all crafts →</Link>
          </div>
        )}
      </section>

      {/* SUPPORT ARTISANS */}
      <section className="py-5 px-6 sm:px-[42px] pb-[80px] bg-[#f8f3eb] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c8b3_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-35 pointer-events-none" />

        {/* Banner */}
        <div className="relative min-h-[340px] rounded-[28px] overflow-hidden border border-[#d8cdbf] flex items-center pl-8 md:pl-[65px] py-8">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#f7f0e6]/96 via-[#f7f0e6]/80 to-transparent z-10"
          />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/artisan.jpg')" }}
          />
          <div className="relative z-20 max-w-[460px]">
            <span className="text-[#7d1d1d] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
              Empowerment Through Art
            </span>
            <h2 className="font-serif text-[46px] md:text-[54px] leading-[1] text-primary-700 mb-[16px]">
              Support Local Artisans
            </h2>
            <p className="text-[16px] leading-relaxed text-[#5f4f47] mb-6">
              Every purchase directly sustains local artisan families, protects endangered traditional crafts, and brings living history to your home.
            </p>
            <Link
              href="/shop"
              className="bg-[#7d1d1d] text-white border-none px-7 py-3.5 rounded-xl text-sm font-semibold tracking-[0.5px] cursor-pointer hover:bg-[#5c1515] transition-colors inline-block shadow-md"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 mt-[36px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#fcf8f3] border-2 border-[#ddd2c5] rounded-2xl lg:rounded-[20px] p-5 sm:p-6 flex items-start gap-4 sm:gap-[18px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.05)]"
            >
              <div className="min-w-[40px] h-[40px] sm:min-w-[48px] sm:h-[48px] rounded-full border-2 border-[#e2c79d] flex justify-center items-center text-primary-700 text-base sm:text-lg shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-serif text-[22px] text-[#2d1a16] mb-1 font-medium">
                  {feature.title}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-[#6d5c55]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARTISAN + NEWSLETTER */}
      <section className="w-[calc(100%-48px)] sm:w-[calc(100%-80px)] mx-auto my-[60px] bg-[#f8f3eb] border-2 border-[#d8cdbf] rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1fr] relative shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(#d9c8b3_0.7px,transparent_0.7px)] bg-[length:22px_22px] opacity-25 pointer-events-none" />

        {/* Image */}
        <div className="h-64 lg:h-full relative min-h-[300px]">
          <Image
            src="/images/artist.jpg"
            alt="Artisan"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 lg:p-[46px_42px] border-b lg:border-b-0 lg:border-r-2 border-[#ddd2c5] flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-[42px] md:text-[50px] font-medium text-primary-700 mb-2 leading-tight">
              Meet Our Artisans
            </h2>
            <div className="flex items-center gap-2.5 mb-[20px]">
              <div className="w-[42px] h-[2px] bg-secondary-500" />
              <span className="text-secondary-500">✦</span>
              <div className="w-[42px] h-[2px] bg-secondary-500" />
            </div>
            <p className="text-sm md:text-base leading-relaxed text-[#5f4f47] mb-[24px]">
              Our master craftspeople pour their heart and soul into every piece they create. Discover the generations of heritage and sacred technique behind each craft.
            </p>
          </div>
          <Link
            href="/about"
            className="bg-[#7d1d1d] text-white border-none px-6 py-3.5 rounded-xl text-sm font-semibold tracking-[0.5px] cursor-pointer hover:bg-[#5c1515] transition-colors inline-block text-center w-fit shadow-sm"
          >
            VIEW THEIR STORIES
          </Link>
        </div>

        {/* Newsletter */}
        <div className="relative z-10 p-8 lg:p-[46px_42px] flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-[42px] md:text-[50px] font-medium text-primary-700 mb-2 leading-tight">
              Stay Updated
            </h2>
            <div className="flex items-center gap-2.5 mb-[20px]">
              <div className="w-[42px] h-[2px] bg-secondary-500" />
              <span className="text-secondary-500">✦</span>
              <div className="w-[42px] h-[2px] bg-secondary-500" />
            </div>
            <p className="text-sm md:text-base leading-relaxed text-[#5f4f47] mb-[24px]">
              Subscribe to our heritage dispatch for new seasonal masterworks, artisan spotlights, and cultural events.
            </p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 h-12 border-2 border-[#ddd2c5] bg-[#fffaf5] rounded-[12px] px-4 text-sm outline-none focus:border-[#7d1d1d] transition-colors"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="h-12 px-6 border-none rounded-[12px] bg-[#7d1d1d] text-white text-sm font-semibold cursor-pointer hover:bg-[#5c1515] transition-colors whitespace-nowrap disabled:opacity-60 shadow-sm"
            >
              {isSubscribing ? 'Subscribing...' : 'SUBSCRIBE'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}