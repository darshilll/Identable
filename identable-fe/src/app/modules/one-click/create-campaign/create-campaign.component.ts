import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { OneClickService } from '../../../providers/oneClick/one-click.service';
import { GeneralService } from '../../../providers/general/general.service';

//COMPONENTS
import { ImageStyleComponent } from '../../../shared/dialog/image-style/image-style.component';
import { CarouselTemplateListComponent } from '../../../shared/dialog/carousel-template-list/carousel-template-list.component';
import { GenerateCommonPromptComponent } from '../../../shared/dialog/generate-common-prompt/generate-common-prompt.component';
import { AudioListComponent } from '../../../shared/dialog/audio-list/audio-list.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss'],
})
export class CreateCampaignComponent {
  progression: number = 20;
  campaignList: any;
  campaignScheduleData: any;
  themColor: any = '#1849a9';
  selectedVideoVoiceName: any = 'Select video voice';
  selectedVideoVoice: any;
  selectedImageType: any;
  selectedCarouselTemp: any;

  isCampaignStartDateDisabled: boolean = false;

  versionThemeList: any = commonConstant.versionPromtTheme;
  versionAList: any = ([] = this.versionThemeList);
  versionBList: any = ([] = this.versionThemeList);

  suggestionGoalOfCampaign: any;
  suggestionTopic: any;
  suggestionKeyword: any;

  scheduleData: any;

  selectedImageStyle: any;

  imageStyles = [
    {
      value: 'ai-image',
      label: 'AI Image',
      icon: 'assets/images/star-two.svg',
    },
    {
      value: 'giphy',
      label: 'Giphy',
      icon: 'assets/images/image-giphy-24.png',
    },
    {
      value: 'pexel-image',
      label: 'Pexel Image',
      icon: 'assets/images/pixels-icon.png',
    },
  ];

  campaignTimePeriodList: any = [
    'this week',
    '15 days',
    'one month',
    'two month',
  ];
  includeList: any = [
    {
      title: 'Inspire Me',
      image: 'assets/images/content-type-1.png',
      value: 'inspireMe',
    },
    {
      title: 'Explanatory video',
      image: 'assets/images/content-type-2.png',
      value: 'explanatoryVideo',
    },
    {
      title: 'Carousel',
      image: 'assets/images/content-type-3.png',
      value: 'carousel',
    },
    {
      title: 'Article',
      image: 'assets/images/content-type-4.png',
      value: 'article',
    },
    {
      title: 'Trending news',
      image: 'assets/images/content-type-5.png',
      value: 'trendingNews',
    },
  ];

  videoLengthList: any = ['Short', 'Medium', 'Long'];
  videoRatioList: any = ['Landscape', 'Portrait', 'Square'];

  hasErrorInput: any;
  dialogRef: any;

  currentPage: number = 1;

  campaignForm: FormGroup;

  youtubeLink: any;
  authoLink: any;
  youtubeVideos: any = [];
  authorityLinks: any = [];
  isInvalidYoutubeLink: boolean = false;

  constructor(
    private _titleService: Title,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _dialog: MatDialog,
    private _oneClick: OneClickService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _generalService: GeneralService,
    public _utilities: CommonFunctionsService,
    public _ngxLoader: NgxUiLoaderService
  ) {
    this._titleService.setTitle('Identable | One Click - Create Campaign');
    this.campaignForm = this.formBuilder.group({
      topic: ['', [Validators.required]],
      goal: ['', [Validators.required]],
      keyword: [[], [Validators.required]],
      includeContentType: [[], [Validators.required]],
      isStartImmediately: [false],
      isWeekendInclude: [false],
      isABVersion: [false],
      isBrandKit: [false],
      startDate: ['', [Validators.required]],
      duration: ['this week', [Validators.required]],
      dailyPost: [2, [Validators.required]],
      videoLength: ['Short'],
      videoRatio: ['Landscape'],
      videoVoice: ['', [Validators.required]],
      videoCollection: ['', [Validators.required]],
      carouselTemplate: ['', [Validators.required]],
      color: [this.themColor, [Validators.required]],
      imageStyle: ['', [Validators.required]],
      themeVersionA: [''],
      themeVersionB: [''],
      // isFAQ: [false],
      // isConclusion: [false],
      // isHandle: [false],
      // isYoutubeInclude: [false],
      // isAuthorityLinkInclude: [false],
    });
    const today = new Date().toISOString().split('T')[0];
    this.campaignForm.get('startDate')?.setValue(today);
    this.suggestionGoalOfCampaign =
      this._utilities.oneClickCampaignGoalSuggestion;
    this.suggestionKeyword = this._utilities.oneClickKeywordSuggestion;
    this.suggestionTopic = this._utilities.oneClickTopicSuggestion;
    if (!this.suggestionGoalOfCampaign?.length) {
      this.getCampaignGoalSuggestion();
    }
  }

  videoImageStyleDailog() {
    this.dialogRef = this._dialog.open(ImageStyleComponent, {
      width: '650px',
      backdropClass: '',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.selectedImageType = result?.imageType;
        this.campaignForm
          .get('videoCollection')
          ?.setValue(this.selectedImageType);
      }
    });
  }

  selectImageStyle(event: any) {
    let imageStyle = event?.value?.value;
    this.campaignForm.get('imageStyle')?.setValue(imageStyle);
  }

  carouselTemplateListDialog() {
    this.dialogRef = this._dialog.open(CarouselTemplateListComponent, {
      width: '650px',
      backdropClass: '',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.selectedCarouselTemp = result?.theme;
        this.campaignForm
          .get('carouselTemplate')
          ?.setValue(this.selectedCarouselTemp?.name);
      }
    });
  }

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
        this.campaignForm
          .get('videoVoice')
          ?.setValue(isSelectedVideoVoice?.audioId);
      }
    });
  }

  onclickNext() {
    if (this.currentPage == 1) {
      if (this.hasError('goal', 'required')) {
        this.hasErrorInput = 'campaignGoal';
        return;
      }
      if (!this.suggestionTopic?.length) {
        this.getTopicSuggestion();
      }
    }
    if (this.currentPage == 2) {
      if (this.hasError('topic', 'required')) {
        this.hasErrorInput = 'topic';
        return;
      }

      if (!this.suggestionKeyword?.length) {
        this.getKeywordSuggestion();
      }
    }
    if (this.currentPage == 3 && this.hasError('keyword', 'required')) {
      this.hasErrorInput = 'keyword';
      return;
    }
    if (
      this.currentPage == 3 &&
      this.hasError('includeContentType', 'required')
    ) {
      this.hasErrorInput = 'includeContentType';
      return;
    }

    if (this.currentPage == 4) {
      let isChecked = this.campaignForm.get('isABVersion')?.value;
      if (isChecked) {
        if (this.hasError('themeVersionA', 'required')) {
          this.hasErrorInput = 'themeVersionA';
          return;
        }
        if (this.hasError('themeVersionB', 'required')) {
          this.hasErrorInput = 'themeVersionB';
          return;
        }
      }
    }

    if (this.currentPage == 5) {
      if (this.hasError('videoVoice', 'required')) {
        this.hasErrorInput = 'videoVoice';
        return;
      }
      if (this.hasError('videoCollection', 'required')) {
        this.hasErrorInput = 'videoCollection';
        return;
      }
      if (this.hasError('carouselTemplate', 'required')) {
        this.hasErrorInput = 'carouselTemplate';
        return;
      }
      if (this.hasError('imageStyle', 'required')) {
        this.hasErrorInput = 'imageStyle';
        return;
      }
      this.createCampaign();
      return;
    }

    this.progression = this.progression + 20;
    this.currentPage = this.currentPage + 1;
  }

  onClickBack() {
    this.progression = this.progression - 20;
    this.currentPage = this.currentPage - 1;
  }

  submitted(input: any) {
    if (input == this.hasErrorInput) {
      return true;
    }
    return false;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.campaignForm.controls[controlName].hasError(errorName);
  };

  selectCampaignGoalSuggestion(suggestion: any) {
    this.campaignForm.get('goal')?.setValue(this.toSentenceCase(suggestion));
  }

  selectTopicSuggestion(suggestion: any) {
    this.campaignForm.get('topic')?.setValue(suggestion);
  }

  autoGenerateTopic() {
    let obj = { type: 'topic' };

    this.dialogRef = this._dialog.open(GenerateCommonPromptComponent, {
      width: '550px',
      data: obj,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.campaignForm.get('topic')?.setValue(result);
      }
    });
  }

  selectInclude(event: any) {
    let isChecked = event?.target?.checked;
    let isValue = event?.target?.value;
    let formValue = this.campaignForm.get('includeContentType')?.value;

    if (isChecked) {
      if (!formValue.includes(isValue)) {
        formValue.push(isValue);
        this.campaignForm.get('includeContentType')?.setValue(formValue);
      }
    } else {
      const index = formValue.indexOf(isValue);
      if (index > -1) {
        formValue.splice(index, 1);
        this.campaignForm.get('includeContentType')?.setValue(formValue);
      }
    }
  }

  getCampaignGoalSuggestion() {
    this._ngxLoader.startLoader('CAMPAIGN-GOAL');
    let obj = {
      designation: 'Ai developer',
      promptAction: 'campaignGoal',
    };
    this._generalService.commonPrompt(obj).subscribe(
      (response: ResponseModel) => {
        this._ngxLoader.stopLoader('CAMPAIGN-GOAL');
        if (response.statusCode == 200) {
          this.suggestionGoalOfCampaign = response?.data?.data;
          this._utilities.oneClickCampaignGoalSuggestion = response?.data?.data;
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

  getTopicSuggestion() {
    this._ngxLoader.startLoader('CAMPAIGN-TOPIC');
    let obj = {
      designation: 'Ai developer',
      promptAction: 'campaignTopic',
    };
    this._generalService.commonPrompt(obj).subscribe(
      (response: ResponseModel) => {
        this._ngxLoader.stopLoader('CAMPAIGN-TOPIC');
        if (response.statusCode == 200) {
          this.suggestionTopic = response?.data?.data;
          this._utilities.oneClickTopicSuggestion = response?.data?.data;
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

  getKeywordSuggestion() {
    let obj = {
      designation: 'Ai developer',
      promptAction: 'campaignKeyword',
    };
    this._ngxLoader.startLoader('CAMPAIGN-KEYWORD');
    this._generalService.commonPrompt(obj).subscribe(
      (response: ResponseModel) => {
        this._ngxLoader.stopLoader('CAMPAIGN-KEYWORD');
        if (response.statusCode == 200) {
          this.suggestionKeyword = response?.data?.data;
          this._utilities.oneClickKeywordSuggestion = response?.data?.data;
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

  createCampaign() {
    let obj = this.campaignForm.value;
    let startDate = this.campaignForm.get('startDate')?.value;
    obj = {
      ...obj,
      startDate: new Date(startDate).getTime(),
      carouselId: this.selectedCarouselTemp?.templateId,
    };

    let includeContentType = obj?.includeContentType;
    obj.includeContentType = [...new Set(includeContentType)];

    this._loader.start();
    this._oneClick.getOneClickSchedule(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this.scheduleData = response?.data;
          this.currentPage = 6;
        } else {
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        if (err.error) {
          this._loader.stop();
          const error: ResponseModel = err.error;
          this._toastr.error(error.message, '');
        } else {
          this._loader.stop();
          this._toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  selectKeyword(keyword: any) {
    let isInclude = this.campaignForm.get('keyword')?.value?.includes(keyword);
    if (isInclude) {
      return;
    }
    let value = this.campaignForm.get('keyword')?.value;
    value.push(keyword);
    this.campaignForm.get('keyword')?.setValue(value);
  }

  checkSelectedKeyword(keyword: any) {
    return this.campaignForm.get('keyword')?.value?.includes(keyword);
  }

  removeKeyword(keyword: any) {
    let value = this.campaignForm.get('keyword')?.value || [];
    let updatedKeyword = value.filter((x: any) => x !== keyword);

    this.campaignForm.get('keyword')?.setValue(updatedKeyword);
  }

  checkActiveGoalSuggetion(value: string): boolean {
    return this.campaignForm.get('goal')?.value == value ? true : false;
  }

  checkActiveTopicSuggetion(value: string): boolean {
    return this.campaignForm.get('topic')?.value == value ? true : false;
  }

  isIncludeChecked(value: any): boolean {
    let checkValue = this.campaignForm.get('includeContentType')?.value;
    return checkValue.includes(value);
  }

  selectABVersion(event: any) {
    let isChecked = event.target.checked;
    if (isChecked) {
      this.campaignForm
        .get('themeVersionA')
        ?.setValidators([Validators.required]);
      this.campaignForm
        .get('themeVersionB')
        ?.setValidators([Validators.required]);
      this.campaignForm.get('themeVersionA')?.updateValueAndValidity();
      this.campaignForm.get('themeVersionB')?.updateValueAndValidity();
    } else {
      this.campaignForm.get('themeVersionA')?.clearValidators();
      this.campaignForm.get('themeVersionB')?.clearValidators();
      this.campaignForm.get('themeVersionA')?.updateValueAndValidity();
      this.campaignForm.get('themeVersionB')?.updateValueAndValidity();
      this.campaignForm.get('themeVersionA')?.setValue('');
      this.campaignForm.get('themeVersionB')?.setValue('');
    }
  }

  checkDailyPostCount() {
    const dailPost = this.campaignForm.get('dailyPost')?.value || 0;
    if (dailPost == 1) {
      this.campaignForm.get('isABVersion')?.setValue(false);
      this.campaignForm.get('themeVersionA')?.setValue('');
      this.campaignForm.get('themeVersionB')?.setValue('');
      return false;
    }
    return true;
  }

  selectCampaignTime(value: any) {
    this.campaignForm.get('duration')?.setValue(value);
  }

  activeABVersion() {
    return this.campaignForm.get('isABVersion')?.value;
  }

  isCampaignTimeChecked(value: string): boolean {
    return this.campaignForm.get('duration')?.value == value;
  }

  inquiriesNumberOfPostDay() {
    const currentValue = this.campaignForm.get('dailyPost')?.value || 0;
    if (currentValue == 2) {
      return;
    }
    this.campaignForm.get('dailyPost')?.setValue(currentValue + 1);
  }

  decreaseNumberOfPostDay() {
    const currentValue = this.campaignForm.get('dailyPost')?.value || 0;
    if (currentValue == 1) {
      return;
    }
    this.campaignForm.get('dailyPost')?.setValue(currentValue - 1);
  }

  setStartImmediately(event: any) {
    let isChecked = event?.target?.checked;
    if (isChecked) {
      this.isCampaignStartDateDisabled = true;
      const today = new Date().toISOString().split('T')[0];
      this.campaignForm.get('startDate')?.setValue(today);
    } else {
      this.isCampaignStartDateDisabled = false;
    }
  }

  saveCampaign(event: any) {
    let payload = {
      ...this.campaignForm.value,
      scheduleData: event?.scheduleData,
      carouselId: this.selectedCarouselTemp?.templateId,
    };
    let startDate = this.campaignForm.get('startDate')?.value;
    payload.startDate = new Date(startDate).getTime();
    this._loader.start();
    this._oneClick.generateOneClick(payload).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this._utilities.manageCredit(false, event?.creditDeducated);
          this.router.navigate(['oneclick']);
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

  toSentenceCase(str: string): string {
    return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
      return c.toUpperCase();
    });
  }

  // ================== Article Settings ==================

  addYoutubeLink() {
    if (this.youtubeVideos?.length > 1) {
      return;
    }
    const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;

    if (!youtubeRegex.test(this.youtubeLink)) {
      this.isInvalidYoutubeLink = true;
      return;
    }
    this.youtubeVideos.push(this.youtubeLink);
    this.youtubeLink = '';
  }

  addAuthorityLink() {
    if (this.authorityLinks?.length > 2) {
      return;
    }
    this.authorityLinks.push(this.authoLink);
    this.authoLink = '';
  }

  deleteAuthorityLink(index: any) {
    this.authorityLinks.splice(index, 1);
  }

  deleteYoutubeLink(index: any) {
    this.youtubeVideos.splice(index, 1);
  }
}
