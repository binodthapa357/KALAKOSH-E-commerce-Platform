import multer from "multer";
import Category from "../models/Category.model.js";

/**
 * -------------------------
 * SEARCH VALIDATION MIDDLEWARE
 * -------------------------
 */
const validateSearch = (req, res, next) => {
  const { keyword, category, minPrice, maxPrice } = req.query;

  if (minPrice && isNaN(Number(minPrice))) {
    return res.status(400).json({ message: "minPrice must be a number" });
  }

  if (maxPrice && isNaN(Number(maxPrice))) {
    return res.status(400).json({ message: "maxPrice must be a number" });
  }

  if (
    minPrice &&
    maxPrice &&
    Number(minPrice) > Number(maxPrice)
  ) {
    return res.status(400).json({
      message: "minPrice cannot be greater than maxPrice",
    });
  }

  next();
};

/**
 * -------------------------
 * MULTER CONFIG (IMAGE UPLOAD)
 * -------------------------
 */
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Multiple images (max 5)
const uploadProductImages = upload.array("images", 5);

// Single image (optional use)
const uploadSingleProductImage = upload.single("image");

/**
 * -------------------------
 * CATEGORY VALIDATION
 * -------------------------
 */
const validateCategoryName = async (req, res, next) => {
  try {
    const categoryName = req.params.name;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = categoryName.trim();

    // Match by slug (exact) OR by display name (case-insensitive)
    const category = await Category.findOne({
      $or: [
        { slug: trimmedName },
        { name: { $regex: new RegExp(`^${trimmedName}$`, "i") } },
      ],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found`,
      });
    }

    req.category = category;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validating category",
      error: error.message,
    });
  }
};

/**
 * -------------------------
 * EXPORTS
 * -------------------------
 */
export {
  validateSearch,
  uploadProductImages,
  uploadSingleProductImage,
  validateCategoryName,
};