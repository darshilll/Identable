import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  goal: { type: String },
  topic: { type: String },
  keywords: { type: String },
  headline: { type: String },
  content: { type: String },
  bannerImageSetting: {},
  bannerImage: { type: String },

  headingData: { type: Array },
  youtubeVideos: { type: Array },
  authorityLinks: { type: Array },
  isFAQ: { type: Boolean, default: false },
  isConclusion: { type: Boolean, default: false },
  isCTA: { type: Boolean, default: false },
  language: { type: String },
  length: { type: String },
  factualData: { type: String },
  imageCount: { type: Number },
  imageSource: { type: String },
  imageOrientation: { type: String },
  isAltTag: { type: Boolean, default: false },

  titleTag: { type: String },
  metaTag: { type: String },

  isScheduled: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isUpdated: { type: Boolean },
  updatedAt: { type: Number },

  createdAt: { type: Number },
});

export default mongoose.model("article", dataSchema);
