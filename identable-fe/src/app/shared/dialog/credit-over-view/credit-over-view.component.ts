import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';

import { CreditBuyComponent } from '../credit-buy/credit-buy.component';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';

@Component({
  selector: 'app-credit-over-view',
  templateUrl: './credit-over-view.component.html',
  styleUrls: ['./credit-over-view.component.scss'],
})
export class CreditOverViewComponent {
  dialogRef: any;
  creditDetails: any;
  credit: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<CreditOverViewComponent>,
    private _dialog: MatDialog,
    public _utilities: CommonFunctionsService
  ) {
    this.creditDetails = this._utilities?.userData?.plan;
    this.credit = this._utilities?.userData?.subscription?.credit;
  }

  buyCredit() {
    this.dialogRef = this._dialog.open(CreditBuyComponent, {
      width: '550px',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }
}
