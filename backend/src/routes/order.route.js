import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateOrderItemStatus,
} from "../controllers/order.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.route("/")
  .post(createOrder)
  .get(authorize("admin"), getAllOrders);

router.route("/me")
  .get(getMyOrders);

router.route("/:id")
  .get(getOrderById);

router.route("/:id/status")
  .put(authorize("admin"), updateOrderStatus);

router.route("/items/:orderItemId/status")
  .put(authorize("vendor", "admin"), updateOrderItemStatus);

export default router;
