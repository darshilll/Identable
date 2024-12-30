import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },
  linkedinUserDataId: { type: mongoose.Schema.Types.ObjectId, ref: "linkedinUserData" },
  linkedinUserName: { type: String },
  
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },

  prospectType: mongoose.Schema.Types.Mixed,

  // connectionId: mongoose.Schema.Types.Mixed,
  // name: mongoose.Schema.Types.Mixed,
  // profileUrl: mongoose.Schema.Types.Mixed,
  // profileImagUrl: mongoose.Schema.Types.Mixed,
  // primarySubTitle: mongoose.Schema.Types.Mixed,
  // secondarySubTitle: mongoose.Schema.Types.Mixed,
  // insight: mongoose.Schema.Types.Mixed,
  // summary: mongoose.Schema.Types.Mixed,
  // isPremium: mongoose.Schema.Types.Mixed,
  // prospectType: mongoose.Schema.Types.Mixed,
  // username: mongoose.Schema.Types.Mixed,

  // email: mongoose.Schema.Types.Mixed,
  // companyName: mongoose.Schema.Types.Mixed,

  // enrowInfo: mongoose.Schema.Types.Mixed,

  // enrowEmailId: String,
  // enrowEmailStatus: String,
  // enrowQualification: String,
  // enrowWebhookResponse: {},

  isProfileVisiting: Boolean,
  profileVisitingAt: Number,

  isProfileVisited: Boolean,
  profileVisitedAt: Number,
  profileVisitedError: mongoose.Schema.Types.Mixed,
  profileVisitedStatus: Boolean,

  isCommenting: Boolean,
  commentingAt: Number,
  comment: String,

  isCommented: Boolean,
  commentedAt: Number,
  commentedError: mongoose.Schema.Types.Mixed,
  commentedStatus: Boolean,

  isFollowing: Boolean,
  followingAt: Number,

  isFollowed: Boolean,
  followedAt: Number,
  followedError: mongoose.Schema.Types.Mixed,
  followedStatus: Boolean,

  isConnecting: Boolean,
  connectingAt: Number,
  note: String,

  isConnected: Boolean,
  connectedAt: Number,
  connectedError: mongoose.Schema.Types.Mixed,
  connectedStatus: Boolean,

  currentStatus: { type: String, default: "" },

  isLinkedinConnection: { type: Boolean, default: false },
  acceptedAt: Number,

  createdAt: Number,
  updatedAt: Number,
  isDeleted: { type: Boolean, default: false },

  isScrapped: { type: Boolean, default: false },
  isAgeScrapped: { type: Boolean, default: false },
});

dataSchema.index({
  linkedinUserName: 1,
});

dataSchema.index({
  userId: 1,
  pageId: 1
});

export default mongoose.model("LinkedinConnection", dataSchema);
