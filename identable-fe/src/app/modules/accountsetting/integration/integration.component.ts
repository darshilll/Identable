import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

//SERVICES
import { UserService } from '../../../providers/user/user.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { GlobalService } from '../../../utils/common-functions/global.service';

// COMPONENTS
import { OnboardIntegrationIntroComponent } from '../../../shared/dialog/onboard-integration-intro/onboard-integration-intro.component';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
})
export class IntegrationComponent implements OnInit {
  @Output() onSubmitIntegrationSetting = new EventEmitter();

  integrationLinkedIn: boolean = true;

  // Assign Linkedin Data
  userLinkedInData: any;
  filteredPageData: any = [];
  dialogRef: any;
  pageList: any = [];
  isConnectAgain: boolean = false;

  constructor(
    public _userService: UserService,
    public _utilities: CommonFunctionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    public _globalService: GlobalService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._utilities.refreshIntegrationData = new Subject();
    this._utilities.refreshIntegrationData.subscribe((response: any) => {
      this._utilities.refreshAccountSettingData.next(response);

      if (response?.status) {
        this.successIntegrationData();
      } else {
        this.failedIntegrationData();
      }
    });
    this.initView();
  }

  async initView() {
    await this._globalService.getLinkedinPageList({});

    if (this._utilities.linkedinPageList?.length > 0) {
      this.integrationLinkedIn = true;
      this._utilities.userData.isIntegration = true;
      this.updateProfileSettings();
    } else {
      this.integrationLinkedIn = false;
    }

    this.pageList = [];

    if (this._utilities.pageList?.length > 0) {
      let array = JSON.parse(JSON.stringify(this._utilities.pageList));
      for (let i = 0; i < array?.length; i++) {
        let page = array[i];
        let isDisable = false;
        if (page?.isAccess) {
          isDisable = true;
        }
        page = {
          ...page,
          isDisable,
        };
        this.pageList.push(page);
      }
    }
  }

  onLearnMore() {
    this.onBoradIntroVideo();
  }

  onBoradIntroVideo() {
    this.dialogRef = this._dialog.open(OnboardIntegrationIntroComponent, {
      width: '700px',
      disableClose: false,
      panelClass: 'custom-onboard-modal',
      data: {},
    });
  }

  successIntegrationData() {
    this.initView();
  }

  failedIntegrationData() {}

  downloadExtension() {
    window.open(environment.cromeWebstore, '_blank');
  }

  disconnectAccount() {}

  connectAgain() {
    // window.open(environment.cromeWebstore, '_blank');
    this.isConnectAgain = true;
  }

  onNextStep() {
    this.savePageAccess();
  }

  savePageAccess() {
    if (this.pageList?.length == 0) {
      this.moveToAISettings();
      return;
    }

    let obj = { pageArray: this.pageList };

    this.loaderService.start();
    this._userService.savePageAccess(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this.toastr.success('Access updated successfully', '');
          this.moveToAISettings();
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

  async moveToAISettings() {
    await this._globalService.getLinkedinPageList({});
    this.onSubmitIntegrationSetting.emit();
  }

  updateProfileSettings() {
    let obj = { action: 'companyPageVisited' };

    this._userService.updateProfileSettings(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._utilities.userData.isCompanyPageVisited = true;
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
}
