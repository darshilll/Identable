import { createNewsSummary } from "../../utilities/openAi";

export const generateRewritePostPrompt = async (entry) => {
  let { chatGPTVersion, postContent, formality } = entry;

  let prompt =
    `I want you to act as a copywriter and Re-write using a more <"` +
    formality +
    `"> tone.
- Do not echo my command or parameters. ` +
    postContent;

  const result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
