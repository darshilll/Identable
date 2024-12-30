import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-post-reschedule',
  templateUrl: './post-reschedule.component.html',
  styleUrls: ['./post-reschedule.component.scss'],
})
export class PostRescheduleComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PostRescheduleComponent>
  ) {
    console.log("====",this.data);
    
  }

  scheduleDialogOpenClose() {
    this.dialogRef.close();
  }

  postScheduled(event: any) {
    this.dialogRef.close(event);
  }
}
