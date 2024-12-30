import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  mediaUrl: { type: String },
  title: { type: String },
  idea: { type: String },
  isTemplate: { type: Boolean, default: false },

  templateSetting: {},

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,
});

export default mongoose.model("AdCreativeCustomTemplate", dataSchema);
