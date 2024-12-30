import { createPostTopicSummary } from "../../utilities/openAi";

const ObjectId = require("mongodb").ObjectID;

export const regenerateArticleHeadline = async (entry) => {
  let {
    body: { goal, topic, keywords },
    user: { _id, chatGPTVersion },
  } = entry;

  let prompt = `Act as an SEO expert. Generate one article headline using thease article goal: ${goal}, article topic: ${topic}, and article keywords: ${keywords}. Your response should not repeat or restate the original prompt or its parameters.

  - Do not repeat headline
  - Do not echo my command or parameters.`;

  const result = await createPostTopicSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result?.replace(/\"/g, "");
};
