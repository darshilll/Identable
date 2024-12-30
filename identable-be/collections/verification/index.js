import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String },
  otp: { type: String },
  createdAt: Number,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Number,
});

export default mongoose.model("Verification", userSchema);
