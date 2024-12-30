import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseUrl } from '../../utils/base-url-constants';

@Injectable({
  providedIn: 'root',
})
export class StreamingService {
  baseUrl = environment.baseUrl;

  constructor() {}

  generatPostContentPrompt(param: any): Observable<string> {
    const endpoint =
      this.baseUrl + BaseUrl.article + 'generatPostContentPrompt';
    let token: any = localStorage.getItem('token');

    return new Observable((observer) => {
      const urlWithToken = `${endpoint}?token=${encodeURIComponent(
        token
      )}&${this.toQueryString(param)}`;
      const eventSource = new EventSource(urlWithToken);

      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    });
  }

  streamArticle(param: any): Observable<string> {
    const endpoint = this.baseUrl + BaseUrl.article + 'streamArticle';
    let token: any = localStorage.getItem('token');

    return new Observable((observer) => {
      const urlWithToken = `${endpoint}?token=${encodeURIComponent(
        token
      )}&${this.toQueryString(param)}`;
      const eventSource = new EventSource(urlWithToken);

      eventSource.onmessage = (event) => {
        if (event.data === '[Done]') {
          observer.complete();
          eventSource.close();
        } else {
          observer.next(event.data);
        }
      };

      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    });
  }

  toQueryString(obj: any) {
    return Object.keys(obj)
      .map(
        (key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
      )
      .join('&');
  }
}
