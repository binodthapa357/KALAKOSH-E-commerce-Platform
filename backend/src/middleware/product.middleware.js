import multer from "multer";
import Category from "../models/Category.model.js";

// Set up multer memory storage for images
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Up to 5 images upload middleware
export const uploadProductImages = upload.array("images", 5);

// Single image upload middleware (flexible if needed, but we can use array for all)
export const uploadSingleProductImage = upload.single("image");

/**
 * Middleware to validate if category name exists in the database.
 * Rejects unknown category names.
 */
export const validateCategoryName = async (req, res, next) => {
  try {
    const categoryName = req.params.name;
    if (!categoryName) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Perform a case-insensitive search for the category
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") },
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: `Validation error: Category '${categoryName}' is not recognized or does not exist.`,
      });
    }

    req.category = category;
    next();
  } catch (error) {
    console.error("Category validation middleware error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while validating the category name",
      error: error.message,
    });
  }
};

export default {
  uploadProductImages,
  uploadSingleProductImage,
  validateCategoryName,
};
