/**
 * Kalakosh Database Seeder
 * Populates categories, vendors (with user accounts), and products.
 *
 * Usage:
 *   node scripts/seedDatabase.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import User from '../src/models/User.model.js';
import Vendor from '../src/models/Vendor.model.js';
import Category from '../src/models/Category.model.js';
import Product from '../src/models/Product.model.js';
import Review from '../src/models/Review.model.js';
import Order from '../src/models/Order.model.js';
import OrderItem from '../src/models/OrderItem.model.js';
import Cart from '../src/models/Cart.model.js';
import Wishlist from '../src/models/Wishlist.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const categoriesData = [
  { name: 'Paintings', image: '/images/painting.jpg', status: 'active' },
  { name: 'Textiles', image: '/images/textile.jpg', status: 'active' },
  { name: 'Pottery', image: '/images/pottery.jpg', status: 'active' },
  { name: 'Jewelry', image: '/images/jewlery.jpg', status: 'active' },
  { name: 'Wood Crafts', image: '/images/wood.jpg', status: 'active' }
];

const vendorsData = [
  {
    name: 'Yangji Lama',
    email: 'yangji@kalakosh.com',
    password: 'Artisan@123',
    shop_name: 'Himalayan Sacred Arts',
    pan_number: '123456789',
    bio: 'Yangji Lama is a third-generation Thangka painter from Kathmandu. She preserves the sacred art form using ground minerals and gold paint.',
    story: 'Born into a family of Thangka masters, Yangji spent her childhood observing her father grind natural pigments. Today, she leads a cooperative of 15 female artisans in Kathmandu, teaching them ancient iconography while providing sustainable livelihoods.',
    profile_image: '/images/artisans/yangji.jpg',
    region: 'Kathmandu',
    material: 'Cotton Canvas',
    craft_type: 'Thangka Paintings'
  },
  {
    name: 'Pasang Sherpa',
    email: 'pasang@kalakosh.com',
    password: 'Artisan@123',
    shop_name: 'Sherpa Pashmina & Textiles',
    pan_number: '234567891',
    bio: 'Pasang Sherpa manufactures premium hand-loomed pashmina shawls and yak wool blankets in the Kathmandu Valley.',
    story: 'Pasang started with a single hand-loom in his family home. Over two decades, his commitment to utilizing 100% genuine Chyangra goats pashmina wool has established his shop as a hallmark of authenticity and premium quality.',
    profile_image: '/images/artisans/pasang.jpg',
    region: 'Kathmandu Valley',
    material: '100% Pashmina Wool',
    craft_type: 'Dhaka & Pashmina Weaving'
  },
  {
    name: 'Kanchha Maharjan',
    email: 'kanchha@kalakosh.com',
    password: 'Artisan@123',
    shop_name: 'Maharjan Clay & Pottery',
    pan_number: '345678912',
    bio: 'Kanchha Maharjan is a master potter operating in the historic Pottery Square of Bhaktapur.',
    story: 'Kanchha spins the traditional wooden wheel under the morning sun, shaping black Bhaktapur clay into exquisite household and decorative pottery. His craft has been passed down through seven generations of the Maharjan family.',
    profile_image: '/images/artisans/kanchha.jpg',
    region: 'Bhaktapur',
    material: 'Black Clay',
    craft_type: 'Terracotta Pottery'
  },
  {
    name: 'Ramesh Bajracharya',
    email: 'ramesh@kalakosh.com',
    password: 'Artisan@123',
    shop_name: 'Bajracharya Filigree & Jewelry',
    pan_number: '456789123',
    bio: 'Ramesh Bajracharya specializes in intricate silver filigree jewelry, based in the ancient city of Patan.',
    story: 'Patan is known for metalcraft, and Ramesh is one of the few masters left who can solder hair-thin silver wire into complex floral shapes. He set up a training program to pass these filigree techniques to underrepresented youth.',
    profile_image: '/images/artisans/ramesh.jpg',
    region: 'Patan',
    material: 'Sterling Silver',
    craft_type: 'Silver Filigree'
  },
  {
    name: 'Rajesh Shakya',
    email: 'rajesh@kalakosh.com',
    password: 'Artisan@123',
    shop_name: 'Shakya Woodcarvings & Crafts',
    pan_number: '567891234',
    bio: 'Rajesh Shakya hand-carves traditional Newari wooden windows and religious wall plaques in Patan.',
    story: 'Restoring historic palaces damaged during earthquakes inspired Rajesh to preserve Newari woodcarving. He uses Sal and Teak wood to hand-chisel traditional motifs like peacocks and astamangala (eight auspicious symbols).',
    profile_image: '/images/artisans/rajesh.jpg',
    region: 'Patan',
    material: 'Sal Wood',
    craft_type: 'Newari Woodcarving'
  }
];

const productsData = [
  // --- PAINTINGS (Yangji Lama) ---
  {
    name: 'Sacred Tara Thangka',
    description: 'A beautifully hand-painted Green Tara Thangka on cotton canvas using natural mineral pigments and 24K gold dust highlights. Ideal for meditation spaces and art collectors.',
    price: 24500, // NPR
    discount_price: 22000,
    stock: 5,
    region: 'Kathmandu',
    material: 'Cotton Canvas & Mineral Paints',
    craft_type: 'Thangka Painting',
    images: ['/images/products/tara-thangka.jpg', '/images/products/tara-thangka-detail.jpg'],
    categoryName: 'Paintings',
    vendorEmail: 'yangji@kalakosh.com',
    status: 'active',
    avg_rating: 4.9
  },
  {
    name: 'Wheel of Life Mandala',
    description: 'Bhavachakra Mandala representation hand-carved details and hand-painted lines illustrating the stages of existence. Extremely detailed iconography.',
    price: 18500,
    stock: 3,
    region: 'Kathmandu',
    material: 'Cotton Canvas',
    craft_type: 'Thangka Painting',
    images: ['/images/products/wheel-mandala.jpg'],
    categoryName: 'Paintings',
    vendorEmail: 'yangji@kalakosh.com',
    status: 'active',
    avg_rating: 4.8
  },
  {
    name: 'Shakyamuni Buddha Mandala',
    description: 'A traditional tibetan mandala with Buddha at the center. Handcrafted using traditional gold-lining and stone pigments by master artisans.',
    price: 21000,
    stock: 4,
    region: 'Kathmandu',
    material: 'Linen Canvas',
    craft_type: 'Thangka Painting',
    images: ['/images/products/buddha-mandala.jpg'],
    categoryName: 'Paintings',
    vendorEmail: 'yangji@kalakosh.com',
    status: 'active',
    avg_rating: 4.9
  },
  {
    name: 'Avalokiteshvara Compassion Art',
    description: '1000-Armed Avalokiteshvara depicting infinite compassion. Natural pigment painting detailed with gold paint lines.',
    price: 29000,
    stock: 2,
    region: 'Kathmandu',
    material: 'Cotton Canvas',
    craft_type: 'Thangka Painting',
    images: ['/images/products/avalokiteshvara.jpg'],
    categoryName: 'Paintings',
    vendorEmail: 'yangji@kalakosh.com',
    status: 'active',
    avg_rating: 5.0
  },

  // --- TEXTILES (Pasang Sherpa) ---
  {
    name: 'Pashmina Shawl',
    description: 'An authentic, hand-loomed Pashmina shawl made from ultra-soft Chyangra goat wool harvested in high altitudes. Lightweight, incredibly warm, and luxurious.',
    price: 16000, // NPR
    stock: 12,
    region: 'Kathmandu Valley',
    material: '100% Pashmina Wool',
    craft_type: 'Handloom Weaving',
    images: ['/images/products/pashmina-shawl.jpg', '/images/products/pashmina-shawl-grey.jpg'],
    categoryName: 'Textiles',
    vendorEmail: 'pasang@kalakosh.com',
    status: 'active',
    avg_rating: 4.9
  },
  {
    name: 'Yak Wool Blanket',
    description: 'Thick, rustic, and extremely cozy blanket made from organic highland yak wool. Hand-spun and woven in Nepalese mountain communities.',
    price: 9500,
    discount_price: 8900,
    stock: 8,
    region: 'Solukhumbu',
    material: 'Yak Wool',
    craft_type: 'Handloom Weaving',
    images: ['/images/products/yak-blanket.jpg'],
    categoryName: 'Textiles',
    vendorEmail: 'pasang@kalakosh.com',
    status: 'active',
    avg_rating: 4.7
  },
  {
    name: 'Himalayan Hemp Backpack',
    description: 'Eco-friendly and durable backpack handcrafted from 100% wild Himalayan hemp fibers. Features laptop sleeve and multiple utility pockets.',
    price: 3200,
    stock: 25,
    region: 'Kathmandu Valley',
    material: 'Wild Hemp & Cotton',
    craft_type: 'Hemp Weaving',
    images: ['/images/products/hemp-bag.jpg'],
    categoryName: 'Textiles',
    vendorEmail: 'pasang@kalakosh.com',
    status: 'active',
    avg_rating: 4.6
  },
  {
    name: 'Traditional Palpali Dhaka Topi Set',
    description: 'A genuine hand-woven Dhaka topi accompanied by a matching Dhaka neck scarf. Features historic geometrical shapes and vibrant threads.',
    price: 2500,
    stock: 15,
    region: 'Palpa',
    material: '100% Cotton Dhaka',
    craft_type: 'Dhaka Weaving',
    images: ['/images/products/dhaka-topi.jpg'],
    categoryName: 'Textiles',
    vendorEmail: 'pasang@kalakosh.com',
    status: 'active',
    avg_rating: 4.8
  },

  // --- POTTERY (Kanchha Maharjan) ---
  {
    name: 'Terracotta Peacock Vase',
    description: 'An elegant hand-thrown clay vase featuring detailed engravings of a peacock, fired using traditional straw-covered kiln methods in Bhaktapur.',
    price: 3500,
    stock: 10,
    region: 'Bhaktapur',
    material: 'Black Clay',
    craft_type: 'Terracotta Pottery',
    images: ['/images/products/peacock-vase.jpg'],
    categoryName: 'Pottery',
    vendorEmail: 'kanchha@kalakosh.com',
    status: 'active',
    avg_rating: 4.8
  },
  {
    name: 'Clay Tea Cups (Set of 6)',
    description: 'Rustic, organic clay tea cups (Matka cups) for serving hot masala chai. These retain natural earthy flavors.',
    price: 1200,
    stock: 30,
    region: 'Bhaktapur',
    material: 'Red Clay',
    craft_type: 'Clay Pottery',
    images: ['/images/products/clay-cups.jpg'],
    categoryName: 'Pottery',
    vendorEmail: 'kanchha@kalakosh.com',
    status: 'active',
    avg_rating: 4.5
  },
  {
    name: 'Glazed Ceramic Incense Holder',
    description: 'Stunning ceramic incense burner inspired by Newari architecture. Fired with a rich turquoise glaze.',
    price: 1800,
    stock: 20,
    region: 'Bhaktapur',
    material: 'Glazed Ceramic',
    craft_type: 'Studio Pottery',
    images: ['/images/products/incense-holder.jpg'],
    categoryName: 'Pottery',
    vendorEmail: 'kanchha@kalakosh.com',
    status: 'active',
    avg_rating: 4.7
  },
  {
    name: 'Traditional Pottery Water Pot',
    description: 'Classic Nepalese Gagri/water storage vessel in fired red terracotta. Naturally cools water and adds mineral value.',
    price: 4500,
    stock: 4,
    region: 'Bhaktapur',
    material: 'Red Terracotta Clay',
    craft_type: 'Terracotta Pottery',
    images: ['/images/products/water-pot.jpg'],
    categoryName: 'Pottery',
    vendorEmail: 'kanchha@kalakosh.com',
    status: 'active',
    avg_rating: 4.9
  },

  // --- JEWELRY (Ramesh Bajracharya) ---
  {
    name: 'Filigree Turquoise Necklace',
    description: 'An intricate filigree pendant in sterling silver with an inset high-quality turquoise stone. Crafted manually using centuries-old Newari jewel soldering methods.',
    price: 20200, // NPR
    discount_price: 19500,
    stock: 6,
    region: 'Patan',
    material: '925 Sterling Silver & Genuine Turquoise',
    craft_type: 'Silver Filigree',
    images: ['/images/products/turquoise-necklace.jpg', '/images/products/necklace-box.jpg'],
    categoryName: 'Jewelry',
    vendorEmail: 'ramesh@kalakosh.com',
    status: 'active',
    avg_rating: 4.7
  },
  {
    name: 'Sterling Silver Dorje Bracelet',
    description: 'A solid silver cuff bracelet featuring engraved Tibetan Dorje symbols representing power and enlightenment. Adjustable fit.',
    price: 12500,
    stock: 8,
    region: 'Patan',
    material: '925 Sterling Silver',
    craft_type: 'Engraved Metalwork',
    images: ['/images/products/dorje-bracelet.jpg'],
    categoryName: 'Jewelry',
    vendorEmail: 'ramesh@kalakosh.com',
    status: 'active',
    avg_rating: 4.8
  },
  {
    name: 'Coral & Lapis Lazuli Ring',
    description: 'Vibrant sterling silver ring set with matching polished red coral and blue lapis lazuli gemstones.',
    price: 6800,
    stock: 15,
    region: 'Patan',
    material: 'Sterling Silver & Lapis/Coral',
    craft_type: 'Stone Setting',
    images: ['/images/products/coral-ring.jpg'],
    categoryName: 'Jewelry',
    vendorEmail: 'ramesh@kalakosh.com',
    status: 'active',
    avg_rating: 4.6
  },
  {
    name: 'Silver Yak Bone Earrings',
    description: 'Drop earrings constructed from ethically sourced yak bone carved with mantra symbols, bound in filigreed silver casing.',
    price: 4500,
    stock: 14,
    region: 'Patan',
    material: 'Ethically Sourced Yak Bone & Silver',
    craft_type: 'Inlay & Filigree',
    images: ['/images/products/yak-earrings.jpg'],
    categoryName: 'Jewelry',
    vendorEmail: 'ramesh@kalakosh.com',
    status: 'active',
    avg_rating: 4.7
  },

  // --- WOOD CRAFTS (Rajesh Shakya) ---
  {
    name: 'Handcarved Peacock Window',
    description: 'A miniature replica of the famous 15th-century Peacock Window in Bhaktapur. Painstakingly hand-carved in seasoned Sal wood.',
    price: 32000,
    discount_price: 29900,
    stock: 2,
    region: 'Bhaktapur',
    material: 'Seasoned Sal Wood',
    craft_type: 'Newari Woodcarving',
    images: ['/images/products/peacock-window.jpg'],
    categoryName: 'Wood Crafts',
    vendorEmail: 'rajesh@kalakosh.com',
    status: 'active',
    avg_rating: 5.0
  },
  {
    name: 'Wooden Ganesha Statue',
    description: 'Highly detailed statue of Lord Ganesha, hand-chiseled from a single block of rosewood. Smoothly polished finish.',
    price: 15000,
    stock: 5,
    region: 'Patan',
    material: 'Rosewood',
    craft_type: 'Traditional Carving',
    images: ['/images/products/ganesha-statue.jpg'],
    categoryName: 'Wood Crafts',
    vendorEmail: 'rajesh@kalakosh.com',
    status: 'active',
    avg_rating: 4.9
  },
  {
    name: 'Wooden Ashtamangala Wall Plaque',
    description: 'A round wall hanging display depicting the eight auspicious symbols of Tibetan Buddhism, hand-carved in teak wood.',
    price: 8500,
    stock: 10,
    region: 'Patan',
    material: 'Teak Wood',
    craft_type: 'Bas-Relief Carving',
    images: ['/images/products/ashtamangala-plaque.jpg'],
    categoryName: 'Wood Crafts',
    vendorEmail: 'rajesh@kalakosh.com',
    status: 'active',
    avg_rating: 4.8
  },
  {
    name: 'Carved Singing Bowl Stand',
    description: 'A decorative wooden box stand with custom lotus carving patterns. Perfect container for storage or displaying singing bowls.',
    price: 4800,
    stock: 12,
    region: 'Patan',
    material: 'Pine Wood',
    craft_type: 'Wood Carving & Joinery',
    images: ['/images/products/bowl-stand.jpg'],
    categoryName: 'Wood Crafts',
    vendorEmail: 'rajesh@kalakosh.com',
    status: 'active',
    avg_rating: 4.6
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Clear existing database collections
    console.log('🧹 Clearing old data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Vendor.deleteMany({});
    // Delete non-admin users to avoid collision
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Review.deleteMany({});
    await Order.deleteMany({});
    await OrderItem.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});

    console.log('🌱 Database cleared.');

    // 2. Seed Categories
    console.log('🌱 Seeding Categories...');
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${insertedCategories.length} categories.`);

    // Map names to category IDs
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // 3. Seed Users & Vendors (Artisans)
    console.log('🌱 Seeding Users & Vendors...');
    const vendorMap = {};

    for (const vData of vendorsData) {
      // Create user account
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(vData.password, salt);

      const user = await User.create({
        name: vData.name,
        email: vData.email,
        password: hashedPassword,
        role: 'vendor',
        is_verified: true,
        is_active: true
      });

      // Create vendor profile
      const vendor = await Vendor.create({
        user_id: user._id,
        shop_name: vData.shop_name,
        pan_number: vData.pan_number,
        pan_photo: 'https://picsum.photos/seed/pan_photo_mock/600/400',
        bank_details: {
          bank_name: 'Nabil Bank',
          account_name: vData.name,
          account_number: '1234567890123456',
          branch: 'Kathmandu'
        },
        commission_rate: 0.1,
        status: 'active',
        bio: vData.bio,
        story: vData.story,
        profile_image: vData.profile_image
      });

      vendorMap[vData.email] = vendor._id;
      console.log(`👤 Created Vendor: ${vData.shop_name} (${vData.name})`);
    }

    // 4. Seed Products
    console.log('🌱 Seeding Products...');
    const productsToCreate = productsData.map(p => {
      return {
        name: p.name,
        description: p.description,
        price: p.price,
        discount_price: p.discount_price,
        stock: p.stock,
        region: p.region,
        material: p.material,
        craft_type: p.craft_type,
        images: p.images,
        category_id: categoryMap[p.categoryName],
        vendor_id: vendorMap[p.vendorEmail],
        status: p.status,
        avg_rating: p.avg_rating
      };
    });

    const insertedProducts = await Product.insertMany(productsToCreate);
    console.log(`✅ Created ${insertedProducts.length} products.`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeder error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
