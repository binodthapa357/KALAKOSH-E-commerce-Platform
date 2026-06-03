import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import productController from "../controllers/product.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validateCategoryName, uploadProductImages } from "../middleware/product.middleware.js";

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
router.get("/category/:name", validateCategoryName, productController.getProductsByCategoryName);
router.get("/artisan/:id", productController.getProductsByArtisan);

// Dynamic Route (:param)
router.get("/:id", productController.getProductByID);
router.get("/:id/reviews", productController.getProductReviews);

/* --- PROTECTED ROUTES --- */
router.post("/", protect, authorize("vendor", "admin"), productController.createProduct);
router.post("/:id/images", protect, authorize("vendor", "admin"), uploadProductImages, productController.uploadExtraImages);

router.put("/:id", protect, authorize("vendor", "admin"), productController.updateProduct);
router.put("/:id/approve", protect, authorize("admin"), productController.approveProduct);

router.delete("/:id", protect, authorize("admin"), productController.deleteProduct);
router.delete("/:id/images/:imageId", protect, authorize("vendor", "admin"), productController.deleteSpecificImage);

router.post("/:id/reviews", protect, productController.addProductReview);
router.delete("/:id/reviews/:reviewId", protect, productController.deleteProductReview);

router.patch("/:id/stock", protect, authorize("vendor", "admin"), productController.updateProductStock);

export default router;


