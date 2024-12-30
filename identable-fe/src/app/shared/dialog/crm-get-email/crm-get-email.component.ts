import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';

import { CrmGetEmailCreditComponent } from '../../../shared/dialog/crm-get-email-credit/crm-get-email-credit.component';
import { ToastrService } from 'ngx-toastr';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
@Component({
  selector: 'app-crm-get-email',
  templateUrl: './crm-get-email.component.html',
  styleUrls: ['./crm-get-email.component.scss'],
})
export class CrmGetEmailComponent {
  userData: any = [];
  isEmailFindCredit: number = 0;
  dialogRef: any;

  creditDeducated: number = 0;
  creditMessage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    private _dialogRef: MatDialogRef<CrmGetEmailComponent>,
    private clipboard: Clipboard,
    private _dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.creditDeducated = this._utilities?.userData?.plan?.discoverEmailCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  copyEmail(text: any) {
    this.clipboard.copy(text);
    this._toastr.success('Email address copied!');
  }

  verifiedEmail() {
    if (this.data?.enrowEmailStatus == 'processing') {
      this.toastr.success(
        'Your request is being processing. Please check again later.'
      );
      return;
    }
    if (this.data?.enrowEmailStatus == 'failed') {
      this.toastr.error('Your request is failed. Please contact support.');
      return;
    }
    this._utilities.manageCredit(false, this.creditDeducated);
    this._dialogRef.close(this.data);
  }
}
