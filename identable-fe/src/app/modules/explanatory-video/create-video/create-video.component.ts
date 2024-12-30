import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

// LIBRARY
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { AiVideoService } from '../../../providers/aiVideo/ai-video.service';
import { BrandKitService } from '../../../providers/brandkit/brand-kit.service';

// COMPONENTS
import { GeneratingVideoProcessingComponent } from '../dialog/generating-video-processing/generating-video-processing.component';
import { AudioListComponent } from '../../../shared/dialog/audio-list/audio-list.component';
import { ImageStyleComponent } from '../../../shared/dialog/image-style/image-style.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';
import { CreateBrandKitAlertComponent } from '../../../shared/dialog/create-brand-kit-alert/create-brand-kit-alert.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-create-video',
  templateUrl: './create-video.component.html',
  styleUrls: ['./create-video.component.scss'],
})
export class CreateVideoComponent {
  dialogRef: any;
  applyBrandKit: boolean = false;

  // Create video with
  genratedType: any = 'withIdea';

  // video form
  videoForm: FormGroup | any;
  submitted: boolean = false;
  submitGenrated: boolean = false;
  step: number = 1;

  // Video setting data
  videoLengthList: any = [
    {
      label: 'Short',
      value: 'short',
    },
    {
      label: 'Medium',
      value: 'medium',
    },
    {
      label: 'Long',
      value: 'long',
    },
  ];
  videoRatioList: any = [
    {
      label: 'Landscape',
      value: 'landscape',
    },
    {
      label: 'Portrait',
      value: 'portrait',
    },
    {
      label: 'Square',
      value: 'square',
    },
  ];

  // Voice Video
  selectedVideoVoiceName: any = 'Select video voice';
  selectedVideoVoice: any;

  // Video Illustration Style
  selectedImageType: any;
  videoBgColor: any;

  creditDeducated: number = 0;
  creditMessage: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private formBuilder: FormBuilder,
    public _aiVideoService: AiVideoService,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private _brandkit: BrandKitService
  ) {
    this.creditDeducated = this._utilities?.userData?.plan?.aIVideoCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;

    this.videoForm = this.formBuilder.group({
      idea: ['', [Validators.required]],
      url: [''], // URL field, required + custom URL validation
      color: [''],
      ratio: ['square'],
      length: ['short'],
      voice: ['', [Validators.required]],
      collection: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.videoForm.controls[controlName].hasError(errorName);
  };

  oneIdeaDailog() {
    let obj = { type: 'topic', title: 'Video idea' };

    this.dialogRef = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.videoForm.get('idea')?.setValue(result);
      }
    });
  }

  // Get brand kit

  switchOnBrandkit(event: any) {
    this.applyBrandKit = event.target.checked;
    if (event.target.checked) {
      this.getBrandKit();
    } else {
      this.videoBgColor = '';
    }
  }

  getBrandKit() {
    let param = {};
    this._brandkit.list(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          if (!response?.data) {
            this.openBrandkitAlert();
            return;
          }

          this.videoBgColor = response?.data?.primaryColor;
          this.videoForm.get('color')?.setValue(response?.data?.primaryColor);
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  openBrandkitAlert() {
    this.dialogRef = this._dialog.open(CreateBrandKitAlertComponent, {
      width: '600px',
      disableClose: false,
      data: {},
    });
  }

  choiceGenratedType(type: any) {
    this.genratedType = type;

    if (this.genratedType === 'withIdea') {
      this.videoForm.controls['idea'].setValidators([Validators.required]);
      this.videoForm.controls['url'].clearValidators();
    } else if (this.genratedType === 'withUrl') {
      this.videoForm.controls['url'].setValidators([
        Validators.required,
        this.urlValidator,
      ]);
      this.videoForm.controls['idea'].clearValidators();
    }
    this.videoForm.controls['idea'].updateValueAndValidity();
    this.videoForm.controls['url'].updateValueAndValidity();
  }

  // Voice Video

  openVideoVoiceList() {
    this.dialogRef = this._dialog.open(AudioListComponent, {
      width: '850px',
      backdropClass: '',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let isSelectedVideoVoice = result?.audio;
        this.selectedVideoVoice = result?.audio;

        this.selectedVideoVoiceName =
          isSelectedVideoVoice?.name +
          ' (' +
          isSelectedVideoVoice?.language +
          ')';
        this.videoForm.get('voice')?.setValue(isSelectedVideoVoice?.audioId);
      }
    });
  }

  // Video Illustration Style

  videoImageStyleDailog() {
    this.dialogRef = this._dialog.open(ImageStyleComponent, {
      width: '650px',
      backdropClass: '',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.selectedImageType = result?.imageType;
        console.log('this.selectedImageType', this.selectedImageType);
        this.videoForm.get('collection')?.setValue(this.selectedImageType);
      }
    });
  }

  // Color Setting

  onColorChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.videoBgColor = inputElement.value;
  }

  // Custom URL validation logic

  urlValidator(control: any) {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*' + // port and path
        '(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?' + // query string
        '(\\#[-a-zA-Z\\d_]*)?$'
    );
    return urlPattern.test(control.value) ? null : { invalidUrl: true };
  }

  // Handle form submission
  validateAndContinue() {
    this.submitted = true;
    if (
      this.genratedType === 'withIdea' &&
      this.videoForm.controls['idea'].invalid
    ) {
      return;
    } else if (
      this.genratedType === 'withUrl' &&
      this.videoForm.controls['url'].invalid
    ) {
      return;
    }
    this.step = 2;
  }

  // Go back to the previous step
  goBack() {
    if (this.step > 1) {
      this.step--;
    }
  }

  // genrated video

  generatingVideo() {
    let chatGPTModel = this._utilities.chatGPTModel;
    this.submitGenrated = true;
    if (this.videoForm.invalid) {
      return;
    }
    let obj = this.videoForm.value;
    this._loader.start(chatGPTModel);
    this._aiVideoService.genratedAiVideo(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._loader.stop();
          this._utilities.manageCredit(false, this.creditDeducated);
          this.router.navigate(['/explanatory-video']);
          // this.videoGeneratingProcessing();
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

  videoGeneratingProcessing() {
    this.dialogRef = this._dialog.open(GeneratingVideoProcessingComponent, {
      width: '480px',
      disableClose: true,
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.router.navigate(['/explanatory-video']);
      }
    });
  }
}
