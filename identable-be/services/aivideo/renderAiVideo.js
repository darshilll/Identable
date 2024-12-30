import dbService from "../../utilities/dbService";
import { videoGenerateDataEvent } from "../socketEvent/videoGenerateDataEvent";
import { generateVideoThumbnail } from "../media/generateVideoThumbnail";

export const renderAiVideo = async (entry) => {
  let postData = entry?.body;
  
  const videoData = await dbService.findOneRecord(
    "AIVideoModel",
    {
      renderId: postData?.render_id,
    },
    { userId: 1, oneClickPostId: 1 }
  );

  await dbService.findOneAndUpdateRecord(
    "AIVideoModel",
    { renderId: postData.render_id },
    {
      $set: {
        progress: postData?.progress || 0,
        status: postData?.status,
      },
    },
    { new: true, upsert: true }
  );

  videoGenerateDataEvent({
    userId: videoData?.userId,
    data: {
      dataStatus: true,
      progress: postData?.progress,
      status: postData?.status,
      _id: videoData?._id?.toString(),
    },
  });

  if (postData?.status != "complete") {
    return "";
  }

  let updatedObj = {
    renderId: postData?.render_id,
    videoId: postData?.video_id,
    embedId: postData?.embed_id,
    status: postData?.status,
    editorUrl: postData?.editor_url,
    videoUrl: postData?.video_url,
    progress: postData?.progress,
    animatedThumbnailUrl: postData?.animated_thumbnail_url,
    thumbUrl: postData?.thumbnail_url,
    metadata: postData?.metadata,
  };

  if (!postData?.thumbnail_url) {
    let thumbKey =
      videoData?.userId?.toString() +
      "/aivideo/thumbnail_" +
      Date.now() +
      ".jpg";

    let thumbUrl = await generateVideoThumbnail({
      videoUrl: postData?.video_url,
      thumbUrl: thumbKey,
    });

    updatedObj = {
      ...updatedObj,
      thumbUrl: thumbUrl,
    };
  }

  await dbService.findOneAndUpdateRecord(
    "AIVideoModel",
    { renderId: postData.render_id },
    {
      $set: updatedObj,
    },
    { new: true, upsert: true }
  );

  if (videoData) {
    if (videoData?.oneClickPostId) {
      await dbService.updateOneRecords(
        "PostModel",
        { _id: videoData?.oneClickPostId },
        {
          postMedia: postData?.video_url,
        }
      );
    }
  }

  return "Video rendering successfully";
};
