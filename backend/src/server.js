import express, { response } from "express";
import { readFile } from "fs";


import fs from "fs/promises";
import config from "./config/config.js";

const app = express();


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

app.get("/products", async (req, res) => {
  const products = await fs.readFile("src/data/products.json", "utf-8");
  // res.header("Content-Type", "text/plain");
  res.json(JSON.parse(products));
});

app.get("/products/first", async (req, res) => {
  const products = await fs.readFile("src/data/products.json", "utf-8");
  // res.header("Content-Type", "text/plain");
  const firstProduct = JSON.parse(products)[0];
  res.json(firstProduct);
});

app.listen(config.port, () => {
  console.log("Server running....");
});
