import express, { response } from "express";
import { readFile } from "fs";

import fs from "fs/promises";
import config from "./src/config/config.js";

import productRoute from "./src/routes/product.route.js";
import connectDB from "./src/config/db.js";

const app = express();

connectDB();

app.get("/", (request, response) => {
  response.send("Home Page");
});

app.get("/about", (request, response) => {
  response.send("About Page");
});

app.post("/contact", (request, response) => {
  response.send("Contact form submitted");
});

app.get("/contact", (request, response) => {
  response.send("Contact Page");
});

app.use("/api/products", productRoute);

app.listen(config.port, () => {
  console.log("Server running....");
});
