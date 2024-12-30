import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, retryWhen, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { AuthService } from './providers/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from './providers/loader-service/loader.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private retryCount = 2;
  private retryWaitMilliSeconds = 1000;
  private retryStatus = 504;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    // private _bugsnagService: BugsnagService,
    private _loaderService: LoaderService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      !request.url.includes('index.php?Api') &&
      !request.url.includes('account/show?email=') &&
      !request.url.includes('https://api.pexels.com')
    ) {
      let token = localStorage.getItem('token');
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: token,
          },
        });
      }
    }

    return next.handle(request).pipe(
      tap((evt) => {
        if (evt instanceof HttpResponse) {
          const timezoneOffset = evt.headers.get('x-user-timezone');
          if (timezoneOffset) {
            localStorage.setItem('timezoneOffset', timezoneOffset);
          }
        }
      }),

      retryWhen((error) =>
        error.pipe(
          concatMap((error, count) => {
            if (count < this.retryCount && error.status === this.retryStatus) {
              return of(error);
            }
            return throwError(error);
          }),
          delay(this.retryWaitMilliSeconds),
          tap((err) => console.log('Retrying...'))
        )
      ),

      catchError((error, caught) => {
        if (error.error?.message !== 'You were logged out due to inactivity') {
          const obj = {
            body: request.body,
            error: error?.error,
            message: error.error?.message,
          };

          // this._bugsnagService.upload(obj, 'error');
        }

        this.toastrService.clear();
        this._loaderService.stop();
        if (error instanceof HttpErrorResponse) {
          if (
            error.error?.message === 'Session Expired.' ||
            error?.error?.message === 'Authorization not found!'
          ) {
            localStorage.clear();
            this.dialog.closeAll();
            // this.router.navigate(['/auth/login']);
            window.location.href = '/auth/login';
          } else if (error.status == 406) {
            if (error.error?.message === 'Subscription expired.') {
              window.location.href = '/subscription';
            } else if (
              error.error?.message === 'Account settings not updated.'
            ) {
              window.location.href = '/account-setting';
            } else if (error.error?.message === 'Integration expired.') {
              window.location.href = '/account-setting';
            }

            // this.router.navigate([`/permission-denied`], {});
          }
        }
        return throwError(error);
      })
    );
  }
}
