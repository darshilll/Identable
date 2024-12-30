import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  getPostList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getPostList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getDashboardData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getDashboardData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCampaignData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getCampaignData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getPostContentList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getAllPostList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAgeGenderData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getAgeGenderData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getTopPerformingPostList = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.dashboard + 'getTopPerformingPostList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getPostReach = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getPostReach';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAudienceData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getAudienceData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getEngagementData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getEngagementData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getOverviewData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getOverviewData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getIndutryData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getIndutryData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getMapData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getMapData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getEngagementHoursData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.dashboard + 'getEngagementHourData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getSocialSellingIndexData = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.dashboard + 'getSocialSellingIndexData';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
