import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  author: { type: String },
  title: { type: String },
  description: { type: String },
  url: { type: String },
  urlToImage: { type: String },
  publishedAt: { type: String },
  content: { type: String },

  isScheduled: { type: Boolean, default: false },
  createdAt: Number,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("TrendingNews", dataSchema);
