import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-save-theme',
  templateUrl: './save-theme.component.html',
  styleUrls: ['./save-theme.component.scss']
})
export class SaveThemeComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SaveThemeComponent>,
    private _dialog: MatDialog
  ) {}
  
  close(isClose:boolean){
    if(isClose){
      this.dialogRef.close({ isSave: true });
    }else{
      this.dialogRef.close();
    }
  }
}
