import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

//Services
import { PostService } from 'src/app/providers/post/post.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { GeneralService } from 'src/app/providers/general/general.service';

//UTILS
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

// COMPONENTS
import { SelectMediaComponent } from '../../../shared/common/select-media/select-media.component';
import { ConfirmPostScheduledComponent } from 'src/app/shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';

@Component({
  selector: 'app-diy-strategy',
  templateUrl: './diy-strategy.component.html',
  styleUrls: ['./diy-strategy.component.scss'],
})
export class DiyStrategyComponent {
  // Credit Deducated
  creditDeducated: number = 0;
  contentHumanizeCredit: number = 0;
  isBoostingCredit: number = 0;
  contentAnalyzeCredit: number = 0;

  //ScheduleDialog
  isScheduleDialogOpen: boolean = false;

  // Post Content
  postBody: any;
  isChangeInPost: boolean = false;
  isBoostingPost: boolean = false;

  // Post Media
  postMediaType: any;
  postMedia: any;

  // Post save and schedule
  isSaveDraft: boolean = false;

  // Genrated Post
  isGeneratePost: boolean = false;
  isAllowtoGeneratePost: boolean = true;

  // Ai settings
  aiFormality: string = 'causal';

  dialogRef: any;
  mediaDialogRef: any;

  currentProfile: any;

  // Custom Tabs
  diyCustomTabs: any = ['Preview', 'Humanization'];

  // Content humanization
  contentAnalyzeData: any;

  activeCustomTabs: any = 'Preview';
  constructor(
    public _post: PostService,
    private _dialog: MatDialog,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _sanitizer: DomSanitizer,
    public _utilities: CommonFunctionsService,
    public _generalService: GeneralService,
    public _globalService: GlobalService
  ) {}

  ngOnInit(): void {
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });

    this.creditDeducated =
      this._utilities?.userData?.plan?.advancedScheduleCredit;
    this.contentAnalyzeCredit =
      this._utilities?.userData?.plan?.contentAnalyzeCredit;
    this.contentHumanizeCredit =
      this._utilities?.userData?.plan?.contentHumanizeCredit;
    this.isBoostingCredit = this._utilities?.userData?.plan?.boostingCredit;

    this.setCurrentProfileData();
  }

  changeDiyCustomTabs(item: any) {
    this.activeCustomTabs = item;
  }

  setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  creditMessage(credit: any) {
    return `This will cost ${credit} credits`;
  }

  // Choice Media options

  choiceMediaOptions() {
    this.mediaDialogRef = this._dialog.open(SelectMediaComponent, {
      width: '960px',
      data: {},
    });
    this.mediaDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.postMedia = result?.url;
        this.postMediaType = result?.type;
      }
    });
  }

  // Post content actions

  editPostContent(action: any, subAction?: any) {
    let obj = {};
    obj = {
      promptAction: action,
      postContent: this.postBody,
    };
    if (subAction) {
      obj = { ...obj, rewriteType: subAction };
    }
    let isChatGPTVersion = this._utilities.chatGPTModel;
    this._loader.start(isChatGPTVersion);
    this._generalService.editPostContent(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._loader.stop();
          this.isChangeInPost = true;
          this.postBody = response?.data;
        } else {
          this._loader.stop();
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

  // genrate post content

  generatePost() {
    if (!this.postBody) {
      return;
    }
    let obj = {
      postContent: this.postBody,
    };
    let isChatGPTVersion = this._utilities.chatGPTModel;
    this._loader.start(isChatGPTVersion);
    this._generalService.generateDIYPostPrompt(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._loader.stop();
          let data = response?.data;
          this.isChangeInPost = true;

          this.postMediaType = data?.randomSelect;
          this.postMedia =
            data?.randomSelect == 'giphy'
              ? data?.giphyImageUrl
              : data?.pexelImageUrl;

          this.updatePostBody(data?.post);
          this.isAllowtoGeneratePost = false;
          this.contentAnalyzeData = '';
        } else {
          this._loader.stop();
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

  // Save and schedule

  scheduleDialogOpenClose() {
    this.isScheduleDialogOpen = !this.isScheduleDialogOpen;
  }

  savePost() {
    this.postScheduled();
    this.isSaveDraft = true;
  }

  postScheduled(scheduleData?: any) {
    let payload = {};
    payload = {
      postBody: this.postBody,
      generatedType: commonConstant.POSTGENERATETYPE.DIY_STRATEGY,
      status: commonConstant.POSTSTATUS.DRAFT,
      scheduleDateTime: new Date().getTime(),
    };

    if (this.postMedia) {
      payload = {
        ...payload,
        postMedia: this.postMedia,
        postMediaType: this.postMediaType,
      };
    }

    if (scheduleData) {
      payload = {
        ...payload,
        scheduleDateTime: scheduleData?.timestamp,
        timeSlot: scheduleData?.timeSlot,
        timePeriod: scheduleData?.timePeriod,
        status: commonConstant.POSTSTATUS.SCHEDULED,
      };
    }

    if (scheduleData?.boostingPost) {
      payload = {
        ...payload,
        isBoosting: scheduleData?.boostingPost,
        likeCount: scheduleData?.boosTypeSelected?.likes,
      };
    }
    this._loader.start();
    this._post.savePost(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.isScheduleDialogOpen = false;

          if (scheduleData && !this.isSaveDraft) {
            this.openConfirmPostScheduled();
            this._utilities.manageCredit(false, this.creditDeducated);
          }
          else
          {
            this._toastr.success("Post draft successfully");
          }

          if (this.isBoostingPost && !this.isSaveDraft) {
            this._utilities.manageCredit(false, this.isBoostingCredit);
          }

          this.dialogRef.close({ isSaveDraft: this.isSaveDraft });
          this._toastr.success(response?.message);
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

  
  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });
  }

  // Write content manually

  updatePostBody(text: string) {
    this.postBody = text;
    this.isChangeInPost = true;
  }

  // Content Analyze

  contentAnalyze() {
    if (this.contentAnalyzeData) {
      return;
    }
    let obj = {
      content: this.postBody,
    };
    this._loader.start();
    this._generalService.contentAnalyze(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.contentAnalyzeData = response?.data;
          this._utilities.manageCredit(false, this.contentAnalyzeCredit);
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

  // Content convert to humanize

  contentHumanize() {
    let obj = {
      content: this.postBody,
    };
    this._loader.start();
    this._generalService.contentHumanize(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._utilities.manageCredit(false, this.contentHumanizeCredit);
          this.postBody = response?.data;
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

  removeMedia() {
    this.postMediaType = null;
    this.postMedia = null;
  }
}
