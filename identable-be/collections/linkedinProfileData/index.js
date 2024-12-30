import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  followersCount: Number,
  connectionsCount: Number,
  postReachcount: Number,

  followersCount1: mongoose.Schema.Types.Mixed,
  connectionsCount1: mongoose.Schema.Types.Mixed,

  createdAtString: String,
  createdAt: Number,
});

dataSchema.index({
  userId: 1,
  pageId: 1,
});

export default mongoose.model("LinkedinProfileData", dataSchema);
