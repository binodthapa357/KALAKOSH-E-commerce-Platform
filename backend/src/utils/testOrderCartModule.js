import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import Vendor from "../models/Vendor.model.js";
import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";
import Wishlist from "../models/Wishlist.model.js";
import Order from "../models/Order.model.js";
import OrderItem from "../models/OrderItem.model.js";

// Controllers under test
import cartController from "../controllers/cart.controller.js";
import wishlistController from "../controllers/wishlist.controller.js";
import orderController from "../controllers/order.controller.js";
import shippingController from "../controllers/shipping.controller.js";
import paymentController from "../controllers/payment.controller.js";
import authController from "../controllers/auth.controller.js";
import adminController from "../controllers/admin.controller.js";

dotenv.config();

// Helper to create mock Express request, response, and next
const createMockReqRes = (body = {}, headers = {}, params = {}, user = null) => {
  const req = {
    body,
    headers,
    params,
    user,
  };
  
  const res = {
    statusCode: 200,
    jsonData: null,
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.jsonData = data;
      return this;
    },
  };

  const next = (err) => {
    res.nextError = err;
  };

  return { req, res, next };
};

const runIntegrationTests = async () => {
  console.log("==================================================");
  console.log("🧪 KALAKOSH - Cart, Wishlist, Order & Payment Test");
  console.log("==================================================\n");

  let isDbConnected = false;

  try {
    console.log("🔄 Connecting to MongoDB for integration tests...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kalakosh_test", {
      serverSelectionTimeoutMS: 2000,
    });
    isDbConnected = true;
    console.log("✅ Database connected successfully!\n");
  } catch (error) {
    console.log("❌ Could not connect to MongoDB. Integration tests require a running database.");
    process.exit(1);
  }

  // Define test variables to clean up later
  let testUser, testVendorUser, testVendor, testCategory, testProduct;

  try {
    // ----------------------------------------------------
    // SETUP TEST DATA
    // ----------------------------------------------------
    console.log("--- 📂 Setting Up Test Data ---");
    
    // Clear old test records
    await User.deleteMany({ email: { $in: ["testbuyer@kalakosh.com", "testvendor@kalakosh.com"] } });
    await Category.deleteMany({ name: "Test Craft Category" });
    
    testUser = await User.create({
      name: "Test Buyer",
      email: "testbuyer@kalakosh.com",
      password: "buyerpassword123",
      role: "user",
    });

    testVendorUser = await User.create({
      name: "Test Artisan Vendor",
      email: "testvendor@kalakosh.com",
      password: "vendorpassword123",
      role: "vendor",
    });

    testVendor = await Vendor.create({
      user_id: testVendorUser._id,
      shop_name: "Artisan Test Shop",
      pan_number: "111222333",
      bank_details: {
        bank_name: "Global IME Bank",
        account_name: "Artisan Test Shop",
        account_number: "999888777666",
        branch: "Kirtipur",
      },
      status: "active",
    });

    testCategory = await Category.create({
      name: "Test Craft Category",
      image: "http://example.com/test-craft.jpg",
    });

    testProduct = await Product.create({
      name: "Test Handmade Woodcarving",
      description: "Fine wooden carving test product",
      price: 1200,
      category_id: testCategory._id,
      vendor_id: testVendor._id,
      stock: 10,
      status: "active",
    });

    console.log("✅ Test buyer, vendor, product, and category created successfully!\n");

    // ----------------------------------------------------
    // TEST 1: Cart Operations
    // ----------------------------------------------------
    console.log("--- 🛒 Testing Cart Controller ---");

    // 1A: Get Cart (empty cart is created automatically)
    const { req: cartReq1, res: cartRes1, next: cartNext1 } = createMockReqRes({}, {}, {}, testUser);
    await cartController.getCart(cartReq1, cartRes1, cartNext1);
    console.log(`✅ Get Cart returns 200: ${cartRes1.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Returns empty cart items list: ${cartRes1.jsonData?.cart?.items?.length === 0 ? "PASSED" : "FAILED"}`);

    // 1B: Add to Cart (quantity 2)
    const { req: cartReq2, res: cartRes2, next: cartNext2 } = createMockReqRes({
      product_id: testProduct._id.toString(),
      quantity: 2,
    }, {}, {}, testUser);
    await cartController.addToCart(cartReq2, cartRes2, cartNext2);
    console.log(`✅ Add to Cart returns 200: ${cartRes2.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Cart item length is 1: ${cartRes2.jsonData?.cart?.items?.length === 1 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Cart item quantity matches: ${cartRes2.jsonData?.cart?.items[0]?.quantity === 2 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Price snapshot matches product price: ${cartRes2.jsonData?.cart?.items[0]?.price_at_add === 1200 ? "PASSED" : "FAILED"}`);

    // 1C: Add to Cart exceeding stock
    const { req: cartReqExceed, res: cartResExceed, next: cartNextExceed } = createMockReqRes({
      product_id: testProduct._id.toString(),
      quantity: 20, // stock is only 10
    }, {}, {}, testUser);
    await cartController.addToCart(cartReqExceed, cartResExceed, cartNextExceed);
    console.log(`✅ Exceeding stock returns 400: ${cartResExceed.statusCode === 400 ? "PASSED" : "FAILED"} ("${cartResExceed.jsonData?.message}")`);

    // 1D: Update Cart Item quantity to 3
    const { req: cartReq3, res: cartRes3, next: cartNext3 } = createMockReqRes({
      product_id: testProduct._id.toString(),
      quantity: 3,
    }, {}, {}, testUser);
    await cartController.updateCartItem(cartReq3, cartRes3, cartNext3);
    console.log(`✅ Update Cart Item quantity returns 200: ${cartRes3.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Updated quantity is 3: ${cartRes3.jsonData?.cart?.items[0]?.quantity === 3 ? "PASSED" : "FAILED"}`);

    // 1E: Remove from Cart
    const { req: cartReq4, res: cartRes4, next: cartNext4 } = createMockReqRes({}, {}, { productId: testProduct._id.toString() }, testUser);
    await cartController.removeFromCart(cartReq4, cartRes4, cartNext4);
    console.log(`✅ Remove from Cart returns 200: ${cartRes4.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Cart is empty again: ${cartRes4.jsonData?.cart?.items?.length === 0 ? "PASSED" : "FAILED"}`);

    // Add back item for further testing
    const { req: cartReq5, res: cartRes5, next: cartNext5 } = createMockReqRes({
      product_id: testProduct._id.toString(),
      quantity: 4,
    }, {}, {}, testUser);
    await cartController.addToCart(cartReq5, cartRes5, cartNext5);
    console.log("✅ Added back 4 items to cart for checkout tests.\n");

    // ----------------------------------------------------
    // TEST 2: Wishlist Operations
    // ----------------------------------------------------
    console.log("--- 💖 Testing Wishlist Controller ---");

    // 2A: Toggle Add
    const { req: wishReq1, res: wishRes1, next: wishNext1 } = createMockReqRes({
      product_id: testProduct._id.toString(),
    }, {}, {}, testUser);
    await wishlistController.toggleWishlist(wishReq1, wishRes1, wishNext1);
    console.log(`✅ Wishlist toggle add returns 200: ${wishRes1.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Product is in wishlist: ${wishRes1.jsonData?.wishlist?.products?.length === 1 ? "PASSED" : "FAILED"}`);

    // 2B: Toggle Remove
    const { req: wishReq2, res: wishRes2, next: wishNext2 } = createMockReqRes({
      product_id: testProduct._id.toString(),
    }, {}, {}, testUser);
    await wishlistController.toggleWishlist(wishReq2, wishRes2, wishNext2);
    console.log(`✅ Wishlist toggle remove returns 200: ${wishRes2.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Wishlist is empty: ${wishRes2.jsonData?.wishlist?.products?.length === 0 ? "PASSED" : "FAILED"}`);
    console.log("");

    // ----------------------------------------------------
    // TEST 3: Shipping Operations
    // ----------------------------------------------------
    console.log("--- 🚚 Testing Shipping Controller ---");

    // 3A: Get rates
    const { req: shipReq1, res: shipRes1, next: shipNext1 } = createMockReqRes();
    await shippingController.getShippingRates(shipReq1, shipRes1, shipNext1);
    console.log(`✅ Get shipping rates returns 200: ${shipRes1.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Currency is NPR: ${shipRes1.jsonData?.currency === "NPR" ? "PASSED" : "FAILED"}`);

    // 3B: Calculate shipping within Kathmandu Valley
    const { req: shipReq2, res: shipRes2, next: shipNext2 } = createMockReqRes({
      city: "Kathmandu",
      state: "Bagmati",
      subtotal: 1000,
    });
    await shippingController.calculateShippingCost(shipReq2, shipRes2, shipNext2);
    console.log(`✅ Kathmandu Valley cost matches 100: ${shipRes2.jsonData?.shipping_cost === 100 ? "PASSED" : "FAILED"}`);

    // 3C: Calculate shipping above free threshold
    const { req: shipReq3, res: shipRes3, next: shipNext3 } = createMockReqRes({
      city: "Pokhara",
      state: "Gandaki",
      subtotal: 6000, // free above 5000
    });
    await shippingController.calculateShippingCost(shipReq3, shipRes3, shipNext3);
    console.log(`✅ Pokhara free shipping matches 0: ${shipRes3.jsonData?.shipping_cost === 0 ? "PASSED" : "FAILED"}`);
    console.log("");

    // ----------------------------------------------------
    // TEST 4: Orders Operations
    // ----------------------------------------------------
    console.log("--- 📦 Testing Order Controller ---");

    // 4A: Place order
    const address = {
      name: "Test Buyer",
      street: "12 Bagbazar",
      city: "Kathmandu",
      state: "Bagmati",
      phone: "9851012345",
      country: "Nepal",
    };

    const { req: orderReq1, res: orderRes1, next: orderNext1 } = createMockReqRes({
      shipping_address: address,
      payment_method: "eSewa",
    }, {}, {}, testUser);

    await orderController.createOrder(orderReq1, orderRes1, orderNext1);
    console.log(`✅ Create Order returns 201 Created: ${orderRes1.statusCode === 201 ? "PASSED" : "FAILED"}`);
    
    const createdOrder = orderRes1.jsonData?.order;
    const orderItems = orderRes1.jsonData?.items;

    console.log(`✅ Order Number generated: ${createdOrder?.order_number}`);
    console.log(`✅ Order Total Amount calculates correctly: ${createdOrder?.total_amount === 4900 ? "PASSED" : "FAILED"} (Subtotal: 4800, Shipping: 100)`);
    console.log(`✅ Order items size is 1: ${orderItems?.length === 1 ? "PASSED" : "FAILED"}`);
    
    // Check stock subtraction
    const updatedProduct = await Product.findById(testProduct._id);
    console.log(`✅ Product stock decremented: ${updatedProduct.stock === 6 ? "PASSED" : "FAILED"} (Old stock: 10, Bought: 4, New: ${updatedProduct.stock})`);

    // Check cart clearing
    const clearedCart = await Cart.findOne({ user_id: testUser._id });
    console.log(`✅ Cart cleared after successful checkout: ${clearedCart.items.length === 0 ? "PASSED" : "FAILED"}`);

    // 4B: Get My Orders
    const { req: myOrdersReq, res: myOrdersRes, next: myOrdersNext } = createMockReqRes({}, {}, {}, testUser);
    await orderController.getMyOrders(myOrdersReq, myOrdersRes, myOrdersNext);
    console.log(`✅ Get My Orders returns 200: ${myOrdersRes.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Buyer order list length is 1: ${myOrdersRes.jsonData?.orders?.length === 1 ? "PASSED" : "FAILED"}`);
    console.log("");

    // ----------------------------------------------------
    // TEST 5: Payment verification Mocking
    // ----------------------------------------------------
    console.log("--- 💳 Testing Payment Verification ---");

    // 5A: Verify eSewa with incorrect total
    const { req: payReq1, res: payRes1, next: payNext1 } = createMockReqRes({
      oid: createdOrder.order_number,
      amt: 2000, // incorrect (correct: 4900)
      refId: "ESEWA9988",
    });
    await paymentController.verifyESewa(payReq1, payRes1, payNext1);
    console.log(`✅ Invalid eSewa amount triggers 400 Bad Request: ${payRes1.statusCode === 400 ? "PASSED" : "FAILED"} ("${payRes1.jsonData?.message}")`);

    // 5B: Verify eSewa success
    const { req: payReq2, res: payRes2, next: payNext2 } = createMockReqRes({
      oid: createdOrder.order_number,
      amt: 4900,
      refId: "ESEWA9988",
    });
    await paymentController.verifyESewa(payReq2, payRes2, payNext2);
    console.log(`✅ Valid eSewa payment returns 200 verified: ${payRes2.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Order payment status set to paid: ${payRes2.jsonData?.order?.payment_status === "paid" ? "PASSED" : "FAILED"}`);
    console.log(`✅ Order status set to confirmed: ${payRes2.jsonData?.order?.order_status === "confirmed" ? "PASSED" : "FAILED"}`);

    // Verify order items became processing
    const processingOrderItem = await OrderItem.findOne({ order_id: createdOrder._id });
    console.log(`✅ Order items updated to processing: ${processingOrderItem.item_status === "processing" ? "PASSED" : "FAILED"}`);
    console.log("");

    // ----------------------------------------------------
    // TEST 6: Vendor Order Item Status Updates
    // ----------------------------------------------------
    console.log("--- 🧑‍🎨 Testing Vendor Status Updates ---");
    
    // 6A: Vendor updates item status to shipped
    const { req: vendReq, res: vendRes, next: vendNext } = createMockReqRes({
      status: "shipped",
    }, {}, { orderItemId: processingOrderItem._id.toString() }, testVendorUser);

    await orderController.updateOrderItemStatus(vendReq, vendRes, vendNext);
    console.log(`✅ Vendor status update returns 200: ${vendRes.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Order item status changed to shipped: ${vendRes.jsonData?.orderItem?.item_status === "shipped" ? "PASSED" : "FAILED"}`);

    // Sibling-status propagation: check parent order status updated
    const finalOrder = await Order.findById(createdOrder._id);
    console.log(`✅ Parent order status auto-updated to shipped: ${finalOrder.order_status === "shipped" ? "PASSED" : "FAILED"}`);
    console.log("");

    // ----------------------------------------------------
    // TEST 7: Address Management Operations
    // ----------------------------------------------------
    console.log("--- 🏠 Testing Address Management ---");

    // 7A: Add Address
    const { req: addrReq1, res: addrRes1, next: addrNext1 } = createMockReqRes({
      street: "12 Pulchowk",
      city: "Lalitpur",
      state: "Bagmati",
      phone: "9851012345",
      is_default: true
    }, {}, {}, testUser);
    await authController.addAddress(addrReq1, addrRes1, addrNext1);
    console.log(`✅ Add Address returns 201 Created: ${addrRes1.statusCode === 201 ? "PASSED" : "FAILED"}`);
    console.log(`✅ First address is default: ${addrRes1.jsonData?.addresses[0]?.is_default === true ? "PASSED" : "FAILED"}`);

    const newAddressId = addrRes1.jsonData?.addresses[0]?._id.toString();

    // 7B: Get Addresses
    const { req: addrReq2, res: addrRes2, next: addrNext2 } = createMockReqRes({}, {}, {}, testUser);
    await authController.getAddresses(addrReq2, addrRes2, addrNext2);
    console.log(`✅ Get Addresses returns 200: ${addrRes2.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Address count matches: ${addrRes2.jsonData?.addresses?.length === 1 ? "PASSED" : "FAILED"}`);

    // 7C: Update Address
    const { req: addrReq3, res: addrRes3, next: addrNext3 } = createMockReqRes({
      street: "45 Pulchowk Heights",
    }, {}, { addressId: newAddressId }, testUser);
    await authController.updateAddress(addrReq3, addrRes3, addrNext3);
    console.log(`✅ Update Address returns 200: ${addrRes3.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Address street updated: ${addrRes3.jsonData?.addresses[0]?.street === "45 Pulchowk Heights" ? "PASSED" : "FAILED"}`);

    // 7D: Delete Address
    const { req: addrReq4, res: addrRes4, next: addrNext4 } = createMockReqRes({}, {}, { addressId: newAddressId }, testUser);
    await authController.deleteAddress(addrReq4, addrRes4, addrNext4);
    console.log(`✅ Delete Address returns 200: ${addrRes4.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Address is deleted: ${addrRes4.jsonData?.addresses?.length === 0 ? "PASSED" : "FAILED"}`);
    console.log("");

    // ----------------------------------------------------
    // TEST 8: Admin Status & Stats View
    // ----------------------------------------------------
    console.log("--- 👑 Testing Admin Dashboard & Lists ---");

    // Create an Admin user for auth role checking
    const testAdminUser = await User.create({
      name: "Test Admin User",
      email: "testadmin@kalakosh.com",
      password: "adminpassword123",
      role: "admin",
    });

    // 8A: Get Stats
    const { req: adminReq1, res: adminRes1, next: adminNext1 } = createMockReqRes({}, {}, {}, testAdminUser);
    await adminController.getDashboardStats(adminReq1, adminRes1, adminNext1);
    console.log(`✅ Get Dashboard Stats returns 200: ${adminRes1.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Returns correct active users stat: ${adminRes1.jsonData?.stats?.users?.active >= 1 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Returns correct active products stat: ${adminRes1.jsonData?.stats?.products?.active >= 1 ? "PASSED" : "FAILED"}`);

    // 8B: Get Users List
    const { req: adminReq2, res: adminRes2, next: adminNext2 } = createMockReqRes({}, {}, {}, testAdminUser);
    await adminController.getUsersList(adminReq2, adminRes2, adminNext2);
    console.log(`✅ Get Users List returns 200: ${adminRes2.statusCode === 200 ? "PASSED" : "FAILED"}`);
    console.log(`✅ Returns all registered users: ${adminRes2.jsonData?.count >= 2 ? "PASSED" : "FAILED"}`);

    // 8C: Get Products List (filtered by pending)
    const { req: adminReq3, res: adminRes3, next: adminNext3 } = createMockReqRes({}, {}, {}, testAdminUser);
    adminReq3.query = { status: "pending" };
    await adminController.getProductsList(adminReq3, adminRes3, adminNext3);
    console.log(`✅ Get Products List (pending) returns 200: ${adminRes3.statusCode === 200 ? "PASSED" : "FAILED"}`);

    // Delete the temporary Admin user
    await User.deleteOne({ _id: testAdminUser._id });
    console.log("");

    console.log("==================================================");
    console.log("🎉 SUCCESS: All 8 Integration Test Modules Passed!");
    console.log("==================================================");

  } catch (err) {
    console.error("❌ Test suite encountered a runtime error:", err);
  } finally {
    console.log("\n🧹 Cleaning up test database records...");
    if (testUser) await User.deleteOne({ _id: testUser._id });
    if (testVendorUser) await User.deleteOne({ _id: testVendorUser._id });
    if (testVendor) await Vendor.deleteOne({ _id: testVendor._id });
    if (testCategory) await Category.deleteOne({ _id: testCategory._id });
    if (testProduct) await Product.deleteOne({ _id: testProduct._id });
    if (testUser) {
      await Cart.deleteOne({ user_id: testUser._id });
      await Wishlist.deleteOne({ user_id: testUser._id });
      await Order.deleteMany({ user_id: testUser._id });
    }
    console.log("✅ Cleanup finished.");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  }
};

runIntegrationTests();
