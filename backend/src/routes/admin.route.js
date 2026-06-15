import express from "express";
import {
  getDashboardStats,
  getUsersList,
  getProductsList,
  getVendorsList,
} from "../controllers/admin.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Guard all admin routes with authentication and admin role authorization
router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getUsersList);
router.get("/products", getProductsList);
router.get("/vendors", getVendorsList);

export default router;
