const moment = require("moment-timezone");
import Handlebars from "handlebars";

import dbService from "../../utilities/dbService";
import {
  POST_GENERATE_TYPE,
  POST_MEDIA_TYPE,
  POST_STATUS,
} from "../../utilities/constants";

import { createCommonPrompt } from "../../utilities/openAi";
import { generatePDF } from "../../utilities/generatePDF";

const ObjectId = require("mongodb").ObjectID;

export const generateCarouselOneClick = async (entry) => {
  try {
    let { oneClickObj } = entry;

    const postData = await dbService.findAllRecords(
      "PostModel",
      {
        userId: oneClickObj?.userId,
        oneClickId: oneClickObj?._id,
        status: POST_STATUS.DRAFT,
        generatedType: POST_GENERATE_TYPE.CAROUSEL,
      },
      {
        _id: 1,
        postTopic: 1,
      }
    );

    const settingData = await dbService.findOneRecord(
      "AIAdvanceSettingModel",
      {
        pageId: oneClickObj?.pageId,
      },
      {
        formality: 1,
        tone: 1,
        language: 1,
        chatGPTVersion: 1,
      }
    );

    if (!settingData) {
      return;
    }

    const userData = await dbService.findOneRecord(
      "UserModel",
      {
        _id: oneClickObj?.userId,
      },
      {
        firstName: 1,
        lastName: 1,
      }
    );

    const profileData = await dbService.findOneRecord(
      "LinkedinPageModel",
      {
        _id: oneClickObj?.pageId,
      },
      {
        image: 1,
        name: 1,
      }
    );

    const carouselData = await dbService.findOneRecord(
      "CarouselModel",
      {
        _id: oneClickObj?.carouselId,
      },
      {
        carouselSetting: 1,
      }
    );

    for (let i = 0; i < postData?.length; i++) {
      const postObj = postData[i];

      let tone = settingData?.tone || {};

      let aiToneArray = Object.keys(tone).filter(function (key) {
        return tone[key] === true;
      });

      let aiTone = aiToneArray.map((item) => `${item}`).join(", ");

      const length = 5;
      const promtTheme = "General";
      const topic = postObj?.postTopic;

      let prompt = `Act as a high-end copywriter. Your task is to create ${length} a carousel-style list of ${promtTheme} about ${topic}. Use HTML format, bolded words where possible. Your response should not repeat or restate the original prompt or its parameters.
      The carousel-style list should consist of a main card and separate and distinct cards, each presenting a different ${promtTheme}. The content of each card should be clear and concise, providing a brief explanation of the ${promtTheme}. Additionally, your list should utilize the ${settingData?.language} language and ${aiTone} tone appropriate for a high-end copywriter, engaging and intriguing the reader while maintaining a ${settingData?.formality} and sophisticated voice, do not add emoji.
      
      - main should  minimum 6 to maximum 7 words
      - title should contain max 10 word
      - description should contain max 100 words
      - Ensure each card presents a unique focus with clear explanations
      - write the last slide as a footer slide with only  5-6 words contain
      - Do not echo my command or parameters.
      - Follow the below output pattern in the json format
      {
        "Data": [
          {
            "main": ""
            "mainSubTitle": ""
          },
          {
            "heading": "",
            "description": ""
          },
          {
            "footer": ""
          }
        ]
      }`;

      const result = await createCommonPrompt({
        prompt: prompt,
        chatGPTVersion: settingData?.chatGPTVersion,
      });
      const resultData = result?.data ? result?.data : result;

      const carousel = resultData;

      // ================== Start Generate PDF ==================
      let titlesAndDescriptions = [];
      for (let i = 0; i < carousel?.length; i++) {
        const dataDic = carousel[i];
        if (i == 0) {
          titlesAndDescriptions.push({
            main: dataDic?.main || dataDic?.heading || topic,
          });
        } else if (i == carousel?.length - 1) {
          titlesAndDescriptions.push({
            footer:
              dataDic?.footer || dataDic?.main || dataDic?.heading || topic,
          });
        } else {
          titlesAndDescriptions.push({
            title: dataDic?.heading || "",
            description: dataDic?.description || "",
          });
        }
      }

      let userName = profileData?.name;

      const user = {
        imageUrl: profileData?.image,
        name: userName,
        handler: "",
      };

      let pdfUrl = null;
      if (titlesAndDescriptions?.length > 0) {
        pdfUrl = await generatePDF({
          userId: userData?._id?.toString(),
          user: user,
          titlesAndDescriptions: titlesAndDescriptions,
          carouselData: carouselData?.carouselSetting,
        });
      }

      // ================== End Generate PDF ==================

      if (carousel?.length > 0 && pdfUrl) {
        // let carouselData = await dbService.findOneRecord("CarouselModel", {
        //   _id: ObjectId("660d5782d568411ac2a11df1"),
        // });

        let carouselData = getOldCarouselObject();

        let selectedTheme = carouselData;
        let newSlideArray = [];

        // First Slide
        let firstSlide = selectedTheme?.slideHtml[0];
        firstSlide["title"] = carousel[0].main || topic;

        newSlideArray.push(firstSlide);

        // Middle Slide
        for (let i = 1; i < carousel?.length; i++) {
          const dataDic = carousel[i];

          let middleSlide = JSON.parse(
            JSON.stringify(selectedTheme?.slideHtml[1])
          );
          middleSlide["title"] = dataDic?.title;
          middleSlide["content"] = dataDic?.content;
          middleSlide["contentImage"] = "";
          newSlideArray.push(middleSlide);
        }

        // Last Slide
        let lastSlide =
          selectedTheme?.slideHtml[selectedTheme?.slideHtml?.length - 1];
        newSlideArray.push(lastSlide);

        selectedTheme.slideHtml = newSlideArray;

        let documentDescription = topic;

        if (selectedTheme?.slideHtml?.length > 0) {
          documentDescription = selectedTheme?.slideHtml[0]?.title;
        }

        documentDescription = documentDescription?.substring(0, 40);
        let template = [];

        for (let i = 0; i < selectedTheme?.slideHtml?.length; i++) {
          let htmlObj = await getHtml({
            item: selectedTheme?.slideHtml[i],
            selectedTheme: selectedTheme,
            i: i,
            userData: userData,
            profileData: profileData,
          });
          template.push({
            changingThisBreaksApplicationSecurity: htmlObj,
          });
        }
        const carouselTemplate = template;
        const postBody = "";
        const postMedia = pdfUrl;

        await dbService.updateOneRecords(
          "PostModel",
          { _id: postObj._id },
          {
            documentDescription: documentDescription,
            carouselTemplate: carouselTemplate,
            postBody: postBody,
            postMedia: postMedia,
            postMediaType: POST_MEDIA_TYPE.CAROUSEL,
            status: POST_STATUS.SCHEDULED,
          }
        );
      } else {
        await dbService.updateOneRecords(
          "PostModel",
          { _id: postObj._id },
          {
            postMediaType: POST_MEDIA_TYPE.CAROUSEL,
            status: POST_STATUS.ERROR,
          }
        );
      }
    }
  } catch (error) {
    console.error("generatePost error = ", error);
  }
  return "Post Generated";
};
export const getHtml = async (entry) => {
  let { item, i, selectedTheme, userData, profileData } = entry;

  let theme = {
    isSolidBackground: true,
    backgroundColor: "",
    primaryColor: "",
    secondaryColor: "",
    backgroundImage: "",
    primaryFont: "",
    secondaryFont: "",
  };

  theme.backgroundColor = selectedTheme?.backgroundColor;
  theme.primaryColor = selectedTheme?.primaryColor;
  theme.secondaryColor = selectedTheme?.secondaryColor;
  theme.backgroundImage = selectedTheme?.backgroundImage;
  theme.primaryFont = selectedTheme?.primaryFont;
  theme.secondaryFont = selectedTheme?.secondaryFont;
  // theme.isSolidBackground = selectedTheme?.isSolidBackground;

  let isName = true;
  let isHandler = false;
  let isProfilePic = true;

  let userName = profileData?.name;
  let userHandler = "";
  let userProfilePic = profileData?.image;

  let context = {
    backgroundColor: theme.backgroundColor,
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    primaryFont: theme.primaryFont,
    secondaryFont: theme.secondaryFont,
    backgroundImage: theme.isSolidBackground
      ? ""
      : `url(${theme.backgroundImage})`,
    title: item?.title,
    content: item?.content,
    contentImage: item?.contentImage,
    userName: isName ? userName : "",
    userHandle: isHandler ? userHandler : "",
    userImage: isProfilePic ? userProfilePic : "",
  };

  var templateData = Handlebars.compile(item?.html);
  var newHtml = templateData(context);

  return newHtml;
};

function getOldCarouselObject() {
  let obj = {
    backgroundColor: "#162107",
    backgroundImage: "assets/images/carousel/theme-3/flowers.png",
    primaryColor: "#badd80",
    secondaryColor: "#4a4a4a",
    primaryFont: "Inter",
    secondaryFont: "Inter",
    slideImages: [
      "assets/images/carousel/theme-1a.jpg",
      "assets/images/carousel/theme-1b.jpg",
      "assets/images/carousel/theme-1c.jpg",
      "assets/images/carousel/theme-1d.jpg",
      "assets/images/carousel/theme-1e.jpg",
      "assets/images/carousel/theme-1f.jpg",
    ],
    slideHtml: [
      {
        isTitle: true,
        isContent: false,
        isContentImage: false,
        title: "Content Ideas for Social Media",
        html: ` <div
        style="
          width: 100%;
          display: inline-block;
          padding: 20px;
          background-color: {{backgroundColor}};
          background-image: {{backgroundImage}};
          background-position: bottom left;
          background-repeat: no-repeat;
          background-size: auto;
          min-height: 490px;
          cursor: pointer;
        "
      >
        <div
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #4c551e;
            padding-bottom: 10px;
          "
        >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 500;
              line-height: 1.2;
              text-transform: capitalize;
              padding-bottom: 5px;
            "
            ><img
              src={{userImage}}
              alt="profile"
              style="
                width: 40px;
                height: 40px;
                display: inline-block;
                border-radius: 50%;
              "
            />
            {{userName}}</span
          >
          <span
            style="
              display: inline-block;
              color:  {{primaryColor}};
              font-size: 16px;
              line-height: 1.2;
              padding-bottom: 5px;
            "
            >{{userHandle}}</span
          >
        </div>
        <div
          style="
            color:  {{primaryColor}};
            font-size: 44px;
            font-weight: 400;
            line-height: 1.3;
            height: 380px;
            overflow: hidden;
            display: flex;
            text-align: center;
            align-items: center;
          "
        >
          {{title}}
        </div>
      </div>`,
      },
      {
        isTitle: true,
        isContent: true,
        isContentImage: false,
        title: "Day In The Life",
        content: ` It doesn’t have to be 1000 words long. Or be super funny. Or
          feature a selfie. Or be the most original post ever written.`,
        contentImage: "assets/images/carousel/demo.jpg",
        html: ` <div
        style="
          width: 100%;
          display: inline-block;
          padding: 20px;
          background-color: {{backgroundColor}};
          background-image: {{backgroundImage}};
          background-position: bottom left;
          background-repeat: no-repeat;
          background-size: auto;
          min-height: 490px;
          cursor: pointer;
        "
      >
        <div
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #4c551e;
            padding-bottom: 10px;
          "
        >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 500;
              line-height: 1.2;
              text-transform: capitalize;
              padding-bottom: 5px;
            "
            ><img
              src={{userImage}}
              alt="profile"
              style="
                width: 40px;
                height: 40px;
                display: inline-block;
                border-radius: 50%;
              "
            />
            {{userName}}</span
          >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 16px;
              line-height: 1.2;
              padding-bottom: 5px;
            "
            >{{userHandle}}</span
          >
        </div>
        <div
          style="
            display: flex;
            flex-wrap: wrap;
            text-align: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            padding: 10px 0;
            height: 360px;
          "
        >
          <div
            style="
              color: {{primaryColor}};
              font-size: 38px;
              font-weight: 400;
              line-height: 1.3;
              max-height: 150px;
              overflow: hidden;
              margin-bottom: 10px;
            "
          >
            {{title}}
          </div>
          <div
            style="
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 400;
              line-height: 1.3;
              max-height: 160px;
              overflow: hidden;
            "
          >
           {{content}}
          </div>
        </div>
      </div>`,
      },
      {
        isTitle: true,
        isContent: true,
        isContentImage: false,
        title: "Expectation Vs Reality",
        content: ` It doesn’t have to be 1000 words long. Or be super funny. Or
         feature a selfie. Or be the most original post ever written.`,
        contentImage: "assets/images/carousel/demo.jpg",
        html: ` <div
        style="
          width: 100%;
          display: inline-block;
          padding: 20px;
          background-color: {{backgroundColor}};
          background-image: {{backgroundImage}};
          background-position: bottom left;
          background-repeat: no-repeat;
          background-size: auto;
          min-height: 490px;
          cursor: pointer;
        "
      >
        <div
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #4c551e;
            padding-bottom: 10px;
          "
        >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 500;
              line-height: 1.2;
              text-transform: capitalize;
              padding-bottom: 5px;
            "
            ><img
              src={{userImage}}
              alt="profile"
              style="
                width: 40px;
                height: 40px;
                display: inline-block;
                border-radius: 50%;
              "
            />
            {{userName}}</span
          >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 16px;
              line-height: 1.2;
              padding-bottom: 5px;
            "
            >{{userHandle}}</span
          >
        </div>
        <div
          style="
            display: flex;
            flex-wrap: wrap;
            text-align: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            padding: 10px 0;
            height: 360px;
          "
        >
          <div
            style="
              color: {{primaryColor}};
              font-size: 38px;
              font-weight: 400;
              line-height: 1.3;
              max-height: 150px;
              overflow: hidden;
              margin-bottom: 10px;
            "
          >
            {{title}}
          </div>
          <div
            style="
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 400;
              line-height: 1.3;
              max-height: 160px;
              overflow: hidden;
            "
          >
           {{content}}
          </div>
        </div>
      </div>`,
      },
      {
        isTitle: true,
        isContent: true,
        isContentImage: false,
        title: "Worst Advice",
        content: `It doesn’t have to be 1000 words long. Or be super funny. Or
          feature a selfie. Or be the most original post ever written.`,
        html: `  <div
        style="
          width: 100%;
          display: inline-block;
          padding: 20px;
          background-color: {{backgroundColor}};
          background-image: {{backgroundImage}};
          background-position: bottom left;
          background-repeat: no-repeat;
          background-size: auto;
          min-height: 490px;
          cursor: pointer;
        "
      >
        <div
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #4c551e;
            padding-bottom: 10px;
          "
        >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 500;
              line-height: 1.2;
              text-transform: capitalize;
              padding-bottom: 5px;
            "
            ><img
              src={{userImage}}
              alt="profile"
              style="
                width: 40px;
                height: 40px;
                display: inline-block;
                border-radius: 50%;
              "
            />
            {{userName}}</span
          >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 16px;
              line-height: 1.2;
              padding-bottom: 5px;
            "
            >{{userHandle}}</span
          >
        </div>
        <div
          style="
            display: flex;
            flex-wrap: wrap;
            text-align: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            padding: 10px 0;
            height: 360px;
          "
        >
          <div
            style="
              color: {{primaryColor}};
              font-size: 38px;
              font-weight: 400;
              line-height: 1.3;
              max-height: 150px;
              overflow: hidden;
              margin-bottom: 10px;
            "
          >
            {{title}}
          </div>
          <div
            style="
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 400;
              line-height: 1.3;
              max-height: 160px;
              overflow: hidden;
            "
          >
            {{content}}
          </div>
        </div>
      </div>`,
      },
      {
        isTitle: true,
        isContent: true,
        isContentImage: false,
        title: "Was This Helpful?",
        content: ` It doesn’t have to be 1000 words long. Or be super funny.`,
        contentImage: "assets/images/carousel/hit-link.png",
        html: `<div
        style="
          width: 100%;
          display: inline-block;
          padding: 20px;
          background-color: {{backgroundColor}};
          background-image: {{backgroundImage}};
          background-position: bottom left;
          background-repeat: no-repeat;
          background-size: auto;
          min-height: 490px;
          cursor: pointer;
        "
      >
        <div
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #4c551e;
            padding-bottom: 10px;
          "
        >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 500;
              line-height: 1.2;
              text-transform: capitalize;
              padding-bottom: 5px;
            "
            ><img
              src={{userImage}}
              alt="profile"
              style="
                width: 40px;
                height: 40px;
                display: inline-block;
                border-radius: 50%;
              "
            />
            {{userName}}</span
          >
          <span
            style="
              display: inline-block;
              color: {{primaryColor}};
              font-size: 16px;
              line-height: 1.2;
              padding-bottom: 5px;
            "
            >{{userHandle}}</span
          >
        </div>
        <div
          style="
            display: flex;
            flex-wrap: wrap;
            text-align: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            padding: 10px 0;
            height: 360px;
          "
        >
          <img
            src={{userImage}}
            alt="profile"
            style="
              width: 80px;
              height: 80px;
              display: inline-block;
              border-radius: 50%;
              margin-bottom: 10px;
            "
          />
          <div
            style="
              color: {{primaryColor}};
              font-size: 38px;
              font-weight: 400;
              line-height: 1.3;
              max-height: 100px;
              overflow: hidden;
              margin-bottom: 10px;
            "
          >
            {{title}}
          </div>
          <div
            style="
              color: {{primaryColor}};
              font-size: 20px;
              font-weight: 400;
              line-height: 1.3;
              max-height: 105px;
              overflow: hidden;
            "
          >
           {{content}}
          </div>
        </div>
      </div>`,
      },
    ],
  };
  return obj;
}
