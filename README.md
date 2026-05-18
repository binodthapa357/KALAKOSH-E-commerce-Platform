# Kala Kosh Backend Setup Guide

Backend setup guide for the Kala Kosh E-commerce Platform using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

# Project Goal

Build a scalable backend for a Nepal local products e-commerce platform.

Backend will handle:

- Users
- Sellers
- Products
- Categories
- Cart
- Orders
- Payments
- Authentication
- Admin Panel APIs

---

# Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |

---

# STEP 1 — Install Required Software

## 1. Install Node.js

Download:
https://nodejs.org

Install the **LTS Version**

Check installation:

```bash
node -v
npm -v

```
## Create MongoDB Atlas Account

Website:
https://www.mongodb.com/cloud/atlas

Why Atlas?

Free cloud database
Easy setup
Production ready
Accessible anywhere

Create:

Project
Cluster
Database User
Get MongoDB Connection URI

Example URI:

mongodb+srv://username:password@cluster.mongodb.net/kalakosh
## STEP 2 — Create Backend Project

Create project folder:

mkdir kalakosh-backend
cd kalakosh-backend

Initialize project:

npm init -y

## STEP 3 — Install Dependencies
Main Packages
npm install express mongoose dotenv cors bcryptjs jsonwebtoken cookie-parser
Dev Dependency
npm install -D nodemon

## Package Purpose

| Package       | Purpose                     |
| ------------- | --------------------------- |
| express       | Backend framework           |
| mongoose      | MongoDB connection          |
| dotenv        | Environment variables       |
| cors          | Frontend/backend connection |
| bcryptjs      | Password encryption         |
| jsonwebtoken  | Authentication tokens       |
| cookie-parser | Cookie handling             |
| nodemon       | Auto restart server         |

## STEP 4 — Folder Structure

Create this structure:
## 📁 Project Structure

```txt
kalakosh-backend/
│
├── src/
│   ├── config/          # Database and app configuration
│   ├── controllers/     # Business logic (auth, products, etc.)
│   ├── middleware/      # Auth middleware, error handlers, etc.
│   ├── models/          # Mongoose schemas (User, Product, Order)
│   ├── routes/          # API routes (authRoutes, productRoutes)
│   ├── services/        # Reusable business services (optional layer)
│   ├── utils/           # Helper functions (JWT, email, etc.)
│   └── app.js           # Express app setup
│
├── server.js            # Server entry point
├── .env                 # Environment variables
├── .gitignore           # Files to ignore in git
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```
## Folder Explanation
| Folder      | Purpose          |
| ----------- | ---------------- |
| config      | Database config  |
| controllers | Business logic   |
| middleware  | Auth & security  |
| models      | MongoDB schemas  |
| routes      | API endpoints    |
| services    | Reusable logic   |
| utils       | Helper functions |


## STEP 5 — Create Express Server
Create server.js
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
Create src/app.js
const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kala Kosh API Running");
});

app.use("/api/products", productRoutes);

module.exports = app;
STEP 6 — Setup MongoDB Connection
Create src/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
STEP 7 — Create Environment Variables
Create .env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=kalakoshsecret

Replace:

your_mongodb_connection_string

with your MongoDB Atlas URI.

STEP 8 — Create Product Route
Create src/routes/productRoutes.js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Products route working",
  });
});

module.exports = router;


## STEP 9 — Setup Nodemon

Open package.json

Replace scripts with:

"scripts": {
  "dev": "nodemon server.js"
}
## STEP 10 — Run Backend Server

Start development server:

npm run dev

Expected output:

MongoDB Connected
Server running on port 5000

## STEP 11 — Test APIs

Open browser:

http://localhost:5000

Expected:

Kala Kosh API Running

Test products route:

http://localhost:5000/api/products

Expected:

{
  "success": true,
  "message": "Products route working"
}

### Backend Concepts You Must Understand
1. Request → Response Cycle
Frontend Request
    ↓
Route
    ↓
Controller
    ↓
Database
    ↓
Response
2. MVC Architecture
Route → Controller → Model
Example
Layer	Purpose
Route	API endpoint
Controller	Logic
Model	Database schema
3. REST API Methods
Method	Purpose
GET	Fetch data
POST	Create data
PUT	Update data
DELETE	Delete data
Recommended API Testing Tools
Postman

https://www.postman.com

OR

Thunder Client

https://www.thunderclient.com

Recommended .gitignore

## Create .gitignore

node_modules
.env
Future Backend Features
## PHASE 2 — Authentication
Register
Login
JWT Auth
Protected Routes
Roles
Admin
Seller
Customer
## PHASE 3 — Product System
Product CRUD
Categories
Stock
Product Images
## PHASE 4 — Cart & Orders
Add to cart
Checkout
Order history
## PHASE 5 — Payment Integration

Possible Nepal payment gateways:

eSewa
Khalti
## PHASE 6 — Admin Dashboard APIs
Manage users
Manage sellers
Manage products
Analytics
## PHASE 7 — Deployment

Deploy backend on:

Render
Railway
VPS
DigitalOcean
Important Advice

After setup is complete:

User Model
Register API
Login API
JWT Authentication
Protected Routes
Seller System
Product CRUD
Order System

