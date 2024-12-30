import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },
  mediaUrl: { type: String },
  mimetype: { type: String },
  mediaSize: { type: Number },
  createdAt: Number,
});

export default mongoose.model("Media", dataSchema);
