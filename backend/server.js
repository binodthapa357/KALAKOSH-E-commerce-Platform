import express from "express";
import config from "./src/config/config.js";
import productRoute from "./src/routes/product.route.js";
import authRoute from "./src/routes/auth.route.js";
import connectDB from "./src/config/db.js";

const app = express();
app.use(express.json());
connectDB();

app.get("/", (req, res) => res.send("Home Page"));
app.get("/about", (req, res) => res.send("About Page"));
app.post("/contact", (req, res) => res.send("Contact form submitted"));
app.get("/contact", (req, res) => res.send("Contact Page"));

app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);

app.listen(config.port, () => {
  console.log("Server running....");
});
