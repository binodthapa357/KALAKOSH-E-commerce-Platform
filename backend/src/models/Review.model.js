import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required to write a review"],
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required to review a product"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: a user can only review a specific product once
reviewSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

// Static method on the model to calculate average rating of a product
reviewSchema.statics.calculateAverageRating = async function (productId) {
  try {
    const stats = await this.aggregate([
      { $match: { product_id: productId } },
      {
        $group: {
          _id: "$product_id",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    // Format average to 1 decimal place (e.g. 4.3), default to 0 if no reviews exist
    const avgRating = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;

    await mongoose.model("Product").findByIdAndUpdate(productId, {
      avg_rating: avgRating,
    });
  } catch (error) {
    console.error("Error in calculateAverageRating static method:", error);
  }
};

// Re-calculate average rating when a review is created or saved
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product_id);
});

// Re-calculate average rating when a review is deleted or updated via findOneAnd...
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product_id);
  }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
