import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';

@Injectable({
  providedIn: 'root'
})
export class AiVideoService {
  baseUrl = environment.baseUrl;
  
  constructor(private _commonFunction: CommonFunctionsService) { }

  genratedAiVideo = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aivideo + 'genratedVideo';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getVideoList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aivideo + 'getVideoList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getAudioList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aivideo + 'getAudioList';
    return this._commonFunction.globalPostService(endpoint, data);
  };  

  aiVideoDelete = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.aivideo + 'aiVideoDelete';
    return this._commonFunction.globalPostService(endpoint, data);
  };

}
