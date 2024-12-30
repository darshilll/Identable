import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AccountSettingService {
  constructor(private http: HttpClient) {}

  getUser = (): Observable<any> => {
    const endpoint = environment.baseUrl + 'user/getUserDetails';
    return this.http.get(endpoint,this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getAiSetting = (): Observable<any> => {
    const endpoint = environment.baseUrl + 'user/getAISetting';
    return this.http.get(endpoint, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getLinkedinPageList = (): Observable<any> => {
    const endpoint = environment.baseUrl + 'user/getLinkedinPageList';
    return this.http.get(endpoint, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateProfile = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + 'user/updateProfile';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateAccountSettingFlag = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + 'user/updateAccountSettingFlag';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  protected getRequestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    let headers;
    const token = localStorage.getItem('token');
    headers = new HttpHeaders({
      Authorization: `${token}`,
    });
    return { headers: headers };
  }
}
