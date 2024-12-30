import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  campaignType: { type: Number },
  campaignName: { type: String },
  searchUrl: { type: String },

  isCompanyCampaign: { type: Boolean, default: false },

  isPremiumAccount: { type: Boolean, default: false },
  isInMailDiscover: { type: Boolean, default: false },
  isAlreadyTalkedPeople: { type: Boolean, default: false },

  isProcessing: { type: Boolean, default: true },

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,
});

export default mongoose.model("Campaign", dataSchema);
