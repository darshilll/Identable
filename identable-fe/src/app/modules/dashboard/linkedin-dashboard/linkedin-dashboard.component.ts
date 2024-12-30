import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment-timezone';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

// SERVICES
import { DashboardService } from '../../../providers/dashboard/dashboard.service';
import { LoaderService } from '../../../providers/loader-service/loader.service';

//COMPONENT
import { SwitchProfileComponent } from '../../../shared/dialog/switch-profile/switch-profile.component';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

//COMPONENT
import { SinglePostDetailsComponent } from '../../../shared/dialog/single-post-details/single-post-details.component';

@Component({
  selector: 'app-linkedin-dashboard',
  templateUrl: './linkedin-dashboard.component.html',
  styleUrls: ['./linkedin-dashboard.component.scss'],
})
export class LinkedinDashboardComponent {
  // Followers Stats
  userFlowersWeeks: any = [];
  userTotalConnection: any = [];
  userTotalFollowers: any = [];

  // Post Stats
  postStatsWeeks: any = [];
  rePostCount: any = [];
  postTotalComment: any = [];
  postTotalLike: any = [];
  postTotalImpression: any = [];

  // Assign Post Data
  assignLinkedinPost: any[] = [];

  totalPostCount: any = 0;
  totalPostComment: any = 0;
  totalPostLike: any = 0;
  totalPostRepost: any = 0;

  // Pagignation Page
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: any;

  // Dialog Option
  dialogRef: any;

  // Current Active Linkedin Profile
  currentActiveProfile: any;

  // Percentage Stats
  likeIncreaseRate: any;
  postIncreaseRate: any;
  commentIncreaseRate: any;
  rePostIncreaseRate: any;

  // Follower Stats
  sumToatalFollowers: any;
  sumToatalConnection: any;
  pageUniqueVisitor: any;
  pageSearchAppearances: any;
  pageUniqueVisitorArray: any = [];

  postEngagement: number = 0;

  sampleDashboardCheck: boolean = true;
  startDate: any;
  endDate: any;
  isDsahboardLoaded: boolean = false;

  currentProfile: any;

  constructor(
    private _dashboardService: DashboardService,
    private _dialog: MatDialog,
    private _titleService: Title,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    public _ngxLoader: NgxUiLoaderService
  ) {
    this._titleService.setTitle('Identable | Dashboard');
  }

  ngOnInit(): void {
    this._ngxLoader.startLoader('POST-DETAILS');
    this._ngxLoader.startLoader('NETWORK-TREND');
    this._ngxLoader.startLoader('POST-TREND');
    this.initView();
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });

    this._utilities.refreshDashbaordData = new Subject();
    this._utilities.refreshDashbaordData.subscribe((response: any) => {
      console.log('refreshDashbaordData response = ', response);
      this.getDashboard();
    });
    this.getDashboard();
    this.setCurrentProfileData();
  }

  setCurrentProfileData() {
    this.currentProfile = this._utilities?.linkedinPageList?.find(
      (x: any) => x._id == this._utilities.userData?.currentPageId
    );
  }

  switchProfile() {
    this.dialogRef = this._dialog.open(SwitchProfileComponent, {
      width: '350px',
      panelClass: 'change-profile-modal',
      data: {},
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {});
  }

  viewPostDetails(item: any) {
    this.dialogRef = this._dialog.open(SinglePostDetailsComponent, {
      width: '650px',
      panelClass: 'custom-edit-post-modal',
      data: { item },
    });
  }

  checkPercentageValueUpDown(val: any) {
    if (val == null || val == 0) {
      return true;
    } else if (val < 0) {
      return true;
    } else {
      return false;
    }
  }

  percentageCovertToPositive(val: any) {
    if (val == null || val == 0) {
      return 0;
    } else {
      return Math.abs(val).toFixed(0);
    }
  }

  chart2() {
    this._ngxLoader.stopLoader('POST-TREND');
    let chart2 = Highcharts.chart({
      chart: {
        renderTo: 'chart-2',
        type: 'spline',
        height: 276,
      },

      title: {
        text: '',
      },

      credits: {
        enabled: false,
      },

      xAxis: {
        type: 'category',
        categories: this.postStatsWeeks,
      },

      yAxis: {
        title: {
          text: 'Post Stats',
        },
        plotLines: [
          {
            value: 0,
            width: 1,
            color: '#808080',
          },
        ],
      },

      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.y:.2f}',
      },

      legend: {
        enabled: true,
      },

      exporting: {
        enabled: false,
      },

      series: [
        {
          type: 'line',
          name: 'Re post',
          color: '#219653',
          data: this.rePostCount,
        },
        {
          type: 'line',
          name: 'Total Comment',
          color: '#9B51E0',
          data: this.postTotalComment,
        },
        {
          type: 'line',
          name: 'Total Like',
          color: '#F2994A',
          data: this.postTotalLike,
        },
      ],
    });
  }

  chart3() {
    if (this._utilities.currentProfile?.type == 'profile') {
      var chart3 = Highcharts.chart({
        chart: {
          renderTo: 'chart-3', // Specify the ID of the container where the chart should be rendered
          type: 'column',
        },
        title: {
          text: 'Week-wise Connection and Followers Data',
        },
        xAxis: {
          categories: this.userFlowersWeeks,
        },
        yAxis: {
          title: {
            text: 'Follower-Connection',
          },
        },
        series: [
          {
            name: 'Followers',
            color: '#FB6514',
            type: 'column',
            data: this.userTotalFollowers,
          },
          {
            name: 'Connection',
            color: '#FEB273',
            type: 'column',
            data: this.userTotalConnection,
          },
        ],
      });
    } else {
      var chart3 = Highcharts.chart({
        chart: {
          renderTo: 'chart-3', // Specify the ID of the container where the chart should be rendered
          type: 'column',
        },
        title: {
          text: 'Week-wise Followers Data',
        },
        xAxis: {
          categories: this.userFlowersWeeks,
        },
        yAxis: {
          title: {
            text: 'Follower',
          },
        },
        series: [
          {
            name: 'Followers',
            color: '#FB6514',
            type: 'column',
            data: this.userTotalFollowers,
          },
        ],
      });
    }
  }

  chart4() {
    var chart4 = Highcharts.chart({
      chart: {
        renderTo: 'chart-4', // Specify the ID of the container where the chart should be rendered
        type: 'column',
      },
      title: {
        text: 'Week-wise Connection and Unique Visitor Data',
      },
      xAxis: {
        categories: this.userFlowersWeeks,
      },
      yAxis: {
        title: {
          text: 'Follower-Visitor',
        },
      },
      series: [
        {
          name: 'Followers',
          color: '#FB6514',
          type: 'column',
          data: this.userTotalFollowers,
        },
        {
          name: 'Unique Visitor',
          color: '#FEB273',
          type: 'column',
          data: this.pageUniqueVisitorArray,
        },
      ],
    });
  }

  getDashboard() {
    let param = {};
    this._dashboardService.getDashboardData(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._ngxLoader.stopLoader('NETWORK-TREND');
          this.isDsahboardLoaded = response?.data?.isDsahboardLoaded;
          // ============= Total Post ===============

          this.totalPostCount = response?.data?.totalData?.totalPost || 0;
          let lastWeekPostCount = response?.data?.lastWeekData?.totalPost || 0;
          let previousWeekPostCount =
            response?.data?.previousWeekData?.totalPost || 0;

          if (previousWeekPostCount != 0) {
            this.postIncreaseRate =
              (100 * lastWeekPostCount) / previousWeekPostCount - 100;
          }

          if (Number.isNaN(this.postIncreaseRate)) {
            this.postIncreaseRate = 0;
          }

          // ============= Total Like ===============

          this.totalPostLike = response?.data?.totalData?.totalLike || 0;
          let lastWeekLikeCount = response?.data?.lastWeekData?.totalLike || 0;
          let previousWeekLikeCount =
            response?.data?.previousWeekData?.totalLike || 0;

          if (previousWeekLikeCount != 0) {
            this.likeIncreaseRate =
              (100 * lastWeekLikeCount) / previousWeekLikeCount - 100;
          }

          if (Number.isNaN(this.likeIncreaseRate)) {
            this.likeIncreaseRate = 0;
          }

          // ============= Total Comment ===============

          this.totalPostComment = response?.data?.totalData?.totalComment || 0;
          let lastWeekCommentCount =
            response?.data?.lastWeekData?.totalComment || 0;
          let previousWeekCommentCount =
            response?.data?.previousWeekData?.totalComment || 0;

          if (previousWeekCommentCount != 0) {
            this.commentIncreaseRate =
              (100 * lastWeekCommentCount) / previousWeekCommentCount - 100;
          }

          if (Number.isNaN(this.commentIncreaseRate)) {
            this.commentIncreaseRate = 0;
          }

          // ============= Total Repost ===============

          this.totalPostRepost = response?.data?.totalData?.totalRepost || 0;
          let lastWeekRepostCount =
            response?.data?.lastWeekData?.totalRepost || 0;
          let previousWeekRepostCount =
            response?.data?.previousWeekData?.totalRepost || 0;

          if (previousWeekRepostCount != 0) {
            this.rePostIncreaseRate =
              (100 * lastWeekRepostCount) / previousWeekRepostCount - 100;
          }

          if (Number.isNaN(this.rePostIncreaseRate)) {
            this.rePostIncreaseRate = 0;
          }

          // ================= Network Trend =================
          this.sumToatalFollowers = response?.data?.followersCount || 0;
          this.sumToatalConnection = response?.data?.connectionsCount || 0;
          if (this.sumToatalConnection == 500) {
            this.sumToatalConnection = '500+';
          }
          // ================= Post Trend =================

          this.rePostCount = [];
          this.postTotalComment = [];
          this.postTotalImpression = [];
          this.postTotalLike = [];
          this.postStatsWeeks = [];

          for (let i = response?.data?.postTrend?.length - 1; i >= 0; i--) {
            const element = response?.data?.postTrend[i];
            this.rePostCount.push(
              parseInt(element?.weekData?.totalRepost || 0)
            );
            this.postTotalComment.push(
              parseInt(element?.weekData?.totalComment || 0)
            );
            this.postTotalImpression.push(
              parseInt(element?.weekData?.totalImpression || 0)
            );
            this.postTotalLike.push(
              parseInt(element?.weekData?.totalLike || 0)
            );
            this.postStatsWeeks.push(element?.weekVal);
          }
          this.chart2();

          // ================= Network Trend =================

          this.userFlowersWeeks = [];
          this.userTotalFollowers = [];
          this.userTotalConnection = [];
          this.postTotalLike = [];
          this.postStatsWeeks = [];

          for (let i = response?.data?.networkTrend?.length - 1; i >= 0; i--) {
            const element = response?.data?.networkTrend[i];
            this.userTotalFollowers.push(
              parseInt(element?.weekData?.followersCount || 0)
            );
            this.userTotalConnection.push(
              parseInt(element?.weekData?.connectionsCount || 0)
            );
            this.userFlowersWeeks.push(element?.weekVal);
          }
          this.chart3();
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
        this.getPostList();
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
        this.getPostList();
      }
    );
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getPostList();
  }

  getPostList() {
    let param = {
      page: this.currentPage,
    };

    this._dashboardService.getPostList(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this._ngxLoader.stopLoader('POST-DETAILS');
          let totalItems = response?.data?.count || 0;
          let pageSize = response?.data?.limit || 0;
          this.totalPages = Math.ceil(totalItems / pageSize);
          this.assignLinkedinPost = response?.data?.items;
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this.loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }
}
