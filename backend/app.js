import express from "express";
import cors from "cors";

import productRoutes from "./src/routes/product.route.js";
import authRoutes from "./src/routes/auth.route.js";
import categoryRoutes from "./src/routes/category.route.js";
import cartRoutes from "./src/routes/cart.route.js";
import wishlistRoutes from "./src/routes/wishlist.route.js";
import orderRoutes from "./src/routes/order.route.js";
import shippingRoutes from "./src/routes/shipping.route.js";
import paymentRoutes from "./src/routes/payment.route.js";
import adminRoutes from "./src/routes/admin.route.js";
import vendorRoutes from "./src/routes/vendor.route.js";

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
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendors", vendorRoutes);

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