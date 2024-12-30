import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';

// SERVICES
import { AuthService } from '../../providers/auth/auth.service';
import { LoaderService } from '../../providers/loader-service/loader.service';
import { UserService } from '../../providers/user/user.service';

//UTILS
import { CommonFunctionsService } from '../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../utils/models/error';
import { ResponseModel } from '../../utils/models/response';
import { MessageConstant } from '../../utils/message-constant';
import { MiscellaneousConstant } from '../../utils/common-functions/miscellaneous-constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  slideConfig = { slidesToShow: 1, slidesToScroll: 1, dots: true };
  loginForm: FormGroup;
  showPassword: boolean = false;
  linkedInTokenCode: any = '';
  errorMessage: string = '';
  isSubmitted: boolean = false;
  private linkedInCredentials = {
    response_type: 'code',
    clientId: environment.client_id,
    redirectUrl: environment.redirect_linkedin_uri,
    state: 23101992,
    scope: 'r_liteprofile%20r_emailaddress%20w_member_social',
  };

  isLoading: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _authService: AuthService,
    private _userService: UserService,
    public _utilities: CommonFunctionsService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(MiscellaneousConstant.emailPatternWithCaps),
        ],
      ],
      password: ['', [Validators.required]],
    });

    // Subscribe to email value changes to reset the error message
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
    
  }

  ngOnInit(): void {
    if (this._authService.getToken()) {
      this.router.navigate([environment.defaultPath]);
    }
    this.route.queryParams.subscribe((params) => {
      this.linkedInTokenCode = params['code'];
      if (this.linkedInTokenCode) {
        this.isLoading = true;
        this.accessLinkedinLogin();
      }
    });
    console.log("LoginComponent 12345");
  }

  loginWithlinkedin() {
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${this.linkedInCredentials.clientId}&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;
  }

  accessLinkedinLogin() {
    let obj = {
      code: this.linkedInTokenCode,
    };
    this.loaderService.start();
    this._authService.socialLogin(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          localStorage.setItem('token', response?.data?.token);
          this.getUserDetails();
        } else {
          this.loaderService.stop();
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getUserDetails() {
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
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    const obj = {
      email: email?.toLowerCase(),
      password,
    };
    this.loaderService.start();
    this._authService.login(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          localStorage.setItem('token', response?.data?.token);
          this.getUserDetails();
          this.loaderService.stop();
        } else {
          this.loaderService.stop();
          // this.toastr.error(MessageConstant.unknownError, '');
          this.errorMessage = MessageConstant.unknownError , '';
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          // this.toastr.error(error.message, '');
          this.errorMessage = error.message , '';
        } else {
          this.errorMessage = MessageConstant.unknownError , '';
          // this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
