import fs from "fs/promises";
import Product from "../models/Product.js";
const getAllProducts = async () => {
  const products = await fs.readFile("src/data/products.json", "utf-8");

  return JSON.parse(products);
};

const getFirstProduct = async () => {
  const products = await fs.readFile("src/data/products.json", "utf-8");
  const firstProduct = JSON.parse(products)[0];
  return firstProduct;
};

const getProductByID = async (id) => {
  const products = await fs.readFile("src/data/products.json", "utf-8");
  const list = JSON.parse(products);
  return list.find((product) => product.id == id);
};

const createProduct = async () => {
  return await Product.create({
    name: "iphone 16",
    brand: "Apple",
    category: "Smartphone",
    price: 10000,
  });
};
export default {
  getAllProducts,
  getFirstProduct,
  getProductByID,
  createProduct,
};
