import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//LIBRARY
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { AiVideoService } from '../../../providers/aiVideo/ai-video.service';
import { PostService } from 'src/app/providers/post/post.service';

// COMPONENTS
import { ProgressivePopupComponent } from '../../../shared/components/progressive-popup/progressive-popup.component';
import { GeneratedAivideoListComponent } from '../../../shared/dialog/generated-aivideo-list/generated-aivideo-list.component';
import { ConfirmPostScheduledComponent } from '../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';
import { EditLinkedinPostComponent } from '../../../shared/dialog/edit-linkedin-post/edit-linkedin-post.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';
import { AudioListComponent } from 'src/app/shared/dialog/audio-list/audio-list.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-ai-video',
  templateUrl: './ai-video.component.html',
  styleUrls: ['./ai-video.component.scss'],
})
export class AiVideoComponent implements OnInit {
  // Assign Ai video data
  color: string = '#512DA8';
  dummySelectedColor: any;
  collection: string = 'modern_illustrations';
  showColorPicker: boolean = false;

  videoUrl: string = '';
  submitted: boolean = false;
  isPromptVideo: boolean = true;
  isGeneratedVideo: boolean = false;

  selectedAudio: any;

  // Ai video form
  videoForm: FormGroup | any;

  // Other assign data
  isSampleVideo: boolean = false;

  // Sample Video
  sampleVideoPrompt: string =
    'Creating engaging marketing video under one minute';
  sampleVideoColor: string = '#c01b1b';

  scheduleDialogOpen: boolean = false;
  generatedTypeId: string = '';

  dialogRef: any;
  isPreview: boolean = false;
  currentProfile: any;

  useTopic: any;

  creditDeducated: number = 0;
  creditMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    public _aiVideoService: AiVideoService,
    private toastrService: ToastrService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    public _post: PostService,
    private _dialog: MatDialog,
    private _titleService: Title,
    private http: HttpClient
  ) {
    this.creditDeducated = this._utilities?.userData?.plan?.aIVideoCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;

    this._titleService.setTitle('Identable | Ai video');

    this._utilities.refreshAIVideoData = new Subject();
    this._utilities.refreshAIVideoData.subscribe((response: any) => {
      console.log('refreshAIVideoData response = ', response);

      this.videoUrl = response?.data?.videoUrl;
      this.generatedTypeId = response?.data?._id;
      this.dialogRef.close(true);
    });

    console.log('this.currentProfile', this.currentProfile);
    // this.openLoaderView();
    this.createVideoForm();
    //this.openLoaderView();
  }

  ngOnInit(): void {
    this.initView();
  }

  // Progressive Dialog

  openLoaderView() {
    this.dialogRef = this._dialog.open(ProgressivePopupComponent, {
      width: '500px',
      data: {},
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) {
        this.toastrService.error(MessageConstant.unknownError, '');
      }
    });
  }

  // Ai video list

  genratedVideoList() {
    this.dialogRef = this._dialog.open(GeneratedAivideoListComponent, {
      width: '900px',
      data: {},
      disableClose: false,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.videoUrl = result?.videoUrl;
        this.generatedTypeId = result?._id;
        this.isPreview = result?.isPreview;
      }
    });
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });

    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.videoForm.controls[controlName].hasError(errorName);
  };

  createVideoForm() {
    this.videoForm = this.formBuilder.group({
      topic: ['', [Validators.required]],
      url: [''],
      color: [''],
      ratio: ['square'],
      length: ['short'],
      voice: ['', [Validators.required]],
      collection: ['modern_illustrations', [Validators.required]],
    });
  }

  generateVideo() {
    let chatGPTModel = this._utilities.chatGPTModel;
    if (this.isSampleVideo) {
      this.loaderService.start(chatGPTModel);
      setTimeout(() => {
        this.videoUrl = commonConstant?.AIVIDEOGENERATE?.SAMPLE_URL;
        this.loaderService.stop();
        this.createVideoForm();
      }, 5000);
      return;
    }

    if (this._utilities.userData?.subscription?.aIVideoCredit <= 0) {
      this.toastrService.error(MessageConstant.creditNotAvaialbe, '');
      return;
    }

    this.submitted = true;
    if (this.videoForm.invalid) {
      return;
    }
    let obj = this.videoForm.value;
    obj = {
      ...obj,
      color: this.color,
    };
    if (obj?.topic) {
      this.useTopic = obj?.topic;
    } else {
      this.useTopic = obj?.url;
    }
    this.loaderService.start(chatGPTModel);
    this._aiVideoService.genratedAiVideo(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.loaderService.stop();
          this.isPreview = false;
          this.openLoaderView();
          this._utilities.manageCredit(false, this.creditDeducated);
        } else {
          this.loaderService.stop();
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastrService.error(error.message, '');
        } else {
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  downloadVideo() {
    this.loaderService.start();
    this.http
      .get(this.videoUrl, { responseType: 'blob' })
      .subscribe((data: any) => {
        const blob = new Blob([data], { type: 'video/mp4' });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = 'ai-video.mp4';
        downloadLink.click();
        this.loaderService.stop();
      });
  }

  openEditPost(index?: any) {
    let payload = {};
    console.log('this.videoForm.value', this.videoForm.value);

    payload = {
      isGeneratePost: true,
      postBody: this.useTopic,
      postMediaType: commonConstant.POSTGENERATETYPE.AI_VIDEO,
      generatedType: commonConstant.POSTGENERATETYPE.AI_VIDEO,
      postMedia: this.videoUrl,
      isCustomMedia: true,
    };

    payload = {
      ...payload,
      currentProfile: this.currentProfile,
    };

    this.dialogRef = this._dialog.open(EditLinkedinPostComponent, {
      width: '1140px',
      panelClass: 'custom-edit-post-modal',
      disableClose: true,
      data: payload,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (!result?.isSaveDraft) {
          this.openConfirmPostScheduled();
        }
      }
    });
  }

  // Choice genrated type

  choicegenratedType(value: any) {
    if (this.color) {
      this.dummySelectedColor = this.color;
    }
    this.isPromptVideo = value;
    this.videoForm.reset();
    this.videoForm.get('collection').setValue('modern_illustrations');
    this.submitted = false;
    this.videoForm.patchValue({ ratio: 'square' });
    this.videoForm.patchValue({ length: 'short' });
    if (value) {
      const controlsToCheck = ['url'];
      this.removeValidator(controlsToCheck);

      const addControlsToCheck = ['topic'];
      this.addValidator(addControlsToCheck);

    } else {
      const controlsToCheck = ['topic'];
      this.removeValidator(controlsToCheck);

      const addControlsToCheck = ['url'];
      this.addValidator(addControlsToCheck);
    }
    this.videoForm.get('color').setValue(this.dummySelectedColor);
  }

  scheduleDialogOpenClose(status: boolean) {
    if (status) {
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  removeValidator(controlsToCheck: any) {
    controlsToCheck.forEach((controlName: any) => {
      const control = this.videoForm.get(controlName);
      control.clearValidators();
      control.updateValueAndValidity();
    });
  }

  addValidator(controlsToCheck: any) {
    controlsToCheck.forEach((controlName: any) => {
      const control = this.videoForm.get(controlName);
      control.setValidators(Validators.required);
      control.updateValueAndValidity();
    });
  }

  // Sample Video

  createSampleVideo() {
    this.isSampleVideo = true;
    this.isPromptVideo = true;
    this.videoForm.patchValue({
      topic: this.sampleVideoPrompt,
    });
    this.color = this.sampleVideoColor;
  }

  clearVideo() {
    this.videoUrl = '';
    this.isSampleVideo = false;
    this.color = '#333856';
    this.createVideoForm();
  }

  onChangeCollection(event: any) {
    this.collection = event.target.value;
  }

  // Color Picker

  toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  onColorChange(event: any) {
    this.color = event?.color?.hex;
  }

  postScheduled(scheduleData: any) {
    if (!this.videoUrl) {
      this.toastrService.error('Video not found', '');
      return;
    }

    let payload = {};
    payload = {
      postBody: ' ',
      generatedType: commonConstant.POSTGENERATETYPE.AI_VIDEO,
      status: commonConstant.POSTSTATUS.SCHEDULED,
      postMedia: this.videoUrl,
      generatedTypeId: this.generatedTypeId,
      postMediaType: commonConstant.POSTMEDIATYPE.AI_VIDEO,
    };

    if (scheduleData) {
      payload = {
        ...payload,
        scheduleDateTime: scheduleData?.timestamp,
        timeSlot: scheduleData?.timeSlot,
        timePeriod: scheduleData?.timePeriod,
      };
    }

    this.loaderService.start();
    this._post.savePost(payload).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.scheduleDialogOpen = false;
          let advancedScheduleCredit =
            this._utilities?.userData?.plan?.advancedScheduleCredit;
          this._utilities.manageCredit(false, advancedScheduleCredit);
          this.toastrService.success(response?.message);
          this.loaderService.stop();
          this.openConfirmPostScheduled();
        } else {
          this.loaderService.stop();
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastrService.error(error.message, '');
        } else {
          this.toastrService.error(MessageConstant.unknownError, '');
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

  oneIdeaDailog() {
    let obj = { type: 'topic' };

    this.dialogRef = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.videoForm.patchValue({
          topic: result,
        });
      }
    });
  }

  audioListDailog() {
    this.dialogRef = this._dialog.open(AudioListComponent, {
      width: '650px',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.selectedAudio = result?.audio;
        this.videoForm.patchValue({ voice: this.selectedAudio?.audioId });
      }
    });
  }
}
