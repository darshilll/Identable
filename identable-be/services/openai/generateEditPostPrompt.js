import { createNewsSummary } from "../../utilities/openAi";

export const generateEditPostPrompt = async (entry) => {
  let { chatGPTVersion, promptAction, postContent, rewriteType } = entry;

  let prompt = "";
  switch (promptAction) {
    case "rewrite":
      prompt = `Your new instructions:
      - Please only answer in English.
      - I would like you to act as a copywriter and rewrite or improve a given text for me.
      - I will give you the reply parameters in brackets [].
      - Do not echo my command or parameters.
      
      [TEXT TO REWRITE]:
      ${postContent}
      
      [HOW TO REWRITE THE TEXT]:
      Please rewrite given text, sentence by sentence, in the ${rewriteType} writing style.`;
      break;

    case "expand":
      prompt = `Your new instructions:
      - Please only answer in English.
      - I would like you to act as a copywriter and rewrite or improve a given text for me.
      - I will give you the reply parameters in brackets [].
      - Do not echo my command or parameters.
      
      [TEXT TO REWRITE]:
   ${postContent}
      
      [HOW TO REWRITE THE TEXT]:
      Make text longer.`;
      break;

    case "shorten":
      prompt = `Your new instructions:
      - Please only answer in English.
      - I would like you to act as a copywriter and rewrite or improve a given text for me.
      - I will give you the reply parameters in brackets [].
      - Do not echo my command or parameters.
      
      [TEXT TO REWRITE]:
     ${postContent}
      
      [HOW TO REWRITE THE TEXT]:
      Make text shorter.`;
      break;

    case "Rephase":
      prompt = `Your new instructions:
      - Please only answer in English.
      - I would like you to act as a copywriter and rewrite or improve a given text for me.
      - I will give you the reply parameters in brackets [].
      - Do not echo my command or parameters.
      
      [TEXT TO REWRITE]:
      ${postContent}
      
      [HOW TO REWRITE THE TEXT]:
      Rephrase to improve writing, flow, readability and coherence. Fix grammar and spelling `;
      break;
    case "add_emoji":
      prompt = `Your new instructions:
      - Please only answer in English.
      - I would like you to act as a copywriter and rewrite or improve a given text for me.
      - I will give you the reply parameters in brackets [].
      - Do not echo my command or parameters.
      
      [TEXT TO REWRITE]:
      ${postContent}
      
      [HOW TO REWRITE THE TEXT]:
      Add Emojis.`;
      break;
    case "improve_post":
      prompt = `"` + postContent + `" imrove above content`;
      break;
    case "rewritePost":
      prompt = `"` + postContent + `" rewrite above content`;
      break;

    default:
      break;
  }

  const result = await createNewsSummary({
    prompt: prompt,
    chatGPTVersion: chatGPTVersion,
  });

  return result;
};
