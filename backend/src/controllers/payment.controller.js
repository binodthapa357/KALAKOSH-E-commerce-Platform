import mongoose from "mongoose";
import Order from "../models/Order.model.js";
import OrderItem from "../models/OrderItem.model.js";

/**
 * @desc    Verify eSewa payment callback
 * @route   POST /api/payments/verify/esewa
 * @access  Public (Simulation)
 */
export const verifyESewa = async (req, res, next) => {
  try {
    const { oid, amt, refId } = req.body;

    if (!oid || !amt || !refId) {
      return res.status(400).json({ message: "Missing required eSewa parameters: oid, amt, refId" });
    }

    let order;
    if (oid.startsWith("KLK-")) {
      order = await Order.findOne({ order_number: oid });
    } else if (mongoose.Types.ObjectId.isValid(oid)) {
      order = await Order.findById(oid);
    }

    if (!order) {
      return res.status(404).json({ message: `Order not found for oid: ${oid}` });
    }

    // Check payment amount
    if (Number(amt) !== order.total_amount) {
      return res.status(400).json({
        message: `Amount mismatch. eSewa paid amount is ${amt}, but order total is ${order.total_amount}`,
      });
    }

    // Transition Order status
    order.payment_status = "paid";
    order.order_status = "confirmed";
    await order.save();

    // Mark all items as processing
    await OrderItem.updateMany({ order_id: order._id }, { item_status: "processing" });

    res.status(200).json({
      success: true,
      message: "eSewa payment verified successfully",
      transaction_id: refId,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Khalti payment widget verification token
 * @route   POST /api/payments/verify/khalti
 * @access  Public (Simulation)
 */
export const verifyKhalti = async (req, res, next) => {
  try {
    const { token, amount, order_id } = req.body;

    if (!token || !amount || !order_id) {
      return res.status(400).json({ message: "Missing required parameters: token, amount, order_id" });
    }

    let order;
    if (order_id.startsWith("KLK-")) {
      order = await Order.findOne({ order_number: order_id });
    } else if (mongoose.Types.ObjectId.isValid(order_id)) {
      order = await Order.findById(order_id);
    }

    if (!order) {
      return res.status(404).json({ message: `Order not found for order_id: ${order_id}` });
    }

    // Khalti widget uses paisa (1 NPR = 100 Paisa)
    const expectedPaisa = order.total_amount * 100;
    if (Number(amount) !== expectedPaisa) {
      return res.status(400).json({
        message: `Amount mismatch. Khalti paid ${amount} paisa, but order total is ${expectedPaisa} paisa.`,
      });
    }

    // Transition Order status
    order.payment_status = "paid";
    order.order_status = "confirmed";
    await order.save();

    // Mark all items as processing
    await OrderItem.updateMany({ order_id: order._id }, { item_status: "processing" });

    res.status(200).json({
      success: true,
      message: "Khalti payment verified successfully",
      transaction_id: `KHL-${token.slice(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Confirm COD payment on delivery (Admin/Vendor Only)
 * @route   POST /api/payments/cod/confirm/:id
 * @access  Private (Admin / Vendor)
 */
export const confirmCODPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.payment_method !== "COD") {
      return res.status(400).json({ message: "This order is not a Cash on Delivery (COD) order" });
    }

    order.payment_status = "paid";
    await order.save();

    res.status(200).json({
      success: true,
      message: "COD payment confirmed successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  verifyESewa,
  verifyKhalti,
  confirmCODPayment,
};
