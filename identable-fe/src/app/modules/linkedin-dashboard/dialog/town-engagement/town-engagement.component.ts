import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-town-engagement',
  templateUrl: './town-engagement.component.html',
  styleUrls: ['./town-engagement.component.scss'],
})
export class TownEngagementComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TownEngagementComponent>
  ) {}
}
