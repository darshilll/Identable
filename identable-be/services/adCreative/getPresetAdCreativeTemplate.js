import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const getPresetAdCreativeTemplate = async (entry) => {
  let {
    body: { adType },
    user: { _id, chatGPTVersion },
  } = entry;

  let templateData = await dbService.findOneRecord(
    "AdCreativeModel",
    {
      isDeleted: false,
    },
    {
      templateSetting: 1,
    }
  );

  let fontFamilyListArray = [
    "Bebas Neue",
    "Play",
    "Sora",
    "Inter",
    "Roboto",
    "Lobster",
    "Poppins",
    "PT Serif",
    "Varela Round",
    "Dancing Script",
    "PT Sans Narrow",
    "Varela Round",
    "Playfair Display",
  ];

  let layoutArray = [
    {
      layout: "square-top-left-layout",
      layoutType: "Circle Ad layout",
    },
    {
      layout: "square-bottom-left-layout",
      layoutType: "Square Ad layout",
    },
    {
      layout: "square-bottom-right-layout",
      layoutType: "Square Ad layout",
    },
    {
      layout: "stroy-round-line-top-layout",
      layoutType: "Circle Story Ad layout",
    },
    {
      layout: "stroy-square-line-bottom-layout",
      layoutType: "Circle Story Ad layout",
    },
    {
      layout: "square-top-left-layout",
    },
  ];

  let layoutDesignArray = [
    {
      adType: "Square Ad (Instagram/Facebook)",
      layoutType: "Circle Ad layout",
      layouts: [
        {
          type: "square-top-left-layout",
          image: "assets/images/ad-creative/layout/square-layout-1.png",
          isActive: true,
          width: 80,
        },
        {
          type: "square-top-right-layout",
          image: "assets/images/ad-creative/layout/square-layout-2.png",
          isActive: false,
          width: 80,
        },
      ],
    },
    {
      adType: "Square Ad (Instagram/Facebook)",
      layoutType: "Square Ad layout",
      layouts: [
        {
          type: "square-bottom-left-layout",
          image: "assets/images/ad-creative/layout/square-layout-3.png",
          isActive: true,
          width: 80,
        },
        {
          type: "square-bottom-right-layout",
          image: "assets/images/ad-creative/layout/square-layout-4.png",
          isActive: false,
          width: 80,
        },
      ],
    },
    {
      adType: "Instagram/Facebook Story Ad",
      layoutType: "Circle Story Ad layout",
      layouts: [
        {
          type: "stroy-square-line-bottom-layout",
          image: "assets/images/ad-creative/layout/stroy-layout-1.png",
          isActive: true,
          width: 58,
        },
        {
          type: "stroy-round-line-top-layout",
          image: "assets/images/ad-creative/layout/stroy-layout-2.png",
          isActive: false,
          width: 58,
        },
        {
          type: "stroy-round-line-bottom-layout",
          image: "assets/images/ad-creative/layout/stroy-layout-3.png",
          isActive: false,
          width: 58,
        },
      ],
    },
    {
      adType: "Instagram Post",
      layoutType: "Sqaure Instagram Post layout",
      layouts: [
        {
          type: "post-semi-sqaure-bottom-layout",
          image: "assets/images/ad-creative/layout/semi-sqaure-layout-1.png",
          isActive: true,
          width: 68,
        },
        {
          type: "post-semi-sqaure-top-layout",
          image: "assets/images/ad-creative/layout/semi-sqaure-layout-2.png",
          isActive: false,
          width: 68,
        },
        // {
        //   type: 'semi-sqaure-layout-3',
        //   image: 'assets/images/ad-creative/layout/semi-sqaure-layout-3.png',
        //   isActive: false,
        //   width: 68,
        // },
      ],
    },
  ];

  let layoutType = "";
  let layout = "";

  const filterArray = layoutDesignArray?.filter((x) => x?.adType == adType);
  if (filterArray.length > 0) {
    layoutType = filterArray[0]?.layoutType;
    layout = filterArray[0]?.layouts[0]?.type;
  }

  // let layout = getRandomValue(layoutArray);

  let colorsArray = getColorsArray();
  let colorObj = getRandomValue(colorsArray);

  let textColor = colorObj?.textColor;
  let subColor = colorObj?.subColor;
  let backgroundColor = colorObj?.backgroundColor;
  let subBackgroundColor = colorObj?.subBackgroundColor;

  let titlefont = getRandomValue(fontFamilyListArray);
  let descriptionFont = getRandomValue(fontFamilyListArray);

  let isAigenratedBgImage = false;
  let aiGenratedBgUrl = "";

  let backgroundImage = isAigenratedBgImage;
  let isBgImage = aiGenratedBgUrl;

  let newTemplateData = {
    ...templateData?.templateSetting,
    name: "preset",
    templateId: "presetTemplateId",
    layout: layout,
    layoutType: layoutType,
    textColor,
    subColor,
    backgroundColor,
    subBackgroundColor,
    titlefont,
    descriptionFont,
    isAigenratedBgImage,
    aiGenratedBgUrl,
    backgroundImage,
    isBgImage,
    previewImage: [],
    slides: [],
    type: adType,
  };

  return newTemplateData;
};

function getRandomValue(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  const randomValue = array[randomIndex];

  return randomValue;
}
function getColorsArray() {
  return [
    {
      textColor: "#FFFFFF",
      subColor: "#FD7676",
      backgroundColor: "#1452AE",
      subBackgroundColor: "#47006880",
    },
    {
      textColor: "#2D4059",
      subColor: "#EA5455",
      backgroundColor: "#F07B3F",
      subBackgroundColor: "#FFD46080",
    },
    {
      textColor: "#000000",
      subColor: "#A2D5F2",
      backgroundColor: "#07689F",
      subBackgroundColor: "#40A8C480",
    },
    {
      textColor: "#FFFFFF",
      subColor: "#C3B299",
      backgroundColor: "#2C2C54",
      subBackgroundColor: "#FFC93C80",
    },
    {
      textColor: "#F0F5F9",
      subColor: "#3EC1D3",
      backgroundColor: "#283149",
      subBackgroundColor: "#404B6980",
    },
    {
      textColor: "#333333",
      subColor: "#FFB677",
      backgroundColor: "#FF8360",
      subBackgroundColor: "#E8E9F380",
    },
    {
      textColor: "#F6F6F6",
      subColor: "#FFD31D",
      backgroundColor: "#00203F",
      subBackgroundColor: "#ADEFD180",
    },
    {
      textColor: "#222831",
      subColor: "#FFD369",
      backgroundColor: "#393E46",
      subBackgroundColor: "#EEEEEE80",
    },
    {
      textColor: "#EFEFEF",
      subColor: "#FF2E63",
      backgroundColor: "#252A34",
      subBackgroundColor: "#08D9D680",
    },
    {
      textColor: "#FFFFFF",
      subColor: "#EAFFD0",
      backgroundColor: "#D65A31",
      subBackgroundColor: "#33333380",
    },
    {
      textColor: "#E4F9F5",
      subColor: "#30E3CA",
      backgroundColor: "#11999E",
      subBackgroundColor: "#40514E80",
    },
    {
      textColor: "#F0F0F0",
      subColor: "#F38181",
      backgroundColor: "#4E4E50",
      subBackgroundColor: "#FCE38A80",
    },
    {
      textColor: "#2B2E4A",
      subColor: "#903749",
      backgroundColor: "#53354A",
      subBackgroundColor: "#E8454580",
    },
    {
      textColor: "#2C3E50",
      subColor: "#BDC3C7",
      backgroundColor: "#2980B9",
      subBackgroundColor: "#95A5A680",
    },
    {
      textColor: "#F4A261",
      subColor: "#2A9D8F",
      backgroundColor: "#264653",
      subBackgroundColor: "#E76F5180",
    },
    {
      textColor: "#F2F2F2",
      subColor: "#DBEDF3",
      backgroundColor: "#112D4E",
      subBackgroundColor: "#3F72AF80",
    },
    {
      textColor: "#EEEEEE",
      subColor: "#F67280",
      backgroundColor: "#6C5B7B",
      subBackgroundColor: "#C06C8480",
    },
    {
      textColor: "#404E4D",
      subColor: "#C7F9CC",
      backgroundColor: "#2B580C",
      subBackgroundColor: "#A3DE8366",
    },
    {
      textColor: "#D9BF77",
      subColor: "#7B1FA2",
      backgroundColor: "#311B92",
      subBackgroundColor: "#B388FF66",
    },
    {
      textColor: "#FFFFFF",
      subColor: "#FC5185",
      backgroundColor: "#364F6B",
      subBackgroundColor: "#43DDE680",
    },
  ];

  //   Bold and Bright: #1, #3, #10
  // Cool and Clean: #5, #9, #16
  // Warm and Friendly: #2, #6, #14
  // Modern and Minimal: #12, #17, #20
}
