# KALAKOSH API Documentation

**Base URL**: `https://kalakosh-e-commerce-platform.onrender.com` (Production) or `http://localhost:5000` (Local)

## Authentication & Authorization Header
Protected routes require a JSON Web Token (JWT) sent in the authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

Roles supported in the system: `user`, `vendor`, and `admin`.

---

## 1. Authentication & Profile Management (`/api/auth`)

### POST `/api/auth/register`
* **Description**: Register a new customer (`user`) or artisan (`vendor`).
* **Authentication**: Public
* **Request Body**:
  * `name` (string, required): Full name of the user.
  * `email` (string, required): Email address.
  * `password` (string, required): Minimum 6 characters.
  * `role` (string, optional): `"user"` or `"vendor"` (default: `"user"`).
  * *Additional fields required if `role` is `"vendor"`*:
    * `shop_name` (string): Name of the artisan shop.
    * `pan_number` (string): PAN registration number.
    * `bank_details` (object): Required bank account details (account name, account number, bank name, branch).
    * `pan_photo` (string): Base64 data string of the PAN photo.
* **Response**:
  * `201 Created`: Successfully registered user/vendor, returns user details and JWT `token`.
  * `400 Bad Request`: If email already exists, missing fields, or validation error.

### POST `/api/auth/login`
* **Description**: Authenticate user and receive token.
* **Authentication**: Public
* **Request Body**:
  * `email` (string, required): Registered email address.
  * `password` (string, required): User password.
* **Response**:
  * `200 OK`: Login successful, returns user/vendor details and JWT `token`.
  * `400 Bad Request`: Missing fields.
  * `401 Unauthorized`: Invalid email or password, or account is suspended/inactive.

### POST `/api/auth/forgot-password`
* **Description**: Request a password reset OTP (One-Time Password) sent to email.
* **Authentication**: Public
* **Request Body**:
  * `email` (string, required): Registered email address.
* **Response**:
  * `200 OK`: OTP sent to email.
  * `400 Bad Request`: Missing email.
  * `404 Not Found`: Email not registered.

### PUT `/api/auth/reset-password`
* **Description**: Reset password using the received OTP.
* **Authentication**: Public
* **Request Body**:
  * `otp` (string, required): The OTP code sent to the email.
  * `password` (string, required): The new password (minimum 6 characters).
* **Response**:
  * `200 OK`: Password updated successfully.
  * `400 Bad Request`: Invalid or expired OTP, or validation error.

### GET `/api/auth/me`
* **Description**: Retrieve the current authenticated user's profile information.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Returns the user details (excluding password) and associated vendor profile/address details if applicable.
  * `401 Unauthorized`: Missing or invalid token.

### POST `/api/auth/vendor`
* **Description**: Create a vendor profile for an already authenticated user account.
* **Authentication**: Protected (`Bearer <token>`)
* **Request Body**:
  * `shop_name` (string, required)
  * `pan_number` (string, required)
  * `bank_details` (object, required)
  * `pan_photo` (string, required): Base64 encoded image string.
* **Response**:
  * `201 Created`: Vendor profile created successfully (starts with `pending` status).
  * `400 Bad Request`: Profile already exists or photo upload failed.

### GET `/api/auth/addresses`
* **Description**: Retrieve list of saved shipping/billing addresses for the authenticated user.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Array of address objects.

### POST `/api/auth/addresses`
* **Description**: Add a new address to the user's profile.
* **Authentication**: Protected (`Bearer <token>`)
* **Request Body**:
  * `street` (string, required)
  * `city` (string, required)
  * `state` (string, required)
  * `postal_code` (string, optional)
  * `country` (string, optional)
  * `phone` (string, required)
  * `is_default` (boolean, optional): Set as default address.
* **Response**:
  * `201 Created`: Address added successfully.

### PUT `/api/auth/addresses/:addressId`
* **Description**: Update an existing address.
* **Authentication**: Protected (`Bearer <token>`)
* **Request Body**: Same fields as POST, all optional.
* **Response**:
  * `200 OK`: Address updated successfully.
  * `404 Not Found`: Address not found.

### DELETE `/api/auth/addresses/:addressId`
* **Description**: Delete a saved address.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Address deleted successfully.

### PUT `/api/auth/vendor/:id/status`
* **Description**: Approve, reject, or suspend a vendor profile (Admin only).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Request Body**:
  * `status` (string, required): One of `"pending"`, `"active"`, `"suspended"`, `"rejected"`.
* **Response**:
  * `200 OK`: Status updated successfully.
  * `400 Bad Request`: Invalid status value.
  * `404 Not Found`: Vendor profile not found.

---

## 2. Admin Dashboard (`/api/admin`)

*All routes in this group require authentication and `admin` role.*

### GET `/api/admin/stats`
* **Description**: Get aggregated stats for the dashboard (total revenue, total sales, user count, product count, pending vendors, top vendors).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Returns statistical dashboard object.

### GET `/api/admin/users`
* **Description**: Retrieve a list of all registered users.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Array of user profiles.

### PATCH `/api/admin/users/:id/toggle-status`
* **Description**: Enable/Disable (toggle) user account status (suspends or reactivates user).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: User active status toggled successfully.

### GET `/api/admin/products`
* **Description**: Retrieve all products in the catalog (regardless of vendor or status).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Array of all products.

### PATCH `/api/admin/products/:id/toggle-featured`
* **Description**: Toggle the product's featured status (`is_featured` true/false).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Featured status toggled.

### GET `/api/admin/vendors`
* **Description**: Get all vendor profiles, including pending ones.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: List of all vendor profiles with user details.

### PATCH `/api/admin/vendors/:id/status`
* **Description**: Update vendor application/account status.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Request Body**:
  * `status` (string, required): One of `"pending"`, `"active"`, `"suspended"`, `"rejected"`.
* **Response**:
  * `200 OK`: Vendor status updated successfully.

### GET `/api/admin/orders`
* **Description**: Retrieve list of all platform-wide sales orders.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Array of all orders.

### GET `/api/admin/reviews`
* **Description**: Retrieve list of all product reviews.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Array of all reviews.

### DELETE `/api/admin/reviews/:id`
* **Description**: Administrative force-delete of any product review.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Review deleted.

### POST `/api/admin/upload`
* **Description**: Direct media upload. Uploads an image file to the media store (Cloudinary).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Request Body**: `multipart/form-data` containing key `image` (binary file).
* **Response**:
  * `200 OK`: Image uploaded successfully, returns file metadata and URL.

---

## 3. Product Categories (`/api/categories`)

### GET `/api/categories`
* **Description**: Get list of all categories.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Array of categories (name, description, slug).

### POST `/api/categories`
* **Description**: Create a new category.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Request Body**:
  * `name` (string, required): Name of category.
  * `description` (string, optional)
* **Response**:
  * `201 Created`: Category created successfully.

### GET `/api/categories/:id`
* **Description**: Get category details by database ID.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Category object details.
  * `404 Not Found`: Category not found.

### PUT `/api/categories/:id`
* **Description**: Update a category's details.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Request Body**:
  * `name` (string, optional)
  * `description` (string, optional)
* **Response**:
  * `200 OK`: Category updated.

### DELETE `/api/categories/:id`
* **Description**: Delete a category.
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Category deleted.

### GET `/api/categories/slug/:slug`
* **Description**: Get category details by its URL slug.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Category details.

### GET `/api/categories/category/:name`
* **Description**: Get products by category name (legacy redirect support).
* **Authentication**: Public
* **Response**:
  * `200 OK`: Array of products under this category.

---

## 4. Products & Reviews (`/api/products`)

### GET `/api/products`
* **Description**: Retrieve a list of products with optional filters, search keywords, and pagination.
* **Authentication**: Public (Optional authentication header for customized tracking/state)
* **Query Parameters**:
  * `page` (integer, default: 1)
  * `limit` (integer, default: 10)
  * `search` (string): Search keyword matching product title or description.
  * `category` (string): Category ID or slug to filter.
  * `minPrice` (number)
  * `maxPrice` (number)
  * `artisan` (string): Artisan vendor ID.
  * `stockStatus` (string): `"inStock"`, `"lowStock"`, `"outOfStock"`.
* **Response**:
  * `200 OK`: Returns `{ products: [], page, totalPages, totalProducts }`.

### GET `/api/products/search`
* **Description**: Quick search products by keyword.
* **Authentication**: Public
* **Query Parameters**:
  * `q` (string, required): Search query string.
* **Response**:
  * `200 OK`: Array of matching products.

### GET `/api/products/featured`
* **Description**: Get featured/highlighted products.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Array of featured products.

### GET `/api/products/first`
* **Description**: Fetch the first product record in database (for debugging or showcase).
* **Authentication**: Public
* **Response**:
  * `200 OK`: Product details.

### GET `/api/products/category/:name`
* **Description**: Retrieve products matching a category name.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Array of products.

### GET `/api/products/artisan/:id`
* **Description**: Get products listed by a specific artisan vendor.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Array of products by the artisan.

### GET `/api/products/:id`
* **Description**: Get details of a single product.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Product details object.
  * `404 Not Found`: Product not found.

### POST `/api/products`
* **Description**: List a new product.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` or `admin`
* **Request Body**:
  * `name` (string, required)
  * `description` (string, required)
  * `price` (number, required)
  * `category` (string, required): Category name or ID.
  * `images` (array of strings, optional): Pre-uploaded image URLs.
  * `stock` (integer, optional, default: 1)
* **Response**:
  * `201 Created`: Product created successfully.

### PUT `/api/products/:id`
* **Description**: Update product details.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` or `admin` (Vendors can only update their own products).
* **Request Body**: Same fields as creation (all optional).
* **Response**:
  * `200 OK`: Product updated successfully.
  * `404 Not Found`: Product not found.

### DELETE `/api/products/:id`
* **Description**: Delete a product (Admin only).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: Product deleted.

### POST `/api/products/:id/images`
* **Description**: Upload additional images to a product.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` or `admin`
* **Request Body**: `multipart/form-data` containing key `images` (supports multiple file uploads).
* **Response**:
  * `200 OK`: Array of uploaded image URLs.

### DELETE `/api/products/:id/images/:imageId`
* **Description**: Delete a specific image from product's gallery.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` or `admin`
* **Response**:
  * `200 OK`: Image removed successfully.

### PATCH `/api/products/:id/stock`
* **Description**: Update stock count of a product.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` or `admin`
* **Request Body**:
  * `stock` (integer, required): Stock count (must be >= 0).
* **Response**:
  * `200 OK`: Stock count updated.

### GET `/api/products/:id/reviews`
* **Description**: Retrieve reviews and rating information for a product.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Array of review objects with reviewer name and rating.

### POST `/api/products/:id/reviews`
* **Description**: Write a review and rate a product.
* **Authentication**: Protected (`Bearer <token>`)
* **Request Body**:
  * `rating` (integer, required): Rating from 1 to 5.
  * `comment` (string, required): Review text.
* **Response**:
  * `201 Created`: Review added.

### DELETE `/api/products/:id/reviews/:reviewId`
* **Description**: Delete a review from a product (Can be deleted by the review owner).
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Review deleted.

---

## 5. Shopping Cart (`/api/cart`)

*All routes in this group require authentication.*

### GET `/api/cart`
* **Description**: Retrieve the user's active shopping cart items.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Shopping cart details, containing items (product, quantity, pricing) and subtotal.

### POST `/api/cart`
* **Description**: Add an item to the shopping cart.
* **Authentication**: Protected (`Bearer <token>`)
* **Request Body**:
  * `productId` (string, required)
  * `quantity` (integer, required, minimum: 1)
* **Response**:
  * `200 OK`: Cart updated successfully.
  * `400 Bad Request`: If item is out of stock.

### PUT `/api/cart`
* **Description**: Update the quantity of a product already in the cart.
* **Authentication**: Protected (`Bearer <token>`)
* **Request Body**:
  * `productId` (string, required)
  * `quantity` (integer, required, minimum: 1)
* **Response**:
  * `200 OK`: Cart quantity updated.

### DELETE `/api/cart/:productId`
* **Description**: Remove a single product item from the cart.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Item removed from cart.

### DELETE `/api/cart`
* **Description**: Empty the cart.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Cart cleared successfully.

---

## 6. Wishlist (`/api/wishlist`)

*All routes in this group require authentication.*

### GET `/api/wishlist`
* **Description**: Retrieve the user's wishlist of products.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Array of products in the wishlist.

### POST `/api/wishlist`
* **Description**: Add or remove a product from the wishlist (Toggles the status).
* **Authentication**: Protected (`Bearer <token>`)
* **Request Body**:
  * `productId` (string, required)
* **Response**:
  * `200 OK`: Wishlist updated successfully (returns updated action details).

### DELETE `/api/wishlist/:productId`
* **Description**: Remove a product from the wishlist.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Removed from wishlist successfully.

---

## 7. Order Management & Checkout (`/api/orders`)

### GET `/api/orders/track`
* **Description**: Track shipping status using order details.
* **Authentication**: Public
* **Query Parameters**:
  * `order_number` (string): The order identification number.
  * `email` (string): The purchaser's email address.
* **Response**:
  * `200 OK`: Tracking status information.
  * `404 Not Found`: Order not found.

### POST `/api/orders`
* **Description**: Create a new order (Checkout current cart items).
* **Authentication**: Protected (`Bearer <token>`)
* **Request Body**:
  * `shipping_address` (object, required): Destination address containing street, city, state, postal_code, country, phone.
  * `payment_method` (string, required): One of `"esewa"`, `"khalti"`, `"cod"`.
* **Response**:
  * `201 Created`: Order created, returns order details and payment initialization variables.

### GET `/api/orders/me`
* **Description**: Get order history of the authenticated user.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Array of orders.

### GET `/api/orders/:id`
* **Description**: Retrieve details of a specific order by ID.
* **Authentication**: Protected (`Bearer <token>`)
* **Response**:
  * `200 OK`: Detailed order object including line items and status.

### GET `/api/orders`
* **Description**: Retrieve all orders (Admin only).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Response**:
  * `200 OK`: List of all orders.

### PUT `/api/orders/:id/status`
* **Description**: Update the global status of an order (Admin only).
* **Authentication**: Protected (`Bearer <token>`) + Role: `admin`
* **Request Body**:
  * `status` (string, required): One of `"pending"`, `"processing"`, `"shipped"`, `"delivered"`, `"cancelled"`.
* **Response**:
  * `200 OK`: Order status updated.

### PUT `/api/orders/items/:orderItemId/status`
* **Description**: Update fulfillment status of a single item in an order (Vendor/Admin). Useful for multi-artisan orders.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` or `admin`
* **Request Body**:
  * `status` (string, required): One of `"pending"`, `"processing"`, `"shipped"`, `"delivered"`, `"cancelled"`.
* **Response**:
  * `200 OK`: Order item status updated.

---

## 8. Shipping Calculation (`/api/shipping`)

### GET `/api/shipping/rates`
* **Description**: Get current shipping rules and province/state-wise rates.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Shipping rates rules.

### POST `/api/shipping/calculate`
* **Description**: Estimate the shipping cost for specified items to a destination state.
* **Authentication**: Public
* **Request Body**:
  * `state` (string, required): Name of the destination province/state.
  * `items` (array, required): Array of products with quantity, e.g., `[{ "productId": "...", "quantity": 1 }]`.
* **Response**:
  * `200 OK`: Shipping cost estimation details.

---

## 9. Payment Integrations (`/api/payments`)

### POST `/api/payments/verify/esewa`
* **Description**: Callback endpoint to verify transaction status from eSewa.
* **Authentication**: Public
* **Request Body**:
  * `data` (string, required): Base64 encoded payload returned by eSewa secure signature.
* **Response**:
  * `200 OK`: Payment verified successfully, order status updated to paid.
  * `400 Bad Request`: Verification failed or signature invalid.

### POST `/api/payments/verify/khalti`
* **Description**: Callback to verify transaction from Khalti.
* **Authentication**: Public
* **Request Body**:
  * `token` (string, required): Token provided by Khalti callback.
  * `amount` (integer, required): Amount in paisa.
* **Response**:
  * `200 OK`: Payment verified successfully.
  * `400 Bad Request`: Verification error.

### POST `/api/payments/cod/confirm/:id`
* **Description**: Confirm cash on delivery offline collection (Vendor/Admin only).
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` or `admin`
* **Response**:
  * `200 OK`: Payment confirmed.

---

## 10. Public Vendor Profiles (`/api/vendors`)

### GET `/api/vendors`
* **Description**: Retrieve public active approved artisan profiles.
* **Authentication**: Public
* **Response**:
  * `200 OK`: List of approved vendors.

### GET `/api/vendors/:id`
* **Description**: Retrieve public profile details of a single vendor.
* **Authentication**: Public
* **Response**:
  * `200 OK`: Vendor details.

---

## 11. Vendor Private Dashboard (`/api/vendor`)

*All routes in this group require authentication and `vendor` role.*

### GET `/api/vendor/me`
* **Description**: Retrieve vendor own profile status and details.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor`
* **Response**:
  * `200 OK`: Vendor details.
  * `403 Forbidden`: Restricted if no vendor profile exists.

*All routes below also require active status approval.*

### GET `/api/vendor/products`
* **Description**: Retrieve products created by this vendor.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` (Active only)
* **Response**:
  * `200 OK`: Array of vendor's own products.

### POST `/api/vendor/products`
* **Description**: Create and list a new product as a vendor with image upload.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` (Active only)
* **Request Body**: `multipart/form-data` containing:
  * `name` (string, required)
  * `description` (string, required)
  * `price` (number, required)
  * `category` (string, required): Category Name or ID.
  * `images` (array of binary images, optional, max 5 images)
  * `stock` (integer, optional)
* **Response**:
  * `201 Created`: Vendor product created successfully.

### GET `/api/vendor/orders`
* **Description**: Get orders containing products belonging to this vendor.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` (Active only)
* **Response**:
  * `200 OK`: Array of orders with vendor's items.

### PATCH `/api/vendor/orders/:id`
* **Description**: Update fulfillment status of a vendor's order item.
* **Authentication**: Protected (`Bearer <token>`) + Role: `vendor` (Active only)
* **Request Body**:
  * `status` (string, required): One of `"pending"`, `"processing"`, `"shipped"`, `"delivered"`, `"cancelled"`.
* **Response**:
  * `200 OK`: Status updated successfully.