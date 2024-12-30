import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';
@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  getTheme = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'getTheme';
    return this._commonFunction.globalGetService(endpoint, data);
  };

  addTheme = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'addTheme';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateTheme = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'updateTheme';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  deleteTheme = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'deleteTheme/' + data;
    return this._commonFunction.globalDeleteService(endpoint);
  };

  generateCarousel = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'generateCarousel';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCarousel = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'getCarousel';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getPresetCarouselTemplate = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.carousel + 'getPresetCarouselTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  createNewCarousel = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'carouselGenerate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getSaveTemplate() {
    let templates = {
      templateId: 'template2',
      name: 'template 2',

      isBoxBg: false,

      // Design Setting

      layout: 'center',
      bgPattern: 'assets/images/carousels-v2/bg-pattern-5.png',
      bgPatternOpacity: 10,

      // font family
      FontPair: 'Inter',
      Titlefont: 'PT Serif',
      TitlefontSize: '44px',
      descriptionFont: 'Inter',
      descriptionFontSize: '44px',

      slides: [
        {
          type: 'starting_slide',
          content: {
            sub_heading: 'Your amazing subtitle goes here',
            heading: 'Amazing Catchy Title Goes Right Here!',
            description: 'Your amazing description goes here.',
          },
          backgroundImage: '',
          backgroundColor: '#f99',
          subBackgroundColor: '#f99',
          textColor: '#f00',
          subColor: '#f55',
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
            heading: 'Amazing Catchy Title Goes Right Here!',
            description: 'Your amazing description goes here.',
          },
          backgroundImage: '',
          backgroundColor: '#f99',
          subBackgroundColor: '#f99',
          textColor: '#f00',
          subColor: '#f55',
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
            heading: 'Amazing Catchy Title Goes Right Here!',
            description: 'Your amazing description goes here.',
            cta_button: 'Call To Action',
          },
          backgroundImage: '',
          backgroundColor: '#f99',
          subBackgroundColor: '#f99',
          textColor: '#f00',
          subColor: '#f55',
          showTitle: true,
          showSubTitle: true,
          showDescription: true,
          showImage: false,
          showProfileShot: false,
          contentImage: '',
        },
      ],
    };
    return templates;
  }

  saveCustomTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'saveCustomTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateCustomTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'updateCustomTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCustomTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'getCustomTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAllCustomTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'getAllCustomTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateCarouselName = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'updateCarouselName';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  deleteCustomTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'deleteCustomTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  fetchAllTemplates = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'getCarousel';
    return this._commonFunction.globalGetService(endpoint, data);
  };

  generateCarouselContent = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.carousel + 'generateCarouselContent';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateCarouselSlide = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.carousel + 'generateCarouselSlide';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
