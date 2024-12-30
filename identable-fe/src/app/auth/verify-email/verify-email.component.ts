import { Component } from '@angular/core';
import { Router } from '@angular/router';

// LIBRARY
import { ToastrService } from 'ngx-toastr';

//SERVICES
import { AuthService } from '../../providers/auth/auth.service';
import { LoaderService } from '../../providers/loader-service/loader.service';
import { UserService } from '../../providers/user/user.service';

//UTILS
import { CommonFunctionsService } from '../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../utils/models/error';
import { ResponseModel } from '../../utils/models/response';
import { MessageConstant } from '../../utils/message-constant';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent {

  isOtpSubmited: boolean = false;
  errorMessage: string = "";

  config: any = {
    length: 4,
    allowNumbersOnly: true,
    inputClass: 'otp-input-box',
  };
  otp: any = 0;

  // Assign data
  signUpData: any;
  token: any;

  constructor(
    private loaderService: LoaderService,
    private _authService: AuthService,
    private toastrService: ToastrService,
    public _utilities: CommonFunctionsService,
    private _userService: UserService,
    private router: Router
  ) {
    this.signUpData = this._utilities.signupFormData;
    if(!this.signUpData?.email)
    {
      this.router.navigate(['/auth/signup']);
    }
  }

  onSubmit() {
    if (this.otp.length !== 4) {
      return;
    }
    this.signUp(this.otp);
  }

  signUp(otp: any) {
    let obj = {
      ...this.signUpData,
      otp: otp,
    };
    this.loaderService.start();
    this._authService.signup(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this.token = response?.data?.token;
          this.isOtpSubmited = true;
        } else {
          // this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError, '';
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          // this.toastrService.error(error.message, '');
          this.errorMessage = error.message, '';

        } else {
          // this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError, '';

        }
      }
    );
  }

  verifyOtp() {
    let obj = {
      email: this.signUpData?.email,
      otp: this.otp,
    };
    this.loaderService.start();
    this._authService.verifyOtp(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this.onSubmit();
        } else {
          this.errorMessage = MessageConstant.unknownError, '';
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.errorMessage = error.message, '';
        } else {
          this.errorMessage = MessageConstant.unknownError, '';
        }
      }
    );
  }

  reSendOtp() {
    let { email } = this.signUpData;
    let obj = {
      email: email,
    };
    this.loaderService.start();
    this._authService.sendOtp(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this.otp = 0;
          this.toastrService.success(response?.message);
          this.errorMessage = '';
        } else {
          this.errorMessage = MessageConstant.unknownError, '';
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.errorMessage = error.message;
        } else {
          this.errorMessage = MessageConstant.unknownError, '';
        }
      }
    );
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }

  login() {
    if (this.token) {
      localStorage.setItem('token', this.token);
      this.getUserDetails();
    } else {
      this.router.navigate(['auth/login']);
    }
  }

  getUserDetails() {
    this.loaderService.start();
    this._userService.getUserDetails({}).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this._utilities.userData = response?.data;
          if (
            this._utilities.userData?.isBilling &&
            this._utilities.userData?.isGeneral &&
            this._utilities.userData?.isIntegration &&
            this._utilities.userData?.isAISetting
          ) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/account-setting']);
          }
        } else {
          this.loaderService.stop();
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastrService.error(error.message, '');
        } else {
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

}
