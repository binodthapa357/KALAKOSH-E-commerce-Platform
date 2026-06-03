import crypto from "crypto";
import User from "../models/User.model.js";
import Vendor from "../models/Vendor.model.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";


/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create user (password is automatically hashed by Mongoose hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password using schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ message: "User account is suspended" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate password reset OTP and email it
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email address" });
    }

    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP via SHA-256 to store securely in database
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Save hashed token and 10-minute expiry time
    user.reset_token.token = hashedOtp;
    user.reset_token.expires_at = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Dispatch the email
    const subject = "KALAKOSH - Password Reset OTP Code";
    const textMessage = `You are receiving this email because you requested a password reset. Your OTP is: ${otp}. It will expire in 10 minutes.`;
    const htmlMessage = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 25px; border: 1px solid #e1e8ed; border-radius: 12px; background-color: #ffffff; color: #2c3e50;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #6c5ce7; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">KALAKOSH</h1>
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #a5b1c2;">Nepali Handicrafts E-commerce</span>
        </div>
        <hr style="border: none; border-top: 1px solid #f1f2f6; margin-bottom: 20px;">
        <p style="font-size: 15px; line-height: 1.6;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.6;">We received a request to reset your password. Use the following 6-digit One-Time Password (OTP) to securely proceed. This OTP is valid for exactly <strong>10 minutes</strong>.</p>
        
        <div style="background-color: #f7f9fa; padding: 20px; text-align: center; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2d3436; border: 1px dashed #ced6e0; margin: 25px 0;">
          ${otp}
        </div>
        
        <p style="font-size: 14px; color: #7f8c8d; line-height: 1.6;">If you did not request a password reset, please ignore this email. Your password will remain secure and unchanged.</p>
        <hr style="border: none; border-top: 1px solid #f1f2f6; margin: 25px 0;">
        <div style="text-align: center; font-size: 12px; color: #a5b1c2;">
          <p style="margin: 5px 0;">This is an automated security message. Please do not reply directly to this mail.</p>
          <p style="margin: 5px 0; font-weight: bold;">© KALAKOSH. Lalitpur, Nepal.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject,
        message: textMessage,
        html: htmlMessage,
      });
      res.status(200).json({ success: true, message: "Reset OTP successfully sent to your email" });
    } catch (emailError) {
      // Clear token values on email failure
      user.reset_token.token = null;
      user.reset_token.expires_at = null;
      await user.save();
      console.error("Nodemailer Error during Forgot Password:", emailError);
      return res.status(500).json({ message: "OTP Email could not be sent. Please try again." });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify OTP and reset password
 * @route   PUT /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { otp, password } = req.body;

    if (!otp || !password) {
      return res.status(400).json({ message: "Please provide the OTP code and new password" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the incoming plain OTP to search in DB
    const hashedOtp = crypto.createHash("sha256").update(otp.toString().trim()).digest("hex");

    // Find the user who has this active OTP and where it hasn't expired
    const user = await User.findOne({
      "reset_token.token": hashedOtp,
      "reset_token.expires_at": { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }

    // Update fields
    user.password = password;
    user.reset_token.token = null;
    user.reset_token.expires_at = null;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully! Please log in." });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user details
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user has already been loaded by protect middleware
    res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        addresses: req.user.addresses,
        is_verified: req.user.is_verified,
        is_active: req.user.is_active,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
};

/**
 * @desc    Create a vendor profile for an authenticated user with vendor role
 * @route   POST /api/auth/vendor
 * @access  Private (Vendor only)
 */
export const createVendorProfile = async (req, res, next) => {
  try {
    const { shop_name, pan_number, bank_details } = req.body;

    if (!shop_name || !pan_number || !bank_details) {
      return res.status(400).json({ message: "Please provide shop_name, pan_number, and bank_details" });
    }

    // Check if user has the vendor role
    if (req.user.role !== "vendor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only users registered with the 'vendor' role can create a vendor profile" });
    }

    // Check if vendor profile already exists for this user
    const existingVendor = await Vendor.findOne({ user_id: req.user._id });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor profile already exists for this user account" });
    }

    const vendor = await Vendor.create({
      user_id: req.user._id,
      shop_name,
      pan_number,
      bank_details,
      status: "pending", // starts as pending approval
    });

    res.status(201).json({
      success: true,
      message: "Vendor profile created successfully! It is pending admin approval.",
      vendor,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  createVendorProfile,
};
