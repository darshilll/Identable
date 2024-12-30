import { Injectable } from '@angular/core';
import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';

//UTILS
import { designControl } from '../../../../utils/carousel-control/design-control';

@Injectable({
  providedIn: 'root',
})
export class CarouselTemplatesService {
  constructor() {}

  private templates = [
    {
      templateId: 'template1',
      name: 'template 1',

      isBoxBg: false,

      isBrandKit: false,

      // Design Setting
      layout: 'center',
      bgPattern: 'assets/images/carousels-v2/bg-pattern-5.png',
      bgPatternOpacity: 10,

      // Color Setting
      textColor: '#fff',
      subColor: '#FD7676',
      backgroundColor: '#1452AE',
      subBackgroundColor: '#1452AE',
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: 'Playfair Display / Poppins',
      
      titlefont: 'Playfair Display',
      descriptionFont: 'Poppins',

      titlefontSize: '44px',
      descriptionFontSize: '16px',

      // CTA Settings
      isQRvisible: false,
      QRtext: '',
      actionBtnText: designControl?.defaultSlideBtnText,

      isSwipeBtnText: designControl?.defaultSwipeBtnText,
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: '',
      profileHandle: '',

      // Background Image
      isAigenratedBgImage: false,
      isBgImage: true,
      backgroundImage: 'assets/images/carousels-v2/theme-1/slide-bg.png',

      thumbnailImage: 'assets/images/carousels-v2/theme-1/slide-1.png',
      previewImage: [
        'assets/images/carousels-v2/theme-1/slide-1.png',
        'assets/images/carousels-v2/theme-1/slide-2.png',
        'assets/images/carousels-v2/theme-1/slide-3.png',
        'assets/images/carousels-v2/theme-1/slide-4.png',
      ],

      slides: [
        {
          type: 'starting_slide',
          content: {
            sub_heading: 'Your amazing subtitle goes here',
            heading: 'Amazing Catchy Title Goes Right Here!',
            description: 'Your amazing description goes here.',
          },
          isSldieVisible: true,
          showTitle: true,
          showSubTitle: true,
          showDescription: true,
          showImage: false,
          showProfileShot: true,
          contentImage: '',
        },
        {
          type: 'body_slide',
          content: {
            heading: 'Amazing Body Catchy Title Goes Right Here!',
            description: 'Your amazing description goes here.',
          },
          isSldieVisible: true,
          showTitle: true,
          showSubTitle: true,
          showDescription: true,
          showImage: false,
          showProfileShot: true,
          contentImage: '',
        },
        {
          type: 'ending_slide',
          content: {
            heading: 'Your amazing Catchy Title Goes Right Here!',
            description: 'Your amazing description goes here.',
            cta_button: 'Call To Action',
          },
          isSldieVisible: true,
          showTitle: true,
          showSubTitle: true,
          showDescription: true,
          showImage: false,
          showProfileShot: true,
          contentImage: '',
        },
      ],
    },
    {
      templateId: 'template2',
      name: 'template 2',

      isBoxBg: false,
      isBrandKit: false,

      // Design Setting
      layout: 'left',
      bgPattern: 'assets/images/carousels-v2/bg-pattern-2.png',
      bgPatternOpacity: 10,

      // Color Setting
      textColor: '#FFFFFF',
      subColor: '#FD7676',
      backgroundColor: '#1452AE',
      subBackgroundColor: '#1452AE',
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: 'Bebas Neue / Play',
      
      titlefont: 'Bebas Neue',
      descriptionFont: 'Play',

      titlefontSize: '44px',
      descriptionFontSize: '16px',

      // CTA Settings
      isQRvisible: false,
      QRtext: '',
      actionBtnText: designControl?.defaultSlideBtnText,

      isSwipeBtnText: designControl?.defaultSwipeBtnText,
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: '',
      profileHandle: '',

      // Background Image
      backgroundImage: 'assets/images/carousels-v2/theme-2/slide-bg.png',
      isBgImage: false,

      thumbnailImage: 'assets/images/carousels-v2/theme-2/slide-1.png',
      previewImage: [
        'assets/images/carousels-v2/theme-2/slide-1.png',
        'assets/images/carousels-v2/theme-2/slide-2.png',
        'assets/images/carousels-v2/theme-2/slide-3.png',
        'assets/images/carousels-v2/theme-2/slide-4.png',
      ],
      slides: [],
    },
    {
      templateId: 'template3',
      name: 'template 3',
      oddeven: false,

      isBoxBg: true,
      isBrandKit: false,

      // Design Setting
      layout: 'center',
      bgPattern: 'assets/images/carousels-v2/bg-pattern-2.png',
      bgPatternOpacity: 10,

      // Color Setting
      textColor: '#FFFFFF',
      subColor: '#FD7676',
      backgroundColor: '#1452AE',
      subBackgroundColor: '#47006880',
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: 'PT Serif / Play',

      titlefont: 'PT Serif',
      descriptionFont: 'Play',

      titlefontSize: '44px',
      descriptionFontSize: '16px',

      // CTA Settings
      isQRvisible: false,
      QRtext: '',
      actionBtnText: designControl?.defaultSlideBtnText,

      isSwipeBtnText: designControl?.defaultSwipeBtnText,
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: '',
      profileHandle: '',

      // Background Image
      backgroundImage: 'assets/images/carousels-v2/theme-3/slide-bg.png',
      isBgImage: true,

      thumbnailImage: 'assets/images/carousels-v2/theme-3/slide-1.png',
      previewImage: [
        'assets/images/carousels-v2/theme-3/slide-1.png',
        'assets/images/carousels-v2/theme-3/slide-2.png',
        'assets/images/carousels-v2/theme-3/slide-3.png',
        'assets/images/carousels-v2/theme-3/slide-4.png',
      ],
      slides: [],
    },
    {
      templateId: 'template4',
      name: 'template 4',

      isBoxBg: true,
      isBrandKit: false,

      // Design Setting
      layout: 'upparLeft',
      bgPattern: 'assets/images/carousels-v2/bg-pattern-2.png',
      bgPatternOpacity: 10,

      // Color Setting
      textColor: '#FFFFFF',
      subColor: '#FD7676',
      backgroundColor: '#1452AE',
      subBackgroundColor: '#47006880',
      isColorBrandKit: false,

      // font family
      pairFont: true,
      fontPair: 'PT Sans Narrow / Inter',

      titlefont: 'PT Sans Narrow',
      descriptionFont: 'Inter',

      titlefontSize: '44px',
      descriptionFontSize: '16px',

      // CTA Settings
      isQRvisible: false,
      QRtext: '',
      actionBtnText: designControl?.defaultSlideBtnText,

      isSwipeBtnText: designControl?.defaultSwipeBtnText,
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,

      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: '',
      profileHandle: '',

      // Background Image
      backgroundImage: 'assets/images/carousels-v2/theme-4/slide-bg.png',
      isBgImage: true,

      thumbnailImage: 'assets/images/carousels-v2/theme-4/slide-1.png',
      previewImage: [
        'assets/images/carousels-v2/theme-4/slide-1.png',
        'assets/images/carousels-v2/theme-4/slide-2.png',
        'assets/images/carousels-v2/theme-4/slide-3.png',
        'assets/images/carousels-v2/theme-4/slide-4.png',
      ],
      slides: [],
    },
    {
      templateId: 'template5',
      name: 'template 5',

      isBoxBg: true,
      isBrandKit: false,

      // Design Setting
      layout: 'upparLeft',
      bgPattern: 'assets/images/carousels-v2/bg-pattern-2.png',
      bgPatternOpacity: 10,

      // Color Setting
      textColor: '#FFFFFF',
      subColor: '#FD7676',
      backgroundColor: '#1452AE',
      subBackgroundColor: '#47006880',
      isColorBrandKit: false,
      
      // font family
      pairFont: true,
      fontPair: 'Dancing Script / Sora',

      titlefont: 'Dancing Script',
      descriptionFont: 'Sora',

      titlefontSize: '44px',
      descriptionFontSize: '16px',

      // CTA Settings
      isQRvisible: false,
      QRtext: '',
      actionBtnText: designControl?.defaultSlideBtnText,

      isSwipeBtnText: designControl?.defaultSwipeBtnText,
      isSwipeBtnvisible: false,
      isBookMarkvisible: false,
      
      // Profile Shots
      isProfileAvtarVisible: true,
      isProfileBrandKit: false,
      isHandleVisible: true,
      profileAvtar: '',
      profileHandle: '',

      // Background Image
      backgroundImage: 'assets/images/carousels-v2/theme-5/slide-bg.png',
      isBgImage: true,

      thumbnailImage: 'assets/images/carousels-v2/theme-5/slide-1.png',
      previewImage: [
        'assets/images/carousels-v2/theme-5/slide-1.png',
        'assets/images/carousels-v2/theme-5/slide-2.png',
        'assets/images/carousels-v2/theme-5/slide-3.png',
        'assets/images/carousels-v2/theme-5/slide-4.png',
      ],
      slides: [],
    },
  ];

  getAllTemplate() {
    return this.templates;
  }

  // Method to find a template by ID and generate slides

  getTemplateById(templateId: string) {
    let slides: any[] = [];

    // Find the template by ID
    const template = this.templates.find((t) => t.templateId === templateId);

    if (!template) {
      console.error('Template not found!');
      return null; // Return null if template not found
    }

    // Add starting slide
    const startingSlide = template.slides.find(
      (slide) => slide.type === 'starting_slide'
    );
    if (startingSlide) {
      slides.push({ ...startingSlide });
    } else {
      console.error('Starting slide not found!');
    }

    // Find the base body slide
    const baseBodySlide = template.slides.find(
      (slide) => slide.type === 'body_slide'
    );
    if (!baseBodySlide) {
      console.error('Body slide not found!');
      return { ...template, slides }; // Return the template with slides so far if no body slide found
    }

    // Add the number of body slides as requested (minus 2 for starting and ending slides)
    const numberOfBodySlides = 7 - 2;
    for (let i = 0; i < numberOfBodySlides; i++) {
      slides.push({
        ...baseBodySlide,
      });
    }

    // Add ending slide
    const endingSlide = template.slides.find(
      (slide) => slide.type === 'ending_slide'
    );
    if (endingSlide) {
      slides.push({ ...endingSlide });
    } else {
      console.error('Ending slide not found!');
    }

    // Assign alternating background colors to all slides
    if (template?.isBgImage) {
      slides.forEach((slide) => {
        slide.backgroundImage = template.backgroundImage;
        slide.backgroundColor = template.backgroundColor;
        slide.subBackgroundColor = template.subBackgroundColor;
        slide.textColor = template.textColor;
        slide.subColor = template.subColor;
      });
    } else {
      slides.forEach((slide) => {
        slide.backgroundImage = '';
        slide.backgroundColor = template.backgroundColor;
        slide.subBackgroundColor = template.subBackgroundColor;
        slide.textColor = template.textColor;
        slide.subColor = template.subColor;
      });
    }

    // Return the complete template object with slides

    return {
      ...template,
      slides,
    };
  }

  updateSettingByTemplateId(
    templateData: any,
    templateId: string,
    slideData: any[]
  ) {
    console.log('slideData', slideData);
    let slides: any[] = slideData;

    // Find the template by ID
    const template = templateData;

    if (!template) {
      console.error('Template not found!');
      return slides; // Return empty array if template not found
    }

    // Add starting slide
    // const startingSlide = slideData.find(
    //   (slide) => slide.type === 'starting_slide'
    // );
    // if (startingSlide) {
    //   slides.push({ ...startingSlide });
    // } else {
    //   console.error('Starting slide not found!');
    // }

    // Find the base body slide
    // const baseBodySlide = slideData.find(
    //   (slide) => slide.type === 'body_slide'
    // );
    // if (!baseBodySlide) {
    //   console.error('Body slide not found!');
    //   return { ...template, slides };
    // }

    // Add the number of body slides as requested (minus 2 for starting and ending slides)
    // const bodySlidesCount = slideData.filter((slide) => slide.type === 'body_slide').length;
    // for (let i = 0; i < bodySlidesCount; i++) {
    //   slides.push({
    //     ...baseBodySlide,
    //   });
    // }

    // Add ending slide
    // const endingSlide = slideData.find(
    //   (slide) => slide.type === 'ending_slide'
    // );
    // if (endingSlide) {
    //   slides.push({ ...endingSlide });
    // } else {
    //   console.error('Ending slide not found!');
    // }

    // Assign alternating background colors to all slides

    if (template?.isBgImage) {
      slides.forEach((slide, index) => {
        slide.backgroundImage = template.backgroundImage;
        slide.backgroundColor = template.backgroundColor;
        slide.backgroundGradients = template.backgroundGradients;
        slide.subBackgroundColor = template.subBackgroundColor;
        slide.textColor = template.textColor;
        slide.subColor = template.subColor;
      });
    } else {
      slides.forEach((slide, index) => {
        slide.backgroundImage = '';
        slide.backgroundColor = template.backgroundColor;
        slide.backgroundGradients = template.backgroundGradients;
        slide.subBackgroundColor = template.subBackgroundColor;
        slide.textColor = template.textColor;
        slide.subColor = template.subColor;
      });
    }

    // Return the complete template object with slides
    return {
      ...template,
      slides,
    };
  }

  isExistingContentByTemplate(
    templateData: any,
    slideData: any[],
    content: any[]
  ) {
    let slides: any[] = slideData;

    // Find the template by ID
    const template = templateData;

    if (!template) {
      console.error('Template not found!');
      return slides; // Return empty array if template not found
    }

    // Assign alternating background colors to all slides

    if (template?.isBgImage) {
      slides.forEach((slide, index) => {
        slide.backgroundImage = template.backgroundImage;
        slide.backgroundColor = template.backgroundColor;
        (slide.subBackgroundColor = template.isBoxBg
          ? template.subBackgroundColor + '8c'
          : template.subBackgroundColor),
          (slide.textColor = template.textColor);
        slide.subColor = template.subColor;
      });
    } else {
      slides.forEach((slide, index) => {
        slide.backgroundImage = '';
        slide.backgroundColor = template.backgroundColor;
        (slide.subBackgroundColor = template.isBoxBg
          ? template.subBackgroundColor + '8c'
          : template.subBackgroundColor),
          (slide.textColor = template.textColor);
        slide.subColor = template.subColor;
      });
    }

    // Return the complete template object with slides
    return {
      ...template,
      slides,
    };
  }
}
