import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  username: mongoose.Schema.Types.Mixed,
  imageSrc: mongoose.Schema.Types.Mixed,
  name: mongoose.Schema.Types.Mixed,
  occupation: mongoose.Schema.Types.Mixed,
  profileUrl: mongoose.Schema.Types.Mixed,
  profileImagUrl: mongoose.Schema.Types.Mixed,

  email: mongoose.Schema.Types.Mixed,
  companyName: mongoose.Schema.Types.Mixed,

  location: mongoose.Schema.Types.Mixed,
  birthday: mongoose.Schema.Types.Mixed,
  industry: mongoose.Schema.Types.Mixed,

  //Followers
  headline: mongoose.Schema.Types.Mixed,

  //Prospects
  connectionId: mongoose.Schema.Types.Mixed,
  primarySubTitle: mongoose.Schema.Types.Mixed,
  secondarySubTitle: mongoose.Schema.Types.Mixed,
  insight: mongoose.Schema.Types.Mixed,
  summary: mongoose.Schema.Types.Mixed,
  isPremium: mongoose.Schema.Types.Mixed,

  enrowEmail: mongoose.Schema.Types.Mixed,
  enrowInfo: mongoose.Schema.Types.Mixed,
  enrowEmailId: String,
  enrowEmailStatus: String,
  enrowQualification: String,
  enrowWebhookResponse: {},

  age: Number,
  gender: String,

  city: String,
  state: String,
  country: String,

  isScrappedDetails: { type: Boolean, default: false },
  scrappedDetailsAt: Number,

  isScrappedAge: { type: Boolean, default: false },
  scrappedAgeAt: Number,

  createdAt: Number,
  updatedAt: Number,
});

dataSchema.index({
  username: 1,
});


export default mongoose.model("LinkedinUserData", dataSchema);
