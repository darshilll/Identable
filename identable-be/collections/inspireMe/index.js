import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
  type: { type: String },

  topic: { type: String },
  post: { type: String },
  keyword: mongoose.Schema.Types.Mixed,
  image: { type: String },
  giphy: { type: String },
  pexel: { type: String },
  defultMedia: { type: String },
  isScheduled: { type: Boolean, default: false },
  isLatest: { type: Boolean, default: false },

  status: { type: String },

  inspireMeType: { type: String },
  postTopic: { type: String },
  wordRange: { type: String },
  
  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,

  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("InspireMe", dataSchema);
