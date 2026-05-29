import Product from "../models/Product.js";

const getAllProducts = async () => {
  return await Product.find();
};

const getFirstProduct = async () => {
  return await Product.findOne();
};

const getProductByID = async (id) => {
  return await Product.findById(id);
};

const createProduct = async (data) => {
  return await Product.create(data);
};

export default {
  getAllProducts,
  getFirstProduct,
  getProductByID,
  createProduct,
};
