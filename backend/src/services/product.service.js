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

const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export default {
  getAllProducts,
  getFirstProduct,
  getProductByID,
  createProduct,
  searchProducts,
  updateProduct,
};