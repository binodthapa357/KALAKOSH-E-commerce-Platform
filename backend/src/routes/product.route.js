import express from 'express';
import productController from '../controllers/product.controller.js';
import { validateCategory } from '../middleware/category.middleware.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/first', productController.getFirstProduct);
router.get('/category/:categoryName', validateCategory, productController.getProductsByCategory);
router.get('/artisan/:artisanId', productController.getArtisanProducts);
router.get('/:id', productController.getProductByID);
router.post('/', productController.createProduct);

export default router;
