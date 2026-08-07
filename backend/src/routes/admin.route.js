import express from "express";
import {
  getDashboardStats,
  getUsersList,
  toggleUserStatus,
  getProductsList,
  toggleProductFeatured,
  getVendorsList,
  updateVendorStatus,
  getOrdersList,
  getReviewsList,
  deleteReviewAdmin,
  uploadImageAdmin,
} from "../controllers/admin.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { upload } from "../middleware/product.middleware.js";

const router = express.Router();

// Guard all admin routes with authentication and admin role authorization
router.use(protect, authorize("admin"));

/**
 * @swagger
 * tags:
 *   name: Admin Dashboard
 *   description: Administrative dashboard statistics, user management, product vetting, vendor approval, reviews moderation, and assets upload
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Retrieve dashboard statistics and metrics (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats summary object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get("/stats", getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Retrieve list of users (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registered users
 *       401:
 *         description: Unauthorized
 */
router.get("/users", getUsersList);

/**
 * @swagger
 * /api/admin/users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle a user's active/suspended account state (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *       401:
 *         description: Unauthorized
 */
router.patch("/users/:id/toggle-status", toggleUserStatus);

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Retrieve list of all products in catalog (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Catalog products list
 *       401:
 *         description: Unauthorized
 */
router.get("/products", getProductsList);

/**
 * @swagger
 * /api/admin/products/{id}/toggle-featured:
 *   patch:
 *     summary: Toggle product featured status (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Featured status toggled successfully
 *       401:
 *         description: Unauthorized
 */
router.patch("/products/:id/toggle-featured", toggleProductFeatured);

/**
 * @swagger
 * /api/admin/vendors:
 *   get:
 *     summary: Retrieve list of all vendor profiles (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor profiles
 *       401:
 *         description: Unauthorized
 */
router.get("/vendors", getVendorsList);

/**
 * @swagger
 * /api/admin/vendors/{id}/status:
 *   patch:
 *     summary: Update vendor status (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vendor profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, active, suspended, rejected]
 *     responses:
 *       200:
 *         description: Vendor profile status updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch("/vendors/:id/status", updateVendorStatus);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Retrieve list of all sales orders (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales orders
 *       401:
 *         description: Unauthorized
 */
router.get("/orders", getOrdersList);

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     summary: Retrieve list of all reviews in platform (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 *       401:
 *         description: Unauthorized
 */
router.get("/reviews", getReviewsList);

/**
 * @swagger
 * /api/admin/reviews/{id}:
 *   delete:
 *     summary: Force delete a review (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/reviews/:id", deleteReviewAdmin);

/**
 * @swagger
 * /api/admin/upload:
 *   post:
 *     summary: Upload file to media store (Admin only)
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/upload", upload.single("image"), uploadImageAdmin);

export default router;
