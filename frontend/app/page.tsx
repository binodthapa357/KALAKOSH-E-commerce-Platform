'use client';

import Image from 'next/image';
import Link from 'next/link';
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
 
  
  FaRegStar
} from 'react-icons/fa6';

import { FaStar as FaStarSolid ,FaStarHalfAlt} from 'react-icons/fa';

export default function Home() {
  const categories = [
    { name: 'Paintings', image: '/images/painting.jpg' },
    { name: 'Textiles', image: '/images/textile.jpg' },
    { name: 'Pottery', image: '/images/pottery.jpg' },
    { name: 'Jewelry', image: '/images/jewlery.jpg' },
    { name: 'Wood Crafts', image: '/images/wood.jpg' },
  ];

  const products = [
    {
      id: 1,
      name: 'Sacred Tara Thangka',
      price: '$189',
      rating: 4.9,
      reviews: 124,
      location: 'Kathmandu · Cotton Canvas',
      image: '/images/sacredthanka.jpg',
    },
    {
      id: 2,
      name: 'Tibetan Singing Bowl',
      price: '$79',
      rating: 4.8,
      reviews: 312,
      location: 'Patan · Brass Alloy',
      image: '/images/bowl.jpg',
    },
    {
      id: 3,
      name: 'Pashmina Shawl',
      price: '$124',
      rating: 4.9,
      reviews: 87,
      location: 'Kathmandu Valley · 100% Pashmina Wool',
      image: '/images/pashmina.jpg',
    },
    {
      id: 4,
      name: 'Filigree Turquoise Necklace',
      price: '$156',
      rating: 4.7,
      reviews: 56,
      location: 'Patan · Sterling Silver',
      image: '/images/necklace.jpg',
    },
  ];

  const features = [
    {
      icon: <FaRegCircleQuestion className="text-xl" />,
      title: 'Authentic Products',
      description: '100% authentic handmade Nepali products',
    },
    {
      icon: <FaUsers className="text-xl" />,
      title: 'Direct from Artisans',
      description: 'Supporting local artisans and communities',
    },
    {
      icon: <FaShieldHeart className="text-xl" />,
      title: 'Secure Payments',
      description: 'Safe & secure payments via eSewa, Khalti & more',
    },
    {
      icon: <FaTruck className="text-xl" />,
      title: 'Fast Delivery',
      description: 'Quick delivery across Nepal',
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

  return (
    <main className="bg-[#f5efe7] font-sans text-[#2d1a16]">
      {/* HERO SECTION */}
      <section className="relative w-[calc(100%-70px)] h-[500px] mx-[35px] my-[55px] rounded-[28px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#f5efe7]/96 via-[#f5efe7]/70 to-transparent z-10"
        />
        <div className="relative z-10 h-full flex items-center pl-[50px]">
          <div className="max-w-[430px]">
            <h1 className="font-serif text-[72px] leading-[0.95] font-medium text-[#2c1612]">
              Discover <br />
              Authentic <br />
              <span className="text-[#7d1d1d] italic">Nepali <br />Handicrafts</span>
            </h1>

            <div className="flex items-center gap-2.5 my-[26px]">
              <div className="w-[45px] h-[2px] bg-secondary-500" />
              <span className="text-secondary-500">✦</span>
              <div className="w-[45px] h-[2px] bg-secondary-500" />
            </div>

            <p className="text-[#5f4f47] leading-relaxed text-base mb-[30px]">
              Connecting local artisans with the world — every
              piece tells a story of Himalayan heritage.
            </p>

            <div className="flex gap-3.5">
              <button className="bg-primary-700 text-white border-none px-7 py-4 rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-primary-800 transition-colors">
                SHOP NOW
              </button>
              <button className="bg-transparent border-2 border-primary-700 text-primary-700 px-7 py-[15px] rounded-[10px] text-sm tracking-[1px] cursor-pointer hover:bg-primary-700/10 transition-colors">
                EXPLORE CATEGORIES
              </button>
            </div>
          </div>
        </div>

        <div className="w-[22px] h-[6px] bg-primary-700 rounded-[30px] absolute left-1/2 bottom-[18px] -translate-x-1/2" />
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

        <div className="relative z-10 flex justify-center items-center flex-wrap gap-[42px]">
          {categories.map((category) => (
            <div key={category.name} className="text-center">
              <div className="w-[250px] h-[250px] rounded-full overflow-hidden bg-[#ead7bf] transition-transform duration-300 hover:translate-y-[-8px] hover:scale-105 cursor-pointer">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={250}
                  height={250}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-[18px] text-lg text-[#2b1713]">• {category.name}</p>
            </div>
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
          <Link href="/shop" className="text-primary-700 text-sm hover:underline">
            View All Products →
          </Link>
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-7">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#fdf9f4] rounded-[22px] overflow-hidden border border-[#e7ddd1] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)]"
            >
              <div className="h-[320px] relative bg-[#efe4d3]">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={320}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3.5 right-3.5 w-[38px] h-[38px] rounded-full bg-white/90 flex justify-center items-center text-[#6e2b22] cursor-pointer hover:bg-red-50 transition-colors">
                  <FaRegHeart />
                </div>
              </div>

              <div className="p-[18px_18px_20px]">
                <div className="text-[13px] text-[#7a5b3d] mb-2.5 flex items-center gap-1">
                  {renderStars(product.rating)} {product.rating} ({product.reviews})
                </div>
                <h3 className="font-serif text-[34px] leading-[1.05] text-[#2d1a16] mb-1.5">
                  {product.name}
                </h3>
                <p className="text-[#7d6d66] text-sm mb-[18px]">{product.location}</p>

                <div className="flex justify-between items-center">
                  <span className="text-[34px] font-serif font-bold text-primary-700">
                    {product.price}
                  </span>
                  <button className="bg-primary-700 text-white border-none px-[18px] py-[11px] rounded-full text-xs font-medium flex items-center gap-2 cursor-pointer hover:bg-primary-800 transition-colors">
                    <FaBagShopping /> Add
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
          <div 
            className="absolute inset-0 bg-gradient-to-r from-[#f7f0e6]/92 via-[#f7f0e6]/78 to-transparent z-10"
          />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/artisan.jpg')" }}
          />
          <div className="relative z-20 max-w-[420px]">
            <h2 className="font-serif text-[58px] leading-[1] text-primary-700 mb-[18px]">
              Support Local Artisans
            </h2>
            <p className="text-[17px] leading-relaxed text-[#5f4f47] mb-7">
              Every purchase helps preserve our rich cultural
              heritage and empowers Nepali craftspeople.
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
        <div className="h-full">
          <Image
            src="/images/artist.jpg"
            alt="Artisan"
            width={400}
            height={500}
            className="w-full h-full object-cover"
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
            Our artisans pour their heart and soul into every piece they
            create. By buying from us, you are supporting their dreams
            and preserving centuries-old traditions.
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
            Subscribe to our newsletter for updates on new arrivals,
            offers and more.
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