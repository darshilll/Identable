import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  socialLogin = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'socialLogin';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  sendOtp = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'sendOtp';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  checkEmail = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'checkEmail';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  signup = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'signup';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  login = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'login';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  verifyOtp = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'verifyOtp';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  forgetPassword = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'forgetPassword';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  verifyResetPasswordLink = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'verifyResetPasswordLink';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updatePassword = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.auth + 'updatePassword';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getToken() {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      return;
    }
  }
}
