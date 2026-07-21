import mongoose from "mongoose";
import Order from "../models/Order.model.js";
import OrderItem from "../models/OrderItem.model.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import Vendor from "../models/Vendor.model.js";
import User from "../models/User.model.js";

/**
 * @desc    Create a new order from active user's cart
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { shipping_address, payment_method, discount } = req.body;

    if (!shipping_address || !payment_method) {
      return res.status(400).json({ message: "Shipping address and payment method are required" });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user_id: req.user._id }).session(session);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    let subtotal = 0;
    const itemsToCreate = [];

    // Verify stock and calculate subtotal
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product_id).session(session);
      if (!product) {
        throw new Error(`Product not found: ${cartItem.product_id}`);
      }

      if (product.status !== "active") {
        throw new Error(`Product ${product.name} is no longer active`);
      }

      if (product.stock < cartItem.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}. Only ${product.stock} left.`);
      }

      subtotal += product.price * cartItem.quantity;

      itemsToCreate.push({
        product_id: product._id,
        vendor_id: product.vendor_id,
        quantity: cartItem.quantity,
        price_at_purchase: product.price,
        productDoc: product, // keep reference to update stock later
      });
    }

    // Dynamic shipping fee based on Nepalese regions and 5000 NPR free threshold
    let shipping_cost = 150;
    if (subtotal >= 5000) {
      shipping_cost = 0;
    } else {
      const normalizedCity = shipping_address.city ? shipping_address.city.trim().toLowerCase() : "";
      const normalizedState = shipping_address.state ? shipping_address.state.trim().toLowerCase() : "";

      if (
        ["kathmandu", "lalitpur", "bhaktapur", "kirtipur"].includes(normalizedCity) ||
        normalizedState === "bagmati"
      ) {
        shipping_cost = 100;
      } else if (
        ["pokhara", "biratnagar", "butwal", "chitwan", "dharan", "birgunj", "nepalgunj", "hentauda", "itahari"].includes(
          normalizedCity
        )
      ) {
        shipping_cost = 150;
      } else if (
        [
          "solukhumbu",
          "mustang",
          "manang",
          "dolpa",
          "jumla",
          "humla",
          "mugu",
          "kalikot",
          "darchula",
          "taplejung",
          "sankhuwasabha",
        ].includes(normalizedCity)
      ) {
        shipping_cost = 250;
      } else {
        shipping_cost = 200;
      }
    }

    const discountAmt = Number(discount) || 0;
    let total_amount = subtotal + shipping_cost - discountAmt;
    if (total_amount < 0) total_amount = 0;

    // Create the Order document
    const order = new Order({
      user_id: req.user._id,
      subtotal,
      shipping_cost,
      discount: discountAmt,
      total_amount,
      shipping_address,
      payment_method,
      payment_status: "pending",
      order_status: "pending",
    });

    await order.save({ session });

    // Create OrderItems and decrease stock
    for (const item of itemsToCreate) {
      await OrderItem.create(
        [
          {
            order_id: order._id,
            product_id: item.product_id,
            vendor_id: item.vendor_id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            item_status: "pending",
          },
        ],
        { session }
      );

      // Decrement product stock
      item.productDoc.stock -= item.quantity;
      await item.productDoc.save({ session });
    }

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Fetch order items to return
    const orderItems = await OrderItem.find({ order_id: order._id }).populate("product_id");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
      items: orderItems,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/me
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    
    const ordersWithItems = [];
    for (const order of orders) {
      const items = await OrderItem.find({ order_id: order._id }).populate({
        path: "product_id",
        populate: { path: "vendor_id", select: "shop_name" }
      });
      ordersWithItems.push({
        ...order.toObject(),
        items
      });
    }

    res.status(200).json({ success: true, orders: ordersWithItems });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order details by ID (Accessible by owner, admin, or vendor of order item)
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    let isAuthorizedVendor = false;

    // Load order items
    const items = await OrderItem.find({ order_id: order._id }).populate("product_id");

    if (!isOwner && !isAdmin) {
      const vendor = await Vendor.findOne({ user_id: req.user._id });
      if (vendor) {
        const hasVendorItem = items.some((item) => item.vendor_id.toString() === vendor._id.toString());
        if (hasVendorItem) {
          isAuthorizedVendor = true;
        }
      }
    }

    if (!isOwner && !isAdmin && !isAuthorizedVendor) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    // If it is a vendor, filter order items to show only theirs
    let filteredItems = items;
    if (!isAdmin && !isOwner && isAuthorizedVendor) {
      const vendor = await Vendor.findOne({ user_id: req.user._id });
      filteredItems = items.filter((item) => item.vendor_id.toString() === vendor._id.toString());
    }

    res.status(200).json({
      success: true,
      order,
      items: filteredItems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders (Admin Only)
 * @route   GET /api/orders
 * @access  Private (Admin Only)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user_id", "name email");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order overall status (Admin Only)
 * @route   PUT /api/orders/:id/status
 * @access  Private (Admin Only)
 */
export const updateOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { order_status, payment_status } = req.body;
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.order_status;

    if (order_status) {
      order.order_status = order_status;
    }
    if (payment_status) {
      order.payment_status = payment_status;
    }

    await order.save({ session });

    // If status transitioned to cancelled, refund stock
    if (order_status === "cancelled" && oldStatus !== "cancelled") {
      const items = await OrderItem.find({ order_id: order._id }).session(session);
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product_id, { $inc: { stock: item.quantity } }).session(session);
        item.item_status = "cancelled";
        await item.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Order status updated successfully", order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update individual OrderItem status (Vendor of the product or Admin only)
 * @route   PUT /api/orders/items/:orderItemId/status
 * @access  Private (Vendor / Admin)
 */
export const updateOrderItemStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { status } = req.body;
    const { orderItemId } = req.params;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const orderItem = await OrderItem.findById(orderItemId).session(session);
    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    // Check authorization: must be admin OR vendor who owns this orderItem's vendor_id
    if (req.user.role !== "admin") {
      const vendor = await Vendor.findOne({ user_id: req.user._id }).session(session);
      if (!vendor || orderItem.vendor_id.toString() !== vendor._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this order item" });
      }
    }

    const oldItemStatus = orderItem.item_status;
    orderItem.item_status = status;
    await orderItem.save({ session });

    // If item cancelled, refund stock
    if (status === "cancelled" && oldItemStatus !== "cancelled") {
      await Product.findByIdAndUpdate(orderItem.product_id, { $inc: { stock: orderItem.quantity } }).session(session);
    }

    // Auto-update overall order status based on sibling item statuses
    const siblingItems = await OrderItem.find({ order_id: orderItem.order_id }).session(session);
    const allStatuses = siblingItems.map((item) => (item._id.toString() === orderItemId ? status : item.item_status));

    let newParentStatus = null;
    if (allStatuses.every((s) => s === "delivered")) {
      newParentStatus = "delivered";
    } else if (allStatuses.every((s) => s === "shipped" || s === "delivered")) {
      newParentStatus = "shipped";
    } else if (allStatuses.some((s) => s === "processing" || s === "shipped")) {
      newParentStatus = "processing";
    } else if (allStatuses.every((s) => s === "cancelled")) {
      newParentStatus = "cancelled";
    }

    if (newParentStatus) {
      await Order.findByIdAndUpdate(orderItem.order_id, { order_status: newParentStatus }).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Order item status updated successfully",
      orderItem,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, email } = req.query;

    if (!orderNumber || !email) {
      return res.status(400).json({ message: "Order number and email are required to track an order" });
    }

    // Find the user by email
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email address" });
    }

    // Find the order by order_number and user_id
    const order = await Order.findOne({
      order_number: orderNumber.trim().toUpperCase(),
      user_id: user._id
    });

    if (!order) {
      return res.status(404).json({ message: "No order found matching those details" });
    }

    // Get order items as well for detail display
    const items = await OrderItem.find({ order_id: order._id })
      .populate("product_id", "name price images region material");

    res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        order_number: order.order_number,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        discount: order.discount,
        total_amount: order.total_amount,
        shipping_address: order.shipping_address,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      items
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderItemStatus,
  trackOrder,
};
