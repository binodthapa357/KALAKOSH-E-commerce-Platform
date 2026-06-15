import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id }).populate("items.product_id");
    if (!cart) {
      cart = await Cart.create({ user_id: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to cart
 * @route   POST /api/cart
 * @access  Private
 */
export const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status !== "active") {
      return res.status(400).json({ message: "Cannot add inactive product to cart" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} items left.` });
    }

    let cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      cart = new Cart({ user_id: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === product_id);
    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + qty;
      if (product.stock < newQty) {
        return res.status(400).json({ message: `Insufficient stock. Adding this would exceed available stock (${product.stock}).` });
      }
      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].price_at_add = product.price;
    } else {
      cart.items.push({
        product_id,
        quantity: qty,
        price_at_add: product.price,
      });
    }

    await cart.save();
    await cart.populate("items.product_id");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update quantity of a cart item
 * @route   PUT /api/cart
 * @access  Private
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const qty = Number(quantity);

    if (!product_id || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    if (qty <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < qty) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} items left.` });
    }

    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.product_id.toString() === product_id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = qty;
    cart.items[itemIndex].price_at_add = product.price;

    await cart.save();
    await cart.populate("items.product_id");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product_id.toString() !== productId);
    await cart.save();
    await cart.populate("items.product_id");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear user's cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
