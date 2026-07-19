import express from "express";
import categoryController from "../controllers/category.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validateCategoryName } from "../middleware/product.middleware.js";
import productController from "../controllers/product.controller.js";

const router = express.Router();

// Public Category routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.get("/slug/:slug", categoryController.getCategoryBySlug);
router.get("/category/:name", validateCategoryName, productController.getProductsByCategoryName);

// Protected Admin-only Category actions
router.post("/", protect, authorize("admin"), categoryController.createCategory);
router.put("/:id", protect, authorize("admin"), categoryController.updateCategory);
router.delete("/:id", protect, authorize("admin"), categoryController.deleteCategory);

export default router;