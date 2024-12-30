import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },
  linkedinUserDataId: { type: mongoose.Schema.Types.ObjectId, ref: "linkedinUserData" },
  linkedinUserName: { type: String },
  
  timeConnected: mongoose.Schema.Types.Mixed,

  // username: mongoose.Schema.Types.Mixed,
  imageSrc: mongoose.Schema.Types.Mixed,
  // name: mongoose.Schema.Types.Mixed,
  // occupation: mongoose.Schema.Types.Mixed,
  // profileUrl: mongoose.Schema.Types.Mixed,
  // profileImagUrl: mongoose.Schema.Types.Mixed,

  isConnected: { type: Boolean, default: false },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },

  // email: mongoose.Schema.Types.Mixed,
  // companyName: mongoose.Schema.Types.Mixed,

  // enrowInfo: mongoose.Schema.Types.Mixed,

  // enrowEmailId: String,
  // enrowEmailStatus: String,
  // enrowQualification: String,
  // enrowWebhookResponse: {},

  createdAt: Number,
  updatedAt: Number,
  isDeleted: { type: Boolean, default: false },

  isScrappedDetails: { type: Boolean, default: false },
  isScrappedAge: { type: Boolean, default: false },
  
});

dataSchema.index({
  linkedinUserName: 1,
});

dataSchema.index({
  userId: 1,
  pageId: 1
});

export default mongoose.model("LinkedinConnected", dataSchema);
