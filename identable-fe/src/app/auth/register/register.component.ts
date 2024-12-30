import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// SERVICES
import { AuthService } from '../../providers/auth/auth.service';
import { LoaderService } from '../../providers/loader-service/loader.service';
import { UserService } from '../../providers/user/user.service';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// COMPONENTS
import { VerifyEmailComponent } from '../../shared/dialog/verify-email/verify-email.component';

//UTILS
import { CommonFunctionsService } from '../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../utils/models/error';
import { ResponseModel } from '../../utils/models/response';
import { MessageConstant } from '../../utils/message-constant';
import { MiscellaneousConstant } from '../../utils/common-functions/miscellaneous-constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  signupForm: FormGroup;
  dialogRef: any;
  submitted: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';
  private linkedInCredentials = {
    response_type: 'code',
    clientId: environment.client_id,
    redirectUrl: environment.redirect_linkedin_uri,
    state: 23101992,
    scope: 'r_liteprofile%20r_emailaddress%20w_member_social',
  };
  constructor(
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private _authService: AuthService,
    private _dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _userService: UserService,
    public _utilities: CommonFunctionsService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(MiscellaneousConstant.emailPatternWithCaps),
          Validators.maxLength(30),
        ],
      ],
      password: ['', [Validators.required]],
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(MiscellaneousConstant.namePattern),
          Validators.maxLength(30),
        ],
      ],
    });
    localStorage.clear();

    // Subscribe to email value changes to reset the error message
    this.signupForm.get('email')?.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.signupForm.controls[controlName].hasError(errorName);
  };

  openOtpDailog(formData: any) {
    this.dialogRef = this._dialog.open(VerifyEmailComponent, {
      width: '100%',
      height: '100%',
      minWidth: '100vw',
      data: formData,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getUserDetails();
      }
    });
  }

  loginWithlinkedin() {
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${this.linkedInCredentials.clientId}&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;
  }

  OnSubmit() {
    this.submitted = true;

    if (!this.signupForm.valid) {
      return;
    }

    const { email, name } = this.signupForm.value;

    let obj = {
      email: email,
    };
    this.loaderService.start();
    this._authService.checkEmail(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.sendOtp(email, name);
        } else {
          this.loaderService.stop();
          // this.toastrService.error(MessageConstant.unknownError, '');
          (this.errorMessage = MessageConstant.unknownError), '';
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
          (this.errorMessage = MessageConstant.unknownError), '';
        }
      }
    );
  }

  sendOtp(email: any, name: any) {
    let obj = {
      email: email,
      name: name,
    };
    this.loaderService.start();
    this._authService.sendOtp(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._utilities.signupFormData = this.signupForm.value;
          this.loaderService.stop();
          this.router.navigate(['/auth/verify-email']);
          //this.openOtpDailog(this.signupForm.value);
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
