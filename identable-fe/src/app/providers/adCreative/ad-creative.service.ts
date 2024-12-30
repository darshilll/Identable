import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';
@Injectable({
  providedIn: 'root',
})
export class AdCreativeService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  generateCreative = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.adCreative + 'generateCreative';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAdCreativeTemplates = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.adCreative + 'getAdCreativeTemplates';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getPresetAdCreativeTemplate = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.adCreative + 'getPresetAdCreativeTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  saveTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.adCreative + 'saveTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.adCreative + 'updateTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  deleteTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.adCreative + 'deleteTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAllTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.adCreative + 'getAllTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getTemplate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.adCreative + 'getTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateTitle = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.adCreative + 'updateTitle';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateAdCreativeContent = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.adCreative + 'generateAdCreativeContent';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getvisualCreativesTemplate = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.adCreative + 'getvisualCreativesTemplate';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
