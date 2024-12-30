import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  defaultTheme: { type: Boolean, default: false },

  backgroundColor: { type: String },
  backgroundMedia: { type: String },

  fontColor: { type: String },

  signatureAlign: { type: String },

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,
});

export default mongoose.model("Theme", dataSchema);
