import express from "express";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management for user profiles
 */

// All wishlist routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Retrieve user wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist items list
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add or remove product from wishlist (Toggle status)
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Toggled successfully, returns current status or message
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.route("/")
  .get(getWishlist)
  .post(toggleWishlist);

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Remove a product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/:productId")
  .delete(removeFromWishlist);

export default router;
