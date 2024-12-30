import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  carouselSetting: {},
  mediaUrl: { type: String },
  carouselName: { type: String },
  carouselIdea: { type: String },
  carouselLength: Number,
  isTemplate: { type: Boolean, default: false },
  status: { type: String },

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,
});

export default mongoose.model("CarouselCustomTemplate", dataSchema);
