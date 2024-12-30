import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  connectionId: { type: String },
  createdAt: Number,
});

userSchema.index({
  userId: 1,
});

userSchema.index({
  connectionId: 1,
});

export default mongoose.model("Connection", userSchema);
