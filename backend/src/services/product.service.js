import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import Vendor from "../models/Vendor.model.js";
import Review from "../models/Review.model.js";

/**
 * Fetch all products based on pagination, sorting, and filters.
 * Only returns active products by default unless includeInactive is true.
 */
const getAllProducts = async (filters = {}, sortOption = "newest", pagination = { page: 1, limit: 12 }, includeInactive = false) => {
  const query = {};

  // Default to only active products for public view
  if (!includeInactive) {
    query.status = "active";
  } else if (filters.status) {
    query.status = filters.status;
  }

  // Filter by category (could be Category ID or Category name)
  if (filters.category) {
    if (mongoose.Types.ObjectId.isValid(filters.category)) {
      query.category_id = filters.category;
    } else {
      // Find category by name (case-insensitive)
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${filters.category.trim()}$`, "i") },
      });
      if (category) {
        query.category_id = category._id;
      } else {
        // Category not found, return empty result quickly
        return { products: [], total: 0, page: pagination.page, limit: pagination.limit };
      }
    }
  }

  // Filter by region (case-insensitive regex match)
  if (filters.region) {
    query.region = { $regex: new RegExp(filters.region.trim(), "i") };
  }

  // Filter by material (case-insensitive regex match)
  if (filters.material) {
    query.material = { $regex: new RegExp(filters.material.trim(), "i") };
  }

  // Filter by price range
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      query.price.$gte = Number(filters.minPrice);
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      query.price.$lte = Number(filters.maxPrice);
    }
  }

  // Determine sort options
  let sort = { createdAt: -1 }; // default: newest
  if (sortOption === "price") {
    sort = { price: 1 };
  } else if (sortOption === "-price") {
    sort = { price: -1 };
  } else if (sortOption === "rating") {
    sort = { avg_rating: -1 };
  } else if (sortOption === "newest") {
    sort = { createdAt: -1 };
  }

  const page = Math.max(1, Number(pagination.page) || 1);
  const limit = Math.max(1, Number(pagination.limit) || 12);
  const skip = (page - 1) * limit;

  // Execute query with total count
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category_id", "name slug")
      .populate("vendor_id", "shop_name status")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Keyword search on Product name, description and region using MongoDB text index.
 */
const searchProducts = async (keyword, filters = {}, pagination = { page: 1, limit: 12 }) => {
  const query = { status: "active" };

  if (keyword) {
    query.$text = { $search: keyword };
  }

  if (filters.category) {
    if (mongoose.Types.ObjectId.isValid(filters.category)) {
      query.category_id = filters.category;
    } else {
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${filters.category.trim()}$`, "i") },
      });
      if (category) {
        query.category_id = category._id;
      } else {
        return { products: [], total: 0, page: pagination.page, limit: pagination.limit };
      }
    }
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined && !isNaN(filters.minPrice)) {
      query.price.$gte = Number(filters.minPrice);
    }
    if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice)) {
      query.price.$lte = Number(filters.maxPrice);
    }
  }

  const page = Math.max(1, Number(pagination.page) || 1);
  const limit = Math.max(1, Number(pagination.limit) || 12);
  const skip = (page - 1) * limit;

  // Score search relevance if keyword is provided
  const projection = keyword ? { score: { $meta: "textScore" } } : {};
  const sort = keyword ? { score: { $meta: "textScore" } } : { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(query, projection)
      .populate("category_id", "name slug")
      .populate("vendor_id", "shop_name status")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Top 8 featured products based on highest average ratings.
 */
const getFeaturedProducts = async () => {
  return await Product.find({ status: "active" })
    .populate("category_id", "name slug")
    .populate("vendor_id", "shop_name status")
    .sort({ avg_rating: -1, createdAt: -1 })
    .limit(8);
};

/**
 * Get the very first product (mainly used for legacy/tests).
 */
const getFirstProduct = async () => {
  return await Product.findOne().populate("category_id", "name slug").populate("vendor_id", "shop_name status");
};

/**
 * Get product by ID with full populated category and vendor details.
 */
const getProductByID = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findById(id)
    .populate("category_id", "name slug parent_category")
    .populate("vendor_id", "shop_name user_id status commission_rate");
};

/**
 * Get all active products in a specific category.
 */
const getProductsByCategory = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) return [];
  return await Product.find({ category_id: categoryId, status: "active" })
    .populate("category_id", "name slug")
    .populate("vendor_id", "shop_name status");
};

/**
 * Get all active products by a specific artisan (vendor).
 */
const getProductsByArtisan = async (vendorId) => {
  if (!mongoose.Types.ObjectId.isValid(vendorId)) return [];
  return await Product.find({ vendor_id: vendorId, status: "active" })
    .populate("category_id", "name slug")
    .populate("vendor_id", "shop_name status");
};

/**
 * Create a new product.
 */
const createProduct = async (data) => {
  return await Product.create(data);
};

/**
 * Update product details.
 */
const updateProduct = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate("category_id", "name slug")
    .populate("vendor_id", "shop_name status");
};

/**
 * Delete a product.
 */
const deleteProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findByIdAndDelete(id);
};

/**
 * Add images to a product.
 */
const addImages = async (id, imageUrls) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findByIdAndUpdate(
    id,
    { $push: { images: { $each: imageUrls } } },
    { new: true }
  );
};

/**
 * Remove a specific image from product images array.
 */
const removeImage = async (id, imageUrl) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findByIdAndUpdate(
    id,
    { $pull: { images: imageUrl } },
    { new: true }
  );
};

/**
 * Update stock quantity.
 */
const updateStock = async (id, stock) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findByIdAndUpdate(
    id,
    { stock: Number(stock) },
    { new: true, runValidators: true }
  );
};

/* --- REVIEW METHODS --- */

/**
 * Fetch all reviews for a product.
 */
const getReviews = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) return [];
  return await Review.find({ product_id: productId })
    .populate("user_id", "name email")
    .sort({ createdAt: -1 });
};

/**
 * Add a review for a product.
 */
const addReview = async (productId, userId, rating, comment) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  // Check if review already exists
  const existingReview = await Review.findOne({ user_id: userId, product_id: productId });
  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  const review = await Review.create({
    user_id: userId,
    product_id: productId,
    rating,
    comment,
  });

  return review;
};

/**
 * Delete a review from a product.
 */
const deleteReview = async (reviewId, userId, isAdmin) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error("Invalid review ID");
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }

  // Check ownership unless user is Admin
  if (review.user_id.toString() !== userId.toString() && !isAdmin) {
    throw new Error("Not authorized to delete this review");
  }

  await Review.findByIdAndDelete(reviewId);
  return review;
};

export default {
  getAllProducts,
  searchProducts,
  getFeaturedProducts,
  getFirstProduct,
  getProductByID,
  getProductsByCategory,
  getProductsByArtisan,
  createProduct,
  updateProduct,
  deleteProduct,
  addImages,
  removeImage,
  updateStock,
  getReviews,
  addReview,
  deleteReview,
};
