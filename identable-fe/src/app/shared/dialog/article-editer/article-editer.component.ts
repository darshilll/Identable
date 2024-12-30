import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-article-editer',
  templateUrl: './article-editer.component.html',
  styleUrls: ['./article-editer.component.scss'],
})
export class ArticleEditerComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ArticleEditerComponent>
  ) {}
}
