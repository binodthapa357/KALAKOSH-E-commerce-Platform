import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "vendor", "admin"], default: "user" },
  is_verified: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compareSync(plain, this.password);
};

export default mongoose.model("User", userSchema);
