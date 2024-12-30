import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// SERVICES
import { AuthService } from '../../providers/auth/auth.service';
import { LoaderService } from '../../providers/loader-service/loader.service';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// COMPONENTS
import { VerifyEmailComponent } from '../../shared/dialog/verify-email/verify-email.component';

//UTILS
import { ErrorModel } from '../../utils/models/error';
import { ResponseModel } from '../../utils/models/response';
import { MessageConstant } from '../../utils/message-constant';
import { MiscellaneousConstant } from '../../utils/common-functions/miscellaneous-constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent {
  emailForm: FormGroup;
  updatePasswordForm: FormGroup;
 
  errorMessage : string = ""; 
  submitted: boolean = false;
  isEmailVerify: boolean = false;
  
  // Is Reset Password
  isResetPassword:boolean = false;
  sendResetLink: boolean  = false;
  resetToken:any; 
  resetEmailAddress:any;

  // Updated Password
  isPasswordUpdated: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private _authService: AuthService,
    private _dialog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.resetToken = this.route.snapshot.params['token'];
    this.resetEmailAddress = this.route.snapshot.params['email'];

    this.emailForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(MiscellaneousConstant.emailPatternWithCaps),
        ],
      ],
    });
    this.updatePasswordForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.comparePassword,
      }
    );

    // Subscribe to email value changes to reset the error message

    this.emailForm.get('email')?.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });

    if(this.resetToken && this.resetEmailAddress)
    {
      this.verifyResetPasswordLink();
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.emailForm.controls[controlName].hasError(errorName);
  };

  public hasErrorPassword = (controlName: string, errorName: string) => {
    return this.updatePasswordForm.controls[controlName].hasError(errorName);
  };

  backToForgetPassword(){
    this.sendResetLink = false;
  }
 
  forgetPassword() {
    this.submitted = true;

    if (!this.emailForm.valid) {
      return;
    }

    const { email } = this.emailForm.value;

    let obj = {
      email: email,      
      redirectUrl: environment?.frontURL+'/auth/resetpassword'
    };

    this.loaderService.start();
    this._authService.forgetPassword(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this.toastrService.success(response?.data);
          this.sendResetLink = true;
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
          this.errorMessage = error.message, '';
        } else {
          // this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError , '';
        }
      }
    );
  }

  sendOtp(email: any) {
    let obj = {
      email: email,
    };
    this.loaderService.start();
    this._authService.sendOtp(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.loaderService.stop();
        } else {
          this.loaderService.stop();
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

  verifyResetPasswordLink(){
    let obj = {
      email: this.resetEmailAddress,
      token: this.resetToken,           
    };
    this.loaderService.start();
    this._authService.verifyResetPasswordLink(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.loaderService.stop();
          this.isResetPassword = true;
        } else {
          this.loaderService.stop();
          // this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError , '';
          this.router.navigate(['auth/forgot-password']);
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        this.router.navigate(['auth/forgot-password']);
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastrService.error(error.message, '');
          this.errorMessage = error.message , '';
        } else {
          this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError , '';
        }
      }
    );
  }

  updatePassword() {
    this.submitted = true;

    if (!this.updatePasswordForm.valid) {
      return;
    }        
    const { password } = this.updatePasswordForm.value;
    let obj = {
      email: this.resetEmailAddress,
      token: this.resetToken,
      password: password,      
    };
    this.loaderService.start();
    this._authService.updatePassword(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.isPasswordUpdated = true;
          this.loaderService.stop();
        } else {
          this.loaderService.stop();
          // this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError , '';
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          // this.toastrService.error(error.message, '');
          this.errorMessage = error.message , '';
        } else {
          // this.toastrService.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError , '';
        }
      }
    );
  }

  logIn() {
    this.router.navigate(['auth/login']);
  }

  comparePassword(group: FormGroup) {
    const password = group?.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ MatchPassword: true });
    } else {
      group.get('confirmPassword')?.setErrors(null);
    }
  }
}
