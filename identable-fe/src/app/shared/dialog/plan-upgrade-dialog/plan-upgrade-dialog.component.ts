import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-upgrade-dialog',
  templateUrl: './plan-upgrade-dialog.component.html',
  styleUrls: ['./plan-upgrade-dialog.component.scss'],
})
export class PlanUpgradeDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogView: MatDialogRef<PlanUpgradeDialogComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {}
  submit() {
    this.dialogView.close(true);
  }

  cancel() {
    this.dialogView.close();
  }
}
