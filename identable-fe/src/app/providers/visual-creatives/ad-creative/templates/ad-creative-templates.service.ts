import { Injectable } from '@angular/core';

//UTILS
import { designControl } from '../../../../utils/carousel-control/design-control';

@Injectable({
  providedIn: 'root'
})
export class AdCreativeTemplatesService {

  constructor() { }

  private templates = [
    {
      templateId: 'template1',
      type: 'Square Ad (Instagram/Facebook)',
      platform: ['instagram', 'facebook'],
      previewImage: 'assets/images/ad-creative/templates/square-ad-1.png',

      isBrandKit: false,
      isColorBrandKit: false,

      // Layer Visual Settings
      showSubTitle: true,
      showTitle: true,
      showDescription: true,
      showImage: true,
      showCTA: true,
      
      // Design Setting
      layout: 'square-top-left-layout',
      layoutType: 'Circle Ad layout',

      logoUrl: 'assets/images/avatar/avatar.png',
      islogoBrandKit: false,
      logoBackgroundColor: '#F7F8F9',
      logoBackgroundOpacity: 20,
      
      // CTA Settings      
      actionBtnText: designControl?.defaultSlideBtnText,
      
      // font family
      pairFont  : true,
      fontPair  : 'Playfair Display / Poppins',

      titlefont : 'Poppins',
      descriptionFont: 'Roboto',

      titlefontSize: '21px',
      descriptionFontSize: '10px',

      // Color Setting
      textColor: '#fff',
      subColor: '#72ADFF',
      backgroundColor: '#5867FA',
      subBackgroundColor: '#E75223',
      
      // Template content
      content: {
        subtitle: 'Your amazing subtitle goes here',
        title: 'Amazing Catchy Title Goes Right Here!',
        description: 'Your amazing description goes here.',
        contentImage: 'https://skfhtbmyanoeqbvrtxqa.supabase.co/storage/v1/object/public/media/premium-images/gradients/gradient-1.jpg',
      }      
    },
    {
      templateId: 'template2',
      type: 'Square Ad (Instagram/Facebook)',
      platform: ['instagram', 'facebook'],
      previewImage: 'assets/images/ad-creative/templates/square-ad-2.png',

      isBrandKit: false,
      isColorBrandKit: false,

      // Layer Visual Settings
      showSubTitle: true,
      showTitle: true,
      showDescription: true,
      showImage: true,
      showCTA: true,
      
      // Design Setting
      layout: 'square-bottom-left-layout',
      layoutType: 'Square Ad layout',
      
      logoUrl: 'assets/images/avatar/avatar.png',
      islogoBrandKit: false,
      logoBackgroundColor: '#fff',
      logoBackgroundOpacity: 20,
      
      // CTA Settings      
      actionBtnText: designControl?.defaultSlideBtnText,
      
      // font family
      pairFont  : true,
      fontPair  : 'Playfair Display / Poppins',

      titlefont : 'Poppins',
      descriptionFont: 'Roboto',

      titlefontSize: '21px',
      descriptionFontSize: '10px',

      // Color Setting
      textColor: '#13199F',
      subColor: '#020054',
      backgroundColor: '#C3CDFF',
      subBackgroundColor: '#FFFFFF',

      // Template content
      content: {        
      } 

    },
    {
      templateId: 'template3',
      type: 'Square Ad (Instagram/Facebook)',
      platform: ['instagram', 'facebook'],
      previewImage: 'assets/images/ad-creative/templates/square-ad-3.png',

      isBrandKit: false,
      isColorBrandKit: false,

      // Layer Visual Settings
      showSubTitle: true,
      showTitle: true,
      showDescription: true,
      showImage: true,
      showCTA: true,
      
      // Design Setting
      layout: 'square-bottom-right-layout',
      layoutType: 'Square Ad layout',

      logoUrl: 'assets/images/avatar/avatar.png',
      islogoBrandKit: false,
      logoBackgroundColor: '#fff',
      logoBackgroundOpacity: 20,
      
      // CTA Settings      
      actionBtnText: designControl?.defaultSlideBtnText,
      
      // font family
      pairFont  : true,
      fontPair  : 'Playfair Display / Poppins',

      titlefont : 'Poppins',
      descriptionFont: 'Roboto',

      titlefontSize: '21px',
      descriptionFontSize: '10px',

      // Color Setting
      textColor: '#fff',
      subColor: '#C809BA',
      backgroundColor: '#CD0AB9',
      subBackgroundColor: '#5904C5',

      // Template content
      content: {        
      } 
    },
    {
      templateId: 'template4',
      type: 'Instagram/Facebook Story Ad',
      platform: ['instagram', 'facebook'],
      previewImage: 'assets/images/ad-creative/templates/stroy-1.png',

      isBrandKit: false,
      isColorBrandKit: false,

      // Layer Visual Settings
      showSubTitle: true,
      showTitle: true,
      showDescription: true,
      showImage: true,
      showCTA: true,
      
      // Design Setting
      layout: 'stroy-round-line-top-layout',
      layoutType: 'Circle Story Ad layout',

      logoUrl: 'assets/images/avatar/avatar.png',
      islogoBrandKit: false,
      logoBackgroundColor: '#fff',
      logoBackgroundOpacity: 20,
      
      // CTA Settings      
      actionBtnText: designControl?.defaultSlideBtnText,
      
      // font family
      pairFont  : true,
      fontPair  : 'Playfair Display / Poppins',

      titlefont : 'Poppins',
      descriptionFont: 'Roboto',

      titlefontSize: '21px',
      descriptionFontSize: '10px',

      // Color Setting
      textColor: '#fff',
      subColor: '#F66363',
      backgroundColor: '#0C66E4',
      subBackgroundColor: '#00F527',

      // Template content
      content: {        
      } 
    },
    {
      templateId: 'template5',
      type: 'Instagram/Facebook Story Ad',
      platform: ['instagram', 'facebook'],
      previewImage: 'assets/images/ad-creative/templates/stroy-2.png',

      isBrandKit: false,
      isColorBrandKit: false,

      // Layer Visual Settings
      showSubTitle: true,
      showTitle: true,
      showDescription: true,
      showImage: true,
      showCTA: true,
      
      // Design Setting
      layout: 'stroy-square-line-bottom-layout',
      layoutType: 'Circle Story Ad layout',

      logoUrl: 'assets/images/avatar/avatar.png',
      islogoBrandKit: false,
      logoBackgroundColor: '#fff',
      logoBackgroundOpacity: 20,
      
      // CTA Settings      
      actionBtnText: designControl?.defaultSlideBtnText,
      
      // font family
      pairFont  : true,
      fontPair  : 'Playfair Display / Poppins',

      titlefont : 'Poppins',
      descriptionFont: 'Roboto',

      titlefontSize: '21px',
      descriptionFontSize: '10px',

      // Color Setting
      textColor: '#fff',
      subColor: '#7000FF',
      backgroundColor: '#E9D83F',
      subBackgroundColor: '#7065EF',

      // Template content
      content: {        
      } 
    },
    {
      templateId: 'template6',
      type: 'Instagram Post',
      platform: ['instagram'],
      previewImage: 'assets/images/ad-creative/templates/semi-sqaure-1.png',

      isBrandKit: false,
      isColorBrandKit: false,

      // Layer Visual Settings
      showSubTitle: true,
      showTitle: true,
      showDescription: true,
      showImage: true,
      showCTA: true,
      
      // Design Setting
      layout: 'post-semi-sqaure-bottom-layout',
      layoutType: 'Sqaure Instagram Post layout',

      logoUrl: 'assets/images/avatar/avatar.png',
      islogoBrandKit: false,
      logoBackgroundColor: '#fff',
      logoBackgroundOpacity: 20,
      
      // CTA Settings      
      actionBtnText: designControl?.defaultSlideBtnText,
      
      // font family
      pairFont  : true,
      fontPair  : 'Playfair Display / Poppins',

      titlefont : 'Poppins',
      descriptionFont: 'Roboto',

      titlefontSize: '21px',
      descriptionFontSize: '10px',

      // Color Setting
      textColor: '#fff',
      subColor: '#D78100',
      backgroundColor: '#5867FA',
      subBackgroundColor: '#C023E7',

      // Template content
      content: {        
      } 
    },
    {
      templateId: 'template7',
      type: 'Instagram Post',
      platform: ['instagram'],
      previewImage: 'assets/images/ad-creative/templates/semi-sqaure-2.png',

      isBrandKit: false,
      isColorBrandKit: false,
      
      // Layer Visual Settings
      showSubTitle: true,
      showTitle: true,
      showDescription: true,
      showImage: true,
      showCTA: true,
      
      // Design Setting
      layout: 'post-semi-sqaure-bottom-layout',
      layoutType: 'Sqaure Instagram Post layout',
      
      logoUrl: 'assets/images/avatar/avatar.png',
      islogoBrandKit: false,
      logoBackgroundColor: '#fff',
      logoBackgroundOpacity: 20,
      
      // CTA Settings      
      actionBtnText: designControl?.defaultSlideBtnText,
      
      // font family
      pairFont  : true,
      fontPair  : 'Playfair Display / Poppins',

      titlefont : 'Poppins',
      descriptionFont: 'Roboto',

      titlefontSize: '21px',
      descriptionFontSize: '10px',

      // Color Setting
      textColor: '#000',
      subColor: '#04828A',
      backgroundColor: '#32E1C2',
      subBackgroundColor: '#ADE2FFCC',

      // Template content
      content: {        
      } 
    }
  ]

  getAllTemplate() {
    return this.templates;
  }

  // Method to find a template by ID and generate slides

  getTemplateById(templateId: string) { 

    // Find the template by ID
    const template = this.templates.find((t) => t.templateId === templateId);

    if (!template) {
      console.error('Template not found!');
      return null; // Return null if template not found
    }

    return template;
  }

  updateSettingByTemplateId(templateData: any, slideData: any) {

    // Find the template by ID
    const template = templateData;
    
    if (!template) {
      console.error('Template not found!');
      return slideData; // Return empty array if template not found
    }

    template.content = slideData;

    return template;
  }

}
