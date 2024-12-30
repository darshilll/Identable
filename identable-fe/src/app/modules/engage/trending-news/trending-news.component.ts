import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// LIBRARY
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { TrendingNewsService } from '../../../providers/trendingNews/trending-news.service';
import { UserService } from '../../../providers/user/user.service';
import { PostService } from 'src/app/providers/post/post.service';

// COMPONENTS
import { EditLinkedinPostComponent } from '../../../shared/dialog/edit-linkedin-post/edit-linkedin-post.component';
import { ConfirmPostScheduledComponent } from '../../../shared/dialog/confirm-post-scheduled/confirm-post-scheduled.component';

//UTILS
import { commonConstant } from '../../../utils/common-functions/common-constant';
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-trending-news',
  templateUrl: './trending-news.component.html',
  styleUrls: ['./trending-news.component.scss'],
})
export class TrendingNewsComponent implements OnInit {
  trendingNews: any;

  selectedNewsIndex: any;
  scheduleDialogOpen: boolean = false;
  currentProfile: any;

  dialogRef: any;

  isCheckGridview: boolean = false;

  creditDeducated: number = 0;
  scheduleCredit: number = 0;

  searchTrendingNews: string = '';
  constructor(
    private loaderService: LoaderService,
    private trendingNewsService: TrendingNewsService,
    private toastrService: ToastrService,
    private router: Router,
    private _dialog: MatDialog,
    public _utilities: CommonFunctionsService,
    private _userService: UserService,
    public _post: PostService,
    public _globalService: GlobalService,
    private _titleService: Title
  ) {}

  ngOnInit(): void {
    this._titleService.setTitle('Identable | Trending News');
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });

    this.creditDeducated = this._utilities?.userData?.plan?.searchNewsCredit;
    this.scheduleCredit =
      this._utilities?.userData?.plan?.advancedScheduleCredit;
    this.setCurrentProfileData();
    this.getTrendingNews();
  }

  changeView(type: any) {
    this.isCheckGridview = type;
  }

  creditMessage(credit: any) {
    return `This will cost ${credit} credits`;
  }

  setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  getTrendingNews() {
    // this.loaderService.start();
    let obj = {};
    this.trendingNewsService.getTrendingNews(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.loaderService.stop();
          this.trendingNews = response?.data;
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

  removeSearch() {
    this.searchTrendingNews = '';
    this.getTrendingNews();
  }

  searchNews() {
    if (!this.searchTrendingNews) {
      this.toastrService.error('Please enter search text');
      return;
    }
    if (this.searchTrendingNews?.length < 3) {
      this.toastrService.error('Minimum three character required');
      return;
    }
    this.loaderService.start();
    let obj = {
      searchKeyword: this.searchTrendingNews,
    };
    this.trendingNewsService.searchNews(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.loaderService.stop();
          this.trendingNews = response?.data;
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

  transformData(data: any[]): any[] {
    return data.map((item) => {
      return this.capitalizeFirstLetter(item.value);
    });
  }

  capitalizeFirstLetter(str: string): string {
    if (str) {
      return str.charAt(0).toUpperCase() + str?.slice(1);
    }
    return '';
  }

  openEditPost(index: any) {
    let newsData = this.trendingNews[index];

    let payload = {};
    payload = {
      postBody: newsData?.title + '\n\n' + newsData?.description,
      generatedType: commonConstant.POSTGENERATETYPE.TRENDING_NEWS,
      newsLink: newsData?.url,
      generatedTypeId: newsData?._id,
      currentProfile: this.currentProfile,
    };

    if (newsData?.urlToImage) {
      payload = {
        ...payload,
        postMediaType: commonConstant.POSTMEDIATYPE.IMAGE,
        postMedia: newsData?.urlToImage,
      };
    }

    this.dialogRef = this._dialog.open(EditLinkedinPostComponent, {
      width: '1140px',
      panelClass: 'custom-edit-post-modal',
      data: payload,
      disableClose: true,
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.trendingNews[index].isScheduled = true;
        this.openConfirmPostScheduled();
      }
    });
  }

  scheduleDialogOpenClose(status: boolean, index?: any) {
    if (status) {
      this.selectedNewsIndex = index;
      this.scheduleDialogOpen = true;
    } else {
      this.scheduleDialogOpen = false;
    }
  }

  postScheduled(scheduleData: any, index: any) {
    let newsData = this.trendingNews[index];
    let payload = {};
    payload = {
      postBody: newsData?.title + '\n\n' + newsData?.description,
      generatedType: commonConstant.POSTGENERATETYPE.TRENDING_NEWS,
      generatedTypeId: newsData?._id,
      status: commonConstant.POSTSTATUS.SCHEDULED,
    };

    if (newsData?.urlToImage) {
      payload = {
        ...payload,
        postMedia: newsData?.urlToImage,
        postMediaType: commonConstant.POSTMEDIATYPE.IMAGE,
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
      (response) => {
        if (response.statusCode == 200) {
          this.scheduleDialogOpen = false;
          this._utilities.manageCredit(false, this.scheduleCredit);
          this.toastrService.success(response?.message);
          this.trendingNews[index].isScheduled = true;
          this.loaderService.stop();
          this.openConfirmPostScheduled();
        } else {
          this.loaderService.stop();
          this.toastrService.error(MessageConstant.unknownError, '');
        }
      },
      (err) => {
        this.loaderService.stop();
        this.toastrService.error(err?.error?.message);
      }
    );
  }

  generateSummary(index: any) {
    let newsData = this.trendingNews[index];
    if (!newsData) {
      return;
    }
    let chatGPTModel = this._utilities.chatGPTModel;
    this.loaderService.start(chatGPTModel);
    let obj = {
      title: newsData?.title,
      url: newsData?.url,
      content: newsData?.description,
    };
    this.trendingNewsService.generateSummary(obj).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.loaderService.stop();

          let payload = {};
          payload = {
            postBody: response?.data,
            generatedType: commonConstant.POSTGENERATETYPE.TRENDING_NEWS,
            newsLink: newsData?.url,
            generatedTypeId: newsData?._id,
            currentProfile: this.currentProfile,
          };

          if (newsData?.urlToImage) {
            payload = {
              ...payload,
              postMediaType: commonConstant.POSTMEDIATYPE.IMAGE,
              postMedia: newsData?.urlToImage,
            };
          }

          this.dialogRef = this._dialog.open(EditLinkedinPostComponent, {
            width: '1140px',
            panelClass: 'custom-edit-post-modal',
            data: payload,
            disableClose: true,
          });

          this.dialogRef.afterClosed().subscribe((result: any) => {
            if (result) {
              this.trendingNews[index].isScheduled = true;
              this.openConfirmPostScheduled();
            }
          });
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
      backdropClass: 'post-scheduled-modal',
      data: {},
    });
  }
}
