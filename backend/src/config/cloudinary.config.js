import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Check if Cloudinary is fully configured. Throws on startup-relevant checks
 * if credentials are missing, rather than silently falling back to mocks.
 */
const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
};

if (!isCloudinaryConfigured()) {
  console.error(
    "❌ Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, " +
    "and CLOUDINARY_API_SECRET in backend/.env — image uploads will fail until this is fixed."
  );
}

/**
 * Uploads an image buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The binary image buffer.
 * @param {string} folder - Target folder in Cloudinary.
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadImageToCloudinary = async (fileBuffer, folder = "products") => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an image from Cloudinary.
 * @param {string} publicId - The public ID of the image to destroy.
 * @returns {Promise<{ result: string }>}
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary not configured. Skipping deletion for:", publicId);
    return { result: "ok" };
  }

  if (!publicId) {
    return { result: "ok" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Failed to delete image (${publicId}) from Cloudinary:`, error);
    throw error;
  }
};

export default cloudinary;