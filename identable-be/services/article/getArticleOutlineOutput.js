import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const getArticleOutlineOutput = async (entry) => {
  let {
    body: { goal, topic, keywords, headline },
    user: { _id, chatGPTVersion },
  } = entry;

  let prompt = `Act as an SEO expert and generate 3 comprehensive article outlines based on the information provided below.
  Headline: ${headline},
  Topic: ${topic},
  Keywords: ${keywords},
  Goal: ${goal}

  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
  {
    "Data": [
      {
        "HeadingData": [
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
        ]
      },
      {
        "HeadingData": [
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
        ]
      },
      {
        "HeadingData": [
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
          {
            "H2": "H2 here",
            "H3": [
              "h3 here mutiple"
            ],
          },
        ]
      }
    ],
  }
  `;

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
