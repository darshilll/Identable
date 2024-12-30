import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },

  subscriptionStatus: { type: String },
  cancelReason: { type: String },
  recurringType: { type: String },

  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },

  renewCycleDate: Number,
  lastRenewDate: Number,

  credit: { type: Number },
  additionalCredit: { type: Number },

  crmCampaignLimit: { type: Number },
  companyProfileLimit: { type: Number },

  isAIVideo: { type: Boolean, default: false },

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,
});

export default mongoose.model("Subscription", dataSchema);
