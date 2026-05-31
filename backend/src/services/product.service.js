import Product from '../models/Product.js';

const getAllProducts = async () => { return await Product.find(); };
const getFirstProduct = async () => { return await Product.findOne(); };
const getProductByID = async (id) => { return await Product.findById(id); };
const createProduct = async (data) => { return await Product.create(data); };

const getProductsByCategory = async (categoryName) => {
  return await Product.find({ category: categoryName });
};

const getProductsByArtisan = async (artisanId) => {
  return await Product.find({ artisan: artisanId });
};

export default { getAllProducts, getFirstProduct, getProductByID, createProduct, getProductsByCategory, getProductsByArtisan };
