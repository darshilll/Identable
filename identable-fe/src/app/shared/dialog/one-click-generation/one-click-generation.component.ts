import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-one-click-generation',
  templateUrl: './one-click-generation.component.html',
  styleUrls: ['./one-click-generation.component.scss'],
})
export class OneClickGenerationComponent {
  scheduleData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OneClickGenerationComponent>
  ) {
    this.scheduleData = this.data;
  }

  onCanel(result: boolean) {
    this.dialogRef.close(result);
  }
}
