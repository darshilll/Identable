import dbService from "../../utilities/dbService";
import { SUBSCRIPTION_STATUS } from "../../utilities/constants";
import { createCommonPrompt } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const generateOutlineSubTopic = async (entry) => {
  let {
    body: { goal, topic, keywords, headline, outlineTopic },
    user: { _id, chatGPTVersion },
  } = entry;

  let prompt = `Act as an SEO expert and generate 3 comprehensive article h3 based on the information provided below.
  Headline: ${headline},
  Topic: ${topic},
  Keywords: ${keywords},
  Goal: ${goal}
  H2: ${outlineTopic}

  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
   {
    "Data": [
      {
        "h3": "h3 Here"
      }
    ]
  }
  `;

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
