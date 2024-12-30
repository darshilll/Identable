import { generateEditPostPrompt } from "../openai/generateEditPostPrompt";

export const editPostPrompt = async (entry) => {
  let {
    body: { promptAction, postContent, rewriteType },
    user: { _id, chatGPTVersion },
  } = entry;

  let result = await generateEditPostPrompt({
    promptAction,
    postContent,
    rewriteType,
    chatGPTVersion,
  });

  return result;
};
