import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  imageUrl: { type: String },
  logoUrl: { type: String },
  primaryColor: { type: String },
  secondaryColor: { type: String },
  accent1Color: { type: String },
  accent2Color: { type: String },
  titleFont: { type: String },
  bodyFont: { type: String },
  website: { type: String },
  contact : { type: String },

  createdAt: Number,
  updatedAt: Number,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("Brandkit", dataSchema);
