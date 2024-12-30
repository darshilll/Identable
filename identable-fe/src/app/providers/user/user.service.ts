import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  getUserDetails = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'getUserDetails';
    return this._commonFunction.globalGetService(endpoint, data);
  };

  updateProfile = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'updateProfile';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  saveLinkedinCookies = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'saveLinkedinCookies';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getLinkedinPageList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'getLinkedinPageList';
    return this._commonFunction.globalGetService(endpoint, data);
  };

  saveAISetting = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'saveAISetting';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAISetting = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'getAISetting';
    return this._commonFunction.globalGetService(endpoint, data);
  };

  updateAccountSettingFlag = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'updateAccountSettingFlag';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  changeProfile = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'changeProfile';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  savePageAccess = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'savePageAccess';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateProfileSettings = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.user + 'updateProfileSettings';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
