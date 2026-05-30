import Product from "../models/Product.js";

const getAllProducts = async () => {
  return await Product.find();
};

const getFirstProduct = async () => {
  return await Product.findOne();
};

//Updated By Spriha
const getProductByID = async (id) => {
  const product = await Product.findById(id).populate("artisan", "name district bio");
  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const createProduct = async (data) => {
  return await Product.create(data);
};
//updated by bibhusha
const searchProducts = async ({ keyword, category, minPrice, maxPrice }) => {
  const filter = {};

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  return await Product.find(filter);
};

export default {
  getAllProducts,
  getFirstProduct,
  getProductByID,
  createProduct,
  searchProducts,
};
