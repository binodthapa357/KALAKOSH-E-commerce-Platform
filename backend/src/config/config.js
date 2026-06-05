import dotenv from "dotenv";
dotenv.config();
const config = {
  port: process.env.PORT || "",
  mongodbUrl: process.env.MONGODB_URL || "",
  jwtSecret: process.env.JWT_SECRET || "kalakosh_secret_key_2024",
};
export default config;
