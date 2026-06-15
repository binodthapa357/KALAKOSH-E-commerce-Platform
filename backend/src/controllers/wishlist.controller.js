import Wishlist from "../models/Wishlist.model.js";
import Product from "../models/Product.model.js";

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user_id: req.user._id }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user_id: req.user._id, products: [] });
    }
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle product in wishlist (add if not exists, remove if it does)
 * @route   POST /api/wishlist
 * @access  Private
 */
export const toggleWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user_id: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user_id: req.user._id, products: [] });
    }

    const prodIndex = wishlist.products.indexOf(product_id);
    let message = "";
    if (prodIndex > -1) {
      wishlist.products.splice(prodIndex, 1);
      message = "Product removed from wishlist successfully";
    } else {
      wishlist.products.push(product_id);
      message = "Product added to wishlist successfully";
    }

    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json({ success: true, message, wishlist });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove specific product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user_id: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json({ success: true, message: "Product removed from wishlist", wishlist });
  } catch (error) {
    next(error);
  }
};

export default {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
};
