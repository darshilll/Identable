import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
@Component({
  selector: 'app-delete-carousel-conformation',
  templateUrl: './delete-carousel-conformation.component.html',
  styleUrls: ['./delete-carousel-conformation.component.scss'],
})
export class DeleteCarouselConformationComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private dialogRef: MatDialogRef<DeleteCarouselConformationComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close({ isAction: 'no' });
  }

  onYesClick(): void {
    this.dialogRef.close({ isAction: 'yes' });
  }

  onClickClose(): void {
    this.dialogRef.close();
  }
}
