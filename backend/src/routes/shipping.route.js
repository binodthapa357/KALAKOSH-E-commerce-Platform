import express from "express";
import {
  getShippingRates,
  calculateShippingCost,
} from "../controllers/shipping.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shipping
 *   description: Shipping rates estimation and calculations
 */

/**
 * @swagger
 * /api/shipping/rates:
 *   get:
 *     summary: Retrieve available shipping rates and options
 *     tags: [Shipping]
 *     responses:
 *       200:
 *         description: List of shipping rates/zones
 */
router.get("/rates", getShippingRates);

/**
 * @swagger
 * /api/shipping/calculate:
 *   post:
 *     summary: Calculate shipping cost for order details
 *     tags: [Shipping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - state
 *               - items
 *             properties:
 *               state:
 *                 type: string
 *                 description: Shipping destination state/province
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Calculated shipping cost details
 *       400:
 *         description: Missing fields or invalid items
 */
router.post("/calculate", calculateShippingCost);

export default router;
