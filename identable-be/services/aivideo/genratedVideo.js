import { genrateVideoRequest } from "../../utilities/aivideoRequest";
import dbService from "../../utilities/dbService";
let request = require("request");

import { checkCredit } from "../creditUsage/checkCredit";
import { updateCreditUsage } from "../creditUsage/updateCreditUsage";
import { CREDIT_TYPE } from "../../utilities/constants";

export const genratedVideo = async (entry) => {
  let {
    body: { url, idea, color, collection, ratio, length, voice },
    user: { _id, currentPageId },
  } = entry;

  let topic = idea;
  await checkCredit({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.AI_VIDEO,
  });

  let response = await genrateVideoRequest({
    url,
    topic,
    color,
    collection,
    ratio,
    length,
    voice,
  });

  if (!response?.status) {
    throw new Error(response?.message);
  }

  if (url && !topic) {
    topic = url;
  }

  var insertObj = {
    topic: topic,
    videoColor: color,
    videoCollection: collection,
    ratio,
    length,
    voice,
    userId: _id,
    pageId: currentPageId,
    videoId: response?.data?.video_id,
    renderId: response.data?.render_id,
    createdAt: Date.now(),
    status: "processing",
  };

  await dbService.createOneRecord("AIVideoModel", insertObj);

  // ================ Update Credit ================

  await updateCreditUsage({
    userId: _id,
    pageId: currentPageId,
    creditType: CREDIT_TYPE.AI_VIDEO,
  });

  return "Video generated successfully";
};
