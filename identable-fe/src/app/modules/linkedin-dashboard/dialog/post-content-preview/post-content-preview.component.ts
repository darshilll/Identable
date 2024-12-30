import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ActiveBoostingComponent } from '../../../../shared/dialog/active-boosting/active-boosting.component';
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
@Component({
  selector: 'app-post-content-preview',
  templateUrl: './post-content-preview.component.html',
  styleUrls: ['./post-content-preview.component.scss'],
})
export class PostContentPreviewComponent {
  isExpanded: boolean = false;
  dialogRef: any;
  creditDeducated: number = 0;
  creditMessage: any;
  carouselTemplate: any;
  slideConfig = { slidesToShow: 1, slidesToScroll: 1, dots: true };
  constructor(
    public _utilities: CommonFunctionsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<PostContentPreviewComponent>,
    private toastr: ToastrService,
    private _dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    if (this.data?.postData?.carouselTemplate) {
      let genratedCarouselArray = [];
      for (let i = 0; i < this.data?.postData?.carouselTemplate?.length; i++) {
        genratedCarouselArray.push(
          this.getSlideHtml(
            this.data?.postData?.carouselTemplate[i]
              ?.changingThisBreaksApplicationSecurity
          )
        );
      }
      this.carouselTemplate = genratedCarouselArray;
    }

    this.creditDeducated = this._utilities?.userData?.plan?.boostingCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  toggleReadMore() {
    this.isExpanded = !this.isExpanded;
  }

  getHtml(item: SafeHtml): SafeHtml {
    return item;
  }

  getSlideHtml(item: any) {
    return this.sanitizer.bypassSecurityTrustHtml(item);
  }

  engagementSum(like: any, comment: any, share: any) {
    return like + comment + share;
  }

  boostPost() {
    if (!this._utilities?.userData?.isDsahboardLoaded) {
      this.toastr.error(
        'You cannot perform this action at this time. Your dashboard is in preview.'
      );
      return;
    }

    this.dialogRef = this._dialog.open(ActiveBoostingComponent, {
      width: '500px',
      data: this.data,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.data.isBoosting = true;
      }
    });
  }
}
