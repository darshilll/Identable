import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  content: { type: String },
  analyzeData: {},

  createdAt: Number,
});

export default mongoose.model("ContentHumanize", dataSchema);
