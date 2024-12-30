import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  topic: { type: String },

  dailyPost: Number,
  duration: { type: String },

  isWeekendInclude: { type: Boolean, default: false },
  weekData: [],

  isPostGenerated: { type: Boolean, default: false },

  carouselTemplate: { type: String },
  carouselId: { type: mongoose.Schema.Types.ObjectId, ref: "Carousel" },
  
  color: { type: String },
  goal: { type: String },
  includeContentType: [],
  isABVersion: { type: Boolean, default: false },
  isBrandKit: { type: Boolean, default: false },
  isStartImmediately: { type: Boolean, default: false },
  keyword: [],
  startDate: { type: Number },
  topic: { type: String },
  campaignProgress: Number,
  isBoostCampaign: { type: Boolean, default: false },

  imageStyle: { type: String },
  videoCollection: { type: String },
  videoLength: { type: String },
  videoRatio: { type: String },
  videoVoice: { type: String },

  status: { type: String },

  createdAt: Number,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("OneClick", dataSchema);
