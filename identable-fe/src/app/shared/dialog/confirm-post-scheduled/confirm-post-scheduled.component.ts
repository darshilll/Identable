import { Component } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-post-scheduled',
  templateUrl: './confirm-post-scheduled.component.html',
  styleUrls: ['./confirm-post-scheduled.component.scss'],
})
export class ConfirmPostScheduledComponent {

  constructor(
    private _dialog: MatDialog,
    private dialogRef: MatDialogRef<ConfirmPostScheduledComponent>,
    private router: Router
  ) { }

  redirectSchedulePage() {
    this.router.navigate(['/evolve']);
    this.dialogRef.close();
  }
}
