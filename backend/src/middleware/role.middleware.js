/**
 * Role Authorization Middleware.
 * Enforces access control based on user roles (e.g. admin, vendor, user).
 * @param {...string} roles - The list of allowed roles.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user profile missing" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

export default authorize;
