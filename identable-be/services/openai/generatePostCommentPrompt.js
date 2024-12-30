import { createNewsSummary } from "../../utilities/openAi";

export const generatePostCommentPrompt = async (entry) => {
  let { chatGPTVersion, postContent, name, primarySubTitle } =
    entry;

  let prompt = `Act as an expert copywriter with background [${primarySubTitle}]. Now, your task is to generate 150 characters best appreciative Linkedin comment on the given content [${postContent}] for [${name}].
    - Do not add HTML tags in comment.
    - Do not echo my command or parameters.`;

  const result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
