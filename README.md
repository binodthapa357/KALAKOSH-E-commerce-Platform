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
# Completed Backend Architecture & Features

We have completed the entire foundational architecture of the **Kala Kosh Backend Services**, fully implementing robust and secure RESTful APIs for Authentication, Categories, Products, and Reviews.

## 🚀 Fully Implemented Modules

### 👤 1. Authentication & Security (Phase 2 Complete)
- **Registration & Login**: Secure signup with bcryptjs password hashing and role-based assignments (`user`, `vendor`, `admin`).
- **JWT Protection**: Restricts sensitive resources using a robust `protect` session guard.
- **Role-based Authorization**: Restricts capabilities using `authorize(...roles)` middlewares.
- **OTP Password Reset**: Triggers custom generated 6-digit verification codes using highly secure SHA-256 database hashing, complete with automatic 10-minute expiry validations and responsive HTML notification emailing.

### 📂 2. Category Hierarchy
- **Auto-slugification**: Automates clean, search-friendly slugs on Mongoose schema pre-validation.
- **Category Queries**: Supports parent/child relationships to build deep nested category views.

### 🎨 3. Comprehensive Product Module (Phase 3 Complete)
- **Multi-criteria Feed**: Returns paginated products with multi-property queries (`category`, `region`, `material`, price range) and sorting (`price`, `-price`, `rating`, `newest`).
- **Clash Protection**: Orders routes strictly to prevent Express route-matching parameter collisions.
- **Admin Previews**: Integrates optional auth middleware on public lists to enable administrators to preview pending products inline.
- **MongoDB Text Search**: Connects a high-performance compound `$text` search index over product names, descriptions, and region.

### ☁️ 4. Multer Memory Uploads & Cloudinary fallbacks
- **Memory Buffer Stream**: Utilizes `multer` with `memoryStorage` (5MB limits) to parse multipart/form-data.
- **Graceful Fallbacks**: Features dynamic visual mockup fallbacks (lorem picsum seeds + mock public IDs) if credentials are unconfigured, keeping the backend 100% functional locally.
- **Image Deletions**: Automatically resolves standard and mock Cloudinary URLs to pull entries from MongoDB and destroy Cloudinary assets in parallel.

### ⭐ 5. Rating Recalculations & Stock Checks (Phase 5 Complete)
- **Recalculations**: Leverages static Mongoose methods and schema post-hooks to auto-aggregate average ratings whenever reviews are saved, edited, or deleted.
- **Anti-spam Guard**: Enforces strict compound indices (`user_id` + `product_id`) preventing multiple product reviews per customer.
- **Stock Enforcements**: Implements non-negative stock patch protections for artisans/vendors.

---

## 🛣️ Complete API Route Registry

### 🔑 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new user with standard password hashing. |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns a JWT token. |
| `POST` | `/api/auth/forgot-password` | Public | Generates and sends a 6-digit password reset OTP to email. |
| `PUT` | `/api/auth/reset-password` | Public | Resets password after verifying active OTP. |
| `GET` | `/api/auth/me` | Protected | Retrieves current logged-in user profile details. |

### 📂 Category Endpoints (`/api/categories`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | Retrieves all product categories. |
| `GET` | `/api/categories/:id` | Public | Retrieves detailed information of a specific category by ID. |
| `POST` | `/api/categories` | Admin Only | Creates a new category (pre-validates and generates slugs). |
| `PUT` | `/api/categories/:id` | Admin Only | Updates a specific category's details (name, image, status). |
| `DELETE` | `/api/categories/:id` | Admin Only | Deletes a specific category from the database. |

### 🎨 Product Endpoints (`/api/products`)

#### Group 1: Product Listing & Search (Public)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public / Opt-Auth | Fetches active products with pagination (`page`, `limit`), sorting (`price`, `-price`, `rating`, `newest`), and filters (`category`, `region`, `material`, price range). Admins can append `?includeInactive=true` to preview draft listings. |
| `GET` | `/api/products/search` | Public | Performs MongoDB `$text` searches on Name + Description with category and price filters. |
| `GET` | `/api/products/featured` | Public | Retrieves top 8 active products sorted by highest rating for homepage hero. |
| `GET` | `/api/products/first` | Public | Utility compatibility endpoint fetching the first product entry. |

#### Group 2: Product & Category Views (Public)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products/category/:name` | Public | Retrieves all active products in one category. Validates category name existence before executing. |
| `GET` | `/api/products/artisan/:id` | Public | Retrieves all active products uploaded by a specific vendor profile ID. |
| `GET` | `/api/products/:id` | Public | Retrieves a single product with populated Category details, Vendor details, and all user Reviews. |

#### Group 3: Creation & Multi-Image Uploads (Protected)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/products` | Vendor / Admin | Creates a new product. Accepts `multipart/form-data` with up to 5 images uploaded to Cloudinary. |
| `POST` | `/api/products/:id/images` | Owner / Admin | Uploads and appends extra images to an existing product (up to 10 total). |

#### Group 4: Updates, Approvals & Deletions (Protected)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `PUT` | `/api/products/:id` | Owner / Admin | Updates product details (name, price, stock, category). Ownership strictly enforced. |
| `PUT` | `/api/products/:id/approve` | Admin Only | Approves or rejects a pending listing, changing status to `active` or `inactive`. |
| `DELETE` | `/api/products/:id` | Admin Only | Deletes a product completely from DB and removes all associated images from Cloudinary. |
| `DELETE` | `/api/products/:id/images/:imageId` | Owner / Admin | Removes a specific image URL from MongoDB and deletes it from Cloudinary by ID. |

#### Group 5: Review Actions & Stock Checks (Protected)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products/:id/reviews` | Public | Retrieves all reviews for a product, populated with user name. |
| `POST` | `/api/products/:id/reviews` | Buyer Only | Adds a rating (1 to 5) and comment. Enforces 1 review limit per buyer and auto-recalculates ratings. |
| `DELETE` | `/api/products/:id/reviews/:reviewId` | Owner / Admin | Deletes a review and auto-recalculates product average rating. |
| `PATCH` | `/api/products/:id/stock` | Owner / Admin | Updates product stock quantity. Non-negative values enforced. |

---

## ⚡ Running & Testing the Workspace

### 1. Launch Dev Server
Ensure your environment variables are configured in `.env`, then execute:
```bash
npm run dev
```

### 2. Run Integration Verifier
We have included a custom integration script that maps and tests imports, libraries, database connections, and routes registration. Run it using:
```bash
node src/utils/testProductModule.js
```


