import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getCarousel = async (entry) => {
  let {
    body: {},
    user: { _id, chatGPTVersion },
  } = entry;

  let carouselData = await dbService.findAllRecords(
    "CarouselModel",
    {
      isDeleted: false,
    },
    {
      carouselSetting: 1,
    }
  );

  let newCarouselArray = [];
  for (let i = 0; i < carouselData?.length; i++) {
    let element = carouselData[i];

    let newCarouselData = {
      ...element?.carouselSetting,
      templateId: element?._id,
    };
    newCarouselArray.push(newCarouselData);
  }

  return newCarouselArray;
};
