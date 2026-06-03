import express from "express";
import cors from "cors";

import productRoutes from "./src/routes/product.route.js";
import authRoutes from "./src/routes/auth.route.js";
import categoryRoutes from "./src/routes/category.route.js";

import errorMiddleware from "./src/middleware/error.middleware.js";

const app = express();

/* ========================
   Middlewares
======================== */
app.use(express.json());
app.use(cors());

/* ========================
   Routes
======================== */
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

/* ========================
   Health Check
======================== */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ========================
   Error Handler (must be last)
======================== */
app.use(errorMiddleware);

export default app;