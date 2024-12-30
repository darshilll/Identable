import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  commonPrompt = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'commonPrompt';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  editPostContent = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'editPostPrompt';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateDIYPostPrompt = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'generateDIYPostPrompt';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  uploadFile = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'uploadFile';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  contentMarked = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'contentMarked';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  contentAnalyze = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'contentAnalyze';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  contentHumanize = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'contentHumanize';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getLinkPreview = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'getLinkPreview';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getMediaList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.general + 'getMediaList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

}
