import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  fullName: mongoose.Schema.Types.Mixed,
  designation: mongoose.Schema.Types.Mixed,
  image: mongoose.Schema.Types.Mixed,

  linkedinUserId: mongoose.Schema.Types.Mixed,
  profileLink: mongoose.Schema.Types.Mixed,
  followersCount: mongoose.Schema.Types.Mixed,
  connectionsCount: mongoose.Schema.Types.Mixed,
  hashtags: mongoose.Schema.Types.Mixed,
  about: mongoose.Schema.Types.Mixed,

  type: { type: String },

  createdAt: Number,
  updatedAt: Number,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("LinkedinProfile", dataSchema);
