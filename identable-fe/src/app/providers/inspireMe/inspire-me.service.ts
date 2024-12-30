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
export class InspireMeService {

  baseUrl = environment.baseUrl;
  constructor(private _commonFunction: CommonFunctionsService) {}

  getInspireMePost= (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.inspireMe + 'getInspireMe';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
