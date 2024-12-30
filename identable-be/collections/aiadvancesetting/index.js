import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  formality: { type: String },
  tone: {},
  language: { type: String },
  chatGPTVersion: { type: String },
  
  keyword: { type: Array },
  about: { type: String },
  pointOfView: { type: String },
  targetAudience: { type: Array },
  objective: { type: String },
  callOfAction: { type: String },
  type: { type: String },

  website: { type: String },
  sellType: { type: String },

  isPostProcessing: { type: Boolean, default: false },
  isCurrentPage: { type: Boolean, default: false },
  brand: {type : String},

  createdAt: Number,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("AIAdvanceSetting", dataSchema);
