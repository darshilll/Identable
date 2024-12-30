import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(private http: HttpClient) { }

  // Fetch Login Linkedin Data
  
  getLinkedinPageList = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + 'user/getLinkedinPageList';
    return this.http.get(endpoint,this.getRequestHeaders()).pipe(
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
