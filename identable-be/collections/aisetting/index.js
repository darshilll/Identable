import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  formality: { type: String },
  tone: {},
  language: { type: String },
  chatGPTVersion: { type: String },

  createdAt: Number,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("AISetting", dataSchema);
