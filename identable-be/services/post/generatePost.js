import dbService from "../../utilities/dbService";
import { generateInspireMePostPrompt } from "../inspireMe/generateInspireMePostPrompt";
import { generateGiphy } from "../../utilities/generateGiphy";
import { generatePexelImage } from "../../utilities/generatePexelImage";
import { generateInspireMePostTopicPrompt } from "../inspireMe/generateInspireMePostTopicPrompt";
import { generateAIImageAction } from "../aiimage/generateAIImageAction";
import { INSPIREME_TYPE } from "../../utilities/constants";

const ObjectId = require("mongodb").ObjectID;
const POST_COUNT = 20;

export const generatePost = async (entry) => {
  try {
    let { userId, isCron, isFromList } = entry;

    const settingArray = await dbService.findAllRecords(
      "AIAdvanceSettingModel",
      {
        userId: userId,
        isCurrentPage: true,
      }
    );

    if (!settingArray) {
      return;
    }

    for (let index = 0; index < settingArray?.length; index++) {
      const settingData = settingArray[index];

      if (settingData?.isPostProcessing) {
        continue;
      }

      const inspiremeData = await dbService.findAllRecords(
        "InspireMeModel",
        {
          userId: userId,
          pageId: settingData?.pageId,
        },
        {
          isScheduled: 1,
          image: 1,
          giphy: 1,
          inspireMeType: 1,
          createdAt: 1,
          wordRange: 1,
        }
      );

      if (isFromList && inspiremeData?.length >= POST_COUNT) {
        continue;
      }

      if (isCron) {
        await dbService.updateManyRecords(
          "InspireMeModel",
          { _id: settingData?._id },
          {
            isLatest: false,
          }
        );
      }

      let notScheduleArray = inspiremeData?.filter((x) => !x?.isScheduled);

      if (inspiremeData?.length == 0 || notScheduleArray?.length < POST_COUNT) {
        await dbService.updateOneRecords(
          "AIAdvanceSettingModel",
          { _id: settingData?._id },
          {
            isPostProcessing: true,
          }
        );

        let postCount = POST_COUNT;
        if (inspiremeData?.length > 0) {
          let count = POST_COUNT - notScheduleArray?.length;
          if (count < postCount) {
            postCount = count;
          }
        }

        let usedImageArray = [];

        const pageData = await dbService.findOneRecord("LinkedinPageModel", {
          _id: settingData?.pageId,
        });

        let inspiremeTypeArray = notScheduleArray?.map(
          (obj) => obj?.inspireMeType
        );
        if (notScheduleArray?.length == 0) {
          inspiremeTypeArray = [];
        }

        // ============ Manage Word Range Content Type Wise ==============
        let wordRangeArray = [
          "50 to 100",
          "100 to 200",
          "200 to 300",
          "300 to 400",
        ];
        let industryTrendCounter = 0;
        let thoughtLeadershipCounter = 0;
        let productivityHacksCounter = 0;
        let professionalTipsCounter = 0;
        let industryPredictionCounter = 0;

        let industryTrendArray = inspiremeData?.filter(
          (x) => x?.inspireMeType == INSPIREME_TYPE.Industry_Trend
        );
        if (industryTrendArray?.length > 0) {
          industryTrendArray?.sort((a, b) => b?.createdAt - a?.createdAt);
          let index = wordRangeArray?.indexOf(industryTrendArray[0]?.wordRange);
          if (index >= 0 && index <= wordRangeArray?.length - 2) {
            industryTrendCounter = index + 1;
          }
        }

        let thoughtLeadershipArray = inspiremeData?.filter(
          (x) => x?.inspireMeType == INSPIREME_TYPE.ThoughtLeadership
        );
        if (thoughtLeadershipArray?.length > 0) {
          thoughtLeadershipArray?.sort((a, b) => b?.createdAt - a?.createdAt);

          let index = wordRangeArray?.indexOf(
            thoughtLeadershipArray[0]?.wordRange
          );
          if (index >= 0 && index <= wordRangeArray?.length - 2) {
            thoughtLeadershipCounter = index + 1;
          }
        }

        let productivityHacksArray = inspiremeData?.filter(
          (x) => x?.inspireMeType == INSPIREME_TYPE.ProductivityHacks
        );
        if (productivityHacksArray?.length > 0) {
          productivityHacksArray?.sort((a, b) => b?.createdAt - a?.createdAt);

          let index = wordRangeArray?.indexOf(
            productivityHacksArray[0]?.wordRange
          );
          if (index >= 0 && index <= wordRangeArray?.length - 2) {
            productivityHacksCounter = index + 1;
          }
        }

        let professionalTipsArray = inspiremeData?.filter(
          (x) => x?.inspireMeType == INSPIREME_TYPE.ProfessionalTips
        );
        if (professionalTipsArray?.length > 0) {
          professionalTipsArray?.sort((a, b) => b?.createdAt - a?.createdAt);

          let index = wordRangeArray?.indexOf(
            professionalTipsArray[0]?.wordRange
          );
          if (index >= 0 && index <= wordRangeArray?.length - 2) {
            professionalTipsCounter = index + 1;
          }
        }

        let industryPredictionArray = inspiremeData?.filter(
          (x) => x?.inspireMeType == INSPIREME_TYPE.IndustryPrediction
        );
        if (industryPredictionArray?.length > 0) {
          industryPredictionArray?.sort((a, b) => b?.createdAt - a?.createdAt);

          let index = wordRangeArray?.indexOf(
            industryPredictionArray[0]?.wordRange
          );
          if (index >= 0 && index <= wordRangeArray?.length - 2) {
            industryPredictionCounter = index + 1;
          }
        }

        // ============ End Manage Word Range Content Type Wise ==============

        for (let i = 0; i < postCount; i++) {
          let inspireMeType = "";

          let industryTrendArray = inspiremeTypeArray?.filter(
            (x) => x == INSPIREME_TYPE.Industry_Trend
          );
          let thoughtLeadershipArray = inspiremeTypeArray?.filter(
            (x) => x == INSPIREME_TYPE.ThoughtLeadership
          );
          let productivityHacksArray = inspiremeTypeArray?.filter(
            (x) => x == INSPIREME_TYPE.ProductivityHacks
          );
          let professionalTipsArray = inspiremeTypeArray?.filter(
            (x) => x == INSPIREME_TYPE.ProfessionalTips
          );
          let industryPredictionArray = inspiremeTypeArray?.filter(
            (x) => x == INSPIREME_TYPE.IndustryPrediction
          );

          for (let j = 1; j <= 4; j++) {
            if (industryTrendArray?.length < j) {
              inspireMeType = INSPIREME_TYPE.Industry_Trend;
            } else if (thoughtLeadershipArray?.length < j) {
              inspireMeType = INSPIREME_TYPE.ThoughtLeadership;
            } else if (productivityHacksArray?.length < j) {
              inspireMeType = INSPIREME_TYPE.ProductivityHacks;
            } else if (professionalTipsArray?.length < j) {
              inspireMeType = INSPIREME_TYPE.ProfessionalTips;
            } else if (industryPredictionArray?.length < j) {
              inspireMeType = INSPIREME_TYPE.IndustryPrediction;
            }
            if (inspireMeType != "") {
              break;
            }
          }

          if (inspireMeType == "") {
            continue;
          }

          inspiremeTypeArray.push(inspireMeType);

          let wordRange = wordRangeArray[0];

          if (inspireMeType == INSPIREME_TYPE.Industry_Trend) {
            wordRange = wordRangeArray[industryTrendCounter];
            industryTrendCounter += 1;
            if (industryTrendCounter >= wordRangeArray?.length) {
              industryTrendCounter = 0;
            }
          } else if (inspireMeType == INSPIREME_TYPE.ThoughtLeadership) {
            wordRange = wordRangeArray[thoughtLeadershipCounter];
            thoughtLeadershipCounter += 1;
            if (thoughtLeadershipCounter >= wordRangeArray?.length) {
              thoughtLeadershipCounter = 0;
            }
          } else if (inspireMeType == INSPIREME_TYPE.ProductivityHacks) {
            wordRange = wordRangeArray[productivityHacksCounter];
            productivityHacksCounter += 1;
            if (productivityHacksCounter >= wordRangeArray?.length) {
              productivityHacksCounter = 0;
            }
          } else if (inspireMeType == INSPIREME_TYPE.ProfessionalTips) {
            wordRange = wordRangeArray[professionalTipsCounter];
            professionalTipsCounter += 1;
            if (professionalTipsCounter >= wordRangeArray?.length) {
              professionalTipsCounter = 0;
            }
          } else if (inspireMeType == INSPIREME_TYPE.IndustryPrediction) {
            wordRange = wordRangeArray[industryPredictionCounter];
            industryPredictionCounter += 1;
            if (industryPredictionCounter >= wordRangeArray?.length) {
              industryPredictionCounter = 0;
            }
          }

          const postTopic = await generateInspireMePostTopicPrompt({
            settingData,
            pageData,
            inspireMeType: inspireMeType,
          });

          const postContent = await generateInspireMePostPrompt({
            settingData,
            pageData,
            postNumber: 1,
            customTopic: postTopic,
            inspireMeType: inspireMeType,
            wordRange: wordRange,
          });

          if (!postContent) {
            continue;
          }

          let isLatest = false;
          if (isCron) {
            isLatest = true;
          } else if (isFromList) {
            if (inspiremeData?.length >= POST_COUNT) {
              isLatest = true;
            }
          }

          let keywords = settingData?.keyword
            ?.map((item) => `${item}`)
            .join(", ");

          let aiImage = await generateAIImageAction({
            topic: postTopic,
            keywords: keywords,
            userId: userId,
            pageId: settingData?.pageId,
          });

          if (!aiImage) {
            let inspiremeImage = inspiremeData?.map((obj) => obj?.image);
            if (inspiremeImage?.length > 0) {
              usedImageArray = [...inspiremeImage, ...usedImageArray];
            }

            let keywordArray = settingData?.keyword || [];
            keywordArray.push(postTopic?.substring(0, 20));
            let searchText = getRandomSearchText(keywordArray);

            // Generate Pexel Image
            let pexelImageUrl = "";
            let pexelImageArray = await generatePexelImage({
              searchText: searchText,
            });

            if (pexelImageArray?.length > 0) {
              pexelImageUrl = pexelImageArray[0];

              let filterArray = pexelImageArray?.filter(
                (val) => !usedImageArray.includes(val)
              );

              if (filterArray?.length > 0) {
                pexelImageUrl = filterArray[0];
              }
              usedImageArray.push(pexelImageUrl);
            }

            aiImage = pexelImageUrl;
          }
          await dbService.createOneRecord("InspireMeModel", {
            userId: ObjectId(userId),
            pageId: settingData?.pageId,
            type: settingData?.type,
            post: postContent,
            createdAt: Date.now(),
            isLatest: isLatest,
            image: aiImage,
            defultMedia: "image",
            postTopic: postTopic,
            inspireMeType: inspireMeType,
            wordRange: wordRange,
          });
        }
        await dbService.updateOneRecords(
          "AIAdvanceSettingModel",
          { _id: settingData?._id },
          {
            isPostProcessing: false,
          }
        );
      }
    }
  } catch (error) {
    console.error("generatePost error = ", error);
  }
  return "Post Generated";
};
function extractImageURL(url) {
  // Split the URL by '?' to remove any query parameters
  const parts = url.split("?");
  // Get the first part (the URL without query parameters)
  const imageURL = parts[0];
  // Check if the URL ends with a valid image extension
  if (imageURL.match(/\.(jpeg|jpg|gif|png|bmp|svg)$/)) {
    return imageURL;
  } else {
    return null; // Not a valid image URL
  }
}

function getRandomSearchText(arr) {
  if (arr.length === 0) {
    return "";
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
