import mongoose from "mongoose";

const productScheme = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  price: Number,
});

export default mongoose.model("Product", productScheme);
