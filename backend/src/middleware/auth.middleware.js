import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * JWT Verification Middleware.
 * Guards routes, verifies the Bearer token, and populates req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    // Verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load corresponding user, excluding password hash
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }

    // Prevent access if user is suspended or deactivated
    if (!user.is_active) {
      return res.status(401).json({ message: "User account is inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Auth Middleware Error:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Please log in again (invalid token)" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }
    return res.status(401).json({ message: "Not authorized to access this route" });
  }
};

/**
 * Role Guard Middleware Factory.
 * Use after `protect` to restrict a route to specific roles.
 * Example: router.get("/", protect, authorize("vendor"), handler)
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized to access this route" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

export default protect;