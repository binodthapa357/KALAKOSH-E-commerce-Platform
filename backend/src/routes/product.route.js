import express from "express";
import jwt from "jsonwebtoken";
import productController from "../controllers/product.controller.js";
import User from "../models/User.model.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { uploadProductImages, validateCategoryName } from "../middleware/product.middleware.js";

const router = express.Router();

/**
 * Optional Authentication Middleware.
 * Populates req.user if a valid Bearer token is provided, but does not block if missing or invalid.
 */
const optionalProtect = async (req, res, next) => {
  try {
    if (req.headers.authorization?.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user && user.is_active) {
        req.user = user;
      }
    }
  } catch (error) {
    // Gracefully ignore token verification errors for optional auth routes
  }
  next();
};

/* --- PUBLIC ROUTES --- */
// NOTE: Registered BEFORE "/:id" dynamic route to prevent parameter clashes.

// Group 1 — Product listing & search
router.get("/", optionalProtect, productController.getAllProducts);
router.get("/search", productController.searchProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/first", productController.getFirstProduct);

// Group 2 — Single product & category view
router.get("/category/:name", validateCategoryName, productController.getProductsByCategoryName);
router.get("/artisan/:id", productController.getProductsByArtisan);

// Group 5 — Reviews listing
router.get("/:id/reviews", productController.getProductReviews);

// GET Single Product detail (MUST be registered after specific static paths)
router.get("/:id", productController.getProductByID);


/* --- PROTECTED ROUTES --- */

// Group 3 — Create product & image upload
router.post("/", protect, authorize("vendor", "admin"), uploadProductImages, productController.createProduct);
router.post("/:id/images", protect, authorize("vendor", "admin"), uploadProductImages, productController.uploadExtraImages);

// Group 4 — Update & delete product
router.put("/:id", protect, authorize("vendor", "admin"), productController.updateProduct);
router.put("/:id/approve", protect, authorize("admin"), productController.approveProduct);
router.delete("/:id", protect, authorize("admin"), productController.deleteProduct);
router.delete("/:id/images/:imageId", protect, authorize("vendor", "admin"), productController.deleteSpecificImage);

// Group 5 — Reviews & stock updates
router.post("/:id/reviews", protect, authorize("user"), productController.addProductReview);
router.delete("/:id/reviews/:reviewId", protect, authorize("user", "admin"), productController.deleteProductReview);
router.patch("/:id/stock", protect, authorize("vendor", "admin"), productController.updateProductStock);

export default router;
