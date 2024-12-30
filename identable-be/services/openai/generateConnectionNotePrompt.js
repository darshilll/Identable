import { createNewsSummary } from "../../utilities/openAi";

export const generateConnectionNotePrompt = async (entry) => {
  let { chatGPTVersion, name, primarySubTitle, designation } = entry;

  let prompt = `Act as an expert copywriter with background [${designation}]. Now, your task is to generate 150 characters personalized connection requests for [${name}] in LinkedIn, on behalf of [${designation}].
    - Do not add HTML tags in comment.
    - Do not echo my command or parameters.`;

  const result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
