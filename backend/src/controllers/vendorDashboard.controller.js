import mongoose from "mongoose";
import Vendor from "../models/Vendor.model.js";
import Product from "../models/Product.model.js";
import OrderItem from "../models/OrderItem.model.js";
import Category from "../models/Category.model.js";
import { uploadImageToCloudinary } from "../config/cloudinary.config.js";

/**
 * @desc    Get logged-in vendor profile details
 * @route   GET /api/vendor/me
 * @access  Private (Vendor only)
 */
export const getVendorMe = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user._id }).populate("user_id", "name email");
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    res.status(200).json({
      shopName: vendor.shop_name,
      ownerName: req.user.name,
      email: req.user.email,
      location: "Nepal",
      rating: 5.0,
      joinedAt: vendor.createdAt,
      status: vendor.status,
      panNumber: vendor.pan_number,
      panPhoto: vendor.pan_photo,
      bankDetails: vendor.bank_details,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in vendor's products
 * @route   GET /api/vendor/products
 * @access  Private (Vendor only)
 */
export const getVendorProducts = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const products = await Product.find({ vendor_id: vendor._id }).sort({ createdAt: -1 });

    const mapped = products.map((p) => ({
      id: p._id,
      name: p.name,
      image: p.images?.[0] || "/images/placeholder.png",
      price: p.price,
      stock: p.stock,
      status: p.stock <= 0 ? "out_of_stock" : p.status === "active" ? "active" : "draft",
    }));

    res.status(200).json(mapped);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    List a new product under logged-in vendor
 * @route   POST /api/vendor/products
 * @access  Private (Vendor only)
 */
export const createVendorProduct = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const {
      name,
      description,
      price,
      discount_price,
      stock,
      category_id,
      region,
      material,
      craft_type,
    } = req.body;

    if (!name || !description || !price || !stock || !category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let categoryDoc;
    if (mongoose.Types.ObjectId.isValid(category_id)) {
      categoryDoc = await Category.findById(category_id);
    } else {
      categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category_id.trim()}$`, "i") } });
    }

    if (!categoryDoc) {
      return res.status(400).json({ message: `Category '${category_id}' not found` });
    }

    // Process files
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadImageToCloudinary(file.buffer, "products");
        imageUrls.push(result.secure_url);
      }
    } else if (req.file) {
      const result = await uploadImageToCloudinary(req.file.buffer, "products");
      imageUrls.push(result.secure_url);
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discount_price: discount_price ? Number(discount_price) : undefined,
      stock: Number(stock),
      category_id: categoryDoc._id,
      vendor_id: vendor._id,
      images: imageUrls,
      region: region || "Unknown",
      material: material || "Handmade",
      craft_type: craft_type || "Nepalese Handicraft",
      status: "active",
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in vendor's orders (linked via OrderItems)
 * @route   GET /api/vendor/orders
 * @access  Private (Vendor only)
 */
export const getVendorOrders = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }

    const orderItems = await OrderItem.find({ vendor_id: vendor._id })
      .populate("product_id")
      .populate({
        path: "order_id",
        populate: { path: "user_id", select: "name" },
      })
      .sort({ createdAt: -1 });

    const mapped = orderItems.map((item) => ({
      id: item._id,
      productName: item.product_id?.name || "Deleted Product",
      productImage: item.product_id?.images?.[0] || "/images/placeholder.png",
      buyer: item.order_id?.user_id?.name || "Guest Customer",
      date: item.createdAt,
      status: item.item_status || "pending",
      total: item.price_at_purchase * item.quantity,
    }));

    res.status(200).json(mapped);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order item status (fulfill / processing / shipped / delivered)
 * @route   PATCH /api/vendor/orders/:id
 * @access  Private (Vendor only)
 */
export const updateVendorOrderItem = async (req, res, next) => {
  try {
    const item = await OrderItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // Verify vendor ownership
    const vendor = await Vendor.findOne({ user_id: req.user._id });
    if (!vendor || item.vendor_id.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this order item" });
    }

    const { status } = req.body;
    const allowed = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    item.item_status = status;
    await item.save();

    res.status(200).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

export default {
  getVendorMe,
  getVendorProducts,
  createVendorProduct,
  getVendorOrders,
  updateVendorOrderItem,
};
