import mongoose from "mongoose";
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import Review from "../models/Review.model.js";

/**
 * Fetch all products based on pagination, sorting, and filters.
 * Only returns active products by default unless includeInactive is true.
 */
const getAllProducts = async (
  filters = {},
  sortOption = "newest",
  pagination = { page: 1, limit: 12 },
  includeInactive = false
) => {
  const query = {};

  if (!includeInactive) {
    query.status = "active";
  } else if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    if (mongoose.Types.ObjectId.isValid(filters.category)) {
      query.category_id = filters.category;
    } else {
      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${filters.category.trim()}$`, "i") },
      });
      if (!category) {
        return { products: [], total: 0, page: 1, limit: 12, totalPages: 0 };
      }
      query.category_id = category._id;
    }
  }

  if (filters.region) {
    query.region = { $regex: new RegExp(filters.region.trim(), "i") };
  }

  if (filters.material) {
    query.material = { $regex: new RegExp(filters.material.trim(), "i") };
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

  let sort = { createdAt: -1 };
  if (sortOption === "price") sort = { price: 1 };
  if (sortOption === "-price") sort = { price: -1 };
  if (sortOption === "rating") sort = { avg_rating: -1 };

  const page = Math.max(1, Number(pagination.page) || 1);
  const limit = Math.max(1, Number(pagination.limit) || 12);
  const skip = (page - 1) * limit;

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
 * Search products
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
      if (category) query.category_id = category._id;
    }
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  const page = Math.max(1, Number(pagination.page) || 1);
  const limit = Math.max(1, Number(pagination.limit) || 12);
  const skip = (page - 1) * limit;

  return await Product.find(query)
    .populate("category_id", "name slug")
    .populate("vendor_id", "shop_name status")
    .skip(skip)
    .limit(limit);
};

const getFeaturedProducts = async () => {
  return await Product.find({ status: "active" })
    .populate("category_id", "name slug")
    .populate("vendor_id", "shop_name status")
    .sort({ avg_rating: -1, createdAt: -1 })
    .limit(8);
};

const getFirstProduct = async () => {
  return await Product.findOne()
    .populate("category_id", "name slug")
    .populate("vendor_id", "shop_name status");
};

const getProductByID = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return await Product.findById(id)
    .populate("category_id", "name slug")
    .populate("vendor_id", "shop_name status");
};

const getProductsByCategory = async (categoryId) => {
  return await Product.find({
    category_id: categoryId,
    status: "active",
  }).populate("category_id vendor_id");
};

const getProductsByArtisan = async (vendorId) => {
  return await Product.find({
    vendor_id: vendorId,
    status: "active",
  }).populate("category_id vendor_id");
};

const createProduct = async (data) => {
  return await Product.create(data);
};

const updateProduct = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteProduct = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Product.findByIdAndDelete(id);
};

const addImages = async (id, imageUrls) => {
  return await Product.findByIdAndUpdate(
    id,
    { $push: { images: { $each: imageUrls } } },
    { new: true }
  );
};

const removeImage = async (id, imageUrl) => {
  return await Product.findByIdAndUpdate(
    id,
    { $pull: { images: imageUrl } },
    { new: true }
  );
};

const updateStock = async (id, stock) => {
  return await Product.findByIdAndUpdate(
    id,
    { stock: Number(stock) },
    { new: true, runValidators: true }
  );
};

/* REVIEWS */

const getReviews = async (productId) => {
  return await Review.find({ product_id: productId }).populate(
    "user_id",
    "name email"
  );
};

const addReview = async (productId, userId, rating, comment) => {
  const exists = await Review.findOne({
    product_id: productId,
    user_id: userId,
  });

  if (exists) throw new Error("You have already reviewed this product");

  return await Review.create({
    product_id: productId,
    user_id: userId,
    rating,
    comment,
  });
};

const deleteReview = async (reviewId, userId, isAdmin) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (
    review.user_id.toString() !== userId.toString() &&
    !isAdmin
  ) {
    throw new Error("Not authorized to delete this review");
  }

  await Review.findByIdAndDelete(reviewId);
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