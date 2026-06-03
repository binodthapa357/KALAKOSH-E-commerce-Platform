import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parent_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be active or inactive",
      },
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to generate slug automatically from category name
categorySchema.pre("validate", function () {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove special characters
      .replace(/[\s_]+/g, "-")  // replace spaces and underscores with single dash
      .replace(/^-+|-+$/g, ""); // trim starting/ending dashes
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
