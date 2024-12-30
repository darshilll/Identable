import { Component, Input, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
@Component({
  selector: 'app-date-dialog',
  templateUrl: './date-dialog.component.html',
  styleUrls: ['./date-dialog.component.scss'],
})
export class DateDialogComponent {
  currentDate = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DateDialogComponent>
  ) {}
  defaultDate: any;
  ngOnInit(): void {
    
    this.defaultDate = new Date();
    if(this.data?.date){
      this.defaultDate = new Date(this.data?.date);
    }
  }

  submit() {
    this.dialogRef.close(this.defaultDate);
  }
}
