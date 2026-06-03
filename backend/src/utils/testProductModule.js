import express from "express";
import productRoutes from "../routes/product.route.js";
import productController from "../controllers/product.controller.js";
import productService from "../services/product.service.js";
import cloudinary from "../config/cloudinary.config.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

console.log("=========================================");
console.log("🧪 KALAKOSH - Product Module Import & Route Check");
console.log("=========================================\n");

const runChecks = () => {
  try {
    // 1. Check Cloudinary Configuration
    console.log("--- 🌌 Testing Cloudinary Configuration ---");
    if (cloudinary && typeof cloudinary.config === "function") {
      console.log("✅ Cloudinary library loaded and configured successfully!");
    } else {
      throw new Error("Cloudinary configuration failed.");
    }
    console.log("");

    // 2. Check Product Service Methods
    console.log("--- 🛠️ Testing Product Service ---");
    const serviceMethods = [
      "getAllProducts", "searchProducts", "getFeaturedProducts", "getFirstProduct",
      "getProductByID", "getProductsByCategory", "getProductsByArtisan", "createProduct",
      "updateProduct", "deleteProduct", "addImages", "removeImage", "updateStock",
      "getReviews", "addReview", "deleteReview"
    ];

    serviceMethods.forEach(method => {
      if (typeof productService[method] === "function") {
        console.log(`✅ productService.${method} is defined!`);
      } else {
        throw new Error(`productService.${method} is missing or not a function!`);
      }
    });
    console.log("");

    // 3. Check Product Controller Actions
    console.log("--- 🎮 Testing Product Controller ---");
    const controllerActions = [
      "getAllProducts", "searchProducts", "getFeaturedProducts", "getFirstProduct",
      "getProductByID", "getProductsByCategoryName", "getProductsByArtisan", "createProduct",
      "uploadExtraImages", "updateProduct", "approveProduct", "deleteProduct",
      "deleteSpecificImage", "getProductReviews", "addProductReview", "deleteProductReview",
      "updateProductStock"
    ];

    controllerActions.forEach(action => {
      if (typeof productController[action] === "function") {
        console.log(`✅ productController.${action} is defined!`);
      } else {
        throw new Error(`productController.${action} is missing or not a function!`);
      }
    });
    console.log("");

    // 4. Check Express Router Paths and Methods
    console.log("--- 🛣️ Testing Express Router Paths ---");
    
    // We can inspect router stack
    const routes = [];
    productRoutes.stack.forEach(layer => {
      if (layer.route) {
        const path = layer.route.path;
        const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
        routes.push({ path, methods });
      }
    });

    console.log(`Total defined routes: ${routes.length}`);
    routes.forEach((r, idx) => {
      console.log(`   [Route ${idx + 1}] ${r.methods.padEnd(6)} -> ${r.path}`);
    });
    console.log("");

    // Verify featured and search are registered BEFORE :id
    const featuredIdx = routes.findIndex(r => r.path === "/featured");
    const searchIdx = routes.findIndex(r => r.path === "/search");
    const idIdx = routes.findIndex(r => r.path === "/:id");

    if (featuredIdx !== -1 && idIdx !== -1 && featuredIdx < idIdx) {
      console.log("✅ Order Check: /featured is registered before /:id (prevents clash)!");
    } else {
      throw new Error("/featured is NOT registered before /:id!");
    }

    if (searchIdx !== -1 && idIdx !== -1 && searchIdx < idIdx) {
      console.log("✅ Order Check: /search is registered before /:id (prevents clash)!");
    } else {
      throw new Error("/search is NOT registered before /:id!");
    }

    console.log("=========================================");
    console.log("🎉 SUCCESS: Product Module Verification Passed perfectly!");
    console.log("=========================================");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Route checking failed:", error.message);
    process.exit(1);
  }
};

runChecks();
