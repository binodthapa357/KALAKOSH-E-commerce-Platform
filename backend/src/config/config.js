import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || "",
  mongodbUrl: process.env.MONGODB_URL || "",
};

export default config;
