import express from "express";
import {
  getShippingRates,
  calculateShippingCost,
} from "../controllers/shipping.controller.js";

const router = express.Router();

// Public routes for checkout shipping estimation
router.get("/rates", getShippingRates);
router.post("/calculate", calculateShippingCost);

export default router;
