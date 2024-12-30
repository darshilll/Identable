import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-generating-video-processing',
  templateUrl: './generating-video-processing.component.html',
  styleUrls: ['./generating-video-processing.component.scss']
})
export class GeneratingVideoProcessingComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private dialogRef: MatDialogRef<GeneratingVideoProcessingComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close({ isClose: true });
  }

}
