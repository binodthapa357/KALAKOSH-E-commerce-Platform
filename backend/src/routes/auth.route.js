import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  createVendorProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

// Protected routes (Requires valid JWT session)
router.get("/me", protect, getMe);
router.post("/vendor", protect, createVendorProfile);

export default router;
