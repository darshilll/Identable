import { createNewsSummary } from "../../utilities/openAi";
const ObjectId = require("mongodb").ObjectID;

export const generateTopic = async (entry) => {
  let {
    body: { goal, topic, keywords, headline, h2 },
    user: { _id, chatGPTVersion },
  } = entry;

  let prompt = `Using html formatting, bolded words, lists and tables where possible generate one h2 topic and mutiple h3 sub topic based on these outline h2: ${h2}, article topic: ${topic} article keywords: ${keywords}, article headline: ${headline}`;

  prompt += ` 
  - content must fullfill this article criteria: ${goal}.
  - Generate one h2 and three h3 and add content in h3.
  - Do not echo my command or parameters.
  `;

  let result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  if (!result) {
    throw new Error("Failed to generate article sub topic. Please try again.");
  }

  return result;
};
