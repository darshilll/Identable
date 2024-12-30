import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

//SERVICES
import { UserService } from '../../../providers/user/user.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

// COMPONENTS
import { PlanUpgradeDialogComponent } from 'src/app/shared/dialog/plan-upgrade-dialog/plan-upgrade-dialog.component';

@Component({
  selector: 'app-switch-profile',
  templateUrl: './switch-profile.component.html',
  styleUrls: ['./switch-profile.component.scss'],
})
export class SwitchProfileComponent {
  dialogRef: any;
  selectedPageId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private _formBuilder: FormBuilder,
    public _userService: UserService,
    public _utilities: CommonFunctionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _dialog: MatDialog,
    private dialogView: MatDialogRef<SwitchProfileComponent>
  ) {}

  ngOnInit(): void {
    this.selectedPageId = this._utilities.userData?.currentPageId;

    if (this._utilities.linkedinPageList?.length == 0) {
      this.getLinkedinPageList();
    }
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

  selectProfileType(data: any) {
    if (data?.isAccess) {
      this.selectedPageId = data?._id;
    } else {
      this.planUpgardDialog();
    }
  }

  changeProfile() {
    if (this.selectedPageId == this._utilities.userData?.currentPageId) {
      return;
    }

    let param = {
      pageId: this.selectedPageId,
    };

    this.loaderService.start();
    this._userService.changeProfile(param).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();

        if (response.statusCode == 200) {
          this._utilities.userData.currentPageId = this.selectedPageId;
          this.toastr.success('Profile switched successfully', '');
          this.dialogView.close();
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
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

  planUpgardDialog() {
    this.dialogRef = this._dialog.open(PlanUpgradeDialogComponent, {
      width: '550px',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        window.open('/subscription', '_blank');
      }
    });
  }

  onCanel() {
    this.dialogView.close();
  }
}
