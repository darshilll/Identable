import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { TokenInterceptor } from './token.interceptor';
import { HttpCancelInterceptor } from 'src/app/http-cancel.interceptor';

import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';

import { CalendarModule } from 'primeng/calendar';

import { HttpCancelService } from 'src/app/providers/http-cancel/http-cancel.service';
import { AuthGuard } from './providers/guard/auth.guard';
import { LazyGuard } from './providers/guard/lazy.guard';
import { AuthService } from './providers/auth/auth.service';

@NgModule({
  declarations: [AppComponent, HeaderComponent, SidebarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    CalendarModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: 'increasing',
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCancelInterceptor,
    },
    AuthGuard,
    AuthService,
    LazyGuard,
    HttpCancelService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
