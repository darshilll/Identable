import dbService from "../../../utilities/dbService";
import { generatePostCommentPrompt } from "../../openai/generatePostCommentPrompt";

const ObjectId = require("mongodb").ObjectID;

export const postComment = async (entry) => {
  let {
    body: { post_content, prospect_id },
  } = entry;

  const prospectData = await dbService.findOneRecord(
    "LinkedinConnectionModel",
    {
      _id: ObjectId(prospect_id),
    },
    {
      _id: 1,
      userId: 1,
      name: 1,
      primarySubTitle: 1,
      linkedinUserName: 1,
    }
  );
  if (!prospectData) {
    throw new Error("Prospect not found");
  }

  const linkedinUserData = await dbService.findOneRecord(
    "LinkedinUserDataModel",
    {
      username: prospectData?.linkedinUserName,
    },
    {
      name: 1,
      primarySubTitle: 1,
    }
  );

  if (!linkedinUserData) {
    throw new Error("Linkedin User not found");
  }

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: prospectData?.userId,
    },
    {
      _id: 1,
      chatGPTVersion: 1,
    }
  );

  let comment = await generatePostCommentPrompt({
    chatGPTVersion: userData?.chatGPTVersion,
    postContent: post_content,
    name: linkedinUserData?.name,
    primarySubTitle: linkedinUserData?.primarySubTitle,
  });

  try {
    comment = JSON.stringify(comment)?.slice(1, -1);
  } catch (error) {
    console.error("postComment error = ", error);
  }

  await dbService.updateOneRecords(
    "LinkedinConnectionModel",
    {
      _id: ObjectId(prospect_id),
    },
    {
      comment: comment,
    }
  );

  return comment;
};
