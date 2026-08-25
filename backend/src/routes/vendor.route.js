import express from "express";
import {
  getAllVendors,
  getVendorById,
} from "../controllers/vendor.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Public profiles of artisan vendors
 */

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     summary: Retrieve list of all approved/active artisan vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: List of vendor profiles
 */
router.get("/", getAllVendors);

/**
 * @swagger
 * /api/vendors/{id}:
 *   get:
 *     summary: Get vendor profile by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Vendor Profile ID
 *     responses:
 *       200:
 *         description: Vendor profile details
 *       404:
 *         description: Vendor not found
 */
router.get("/:id", getVendorById);

export default router;
