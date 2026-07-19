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

router.get("/me", getVendorMe);

// Restrict all other operations to active vendors only
router.use(checkActiveVendor);

router.get("/products", getVendorProducts);
router.post("/products", upload.array("images", 5), createVendorProduct);
router.get("/orders", getVendorOrders);
router.patch("/orders/:id", updateVendorOrderItem);

export default router;
