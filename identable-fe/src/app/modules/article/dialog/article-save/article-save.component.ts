import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-article-save',
  templateUrl: './article-save.component.html',
  styleUrls: ['./article-save.component.scss'],
})
export class ArticleSaveComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private dialogRef: MatDialogRef<ArticleSaveComponent>
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
