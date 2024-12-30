import { createCommonPrompt } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const getArticleHeadline = async (entry) => {
  let {
    body: { goal, topic, keywords },
    user: { _id, chatGPTVersion },
  } = entry;

  let prompt = `Act as an SEO expert. Generate five article headline using these article goal: ${goal}, article topic: ${topic}, and article keywords: ${keywords}. Your response should not repeat or restate the original prompt or its parameters.

  - Do not repeat headline
  - Do not echo my command or parameters.
  - Follow the below output pattern in the json format
  {
    "Data": [
      {
        "headline": "headline Here"
      }
    ]
  }`;

  const result = await createCommonPrompt({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });


  return result;
};
