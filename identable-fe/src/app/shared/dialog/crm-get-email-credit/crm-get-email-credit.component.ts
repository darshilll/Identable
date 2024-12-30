import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
@Component({
  selector: 'app-crm-get-email-credit',
  templateUrl: './crm-get-email-credit.component.html',
  styleUrls: ['./crm-get-email-credit.component.scss'],
})
export class CrmGetEmailCreditComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CrmGetEmailCreditComponent>,
    public _utilities: CommonFunctionsService,
    private _toastr: ToastrService
  ) {}

  onSubmit(action: boolean) {
    if (action) {
      if (this._utilities.userData?.subscription?.discoverEmailCredit <= 0) {
        this._toastr.error('Discover credit not available.');
        return;
      }
      this.dialogRef.close(action);
      return;
    }
    this.dialogRef.close(action);
  }
}
