import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  
  name: { type: String },
  gender: { type: String },
  language: { type: String },
  accent: { type: String },
  audioUrl: { type: String },
  audioId: { type: String },

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,
});

export default mongoose.model("Audio", dataSchema);
