/**
 * Global Centralized Express Error Handler Middleware.
 * Standardizes API error responses across the application.
 */
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error("🔥 Global Error Handler Caught Exception:", err);

  // 1. Mongoose bad ObjectId (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ID format on path: ${err.path}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // 2. Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = Object.values(err.keyValue || {})[0] || "";
    const message = `Duplicate entry: '${value}' for field '${field}' already exists.`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // 3. Mongoose Schema Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new Error(message);
    error.statusCode = 400;
  }

  // 4. JSON Web Token Signature Error
  if (err.name === "JsonWebTokenError") {
    const message = "Please log in again (invalid token signature)";
    error = new Error(message);
    error.statusCode = 401;
  }

  // 5. JSON Web Token Expiration Error
  if (err.name === "TokenExpiredError") {
    const message = "Token expired, please log in again";
    error = new Error(message);
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

export default errorMiddleware;
