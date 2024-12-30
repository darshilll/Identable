import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// SERVICES
import { HttpCancelService } from 'src/app/providers/http-cancel/http-cancel.service';

@Injectable()
export class HttpCancelInterceptor implements HttpInterceptor {
  constructor(private _httpCancelService: HttpCancelService) {}

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    return next
      .handle(req)
      .pipe(takeUntil(this._httpCancelService.onCancelPendingRequests()));
  }
}
