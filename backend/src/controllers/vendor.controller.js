import Vendor from "../models/Vendor.model.js";
import Product from "../models/Product.model.js";

/**
 * @desc    Get all active vendors/artisans
 * @route   GET /api/vendors
 * @access  Public
 */
export const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({ status: "active" })
      .populate("user_id", "name email");

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
 * @desc    Get a single vendor and their active products
 * @route   GET /api/vendors/:id
 * @access  Public
 */
export const getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate("user_id", "name email");

    if (!vendor || vendor.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Artisan not found or inactive",
      });
    }

    // Fetch this artisan's active products
    const products = await Product.find({
      vendor_id: vendor._id,
      status: "active",
    }).populate("category_id", "name slug");

    res.status(200).json({
      success: true,
      vendor,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllVendors,
  getVendorById,
};
