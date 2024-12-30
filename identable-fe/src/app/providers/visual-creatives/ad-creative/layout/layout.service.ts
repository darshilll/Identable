import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor() { }

  private layoutDesign = [ 
    {
      adType: 'Square Ad (Instagram/Facebook)',
      layoutType: 'Circle Ad layout',
      layouts: [
        {
          type: 'square-top-left-layout',
          image: 'assets/images/ad-creative/layout/square-layout-1.png',
          isActive: true,
          width: 80,
        },
        {
          type: 'square-top-right-layout',
          image: 'assets/images/ad-creative/layout/square-layout-2.png',
          isActive: false,
          width: 80,
        },        
      ]
    },
    {
      adType: 'Square Ad (Instagram/Facebook)',
      layoutType: 'Square Ad layout',
      layouts: [
        {
          type: 'square-bottom-left-layout',
          image: 'assets/images/ad-creative/layout/square-layout-3.png',
          isActive: true,
          width: 80,
        },
        {
          type: 'square-bottom-right-layout',
          image: 'assets/images/ad-creative/layout/square-layout-4.png',
          isActive: false,
          width: 80,
        },             
      ]
    },
    {
      adType: 'Instagram/Facebook Story Ad',
      layoutType: 'Circle Story Ad layout',
      layouts: [
        {
          type: 'stroy-square-line-bottom-layout',
          image: 'assets/images/ad-creative/layout/stroy-layout-1.png',
          isActive: true,
          width: 58,
        },
        {
          type: 'stroy-round-line-top-layout',
          image: 'assets/images/ad-creative/layout/stroy-layout-2.png',
          isActive: false,
          width: 58,
        },
        {
          type: 'stroy-round-line-bottom-layout',
          image: 'assets/images/ad-creative/layout/stroy-layout-3.png',
          isActive: false,
          width: 58,
        },              
      ]
    },
    {
      adType: 'Instagram Post',
      layoutType: 'Sqaure Instagram Post layout',
      layouts: [
        {
          type: 'post-semi-sqaure-bottom-layout',
          image: 'assets/images/ad-creative/layout/semi-sqaure-layout-1.png',
          isActive: true,
          width: 68,
        },
        {
          type: 'post-semi-sqaure-top-layout',
          image: 'assets/images/ad-creative/layout/semi-sqaure-layout-2.png',
          isActive: false,
          width: 68,
        },
        // {
        //   type: 'semi-sqaure-layout-3',
        //   image: 'assets/images/ad-creative/layout/semi-sqaure-layout-3.png',
        //   isActive: false,
        //   width: 68,
        // },              
      ]
    }
  ]

  // Method to find a template by ID and generate slides

  getLayoutByType(templateData:any) { 

    // Find the template by ID
    const template = this.layoutDesign.find((t) => t.adType === templateData.type && t.layoutType === templateData.layoutType);

    if (!template) {
      console.error('Layput not found!');
      return null; // Return null if template not found
    }

    return template;
  }

}
