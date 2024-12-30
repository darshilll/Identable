import { Component } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

// SERVICES
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { OneClickService } from 'src/app/providers/oneClick/one-click.service';

// COMPONENTS
import { OneClickGenerationComponent } from '../../../shared/dialog/one-click-generation/one-click-generation.component';
import { ConfirmPostScheduledComponent } from '../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';
import { PlanUpgradeDialogComponent } from 'src/app/shared/dialog/plan-upgrade-dialog/plan-upgrade-dialog.component';

//UTILS
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { GlobalService } from '../../../utils/common-functions/global.service';

@Component({
  selector: 'app-oneclick',
  templateUrl: './oneclick.component.html',
  styleUrls: ['./oneclick.component.scss'],
})
export class OneclickComponent {
  isDailyPostNumber: number = 1;
  isTrendingNewsSelected: boolean = false;
  isInspireMeSelected: boolean = true;
  isWeekendInclude: boolean = false;
  isInspireMePostNumber: number = 5;

  isCarouselInclude: boolean = false;
  isAIVideoInclude: boolean = false;

  dialogRef: any;
  topic: any;
  isSubmited: boolean = false;
  currentProfile: any;

  // isAllowOneClick: boolean = false;
  isOneClickCredit: number = 0;
  duration: string = 'this week';

  constructor(
    public _utilities: CommonFunctionsService,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    private _oneClick: OneClickService,
    private _dialog: MatDialog,
    private _titleService: Title,
    public _globalService: GlobalService
  ) {
    this._titleService.setTitle('Identable | One click');
  }

  ngOnInit(): void {
    this._titleService.setTitle('Identable | Inspire Me');
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({});
    await this._globalService.getLinkedinPageList({});
    // this.isAllowOneClick =
    //   this._utilities?.userData?.subscription?.isOneClickPermission;
    this.isOneClickCredit =
      this._utilities?.userData?.subscription?.oneClickScheduleCredit;
    // if (!this.isAllowOneClick) {
    //   this.planUpgardDialog();
    //   return;
    // }
  }

  slectTrendingNews() {
    this.isTrendingNewsSelected = !this.isTrendingNewsSelected;
  }

  slectAivideo() {
    this.isAIVideoInclude = !this.isAIVideoInclude;
  }

  slectCarousel() {
    this.isCarouselInclude = !this.isCarouselInclude;
  }

  getOneClickSchedule() {
    // if (!this.isAllowOneClick) {
    //   this.planUpgardDialog();
    //   return;
    // }

    this.isSubmited = true;

    if (!this.topic || !this.isInspireMeSelected) {
      return;
    }

    if (this.isOneClickCredit <= 0) {
      this._toastr.error('Credit not available', '');
      return;
    }

    let payload = {
      topic: this.topic,
      dailyPost: this.isDailyPostNumber,
      isTrendingNewsInclude: this.isTrendingNewsSelected,
      isAIVideoInclude: this.isAIVideoInclude,
      isCarouselInclude: this.isCarouselInclude,
      isWeekendInclude: this.isWeekendInclude,
      duration: this.duration,
    };

    this._loader.start();

    this._oneClick.getOneClickSchedule(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          let data = response?.data;
          this.OneClickGenerationDialog(data);
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  generateOneClickPost() {
    let payload = {
      topic: this.topic,
      dailyPost: this.isDailyPostNumber,
      isTrendingNewsInclude: this.isTrendingNewsSelected,
      isAIVideoInclude: this.isAIVideoInclude,
      isCarouselInclude: this.isCarouselInclude,
      isWeekendInclude: this.isWeekendInclude,
      duration: this.duration,
    };

    let chatGPTModel = this._utilities.chatGPTModel;
    this._loader.start(chatGPTModel);

    this._oneClick.generateOneClick(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this._utilities.userData.subscription.oneClickScheduleCredit--;
          this.isOneClickCredit =
            this._utilities?.userData?.subscription?.oneClickScheduleCredit;
          this.openConfirmPostScheduled();
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loader.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  selectWeekendInclude() {
    this.isWeekendInclude = !this.isWeekendInclude;
  }

  OneClickGenerationDialog(data: any) {
    this.dialogRef = this._dialog.open(OneClickGenerationComponent, {
      width: '450px',
      panelClass: 'change-profile-modal',
      data: data,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.generateOneClickPost();
      }
    });
  }

  isCheckTodayAvailable() {}

  postCounter(type: string, button: boolean) {
    if (type == 'dailyPost') {
      if (button) {
        if (this.isDailyPostNumber < 3) {
          this.isDailyPostNumber++;
        }
      } else {
        if (this.isDailyPostNumber > 1) {
          this.isDailyPostNumber--;
        }
      }
    }

    if (type == 'inspireMe') {
      if (button) {
        if (this.isWeekendInclude) {
          if (this.isInspireMePostNumber < 7) {
            this.isInspireMePostNumber++;
          }
        } else {
          if (this.isInspireMePostNumber < 5) {
            this.isInspireMePostNumber++;
          }
        }
      } else {
        if (this.isInspireMePostNumber > 1) {
          this.isInspireMePostNumber--;
        }
      }
    }
  }

  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'post-scheduled-modal',
      data: {},
    });
  }

  oneIdeaDailog() {
    let obj = { type: 'topic' };

    this.dialogRef = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.topic = result;
      }
    });
  }

  planUpgardDialog() {
    this.dialogRef = this._dialog.open(PlanUpgradeDialogComponent, {
      width: '550px',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        window.open('/subscription', '_blank');
      }
    });
  }
}
