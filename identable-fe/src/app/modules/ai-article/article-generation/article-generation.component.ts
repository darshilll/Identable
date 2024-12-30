import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

//LIBRARY
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { AiArticleService } from '../../../providers/ai-article/ai-article.service';
import { GeneralService } from 'src/app/providers/general/general.service';
import { PostService } from 'src/app/providers/post/post.service';

// COMPONENTS
import { ArticleEditerComponent } from '../../../shared/dialog/article-editer/article-editer.component';
import { ConfirmPostScheduledComponent } from '../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';
import { AddArticleOutlineComponent } from '../../../shared/dialog/add-article-outline/add-article-outline.component';
import { GenerateArticleBannerComponent } from '../../../shared/dialog/generate-article-banner/generate-article-banner.component';
import { AiImageGenerateComponent } from '../../../shared/dialog/ai-image-generate/ai-image-generate.component';
import { GenerateCommonPromptComponent } from 'src/app/shared/dialog/generate-common-prompt/generate-common-prompt.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-article-generation',
  templateUrl: './article-generation.component.html',
  styleUrls: ['./article-generation.component.scss'],
})
export class ArticleGenerationComponent implements OnInit {
  articleTopicList: any;
  articleOutline: any;
  isTopicGeneration: boolean = false;
  identableFeatures: boolean = false;
  topic: string = '';
  selectedTopic: any;
  selectedArticle: any;
  isSubmitTopic: boolean = false;
  isTopicSelected: boolean = false;
  isStep: number = 1;
  isSelectedTopicIndex: number = 0;
  isSelectedArticleIndex: number = 0;
  article: any;
  postId: any;
  articleTitle: any;
  coverImage: any;
  editData: any;
  isChatGPTVersion: any;
  scheduleDialogOpen: boolean = false;
  isSubmited: boolean = false;
  dialogRef: any;
  navigationBtn: string = 'Next';
  conclusion: string = '';

  config: AngularEditorConfig = {
    height: '20rem',
    minHeight: '40rem',
    editable: true,
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo'], // Specify buttons to hide from the toolbar
    ],
  };

  creditDeducated: number = 0;
  creditMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    public _AiArticleService: AiArticleService,
    private _titleService: Title,
    private _dialog: MatDialog,
    public _generalService: GeneralService,
    public _post: PostService
  ) {
    this._titleService.setTitle('Identable | Ai Article');
    this.creditDeducated = this._utilities?.userData?.plan?.articleCredit;
    this.creditMessage = `This will cost ${this.creditDeducated} credits`;
  }

  ngOnInit(): void {
    this.editData = history.state;
    if (this.editData) {
      this.article = this.editData?.postBody;
      this.articleTitle = this.editData?.articleTitle;
      this.postId = this.editData?.postId;
      if (this.editData?.postMedia) {
        this.coverImage = this.editData?.postMedia;
      }
    }
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.isChatGPTVersion = this._utilities.chatGPTModel;
  }

  nextSubmit() {
    switch (this.isStep) {
      case 1:
        this.generateTopic();
        break;
      case 2:
        this.generateOutlineOutput();
        break;
      case 3:
        this.generateArticle();
        break;

      default:
        break;
    }
  }

  generateTopic() {
    this.isSubmitTopic = true;

    if (!this.topic) {
      return;
    }

    this._loader.start(this.isChatGPTVersion);
    let obj = {
      topic: this.topic,
    };
    this._AiArticleService.generateTopic(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.isSelectedTopicIndex = 0;
          this.isTopicGeneration = true;
          this.articleTopicList = response?.data?.data;
          this.selectedTopic = this.articleTopicList[this.isSelectedTopicIndex];
          this.articleTitle = this.selectedTopic?.title;
          this.isStep = 2;
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

  selectTopic(index: number) {
    this.selectedTopic = this.articleTopicList[index];
    this.isSelectedTopicIndex = index;
    this.articleTitle = this.selectedTopic?.title;
  }

  selectArticle(index: number) {
    this.selectedArticle = this.articleOutline[index];
    this.isSelectedArticleIndex = index;
  }

  generateOutlineOutput() {
    if (!this.selectedTopic) {
      return;
    }
    this._loader.start(this.isChatGPTVersion);
    let topic = this.selectedTopic;
    let obj = {
      title: topic?.title,
      description: topic?.description,
      strategicKeywords: topic?.strategickeywords,
      searchIntent: topic?.searchintent,
    };
    this._AiArticleService.generateOutlineOutput(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.articleOutline = response?.data?.data;
          this.conclusion = response?.data?.conclusion;
          this.selectedArticle =
            this.articleOutline[this.isSelectedArticleIndex];
          this.isTopicSelected = true;
          this.isStep = 3;
          this.navigationBtn = 'Generate Article';
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

  changeTopicTitle(event: any) {
    this.articleTopicList[this.isSelectedTopicIndex].title = event.target.value;
  }

  generateArticle() {
    if (!this.articleOutline[this.isSelectedArticleIndex]) {
      return;
    }
    this._loader.start(this.isChatGPTVersion);
    let article = this.articleOutline[this.isSelectedArticleIndex];
    let obj = {
      title: article?.title,
      headingData: article?.headingdata,
      conclusion: this.conclusion,
    };
    this._AiArticleService.generateArticle(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();

        if (response.statusCode == 200) {
          this.article = response?.data;
          this._utilities.manageCredit(false, this.creditDeducated);
          this.navigationBtn = 'Regenerate Article';
          if (this.article) {
            this.generateArticleBanner();
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

  openArticleEditer(data: any) {
    this._dialog.open(ArticleEditerComponent, {
      width: '750px',
      panelClass: 'change-profile-modal',
      data: { article: data },
    });
  }

  removeHeading(index: any, type: any, subIndex?: any) {
    if (type == 'heading') {
      this.articleOutline[this.isSelectedArticleIndex]?.headingdata?.splice(
        index,
        1
      );
    } else {
      this.articleOutline[this.isSelectedArticleIndex]?.headingdata[
        index
      ].h3?.splice(subIndex, 1);
    }
  }

  uploadCoverImage(event: any) {
    const file = event.target.files && event.target.files[0];

    if (file.type.indexOf('image') > -1 && file?.size / 1024 / 1024 > 2) {
      this._toastr.error('file is bigger than 2MB');
      return;
    }
    if (file.type.indexOf('video') > -1 && file?.size / 1024 / 1024 > 10) {
      this._toastr.error('file is bigger than 10MB');
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
            this._loader.stop();
            this.coverImage = response?.data[0]?.url;
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

  removeCoverImage() {
    this.coverImage = '';
  }

  scheduleDialogOpenClose(status?: boolean) {
    if (status) {
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  articleScheduled(scheduleData?: any) {
    this.isSubmited = true;
    if (!this.article! || !this.articleTitle) {
      return;
    }
    let payload = {};
    payload = {
      postBody: this.article,
      generatedType: commonConstant.POSTGENERATETYPE.ARTICLE,
      articleHeadline: this.articleTitle,
      articleTitle: this.articleTitle,
      status: commonConstant.POSTSTATUS.DRAFT,
      scheduleDateTime: new Date().getTime(),
    };

    if (this.coverImage) {
      payload = {
        ...payload,
        postMedia: this.coverImage,
        postMediaType: commonConstant.POSTMEDIATYPE.IMAGE,
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

    if (this.postId) {
      payload = {
        ...payload,
        postId: this.postId,
      };
    }

    this._loader.start();
    this._post.savePost(payload).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.isSubmited = false;
          this.scheduleDialogOpen = false;
          this._toastr.success(response?.message);
          if (scheduleData && !this.editData) {
            let advancedScheduleCredit =
              this._utilities?.userData?.plan?.advancedScheduleCredit;
            this._utilities.manageCredit(false, advancedScheduleCredit);
          }

          if (scheduleData) {
            this.openConfirmPostScheduled();
          }

          this.resetData();
          this._loader.stop();
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

  resetData() {
    this.articleTitle = '';
    this.coverImage = '';
    this.article = '';
    this.navigationBtn = 'Next';
  }

  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });
  }

  addHeadline() {
    this.dialogRef = this._dialog.open(AddArticleOutlineComponent, {
      width: '550px',
      panelClass: 'change-profile-modal',
      data: {},
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.articleOutline[this.isSelectedArticleIndex]?.headingdata?.push(
          ...result
        );
      }
    });
  }

  generateArticleBanner() {
    let currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
    this.dialogRef = this._dialog.open(GenerateArticleBannerComponent, {
      width: '700px',
      data: { ...currentProfile, articleTitle: this.articleTitle },
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.coverImage = result;
      }
    });
  }

  drop(event: any, index: number) {
    const draggedItem = event.item.data;
    if (event.previousIndex !== undefined && event.currentIndex !== undefined) {
      if (draggedItem?.h2 !== undefined) {
        const h1Index = this.articleOutline[
          this.isSelectedArticleIndex
        ]?.headingdata.findIndex((item: any) => item === draggedItem);

        this.articleOutline[this.isSelectedArticleIndex]?.headingdata?.splice(
          event.currentIndex,
          0,
          this.articleOutline[this.isSelectedArticleIndex]?.headingdata?.splice(
            h1Index,
            1
          )[0]
        );
      } else {
        this.articleOutline[this.isSelectedArticleIndex]?.headingdata[
          index
        ]?.h3?.splice(
          event.currentIndex,
          0,
          this.articleOutline[this.isSelectedArticleIndex]?.headingdata[
            index
          ]?.h3?.splice(event.previousIndex, 1)[0]
        );
      }
    }

    // const draggedItem = event.item.data;
    // if (event.previousIndex !== undefined && event.currentIndex !== undefined) {
    //   this.articleOutline[this.isSelectedArticleIndex].headingdata[index].h2.splice(event.currentIndex, 0, this.selectedArticle.headingdata[index].h2.splice(event.previousIndex, 1)[0]);
    // } else if (event.previousContainer !== event.container) {
    //   const previousIndex = event.previousContainer.data.findIndex((item: string) => item === draggedItem);
    //   this.articleOutline[this.isSelectedArticleIndex].headingdata[index].h2.splice(event.currentIndex, 0, draggedItem);
    //   event.previousContainer.data.splice(previousIndex, 1);
    // }
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

  generateAIArticleBanner() {
    let obj = { topic: this.articleTitle, size: '1792x1024' };

    this.dialogRef = this._dialog.open(AiImageGenerateComponent, {
      width: '650px',
      data: obj,
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.coverImage = result?.image;
      }
    });
  }
}
