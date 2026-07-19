import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Vendor from "../models/Vendor.model.js";
import Order from "../models/Order.model.js";
import Review from "../models/Review.model.js";
import { uploadImageToCloudinary } from "../config/cloudinary.config.js";

/**
 * @desc    Get Admin Dashboard Stats (counts by status + revenue)
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      userActiveCount,
      userInactiveCount,
      productActiveCount,
      productPendingCount,
      productInactiveCount,
      vendorActiveCount,
      vendorPendingCount,
      vendorSuspendedCount,
      vendorRejectedCount,
      orderPendingCount,
      orderProcessingCount,
      orderShippedCount,
      orderDeliveredCount,
      orderCancelledCount,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ is_active: true }),
      User.countDocuments({ is_active: false }),
      Product.countDocuments({ status: "active" }),
      Product.countDocuments({ status: "pending" }),
      Product.countDocuments({ status: "inactive" }),
      Vendor.countDocuments({ status: "active" }),
      Vendor.countDocuments({ status: "pending" }),
      Vendor.countDocuments({ status: "suspended" }),
      Vendor.countDocuments({ status: "rejected" }),
      Order.countDocuments({ order_status: "pending" }),
      Order.countDocuments({ order_status: "processing" }),
      Order.countDocuments({ order_status: "shipped" }),
      Order.countDocuments({ order_status: "delivered" }),
      Order.countDocuments({ order_status: "cancelled" }),
      Order.aggregate([
        { $match: { payment_status: "paid" } },
        { $group: { _id: null, total: { $sum: "$total_amount" } } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        users: {
          active: userActiveCount,
          suspended: userInactiveCount,
          total: userActiveCount + userInactiveCount,
        },
        products: {
          active: productActiveCount,
          pending: productPendingCount,
          inactive: productInactiveCount,
          total: productActiveCount + productPendingCount + productInactiveCount,
        },
        vendors: {
          active: vendorActiveCount,
          pending: vendorPendingCount,
          suspended: vendorSuspendedCount,
          rejected: vendorRejectedCount,
          total: vendorActiveCount + vendorPendingCount + vendorSuspendedCount + vendorRejectedCount,
        },
        orders: {
          pending: orderPendingCount,
          processing: orderProcessingCount,
          shipped: orderShippedCount,
          delivered: orderDeliveredCount,
          cancelled: orderCancelledCount,
          total: orderPendingCount + orderProcessingCount + orderShippedCount + orderDeliveredCount + orderCancelledCount,
        },
        revenue: {
          total: totalRevenue,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed list of users with status filters
 * @route   GET /api/admin/users
 * @access  Private (Admin Only)
 */
export const getUsersList = async (req, res, next) => {
  try {
    const { is_active, role } = req.query;
    const filter = {};

    if (is_active !== undefined) {
      filter.is_active = is_active === "true";
    }
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active status (suspend / activate)
 * @route   PATCH /api/admin/users/:id/toggle-status
 * @access  Private (Admin Only)
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.is_active = !user.is_active;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.is_active ? "activated" : "suspended"} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed list of products with status filters
 * @route   GET /api/admin/products
 * @access  Private (Admin Only)
 */
export const getProductsList = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const products = await Product.find(filter)
      .populate("category_id", "name")
      .populate("vendor_id", "shop_name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed list of vendors with status filters
 * @route   GET /api/admin/vendors
 * @access  Private (Admin Only)
 */
export const getVendorsList = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const vendors = await Vendor.find(filter)
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update vendor status (active / suspended / rejected)
 * @route   PATCH /api/admin/vendors/:id/status
 * @access  Private (Admin Only)
 */
export const updateVendorStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["active", "pending", "suspended", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.status = status;
    await vendor.save();

    // If approved, ensure user has the vendor role
    if (status === "active") {
      await User.findByIdAndUpdate(vendor.user_id, { role: "vendor" });
    }

    const populatedVendor = await Vendor.findById(vendor._id).populate("user_id", "name email");

    res.status(200).json({ success: true, vendor: populatedVendor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get paginated list of all orders
 * @route   GET /api/admin/orders
 * @access  Private (Admin Only)
 */
export const getOrdersList = async (req, res, next) => {
  try {
    const { order_status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (order_status) {
      filter.order_status = order_status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user_id", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed list of reviews
 * @route   GET /api/admin/reviews
 * @access  Private (Admin Only)
 */
export const getReviewsList = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user_id", "name email")
      .populate("product_id", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a review as admin
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private (Admin Only)
 */
export const deleteReviewAdmin = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully by Admin",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload an image to Cloudinary (General purpose)
 * @route   POST /api/admin/upload
 * @access  Private (Admin Only)
 */
export const uploadImageAdmin = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const folder = req.query.folder || "general";
    const result = await uploadImageToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getUsersList,
  toggleUserStatus,
  getProductsList,
  getVendorsList,
  updateVendorStatus,
  getOrdersList,
  getReviewsList,
  deleteReviewAdmin,
  uploadImageAdmin,
};
