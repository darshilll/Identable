import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// LIBRARY
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgOtpInputModule } from 'ng-otp-input';

// MODULE
import { SharedModule } from 'src/app/shared/shared.module';

// COMPONENTS
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ForgetPasswordComponent, VerifyEmailComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HttpClientModule,
    SlickCarouselModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule {}
