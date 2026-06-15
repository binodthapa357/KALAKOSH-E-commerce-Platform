import express from "express";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

router.route("/")
  .get(getWishlist)
  .post(toggleWishlist);

router.route("/:productId")
  .delete(removeFromWishlist);

export default router;
