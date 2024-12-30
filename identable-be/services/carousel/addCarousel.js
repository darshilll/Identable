import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

export const addCarousel = async (entry) => {
  let templates = [
    {
      templateId: "",
      name: "template 1",

      isBoxBg: false,

      isBrandKit: false,

      // Design Setting
      layout: "center",
      bgPattern: "assets/images/carousels-v2/bg-pattern-5.png",
      bgPatternOpacity: 10,

      // Color Setting
      textColor: "#fff",
      subColor: "#FD7676",
      backgroundColor: "#1452AE",
      subBackgroundColor: "#1452AE",
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: "Playfair Display / Poppins",

      titlefont: "Poppins",
      descriptionFont: "Playfair Display",

      titlefontSize: "44px",
      descriptionFontSize: "16px",

      // CTA Settings
      isQRvisible: false,
      QRtext: "",
      actionBtnText: "Call To Action",

      isSwipeBtnText: "Swipe",
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: "",
      profileHandle: "",

      // Background Image
      isAigenratedBgImage: false,
      isBgImage: true,
      backgroundImage: "assets/images/carousels-v2/theme-1/slide-bg.png",

      thumbnailImage: "assets/images/carousels-v2/theme-1/slide-1.png",
      previewImage: [
        "assets/images/carousels-v2/theme-1/slide-1.png",
        "assets/images/carousels-v2/theme-1/slide-2.png",
        "assets/images/carousels-v2/theme-1/slide-3.png",
        "assets/images/carousels-v2/theme-1/slide-4.png",
      ],

      slides: [
        {
          type: "starting_slide",
          content: {
            sub_heading: "Your amazing subtitle goes here",
            heading: "Amazing Catchy Title Goes Right Here!",
            description: "Your amazing description goes here.",
          },
          isSldieVisible: true,
          showTitle: true,
          showSubTitle: true,
          showDescription: true,
          showImage: false,
          showProfileShot: true,
          contentImage: "",
        },
        {
          type: "body_slide",
          content: {
            heading: "Amazing Body Catchy Title Goes Right Here!",
            description: "Your amazing description goes here.",
          },
          isSldieVisible: true,
          showTitle: true,
          showSubTitle: true,
          showDescription: true,
          showImage: false,
          showProfileShot: true,
          contentImage: "",
        },
        {
          type: "ending_slide",
          content: {
            heading: "Your amazing Catchy Title Goes Right Here!",
            description: "Your amazing description goes here.",
            cta_button: "Call To Action",
          },
          isSldieVisible: true,
          showTitle: true,
          showSubTitle: true,
          showDescription: true,
          showImage: false,
          showProfileShot: true,
          contentImage: "",
        },
      ],
    },
    {
      templateId: "template2",
      name: "template 2",

      isBoxBg: false,
      isBrandKit: false,

      // Design Setting
      layout: "left",
      bgPattern: "assets/images/carousels-v2/bg-pattern-2.png",
      bgPatternOpacity: 10,

      // Color Setting
      textColor: "#FFFFFF",
      subColor: "#FD7676",
      backgroundColor: "#1452AE",
      subBackgroundColor: "#1452AE",
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: "Playfair Display / Poppins",

      titlefont: "Poppins",
      descriptionFont: "Playfair Display",

      titlefontSize: "44px",
      descriptionFontSize: "16px",

      // CTA Settings
      isQRvisible: false,
      QRtext: "",
      actionBtnText: "Call To Action",

      isSwipeBtnText: "Swipe",
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: "",
      profileHandle: "",

      // Background Image
      backgroundImage: "assets/images/carousels-v2/theme-2/slide-bg.png",
      isBgImage: false,

      thumbnailImage: "assets/images/carousels-v2/theme-2/slide-1.png",
      previewImage: [
        "assets/images/carousels-v2/theme-2/slide-1.png",
        "assets/images/carousels-v2/theme-2/slide-2.png",
        "assets/images/carousels-v2/theme-2/slide-3.png",
        "assets/images/carousels-v2/theme-2/slide-4.png",
      ],
      slides: [],
    },
    {
      templateId: "template3",
      name: "template 3",
      oddeven: false,

      isBoxBg: true,
      isBrandKit: false,

      // Design Setting
      layout: "center",
      bgPattern: "assets/images/carousels-v2/bg-pattern-2.png",
      bgPatternOpacity: 10,

      // Color Setting
      textColor: "#FFFFFF",
      subColor: "#FD7676",
      backgroundColor: "#1452AE",
      subBackgroundColor: "#47006880",
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: "Bebas Neue / Play",

      titlefont: "Poppins",
      descriptionFont: "Playfair Display",

      titlefontSize: "44px",
      descriptionFontSize: "16px",

      // CTA Settings
      isQRvisible: false,
      QRtext: "",
      actionBtnText: "Call To Action",

      isSwipeBtnText: "Swipe",
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: "",
      profileHandle: "",

      // Background Image
      backgroundImage: "assets/images/carousels-v2/theme-3/slide-bg.png",
      isBgImage: true,

      thumbnailImage: "assets/images/carousels-v2/theme-3/slide-1.png",
      previewImage: [
        "assets/images/carousels-v2/theme-3/slide-1.png",
        "assets/images/carousels-v2/theme-3/slide-2.png",
        "assets/images/carousels-v2/theme-3/slide-3.png",
        "assets/images/carousels-v2/theme-3/slide-4.png",
      ],
      slides: [],
    },
    {
      templateId: "template4",
      name: "template 4",

      isBoxBg: true,
      isBrandKit: false,

      // Design Setting
      layout: "upparLeft",
      bgPattern: "assets/images/carousels-v2/bg-pattern-2.png",
      bgPatternOpacity: 10,

      // Color Setting
      textColor: "#FFFFFF",
      subColor: "#FD7676",
      backgroundColor: "#1452AE",
      subBackgroundColor: "#47006880",
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: "Playfair Display / Poppins",

      titlefont: "Poppins",
      descriptionFont: "Playfair Display",

      titlefontSize: "44px",
      descriptionFontSize: "16px",

      // CTA Settings
      isQRvisible: false,
      QRtext: "",
      actionBtnText: "Call To Action",

      isSwipeBtnText: "Swipe",
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: "",
      profileHandle: "",

      // Background Image
      backgroundImage: "assets/images/carousels-v2/theme-4/slide-bg.png",
      isBgImage: true,

      thumbnailImage: "assets/images/carousels-v2/theme-4/slide-1.png",
      previewImage: [
        "assets/images/carousels-v2/theme-4/slide-1.png",
        "assets/images/carousels-v2/theme-4/slide-2.png",
        "assets/images/carousels-v2/theme-4/slide-3.png",
        "assets/images/carousels-v2/theme-4/slide-4.png",
      ],
      slides: [],
    },
    {
      templateId: "template5",
      name: "template 5",

      isBoxBg: true,
      isBrandKit: false,

      // Design Setting
      layout: "upparLeft",
      bgPattern: "assets/images/carousels-v2/bg-pattern-2.png",
      bgPatternOpacity: 10,

      // Color Setting
      textColor: "#FFFFFF",
      subColor: "#FD7676",
      backgroundColor: "#1452AE",
      subBackgroundColor: "#47006880",
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: "Playfair Display / Poppins",

      titlefont: "Poppins",
      descriptionFont: "Playfair Display",

      titlefontSize: "44px",
      descriptionFontSize: "16px",

      // CTA Settings
      isQRvisible: false,
      QRtext: "",
      actionBtnText: "Call To Action",

      isSwipeBtnText: "Swipe",
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: "",
      profileHandle: "",

      // Background Image
      backgroundImage: "assets/images/carousels-v2/theme-5/slide-bg.png",
      isBgImage: true,

      thumbnailImage: "assets/images/carousels-v2/theme-5/slide-1.png",
      previewImage: [
        "assets/images/carousels-v2/theme-5/slide-1.png",
        "assets/images/carousels-v2/theme-5/slide-2.png",
        "assets/images/carousels-v2/theme-5/slide-3.png",
        "assets/images/carousels-v2/theme-5/slide-4.png",
      ],
      slides: [],
    },
  ];

  for (let i = 0; i < templates?.length; i++) {
    const element = templates[i];

    await dbService.createOneRecord("CarouselModel", {
      carouselSetting: element,
      createdAt: Date.now(),
    });
  }

  return "Carousel saved successfully";
};
