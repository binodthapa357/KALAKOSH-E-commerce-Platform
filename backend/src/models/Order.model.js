import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
    },
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State/Province is required"],
      trim: true,
    },
    postal_code: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: "Nepal",
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Contact phone number is required"],
      trim: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for an order"],
    },
    order_number: {
      type: String,
      unique: true,
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    shipping_cost: {
      type: Number,
      required: [true, "Shipping cost is required"],
      min: [0, "Shipping cost cannot be negative"],
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    total_amount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    shipping_address: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"],
    },
    payment_method: {
      type: String,
      enum: {
        values: ["COD", "eSewa", "Khalti", "IPS", "Card"],
        message: "Payment method must be COD, eSewa, Khalti, IPS, or Card",
      },
      required: [true, "Payment method is required"],
    },
    payment_status: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed", "refunded"],
        message: "Payment status must be pending, paid, failed, or refunded",
      },
      default: "pending",
    },
    order_status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
        message: "Order status must be pending, confirmed, processing, shipped, delivered, or cancelled",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate sequential order number like KLK-0001
orderSchema.pre("save", async function (next) {
  if (!this.order_number) {
    try {
      // Query the database for the lexically highest order number
      const lastOrder = await mongoose.model("Order").findOne(
        {},
        { order_number: 1 },
        { sort: { order_number: -1 } }
      );

      let nextNum = 1;
      if (lastOrder && lastOrder.order_number) {
        // Extract number from KLK-XXXX format
        const match = lastOrder.order_number.match(/KLK-(\d+)/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }

      this.order_number = `KLK-${String(nextNum).padStart(4, "0")}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
