import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "mock_cloud",
  api_key: process.env.CLOUDINARY_API_KEY || "mock_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "mock_secret",
});

/**
 * Check if Cloudinary is fully configured.
 * @returns {boolean}
 */
const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  return !!(name && name !== "mock_cloud" && key && key !== "mock_key" && secret && secret !== "mock_secret");
};

/**
 * Uploads an image buffer to Cloudinary. Falls back to mock URLs if Cloudinary is not configured.
 * @param {Buffer} fileBuffer - The binary image buffer.
 * @param {string} folder - Target folder in Cloudinary.
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadImageToCloudinary = async (fileBuffer, folder = "products") => {
  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary is not configured or uses mock credentials. Falling back to dynamic mock image.");
    // Generate a random high-quality mock URL from Lorem Picsum and a mock public ID
    const randomId = Math.random().toString(36).substring(7);
    const mockUrl = `https://picsum.photos/seed/${randomId}/600/400`;
    const mockPublicId = `mock_public_id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      secure_url: mockUrl,
      public_id: mockPublicId,
    };
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
  if (!isCloudinaryConfigured() || !publicId || publicId.startsWith("mock_")) {
    console.warn(`Cloudinary not configured or mock public ID (${publicId}). Skipping actual Cloudinary deletion.`);
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
