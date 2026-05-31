import express from "express";
import productController from "../controllers/product.controller.js";
import { validateSearch } from "../middleware/product.middleware.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/first", productController.getFirstProduct);
router.get("/search", validateSearch, productController.searchProducts);
//Dynamic Route (:param)
router.get("/:id", productController.getProductByID);

router.post("/", productController.createProduct);


export default router;
