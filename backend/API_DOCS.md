# KALAKOSH API Documentation
Base URL: https://kalakosh-e-commerce-platform.onrender.com

## How to send the token (for protected routes)
Header: Authorization: Bearer <your_jwt_token>

## AUTH ROUTES
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
PUT    /api/auth/reset-password
GET    /api/auth/me
POST   /api/auth/vendor
PUT    /api/auth/vendor/:id/status
GET    /api/auth/addresses
POST   /api/auth/addresses
PUT    /api/auth/addresses/:addressId
DELETE /api/auth/addresses/:addressId

## CATEGORY ROUTES
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

## PRODUCT ROUTES
GET    /api/products
GET    /api/products/search?q=lokta
GET    /api/products/featured
GET    /api/products/category/:name
GET    /api/products/artisan/:id
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
PUT    /api/products/:id/approve
DELETE /api/products/:id
POST   /api/products/:id/images
DELETE /api/products/:id/images/:imageId
PATCH  /api/products/:id/stock

## REVIEW ROUTES
GET    /api/products/:id/reviews
POST   /api/products/:id/reviews
DELETE /api/products/:id/reviews/:reviewId

## CART ROUTES
GET    /api/cart
POST   /api/cart
PUT    /api/cart
DELETE /api/cart/:productId
DELETE /api/cart

## WISHLIST ROUTES
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId

## ORDER ROUTES
POST   /api/orders
GET    /api/orders/me
GET    /api/orders/:id
GET    /api/orders
PUT    /api/orders/:id/status
PUT    /api/orders/items/:orderItemId/status

## SHIPPING ROUTES
GET    /api/shipping/rates
POST   /api/shipping/calculate

## PAYMENT ROUTES
POST   /api/payments/verify/esewa
POST   /api/payments/verify/khalti
POST   /api/payments/cod/confirm/:id