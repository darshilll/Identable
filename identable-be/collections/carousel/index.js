import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
themeTitle: { type: String },
  backgroundColor: { type: String },
  backgroundImage: { type: String },
  primaryColor: { type: String },
  secondaryColor: { type: String },
  primaryFont: { type: String },
  secondaryFont: { type: String },
  isSolidBackground: { type: Boolean, default: false },
  
  slideImages: [],
  slideHtml: [],

  carouselSetting: {},

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },

  createdAt: Number,
});

export default mongoose.model("Carousel", dataSchema);
