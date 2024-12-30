import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  postId: mongoose.Schema.Types.Mixed,
  text: mongoose.Schema.Types.Mixed,
  image: mongoose.Schema.Types.Mixed,
  video: mongoose.Schema.Types.Mixed,
  likeCount: Number,
  commentCount: Number,
  repostCount: Number,
  impressionCount: Number,
  uniqueViews: Number,
  postTime: Number,
  comments: mongoose.Schema.Types.Mixed,
  mediaUrls: mongoose.Schema.Types.Mixed,
  postType: mongoose.Schema.Types.Mixed,
  postUrl: mongoose.Schema.Types.Mixed,
  article: mongoose.Schema.Types.Mixed,
  createdAt: Number,
  updatedAt: Number,

  likeCount1: mongoose.Schema.Types.Mixed,
  commentCount1: mongoose.Schema.Types.Mixed,
  repostCount1: mongoose.Schema.Types.Mixed,
  impressionCount1: mongoose.Schema.Types.Mixed,
  uniqueViews1: mongoose.Schema.Types.Mixed,
  
  analytics: mongoose.Schema.Types.Mixed,

  postUrl: mongoose.Schema.Types.Mixed,

  isScappedAnalytics: { type: Boolean, default: false },

  isDeleted: { type: Boolean, default: false },

  s3Image: { type: String },
  imageUpdatedAt: Number,
});

dataSchema.index({
  userId: 1,
  pageId: 1,
});

export default mongoose.model("LinkedinPost", dataSchema);
