import dbService from "../../utilities/dbService";
import { pagenationFn } from "../../utilities/pagination";

export const getPostList = async (entry) => {
  let {
    body: { page, limit },
    user: { _id, currentPageId },
  } = entry;

  const userData = await dbService.findOneRecord(
    "UserModel",
    {
      _id: _id,
    },
    {
      _id: 1,
      isDsahboardLoaded: 1,
    }
  );

  if (!userData?.isDsahboardLoaded) {
    let response = await loadSampleData();
    return response;
  }

  const { docLimit, noOfDocSkip } = pagenationFn({
    page,
    limit,
  });

  let aggregate = [
    {
      $match: {
        userId: _id,
        pageId: currentPageId,
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "postId",
        foreignField: "linkedinPostId",
        as: "postData",
      },
    },
    {
      $unwind: { path: "$postData", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        text: 1,
        likeCount: 1,
        commentCount: 1,
        repostCount: 1,
        impressionCount: 1,
        postTime: 1,
        mediaUrls: 1,
        postType: 1,
        postId: 1,
        article: 1,
        postData:1,
        isBoosting: "$postData.isBoosting",
        isIdentable: {
          $cond: {
            if: { $ifNull: ["$postData._id", false] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $facet: {
        data: [
          { $sort: { postTime: -1 } },
          { $skip: noOfDocSkip },
          { $limit: docLimit },
        ],
        pageInfo: [
          {
            $group: { _id: null, count: { $sum: 1 } },
          },
        ],
      },
    },
    {
      $unwind: { path: "$pageInfo", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        items: "$data",
        pageInfo: {
          page: page,
          limit: limit,
          count: "$pageInfo.count",
        },
      },
    },
  ];

  const data = await dbService.aggregateData("LinkedinPostModel", aggregate);

  // if (data?.length > 0) {
  //   let postIds = data[0].items?.map((obj) => obj?.postId);
  //   if (postIds?.length > 0) {
  //     const regex = postIds?.map((word) => `\\b${word}\\b`).join("|");
  //     const where = { postUrl: { $regex: regex, $options: "i" } };

  //     const postArray = await dbService.findAllRecords("PostModel", where, {
  //       postUrl: 1,
  //       isBoosting: 1,
  //     });
  //     if (postArray?.length > 0) {
  //       let newItems = [];
  //       for (let i = 0; i < data[0].items?.length; i++) {
  //         let itemDic = data[0].items[i];

  //         let isBoosting = false;
  //         let isIdentable = false;

  //         const filterArray = postArray?.filter((x) =>
  //           x.postUrl?.includes(itemDic?.postId)
  //         );
  //         if (filterArray.length > 0) {
  //           if (filterArray[0]?.isBoosting) {
  //             isBoosting = true;
  //           }

  //           isIdentable = true;
  //         }

  //         newItems.push({
  //           ...itemDic,
  //           isBoosting: isBoosting,
  //           isIdentable: isIdentable,
  //         });
  //       }
  //       data[0].items = newItems;
  //     }
  //   }
  // }

  return {
    items: data[0].items,
    page: page,
    limit: limit,
    count: data[0].pageInfo.count ? data[0].pageInfo.count : 0,
  };
};

export const loadSampleData = async (entry) => {
  const samplePostData = [
    {
      post_id: "7097213447037173760",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demo-img.png",
      video: "",
      likeCount: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      postTime: 1692107545623,
      comments: [],
    },
    {
      post_id: "7096914467770241024",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demoimg-1.jpg",
      video: "",
      like_count: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      post_time: 1692107545623,
      comments: [],
    },
    {
      post_id: "7096893585026953216",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demoimg-2.jpg",
      video: "",
      like_count: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      post_time: 1692107545623,
      comments: [],
    },
    {
      post_id: "7096504007765979136",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demo-img.png",
      video: "",
      like_count: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      post_time: 1692107545623,
      comments: [],
    },
    {
      post_id: "7096503761837133824",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demoimg-1.jpg",
      video: "",
      like_count: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      post_time: 1692107545623,
      comments: [],
    },
    {
      post_id: "7086722252557217792",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demoimg-2.jpg",
      video: "",
      like_count: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      post_time: 1692107545623,
      comments: [],
    },
    {
      post_id: "7086722078678155265",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demo-img.png",
      video: "",
      like_count: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      post_time: 1692107545623,
      comments: [],
    },
    {
      post_id: "7086722078678155265",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demo-img.png",
      video: "",
      like_count: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      post_time: 1692107545623,
      comments: [],
    },
    {
      post_id: "7086722078678155265",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "assets/images/demo-img.png",
      video: "",
      like_count: 155,
      commentCount: 160,
      repostCount: 10,
      impressionCount: "1280",
      post_time: 1692107545623,
      comments: [],
    },
  ];

  return {
    items: samplePostData,
    page: 1,
    limit: 10,
    count: samplePostData?.length,
  };
};
