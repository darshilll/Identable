import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  name: mongoose.Schema.Types.Mixed,
  image: mongoose.Schema.Types.Mixed,
  coverImg: mongoose.Schema.Types.Mixed,
  url: mongoose.Schema.Types.Mixed,
  about: mongoose.Schema.Types.Mixed,
  headline: mongoose.Schema.Types.Mixed,
  designation: mongoose.Schema.Types.Mixed,
  // hashtags: mongoose.Schema.Types.Mixed,
  followersCount: mongoose.Schema.Types.Mixed,
  connectionsCount: mongoose.Schema.Types.Mixed,
  type: mongoose.Schema.Types.Mixed,



  // contactInfo: mongoose.Schema.Types.Mixed,
  // currentJob: mongoose.Schema.Types.Mixed,
  // experience: mongoose.Schema.Types.Mixed,


  ssiData: mongoose.Schema.Types.Mixed,

  isAccess: { type: Boolean, default: false },

  s3Image: { type: String },
  s3ImageUpdatedAt: Number,

  createdAt: Number,
  updatedAt: Number,
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("LinkedinPage", dataSchema);
