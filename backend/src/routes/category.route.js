import express from "express";
import categoryController from "../controllers/category.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Public Category routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Protected Admin-only Category actions
router.post("/", protect, authorize("admin"), categoryController.createCategory);
router.put("/:id", protect, authorize("admin"), categoryController.updateCategory);
router.delete("/:id", protect, authorize("admin"), categoryController.deleteCategory);

export default router;