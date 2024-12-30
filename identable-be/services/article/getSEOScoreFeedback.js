import dbService from "../../utilities/dbService";
import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";
import { seoContentOptimization } from "../../utilities/seo/seoContentOptimization";

const ObjectId = require("mongodb").ObjectID;

export const getSEOScoreFeedback = async (entry) => {
  let {
    body: { content, topic, headline, keywords },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.ARTICLE_SEO_SCORE,
  });

  let result = await seoContentOptimization({
    title: topic,
    metaDescription: headline,
    bodyContent: content,
    keywords: keywords,
  });
  if (!result) {
    throw new Error("Failed to get SEO Score. Please try again.");
  }

  if (result?.status != "ok") {
    let errorMessage = result["error message"] | "Something went wrong.";
    throw new Error(errorMessage);
  }

  const dataDic = result?.data;
  let feedbackArray = [];

  let seoScore = 0;
  if (dataDic?.Overview) {
    seoScore = dataDic?.Overview["Overall SEO score"];
  }

  let array = [
    {
      tag: "Title tag",
      title: "Page Title Score",
    },
    {
      tag: "Meta description",
      title: "Meta Description Score",
    },
    {
      tag: "Page headings",
      title: "Page Headings Score",
    },
    {
      tag: "Content length",
      title: "Content Length Score",
    },
    {
      tag: "On page links",
      title: "On Page Links Score",
    },
    {
      tag: "Image analysis",
      title: "Image Analysis Score",
    },
    {
      tag: "Keyword usage",
      title: "Keyword Usage Score",
    },
  ];

  for (let i = 0; i < array.length; i++) {
    const element = array[i];

    if (dataDic[element?.tag]) {
      let feedback = getFeedbackDetails(element?.tag, dataDic);

      let obj = {
        tag: element?.title,
        feedback: feedback?.feedbackTexts,
        score: feedback?.score,
      };
      feedbackArray.push(obj);
    }
  }

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.ARTICLE_SEO_SCORE,
  });

  return {
    seoScore: seoScore,
    feedbackArray: feedbackArray,
  };
};

function getFeedbackDetails(tag, dataDic) {
  let feedback = dataDic[tag]["Feedback details"];
  let feedbackTexts = [];
  if (feedback) {
    feedbackTexts = Object.values(feedback).map((item) => item.text);
  }
  let score = dataDic[tag]["SEO Score"];

  return { feedbackTexts, score };
}
