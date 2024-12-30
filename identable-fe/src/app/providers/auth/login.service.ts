import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  // Linkedin Login Services

  accessLinkedinLogin = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + 'auth/login';
    return this.http.post(endpoint, moreData).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

}
