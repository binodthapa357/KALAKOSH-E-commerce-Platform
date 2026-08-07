import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  createVendorProfile,
  updateVendorStatus,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user or vendor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minimum: 6
 *               role:
 *                 type: string
 *                 enum: [user, vendor]
 *                 default: user
 *               shop_name:
 *                 type: string
 *                 description: Required if role is vendor
 *               pan_number:
 *                 type: string
 *                 description: Required if role is vendor
 *               bank_details:
 *                 type: object
 *                 description: Required if role is vendor
 *               pan_photo:
 *                 type: string
 *                 description: Base64 data string of the PAN photo, required if role is vendor
 *     responses:
 *       201:
 *         description: Registered successfully
 *       400:
 *         description: Validation error or profile creation failed
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials or account suspended
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset OTP successfully sent to email
 *       400:
 *         description: Missing email
 *       404:
 *         description: User not found
 *       500:
 *         description: Mail server error
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   put:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - password
 *             properties:
 *               otp:
 *                 type: string
 *               password:
 *                 type: string
 *                 minimum: 6
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid or expired OTP, or validation error
 */
router.put("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user object
 *       401:
 *         description: Unauthorized
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/auth/vendor:
 *   post:
 *     summary: Create a vendor profile for an authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shop_name
 *               - pan_number
 *               - bank_details
 *               - pan_photo
 *             properties:
 *               shop_name:
 *                 type: string
 *               pan_number:
 *                 type: string
 *               bank_details:
 *                 type: object
 *               pan_photo:
 *                 type: string
 *                 description: Base64 encoded image
 *     responses:
 *       201:
 *         description: Vendor profile created successfully
 *       400:
 *         description: Profile details already exist or photo upload failed
 *       401:
 *         description: Unauthorized
 */
router.post("/vendor", protect, createVendorProfile);

/**
 * @swagger
 * /api/auth/addresses:
 *   get:
 *     summary: Get user saved addresses
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved addresses
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add a new address to user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - state
 *               - phone
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.route("/addresses")
  .get(protect, getAddresses)
  .post(protect, addAddress);

/**
 * @swagger
 * /api/auth/addresses/{addressId}:
 *   put:
 *     summary: Update an address on user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
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
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete an address from user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       401:
 *         description: Unauthorized
 */
router.route("/addresses/:addressId")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

/**
 * @swagger
 * /api/auth/vendor/{id}/status:
 *   put:
 *     summary: Update vendor status (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Vendor Profile DB ID
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
 *         description: Vendor status updated successfully
 *       400:
 *         description: Invalid status value or ID format
 *       401:
 *         description: Unauthorized/Admin role required
 *       404:
 *         description: Vendor profile not found
 */
router.put("/vendor/:id/status", protect, authorize("admin"), updateVendorStatus);

export default router;
