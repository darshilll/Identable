import { scheduleInitiateConnection } from "../cron/crm/scheduleInitiateConnection";
import { CONNECTION_JOB_TYPE } from "../../utilities/constants";
import { scrapeConnectionsJob } from "../../utilities/jobs/scrapeConnectionsJob";
import {
  scrapeLinkedinUserDataJob,
  scrapePostDataJob,
} from "../../utilities/automationRequest";
import dbService from "../../utilities/dbService";
import { schedulePost } from "../cron/schedulePost";

import { generatePostPrompt } from "../openai/generatePostPrompt";
import { generateOneClickPost } from "../oneClick/generateOneClick";
import { boostingPost } from "../cron/boostingPost";
import { processBoostingPost } from "../cron/processBoostingPost";
import { generateImage } from "../../utilities/openAi";
import { scrapePost } from "../cron/scrapePost";
import { scrapeLinkedinUserDetails } from "../cron/scrapeLinkedinUserDetails";
import { scrapePostAnalytics } from "../cron/scrapePostAnalytics";
import { faceAnalyze } from "../cron/faceAnalyze";
import { scrapeFollowersJob } from "../../utilities/jobs/scrapeFollowersJob";
import { scheduleCompanyProfileInvite } from "../cron/crm/scheduleCompanyProfileInvite";
import { scrapeSocialSellingIndex } from "../cron/scrapeSocialSellingIndex";
import { addCarousel } from "../carousel/addCarousel";
import { addAdCreative } from "../adCreative/addAdCreative";
import { generatePDF } from "../../utilities/generatePDF";

const ObjectId = require("mongodb").ObjectID;

export const runJobManual = async (entry) => {
  let {
    body: { userId, jobType, pageId, companyUrl },
    user: { _id },
  } = entry;

  // await addAdCreative();
  // return;
  
  // let entry1 = {
  //   userId: "668ca70ee530040031986342",
  //   user: {
  //     imageUrl:
  //       "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png",
  //     name: "Piyush Masaliya",
  //     handler: "",
  //   },
  //   titlesAndDescriptions: [
  //     { main: "Unleashing SwiftUI: A New Era" },
  //     {
  //       title: "SwiftUI: The Game Changer",
  //       description:
  //         "SwiftUI, Apple's innovative UI toolkit, is transforming the landscape of iOS app development. It allows developers to design apps in a declarative style, making code easier to read and maintain. With SwiftUI, you can create stunning, high-performance applications with less code.",
  //     },
  //     { footer: "SwiftUI: Redefining iOS Development" },
  //   ],
  //   carouselData: {
  //     backend: {
  //       backgroundColor: "#1452AE",
  //       textColor: "#FFFFFF",
  //       isBgImage: true,
  //       isBgPattern: true,
  //       bgPattern:
  //         "https://identable-prod.s3.me-south-1.amazonaws.com/carousel/bg-pattern-2.png",
  //       bgimage:
  //         "https://identable-prod.s3.me-south-1.amazonaws.com/carousel/theme5-slide-bg.png",
  //       profileLayout: "bottomLeft",
  //       textAlign: "left",
  //       isBox: true,
  //       boxColor: "#82D9FF",
  //     },
  //   },
  // };
  // let pdfUrl = await generatePDF(entry1);

  // console.log("pdfUrl = ", pdfUrl);

  // await addAdCreative();

  // await addCarousel();
  // await boostingPost();
  // await scrapeSocialSellingIndex();

  // await scrapePostAnalytics();
  // await scrapeLinkedinUserDetails();
  return;

  // const userData1 = await dbService.findOneRecord("UserModel", {
  //   _id: ObjectId("65f29246bce8ed00300429df"),
  // });

  // let jobResult = await scrapeFollowersJob({
  //   userId: userData1?._id,
  //   cookies: userData1?.cookies,
  //   cookiesExpiry: userData1?.cookiesExpiry,
  //   userAgent: userData1?.userAgent,
  //   pageId: userData1?.currentPageId,
  //   proxy: userData1?.proxy,
  // });

  // return;

  // await scrapePostAnalytics();
  // return;

  // await faceAnalyze()
  // return;
  // const connectedData = await dbService.findAllRecords(
  //   "LinkedinFollowerModel",
  //   { imageSrc: { $exists: true, $ne: "" }, profileUrl: { $exists: true, $ne: "" }, headline: { $exists: true, $ne: "" }, name: { $exists: true, $ne: "" } }
  // );
  // let bulkDataLinkedinUserArray = [];

  // for (let i = 0; i < connectedData?.length; i++) {
  //   const connectedDic = connectedData[i];

  //   let doc1 = {
  //     username: connectedDic?.username,
  //     imageSrc: connectedDic?.imageSrc,
  //     name: connectedDic?.name,
  //     profileUrl: connectedDic?.profileUrl,
  //     headline: connectedDic?.headline,
  //     updatedAt: Date.now(),
  //   };

  //   bulkDataLinkedinUserArray.push({
  //     updateOne: {
  //       filter: {
  //         username: connectedDic?.linkedinUserName,
  //       },
  //       update: { $set: doc1 },
  //       upsert: true,
  //     },
  //   });
  // }
  // if (bulkDataLinkedinUserArray?.length > 0) {
  //   await dbService.updateBulkRecords(
  //     "LinkedinUserDataModel",
  //     bulkDataLinkedinUserArray
  //   );
  // }

  return;

  // await scrapeLinkedinUserDetails();
  // return;
  if (_id?.toString() != "661cb2ed0dc85e003016747b") {
    throw new Error("Permission denied");
  }

  const userData = await dbService.findOneRecord("UserModel", {
    _id: ObjectId(userId),
  });

  if (!userData) {
    throw new Error("User not found");
  }

  if (jobType == CONNECTION_JOB_TYPE.VISIT_PROFILE) {
    let jobResult = await scheduleInitiateConnection({
      jobType: CONNECTION_JOB_TYPE.VISIT_PROFILE,
      userId: userId,
    });
    return jobResult;
  } else if (jobType == CONNECTION_JOB_TYPE.INTERACT_WITH_RECENT_POST) {
    let jobResult = await scheduleInitiateConnection({
      jobType: CONNECTION_JOB_TYPE.INTERACT_WITH_RECENT_POST,
      userId: userId,
    });
    return jobResult;
  } else if (jobType == CONNECTION_JOB_TYPE.FOLLOW_USER) {
    let jobResult = await scheduleInitiateConnection({
      jobType: CONNECTION_JOB_TYPE.FOLLOW_USER,
      userId: userId,
    });
    return jobResult;
  } else if (jobType == CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST) {
    let jobResult = await scheduleInitiateConnection({
      jobType: CONNECTION_JOB_TYPE.SEND_CONNECTION_REQUEST,
      userId: ObjectId("65f29246bce8ed00300429df"),
    });
    return jobResult;
  } else if (jobType == "SCRAPE_ALL_CONNECTIONS") {
    let jobResult = await scrapeConnectionsJob({
      userId: userData?._id,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      pageId: pageId,
      proxy: userData?.proxy,
    });
    return jobResult;
  } else if (jobType == "SCRAPE_INTEGRATION_DATA") {
    let jobResult = await scrapeLinkedinUserDataJob({
      userId: userData?._id,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      proxy: userData?.proxy,
    });
    return jobResult;
  } else if (jobType == "SCRAPE_ALL_POSTS") {
    let jobResult = await scrapePostDataJob({
      userId: userData?._id,
      cookies: userData?.cookies,
      cookiesExpiry: userData?.cookiesExpiry,
      userAgent: userData?.userAgent,
      proxy: userData?.proxy,
      pageId: pageId,
      companyUrl: companyUrl,
    });
    return jobResult;
  } else if (jobType == "INSPIREME_PROMPT") {
    const settingData = await dbService.findOneRecord("AIAdvanceSettingModel", {
      userId: ObjectId("65f29246bce8ed00300429df"),
      isCurrentPage: true,
    });
    const pageData = await dbService.findOneRecord("LinkedinPageModel", {
      _id: settingData?.pageId,
    });
    const result = await generatePostPrompt({
      settingData,
      pageData,
    });
  } else if (jobType == "GENERATE_PDF") {
    await generatePdf();
  } else if (jobType == "UPDATE_USERNAME") {
    await updateUserName();
  } else if (jobType == "UPDATE_CONNECTION_STATUS") {
    await updateConnectedStatus(entry);
  } else if (jobType == "SCHEDULE_POST") {
    await schedulePost();
  } else if (jobType == "ONE_CLICK") {
    generateOneClickPost({ userId: ObjectId(userId) });
  } else if (jobType == "INSERT_BOT") {
    insertBot();
  }

  return "Success";
};

const PDFDocument = require("pdfkit");
const fs = require("fs");
const axios = require("axios");
const AWS = require("aws-sdk");

const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.BUCKET_NAME;
const endpoint = process.env.BUCKET_ENDPOINT;

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  endpoint,
});

const s3 = new AWS.S3();

export const generatePdf = async (entry) => {
  const user = {
    imageUrl:
      "https://media.licdn.com/dms/image/C4E03AQEI9vjePWEVeQ/profile-displayphoto-shrink_200_200/0/1539927333399?e=1723075200&v=beta&t=4Xwirr9exmOQtgHPSaYt7Ky1mAN5_PHRAZ4S4QoElX4",
    name: "John Doe",
    handler: "@john_doe",
  };

  const titlesAndDescriptions = [
    {
      main: "Common Pitfalls in Data-Driven Business Transformation",
    },
    {
      title: "Ignoring Data Quality",
      description:
        "Many businesses underestimate the importance of data quality. Poor data quality can lead to inaccurate insights and misguided strategies. Always ensure your data is accurate, relevant, and up-to-date.",
    },
    {
      title: "Lack of Clear Objectives",
      description:
        "Without clear objectives, your data-driven transformation can quickly become aimless. Define your goals early on and align them with your business strategy.",
    },
    {
      title: "Overlooking Data Security",
      description:
        "Data security is paramount. Neglecting it can lead to breaches, damaging your reputation and customer trust. Invest in robust security measures.",
    },
  ];

  const contentImageUrl =
    "https://martech.org/wp-content/uploads/2014/09/content-marketing-ss-1920.jpg";

  createCarouselPDF(user, titlesAndDescriptions, contentImageUrl)
    .then(() => console.log("PDF creation and upload initiated"))
    .catch((err) => console.error(err));
};

async function fetchImage(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return response.data;
}

async function createCarouselPDF(user, titlesAndDescriptions, contentImageUrl) {
  const doc = new PDFDocument({
    size: [400, 410], // Set fixed size for all pages
    margin: 0, // Set no margin
  });
  const buffers = [];

  // Save PDF to a buffer
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", async () => {
    const pdfData = Buffer.concat(buffers);

    // Upload PDF to S3
    const params = {
      Bucket: bucketName,
      Key: "LinkedIn_Carousel1.pdf",
      Body: pdfData,
      ContentType: "application/pdf",
      ACL: "public-read", // Optional: Make the file publicly readable
    };

    try {
      const data = await s3.upload(params).promise();
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  });

  const userImageBuffer = await fetchImage(user.imageUrl);
  const contentImageBuffer = await fetchImage(contentImageUrl);

  const addPageWithBackground = () => {
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#162107"); // Set background color
    // doc.fillColor("#badd80"); // Set text color
  };

  const xPos = 30;
  const topPos = 50;

  const addUserHeader = () => {
    // Draw user image as a circle
    doc.save();
    doc.circle(50, 50, 20).clip();
    doc.image(userImageBuffer, 30, 30, { width: 40, height: 40 });
    doc.restore();

    // User name and handler
    doc.fillColor("#badd80");
    doc.fontSize(16).text(user.name, 80, 45);
    // doc.fontSize(16).text(user.handler, 450, 65);

    // Horizontal line
    doc
      .moveTo(xPos, 90)
      .lineTo(doc.page.width - xPos, 90)
      .stroke()
      .strokeColor("#badd80");
  };

  // Add content slides
  let main = titlesAndDescriptions[0]?.main;

  addPageWithBackground();
  addUserHeader();
  doc.moveDown(2);
  doc
    .fontSize(36)
    .text(main, xPos, 130, { align: "center", width: doc.page.width - 60 });

  for (let i = 1; i < titlesAndDescriptions?.length; i++) {
    const { title, description } = titlesAndDescriptions[i];
    doc.addPage();
    addPageWithBackground();
    addUserHeader();
    doc.moveDown(2);
    doc.fillColor("#badd80");
    doc
      .fontSize(24)
      .text(title, xPos, 110, { align: "center", width: doc.page.width - 60 });
    doc.moveDown(1);
    doc.fillColor("#4a4a4a");
    doc
      .fontSize(20)
      .text(description, xPos, 160, { width: doc.page.width - 60 });
  }

  doc.addPage();
  addPageWithBackground();
  addUserHeader();
  doc.moveDown(2);
  doc.fontSize(36).text("Was This Helpful?", xPos, 150, {
    align: "center",
    width: doc.page.width - 60,
  });
  doc.moveDown(1);
  doc
    .fontSize(18)
    .text(
      " It doesn’t have to be 1000 words long. Or be super funny.",
      xPos,
      210,
      { align: "center", width: doc.page.width - 60 }
    );

  // Add final slide with image content
  // doc.addPage();
  // addPageWithBackground();
  // addUserHeader();
  // doc.image(contentImageBuffer, 100, 150, { width: 400, height: 300 });

  // Finalize the PDF
  doc.end();
}

const { URL } = require("url");

export const updateUserName = async (entry) => {
  const prospectData = await dbService.findAllRecords(
    "LinkedinConnectionModel",
    {},
    {
      _id: 1,
      campaignId: 1,
      profileUrl: 1,
    }
  );

  let prospectBulkDataArray = [];

  for (let i = 0; i < prospectData?.length; i++) {
    let prospectDic = prospectData[i];
    let username = extractUsername(prospectDic?.profileUrl);

    prospectBulkDataArray.push({
      updateOne: {
        filter: {
          _id: prospectDic?._id,
        },
        update: { $set: { username: username } },
      },
    });
  }

  if (prospectBulkDataArray?.length > 0) {
    await dbService.updateBulkRecords(
      "LinkedinConnectionModel",
      prospectBulkDataArray
    );
  }
};

function extractUsername(profileUrl) {
  // Parse the URL
  const url = new URL(profileUrl);

  // Get the pathname and split it to extract the username
  const pathname = url.pathname;
  const parts = pathname.split("/");

  // The username is the part after the '/in/' part
  const usernameIndex = parts.indexOf("in") + 1;

  if (usernameIndex > 0 && usernameIndex < parts.length) {
    return parts[usernameIndex];
  }

  // Return null if no username is found
  return null;
}

export const updateConnectedStatus = async (entry) => {
  let {
    body: { userId, jobType, pageId, companyUrl },
    user: { _id },
  } = entry;
  let user_id = userId;

  const prospectData = await dbService.findAllRecords(
    "LinkedinConnectionModel",
    {
      userId: ObjectId(user_id),
      isLinkedinConnection: false,
    },
    {
      _id: 1,
      campaignId: 1,
      profileUrl: 1,
      username: 1,
    }
  );

  const connectionData = await dbService.findAllRecords(
    "LinkedinConnectedModel",
    {
      userId: ObjectId(user_id),
    },
    {
      _id: 1,
      username: 1,
    }
  );
  let prospectBulkDataArray = [];
  let connectionBulkDataArray = [];

  if (prospectData?.length > 0 && connectionData?.length > 0) {
    for (let i = 0; i < connectionData?.length; i++) {
      const connectionsDic = connectionData[i];

      const filterArray = prospectData?.filter(
        (x) => x?.username == connectionsDic?.username
      );
      if (filterArray.length > 0) {
        prospectBulkDataArray.push({
          updateOne: {
            filter: {
              _id: filterArray[0]?._id,
            },
            update: { $set: { isLinkedinConnection: true } },
          },
        });

        connectionBulkDataArray.push({
          updateOne: {
            filter: {
              _id: connectionsDic._id,
            },
            update: {
              $set: {
                isConnected: true,
                campaignId: filterArray[0]?.campaignId,
              },
            },
          },
        });
      }
    }

    if (prospectBulkDataArray?.length > 0) {
      await dbService.updateBulkRecords(
        "LinkedinConnectionModel",
        prospectBulkDataArray
      );
    }

    if (connectionBulkDataArray?.length > 0) {
      await dbService.updateBulkRecords(
        "LinkedinConnectedModel",
        connectionBulkDataArray
      );
    }
  }
};

export const insertBot = async (entry) => {
  let bulkDataArray = [];

  const userArray = await dbService.findAllRecords("UserModel", {
    isCookieValid: true,
    isIntegration: true,
  });

  for (let i = 0; i < userArray?.length; i++) {
    const userDic = userArray[i];

    let doc = {
      proxy: userDic?.proxy,
      cookies: userDic?.cookies,
      cookiesExpiry: userDic?.cookiesExpiry,
      userId: userDic?._id,
      userAgent: userDic?.userAgent,
      isUser: true,
      isCookieValid: true,
      isEnabled: true,
    };

    bulkDataArray.push({
      updateOne: {
        filter: {
          userId: userDic?._id,
        },
        update: { $set: doc },
        upsert: true,
      },
    });
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("BotModel", bulkDataArray);
  }
};

export const insertProxy = async (entry) => {
  let bulkDataArray = [];

  let proxyArray = [
    "130.180.236.207:6212",
    "192.46.185.229:5919",
    "139.5.23.11:6319",
    "45.58.244.20:6433",
    "63.141.58.60:6376",
    "63.246.130.59:6260",
    "192.145.71.213:6850",
    "192.53.137.195:6483",
    "204.93.147.33:6587",
    "192.145.71.151:6788",
    "45.58.244.56:6469",
    "192.46.189.48:6041",
    "192.53.66.200:6306",
    "130.180.232.108:8546",
    "69.91.142.69:7561",
    "192.53.138.203:6141",
    "207.228.7.220:7402",
    "193.160.82.43:6015",
    "63.246.130.117:6318",
    "130.180.234.40:7263",
    "103.196.9.148:6722",
    "103.210.12.120:6048",
    "192.145.71.89:6726",
    "192.53.137.56:6344",
    "192.53.142.140:5837",
    "45.58.244.125:6538",
    "103.196.9.152:6726",
    "192.46.201.7:6521",
    "63.246.130.30:6231",
    "192.53.140.27:5123",
    "130.180.228.14:6298",
    "63.141.62.177:6470",
    "216.170.122.1:6039",
    "192.46.190.204:6797",
    "192.46.200.242:5912",
    "45.115.60.217:5946",
    "104.243.210.187:5835",
    "63.246.137.254:5883",
    "130.180.231.234:8376",
    "198.145.103.112:6369",
    "192.53.142.74:5771",
    "192.46.185.107:5797",
    "192.46.203.128:6094",
    "192.46.190.238:6831",
    "63.141.58.157:6473",
    "192.53.66.151:6257",
    "192.53.140.11:5107",
    "192.53.69.144:6782",
    "45.58.244.205:6618",
    "204.93.147.208:6762",
    "130.180.232.58:8496",
    "192.46.187.254:6832",
    "192.46.189.206:6199",
    "192.53.142.250:5947",
    "130.180.237.44:6987",
    "45.248.55.164:6750",
    "63.246.137.215:5844",
    "192.46.187.73:6651",
    "207.228.7.64:7246",
    "130.180.237.189:7132",
    "45.115.60.56:5785",
    "154.13.221.78:6742",
    "192.53.69.154:6792",
    "216.98.230.144:6597",
    "72.46.139.172:6732",
    "63.246.130.198:6399",
    "192.46.188.127:5786",
    "192.53.67.82:5631",
    "192.46.185.72:5762",
    "192.46.188.247:5906",
    "63.141.62.212:6505",
    "216.98.230.249:6702",
    "72.46.139.84:6644",
    "192.46.201.190:6704",
    "192.53.142.41:5738",
  ];
  for (let i = 0; i < proxyArray?.length; i++) {
    const proxy = proxyArray[i];

    let doc = {
      proxy: proxy,
    };

    bulkDataArray.push({
      insertOne: {
        document: doc,
      },
    });
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("ProxyModel", bulkDataArray);
  }
};

export const insertBot1 = async (entry) => {
  let bulkDataArray = [];

  let botArray = [
    {
      "": 1,
      email: "virsevabbia@mail.ru",
      password: "l2Vq2CPP6J?",
      proxy: "http: //154.194.26.106:6347",
      location: "US",
      status: "Failed",
      cookies: "",
      cookies_expiry: "",
      message: "Access to your account has been temporarily restricted",
      additional_steps: "",
    },
    {
      "": 2,
      email: "simsesuppya@mail.ru",
      password: "g3WMu9KjWa?",
      proxy: "http: //45.196.33.79:6060",
      location: "US",
      status: "Failed",
      cookies: "",
      cookies_expiry: "",
      message: "",
      additional_steps: "",
    },
    {
      "": 3,
      email: "novkuniwwoa@mail.ru",
      password: "nIqZ0rewNB?",
      proxy: "http: //154.194.27.158:6698",
      location: "US",
      status: "Passed",
      cookies:
        "AQEDAU1XBfEEFX1gAAABjtzH3KMAAAGPANRgo1YAY3MdVmqqC7kdMU46Ma5BqeSazKkDPEjKiT2m6mBCVYdgJXGjTJhK08XQ6NR9k-k-Y1A_xgv9SQxCxEihki9njwjkTbPpEfcga0L-Szupnc9XH-lU",
      cookies_expiry: 1744619069,
      message: "",
      additional_steps: "Verification code sent on email",
    },
    {
      "": 4,
      email: "vennovukkoa@mail.ru",
      password: "4G7b5Fw6yi?",
      proxy: "http: //63.246.130.59:6260",
      location: "US",
      status: "Passed",
      cookies:
        "AQEDAU0177ABezYmAAABjtzKYDwAAAGPANbkPFYAh6zvGbNZ1MTgkExTYm2eBRc4XJ1kupcku9x5ortFyk1g3-Fm1XohdM3toyNWpmg4i8DVr06CYRt7-Wvzshr_aP-N5q3L0FjH28wkSC0Ev9cjgsFd",
      cookies_expiry: 1744619234,
      message: "",
      additional_steps: "Verification code sent on email",
    },
    {
      "": 5,
      email: "cinfucykkua@mail.ru",
      password: "I7rCwjBE1V?",
      proxy: "http: //63.141.58.60:6376",
      location: "US",
      status: "Passed",
      cookies:
        "AQEDAU1XA08At98bAAABjtzNlfIAAAGPANoZ8k0AFCPPDBlKxP-8RUUgCCEHVXIC-tyz1U1liwIdP66HrG1C51HcWJoLUCRT5hJYSYlt66wjgINib2WaWCJQu0Te5nunP-AtytrQ6ATZzwxHswB6GPfC",
      cookies_expiry: 1744619444,
      message: "",
      additional_steps: "Verification code sent on email",
    },
    {
      "": 6,
      email: "wetsuwoffya@mail.ru",
      password: "iE1i8sU1t2?",
      proxy: "http: //45.58.244.20:6433",
      location: "US",
      status: "Passed",
      cookies:
        "AQEDAU017JQE59UmAAABjtzQiVAAAAGPAN0NUFYAALkUpyh0f5qWf6sjDvkRs20LrZCr4FgrUaOZCWX9F8ynXmOXTDHFtKORHONYQ3mnUSmoEtSfV7kx_grkZJdOJzMiX0eQ1RYziebvscc1roSY5g4n",
      cookies_expiry: 1744619638,
      message: "",
      additional_steps: "Verification code sent on email",
    },
    {
      "": 7,
      email: "kerkokovvaa@mail.ru",
      password: "7LGbpIDtjh?",
      proxy: "http: //204.93.147.33:6587",
      location: "US",
      status: "Failed",
      cookies: "",
      cookies_expiry: "",
      message: "",
      additional_steps: "",
    },
    {
      "": 8,
      email: "woxfiwyxxea@mail.ru",
      password: "ttG93yPJz5?",
      proxy: "http: //192.53.137.195:6483",
      location: "US",
      status: "Passed",
      cookies:
        "AQEDAU018j8Ck4MXAAABjty4la4AAAGPAMUZrk0ArQEIAIbtwIaV7l31xHofNsZ71ZFEMP7rIht37iNkTyqHre5TuAGXKmmnlypggp3KSefHz0AgGB8DMsFr0ZBHpmKzP5AmBBORwS9idEBAQAS3Ct5y",
      cookies_expiry: 1744618068,
      message: "",
      additional_steps: "Verification code sent on email",
    },
    {
      "": 9,
      email: "mislumammia@mail.ru",
      password: "oer2W1aOT2?",
      proxy: "http: //45.196.33.83:6064",
      location: "US",
      status: "Passed",
      cookies:
        "AQEDAU01-cUCpb-5AAABjtzD2y4AAAGPANBfLk0AAiaovroZ6t1-yCZkXHaNpReU6babihXX7PU0ldfy28xRps8zrOUM_rq72KHHRY_glC-7zdvGoKmqp50z1dJxsRCkmwrsDCxOA68zcT5xfAQAKz8k",
      cookies_expiry: 1744618807,
      message: "",
      additional_steps: "Verification code sent on email",
    },
    {
      "": 10,
      email: "mornimovvia@mail.ru",
      password: "4rsCCQDuF9?",
      proxy: "http: //69.91.142.69:7561",
      location: "US",
      status: "Passed",
      cookies:
        "AQEDAU01-iwAVYouAAABjtzclYwAAAGPAOkZjE4AFXQIMU4TZ-eXlhaYjElTS7M4gbY7wjsjbbxYZmUiLGOUlyKmb8yK20h_pnbfi0x_afQUfOr_Om5nW1Pv2wpVrMjHxczfc-Rcye0AYmDkFuQvvmS-",
      cookies_expiry: 1744620427,
      message: "",
      additional_steps: "Verification code sent on email",
    },
  ];
  for (let i = 0; i < botArray?.length; i++) {
    const botObj = botArray[i];

    let doc = {
      email: botObj?.email,
      password: botObj?.password,
      proxy: botObj?.proxy,
      location: botObj?.location,
      status: botObj?.status,
      cookies: botObj?.cookies,
      cookiesExpiry: botObj?.cookies_expiry,
    };

    bulkDataArray.push({
      insertOne: {
        document: doc,
      },
    });
  }

  if (bulkDataArray?.length > 0) {
    await dbService.updateBulkRecords("BotModel", bulkDataArray);
  }
};
