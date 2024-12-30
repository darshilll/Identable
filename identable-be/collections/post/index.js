import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  scheduleDateTime: { type: Number },
  postBody: { type: String },
  timeSlot: { type: String },
  timePeriod: { type: String },
  postMedia: { type: String },
  postMediaType: { type: String },
  generatedType: { type: String },
  status: { type: String },

  postUrl: { type: String },
  linkedinPostId: { type: String },

  documentDescription: { type: String },

  articleHeadline: { type: String },
  articleTitle: { type: String },

  isBoosting: { type: Boolean, default: false },
  likeCount: Number,
  boostStatus: { type: String, default: "scheduled" },
  botIds: [],

  oneClickId: { type: mongoose.Schema.Types.ObjectId, ref: "OneClick" },
  isOneClickGenerated: { type: Boolean, default: false },
  
  postError: mongoose.Schema.Types.Mixed,
  postErrorCode: mongoose.Schema.Types.Mixed,
  
  carouselId: { type: mongoose.Schema.Types.ObjectId, ref: "CarouselCustomTemplate" },
  carouselTemplate: [],
  carouselSetting: {},

  postTopic: { type: String },

  articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,
});

export default mongoose.model("Post", dataSchema);
