import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { InspireMeService } from '../../../providers/inspireMe/inspire-me.service';
import { UserService } from '../../../providers/user/user.service';
import { PostService } from 'src/app/providers/post/post.service';
import { GeneralService } from 'src/app/providers/general/general.service';

// COMPONENTS
import { EditLinkedinPostComponent } from '../../../shared/dialog/edit-linkedin-post/edit-linkedin-post.component';
import { AiSettingComponent } from '../../../shared/dialog/ai-setting/ai-setting.component';
import { ConfirmPostScheduledComponent } from '../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';
import { SelectMediaComponent } from '../../../shared/common/select-media/select-media.component';
import { DeleteConfirmationPopupComponent } from '../../../shared/common/delete-confirmation-popup/delete-confirmation-popup.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-inspire-me',
  templateUrl: './inspire-me.component.html',
  styleUrls: ['./inspire-me.component.scss'],
})
export class InspireMeComponent {
  creditDeducated: number = 0;
  inspireMePost: any;
  selectedPostIndex: any;
  dialogRef: any;
  mediaDialogRef: any;

  isChatGPTVersion: any;
  selectedFilter: any = 'New Post';
  scheduleDialogOpen: boolean = false;
  currentProfile: any;
  allPostList: any;
  aiFormality: string = 'causal';

  isCheckGridview: boolean = false;

  selectedImageSource: any;
  imageSource = [
    {
      value: 'image',
      label: 'AI Image',
      icon: 'assets/images/star-two.svg',
    },
    {
      value: 'giphy',
      label: 'Giphy',
      icon: 'assets/images/image-giphy-24.png',
    },
    {
      value: 'pexel',
      label: 'Pexel Image',
      icon: 'assets/images/pixels-icon.png',
    },
  ];

  inspiremeCustomTabs: any = [
    {
      label: '# Industry trends',
      value: 'IndustryTrend',
    },
    {
      label: '# Thought leadership',
      value: 'ThoughtLeadership',
    },
    {
      label: '# Productivity hacks',
      value: 'ProductivityHacks',
    },
    {
      label: '# Professional tips',
      value: 'ProfessionalTips',
    },
    {
      label: '# Industry prediction',
      value: 'IndustryPrediction',
    },
  ];

  activeCustomTabs: any = 'IndustryTrend';
  constructor(
    private loaderService: LoaderService,
    private _inspireMe: InspireMeService,
    private toastrService: ToastrService,
    private _dialog: MatDialog,
    public _utilities: CommonFunctionsService,
    private _userService: UserService,
    public _post: PostService,
    public _generalService: GeneralService,
    public _globalService: GlobalService,
    private _titleService: Title
  ) {}

  creditMessage(credit: any) {
    return `This will cost ${credit} credits`;
  }

  ngOnInit(): void {
    this._titleService.setTitle('Identable | Inspire Me');
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.setCurrentProfileData();
    this.getInspireMePost();
    this.isChatGPTVersion = this._utilities.chatGPTModel;
    this.creditDeducated =
      this._utilities?.userData?.plan?.advancedScheduleCredit;
  }

  changeInspireCustomTabs(item: any) {
    this.activeCustomTabs = item?.value;
    this.loaderService.start();
    this.getInspireMePost();
  }

  changeView(type: any) {
    this.isCheckGridview = type;
  }

  setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  getInspireMePost() {
    let obj = { contentType: this.activeCustomTabs };
    this._inspireMe.getInspireMePost(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.loaderService.stop();
          this.inspireMePost = response?.data;
          this.allPostList   = response?.data;
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

  // Choice Media options

  choiceMediaOptions(index: any) {
    this.mediaDialogRef = this._dialog.open(SelectMediaComponent, {
      width: '960px',
      data: {},
    });
    this.mediaDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const post = this.inspireMePost[index];
        post.image = result?.url;
      }
    });
  }

  deleteConfirmationDialog(index: any) {
    this.dialogRef = this._dialog.open(DeleteConfirmationPopupComponent, {
      width: '400px',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
          const post = this.inspireMePost[index];
          post.image = '';
      }
    });
  }

  // Handle selection change for the specific post

  onSelectionChange(event: any, i: number) {
    const post = this.inspireMePost[i];
    this.inspireMePost[i].defultMedia = event.value.value;
    this.inspireMePost[i].selectedImageSource = event.value;
    this.setPostMediaUrl(i);
  }

  // Set the correct media URL based on the post's selected media

  setPostMediaUrl(i: number): string {
    const post = this.inspireMePost[i];

    if (post.defultMedia === 'giphy' && post.giphy) {
      return post.giphy;
    } else if (post.defultMedia === 'image' && post.image) {
      return post.image;
    } else if (post.defultMedia === 'pexel' && post.pexel) {
      return post.pexel;
    } else {
      return ''; // Return an empty string if no valid media is found
    }
  }

  removeMedia(index: any) {
    let post = this.inspireMePost[index];

    if (post) {
      // If the current default media is 'image'
      if (post.defultMedia === 'image') {
        this.inspireMePost[index].image = '';
        this.inspireMePost[index].defultMedia = post.giphy
          ? 'giphy'
          : post.pexel
          ? 'pexel'
          : '';
      }
      // If the current default media is 'pexel'
      else if (post.defultMedia === 'pexel') {
        this.inspireMePost[index].pexel = '';
        this.inspireMePost[index].defultMedia = post.giphy
          ? 'giphy'
          : post.image
          ? 'image'
          : '';
      }
      // If the current default media is 'giphy'
      else if (post.defultMedia === 'giphy') {
        this.inspireMePost[index].giphy = '';
        this.inspireMePost[index].defultMedia = post.image
          ? 'image'
          : post.pexel
          ? 'pexel'
          : '';
      }

      // Update the selectedImageSource based on the new defultMedia

      this.inspireMePost[index].selectedImageSource = this.imageSource.find(
        (item) => item.value === this.inspireMePost[index].defultMedia
      );
    }
  }

  openEditPost(index?: any) {
    let payload = {};

    if (index !== undefined && index !== null) {
      let postData = this.inspireMePost[index];
      payload = {
        postBody: postData?.post,
        generatedType: commonConstant.POSTGENERATETYPE.INSPIRE_ME,
        generatedTypeId: postData?._id,
      };

      if (postData?.giphy || postData?.image) {
        payload = {
          ...payload,
          postMediaType: postData?.defultMedia,
          postMedia:
            postData?.defultMedia == 'image'
              ? postData?.image
              : postData?.giphy,
        };
      }
    } else {
      payload = {
        isGeneratePost: true,
      };
    }

    payload = {
      ...payload,
      currentProfile: this.currentProfile,
    };

    this.dialogRef = this._dialog.open(EditLinkedinPostComponent, {
      width: '1140px',
      panelClass: 'custom-edit-post-modal',
      data: payload,
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (!result?.isSaveDraft && index !== undefined && index !== null) {
          this.inspireMePost[index].isScheduled = true;
          this.openConfirmPostScheduled();
        }
      }
    });
  }

  rewritePost(index: any) {
    let postData = this.inspireMePost[index];
    let obj = {
      postContent: postData?.post,
    };
    this.loaderService.start(this.isChatGPTVersion);
    this._generalService.generateDIYPostPrompt(obj).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          let data = response?.data;
          this.inspireMePost[index].post = data?.post;

          // if (data?.randomSelect != 'giphy') {
          //   this.inspireMePost[index].image = data?.pexelImageUrl;
          // } else {
          //   this.inspireMePost[index].giphy = data?.giphyImageUrl;
          // }
          // this.inspireMePost[index].defultMedia =
          //   data?.randomSelect == 'giphy'
          //     ? data?.giphyImageUrl
          //     : data?.pexelImageUrl;
        } else {
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

  scheduleDialogOpenClose(status: boolean, index?: any) {
    if (status) {
      this.selectedPostIndex = index;
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  postScheduled(scheduleData: any, index: any) {
    let postData = this.inspireMePost[index];

    let payload = {};
    payload = {
      postBody: postData?.post,
      generatedType: commonConstant.POSTGENERATETYPE.INSPIRE_ME,
      generatedTypeId: postData?._id,
      status: commonConstant.POSTSTATUS.SCHEDULED,
    };

    if (postData?.image) {
      payload = {
        ...payload,
        postMedia: postData?.image,          
        postMediaType: commonConstant.POSTMEDIATYPE.IMAGE          
      };
    }

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
          this.inspireMePost[index].isScheduled = true;
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

  openAiSettingDailog() {
    this.dialogRef = this._dialog.open(AiSettingComponent, {
      width: '500px',
      panelClass: 'change-profile-modal',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  changePostMedia(index: any, medialType: boolean) {
    this.inspireMePost[index].defultMedia = medialType ? 'image' : 'giphy';
  }

  // setPostMediaUrl(index: any) {
  //   let post = this.inspireMePost[index];
  //   if (post?.defultMedia == 'image') {
  //     if (!post?.image) {
  //       this.inspireMePost[index].defultMedia = 'giphy';
  //     }
  //     return post?.image ? post?.image : post?.giphy;
  //   } else {
  //     if (!post?.giphy) {
  //       this.inspireMePost[index].defultMedia = 'image';
  //     }
  //     return post?.giphy ? post?.giphy : post?.image;
  //   }
  // }

  openConfirmPostScheduled() {
    this._dialog.open(ConfirmPostScheduledComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });
  }

  getAllPost(filter?: string) {
    if (filter == 'posted') {
      this.selectedFilter = 'Posted';
      this.inspireMePost = this.allPostList.filter((x: any) => x.isScheduled);
    } else if (filter == 'newPost') {
      this.selectedFilter = 'New Post';
      this.inspireMePost = this.allPostList.filter((x: any) => !x.isScheduled);
    } else {
      this.selectedFilter = 'All Post';
      this.inspireMePost = this.allPostList;
    }
  }
}
