import fs from "fs/promises";
import productService from "../services/product.service.js";

const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();

  res.json(products);
};

const getFirstProduct = async (req, res) => {
  const product = await productService.getFirstProduct();
  res.json(product);
};

const getProductByID = async (req, res) => {
  const id = req.params.id;
  const product = await productService.getProductByID(id);
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
};

const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

export default {
  getAllProducts,
  getFirstProduct,
  getProductByID,
  createProduct,
};
