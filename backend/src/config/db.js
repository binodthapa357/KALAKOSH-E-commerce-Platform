
import { error } from "console";
import mongoose from "mongoose";
import config from "./config.js";

function connectDB() {
  mongoose
    .connect(config.mongodbUrl)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.log(error);
    });
}

export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

