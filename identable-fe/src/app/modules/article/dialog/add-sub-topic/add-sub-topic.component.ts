import { Component, Inject } from '@angular/core';

// LIBRARY
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-add-sub-topic',
  templateUrl: './add-sub-topic.component.html',
  styleUrls: ['./add-sub-topic.component.scss'],
})
export class AddSubTopicComponent {
  topic: any;
  isSubmit: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddSubTopicComponent>
  ) {}

  add() {
    this.isSubmit = true;
    if (!this.topic) {
      return;
    }

    this.dialogRef.close({ topic: this.topic });
  }
}
