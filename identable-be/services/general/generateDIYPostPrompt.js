import dbService from "../../utilities/dbService";
import { generatePostPrompt } from "../openai/generatePostPrompt";
import { generatePostTopicPrompt } from "../openai/generatePostTopicPrompt";
import { generateGiphy } from "../../utilities/generateGiphy";
import { generatePexelImage } from "../../utilities/generatePexelImage";

export const generateDIYPostPrompt = async (entry) => {
  let {
    body: { postContent },
    user: { _id, chatGPTVersion, currentPageId },
  } = entry;

  const settingData = await dbService.findOneRecord("AIAdvanceSettingModel", {
    pageId: currentPageId,
  });

  if (!settingData) {
    throw new Error("AI Settings not found");
  }

  const pageData = await dbService.findOneRecord("LinkedinPageModel", {
    _id: currentPageId,
  });

  const postTopic = await generatePostTopicPrompt({
    settingData,
    pageData,
    customTopic: postContent,
  });

  const result = await generatePostPrompt({
    settingData,
    pageData,
    customTopic: postTopic,
  });

  if (!result) {
    throw new Error("Something went wrong. Please try again.");
  }

  const postData = await dbService.findAllRecords(
    "PostModel",
    {
      pageId: currentPageId,
    },
    {
      postMedia: 1,
    }
  );

  let postMediaArray = postData?.map((obj) => obj?.postMedia);

  let usedImageArray = [];
  if (postMediaArray?.length > 0) {
    usedImageArray = [...usedImageArray, ...postMediaArray];
  }

  let keywordArray = settingData?.keyword || [];
  keywordArray.push(postTopic?.substring(0, 20));
  let searchText = getRandomSearchText(keywordArray);

  // Generate Giphy Image
  let giphyImageUrl = "";

  let giphyImageArray = await generateGiphy({
    searchText: searchText,
  });

  if (giphyImageArray?.length > 0) {
    giphyImageUrl = giphyImageArray[0];

    let filterArray = giphyImageArray?.filter(
      (val) => !usedImageArray.includes(val)
    );

    if (filterArray?.length > 0) {
      giphyImageUrl = filterArray[0];
    }

    giphyImageUrl = extractImageURL(giphyImageUrl);
    usedImageArray.push(giphyImageUrl);
  }

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

  const randomSelect = Math.random() < 0.5 ? "image" : "giphy";

  return {
    topic: "",
    post: result,
    keyword: "",
    pexelImageUrl: pexelImageUrl,
    giphyImageUrl: giphyImageUrl,
    randomSelect: randomSelect,
  };
};

function getRandomSearchText(arr) {
  if (arr.length === 0) {
    return "";
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
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
