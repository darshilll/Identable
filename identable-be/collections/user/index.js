import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },

  isSocial: { type: Boolean, default: false },

  socialId: { type: String },
  socialType: { type: String },
  socialToken: { type: String },

  accessToken: { type: String },
  cookies: { type: String },
  userAgent: { type: String },
  cookiesExpiry: { type: String },

  userAgent: { type: String },
  cookiesExpiry: { type: String },

  proxy: { type: String },

  isIntegrationProcess: { type: Boolean, default: false },

  isDsahboardLoaded: { type: Boolean, default: false },

  timezone: { type: String },
  countryCode: { type: String },
  phoneNumber: { type: Number},

  isBilling: { type: Boolean, default: false },
  isGeneral: { type: Boolean, default: false },
  isIntegration: { type: Boolean, default: false },
  isAISetting: { type: Boolean, default: false },

  chatGPTVersion: { type: String },

  loginToken: { type: String },

  currentPageId: { type: mongoose.Schema.Types.ObjectId, ref: "LinkedinPage" },

  lastActiveDate: { type: Number },

  isCookieValid: { type: Boolean, default: true },

  isAllowCRM: { type: Boolean, default: false },
  isCompanyPageVisited: { type: Boolean, default: false },

  userRole: { type: String },
  resetPasswordToken: { type: String },

  isBrandInfo: { type: Boolean, default: false },
  isAutoAiSetting: {type: Boolean, default: false},
  
  createdAt: Number,
  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Number,
  isUpdated: Boolean,
  updatedAt: Number,
});

export default mongoose.model("User", userSchema);
