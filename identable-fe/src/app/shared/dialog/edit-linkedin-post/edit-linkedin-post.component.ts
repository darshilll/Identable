import {
  Component,
  Inject,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

//services
import { PostService } from 'src/app/providers/post/post.service';
import { LoaderService } from 'src/app/providers/loader-service/loader.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/providers/general/general.service';

// COMPOMENT
import { GiphyListComponent } from '../../components/giphy-list/giphy-list.component';
import { PixelImageVideoComponent } from '../../components/pixel-image-video/pixel-image-video.component';
import { WarningEditPostComponent } from '../warning-edit-post/warning-edit-post.component';
import { AiImageGenerateComponent } from '../ai-image-generate/ai-image-generate.component';
import { SelectMediaComponent } from '../../../shared/common/select-media/select-media.component';

//UTILS
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { ConfirmPostScheduledComponent } from '../confirm-post-scheduled/confirm-post-scheduled.component';

@Component({
  selector: 'app-edit-linkedin-post',
  templateUrl: './edit-linkedin-post.component.html',
  styleUrls: ['./edit-linkedin-post.component.scss'],
})
export class EditLinkedinPostComponent implements OnInit {
  @ViewChild('htmlContent', { static: false }) htmlContent!: ElementRef;
  @ViewChildren('slide') slides!: QueryList<ElementRef>;

  //ScheduleDialog
  isScheduleDialogOpen: boolean = false;
  isBoostingCredit: number = 0;
  creditDeducated: number = 0;
  contentAnalyzeCredit: number = 0;
  contentHumanizeCredit: number = 0;
  isBoostingPost: boolean = false;

  isChangeInPost: boolean = false;
  isPostAnalysis: boolean = false;

  // Third Party Api Dialog
  mediaDialogRef: any;
  giphyDialogRef: any;
  pixelDialogRef: any;
  aiImageDialog: any;

  isContentAnalyzeData: any;
  isContentHumanize: boolean = false;
  isBtnAnalyzeText: any = 'text';
  contentMarkedType: any;

  postBody: any;
  generatedType: any;
  newsLink: any;
  postMediaType: any;
  postMedia: any;
  currentProfile: any;
  postId: any;
  scheduleBtnText: string = 'Schedule';

  isGeneratePost: boolean = false;
  isAllowtoGeneratePost: boolean = false;
  aiFormality: string = 'causal';
  isSaveDraft: boolean = false;
  carouselTemplate: any;
  config: AngularEditorConfig = {
    height: '20rem',
    minHeight: '10rem',
    editable: true,
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo', 'link', 'unlink', 'insertHorizontalRule'], // Hide option buttons
    ],
  };

  // Slider Config
  slideConfig = { slidesToShow: 1, slidesToScroll: 1, dots: true };

  // Custom Tabs
  diyCustomTabs: any = ['Preview', 'Humanization'];
  activeCustomTabs: any = 'Preview';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditLinkedinPostComponent>,
    private _dialog: MatDialog,
    public _post: PostService,
    public _sanitizer: DomSanitizer,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _generalService: GeneralService
  ) {
    this.creditDeducated =
      this._utilities?.userData?.plan?.advancedScheduleCredit;
  }

  ngOnInit(): void {
    if (this.data) {
      this.setDataForEditPost(this.data);
    }
    this.isBoostingCredit = this._utilities?.userData?.plan?.boostingCredit;
    this.contentAnalyzeCredit =
      this._utilities?.userData?.plan?.contentAnalyzeCredit;
    this.contentHumanizeCredit =
      this._utilities?.userData?.plan?.contentHumanizeCredit;
  }

  creditMessage(credit: any) {
    return `This will cost ${credit} credits`;
  }

  changeDiyCustomTabs(item: any) {
    this.activeCustomTabs = item;
  }

  setDataForEditPost(data: any) {
    this.postBody = this.removeHtmlTagsAndFormat(data?.postBody);
    this.generatedType = data?.generatedType;
    this.newsLink = data?.newsLink;
    this.postMediaType = data?.postMediaType;
    this.postMedia = data?.postMedia;
    this.currentProfile = data?.currentProfile;
    this.postId = data?.postId;
    this.carouselTemplate = data?.carouselTemplate;
    this.isSaveDraft =
      data?.status == commonConstant.POSTSTATUS.DRAFT ? true : false;
    if (this.postId && !this.isSaveDraft) {
      this.scheduleBtnText = 'Reschedule';
    }
    if (data?.isGeneratePost) {
      this.isGeneratePost = true;
      this.isAllowtoGeneratePost = true;
    }
  }

  updatePostBody(text: string) {
    this.postBody = text;
    this.isChangeInPost = true;
  }

  removeMedia() {
    this.isChangeInPost = true;
    this.postMediaType = null;
    this.postMedia = null;
  }

  scheduleDialogOpenClose() {
    this.isScheduleDialogOpen = !this.isScheduleDialogOpen;
  }

  savePost() {
    this.postScheduled();
    this.isSaveDraft = true;
  }

  postScheduled(scheduleData?: any) {
    if (this.postMediaType == 'carousel' && !this.postMedia) {
      this.generatePDF(scheduleData);
      return;
    }
    let payload = {};
    payload = {
      postBody: this.postBody,
      generatedType: this.generatedType,
      generatedTypeId: this.data?.generatedTypeId,
      status: commonConstant.POSTSTATUS.DRAFT,
      scheduleDateTime: new Date().getTime(),
    };

    if (this.data?.carouselTemplate?.length) {
      payload = {
        ...payload,
        carouselTemplate: this.data?.carouselTemplate,
        documentDescription: this.data?.documentDescription,
      };
    }

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

    if (
      this.isGeneratePost &&
      this.postMediaType != 'carousel' &&
      this.postMediaType != 'aivideo'
    ) {
      payload = {
        ...payload,
        generatedType: commonConstant?.POSTGENERATETYPE.DIY_STRATEGY,
      };
    }

    if (this.postId) {
      payload = {
        ...payload,
        postId: this.postId,
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
          if (!this.isSaveDraft) {
            if (scheduleData && !this.postId) {
              this.openConfirmPostScheduled();
              this._utilities.manageCredit(false, this.creditDeducated);
            }

            if (this.isBoostingPost && !this.isSaveDraft) {
              this._utilities.manageCredit(false, this.isBoostingCredit);
            }

            this.dialogRef.close({ isSaveDraft: this.isSaveDraft });
            this._toastr.success(response?.message);
            this._loader.stop();
          } else {
            this._toastr.success('Post draft successfully');
          }
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

  // Giphy Api

  showGiphyList() {
    this.giphyDialogRef = this._dialog.open(GiphyListComponent, {
      width: '800px',
      data: {},
    });

    this.giphyDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.isChangeInPost = true;
        this.postMedia = result;
        this.postMediaType = commonConstant.POSTMEDIATYPE.GIPHY;
      }
    });
  }

  // Pixel Api

  showPixel() {
    this.pixelDialogRef = this._dialog.open(PixelImageVideoComponent, {
      width: '900px',
      data: {},
    });

    this.pixelDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.isChangeInPost = true;
        this.postMedia = result?.url;
        this.postMediaType = commonConstant.POSTMEDIATYPE.IMAGE;
      }
    });
  }

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

  onSelectFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file.type.indexOf('image') > -1 && file?.size / 1024 / 1024 > 2) {
      this._toastr.error('file is bigger than 2MB');
      return;
    }
    if (file.type.indexOf('video') > -1 && file?.size / 1024 / 1024 > 10) {
      this._toastr.error('file is bigger than 10MB');
      return;
    }
    if (file.type.indexOf('pdf') > -1 && file?.size / 1024 / 1024 > 2) {
      this._toastr.error('file is bigger than 2MB');
      return;
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      this._loader.start();
      const formData = new FormData();
      formData.append('file', file, file.name);
      this._generalService.uploadFile(formData).subscribe(
        (response: ResponseModel) => {
          if (response.statusCode == 200) {
            this.isChangeInPost = true;
            this._loader.stop();
            if (file.type.indexOf('image') > -1) {
              this.postMediaType = commonConstant.POSTMEDIATYPE.IMAGE;
            } else if (file.type.indexOf('video') > -1) {
              this.postMediaType = commonConstant.POSTMEDIATYPE.VIDEO;
            } else if (file.type.indexOf('pdf') > -1) {
              this.postMediaType = commonConstant.POSTMEDIATYPE.CAROUSEL;
            }
            this.postMedia = response?.data[0]?.url;
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
  }

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

          if (
            this.postMediaType != 'aivideo' &&
            this.postMediaType != 'carousel'
          ) {
            this.postMediaType = data?.randomSelect;
            this.postMedia =
              data?.randomSelect == 'giphy'
                ? data?.giphyImageUrl
                : data?.pexelImageUrl;
          }
          this.updatePostBody(data?.post);
          this.isAllowtoGeneratePost = false;
          this.isContentAnalyzeData = '';
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

  async generatePDF(scheduleData?: any) {
    this._loader.start();

    const slidesArray = this.slides.toArray();

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 120],
    });
    pdf.setFillColor(255, 255, 255, 0);
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
      'F'
    );

    for (let index = 0; index < slidesArray.length; index++) {
      const slide = slidesArray[index];
      if (slide) {
        const imgData = await html2canvas(slide.nativeElement, {
          backgroundColor: 'transparent',
        }).then((canvas) => canvas.toDataURL('image/png'));

        pdf.addImage(imgData, 'PNG', 0, 0, 100, 120);

        if (index !== slidesArray.length - 1) {
          pdf.addPage();
        }
      }
    }
    const pdfBlob = pdf.output('blob');
    this.uploadPDFFile(pdfBlob, scheduleData);
  }

  uploadPDFFile(pdfBlob: Blob, scheduleData?: any) {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'document.pdf');

    this._generalService.uploadFile(formData).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.postMedia = response?.data[0]?.url;
          this.postScheduled(scheduleData);
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
  removeHtmlTagsAndFormat(input: any) {
    if (input) {
      // Replace specific tags with newlines for better formatting
      try {
        const tagReplacements = {
          '<h1>': '\n',
          '</h1>': '\n',
          '<h2>': '\n',
          '</h2>': '\n',
          '<h3>': '\n',
          '</h3>': '\n',
          '<h4>': '\n',
          '</h4>': '\n',
          '<h5>': '\n',
          '</h5>': '\n',
          '<h6>': '\n',
          '</h6>': '\n',
          '<p>': '\n',
          '</p>': '\n',
          '<br>': '\n',
          '<br/>': '\n',
          '<br />': '\n',
          '<li>': '\n- ',
          '</li>': '',
          '<ul>': '\n',
          '</ul>': '\n',
          '<ol>': '\n',
          '</ol>': '\n',
        };

        // Replace tags with appropriate formatting
        for (const [tag, replacement] of Object.entries(tagReplacements)) {
          input = input.split(tag).join(replacement);
        }

        // Remove all other HTML tags
        let formattedString = input.replace(/<[^>]*>/g, '');

        // Trim extra white spaces and normalize line breaks
        // formattedString = formattedString.replace(/\n\s*/g, '\n').trim();

        return formattedString;
      } catch (error) {
        console.error('error = ', error);
        return '';
      }
    }

    return '';
  }

  close() {
    if (!this.isChangeInPost) {
      this.dialogRef.close();
      return;
    }
    this.giphyDialogRef = this._dialog.open(WarningEditPostComponent, {
      width: '550px',
      data: {},
    });

    this.giphyDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.dialogRef.close();
      }
    });
  }

  aiImageDailog() {
    let data = {
      topic: this.postBody,
    };
    this.aiImageDialog = this._dialog.open(AiImageGenerateComponent, {
      width: '550px',
      data: data,
    });

    this.aiImageDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.postMedia = result?.image;
        this.postMediaType = commonConstant.POSTMEDIATYPE.IMAGE;
      }
    });
  }

  isPostAnalysisDialog() {
    this.isPostAnalysis != this.isPostAnalysis;
  }

  contentMarked(type: boolean) {
    let status = type ? 'like' : 'dislike';
    this.contentMarkedType = status;
    let obj = {
      status: status,
      content: this.postBody,
    };
    this._loader.start();
    this._generalService.contentMarked(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          this._toastr.success(response?.data);
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

  contentAnalyze() {
    if (this.isContentAnalyzeData) {
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
          this.isContentAnalyzeData = response?.data;
          this._utilities.manageCredit(false, this.contentAnalyzeCredit);
          this.isBtnAnalyzeText = 'Complete';
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
          this.isPostAnalysis = false;
          this.isContentHumanize = true;
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

  openPostAnalysisDialog() {
    if (!this.isContentHumanize) {
      this.isPostAnalysis = !this.isPostAnalysis;
    }
    this.contentAnalyze();
  }

  closeDialog() {
    this.isPostAnalysis = false;
  }
}
