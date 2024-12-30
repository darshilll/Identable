import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root',
})
export class BrandKitService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  save = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.brandKit + 'save';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  list = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.brandKit + 'list';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  update = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.brandKit + 'update';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  delete = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.brandKit + 'update';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
