import productService from "../services/product.service.js";
import Vendor from "../models/Vendor.model.js";
import Category from "../models/Category.model.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../config/cloudinary.config.js";
import mongoose from "mongoose";

/**
 * Extract public_id from Cloudinary or Mock URL.
 */
const getPublicIdFromUrl = (url) => {
  try {
    if (!url) return null;
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) {
      // If it's a mock url, return it or segment of it
      if (url.includes("mock_public_id_")) {
        const match = url.match(/mock_public_id_[a-zA-Z0-9_]+/);
        return match ? match[0] : null;
      }
      return null;
    }
    const remainingParts = parts.slice(uploadIndex + 2); // skip "upload" and "vXXXXXX"
    const publicIdWithExtension = remainingParts.join("/");
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));
    return publicId;
  } catch (error) {
    return null;
  }
};

/**
 * GET /api/products
 * Fetch all products with pagination, multi-criteria filters, and sorting.
 */
const getAllProducts = async (req, res) => {
  try {
    const { category, region, material, minPrice, maxPrice, sort, page, limit } = req.query;

    const filters = {
      category,
      region,
      material,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
    };

    const pagination = {
      page: page !== undefined ? Number(page) : 1,
      limit: limit !== undefined ? Number(limit) : 12,
    };

    // Include inactive products only if logged-in user is an admin requesting it
    const includeInactive = req.user && req.user.role === "admin" && req.query.includeInactive === "true";

    const result = await productService.getAllProducts(filters, sort, pagination, includeInactive);
    res.json(result);
  } catch (error) {
    console.error("Error in getAllProducts controller:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

/**
 * GET /api/products/search
 * Keyword search on Name/Description/Region using Mongo $text index with filters.
 */
const searchProducts = async (req, res) => {
  try {
    const { q, keyword, category, minPrice, maxPrice, page, limit } = req.query;
    const searchTerm = q || keyword || "";

    const filters = {
      category,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
    };

    const pagination = {
      page: page !== undefined ? Number(page) : 1,
      limit: limit !== undefined ? Number(limit) : 12,
    };

    const result = await productService.searchProducts(searchTerm, filters, pagination);
    res.json(result);
  } catch (error) {
    console.error("Error in searchProducts controller:", error);
    res.status(500).json({ message: "Error searching products", error: error.message });
  }
};

/**
 * GET /api/products/featured
 * Get top 8 featured products based on rating.
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json(products);
  } catch (error) {
    console.error("Error in getFeaturedProducts controller:", error);
    res.status(500).json({ message: "Error fetching featured products", error: error.message });
  }
};

/**
 * GET /api/products/first
 * Legacy compatibility endpoint to get the first product.
 */
const getFirstProduct = async (req, res) => {
  try {
    const product = await productService.getFirstProduct();
    if (!product) return res.status(404).json({ message: "No products exist." });
    res.json(product);
  } catch (error) {
    console.error("Error in getFirstProduct controller:", error);
    res.status(500).json({ message: "Error fetching first product", error: error.message });
  }
};

/**
 * GET /api/products/:id
 * Retrieve details of a single product populated with reviews, category, and vendor.
 */
const getProductByID = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByID(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const reviews = await productService.getReviews(id);
    const productObj = product.toObject ? product.toObject() : product;
    productObj.reviews = reviews;

    res.json(productObj);
  } catch (error) {
    console.error("Error in getProductByID controller:", error);
    res.status(500).json({ message: "Error fetching product by ID", error: error.message });
  }
};

/**
 * GET /api/products/category/:name
 * Retrieve all active products belonging to a validated category name.
 */
const getProductsByCategoryName = async (req, res) => {
  try {
    // req.category was attached by validateCategoryName middleware
    const categoryId = req.category._id;
    const products = await productService.getProductsByCategory(categoryId);
    res.json({
      success: true,
      category: req.category.name,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error in getProductsByCategoryName controller:", error);
    res.status(500).json({ message: "Error fetching category products", error: error.message });
  }
};

/**
 * GET /api/products/artisan/:id
 * Retrieve all active products by one vendor/artisan.
 */
const getProductsByArtisan = async (req, res) => {
  try {
    const artisanId = req.params.id;
    const products = await productService.getProductsByArtisan(artisanId);
    res.json({
      success: true,
      artisanId,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error in getProductsByArtisan controller:", error);
    res.status(500).json({ message: "Error fetching artisan products", error: error.message });
  }
};

/**
 * POST /api/products
 * Create a new product. Restricted to Vendors/Admins. Uploads up to 5 images.
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount_price, category_id, category, stock, region, material, craft_type } = req.body;

    // Explicit Body Validation
    if (!name) return res.status(400).json({ message: "Validation error: Product name is required" });
    if (!description) return res.status(400).json({ message: "Validation error: Product description is required" });
    if (price === undefined || price === null) return res.status(400).json({ message: "Validation error: Product price is required" });
    if (isNaN(price) || Number(price) < 0) return res.status(400).json({ message: "Validation error: Product price must be a non-negative number" });
    if (stock === undefined || stock === null) return res.status(400).json({ message: "Validation error: Stock quantity is required" });
    if (isNaN(stock) || Number(stock) < 0) return res.status(400).json({ message: "Validation error: Stock cannot be negative" });

    // Auto-resolve Category ID
    let finalCategoryId = category_id;
    if (!finalCategoryId && category) {
      const foundCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${category.trim()}$`, "i") },
      });
      if (foundCategory) {
        finalCategoryId = foundCategory._id;
      }
    }

    if (!finalCategoryId || !mongoose.Types.ObjectId.isValid(finalCategoryId)) {
      return res.status(400).json({ message: "Validation error: A valid category_id or category name is required" });
    }

    // Verify Category exists in database
    const categoryExists = await Category.findById(finalCategoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Validation error: Category not found" });
    }

    // Fetch and assign the correct vendor_id
    let finalVendorId;
    if (req.user.role === "vendor") {
      const vendorProfile = await Vendor.findOne({ user_id: req.user._id });
      if (!vendorProfile) {
        return res.status(403).json({ message: "Vendor profile not found. Complete your artisan registration first." });
      }
      if (vendorProfile.status !== "active") {
        return res.status(403).json({ message: `Artisan account is currently ${vendorProfile.status}. Product creation is disabled.` });
      }
      finalVendorId = vendorProfile._id;
    } else if (req.user.role === "admin") {
      if (req.body.vendor_id) {
        finalVendorId = req.body.vendor_id;
      } else {
        const vendorProfile = await Vendor.findOne({ user_id: req.user._id });
        if (!vendorProfile) {
          return res.status(400).json({ message: "Admin must specify a 'vendor_id' in body, or create a vendor profile." });
        }
        finalVendorId = vendorProfile._id;
      }
    }

    // Validate Vendor ID exists
    const vendorExists = await Vendor.findById(finalVendorId);
    if (!vendorExists) {
      return res.status(404).json({ message: "Validation error: Vendor profile not found" });
    }

    // Validate discount price strictly less than price
    if (discount_price !== undefined && discount_price !== null) {
      if (Number(discount_price) < 0) return res.status(400).json({ message: "Validation error: Discount price cannot be negative" });
      if (Number(discount_price) >= Number(price)) {
        return res.status(400).json({ message: "Validation error: Discount price must be strictly less than regular price" });
      }
    }

    // Upload files to Cloudinary/Mock
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await uploadImageToCloudinary(file.buffer, "products");
        imageUrls.push(uploadResult.secure_url);
      }
    }

    const productData = {
      name,
      description,
      price: Number(price),
      discount_price: discount_price !== undefined ? Number(discount_price) : undefined,
      category_id: finalCategoryId,
      vendor_id: finalVendorId,
      stock: Number(stock),
      region: region || "Unknown",
      material: material || "Handmade",
      craft_type: craft_type || "Nepalese Handicraft",
      images: imageUrls,
      status: "pending", // Default to pending
    };

    const newProduct = await productService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in createProduct controller:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * POST /api/products/:id/images
 * Add more images to existing product. Ownership checked.
 */
const uploadExtraImages = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByID(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ownership Authorization Check
    if (req.user.role !== "admin") {
      const vendorProfile = await Vendor.findOne({ user_id: req.user._id });
      if (!vendorProfile || product.vendor_id._id.toString() !== vendorProfile._id.toString()) {
        return res.status(403).json({ message: "Access denied. Only the product owner can upload images." });
      }
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Validation error: Please upload at least one image" });
    }

    // Calculate current image count constraint
    if ((product.images.length + req.files.length) > 10) {
      return res.status(400).json({ message: "Validation error: A product cannot have more than 10 images in total." });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const uploadResult = await uploadImageToCloudinary(file.buffer, "products");
      imageUrls.push(uploadResult.secure_url);
    }

    const updatedProduct = await productService.addImages(id, imageUrls);
    res.json({
      success: true,
      message: "Images uploaded successfully",
      images: updatedProduct.images,
    });
  } catch (error) {
    console.error("Error in uploadExtraImages controller:", error);
    res.status(500).json({ message: "Error uploading images", error: error.message });
  }
};

/**
 * PUT /api/products/:id
 * Update product details. Creator or Admin only.
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByID(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ownership Authorization Check
    if (req.user.role !== "admin") {
      const vendorProfile = await Vendor.findOne({ user_id: req.user._id });
      if (!vendorProfile || product.vendor_id._id.toString() !== vendorProfile._id.toString()) {
        return res.status(403).json({ message: "Access denied. Only the product owner can modify details." });
      }
    }

    const updates = { ...req.body };

    // Prevent direct vendor status overriding
    delete updates.status;
    delete updates.images;
    delete updates.avg_rating;

    // Validate fields if provided
    if (updates.price !== undefined) {
      if (isNaN(updates.price) || Number(updates.price) < 0) {
        return res.status(400).json({ message: "Validation error: Price must be a positive number" });
      }
    }
    if (updates.stock !== undefined) {
      if (isNaN(updates.stock) || Number(updates.stock) < 0) {
        return res.status(400).json({ message: "Validation error: Stock cannot be negative" });
      }
    }

    // Auto-resolve Category if name provided
    if (updates.category) {
      const foundCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${updates.category.trim()}$`, "i") },
      });
      if (foundCategory) {
        updates.category_id = foundCategory._id;
      }
    }

    if (updates.category_id) {
      if (!mongoose.Types.ObjectId.isValid(updates.category_id)) {
        return res.status(400).json({ message: "Validation error: Invalid category_id" });
      }
      const categoryExists = await Category.findById(updates.category_id);
      if (!categoryExists) {
        return res.status(404).json({ message: "Validation error: Category not found" });
      }
    }

    // Validate discount price vs regular price
    const finalPrice = updates.price !== undefined ? Number(updates.price) : product.price;
    const finalDiscount = updates.discount_price !== undefined ? Number(updates.discount_price) : product.discount_price;

    if (finalDiscount !== undefined && finalDiscount !== null) {
      if (finalDiscount < 0) return res.status(400).json({ message: "Validation error: Discount price cannot be negative" });
      if (finalDiscount >= finalPrice) {
        return res.status(400).json({ message: "Validation error: Discount price must be strictly less than regular price" });
      }
    }

    const updatedProduct = await productService.updateProduct(id, updates);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error in updateProduct controller:", error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /api/products/:id/approve
 * Admin only. Sets status to "active" or "inactive".
 */
const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Validation error: Status must be active or inactive" });
    }

    const product = await productService.getProductByID(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedProduct = await productService.updateProduct(id, { status });
    res.json({
      success: true,
      message: `Product status updated to ${status}`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in approveProduct controller:", error);
    res.status(500).json({ message: "Error approving product", error: error.message });
  }
};

/**
 * DELETE /api/products/:id
 * Admin only. Deletes product and removes all stored images from Cloudinary.
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByID(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Loop through images and destroy on Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          await deleteImageFromCloudinary(publicId);
        }
      }
    }

    await productService.deleteProduct(id);
    res.json({ success: true, message: "Product and all its Cloudinary assets deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct controller:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

/**
 * DELETE /api/products/:id/images/:imageId
 * Remove one specific image from Cloudinary and pull it from MongoDB images array. Ownership checked.
 */
const deleteSpecificImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const product = await productService.getProductByID(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ownership Authorization Check
    if (req.user.role !== "admin") {
      const vendorProfile = await Vendor.findOne({ user_id: req.user._id });
      if (!vendorProfile || product.vendor_id._id.toString() !== vendorProfile._id.toString()) {
        return res.status(403).json({ message: "Access denied. Only the product owner can delete images." });
      }
    }

    // Find image URL containing the given imageId
    const targetImageUrl = product.images.find(url => url.includes(imageId) || getPublicIdFromUrl(url) === imageId);
    if (!targetImageUrl) {
      return res.status(404).json({ message: "Image not found on this product" });
    }

    // Remove from Cloudinary
    const publicId = getPublicIdFromUrl(targetImageUrl);
    if (publicId) {
      await deleteImageFromCloudinary(publicId);
    }

    // Pull from database array
    const updatedProduct = await productService.removeImage(id, targetImageUrl);
    res.json({
      success: true,
      message: "Image removed successfully",
      images: updatedProduct.images,
    });
  } catch (error) {
    console.error("Error in deleteSpecificImage controller:", error);
    res.status(500).json({ message: "Error deleting image", error: error.message });
  }
};

/* --- REVIEWS CONTROLLERS --- */

/**
 * GET /api/products/:id/reviews
 * Retrieve all reviews for a product.
 */
const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await productService.getReviews(id);
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Error in getProductReviews controller:", error);
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

/**
 * POST /api/products/:id/reviews
 * Add review (buyer only, max 1 per product). Recalculates average rating.
 */
const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (rating === undefined || rating === null) {
      return res.status(400).json({ message: "Validation error: Rating is required" });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Validation error: Rating must be an integer between 1 and 5" });
    }

    // Create review via service (service checks for duplicate reviews automatically)
    const review = await productService.addReview(id, userId, numericRating, comment);
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error in addProductReview controller:", error);
    if (error.message.includes("already reviewed")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};

/**
 * DELETE /api/products/:id/reviews/:reviewId
 * Delete review (owner or admin). Recalculates average rating.
 */
const deleteProductReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    // Delete review via service (service checks permissions and auto recalculates averages)
    await productService.deleteReview(reviewId, userId, isAdmin);

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProductReview controller:", error);
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Not authorized")) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};

/**
 * PATCH /api/products/:id/stock
 * Update stock quantity. Rejects negative values. Vendor/Admin only.
 */
const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: "Validation error: Stock quantity is required" });
    }

    const numericStock = Number(stock);
    if (isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: "Validation error: Stock quantity cannot be negative" });
    }

    const product = await productService.getProductByID(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ownership Authorization Check
    if (req.user.role !== "admin") {
      const vendorProfile = await Vendor.findOne({ user_id: req.user._id });
      if (!vendorProfile || product.vendor_id._id.toString() !== vendorProfile._id.toString()) {
        return res.status(403).json({ message: "Access denied. Only the product owner can update stock." });
      }
    }

    const updatedProduct = await productService.updateStock(id, numericStock);
    res.json({
      success: true,
      message: "Stock quantity updated successfully",
      stock: updatedProduct.stock,
    });
  } catch (error) {
    console.error("Error in updateProductStock controller:", error);
    res.status(500).json({ message: "Error updating stock quantity", error: error.message });
  }
};

export default {
  getAllProducts,
  searchProducts,
  getFeaturedProducts,
  getFirstProduct,
  getProductByID,
  getProductsByCategoryName,
  getProductsByArtisan,
  createProduct,
  uploadExtraImages,
  updateProduct,
  approveProduct,
  deleteProduct,
  deleteSpecificImage,
  getProductReviews,
  addProductReview,
  deleteProductReview,
  updateProductStock,
};
