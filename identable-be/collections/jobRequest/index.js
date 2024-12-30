import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  requestData: mongoose.Schema.Types.Mixed,
  submittedAt: Number,

  jobTriggerResponse: mongoose.Schema.Types.Mixed,
  jobTriggerError: mongoose.Schema.Types.Mixed,
  jobTriggerResponseAt: Number,

  responseData: mongoose.Schema.Types.Mixed,
  responseError: mongoose.Schema.Types.Mixed,
  responseAt: Number,

  status: String,
});

export default mongoose.model("JobRequest", dataSchema);
