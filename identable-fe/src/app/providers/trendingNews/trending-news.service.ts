import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root'
})
export class TrendingNewsService {
  baseUrl = environment.baseUrl;
  constructor(private _commonFunction: CommonFunctionsService) {}

  getTrendingNews = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.trendingNews + 'getTrendingNews';
    return this._commonFunction.globalPostService(endpoint, data);
  };
  
  searchNews = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.trendingNews + 'searchNews';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateSummary = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.trendingNews + 'generateNewsSummary';
    return this._commonFunction.globalPostService(endpoint, data);
  };
  
}
