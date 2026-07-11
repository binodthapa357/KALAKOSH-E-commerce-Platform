/**
 * Admin Seeder Script
 * Creates an admin user in your MongoDB cluster.
 *
 * Usage:
 *   node scripts/seedAdmin.js
 *
 * Requires: backend .env with MONGODB_URI set
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from backend .env
dotenv.config({ path: join(__dirname, '..', '.env') });

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
    is_verified: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
    addresses: [],
    reset_token: { token: String, expires_at: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const ADMIN_EMAIL = 'admin@kalakosh.com';
const ADMIN_PASSWORD = 'Admin@123'; // Change after first login!
const ADMIN_NAME = 'Kalakosh Admin';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`ℹ  Admin user already exists: ${ADMIN_EMAIL}`);
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('🔄 Updated existing user to admin role.');
      }
      await mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      is_verified: true,
      is_active: true,
    });

    console.log('🎉 Admin user created successfully!');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('');
    console.log('⚠  Change the password after your first login!');
  } catch (err) {
    console.error('❌ Seeder error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
