import express from "express";
import cors from "cors";
import productRoutes from "./src/routes/product.route.js";

const app = express();

/* middleware */
app.use(express.json());
app.use(cors());

/* routes */
app.use("/api/products", productRoutes);

/* health check */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

  export default app;