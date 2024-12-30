import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-ai-preview-image',
  templateUrl: './ai-preview-image.component.html',
  styleUrls: ['./ai-preview-image.component.scss']
})
export class AiPreviewImageComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialog: MatDialog,
    private dialogRef: MatDialogRef<AiPreviewImageComponent>,    
  )
  {     
  }

}
