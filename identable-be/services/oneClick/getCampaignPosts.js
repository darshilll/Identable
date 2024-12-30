import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getCampaignPosts = async (entry) => {
  let {
    body: { campaignId },
    user: { _id, userTimezone, currentPageId },
  } = entry;

  let aggregate = [
    {
      $match: {
        userId: _id,
        oneClickId: ObjectId(campaignId),
      },
    },
    {
      $project: {
        scheduleDateTime: 1,
        postBody: 1,
        timeSlot: 1,
        timePeriod: 1,
        postMedia: 1,
        postMediaType: 1,
        generatedType: 1,
        articleHeadline: 1,
        articleTitle: 1,
        status: 1,
        _id: 1,
        isBoosting: 1,
        carouselTemplate: 1,
        documentDescription: 1,
      },
    },
  ];

  let data = await dbService.aggregateData("PostModel", aggregate);
  if (!data) {
    data = [];
  }

  return data;
};
