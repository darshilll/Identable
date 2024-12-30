import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  content: { type: String },
  humanizeContent: { type: String },

  createdAt: Number,
});

export default mongoose.model("ContentAnalyze", dataSchema);
