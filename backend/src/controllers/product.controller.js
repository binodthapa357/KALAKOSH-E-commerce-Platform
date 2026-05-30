import productService from "../services/product.service.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

const getFirstProduct = async (req, res) => {
  try {
    const product = await productService.getFirstProduct();
    res.json(product);
  } catch (error) {
    console.error("Error in getFirstProduct:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

const getProductByID = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productService.getProductByID(id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (error) {
    console.error("Error in getProductByID:", error);
    res.status(500).json({ message: "Error fetching product by ID", error: error.message });
  }
};
//updated by Bibhusha
const createProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    
    // Explicit body validation to return precise bad request responses
    if (!name) {
      return res.status(400).json({ message: "Validation error: Product name is required" });
    }
    if (!category) {
      return res.status(400).json({ message: "Validation error: Product category is required" });
    }
    if (price === undefined || price === null) {
      return res.status(400).json({ message: "Validation error: Product price is required" });
    }
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ message: "Validation error: Product price must be a positive number" });
    }

    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(400).json({ message: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice } = req.query;
    const products = await productService.searchProducts({ keyword, category, minPrice, maxPrice });
    res.json(products);
  } catch (error) {
    console.error("Error in searchProducts:", error);
    res.status(500).json({ message: "Error searching products", error: error.message });
  }
};

export default {
  getAllProducts,
  getFirstProduct,
  getProductByID,
  createProduct,
  searchProducts,
};
