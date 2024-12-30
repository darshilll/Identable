import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// COMPONENTS
import { AddBillingCardComponent } from '../../../shared/dialog/add-billing-card/add-billing-card.component';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent {

  dialogRef: any;
  constructor(
    private toastrService: ToastrService,
    private _dialog: MatDialog,
    private _titleService: Title
  ) {}

  ngOnInit(): void {
    //this.addNewCard();
  }

  addNewCard(){
    this.dialogRef = this._dialog.open(AddBillingCardComponent, {
      width: '500px',
      //panelClass: 'custom-edit-post-modal',
      data: {},
    });
  }

}
