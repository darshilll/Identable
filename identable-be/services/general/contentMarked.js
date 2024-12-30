import dbService from "../../utilities/dbService";

export const contentMarked = async (entry) => {
  let {
    body: { status, content },
    user: { _id, currentPageId },
  } = entry;

  var insertObj = {
    content: content,
    status: status,
    userId: _id,
    pageId: currentPageId,
    createdAt: Date.now(),
  };

  await dbService.createOneRecord("ContentMarkModel", insertObj);

  return `Content ${status} successfully`;
};
