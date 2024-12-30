import { successAction, failAction } from "../../utilities/response";
import Message from "../../utilities/messages";
import dbService from "../../utilities/dbService";

export const uploadS3File = async (req, res, next) => {
  try {
    const {
      files = [],
      user: { _id, chatGPTVersion, currentPageId },
    } = req;

    if (files && Array.isArray(files) && files.length > 0) {
      let bulkDataArray = [];

      let data = [];
      for (let i = 0; i < files?.length; i++) {
        const item = files[i];

        let { location, originalname } = item;

        let url = location;

        let dataObj = {
          userId: _id,
          pageId: currentPageId,
          createdAt: Date.now(),
          mediaUrl: item?.location,
          mimetype: item?.mimetype,
          mediaSize: item?.size,
        };

        bulkDataArray.push({
          insertOne: {
            document: dataObj,
          },
        });

        data.push({
          name: originalname,
          url: url,
        });
      }

      if (bulkDataArray?.length > 0) {
        await dbService.updateBulkRecords("MediaModel", bulkDataArray);
      }

      return res.status(200).json(successAction(data, Message.filesUploaded));
    }
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};
