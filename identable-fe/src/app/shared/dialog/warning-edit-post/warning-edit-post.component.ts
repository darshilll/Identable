import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-edit-post',
  templateUrl: './warning-edit-post.component.html',
  styleUrls: ['./warning-edit-post.component.scss'],
})
export class WarningEditPostComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<WarningEditPostComponent>
  ) {}

  onSubmit(action: boolean) {
    this.dialogRef.close(action);
  }
}
