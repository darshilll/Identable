import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
let pexelsUrl = 'https://api.pexels.com/';
@Injectable({
  providedIn: 'root',
})
export class GiphyService {
  private apiKey = environment.giphyApiKey;

  constructor(private http: HttpClient) { }

  trendingGifs = (moreData: any): Observable<any> => {
    const endpoint = `https://api.giphy.com/v1/gifs/trending?api_key=${this.apiKey}&limit=50&rating=G`;
    return this.http.get(endpoint).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  searchGifs = (moreData: any): Observable<any> => {
    const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${moreData?.searchQuery}&limit=50&offset=0&rating=G&lang=en`;
    return this.http.get(endpoint).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  // Pixel Api

  fetchtrendingPixelPhoto = (moreData: any): Observable<any> => {
    let endpoint = pexelsUrl + `v1/curated?per_page=50&page=1`;
    if (moreData) {
      endpoint =
        pexelsUrl + 'v1/search?query=' + moreData + '&per_page=50&page=1';
    }
    return this.http.get(endpoint,this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  
  fetchtrendingPopularVideo = (moreData: any): Observable<any> => {
    let endpoint = pexelsUrl + `videos/popular?per_page=20&page=1`;
    if (moreData) {
      endpoint =
        pexelsUrl + 'videos/search?query=' + moreData + '&per_page=20&page=1';
    }
    return this.http.get(endpoint, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  protected getRequestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    let headers;
    headers = new HttpHeaders({
      Authorization: `${environment.pixelApiKey}`,
    });
    return { headers: headers };
  }
}
