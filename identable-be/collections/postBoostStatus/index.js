import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  isBoosted: { type: Boolean, default: false },
  botId: { type: mongoose.Schema.Types.ObjectId, ref: "Bot" },
  status: { type: String },
  createdAt: Number,
  updatedAt: Number,
});

export default mongoose.model("PostBoostStatus", dataSchema);
