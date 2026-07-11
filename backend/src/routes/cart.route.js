import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.route("/")
  .get(getCart)
  .post(addToCart)
  .put(updateCartItem)
  .delete(clearCart);

router.route("/:productId")
  .delete(removeFromCart);

export default router;
