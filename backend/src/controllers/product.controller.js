import productService from '../services/product.service.js';

const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
};

const getFirstProduct = async (req, res) => {
  const product = await productService.getFirstProduct();
  res.json(product);
};

const getProductByID = async (req, res) => {
  const product = await productService.getProductByID(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.json(product);
};

const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

const getProductsByCategory = async (req, res) => {
  try {
    const products = await productService.getProductsByCategory(req.params.categoryName);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getArtisanProducts = async (req, res) => {
  try {
    const products = await productService.getProductsByArtisan(req.params.artisanId);
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { getAllProducts, getFirstProduct, getProductByID, createProduct, getProductsByCategory, getArtisanProducts };
