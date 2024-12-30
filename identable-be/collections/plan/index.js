import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  planName: { type: String },
  orderNo: { type: Number },
  planDescription: { type: String },
  isPopular: {
    type: Boolean,
    default: false,
  },

  monthlyPriceUSD: { type: Number },
  yearlyPriceUSD: { type: Number },

  monthlyPriceId: { type: String },
  yearlyPriceId: { type: String },

  monthlyPriceINR: { type: Number },
  yearlyPriceINR: { type: Number },

  linkedInIntegration: { type: Boolean },
  linkedInPageIntegration: { type: Boolean }, //0 only profile, 1 profile with compnay page

  credit: { type: Number },

  carouselCredit: { type: Number },
  aIVideoCredit: { type: Number },
  boostingCredit: { type: Number },
  advancedScheduleCredit: { type: Number },
  aiImageCredit: { type: Number },
  discoverEmailCredit: { type: Number },
  searchNewsCredit: { type: Number },
  articleCredit: { type: Number },
  contentAnalyzeCredit: { type: Number },
  contentHumanizeCredit: { type: Number },

  crmCampaignLimit: { type: Number },
  companyProfileLimit: { type: Number },

  isCRMCompanySearchAllow: { type: Boolean, default: false },

  isAIVideo: { type: Boolean, default: false },

  isDeleted: { type: Boolean, default: false },
});

export default mongoose.model("Plan", dataSchema);
