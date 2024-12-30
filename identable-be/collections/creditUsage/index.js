import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  credit: { type: Number },
  moduleType: { type: String },

  discoverEmailLinkedinUserName: { type: String },

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: Number,
});

export default mongoose.model("CreditUsage", dataSchema);
