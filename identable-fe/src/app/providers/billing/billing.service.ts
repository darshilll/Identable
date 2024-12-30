import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  checkoutSession = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.billing + 'checkoutSession';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  addCard = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.billing + 'add';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateCard = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.billing + 'update';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  setDefultCard = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.billing + 'setDefult';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  deleteCard = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.billing + 'delete';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  cardList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.billing + 'list';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  manageSubscription = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.billing + 'manageSubscription';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  buyCredit = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.billing + 'buyCredit';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
