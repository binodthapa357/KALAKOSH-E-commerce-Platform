import express from "express";
import {
  verifyESewa,
  verifyKhalti,
  confirmCODPayment,
} from "../controllers/payment.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// Public routes for payment verification callbacks (simulate provider response)
router.post("/verify/esewa", verifyESewa);
router.post("/verify/khalti", verifyKhalti);

// Private route for shop staff/artisan confirming offline payment collection
router.post("/cod/confirm/:id", protect, authorize("vendor", "admin"), confirmCODPayment);

export default router;
