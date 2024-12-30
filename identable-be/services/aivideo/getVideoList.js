import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";

export const getVideoList = async (entry) => {
  let {
    body: { searchText, sortMode },
    user: { _id },
  } = entry;

  let sortBy = { createdAt: -1 };
  if (sortMode) {
    sortBy = {
      createdAt: 1,
    };
  }

  let where = {
    userId: _id,
    isDeleted: false,
  };

  if (searchText) {
    const regex = new RegExp(searchText, "i");

    where = {
      ...where,
      topic: { $regex: regex },
    };
  }

  let aggregate = [
    {
      $match: where,
    },
    {
      $project: {
        _id: 1,
        videoUrl: 1,
        topic: 1,
        isScheduled: 1,
        status: 1,
        createdAt: 1,
        thumbUrl: 1,
        metadata: 1,
        animatedThumbnailUrl: 1,
      },
    },
    {
      $sort: sortBy,
    },
  ];

  const data = await dbService.aggregateData("AIVideoModel", aggregate);

  return data;
};
