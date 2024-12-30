import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

//SERVICES
import { AuthService } from '../../../providers/auth/auth.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  isOtpSubmited: boolean = false;
  errorMessage : string = "";
  // successMessage : string = "";

  token: any;
  otp: any = 0;
  config: any = {
    length: 4,
    allowNumbersOnly: true,
    inputClass: 'otp-input-box',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<VerifyEmailComponent>,
    private loaderService: LoaderService,
    private _authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.otp.length !== 4) {
      return;
    }
    if (this.data?.isForgotPassword) {
      this.verifyOtp(this.otp);
    } else {
      this.signUp(this.otp);
    }
  }

  signUp(otp: any) {
    let obj = {
      ...this.data,
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

  verifyOtp(otp: any) {
    let obj = {
      email: this.data?.email,
      otp: otp,
    };
    this.loaderService.start();
    this._authService.verifyOtp(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this.dialogRef.close(otp);
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

  reSendOtp() {
    let { email } = this.data;
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
          // this.successMessage = response?.message;
        } else {
          // this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError , '';
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          // this.toastrService.error(error.message, '');
          this.errorMessage = error.message;
        } else {
          // this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError, '';
        }
      }
    );
  }

  goToLogin() {
    this.dialogRef.close();
    this.router.navigate(['auth/login']);
  }

  login() {
    if (this.token) {
      this.dialogRef.close(true);
      localStorage.setItem('token', this.token);
    } else {
      this.dialogRef.close();
      this.router.navigate(['auth/login']);
    }
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }
}
