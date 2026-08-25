import mongoose from "mongoose";

const bankDetailsSchema = new mongoose.Schema(
  {
    bank_name: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
    },
    account_name: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
    },
    account_number: {
      type: String,
      required: [true, "Bank account number is required"],
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required to link a vendor account"],
      unique: true,
    },
    shop_name: {
      type: String,
      required: [true, "Shop name is required"],
      unique: true,
      trim: true,
    },
    pan_number: {
      type: String,
      required: [true, "PAN number is required for verification"],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Standard Nepalese PAN is a 9-digit numeric code
          return /^\d{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid 9-digit PAN number!`,
      },
    },
    pan_photo: {
      type: String,
      required: [true, "PAN photo is required for verification"],
    },
    bank_details: {
      type: bankDetailsSchema,
      required: [true, "Bank details are required for vendor payments"],
    },
    commission_rate: {
      type: Number,
      default: 0.1, // 10% standard platform fee
      min: [0, "Commission rate cannot be negative"],
      max: [1, "Commission rate cannot exceed 1 (100%)"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "active", "suspended", "rejected"],
        message: "Status must be pending, active, suspended, or rejected",
      },
      default: "pending",
    },
    bio: {
      type: String,
      trim: true,
    },
    story: {
      type: String,
      trim: true,
    },
    profile_image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;
