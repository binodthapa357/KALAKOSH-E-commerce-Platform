import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  rating:       { type: Number, min: 1, max: 5, required: true },
  comment:      { type: String },
  createdAt:    { type: Date, default: Date.now },
});

const productScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "Kalakosh",
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ratings: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

productScheme.index({ name: "text", description: "text" });

export default mongoose.model("Product", productScheme);