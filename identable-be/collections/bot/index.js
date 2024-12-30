import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  proxy: { type: String },
  location: { type: String },
  status: { type: String },
  cookies: { type: String },
  cookiesExpiry: { type: String },
  userAgent: { type: String },
  isCookieValid: { type: Boolean, default: true },
  isEnabled: { type: Boolean, default: true },
  isUser: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: Number,
  updatedAt: Number,
});

export default mongoose.model("Bot", userSchema);
