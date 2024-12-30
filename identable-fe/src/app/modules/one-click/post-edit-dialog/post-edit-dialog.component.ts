import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

//COMPONENTS
import { DateDialogComponent } from '../date-dialog/date-dialog.component';
import { TimeDialogComponent } from '../time-dialog/time-dialog.component';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';

//SERVICES
import { ToastrService } from 'ngx-toastr';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { LoaderService } from '../../../providers/loader-service/loader.service';

@Component({
  selector: 'app-post-edit-dialog',
  templateUrl: './post-edit-dialog.component.html',
  styleUrls: ['./post-edit-dialog.component.scss'],
})
export class PostEditDialogComponent {
  selectedPageId: string = '';

  isOpenDateDialog: boolean = false;
  isOpenTimeDialog: boolean = false;

  subTopic: any;
  generatedType: any;
  isAutoDateandTime: boolean = true;
  timePeriod: any;
  timeSlot: any;
  date: any;

  versionThemeList: any = commonConstant.versionPromtTheme;
  versionAList: any = ([] = this.versionThemeList);
  versionBList: any = ([] = this.versionThemeList);
  isAbVersion: boolean = false;

  themeVersionA: any = '';
  themeVersionB: any = '';

  isSubmitted: boolean = false;
  creditOverView: any = {};
  dialogRef2: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PostEditDialogComponent>,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private _dialog: MatDialog,
    public _utilities: CommonFunctionsService
  ) {
    this.subTopic = this.data?.subTopic;
    this.generatedType = this.data?.generatedType;
    this.timePeriod = this.data?.timePeriod;
    this.timeSlot = this.data?.timeSlot;
    this.isAbVersion = this.data?.isAbVersion;
    const date = new Date(this.data?.date);
    this.date = date.getTime();
    if (this.isAbVersion) {
      this.themeVersionA = this.data?.themeVersionA;
      this.themeVersionB = this.data?.themeVersionB;
    }
  }

  openDateDialog() {
    this.dialogRef2 = this._dialog.open(DateDialogComponent, {
      width: '360px',
      backdropClass: '',
      data: this.data,
    });

    this.dialogRef2.afterClosed().subscribe((result: any) => {
      if (result) {
        this.date = new Date(result);

        const year = this.date.getFullYear();
        const month = String(this.date.getMonth() + 1).padStart(2, '0');
        const day = String(this.date.getDate()).padStart(2, '0');

        const localDate = `${year}-${month}-${day}`;

        this.data.date = localDate;
      }
    });
  }

  openTimeDialog() {
    this.dialogRef2 = this._dialog.open(TimeDialogComponent, {
      width: '350px',
      backdropClass: '',
      data: this.data,
    });

    this.dialogRef2.afterClosed().subscribe((result: any) => {
      if (result) {
        this.timeSlot = result?.timeSlot;
        this.data.timePeriod = result?.timePeriod;
        this.data.timeSlot = result?.timeSlot;
      }
    });
  }

  isCheckAutoDateandTime(event: any) {
    this.isAutoDateandTime = event.target.checked;
  }

  cancel() {
    this.dialogRef.close();
  }

  selectGeneratedType(event: any) {
    let credit = 0;
    let addCredit = false;
    let minusCredit = false;
    let creditDetails = this._utilities?.userData?.plan;
    let totalCredit = this._utilities?.userData?.subscription?.credit;
    if (this.data?.generatedType != this.generatedType) {
      if (
        this.data?.generatedType == 'inspireMe' ||
        this.data?.generatedType == 'trendingNews'
      ) {
        if (this.generatedType == 'carousel') {
          credit = creditDetails?.carouselCredit;
        }
        if (this.generatedType == 'aivideo') {
          credit = creditDetails?.aIVideoCredit;
        }
        if (this.generatedType == 'article') {
          credit = creditDetails?.articleCredit;
        }
        addCredit = true;
      }

      if (this.data?.generatedType == 'carousel') {
        let isCheckCredit = 0;
        if (this.generatedType == 'aivideo') {
          isCheckCredit =
            creditDetails?.carouselCredit - creditDetails?.aIVideoCredit;
        }
        if (this.generatedType == 'article') {
          isCheckCredit =
            creditDetails?.carouselCredit - creditDetails?.articleCredit;
        }
        if (isCheckCredit < 0) {
          credit = isCheckCredit;
          minusCredit = true;
          addCredit = false;
        } else {
          credit = -isCheckCredit;
          minusCredit = false;
          addCredit = true;
        }
      }
      if (this.data?.generatedType == 'aivideo') {
        let isCheckCredit = 0;
        if (this.generatedType == 'carousel') {
          isCheckCredit =
            creditDetails?.aIVideoCredit - creditDetails?.carouselCredit;
        }
        if (this.generatedType == 'article') {
          isCheckCredit =
            creditDetails?.aIVideoCredit - creditDetails?.articleCredit;
        }
        credit = isCheckCredit;
        minusCredit = true;
        addCredit = false;
      }
      if (this.data?.generatedType == 'article') {
        let isCheckCredit = 0;
        if (this.generatedType == 'aivideo') {
          isCheckCredit =
            creditDetails?.articleCredit - creditDetails?.aIVideoCredit;
        }
        if (this.generatedType == 'carousel') {
          isCheckCredit =
            creditDetails?.articleCredit - creditDetails?.carouselCredit;
        }
        if (isCheckCredit < 0) {
          credit = isCheckCredit;
          minusCredit = true;
          addCredit = false;
        } else {
          credit = -isCheckCredit;
          minusCredit = false;
          addCredit = true;
        }
      }

      if (
        this.data?.generatedType == 'carousel' ||
        this.data?.generatedType == 'aivideo' ||
        this.data?.generatedType == 'article'
      ) {
        if (
          this.generatedType == 'inspireMe' ||
          this.generatedType == 'trendingNews'
        ) {
          if (this.data?.generatedType == 'carousel') {
            credit = creditDetails?.carouselCredit;
          }
          if (this.data?.generatedType == 'aivideo') {
            credit = creditDetails?.aIVideoCredit;
          }
          if (this.data?.generatedType == 'article') {
            credit = creditDetails?.articleCredit;
          }
          minusCredit = true;
          addCredit = false;
        }
      }
    }

    if (credit != 0) {
      this.creditOverView = {
        isChangeCredit: true,
        minusCredit: minusCredit,
        addCredit: addCredit,
        credit: credit,
      };
    }
  }

  save() {
    this.isSubmitted = true;
    if (!this.subTopic) {
      return;
    }

    if (this.isAbVersion && (!this.themeVersionA || !this.themeVersionB)) {
      return;
    }

    let payload = {};

    payload = {
      ...this.creditOverView,
      subTopic: this.subTopic,
      generatedType: this.generatedType,
    };

    if (this.isAbVersion) {
      payload = {
        ...payload,
        isAbVersion: this.isAbVersion,
        themeVersionA: this.themeVersionA,
        themeVersionB: this.themeVersionB,
      };
    }

    this.dialogRef.close(payload);
  }

  onSelectVersionA(event: any) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    this.versionBList.forEach((theme: any) => {
      if (theme.item === selectedValue) {
        theme.isReadOnly = true;
      } else {
        theme.isReadOnly = false;
      }
    });
  }
  onSelectVersionB(event: any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.versionAList.forEach((theme: any) => {
      if (theme.item === selectedValue) {
        theme.isReadOnly = true;
      } else {
        theme.isReadOnly = false;
      }
    });
  }
}
