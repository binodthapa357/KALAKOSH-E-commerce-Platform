import express from "express";
import cors from "cors";
import productRoutes from "./src/routes/product.route.js";
import authRoutes from "./src/routes/auth.route.js";
import errorMiddleware from "./src/middleware/error.middleware.js";
import categoryRoutes from "./src/routes/category.route.js";

const app = express();

/* middleware */
app.use(express.json());
app.use(cors());

/* routes */
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

/* health check */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* global error handler (must be registered last) */
app.use(errorMiddleware);

export default app;