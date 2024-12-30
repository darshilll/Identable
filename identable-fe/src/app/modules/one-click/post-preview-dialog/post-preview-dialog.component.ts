import { Component, Input, Output, Inject, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';

//COMPONENTS
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';
import { DeleteConfirmationPopupComponent } from '../../../shared/common/delete-confirmation-popup/delete-confirmation-popup.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
@Component({
  selector: 'app-post-preview-dialog',
  templateUrl: './post-preview-dialog.component.html',
  styleUrls: ['./post-preview-dialog.component.scss'],
})
export class PostPreviewDialogComponent {
  @Output() _closePostView = new EventEmitter<any>();
  @Output() _saveEditPost = new EventEmitter<any>();
  @Output() _deletePost = new EventEmitter<any>();
  @Output() _editPost = new EventEmitter<any>();
  @Output() _deleteScheduledPost = new EventEmitter<any>();
  @Output() _boostPost = new EventEmitter<any>();

  @Input() data: any;
  @Input() isPreSchedule: boolean = false;
  @Input() isPostSchedule: boolean = false;

  isBoostingCredit: number = 0;
  isBoostingCreditMessage: any;
  isActionBtn: boolean = false;
  dialogRef: any;
  currentProfile: any;
  constructor(
    private _dialog: MatDialog,
    public _utilities: CommonFunctionsService
  ) {
    this.isBoostingCredit = this._utilities?.userData?.plan?.boostingCredit;
    this.isBoostingCreditMessage = `This will cost ${this.isBoostingCredit} credits`;
    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  openActionBtn() {
    this.isActionBtn = !this.isActionBtn;
  }

  postEditDailog() {
    this.dialogRef = this._dialog.open(PostEditDialogComponent, {
      width: '600px',
      backdropClass: '',
      data: this.data,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.data = {
          ...this.data,
          ...result,
        };
        this._saveEditPost.emit(this.data);
      }
    });
  }

  closePostView() {
    this._closePostView.emit();
  }

  deletePost() {
    this.dialogRef = this._dialog.open(DeleteConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'custom-edit-post-modal',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this._deletePost.emit({ isDelete: true });
      }
    });
  }

  deleteScheduledPost() {
    this.dialogRef = this._dialog.open(DeleteConfirmationPopupComponent, {
      width: '400px',
      panelClass: 'custom-edit-post-modal',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this._deleteScheduledPost.emit({ isDeleteScheduledPost: true });
      }
    });
  }

  postBoost() {
    this._boostPost.emit({ isPostBoost: true });
  }
  editPost() {
    this._editPost.emit({ isEditPost: true });
  }

  removeHtml(item: any) {
    return item?.replace(/<[^>]*>/g, '');
  }
}
