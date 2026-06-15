import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for an authenticated user.
 * @param {string} id - The MongoDB user _id to sign.
 * @returns {string} Signed JWT.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "24h",
  });
};

export default generateToken;
