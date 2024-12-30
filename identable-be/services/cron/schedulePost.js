import dbService from "../../utilities/dbService";
import {
  SUBSCRIPTION_STATUS,
  POST_STATUS,
  POST_GENERATE_TYPE,
} from "../../utilities/constants";
import {
  schedulePostData,
  scheduleArticleData,
} from "../../utilities/automationRequest";
const ObjectId = require("mongodb").ObjectID;
const cheerio = require("cheerio");

export const schedulePost = async () => {
  await updatePostingStatus();
  let currentStart = new Date();
  currentStart.setSeconds(0, 0);

  // Add 29 minutes to the current date
  let currentEnd = new Date(currentStart.getTime() + 29 * 60000); // 1 minute = 60000 milliseconds
  currentEnd.setSeconds(0, 0);

  let aggregateQuery = [
    {
      $match: {
        isDeleted: false,
        status: "scheduled",
        scheduleDateTime: {
          $gte: currentStart.getTime(),
          $lte: currentEnd.getTime(),
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "userId",
        foreignField: "userId",
        as: "subscriptionData",
      },
    },
    {
      $unwind: { path: "$subscriptionData", preserveNullAndEmptyArrays: true },
    },
    {
      $match: {
        "subscriptionData.subscriptionStatus": {
          $in: [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIAL],
        },
      },
    },
    {
      $lookup: {
        from: "linkedinpages",
        localField: "pageId",
        foreignField: "_id",
        as: "pageData",
      },
    },
    {
      $unwind: { path: "$pageData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "articles",
        localField: "articleId",
        foreignField: "_id",
        as: "articleData",
      },
    },
    {
      $unwind: { path: "$articleData", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        _id: 1,
        postBody: 1,
        postMedia: 1,
        generatedType: 1,
        cookies: "$userData.cookies",
        userAgent: "$userData.userAgent",
        cookiesExpiry: "$userData.cookiesExpiry",
        proxy: "$userData.proxy",
        pageId: 1,
        userId: 1,
        articleHeadline: 1,
        articleTitle: 1,
        documentDescription: 1,
        pageId: "$pageData._id",
        pageType: "$pageData.type",
        pageUrl: "$pageData.url",
        articleData: 1,
      },
    },
  ];
  const data = await dbService.aggregateData("PostModel", aggregateQuery);

  let bulkDataArray = [];

  for (let i = 0; i < data?.length; i++) {
    const dataDic = data[i];
    if (
      dataDic?.cookies &&
      dataDic?.userAgent &&
      dataDic?.cookiesExpiry &&
      dataDic?.userId
    ) {
      let postBody = dataDic?.postBody;

      let postStatus = POST_STATUS.POSTING;

      if (dataDic?.generatedType == POST_GENERATE_TYPE.ARTICLE) {
        let articleContentArray = await getArticlePostContent(
          dataDic?.articleData?.contentArray
        );

        if (articleContentArray?.length > 0) {
          let jobObj = {
            userId: dataDic?.userId,
            cookies: dataDic?.cookies,
            cookiesExpiry: dataDic?.cookiesExpiry,
            userAgent: dataDic?.userAgent,
            postMedia: dataDic?.articleData?.bannerImage,
            postId: dataDic?._id,
            generatedType: dataDic?.generatedType,
            articleHeadline: dataDic?.articleData?.headline,
            articleTitle: dataDic?.articleData?.topic,
            pageId: dataDic?.pageId,
            proxy: dataDic?.proxy,
            articleContentArray: articleContentArray,
          };

          if (dataDic?.pageType == "page") {
            jobObj = {
              ...jobObj,
              companyUrl: dataDic?.pageUrl,
            };
          }

          let responseStatus = await scheduleArticleData(jobObj);
          if (!responseStatus) {
            postStatus = POST_STATUS.ERROR;
          }
        } else {
          postStatus = POST_STATUS.ERROR;
        }
      } else {
        postBody = removeHtmlTagsAndFormat(postBody);
        try {
          postBody = JSON.stringify(postBody)?.slice(1, -1);
        } catch (error) {
          console.error("stringify error = ", error);
        }
        let jobObj = {
          userId: dataDic?.userId,
          cookies: dataDic?.cookies,
          cookiesExpiry: dataDic?.cookiesExpiry,
          userAgent: dataDic?.userAgent,
          postBody: postBody,
          postMedia: dataDic?.postMedia,
          postId: dataDic?._id,
          generatedType: dataDic?.generatedType,
          pageId: dataDic?.pageId,
          documentDescription: dataDic?.documentDescription,
          proxy: dataDic?.proxy,
        };
        if (dataDic?.pageType == "page") {
          jobObj = {
            ...jobObj,
            companyUrl: dataDic?.pageUrl,
          };
        }

        let responseStatus = await schedulePostData(jobObj);

        if (!responseStatus) {
          postStatus = POST_STATUS.ERROR;
        }
      }

      bulkDataArray.push({
        updateOne: {
          filter: { _id: dataDic?._id },
          update: {
            $set: { status: postStatus },
          },
        },
      });
    }
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("PostModel", bulkDataArray);
  }
};

function removeHtmlTags(str) {
  if (str) {
    str = str?.replace(/<br>/g, "\n");
    str = str?.replace(/<br\/>/g, "\n");
    str = str?.replace(/<br \/>/g, "\n");
    return str?.replace(/<[^>]*>/g, "");
  }
  return "";
}

function removeHtmlTagsAndFormat(input) {
  if (input) {
    // Replace specific tags with newlines for better formatting
    try {
      const tagReplacements = {
        "<h1>": "\n",
        "</h1>": "\n",
        "<h2>": "\n",
        "</h2>": "\n",
        "<h3>": "\n",
        "</h3>": "\n",
        "<h4>": "\n",
        "</h4>": "\n",
        "<h5>": "\n",
        "</h5>": "\n",
        "<h6>": "\n",
        "</h6>": "\n",
        "<p>": "\n",
        "</p>": "\n",
        "<br>": "\n",
        "<br/>": "\n",
        "<br />": "\n",
        "<li>": "\n- ",
        "</li>": "",
        "<ul>": "\n",
        "</ul>": "\n",
        "<ol>": "\n",
        "</ol>": "\n",
      };

      // Replace tags with appropriate formatting
      for (const [tag, replacement] of Object.entries(tagReplacements)) {
        input = input.split(tag).join(replacement);
      }

      // Remove all other HTML tags
      let formattedString = input.replace(/<[^>]*>/g, "");

      // Trim extra white spaces and normalize line breaks
      // formattedString = formattedString.replace(/\n\s*/g, "\n").trim();

      return formattedString;
    } catch (error) {
      console.error("error = ", error);
      return "";
    }
  }

  return "";
}

function htmlToPlainText(htmlString) {
  // Remove HTML tags using a regular expression
  const plainText = htmlString.replace(/<[^>]*>/g, "");

  // Decode HTML entities (e.g., &lt; to <, &gt; to >)
  const decodedText = decodeEntities(plainText);

  return decodedText;
}

function decodeEntities(encodedString) {
  const entities = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#039;": "'",
  };

  return encodedString.replace(
    /&[a-zA-Z]+;|&#\d+;/g,
    (match) => entities[match] || match
  );
}
export const updatePostingStatus = async () => {
  await dbService.updateManyRecords(
    "PostModel",
    {
      status: POST_STATUS.POSTING,
    },
    {
      status: POST_STATUS.ERROR,
    }
  );
};

export const getArticlePostContent = async (contentArray) => {
  let newArray = [];

  for (let i = 0; i < contentArray?.length; i++) {
    const item = contentArray[i];

    if (item?.type == "h1" || item?.type == "h2" || item?.type == "h3") {
      if (item?.title) {
        let array = await scrapeHTML({ htmlString: item?.title });

        for (let j = 0; j < array?.length; j++) {
          const element = array[j];
          if (element?.type == "text") {
            let content = "";
            if (item?.type == "h1") {
              content = `<h1>${element?.content}</h1>`;
            } else if (item?.type == "h2") {
              content = `<h2>${element?.content}</h2>`;
            } else if (item?.type == "h3") {
              content = `<h3>${element?.content}</h3>`;
            }

            let obj = {
              type: "text",
              content: content,
            };
            newArray.push(obj);
          } else {
            newArray.push(element);
          }
        }
      }
      if (item?.content) {
        let array = await scrapeHTML({ htmlString: item?.content });
        if (array?.length > 0) {
          newArray = [...newArray, ...array];
        }
      }
    } else if (item?.type == "embedded" && item?.link) {
      let obj = {
        type: "embed",
        content: item?.link,
      };
      newArray.push(obj);
    } else if (item?.type == "cta" && item?.ctaImageUrl) {
      let obj = {
        type: "img",
        content: item?.ctaImageUrl,
      };
      newArray.push(obj);
    } else if (item?.type == "description") {
      if (item?.title) {
        let array = await scrapeHTML({ htmlString: item?.title });
        if (array?.length > 0) {
          newArray = [...newArray, ...array];
        }
      }
      if (item?.content) {
        let array = await scrapeHTML({ htmlString: item?.content });
        if (array?.length > 0) {
          newArray = [...newArray, ...array];
        }
      }
    }
  }

  return newArray;
};

export const scrapeHTML = async (entry) => {
  let { htmlString } = entry;
  const str = htmlString;
  const output = [];

  if (!htmlString) {
    return output;
  }
  const $ = cheerio.load(str);

  // Helper function to add text or embed type
  function addContent(type, content) {
    if (type == "divide") {
      output.push({ type, content: "" });
    } else if (type == "link") {
      output.push({ type, content: content });
    } else if (content && content.trim()) {
      output.push({ type, content: content.trim() });
    }
  }

  // Extract and process the content
  $("body")
    .contents()
    .each((index, element) => {

      if (element.type === "text") {
        // Add text content
        addContent("text", $(element).text());
      } else if ($(element).hasClass("embed-details-div")) {
        // Extract image from embed div
        const imageUrl = $(element).find("div.embed-images img").attr("src");
        if (imageUrl) {
          addContent("embed", imageUrl);
        }
      } else if (element.tagName === "u") {
        // Add underlined text
        addContent("text", $.html(element));
      } else if (element.tagName === "hr") {
        // Divider
        addContent("divide", null);
      } else if ($(element).find("pre").length) {
        // Code block
        const codeContent = $(element).find("pre").text();
        addContent("code", codeContent);
      } else if (element.tagName === "img") {
        // Add standalone img tag
        const imgUrl = $(element).attr("src");
        addContent("img", imgUrl);
      } else if (element.tagName === "a") {
        const linkUrl = $(element).attr("href");
        const linkText = $(element).text();
        addContent("link", { url: linkUrl, text: linkText });
      } else {
        addContent("text", $.html(element));
      }
    });

  return output;
};
