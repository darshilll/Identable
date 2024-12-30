import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';
@Injectable({
  providedIn: 'root',
})
export class AiArticleService {
  baseUrl = environment.baseUrl;

  constructor(private _commonFunction: CommonFunctionsService) {}

  generateTopic = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.articleGeneration + 'generateTopic';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateOutlineOutput = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.articleGeneration + 'generateOutlineOutput';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateArticle = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.articleGeneration + 'generateArticle';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
