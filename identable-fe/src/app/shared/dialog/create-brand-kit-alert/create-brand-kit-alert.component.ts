import { Component } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-brand-kit-alert',
  templateUrl: './create-brand-kit-alert.component.html',
  styleUrls: ['./create-brand-kit-alert.component.scss']
})
export class CreateBrandKitAlertComponent {

  constructor(
    private _dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateBrandKitAlertComponent>,
    private router: Router
  ) { }

  redirectBrandkit() {
    window.open('/brand-kit', '_blank');
    this.dialogRef.close();
  }
}
