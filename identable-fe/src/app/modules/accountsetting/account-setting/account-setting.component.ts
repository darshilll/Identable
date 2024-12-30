import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// LIBRARY
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { AuthService } from '../../../providers/auth/auth.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { UserService } from '../../../providers/user/user.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

// COMPONENTS
import { PlayIntroVideoComponent } from '../../../shared/components/play-intro-video/play-intro-video.component';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss'],
})
export class AccountSettingComponent {
  isVisibleHeader: boolean = true;
  userData: any;
  userInfo: any;
  timeout: any = null;

  lastSectionName: string = 'billing';

  allSideSteps: any[] = [
    {
      name: 'billing',
      label: 'Billing',
      isOpen: false,
    },
    {
      name: 'general_step',
      label: 'General',
      isOpen: false,
    },
    {
      name: 'integrations_step',
      label: 'Integrations',
      isOpen: false,
    },
    {
      name: 'ai_setting_step',
      label: 'AI Setting',
      isOpen: false,
    },
  ];

  dialogRef: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public _userService: UserService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private _dialog: MatDialog
  ) {
    this.initView();
    // this.openLoaderView();

    this._utilities.refreshAccountSettingData = new Subject();
    this._utilities.refreshAccountSettingData.subscribe((response: any) => {
      console.log('refreshAccountSettingData response = ', response);

      this._utilities.refreshPlayIntroData.next(response);
    });
  }

  openLoaderView() {
    this.dialogRef = this._dialog.open(PlayIntroVideoComponent, {
      width: '700px',
      data: {},
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result?.action == 'try_again') {
        this.tryAgain();
      } else {
        await this._globalService.getUserDetails({});
        await this._globalService.getLinkedinPageList({});
      }
    });
  }

  async tryAgain() {
    await this._globalService.getLinkedinPageList({});
    if (this._utilities.linkedinPageList?.length > 0) {
      this._utilities.refreshIntegrationData.next({ status: true });
    }
  }

  async initView() {
    await this._globalService.getUserDetails({});
    await this._globalService.getLinkedinPageList({});

    let cookies = this.route.snapshot.queryParamMap.get('cookies');

    if (cookies) {
      this.saveLinkedinCookies(cookies);

      this.router.navigate([], {
        queryParams: {
          cookies: null,
        },
      });
    }

    this.setSection();
  }

  saveLinkedinCookies(cookies: any) {
    this.loaderService.start();
    this._userService.saveLinkedinCookies({ cookies: cookies }).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this.openLoaderView();
        } else {
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

  logout() {
    this._utilities.logout();
  }

  setSection() {
    this.lastSectionName = 'billing';

    if (this._utilities.userData?.isBilling) {
      this.lastSectionName = 'general_step';
    }
    if (this._utilities.userData?.isGeneral) {
      this.lastSectionName = 'integrations_step';
    }
    if (this._utilities.userData?.isIntegration) {
      if (!this._utilities.userData?.isCookieValid) {
        this.lastSectionName = 'integrations_step';
      } else if (
        !this._utilities.userData?.isCompanyPageVisited &&
        this._utilities.linkedinPageList?.length > 0
      ) {
        this.lastSectionName = 'integrations_step';
      } else {
        this.lastSectionName = 'ai_setting_step';
      }
    }

    this.moveToNext(this.lastSectionName);
  }

  moveToNext(sectionName: string) {
    this.allSideSteps[0].isOpen = false;
    this.allSideSteps[1].isOpen = false;
    this.allSideSteps[2].isOpen = false;
    this.allSideSteps[3].isOpen = false;

    if (
      sectionName == 'integrations_step' &&
      !this._utilities.userData?.isGeneral
    ) {
      this.toastr.error('Please select timezone and save.');
    }

    if (sectionName == 'billing') {
      this.allSideSteps[0].isOpen = true;
      this.lastSectionName = 'billing';
    } else if (
      sectionName == 'general_step' &&
      this._utilities.userData?.isBilling
    ) {
      this.allSideSteps[1].isOpen = true;
      this.lastSectionName = 'general_step';
    } else if (
      sectionName == 'integrations_step' &&
      this._utilities.userData?.isGeneral
    ) {
      this.allSideSteps[2].isOpen = true;
      this.lastSectionName = 'integrations_step';
    } else if (
      sectionName == 'integrations_step' &&
      !this._utilities.userData?.isCookieValid
    ) {
      this.allSideSteps[2].isOpen = true;
      this.lastSectionName = 'integrations_step';
    } else if (
      !this._utilities.userData?.isCompanyPageVisited &&
      this._utilities.linkedinPageList?.length > 0
    ) {
      this.allSideSteps[2].isOpen = true;
      this.lastSectionName = 'integrations_step';
    } else if (
      sectionName == 'ai_setting_step' &&
      this._utilities.userData?.isIntegration
    ) {
      this.allSideSteps[3].isOpen = true;
      this.lastSectionName = 'ai_setting_step';
    } else {
      if (this.lastSectionName == 'billing') {
        this.allSideSteps[0].isOpen = true;
      } else if (this.lastSectionName == 'general_step') {
        this.allSideSteps[1].isOpen = true;
      } else if (this.lastSectionName == 'integrations_step') {
        this.allSideSteps[2].isOpen = true;
      } else if (this.lastSectionName == 'ai_setting_step') {
        this.allSideSteps[3].isOpen = true;
      }
    }
  }

  onSubmitSection(sectionName: string) {
    if (sectionName == 'billing') {
      this.moveToNext('general_step');
    } else if (sectionName == 'general_step') {
      this.moveToNext('integrations_step');
    } else if (sectionName == 'integrations_step') {
      this.moveToNext('ai_setting_step');
    } else if (sectionName == 'ai_setting_step') {
      this.router.navigate(['/dashboard']);
    }
  }

  onDashboard() {
    if (
      this._utilities.userData?.isBilling &&
      this._utilities.userData?.isGeneral &&
      this._utilities.userData?.isIntegration &&
      this._utilities.userData?.isAISetting
    ) {
      this.router.navigate(['/dashboard']);
    }
  }
}
