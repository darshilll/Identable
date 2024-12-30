import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  proxy: { type: String },
  isUsed: { type: Boolean, default: false },
});

export default mongoose.model("Proxy", dataSchema);
