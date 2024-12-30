import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// LIBRARY
import { MatDialog } from '@angular/material/dialog';

//COMPONENT
import { SwitchProfileComponent } from '../../shared/dialog/switch-profile/switch-profile.component';
import { HireAnExpertComponent } from '../../shared/dialog/hire-an-expert/hire-an-expert.component';

// SERVICES
import { UserService } from '../../providers/user/user.service';
import { LoaderService } from '../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../utils/common-functions/global.service';
import { ErrorModel } from '../../utils/models/error';
import { ResponseModel } from '../../utils/models/response';
import { MessageConstant } from '../../utils/message-constant';
import { CreditOverViewComponent } from 'src/app/shared/dialog/credit-over-view/credit-over-view.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  dialogRef: any;
  currentProfile: any;
  isCancelCompanyPageDialog: boolean = false;

  constructor(
    private router: Router,
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _userService: UserService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService
  ) {
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({});
    this.getLinkedinPageList();
  }

  hireAnExpert() {
    this.dialogRef = this._dialog.open(HireAnExpertComponent, {
      width: '680px',
      //disableClose: true,
      //panelClass: 'custom-carousels-modal',
      data: {},
    });
  }
  
  creditOverview() {
    this.dialogRef = this._dialog.open(CreditOverViewComponent, {
      width: '600px',
      data: {},
    });
  }

  getLinkedinPageList() {
    this.loaderService.start();
    this._userService.getLinkedinPageList({}).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this._utilities.linkedinProfileData =
            response.data?.linkedinProfileData;
          this._utilities.linkedinPageList = response.data?.linkedinPageData;

          this._utilities.linkedinAccessPageList =
            this._utilities.linkedinPageList?.filter((x: any) => x?.isAccess);

          this._utilities.pageList = this._utilities.linkedinPageList?.filter(
            (x: any) => x?.type == 'page'
          );
          this.setCurrentProfileData();
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

  setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  logout() {
    this._utilities.logout();
  }

  // Change Profile dialog

  switchProfile() {
    this.dialogRef = this._dialog.open(SwitchProfileComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {});
  }

  moveToIntegration() {
    this.router.navigate(['/account-setting']);
  }
}
