import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    discount_price: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator: function (v) {
          // If discount_price is not provided, skip validation
          if (v === undefined || v === null) return true;
          return v < this.price;
        },
        message: "Discount price ({VALUE}) must be strictly less than regular price",
      },
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: [true, "Vendor is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    region: {
      type: String,
      trim: true,
      default: "Unknown", // E.g., Bhaktapur, Mithila, Solukhumbu, Pokhara
    },
    material: {
      type: String,
      trim: true,
      default: "Handmade", // E.g., Lokta paper, Brass, Bronze, Yak Wool
    },
    craft_type: {
      type: String,
      trim: true,
      default: "Nepalese Handicraft", // E.g., Thangka Painting, Dhaka Weaving, Pottery
    },
    images: {
      type: [String],
      default: [],
    },
    avg_rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "active", "inactive"],
        message: "Status must be pending, active, or inactive",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search performance
productSchema.index({ name: "text", description: "text", region: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
