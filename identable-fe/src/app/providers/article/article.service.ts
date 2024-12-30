import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { BaseUrl } from '../../utils/base-url-constants';
import { environment } from 'src/environments/environment';
import { CommonFunctionsService } from 'src/app/utils/common-functions/common-functions.service';
@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  baseUrl = environment.baseUrl;

  constructor(
    private _commonFunction: CommonFunctionsService,
    private http: HttpClient
  ) {}

  getArticleList = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'getArticleList';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  articleRename = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'articleRename';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getArticleGoal = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'getArticleGoal';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  articleDelete = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'articleDelete';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getArticleIdea = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'getArticleIdea';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  regenerateArticleIdea = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'regenerateArticleIdea';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getArticleKeywords = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'getArticleKeywords';
    return this._commonFunction.globalPostService(endpoint, data);
  };
  getArticleHeadline = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'getArticleHeadline';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  regenerateArticleHeadline = (data: any): Observable<any> => {
    const endpoint =
      this.baseUrl + BaseUrl.article + 'regenerateArticleHeadline';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getArticleOutlineOutput = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'getArticleOutlineOutput';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateArticle = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'generateArticle';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  regenerateArticle = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'regenerateArticle';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  updateArticle = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'updateArticle';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getSEOScoreFeedback = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'getSEOScoreFeedback';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateTopic = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'generateTopic';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateSubTopic = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'generateSubTopic';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  getArticleDetails = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'getArticleDetails';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateOutlineSubTopic = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'generateOutlineSubTopic';
    return this._commonFunction.globalPostService(endpoint, data);
  };

  generateBannerImage = (data: any): Observable<any> => {
    const endpoint = this.baseUrl + BaseUrl.article + 'generateBannerImage';
    return this._commonFunction.globalPostService(endpoint, data);
  };
}
