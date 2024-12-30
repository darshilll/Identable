import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root'
})
export class AiImageService {

  baseUrl = environment.baseUrl;
  
  constructor(private _commonFunction: CommonFunctionsService) { }

  getAiImage = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aiImage + 'getAIImage';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateAIImage = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aiImage + 'generateAIImage';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateImage = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aiImage + 'generateImage';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAIImageIdea = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aiImage + 'getAIImageIdea';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAIImagesByDate = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aiImage + 'getAIImagesByDate';
    return this._commonFunction.globalPostService(endpoint, data);
  };
  
}
