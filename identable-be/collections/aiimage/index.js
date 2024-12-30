import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  imageUrl: { type: String },
  responseData: mongoose.Schema.Types.Mixed,

  prompt: { type: String },

  isEnabled: { type: Boolean, default: false },

  createdAt: Number,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("AIImage", dataSchema);
