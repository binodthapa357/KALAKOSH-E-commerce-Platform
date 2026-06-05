import User from "../models/User.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const register = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });
    const user = await User.create({ name, email, password, role });
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "7d" });
    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, is_verified: user.is_verified, is_active: user.is_active } });
  } catch (err) {
    console.log("FULL ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid password" });
    if (!user.is_active) return res.status(403).json({ success: false, message: "Account inactive" });
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "7d" });
    res.status(200).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.log("FULL ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};