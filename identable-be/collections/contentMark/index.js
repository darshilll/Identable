import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  content: { type: String },
  status: { type: String },

  createdAt: Number,
});

export default mongoose.model("ContentMark", dataSchema);
