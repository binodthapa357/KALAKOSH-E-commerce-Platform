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
      if (url.includes("mock_public_id_")) {
        const match = url.match(/mock_public_id_[a-zA-Z0-9_]+/);
        return match ? match[0] : null;
      }
      return null;
    }
    const remainingParts = parts.slice(uploadIndex + 2);
    const publicIdWithExtension = remainingParts.join("/");
    return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."));
  } catch (error) {
    return null;
  }
};

/**
 * GET /api/products
 */
const getAllProducts = async (req, res) => {
  try {
    const { category, region, material, minPrice, maxPrice, sort, page, limit } = req.query;

    const filters = {
      category,
      region,
      material,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    const pagination = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    };

    const includeInactive =
      req.user && req.user.role === "admin" && req.query.includeInactive === "true";

    const result = await productService.getAllProducts(filters, sort, pagination, includeInactive);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SEARCH PRODUCTS
 */
const searchProducts = async (req, res) => {
  try {
    const { q, keyword, category, minPrice, maxPrice, page, limit } = req.query;
    const searchTerm = q || keyword || "";

    const filters = {
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };

    const pagination = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
    };

    const result = await productService.searchProducts(searchTerm, filters, pagination);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * FEATURED PRODUCTS
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * FIRST PRODUCT
 */
const getFirstProduct = async (req, res) => {
  try {
    const product = await productService.getFirstProduct();
    if (!product) return res.status(404).json({ message: "No products exist." });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PRODUCT BY ID
 */
const getProductByID = async (req, res) => {
  try {
    const product = await productService.getProductByID(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });

    const reviews = await productService.getReviews(req.params.id);
    const productObj = product.toObject ? product.toObject() : product;
    productObj.reviews = reviews;

    res.json(productObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CREATE PRODUCT
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, region, material, craft_type, images } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "Missing required fields (name, description, price, stock, category)" });
    }

    let vendorId;
    if (req.user.role === "admin" && req.body.vendor_id) {
      vendorId = req.body.vendor_id;
    } else {
      const vendor = await Vendor.findOne({ user_id: req.user._id });
      if (!vendor) {
        return res.status(403).json({ message: "No vendor profile found for this user account. You must register as a vendor." });
      }
      vendorId = vendor._id;
    }

    let categoryDoc;
    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryDoc = await Category.findById(category);
    } else {
      categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category.trim()}$`, "i") } });
    }

    if (!categoryDoc) {
      return res.status(400).json({ message: `Category '${category}' not found` });
    }

    const productData = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category_id: categoryDoc._id,
      vendor_id: vendorId,
      images: images || [],
      region: region || "Unknown",
      material: material || "Handmade",
      craft_type: craft_type || "Nepalese Handicraft"
    };

    const newProduct = await productService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * UPDATE PRODUCT (ONLY ONE VERSION)
 */
const updateProduct = async (req, res) => {
  try {
    const product = await productService.getProductByID(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Authorization check: Admin or owning vendor
    if (req.user.role !== "admin") {
      const vendor = await Vendor.findOne({ user_id: req.user._id });
      const productVendorId = product.vendor_id._id ? product.vendor_id._id.toString() : product.vendor_id.toString();
      if (!vendor || productVendorId !== vendor._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this product" });
      }
    }

    // Handle category update if name/ID was passed in req.body
    if (req.body.category) {
      let categoryDoc;
      if (mongoose.Types.ObjectId.isValid(req.body.category)) {
        categoryDoc = await Category.findById(req.body.category);
      } else {
        categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${req.body.category.trim()}$`, "i") } });
      }
      if (!categoryDoc) {
        return res.status(400).json({ message: `Category '${req.body.category}' not found` });
      }
      req.body.category_id = categoryDoc._id;
      delete req.body.category;
    }

    const updated = await productService.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE PRODUCT
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await productService.getProductByID(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Authorization check: Admin or owning vendor
    if (req.user.role !== "admin") {
      const vendor = await Vendor.findOne({ user_id: req.user._id });
      const productVendorId = product.vendor_id._id ? product.vendor_id._id.toString() : product.vendor_id.toString();
      if (!vendor || productVendorId !== vendor._id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this product" });
      }
    }

    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PRODUCTS BY CATEGORY NAME
 */
const getProductsByCategoryName = async (req, res) => {
  try {
    const products = await productService.getProductsByCategory(req.category._id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PRODUCTS BY ARTISAN / VENDOR ID
 */
const getProductsByArtisan = async (req, res) => {
  try {
    const products = await productService.getProductsByArtisan(req.params.id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPLOAD EXTRA IMAGES TO PRODUCT
 */
const uploadExtraImages = async (req, res) => {
  try {
    const product = await productService.getProductByID(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Enforce owner/admin check
    if (req.user.role !== "admin") {
      const vendor = await Vendor.findOne({ user_id: req.user._id });
      const productVendorId = product.vendor_id._id ? product.vendor_id._id.toString() : product.vendor_id.toString();
      if (!vendor || productVendorId !== vendor._id.toString()) {
        return res.status(403).json({ message: "Not authorized to modify this product" });
      }
    }

    // Parse images from req.files or mock if empty
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadImageToCloudinary(file.buffer);
        imageUrls.push(result.secure_url);
      }
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      // Mock upload fallback
      imageUrls = [`https://picsum.photos/seed/mock_public_id_${Date.now()}/800/600`];
    }

    const updated = await productService.addImages(req.params.id, imageUrls);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * APPROVE / REJECT PRODUCT LISTING (ADMIN ONLY)
 */
const approveProduct = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'active' or 'inactive'" });
    }

    const updated = await productService.updateProduct(req.params.id, { status });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE SPECIFIC IMAGE BY IMAGE ID / SUBSTRING
 */
const deleteSpecificImage = async (req, res) => {
  try {
    const product = await productService.getProductByID(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Enforce owner/admin check
    if (req.user.role !== "admin") {
      const vendor = await Vendor.findOne({ user_id: req.user._id });
      const productVendorId = product.vendor_id._id ? product.vendor_id._id.toString() : product.vendor_id.toString();
      if (!vendor || productVendorId !== vendor._id.toString()) {
        return res.status(403).json({ message: "Not authorized to modify this product" });
      }
    }

    const targetImage = product.images.find(img => img.includes(req.params.imageId));
    if (!targetImage) {
      return res.status(404).json({ message: "Image not found on this product" });
    }

    // Delete from Cloudinary
    const publicId = getPublicIdFromUrl(targetImage);
    if (publicId) {
      await deleteImageFromCloudinary(publicId);
    }

    // Remove from database
    const updated = await productService.removeImage(req.params.id, targetImage);
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * GET ALL REVIEWS FOR A PRODUCT
 */
const getProductReviews = async (req, res) => {
  try {
    const reviews = await productService.getReviews(req.params.id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADD REVIEW TO A PRODUCT (BUYER ONLY)
 */
const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const review = await productService.addReview(
      req.params.id,
      req.user._id,
      Number(rating),
      comment
    );
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE REVIEW (OWNER / ADMIN ONLY)
 */
const deleteProductReview = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    await productService.deleteReview(req.params.reviewId, req.user._id, isAdmin);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * UPDATE PRODUCT STOCK
 */
const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ message: "Stock must be a non-negative number" });
    }

    const product = await productService.getProductByID(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Enforce owner/admin check
    if (req.user.role !== "admin") {
      const vendor = await Vendor.findOne({ user_id: req.user._id });
      const productVendorId = product.vendor_id._id ? product.vendor_id._id.toString() : product.vendor_id.toString();
      if (!vendor || productVendorId !== vendor._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this product" });
      }
    }

    const updated = await productService.updateStock(req.params.id, stock);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * EXPORT
 */
export default {
  getAllProducts,
  searchProducts,
  getFeaturedProducts,
  getFirstProduct,
  getProductByID,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategoryName,
  getProductsByArtisan,
  uploadExtraImages,
  approveProduct,
  deleteSpecificImage,
  getProductReviews,
  addProductReview,
  deleteProductReview,
  updateProductStock,
};