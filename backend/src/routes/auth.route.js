import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  createVendorProfile,
  updateVendorStatus,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

// Protected routes (Requires valid JWT session)
router.get("/me", protect, getMe);
router.post("/vendor", protect, createVendorProfile);

// Address Management routes (Protected)
router.route("/addresses")
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route("/addresses/:addressId")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

// Admin-only routes
router.put("/vendor/:id/status", protect, authorize("admin"), updateVendorStatus);

export default router;
