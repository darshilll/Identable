import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import {
  createCommonPrompt,
  createCommonPrompt2,
} from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const generateCommonPrompt = async (entry) => {
  let {
    chatGPTVersion,
    promptAction,
    designation,
    keyword,
    youAre,
    userId,
    currentPageId,
    pageId,
    pointOfView,
    campaignTopic,
    carouselTopic,
    count,
  } = entry;

  if (!pageId) {
    pageId = currentPageId;
  }

  const pageData = await dbService.findOneRecord(
    "LinkedinPageModel",
    {
      _id: ObjectId(pageId),
    },
    {
      type: 1,
      designation: 1,
    }
  );

  if (!designation) {
    designation = pageData?.designation || "";
  }

  const settingData = await dbService.findOneRecord("AIAdvanceSettingModel", {
    pageId: ObjectId(pageId),
  });

  let hashtags = "";
  if (keyword) {
    hashtags = keyword.map((item) => `#${item}`).join(", ");
  }
  if (!hashtags) {
    hashtags = settingData?.keyword.map((item) => `#${item}`).join(", ");
  }

  if (!youAre) {
    youAre = settingData?.about || "";
  }

  let prompt = "";

  if (pageData?.type == "page") {
    switch (promptAction) {
      case "keyword":
        prompt = `Act as an expert analyst and generate 5 professional keywords for my LinkedIn company posts, based on the company details as [${youAre}] .
        - Do not echo my command or parameters.
        - Follow the below output pattern "[
          {
            "data": ""
          }]"`;
        break;

      case "yourself":
        prompt = `I want you to act as a "${designation}" and write a sentence about yourself.
        Limit to 50 words.
        - Do not echo my command or parameters.
        - Follow the below output pattern "[{
            "yourself": ""
          }
          ]"
        `;
        break;

      case "targetAudience":
        prompt = `Act as an expert analyst. Your task is to list the top 5 Target audiences roles considering the details, such as 
        [user synopsis]: ${youAre}
        [User Keywoards]: ${hashtags}
        - Do not echo my command or parameters.
        - Follow the below output pattern "[
               {
                  "data": "The Target audience role Here"
               }
            ]`;
        break;

      case "objective":
        prompt = `Act as an expert analyst. Your task is to list the top 5 Objectives with Point of view as [${pointOfView}] considering the details, such as 
        [user synopsis]: ${youAre}
        
        [User Keywoards]: ${hashtags}
        
        - Do not echo my command or parameters.
        - Follow the below output pattern "[
               {
                  "data": "The Objective Here"
               }
            ]`;
        break;

      case "callOfAction":
        prompt = `Act as an expert analyst. Your task is to list the top 5 Call of action considering the details, such as 
        [user synopsis]: ${youAre}
        
        [User Keywoards]: ${hashtags}
        
        - Do not echo my command or parameters.
        - Follow the below output pattern "[
               {
                  "data": "The Call of action Here"
               }
            ]`;
        break;
      case "topic":
        prompt = `Act as an expert analyst. Your task is to recommend the top 5 topics authority of [${hashtags}]: [${youAre}]. 
        - Avoid Keyword Stuffing 
        - Use Power Words 
        - Align with Search Intent 
        - Do not echo my command or parameters. 
        - Follow the below output pattern "[
               {
                  "data": "The Topic is Here"
               }
            ]`;
        break;
      case "carouselRegenereatTopic":
        prompt = `Act as an expert analyst. Topic is ${carouselTopic} and generate one topics for my LinkedIn company posts.
        - Avoid Keyword Stuffing 
        - Use Power Words 
        - Align with Search Intent 
        - Do not echo my command or parameters. 
        - Follow the below output pattern "[
               {
                  "data": "The Topic is Here"
               }
            ]`;
        break;
      case "campaignGoal":
        prompt = `Act as an expert analyst. Your task is to recommend the top 5 goal authority of [${hashtags}]: [${youAre}]. 
          - Avoid Keyword Stuffing 
          - Use Power Words 
          - Align with Search Intent 
          - Do not echo my command or parameters. 
          - Follow the below output pattern "[
                 {
                    "data": "Goal is Here"
                 }
              ]`;
        break;
      case "campaignTopic":
        prompt = `Act as an expert analyst. Your task is to recommend the top 3 topics authority of [${hashtags}]: [${youAre}]. 
        - Avoid Keyword Stuffing 
        - Use Power Words 
        - Align with Search Intent 
        - Do not echo my command or parameters. 
        - Follow the below output pattern "[
               {
                  "data": "The Topic is Here"
               }
            ]`;
        break;
      case "campaignKeyword":
        prompt = `Act as an expert analyst. Topic is ${campaignTopic} and generate 5 professional keywords for my LinkedIn company posts, based on the company details as [${youAre}] .
          - Do not echo my command or parameters.
          - Follow the below output pattern "[
            {
              "data": ""
            }]"`;
        break;
      case "oneClickSubTopic":
        prompt = `Act as an expert analyst. Your task is to create ${count} sub topics based on main topic [${campaignTopic}]. 
          - Avoid Keyword Stuffing 
          - Use Power Words 
          - Align with Search Intent 
          - Do not echo my command or parameters. 
          - Follow the below output pattern "[
                 {
                    "data": "The SubTopic is Here"
                 }
              ]`;
        break;
      default:
        break;
    }
  } else {
    switch (promptAction) {
      case "keyword":
        prompt = `I want you to act as a "${designation}" and generate 5 professional Keywords for my LinkedIn posts.
        - Do not echo my command or parameters.
        - Follow the below output pattern "[
          {
            "data": ""
          }]"`;
        break;

      case "yourself":
        prompt = `I want you to act as a "${designation}" and write a sentence about yourself.
        Limit to 50 words.
        - Do not echo my command or parameters.
        - Follow the below output pattern "[{
            "yourself": ""
          }
          ]"
        `;
        break;

      case "targetAudience":
        prompt = `Act as a social media expert. Your task is to list the top 5 Target audiences roles considering the details, such as 
        [user synopsis]: ${youAre}
        
        [User Designation]: ${designation}.
        
        [User Keywoards]: ${hashtags}
        - Do not echo my command or parameters.
        - Follow the below output pattern "[
               {
                  "data": "The Target audience role Here"
               }
            ]`;
        break;

      case "objective":
        prompt = `Act as a social media expert. Your task is to list the top 5 Objectives with Point of view as  First person singular(i, me, my, mine) considering the details, such as 
        [user synopsis]: ${youAre}
        
        [User Designation]: ${designation}.
        
        [User Keywoards]: ${hashtags}
        
        - Do not echo my command or parameters.
        - Follow the below output pattern "[
               {
                  "data": "The Objective Here"
               }
            ]`;
        break;

      case "callOfAction":
        prompt = `Act as a social media expert. Your task is to list the top 5 Call of action with Point of view as  First person singular(i, me, my, mine) considering the details, such as 
        [user synopsis]: ${youAre}
        
        [User Designation]: ${designation}.
        
        [User Keywoards]: ${hashtags}
        
        - Do not echo my command or parameters.
        - Follow the below output pattern "[
               {
                  "data": "The Call of action Here"
               }
            ]`;
        break;
      case "topic":
        let wordCount = Math.floor(Math.random() * (15 - 7 + 1)) + 7;
        prompt = `Generate 5 topics based on this [${designation}]. 
        - topic must contain ${wordCount} words.
        - Do not echo my command or parameters. 
        - Follow the below output pattern "[
               {
                  "data": "The Topic is Here"
               }
            ]`;
        break;
      case "carouselRegenereatTopic":
        prompt = `Act as a [${designation}]. Your task is to recommend 1 trending topics based on [${carouselTopic}]]. 
        - Avoid Keyword Stuffing 
        - Use Power Words 
        - Align with Search Intent 
        - Do not echo my command or parameters. 
        - Follow the below output pattern "[
               {
                  "data": "The Topic is Here"
               }
            ]`;
        break;
      case "campaignGoal":
        prompt = `Act as a [${designation}]. Your task is to recommend 5 goal based on [${hashtags}]]. 
          - Avoid Keyword Stuffing 
          - Use Power Words 
          - Align with Search Intent 
          - Do not echo my command or parameters. 
          - Follow the below output pattern "[
                 {
                    "data": "Goal is Here"
                 }
              ]`;
        break;
      case "campaignTopic":
        prompt = `Act as a [${designation}]. Your task is to recommend 3 trending topics based on [${hashtags}]]. 
          - Avoid Keyword Stuffing 
          - Use Power Words 
          - Align with Search Intent 
          - Do not echo my command or parameters. 
          - Follow the below output pattern "[
                 {
                    "data": "The Topic is Here"
                 }
              ]`;
        break;
      case "campaignKeyword":
        prompt = `I want you to act as a "${designation}". Topic is ${campaignTopic} and generate 5 professional Keywords for my LinkedIn posts.
          - Do not echo my command or parameters.
          - Follow the below output pattern "[
            {
              "data": ""
            }]"`;
        break;
      case "oneClickSubTopic":
        prompt = `Act as a [${designation}]. Your task is to generate ${count} sub topics based on [${campaignTopic}]]. 
          - Avoid Keyword Stuffing 
          - Use Power Words 
          - Align with Search Intent 
          - Do not echo my command or parameters. 
          - Follow the below output pattern "[
                 {
                    "data": "The SubTopic is Here"
                 }
              ]`;
        break;
      default:
        break;
    }
  }

  if (promptAction == "topic") {
    const result = await createCommonPrompt2({
      prompt: prompt,
      chatGPTVersion: chatGPTVersion,
    });

    return result;
  } else {
    const result = await createCommonPrompt({
      prompt: prompt,
      chatGPTVersion: chatGPTVersion,
    });

    return result;
  }
};
