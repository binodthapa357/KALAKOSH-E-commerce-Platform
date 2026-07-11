import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Vendor from "../models/Vendor.model.js";
import Order from "../models/Order.model.js";

/**
 * @desc    Get Admin Dashboard Stats (counts by status)
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userActiveCount = await User.countDocuments({ is_active: true });
    const userInactiveCount = await User.countDocuments({ is_active: false });

    const productActiveCount = await Product.countDocuments({ status: "active" });
    const productPendingCount = await Product.countDocuments({ status: "pending" });
    const productInactiveCount = await Product.countDocuments({ status: "inactive" });

    const vendorActiveCount = await Vendor.countDocuments({ status: "active" });
    const vendorPendingCount = await Vendor.countDocuments({ status: "pending" });
    const vendorSuspendedCount = await Vendor.countDocuments({ status: "suspended" });
    const vendorRejectedCount = await Vendor.countDocuments({ status: "rejected" });

    const orderPendingCount = await Order.countDocuments({ order_status: "pending" });
    const orderProcessingCount = await Order.countDocuments({ order_status: "processing" });
    const orderShippedCount = await Order.countDocuments({ order_status: "shipped" });
    const orderDeliveredCount = await Order.countDocuments({ order_status: "delivered" });
    const orderCancelledCount = await Order.countDocuments({ order_status: "cancelled" });

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

export default {
  getDashboardStats,
  getUsersList,
  getProductsList,
  getVendorsList,
};
