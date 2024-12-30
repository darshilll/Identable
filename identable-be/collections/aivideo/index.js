import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  renderId: { type: String },
  videoId: { type: String },
  embedId: { type: String },
  status: { type: String },

  editorUrl: { type: String },
  videoUrl: { type: String },
  thumbUrl: { type: String },
  animatedThumbnailUrl: { type: String },
  progress: { type: Number },
  metadata: mongoose.Schema.Types.Mixed,

  topic: { type: String },
  videoColor: { type: String },
  videoCollection: { type: String },

  ratio: { type: String },
  length: { type: String },
  voice: { type: String },

  oneClickPostId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },

  isScheduled: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Number },
});

export default mongoose.model("aivideo", dataSchema);
