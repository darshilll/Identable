import dbService from "../../utilities/dbService";

export const getPostById = async (entry) => {
  let {
    body: { postId },
    user: { _id },
  } = entry;

  const postData = await dbService.findOneRecord(
    "PostModel",
    {
      userId: _id,
      _id: postId,
    },
    {
      scheduleDateTime: 1,
      postBody: 1,
      timeSlot: 1,
      timePeriod: 1,
      postMedia: 1,
      postMediaType: 1,
      generatedType: 1,
      status: 1,
      articleId: 1,
    }
  );

  return postData;
};
