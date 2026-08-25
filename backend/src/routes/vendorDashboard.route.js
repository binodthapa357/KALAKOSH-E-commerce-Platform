import express from "express";
import {
  getVendorMe,
  getVendorProducts,
  createVendorProduct,
  getVendorOrders,
  updateVendorOrderItem,
} from "../controllers/vendorDashboard.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { upload } from "../middleware/product.middleware.js";
import Vendor from "../models/Vendor.model.js";

const router = express.Router();

// Middleware to check if vendor profile is active
const checkActiveVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user_id: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    if (vendor.status !== "active") {
      return res.status(403).json({
        message: `Your vendor account status is '${vendor.status}'. Access is restricted until approved.`,
        status: vendor.status,
      });
    }
    req.vendor = vendor;
    next();
  } catch (error) {
    next(error);
  }
};

// Apply protect & authorize to all vendor routes
router.use(protect);
router.use(authorize("vendor"));

/**
 * @swagger
 * tags:
 *   name: Vendor Dashboard
 *   description: Private operations for authenticated artisan vendors
 */

/**
 * @swagger
 * /api/vendor/me:
 *   get:
 *     summary: Retrieve current vendor profile and status
 *     tags: [Vendor Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current vendor details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not a vendor)
 */
router.get("/me", getVendorMe);

// Restrict all other operations to active vendors only
router.use(checkActiveVendor);

/**
 * @swagger
 * /api/vendor/products:
 *   get:
 *     summary: Retrieve vendor own products list
 *     tags: [Vendor Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor products
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden or vendor inactive
 *   post:
 *     summary: Upload and create a product as a vendor
 *     tags: [Vendor Dashboard]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden or vendor inactive
 */
router.route("/products")
  .get(getVendorProducts)
  .post(upload.array("images", 5), createVendorProduct);

/**
 * @swagger
 * /api/vendor/orders:
 *   get:
 *     summary: Retrieve list of orders containing items from this vendor
 *     tags: [Vendor Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden or vendor inactive
 */
router.get("/orders", getVendorOrders);

/**
 * @swagger
 * /api/vendor/orders/{id}:
 *   patch:
 *     summary: Update status of a specific order item belonging to this vendor
 *     tags: [Vendor Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order item ID
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
 *       403:
 *         description: Forbidden or vendor inactive
 */
router.patch("/orders/:id", updateVendorOrderItem);

export default router;
