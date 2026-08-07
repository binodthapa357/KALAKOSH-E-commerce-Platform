import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderItemStatus,
  trackOrder,
} from "../controllers/order.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order checkout, tracking, and fulfillment updates
 */

/**
 * @swagger
 * /api/orders/track:
 *   get:
 *     summary: Track order by order number or details
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: order_number
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order tracking information
 *       404:
 *         description: Order not found
 */
router.get("/track", trackOrder);

// All order routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (Checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipping_address
 *               - payment_method
 *             properties:
 *               shipping_address:
 *                 type: object
 *               payment_method:
 *                 type: string
 *                 enum: [esewa, khalti, cod]
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Empty cart or invalid address
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 */
router.route("/")
  .post(createOrder)
  .get(authorize("admin"), getAllOrders);

/**
 * @swagger
 * /api/orders/me:
 *   get:
 *     summary: Get authenticated user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 */
router.route("/me")
  .get(getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get details of a specific order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.route("/:id")
  .get(getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update global status of an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/:id/status")
  .put(authorize("admin"), updateOrderStatus);

/**
 * @swagger
 * /api/orders/items/{orderItemId}/status:
 *   put:
 *     summary: Update delivery/fulfillment status of a specific order item (Vendor/Admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderItemId
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order item status updated successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/items/:orderItemId/status")
  .put(authorize("vendor", "admin"), updateOrderItemStatus);

export default router;
