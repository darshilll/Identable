import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root',
})
export class CrmCampaignService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  getProspectList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getProspectList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  saveCampaign = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'saveCampaign';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  saveCompanyCampaign = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'saveCompanyCampaign';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCampaignInList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getPostList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCampaignData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getCampaignData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCityGroup = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getCityGroup';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getIndustryGroup = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getIndustryGroup';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAgeGroup = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getAgeGroup';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCompanyCampaignData = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getCompanyCampaignData';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  deleteProspect = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'deleteProspect';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateCampaignStatus = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'updateCampaignStatus';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getProcessingCampaign = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getProcessingCampaign';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getCampaignList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getCampaignList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  discoverEmail = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'discoverEmail';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getConnectedList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'getConnectedList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  sendInvitaion = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.crm + 'sendInvitaion';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
