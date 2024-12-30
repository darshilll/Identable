import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  templateSetting: {},

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  createdAt: Number,
});

export default mongoose.model("AdCreative", dataSchema);
