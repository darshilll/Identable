import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  isFollowed: { type: Boolean, default: false },

  currentStatus: { type: String, default: "" },

  linkedinConnectedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LinkedinConnected",
  },
  linkedinUserName: { type: String },

  sentAt: Number,

  createdAt: Number,
  updatedAt: Number,
  isDeleted: { type: Boolean, default: false },

  isScrapped: { type: Boolean, default: false },
  isAgeScrapped: { type: Boolean, default: false },
});

export default mongoose.model("linkedinFollowing", dataSchema);
