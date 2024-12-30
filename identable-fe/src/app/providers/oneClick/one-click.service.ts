import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';
@Injectable({
  providedIn: 'root',
})
export class OneClickService {
  baseUrl = environment.baseUrl;
  constructor(private _commonFunction: CommonFunctionsService) {}

  getOneClickSchedule = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'getOneClickSchedule';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateOneClick = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'generateOneClick';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCampaignGoalSuggestion = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.oneClick + 'getCampaignGoalSuggestion';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getTopicSuggestion = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'getTopicSuggestion';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  createCampaign = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'createCampaign';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getOneClickCampaignList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'getOneClickCampaignList';
    return this._commonFunction.globalPostService(endpoint, data);
  };
  
  getCampaignSchedule = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'getCampaignSchedule';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  createCampaignSchedule = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'createCampaignSchedule';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCampaignPosts = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'getCampaignPosts';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCampaignBoostCredit = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'getCampaignBoostCredit';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  activeCampaignBoosting = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.oneClick + 'activeCampaignBoosting';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
