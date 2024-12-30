import dbService from "../../utilities/dbService";

export const updateTheme = async (entry) => {
  let {
    body: { postId },
    user: { _id },
  } = entry;

  const postData = await dbService.findOneRecord("ThemeModel", {});

  return postData;
};
