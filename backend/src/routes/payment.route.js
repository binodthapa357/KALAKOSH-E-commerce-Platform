import express from "express";
import {
  verifyESewa,
  verifyKhalti,
  confirmCODPayment,
} from "../controllers/payment.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment gateway integration and verification callbacks
 */

/**
 * @swagger
 * /api/payments/verify/esewa:
 *   post:
 *     summary: Verify eSewa payment callback
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: string
 *                 description: Base64 encoded payload from eSewa signature
 *     responses:
 *       200:
 *         description: eSewa payment verified successfully
 *       400:
 *         description: Verification failed or invalid payload
 */
router.post("/verify/esewa", verifyESewa);

/**
 * @swagger
 * /api/payments/verify/khalti:
 *   post:
 *     summary: Verify Khalti payment callback
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - amount
 *             properties:
 *               token:
 *                 type: string
 *               amount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Khalti payment verified successfully
 *       400:
 *         description: Verification failed
 */
router.post("/verify/khalti", verifyKhalti);

/**
 * @swagger
 * /api/payments/cod/confirm/{id}:
 *   post:
 *     summary: Confirm COD offline payment receipt (Vendor/Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: COD payment confirmed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.post("/cod/confirm/:id", protect, authorize("vendor", "admin"), confirmCODPayment);

export default router;
