import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import productController from "../controllers/product.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import { validateCategoryName, uploadProductImages } from "../middleware/product.middleware.js";

const router = express.Router();

/**
 * Optional Authentication Middleware.
 * Populates req.user if a valid Bearer token is provided, but does not block if missing or invalid.
 */
const optionalProtect = async (req, res, next) => {
  try {
    if (req.headers.authorization?.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user && user.is_active) {
        req.user = user;
      }
    }
  } catch (error) {
    // Gracefully ignore token verification errors for optional auth routes
  }
  next();
};
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management, search, reviews, and stock updates
 */

/* --- PUBLIC ROUTES --- */
// NOTE: Registered BEFORE "/:id" dynamic route to prevent parameter clashes.

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: artisan
 *         schema:
 *           type: string
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [inStock, lowStock, outOfStock]
 *     responses:
 *       200:
 *         description: List of products with pagination info
 */
router.get("/", optionalProtect, productController.getAllProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products by keyword
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", productController.searchProducts);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of featured products
 */
router.get("/featured", productController.getFeaturedProducts);

/**
 * @swagger
 * /api/products/first:
 *   get:
 *     summary: Get the first product in database
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: First product details
 */
router.get("/first", productController.getFirstProduct);

/**
 * @swagger
 * /api/products/category/{name}:
 *   get:
 *     summary: Get products by category name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products in category
 */
router.get("/category/:name", validateCategoryName, productController.getProductsByCategoryName);

/**
 * @swagger
 * /api/products/artisan/{id}:
 *   get:
 *     summary: Get products by artisan vendor ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products by artisan
 */
router.get("/artisan/:id", productController.getProductsByArtisan);

// Dynamic Route (:param)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.getProductByID);

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   get:
 *     summary: Get reviews for a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/:id/reviews", productController.getProductReviews);

/* --- PROTECTED ROUTES --- */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a product (Vendor/Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *               stock:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, authorize("vendor", "admin"), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}/images:
 *   post:
 *     summary: Upload additional images for a product (Vendor/Admin)
 *     tags: [Products]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/:id/images", protect, authorize("vendor", "admin"), uploadProductImages, productController.uploadExtraImages);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product details (Vendor/Admin)
 *     tags: [Products]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put("/:id", protect, authorize("vendor", "admin"), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}/approve:
 *   put:
 *     summary: Approve a product for listing (Admin only)
 *     tags: [Products]
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
 *         description: Product approved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put("/:id/approve", protect, authorize("admin"), productController.approveProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
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
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete("/:id", protect, authorize("admin"), productController.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete a specific image from product (Vendor/Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product or image not found
 */
router.delete("/:id/images/:imageId", protect, authorize("vendor", "admin"), productController.deleteSpecificImage);

/**
 * @swagger
 * /api/products/{id}/reviews:
 *   post:
 *     summary: Add review to a product
 *     tags: [Products]
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
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post("/:id/reviews", protect, productController.addProductReview);

/**
 * @swagger
 * /api/products/{id}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete review from a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.delete("/:id/reviews/:reviewId", protect, productController.deleteProductReview);

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     summary: Update product stock count (Vendor/Admin)
 *     tags: [Products]
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
 *               - stock
 *             properties:
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.patch("/:id/stock", protect, authorize("vendor", "admin"), productController.updateProductStock);

export default router;


