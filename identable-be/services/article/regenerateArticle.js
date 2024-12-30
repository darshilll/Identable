import { generateArticle } from "./generateArticle";

export const regenerateArticle = async (entry) => {
  let result = await generateArticle(entry, true);

  return result;
};
