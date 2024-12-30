import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { UserService } from '../../../providers/user/user.service';
import { PostService } from 'src/app/providers/post/post.service';
import { ArticleService } from '../../../providers/article/article.service';

// COMPONENTS
import { EditLinkedinPostComponent } from '../../../shared/dialog/edit-linkedin-post/edit-linkedin-post.component';
import { ActiveBoostingComponent } from '../../../shared/dialog/active-boosting/active-boosting.component';
import { PostRescheduleComponent } from '../../../shared/dialog/post-reschedule/post-reschedule.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-schedule-post-calendar',
  templateUrl: './schedule-post-calendar.component.html',
  styleUrls: ['./schedule-post-calendar.component.scss'],
})
export class SchedulePostCalendarComponent {
  currentProfile: any;
  dialogRef: any;
  selectedFilter: any = 'All Post';
  weekStartDate: any;
  weekEndDate: any;
  weekDateList: any = [];
  selectedDate: any;
  weekLimit: number = 2;
  post: any = [];
  selectedPostIndex: any;
  scheduleDialogOpen: boolean = false;
  constructor(
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    private _dialog: MatDialog,
    private sanitizer: DomSanitizer,
    public _utilities: CommonFunctionsService,
    private _userService: UserService,
    public _post: PostService,
    public _globalService: GlobalService,
    private _titleService: Title,
    private router: Router,
    private articleService: ArticleService
  ) {
    this._titleService.setTitle('Identable | Scheduled post');
  }

  ngOnInit(): void {
    this.initView();
  }

  avtiveBoosting(data: any) {
    this.dialogRef = this._dialog.open(ActiveBoostingComponent, {
      width: '500px',
      data: data,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.initView();
      }
    });
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    var diff =
      new Date().getDate() -
      new Date().getDay() +
      (new Date().getDay() === 0 ? -6 : 1);
    this.selectedDate = new Date(new Date().setDate(diff));

    this.setCurrentProfileData();
    this.getWeek();
  }

  setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  getWeek() {
    const today = this.selectedDate;
    this.weekStartDate = new Date(this.selectedDate);
    this.weekDateList = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      if (i == 6) {
        this.weekEndDate = new Date(date);
      }

      this.weekDateList.push(date);
    }
    this.getAllPost();
  }

  getAllPost(filter?: string) {
    let obj = {};
    obj = {
      startDate: new Date(this.weekStartDate.setHours(0, 0, 0, 0)).getTime(),
      endDate: new Date(this.weekEndDate.setHours(23, 59, 59, 999)).getTime(),
    };

    if (filter) {
      this.selectedFilter = filter;
      obj = {
        ...obj,
        status: filter,
      };
    } else {
      this.selectedFilter = 'All Post';
    }

    this.loaderService.start();
    this._post.getPost(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.post = response?.data;
          this.loaderService.stop();
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

  changeWeek(direction: boolean) {
    if (direction) {
      this.weekLimit++;
      this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    } else {
      this.weekLimit--;
      this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    }
    this.getWeek();
  }

  setPost(day: any) {
    let postList = this.post.filter((x: any) => x.day == day);
    if (!postList[0]?.data) {
      return [];
    }
    return postList[0]?.data;
  }

  setGeneratedType(type: any) {
    let generatedType = '';
    type == commonConstant?.POSTGENERATETYPE.INSPIRE_ME
      ? (generatedType = 'Inspire Me')
      : type == commonConstant?.POSTGENERATETYPE.TRENDING_NEWS
      ? (generatedType = 'Trending News')
      : type == commonConstant?.POSTGENERATETYPE.DIY_STRATEGY
      ? (generatedType = 'DIY')
      : type == commonConstant?.POSTGENERATETYPE.ARTICLE
      ? (generatedType = 'Article')
      : '';

    return generatedType;
  }

  setMediaType(type: any) {
    let mediaType = '';
    type == commonConstant?.POSTMEDIATYPE.IMAGE
      ? (mediaType = 'assets/images/image-Icon.png')
      : type == commonConstant?.POSTMEDIATYPE.VIDEO
      ? (mediaType = 'assets/images/video-recorder.png')
      : type == commonConstant?.POSTMEDIATYPE.GIPHY
      ? (mediaType = 'assets/images/image-giphy.png')
      : type == commonConstant?.POSTMEDIATYPE.CAROUSEL
      ? (mediaType = 'assets/images/slider-horizontal.png')
      : type == commonConstant?.POSTMEDIATYPE.AI_VIDEO
      ? (mediaType = 'assets/images/video-ai.png')
      : (mediaType = 'assets/images/type-icon.svg');

    return mediaType;
  }

  textFormat(string: any) {
    if (string) {
      return string.charAt(0).toUpperCase() + string?.slice(1);
    }
    return '';
  }

  setPostStatusClass(status: any) {
    let statusClass = '';

    status == commonConstant?.POSTSTATUS.POSTED
      ? (statusClass = 'posted')
      : status == commonConstant?.POSTSTATUS.SCHEDULED
      ? (statusClass = 'posted-pendding')
      : status == commonConstant?.POSTSTATUS.DRAFT
      ? (statusClass = 'drafts')
      : status == commonConstant?.POSTSTATUS.ERROR
      ? (statusClass = 'posted-red')
      : (statusClass = '');

    return statusClass;
  }

  setPostStatus(status: any) {
    let statusText = '';

    status == commonConstant?.POSTSTATUS.POSTED
      ? (statusText = 'Posted')
      : status == commonConstant?.POSTSTATUS.SCHEDULED
      ? (statusText = 'Scheduled')
      : status == commonConstant?.POSTSTATUS.DRAFT
      ? (statusText = 'Draft')
      : status == commonConstant?.POSTSTATUS.ERROR
      ? (statusText = 'Error')
      : (statusText = '');

    return statusText;
  }

  setPostStatusImage(status: any) {
    let statusImage = '';

    status == commonConstant?.POSTSTATUS.POSTED
      ? (statusImage = 'assets/images/check-circle-green.svg')
      : status == commonConstant?.POSTSTATUS.POSTING
      ? (statusImage = 'assets/images/check-circle-green.svg')
      : status == commonConstant?.POSTSTATUS.SCHEDULED
      ? (statusImage = 'assets/images/icons-calendar-1.png')
      : status == commonConstant?.POSTSTATUS.DRAFT
      ? (statusImage = 'assets/images/file-icon-gray.svg')
      : status == commonConstant?.POSTSTATUS.ERROR
      ? (statusImage = 'assets/images/error-circle-red.svg')
      : (statusImage = '');

    return statusImage;
  }

  setPostMedia(post: any) {
    if (post?.postMediaType == 'carousel') {
      return 'assets/images/carousel-pdf.png';
    }
    if (post?.postMediaType == 'aivideo') {
      return 'assets/images/video-schedule.png';
    }
    return post?.postMedia;
  }

  getProfile(pageId: any) {
    let profile = this._utilities?.linkedinPageList.find(
      (x: any) => x._id == pageId
    );

    return profile;
  }

  openEditPost(postData: any) {
    let payload = {};

    payload = {
      postBody: postData?.postBody,
      generatedType: postData?.generatedType,
      currentProfile: this.getProfile(postData?.pageId),
      postId: postData?._id,
      status: postData?.status,
      carouselTemplate: postData?.carouselTemplate,
      documentDescription: postData?.documentDescription,
    };

    if (postData?.status != commonConstant.POSTSTATUS.DRAFT) {
      payload = {
        ...payload,
        timePeriod: postData?.timePeriod,
        timestamp: postData?.scheduleDateTime,
        timeSlot: postData?.timeSlot,
      };
    }

    if (postData?.postMedia) {
      payload = {
        ...payload,
        postMediaType: postData?.postMediaType,
        postMedia: postData?.postMedia,
      };
    }

    if (postData?.articleHeadline) {
      payload = {
        ...payload,
        articleHeadline: postData?.articleHeadline,
        articleTitle: postData?.articleTitle,
      };
    }

    if (postData?.generatedType == 'article') {
      this.redirectArticle(postData);
      return;
    }

    this.dialogRef = this._dialog.open(EditLinkedinPostComponent, {
      width: '1140px',
      panelClass: 'custom-edit-post-modal',
      data: payload,
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getAllPost();
      }
    });
  }

  redirectArticle(postData: any) {
    let articleId = postData?.articleId;
    let payload = { articleId: articleId };

    this.loaderService.start();
    this.articleService.getArticleDetails(payload).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this._utilities.articleObject = response?.data;
          this.router.navigateByUrl('/article/editarticle');
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

  postRescheduleDailog(postData: any) {
    let data = {
      isReschedulePost: true,
      timePeriod: postData?.timePeriod,
      timestamp: postData?.scheduleDateTime,
      timeSlot: postData?.timeSlot,
    };

    this.dialogRef = this._dialog.open(PostRescheduleComponent, {
      width: '350px',
      data: data,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.postReschedule({ ...postData, ...result });
      }
    });
  }

  postReschedule(postData: any) {
    let payload = {};
    payload = {
      scheduleDateTime: postData?.timestamp,
      timeSlot: postData?.timeSlot,
      timePeriod: postData?.timePeriod,
      postId: postData?._id,
    };

    this.loaderService.start();
    this._post.reschedulePost(payload).subscribe(
      (response: ResponseModel) => {
        this.loaderService.stop();
        if (response.statusCode == 200) {
          this.getAllPost();
          this.toastrService.success(response?.data);
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
}
