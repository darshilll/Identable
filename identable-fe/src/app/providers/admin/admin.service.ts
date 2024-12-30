import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  getJobRequestList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.admin + 'getJobRequestList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getUserList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.admin + 'getUserList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  restartJobRequest = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.admin + 'restartJobRequest';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
