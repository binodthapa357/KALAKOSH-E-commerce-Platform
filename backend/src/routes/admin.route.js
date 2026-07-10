import express from "express";
import {
  getDashboardStats,
  getUsersList,
  toggleUserStatus,
  getProductsList,
  getVendorsList,
  updateVendorStatus,
  getOrdersList,
} from "../controllers/admin.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Guard all admin routes with authentication and admin role authorization
router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);

router.get("/users", getUsersList);
router.patch("/users/:id/toggle-status", toggleUserStatus);

router.get("/products", getProductsList);

router.get("/vendors", getVendorsList);
router.patch("/vendors/:id/status", updateVendorStatus);

router.get("/orders", getOrdersList);

export default router;
