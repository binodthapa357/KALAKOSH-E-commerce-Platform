import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from '../src/models/Product.model.js';
import Category from '../src/models/Category.model.js';
import Vendor from '../src/models/Vendor.model.js';
import User from '../src/models/User.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const CATEGORIES_DATA = [
  { name: 'Paintings', slug: 'paintings', image: '/images/painting.jpg', status: 'active' },
  { name: 'Textiles', slug: 'textiles', image: '/images/textile.jpg', status: 'active' },
  { name: 'Pottery', slug: 'pottery', image: '/images/pottery.jpg', status: 'active' },
  { name: 'Jewelry', slug: 'jewelry', image: '/images/jewlery.jpg', status: 'active' },
  { name: 'Wood Crafts', slug: 'wood-crafts', image: '/images/wood.jpg', status: 'active' },
  { name: 'Handicraft', slug: 'handicraft', image: '/images/heritage.png', status: 'active' },
];

const PRODUCTS_BY_CATEGORY = {
  Paintings: [
    {
      name: 'Sacred Green Tara Thangka',
      description: 'Hand-painted Tibetan Buddhist Thangka representing Green Tara on pure cotton canvas with natural mineral pigments.',
      price: 189,
      discount_price: 169,
      stock: 12,
      region: 'Kathmandu',
      material: 'Cotton Canvas & Gold Leaf',
      craft_type: 'Thangka Painting',
      images: ['/images/sacredthanka.jpg', '/images/painting.jpg'],
      avg_rating: 4.9,
      status: 'active',
    },
    {
      name: 'Wheel of Life Bhavachakra Thangka',
      description: 'Intricate visual representation of Samsara (the cyclic existence) created by master Buddhist monks in Patan.',
      price: 249,
      discount_price: 219,
      stock: 8,
      region: 'Patan',
      material: 'Organic Silk Canvas',
      craft_type: 'Thangka Art',
      images: ['/images/painting.jpg'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Mithila Kohbar Auspicious Wall Art',
      description: 'Traditional Mithila folk art celebrating nature, prosperity, and harmony on handmade lokta paper.',
      price: 89,
      stock: 20,
      region: 'Janakpur',
      material: 'Handmade Lokta Paper',
      craft_type: 'Mithila Art',
      images: ['/images/painting.jpg'],
      avg_rating: 4.7,
      status: 'active',
    },
    {
      name: 'Universal Peace Mandala Painting',
      description: 'Geometric sacred Mandala painted using real gold dust and mineral colors for meditation and aesthetic harmony.',
      price: 320,
      discount_price: 280,
      stock: 5,
      region: 'Bhaktapur',
      material: 'Cotton Canvas & Mineral Pigments',
      craft_type: 'Sacred Geometry Art',
      images: ['/images/sacredthanka.jpg'],
      avg_rating: 5.0,
      status: 'active',
    },
    {
      name: 'Traditional Newari Paubha Painting',
      description: 'Classical Newar devotional painting depicting celestial deities with painstaking brushwork and gold embossing.',
      price: 195,
      stock: 10,
      region: 'Lalitpur',
      material: 'Natural Pigments on Canvas',
      craft_type: 'Paubha Art',
      images: ['/images/painting.jpg'],
      avg_rating: 4.9,
      status: 'active',
    },
  ],

  Textiles: [
    {
      name: 'Pure Himalayan Pashmina Shawl',
      description: 'Ultra-soft handwoven 100% Changthangi cashmere pashmina shawl offering warmth, elegance, and feather-light touch.',
      price: 125,
      discount_price: 110,
      stock: 25,
      region: 'Kathmandu Valley',
      material: '100% Cashmere Pashmina',
      craft_type: 'Hand Loom Weaving',
      images: ['/images/pashmina.jpg', '/images/textile.jpg'],
      avg_rating: 4.9,
      status: 'active',
    },
    {
      name: 'Authentic Palpali Dhaka Topi',
      description: 'Handwoven traditional Nepali Dhaka cap featuring geometric patterns woven with vibrant cotton threads.',
      price: 35,
      stock: 40,
      region: 'Palpa',
      material: '100% Pure Cotton',
      craft_type: 'Dhaka Weaving',
      images: ['/images/textile.jpg'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Highland Yak Wool Winter Blanket',
      description: 'Thick, warm, and cozy blanket handcrafted from natural yak wool collected from high altitude Himalayan pastures.',
      price: 145,
      discount_price: 130,
      stock: 15,
      region: 'Solukhumbu',
      material: 'Organic Yak Wool',
      craft_type: 'Handspun Weaving',
      images: ['/images/textile.jpg'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Traditional Newari Haku Patasi Saree',
      description: 'Iconic black cotton saree with bright red borders handwoven by traditional Newar weavers of Bhaktapur.',
      price: 95,
      stock: 18,
      region: 'Bhaktapur',
      material: 'Handloom Cotton',
      craft_type: 'Traditional Weaving',
      images: ['/images/textile.jpg'],
      avg_rating: 4.7,
      status: 'active',
    },
    {
      name: 'Handcrafted Wild Hemp Daypack',
      description: 'Eco-friendly, durable, and stylish backpack made from organic Himalayan wild hemp fiber.',
      price: 65,
      discount_price: 55,
      stock: 30,
      region: 'Pokhara',
      material: 'Wild Himalayan Hemp',
      craft_type: 'Sustainable Weaving',
      images: ['/images/textile.jpg'],
      avg_rating: 4.6,
      status: 'active',
    },
  ],

  Pottery: [
    {
      name: 'Terracotta Matka Clay Water Pitcher',
      description: 'Handmade clay pot crafted in Bhaktapur Pottery Square using ancient wheel techniques that keep water naturally cool.',
      price: 45,
      stock: 20,
      region: 'Bhaktapur',
      material: 'Terracotta Red Clay',
      craft_type: 'Wheel Pottery',
      images: ['/images/pottery.jpg'],
      avg_rating: 4.7,
      status: 'active',
    },
    {
      name: 'Hand-carved Terracotta Oil Lamp (Diyo)',
      description: 'Decorative clay lamp with floral lattice carvings, ideal for spiritual rituals and home decor.',
      price: 55,
      discount_price: 48,
      stock: 35,
      region: 'Bhaktapur',
      material: 'Fired Terracotta Clay',
      craft_type: 'Terracotta Relief Craft',
      images: ['/images/pottery.jpg'],
      avg_rating: 4.9,
      status: 'active',
    },
    {
      name: 'Glazed Ceramic Traditional Tea Set',
      description: 'Six handcrafted tea cups and matching teapot with earthy jade green ceramic glaze.',
      price: 75,
      stock: 14,
      region: 'Thimi',
      material: 'Glazed Stoneware Clay',
      craft_type: 'Ceramic Pottery',
      images: ['/images/pottery.jpg'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Antique Finish Terracotta Garden Planter',
      description: 'Rustic wheel-thrown clay planter engraved with traditional Nepali sun and moon motifs.',
      price: 38,
      stock: 22,
      region: 'Kathmandu',
      material: 'Earthen Clay',
      craft_type: 'Wheel Throwing',
      images: ['/images/pottery.jpg'],
      avg_rating: 4.6,
      status: 'active',
    },
    {
      name: 'Traditional Clay Chulesi Decorative Model',
      description: 'Miniature replica of a heritage Nepali clay hearth, painted with natural slip colors.',
      price: 50,
      discount_price: 42,
      stock: 16,
      region: 'Lalitpur',
      material: 'Clay & Slip Colors',
      craft_type: 'Heritage Pottery',
      images: ['/images/pottery.jpg'],
      avg_rating: 4.7,
      status: 'active',
    },
  ],

  Jewelry: [
    {
      name: 'Filigree Turquoise Silver Pendant',
      description: 'Exquisite 925 sterling silver filigree wirework featuring a polished natural Tibetan turquoise gemstone.',
      price: 110,
      discount_price: 95,
      stock: 18,
      region: 'Patan',
      material: 'Sterling Silver 925 & Turquoise',
      craft_type: 'Silver Filigree Craft',
      images: ['/images/necklace.jpg', '/images/jewlery.jpg'],
      avg_rating: 4.9,
      status: 'active',
    },
    {
      name: 'Traditional Red Coral & Pote Necklace',
      description: 'Multi-strand glass seed bead (Pote) necklace accented with genuine Mediterranean red coral and gold-plated clasp.',
      price: 65,
      stock: 25,
      region: 'Kathmandu',
      material: 'Glass Seed Beads & Red Coral',
      craft_type: 'Traditional Beading',
      images: ['/images/jewlery.jpg', '/images/necklace.jpg'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Hand-hammered Repousse Silver Bangle',
      description: 'Solid silver cuff embossed with protective dragon and lotus motifs using traditional repousse hammering.',
      price: 135,
      discount_price: 120,
      stock: 12,
      region: 'Lalitpur',
      material: 'Solid 925 Silver',
      craft_type: 'Repousse Metalwork',
      images: ['/images/jewlery.jpg'],
      avg_rating: 5.0,
      status: 'active',
    },
    {
      name: 'Yak Bone Inlaid Brass Bracelet',
      description: 'Rustic tribal bangle hand-inlaid with reclaimed yak bone, turquoise, and coral chips on solid brass.',
      price: 40,
      stock: 30,
      region: 'Mustang',
      material: 'Yak Bone, Brass & Coral',
      craft_type: 'Inlay Metalwork',
      images: ['/images/jewlery.jpg'],
      avg_rating: 4.7,
      status: 'active',
    },
    {
      name: 'Newari Filigree Kanthi Mala',
      description: 'Royal ceremonial necklace handcrafted with delicate filigree spheres and 24k gold leaf finishing.',
      price: 85,
      discount_price: 75,
      stock: 15,
      region: 'Bhaktapur',
      material: 'Brass & Gold Foil',
      craft_type: 'Newari Filigree',
      images: ['/images/necklace.jpg'],
      avg_rating: 4.8,
      status: 'active',
    },
  ],

  'Wood Crafts': [
    {
      name: 'Hand-carved Newari Peacock Window',
      description: 'Authentic scaled replica of the world-famous Bhaktapur 15th-century Peacock Window carved from aged Sal wood.',
      price: 195,
      discount_price: 170,
      stock: 8,
      region: 'Bhaktapur',
      material: 'Seasoned Sal Wood',
      craft_type: 'Traditional Wood Carving',
      images: ['/images/wood.jpg'],
      avg_rating: 5.0,
      status: 'active',
    },
    {
      name: 'Carved Wooden Temple Shrine (Mandir)',
      description: 'Miniature pagoda-style home temple with detailed pagoda roofs, carved pillars, and lotus friezes.',
      price: 260,
      discount_price: 235,
      stock: 5,
      region: 'Patan',
      material: 'Teak Wood',
      craft_type: 'Heritage Woodcraft',
      images: ['/images/wood.jpg'],
      avg_rating: 4.9,
      status: 'active',
    },
    {
      name: 'Ashtamangala Auspicious Wooden Keepsake Box',
      description: 'Finely carved keepsake box featuring the Eight Auspicious Buddhist symbols carved into dark sheesham wood.',
      price: 58,
      stock: 22,
      region: 'Kathmandu',
      material: 'Sheesham Rosewood',
      craft_type: 'Relief Wood Carving',
      images: ['/images/wood.jpg'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Ceremonial Bhairava Wooden Mask',
      description: 'Dramatic wall-hanging mask of deity Bhairava carved and hand-painted in rich traditional lacquered pigments.',
      price: 120,
      stock: 10,
      region: 'Lalitpur',
      material: 'Pine Wood & Natural Lacquer',
      craft_type: 'Mask Carving & Painting',
      images: ['/images/wood.jpg'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Lattice Carved Wooden Incense Burner Box',
      description: 'Slotted incense burner box with brass inlay accents and secret storage compartment for incense sticks.',
      price: 32,
      stock: 35,
      region: 'Pokhara',
      material: 'Rosewood & Brass Inlay',
      craft_type: 'Lattice Carving',
      images: ['/images/wood.jpg'],
      avg_rating: 4.7,
      status: 'active',
    },
  ],

  Handicraft: [
    {
      name: 'Seven-Metal Hand-hammered Singing Bowl',
      description: 'Authentic singing bowl hand-hammered from seven planetary metals, complete with wooden mallet and silk cushion.',
      price: 79,
      discount_price: 69,
      stock: 28,
      region: 'Patan',
      material: '7-Metal Bronze Alloy',
      craft_type: 'Sound Healing Metalwork',
      images: ['/images/bowl.jpg', '/images/heritage.png'],
      avg_rating: 4.9,
      status: 'active',
    },
    {
      name: 'Handmade Lokta Paper Leather Journal',
      description: 'Eco-friendly notebook made from wild Daphne bhoula shrub bark with naturally textured, acid-free pages.',
      price: 28,
      stock: 50,
      region: 'Gorkha',
      material: 'Wild Lokta Bark & Natural Dyes',
      craft_type: 'Traditional Papermaking',
      images: ['/images/heritage.png'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Traditional Brass Karuwa Water Pitcher',
      description: 'Classic Nepalese pouring vessel crafted from heavy solid brass with curved spout and polished mirror finish.',
      price: 92,
      discount_price: 82,
      stock: 15,
      region: 'Tansen, Palpa',
      material: 'Cast Solid Brass',
      craft_type: 'Metal Casting & Turning',
      images: ['/images/bowl.jpg'],
      avg_rating: 4.9,
      status: 'active',
    },
    {
      name: 'Hand-felted Wool Ball Area Rug',
      description: 'Vibrant, durable rug made from thousands of 100% pure New Zealand wool felt balls stitched together by hand.',
      price: 160,
      discount_price: 140,
      stock: 10,
      region: 'Kathmandu',
      material: '100% Pure Wool Felt',
      craft_type: 'Hand Felt Craft',
      images: ['/images/heritage.png'],
      avg_rating: 4.8,
      status: 'active',
    },
    {
      name: 'Traditional Gurkha Service Khukuri',
      description: 'Legendary curved Nepali knife forged by Kami blacksmiths with buffalo horn handle and scabbard with two mini knives.',
      price: 115,
      stock: 14,
      region: 'Dharan',
      material: 'High Carbon Steel & Horn',
      craft_type: 'Traditional Blacksmithing',
      images: ['/images/heritage.png'],
      avg_rating: 5.0,
      status: 'active',
    },
  ],
};

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Find or create an admin user
    let user = await User.findOne({ role: 'admin' }) || await User.findOne();
    if (!user) {
      user = await User.create({
        name: 'Kalakosh Artisan Admin',
        email: 'admin@kalakosh.com',
        password: '$2a$10$dummyhashedpasswordforseeding1234567890',
        role: 'admin',
        is_active: true,
        is_verified: true,
      });
    }

    // 2. Find or create a default vendor
    let vendor = await Vendor.findOne();
    if (!vendor) {
      vendor = await Vendor.create({
        user_id: user._id,
        shop_name: 'Kalakosh Master Artisans',
        pan_number: '123456789',
        bank_details: {
          bank_name: 'Nabil Bank Ltd',
          account_name: 'Kalakosh Master Artisans',
          account_number: '01234567890123',
          branch: 'Kathmandu',
        },
        commission_rate: 0.1,
        status: 'active',
      });
      console.log('✅ Created default vendor: Kalakosh Master Artisans');
    }

    // 3. Ensure all categories exist
    const categoryMap = {};
    for (const cat of CATEGORIES_DATA) {
      let doc = await Category.findOne({ name: { $regex: new RegExp(`^${cat.name}$`, 'i') } });
      if (!doc) {
        doc = await Category.create(cat);
        console.log(`📁 Created category: ${cat.name}`);
      } else {
        doc.status = 'active';
        await doc.save();
      }
      categoryMap[cat.name] = doc;
    }

    // 4. Seed 5 products per category
    let totalInserted = 0;
    for (const [catName, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
      const categoryDoc = categoryMap[catName];
      if (!categoryDoc) {
        console.warn(`⚠ Category ${catName} not found, skipping.`);
        continue;
      }

      for (const prodData of products) {
        const existing = await Product.findOne({ name: prodData.name });
        if (existing) {
          // Update existing product to active status and link category
          existing.status = 'active';
          existing.category_id = categoryDoc._id;
          existing.vendor_id = vendor._id;
          await existing.save();
          console.log(`  🔄 Updated product: ${prodData.name}`);
        } else {
          await Product.create({
            ...prodData,
            category_id: categoryDoc._id,
            vendor_id: vendor._id,
          });
          totalInserted++;
          console.log(`  ✨ Inserted product: ${prodData.name} (${catName})`);
        }
      }
    }

    console.log(`\n🎉 Seeding completed successfully!`);
    console.log(`📦 Categories verified: ${Object.keys(categoryMap).length}`);
    console.log(`🎁 Total new products created: ${totalInserted}`);
  } catch (err) {
    console.error('❌ Seeder Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
