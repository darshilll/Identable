import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { OneClickService } from '../../../providers/oneClick/one-click.service';
import { PostService } from '../../../providers/post/post.service';

//COMPONENTS
import { PostPreviewDialogComponent } from '../post-preview-dialog/post-preview-dialog.component';
import { EditLinkedinPostComponent } from '../../../shared/dialog/edit-linkedin-post/edit-linkedin-post.component';

//UTILS
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';

@Component({
  selector: 'app-campaign-scheduler',
  templateUrl: './campaign-scheduler.component.html',
  styleUrls: ['./campaign-scheduler.component.scss'],
})
export class CampaignSchedulerComponent implements OnChanges {
  @Output() _back = new EventEmitter<any>();
  @Output() _createCampaign = new EventEmitter<any>();
  @Input() isUpcomingPostPreview: boolean = false;
  @Input() isPreSchedule: boolean = false;
  @Input() scheduleData: any;
  currentProfile: any;
  postScheduledData: any;
  isPostSchedule: boolean = false;
  creditMessage: any;
  isSelectedPost: any;
  isSelectedPostIndex: any;
  daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  weeks: { date: number; currentMonth: boolean }[][] = [];
  currentYear: number = 0;
  currentMonth: number = 0;
  totalContent: number = 0;
  creditDeducated: number = 0;

  dialogRef: any;
  isOpenPostPreview: boolean = false;
  isOpenPostPreviewId: any;
  isOpenPostPreviewDate: any;

  campaignId: any;

  constructor(
    private _titleService: Title,
    private _loader: LoaderService,
    private _toastr: ToastrService,
    private _dialog: MatDialog,
    private _oneClick: OneClickService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private _post: PostService,
    public _utilities: CommonFunctionsService,
    private sanitizer: DomSanitizer
  ) {
    this._titleService.setTitle('Identable | One Click - Create Campaign');
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );

    this.route.queryParams.subscribe((params) => {
      this.campaignId = params['id'];
      if (this.campaignId) {
        this.getCampaignData();
      }
    });
  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scheduleData']) {
      let firstPostDate = this.scheduleData?.scheduleData[0]?.date;
      this.currentYear = new Date(firstPostDate).getFullYear();
      this.currentMonth = new Date(firstPostDate).getMonth();
      this.generateCalendar();
      this.totalContent = this.scheduleData?.scheduleData?.length;
      this.creditDeducated = this.scheduleData?.creditDeducated;
      this.creditMessage = `This will cost ${this.creditDeducated} credits`;
    }
  }

  getTodayData(date: any) {
    let postList = this.scheduleData?.scheduleData.filter((x: any) => {
      let tempDate = x?.date
        ? x?.date
        : this.convertTimestampToDate(x.scheduleDateTime);
      return new Date(tempDate).getTime() == new Date(date?.fullDate).getTime();
    });

    return postList;
  }

  generateCalendar(): void {
    const today = new Date();
    this.weeks = [];
    const firstDayOfMonth = new Date(
      this.currentYear,
      this.currentMonth,
      1
    ).getDay();
    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();
    const daysInPrevMonth = new Date(
      this.currentYear,
      this.currentMonth,
      0
    ).getDate();

    let date = 1;
    let nextMonthDate = 1;
    let prevMonthDate = daysInPrevMonth - firstDayOfMonth + 1;

    for (let i = 0; i < 6; i++) {
      const week: {
        date: number;
        currentMonth: boolean;
        fullDate: any;
      }[] = [];
      let weekHasCurrentMonthDates = false;
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          let date = prevMonthDate++;
          let targetDate = new Date(
            this.currentYear,
            this.currentMonth - 1,
            date
          );
          const parsedDate = new Date(targetDate);

          week.push({
            date: date,
            currentMonth: false,
            fullDate: this.formatDate(parsedDate),
          });
        } else if (date > daysInMonth) {
          let date = nextMonthDate++;
          let targetDate = new Date(
            this.currentYear,
            this.currentMonth + 1,
            date
          );
          const parsedDate = new Date(targetDate);
          week.push({
            date: date,
            currentMonth: false,
            fullDate: this.formatDate(parsedDate),
          });
        } else {
          let targetDate = new Date(this.currentYear, this.currentMonth, date);
          const parsedDate = new Date(targetDate);
          week.push({
            date,
            fullDate: this.formatDate(parsedDate),
            currentMonth: true,
          });
          date++;
          weekHasCurrentMonthDates = true;
        }
      }
      if (weekHasCurrentMonthDates || week.some((day) => day.currentMonth)) {
        this.weeks.push(week);
      } else {
        break;
      }
    }
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  checkIsOpenPostPreviee(date: any) {
    let tempDate = this.isSelectedPost?.date
      ? this.isSelectedPost?.date
      : this.convertTimestampToDate(this.isSelectedPost?.scheduleDateTime);
    return date?.fullDate == tempDate;
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  postPreviewDailog() {
    this.dialogRef = this._dialog.open(PostPreviewDialogComponent, {
      width: '350px',
      backdropClass: '',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  openPostPreview(index: any) {
    this.isSelectedPostIndex = index._id;
    this.isSelectedPost = this.scheduleData?.scheduleData.find(
      (x: any) => x._id == index._id
    );
    this.isOpenPostPreviewDate = this.isSelectedPost?.date;
    this.isOpenPostPreviewId = this.isSelectedPost?.id;
    this.isOpenPostPreview = true;
  }

  closePostView() {
    this.isOpenPostPreview = false;
  }

  back() {
    this._back.emit();
  }

  submit() {
    this._createCampaign.emit(this.scheduleData);
  }

  updateEditPost(event: any) {
    if (event) {
      let index = this.scheduleData?.scheduleData.findIndex(
        (x: any) => x._id == this.isSelectedPostIndex
      );

      this.scheduleData.scheduleData[index] = event;

      if (event?.isChangeCredit) {
        if (event?.minusCredit) {
          this.creditDeducated = Number(this.creditDeducated) - event?.credit;
          this.scheduleData.creditDeducated = this.creditDeducated;
        }
        if (event?.addCredit) {
          this.creditDeducated = Number(this.creditDeducated) + event?.credit;
          this.scheduleData.creditDeducated = this.creditDeducated;
        }
      }
    }
  }

  deletePost(event: any) {
    let isDeleted = event?.isDelete;
    if (isDeleted) {
      const index = this.scheduleData?.scheduleData.findIndex(
        (obj: any) => obj._id === this.isSelectedPost?._id
      );
      if (index !== -1) {
        let generatedType = this.isSelectedPost?.generatedType;
        let manageCredit: number = 0;
        if (generatedType == 'inspireMe') {
          manageCredit = 2;
        } else if (generatedType == 'carousel') {
          manageCredit = this._utilities?.userData?.plan?.carouselCredit || 0;
        } else if (generatedType == 'aivideo') {
          manageCredit = this._utilities?.userData?.plan?.aIVideoCredit || 0;
        } else if (generatedType == 'article') {
          manageCredit = this._utilities?.userData?.plan?.articleCredit || 0;
        }

        let credit = Number(this.creditDeducated) - manageCredit;
        this.creditDeducated = credit;
        this.scheduleData.creditDeducated = credit;
        this.scheduleData.scheduleData.splice(index, 1);
        this.totalContent--;
        this.isOpenPostPreview = false;
      }
    }
  }

  deleteScheduledPost(event: any) {
    this._loader.start();
    this._post.deletePost({ postId: this.isSelectedPost?._id }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          const index = this.scheduleData?.scheduleData.findIndex(
            (obj: any) => obj?._id === this.isSelectedPost?._id
          );
          if (index !== -1) {
            this.scheduleData.scheduleData.splice(index, 1);
            this.isOpenPostPreview = false;
          }
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

  getCampaignData() {
    this._loader.start();
    this._oneClick.getCampaignPosts({ campaignId: this.campaignId }).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          let firstPostDate = response?.data[0]?.scheduleDateTime;
          if (firstPostDate) {
            this.currentYear = new Date(firstPostDate).getFullYear();
            this.currentMonth = new Date(firstPostDate).getMonth();
            this.generateCalendar();
          }
          this.scheduleData = {
            scheduleData: response?.data,
          };
          if (!response?.data?.length) {
            this.router.navigate(['oneclick']);
          }
          this.isPostSchedule = true;
        } else {
          this.router.navigate(['oneclick']);
          this._toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.router.navigate(['oneclick']);
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

  convertTimestampToDate(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  boostPost(event: any) {
    if (!event?.isPostBoost) {
      return;
    }
    let obj = {
      postId: this.isSelectedPost?._id,
      isBoosting: true,
      likeCount: 20,
    };
    this._loader.start();
    this._post.postBoostingActive(obj).subscribe(
      (response: ResponseModel) => {
        this._loader.stop();
        if (response.statusCode == 200) {
          const index = this.scheduleData?.scheduleData.findIndex(
            (obj: any) => obj?._id === this.isSelectedPost?._id
          );
          if (index !== -1) {
            this.scheduleData.scheduleData[index].isBoosting = true;
          }
          (this._utilities.userData.subscription.credit -
            this._utilities?.userData?.plan?.boostingCredit) |
            0;
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
  editPost(event: any) {
    if (!event?.isEditPost) {
      return;
    }
    let postData = this.isSelectedPost;
    let payload = {};
    payload = {
      postBody: postData?.postBody,
      generatedType: postData?.generatedType,
      currentProfile: this.currentProfile,
      postId: postData?._id,
      status: postData?.status,
      timePeriod: postData?.timePeriod,
      timestamp: postData?.scheduleDateTime,
      timeSlot: postData?.timeSlot,
    };

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

    if (postData?.carouselTemplate?.length) {
      let genratedCarouselArray = [];
      for (let i = 0; i < postData?.carouselTemplate?.length; i++) {
        genratedCarouselArray.push(
          this.getHtml(
            postData?.carouselTemplate[i]?.changingThisBreaksApplicationSecurity
          )
        );
      }

      payload = {
        ...payload,
        carouselTemplate: genratedCarouselArray,
        documentDescription: postData?.documentDescription,
      };
    }

    if (postData?.generatedType == 'article') {
      this.router.navigateByUrl('/ai-article', { state: payload });
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
        this.getCampaignData();
      }
    });
  }

  getHtml(item: any) {
    return this.sanitizer.bypassSecurityTrustHtml(item);
  }

  setPostBody(item: any) {
    let body = item?.subTopic ? item?.subTopic : item?.postBody;
    return body?.replace(/<[^>]*>/g, '');
  }
}
