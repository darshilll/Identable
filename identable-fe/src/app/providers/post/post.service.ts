import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  savePost = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.post + 'savePost';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  reschedulePost = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.post + 'reschedulePost';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getPost = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.post + 'getPost';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  postBoostingActive = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.post + 'activeBoosting';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  deletePost = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.post + 'deletePost';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
