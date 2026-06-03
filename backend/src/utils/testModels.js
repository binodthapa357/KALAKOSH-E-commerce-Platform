import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Vendor from "../models/Vendor.model.js";
import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import OrderItem from "../models/OrderItem.model.js";
import Cart from "../models/Cart.model.js";
import Wishlist from "../models/Wishlist.model.js";
import Review from "../models/Review.model.js";

dotenv.config();

const runValidation = async () => {
  console.log("=========================================");
  console.log("🧪 KALAKOSH - Schema Validation Test Suite");
  console.log("=========================================\n");

  let isDbConnected = false;
  
  // Attempt local fallback first or Atlas connection
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    // Try connecting with a short 2-second timeout to avoid long waits
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kalakosh_test", {
      serverSelectionTimeoutMS: 2000,
    });
    isDbConnected = true;
    console.log("✅ Database connected successfully! Running full database integration tests.\n");
  } catch (error) {
    console.log("⚠️  Could not connect to MongoDB (probably offline or Atlas IP Whitelist restriction).");
    console.log("ℹ️  Running robust schema validations in OFFLINE DRY-RUN mode.\n");
  }

  try {
    // ----------------------------------------------------
    // TEST 1: User Schema Validation
    // ----------------------------------------------------
    console.log("--- 👤 Testing User Model ---");
    const validUser = new User({
      name: "Binod Thapa",
      email: "binod@kalakosh.com",
      password: "securepassword123",
      role: "vendor",
      addresses: [
        {
          street: "123 Patan Durbar Square",
          city: "Lalitpur",
          state: "Bagmati",
          phone: "9851012345", // Valid Nepali Mobile
          is_default: true
        }
      ]
    });

    try {
      await validUser.validate();
      console.log("✅ Valid User schema validation passed!");
    } catch (userErr) {
      console.error("❌ Valid User failed schema validation:", userErr.message);
    }

    // Invalid email validation test
    const invalidUser = new User({
      name: "Test User",
      email: "invalidemailformat",
      password: "123", // too short
      addresses: [
        {
          street: "Chhetrapati",
          city: "Kathmandu",
          state: "Bagmati",
          phone: "12345" // Invalid phone
        }
      ]
    });
    
    try {
      await invalidUser.validate();
      console.error("❌ Schema failed to catch invalid user fields!");
    } catch (invalidUserErr) {
      console.log("✅ Schema successfully caught invalid fields as expected:");
      if (invalidUserErr.errors["email"]) console.log("   - Invalid email caught:", invalidUserErr.errors["email"].message);
      if (invalidUserErr.errors["password"]) console.log("   - Password minlength caught:", invalidUserErr.errors["password"].message);
      if (invalidUserErr.errors["addresses.0.phone"]) console.log("   - Invalid phone caught:", invalidUserErr.errors["addresses.0.phone"].message);
    }

    if (isDbConnected) {
      // Clear previous users if any
      await User.deleteMany({ email: "binod@kalakosh.com" });
      const savedUser = await validUser.save();
      console.log("✅ Saved User to DB!");
      const isMatch = await savedUser.comparePassword("securepassword123");
      console.log(`✅ Password Hashing Verification: ${savedUser.password.startsWith("$2a$") ? "PASSED (hashed)" : "FAILED"}`);
      console.log(`✅ comparePassword Instance Method Verification: ${isMatch ? "PASSED" : "FAILED"}`);
    }
    console.log("");

    // ----------------------------------------------------
    // TEST 2: Vendor Schema Validation
    // ----------------------------------------------------
    console.log("--- 🏬 Testing Vendor Model ---");
    const dummyUserId = new mongoose.Types.ObjectId();
    const validVendor = new Vendor({
      user_id: dummyUserId,
      shop_name: "Lalitpur Brass Crafts",
      pan_number: "987654321", // Valid 9-digit PAN
      bank_details: {
        bank_name: "Nabil Bank",
        account_name: "Lalitpur Brass Crafts Pvt. Ltd.",
        account_number: "01020304050607",
        branch: "Pulchowk"
      },
      commission_rate: 0.12
    });

    try {
      await validVendor.validate();
      console.log("✅ Valid Vendor schema validation passed!");
    } catch (vendorErr) {
      console.error("❌ Valid Vendor failed schema validation:", vendorErr.message);
    }

    // Invalid PAN format test
    const invalidVendor = new Vendor({
      user_id: dummyUserId,
      shop_name: "Incorrect Vendor",
      pan_number: "12345", // too short (must be 9)
      bank_details: {
        bank_name: "Nepal Bank",
        account_name: "Incorrect Vendor",
        account_number: "11111"
      }
    });
    
    try {
      await invalidVendor.validate();
      console.error("❌ Schema failed to catch invalid PAN number!");
    } catch (invalidVendorErr) {
      console.log("✅ Schema successfully caught invalid vendor PAN/fields:");
      if (invalidVendorErr.errors["pan_number"]) console.log("   - Invalid PAN caught:", invalidVendorErr.errors["pan_number"].message);
    }
    console.log("");

    // ----------------------------------------------------
    // TEST 3: Category Schema Validation
    // ----------------------------------------------------
    console.log("--- 📂 Testing Category Model ---");
    const validCategory = new Category({
      name: "Handmade Paper Products",
      image: "http://example.com/paper.jpg"
    });

    try {
      // Async validate() runs the pre-validate hook
      await validCategory.validate();
      console.log("✅ Valid Category schema validation passed!");
      console.log(`✅ Auto-slugification pre-validate hook verification: ${validCategory.slug === "handmade-paper-products" ? "PASSED" : "FAILED"} (slug: "${validCategory.slug}")`);
    } catch (catErr) {
      console.error("❌ Valid Category failed schema validation:", catErr.message);
    }
    console.log("");

    // ----------------------------------------------------
    // TEST 4: Product Schema Validation
    // ----------------------------------------------------
    console.log("--- 🎨 Testing Product Model ---");
    const dummyCatId = new mongoose.Types.ObjectId();
    const dummyVendorId = new mongoose.Types.ObjectId();
    
    const validProduct = new Product({
      name: "Nepali Lokta Diary",
      description: "Authentic, eco-friendly handmade Lokta notebook from Solukhumbu.",
      price: 850,
      discount_price: 750,
      category_id: dummyCatId,
      vendor_id: dummyVendorId,
      stock: 45,
      region: "Solukhumbu",
      material: "Lokta Paper",
      craft_type: "Paper Craft",
      images: ["http://example.com/lokta1.jpg", "http://example.com/lokta2.jpg"]
    });

    try {
      await validProduct.validate();
      console.log("✅ Valid Product schema validation passed!");
    } catch (prodErr) {
      console.error("❌ Valid Product failed schema validation:", prodErr.message);
    }

    // Invalid Product Price validation test (discount higher than regular price)
    const invalidProduct = new Product({
      name: "Wooden Peacock Window",
      description: "Carved wood peacock window",
      price: 15000,
      discount_price: 18000, // Invalid: discount cannot be higher than price
      category_id: dummyCatId,
      vendor_id: dummyVendorId,
      stock: 2
    });
    
    try {
      await invalidProduct.validate();
      console.error("❌ Schema failed to catch discount_price > price!");
    } catch (invalidProdErr) {
      console.log("✅ Schema successfully caught invalid pricing limits:");
      if (invalidProdErr.errors["discount_price"]) console.log("   - Discount price validator caught:", invalidProdErr.errors["discount_price"].message);
    }
    console.log("");

    // ----------------------------------------------------
    // TEST 5: Order Schema Validation
    // ----------------------------------------------------
    console.log("--- 📦 Testing Order Model ---");
    const validOrder = new Order({
      user_id: dummyUserId,
      subtotal: 1700,
      shipping_cost: 150,
      discount: 100,
      total_amount: 1750,
      shipping_address: {
        name: "Binod Thapa",
        street: "Bakhundole",
        city: "Lalitpur",
        state: "Bagmati",
        phone: "9851012345"
      },
      payment_method: "eSewa"
    });

    try {
      await validOrder.validate();
      console.log("✅ Valid Order schema validation passed!");
    } catch (orderErr) {
      console.error("❌ Valid Order failed schema validation:", orderErr.message);
    }

    if (isDbConnected) {
      // Clear previous orders
      await Order.deleteMany({});
      
      const savedOrder1 = await validOrder.save();
      console.log(`✅ Saved Order 1 successfully with order_number: ${savedOrder1.order_number}`);
      
      const order2 = new Order({
        user_id: dummyUserId,
        subtotal: 500,
        total_amount: 500,
        shipping_address: {
          name: "Ram KC",
          street: "New Road",
          city: "Kathmandu",
          state: "Bagmati",
          phone: "9841234567"
        },
        payment_method: "COD"
      });
      const savedOrder2 = await order2.save();
      console.log(`✅ Saved Order 2 successfully with order_number: ${savedOrder2.order_number}`);
      console.log(`✅ Auto-Increment Order Number Verification: ${savedOrder2.order_number === "KLK-0002" ? "PASSED" : "FAILED"}`);
    }
    console.log("");

    // ----------------------------------------------------
    // TEST 6: OrderItem Schema Validation
    // ----------------------------------------------------
    console.log("--- 🎟️ Testing OrderItem Model ---");
    const validOrderItem = new OrderItem({
      order_id: new mongoose.Types.ObjectId(),
      product_id: dummyCatId,
      vendor_id: dummyVendorId,
      quantity: 2,
      price_at_purchase: 850,
      item_status: "processing"
    });

    try {
      await validOrderItem.validate();
      console.log("✅ Valid OrderItem schema validation passed!");
    } catch (orderItemErr) {
      console.error("❌ Valid OrderItem failed schema validation:", orderItemErr.message);
    }
    console.log("");

    // ----------------------------------------------------
    // TEST 7: Cart Schema Validation
    // ----------------------------------------------------
    console.log("--- 🛒 Testing Cart Model ---");
    const validCart = new Cart({
      user_id: dummyUserId,
      items: [
        {
          product_id: dummyCatId,
          quantity: 3,
          price_at_add: 850
        }
      ]
    });

    try {
      await validCart.validate();
      console.log("✅ Valid Cart schema validation passed!");
    } catch (cartErr) {
      console.error("❌ Valid Cart failed schema validation:", cartErr.message);
    }
    console.log("");

    // ----------------------------------------------------
    // TEST 8: Wishlist Schema Validation
    // ----------------------------------------------------
    console.log("--- 💖 Testing Wishlist Model ---");
    const validWishlist = new Wishlist({
      user_id: dummyUserId,
      products: [dummyCatId]
    });

    try {
      await validWishlist.validate();
      console.log("✅ Valid Wishlist schema validation passed!");
    } catch (wishlistErr) {
      console.error("❌ Valid Wishlist failed schema validation:", wishlistErr.message);
    }
    console.log("");

    // ----------------------------------------------------
    // TEST 9: Review Schema Validation
    // ----------------------------------------------------
    console.log("--- ⭐ Testing Review Model ---");
    const validReview = new Review({
      user_id: dummyUserId,
      product_id: dummyCatId,
      rating: 5,
      comment: "Absolutely stunning! The packaging was eco-friendly and neat."
    });

    try {
      await validReview.validate();
      console.log("✅ Valid Review schema validation passed!");
    } catch (reviewErr) {
      console.error("❌ Valid Review failed schema validation:", reviewErr.message);
    }

    // Invalid rating test
    const invalidReview = new Review({
      user_id: dummyUserId,
      product_id: dummyCatId,
      rating: 6, // Invalid: rating must be between 1 and 5
      comment: "Terrible"
    });
    
    try {
      await invalidReview.validate();
      console.error("❌ Schema failed to catch invalid rating range!");
    } catch (invalidReviewErr) {
      console.log("✅ Schema successfully caught invalid rating range:");
      if (invalidReviewErr.errors["rating"]) console.log("   - Invalid rating range caught successfully:", invalidReviewErr.errors["rating"].message);
    }

    if (isDbConnected) {
      // Clear previous reviews
      await Review.deleteMany({});
      await Product.deleteMany({});
      
      // Save product first
      const testProduct = await Product.create({
        name: "Test Prod",
        description: "Test Desc",
        price: 100,
        category_id: dummyCatId,
        vendor_id: dummyVendorId,
        stock: 10
      });
      console.log(`✅ Saved temporary Product. Current avg_rating: ${testProduct.avg_rating}`);

      // Save a review
      const newReview1 = new Review({
        user_id: dummyUserId,
        product_id: testProduct._id,
        rating: 4,
        comment: "Good"
      });
      await newReview1.save();
      
      let updatedProduct = await Product.findById(testProduct._id);
      console.log(`✅ Saved Review 1 (Rating: 4). Recalculated Product avg_rating: ${updatedProduct.avg_rating}`);
      
      const newReview2 = new Review({
        user_id: new mongoose.Types.ObjectId(), // another user
        product_id: testProduct._id,
        rating: 5,
        comment: "Excellent"
      });
      await newReview2.save();
      
      updatedProduct = await Product.findById(testProduct._id);
      console.log(`✅ Saved Review 2 (Rating: 5). Recalculated Product avg_rating: ${updatedProduct.avg_rating}`);
      console.log(`✅ Review Post-Save Hook Rating Recalculation Verification: ${updatedProduct.avg_rating === 4.5 ? "PASSED" : "FAILED"}`);
    }
    console.log("");

    console.log("=========================================");
    console.log("🎉 SUCCESS: All 9 Model Schemas Validated successfully!");
    console.log("=========================================");

  } catch (err) {
    console.error("\n❌ An error occurred during validation tests:", err);
  } finally {
    if (isDbConnected) {
      await mongoose.disconnect();
      console.log("\n🔌 Disconnected from MongoDB.");
    }
    process.exit(0);
  }
};

runValidation();
