import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  total: { type: Number },
  description: { type: String },
  stripeSessionId: { type: String },
  stripeCustomerId: { type: String },
  stripeTransactionId: { type: String },
  stripeSubscriptionId: { type: String },
  stripePaymentStatus: { type: String },
  stripePaymentIntentId: { type: String },

  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
  deletedAt: Number,
});

export default mongoose.model("Payment", dataSchema);
