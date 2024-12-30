import {
  Component,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';

//LIBRARY
import * as Highcharts from 'highcharts';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

// Chart Services
import { DashboardChartService } from '../../../../shared/services/linkedin-dashboard-chart/dashboard-chart.service';

// Services
import { ActiveBoostingComponent } from '../../../../shared/dialog/active-boosting/active-boosting.component';
import { DashboardService } from '../../../../providers/dashboard/dashboard.service';
import { CrmCampaignService } from '../../../../providers/crm-campaign/crm-campaign.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss'],
})
export class DashboardOverviewComponent {
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() selectedPage: any;
  @Input() selectedDuration: any;
  @Output() _goToContentPage = new EventEmitter<any>();

  // Current selected section
  currentSection: string;
  topPerformingPostList: any;
  overviewData: any;
  postReachData: any;
  audienceData: any;
  engagementData: any;

  creditDeducated: number = 0;
  creditMessage: any;

  //Campaign Data
  campaignData: any[] = [];
  nextJobTime: string = '';

  dialogRef: any;
  constructor(
    private dashboardChartService: DashboardChartService,
    private crmCampaignService: CrmCampaignService,
    private _dashboardService: DashboardService,
    private _loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private toastr: ToastrService,
    private _dialog: MatDialog
  ) {
    this.currentSection = 'reach';
    this.loadReachChart([]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPage'] || changes['startDate'] || changes['endDate']) {
      if (this?.selectedPage?._id) {
        this.creditDeducated = this._utilities?.userData?.plan?.boostingCredit;
        this.creditMessage = `This will cost ${this.creditDeducated} credits`;
        this.getTopPerformingPostList();
        this.getOverviewData();
        this.getPostReach();
        this.getAudienceData();
        this.getEngagementData();
        this.getCampaignData();
      }
    }
  }

  getCampaignData() {
    let param = { pageId: this.selectedPage?._id };

    this._dashboardService.getCampaignData(param).subscribe(
      (response: ResponseModel) => {
        this._loaderService.stop();

        if (response.statusCode == 200) {
          this.campaignData = response?.data?.campaignData;
          this.loadCampaignChart(this.campaignData);
          this.nextJobTime = response?.data?.nextJobTime;
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      },
      (err: ErrorModel) => {
        this._loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getUniqueViewsPer(data: any): number {
    return data ? Math.abs(data) : 0;
  }

  getAcceptanceRate(listData: any) {
    let per = 0;
    if (listData?.connectedCount > 0 && listData?.count > 0) {
      per = (listData?.connectedCount * 100) / listData?.count;
    }

    return per?.toFixed(2) + '%';
  }

  showTheSection(section: string) {
    this.currentSection = section;
    setTimeout(() => {
      if (section === 'reach') {
        this.loadReachChart(this.postReachData);
      } else if (section === 'audience') {
        this.loadAudienceChart(this.audienceData);
      } else if (this.currentSection === 'engagement') {
        this.loadEngagementChart(this.engagementData);
      } else if (this.currentSection === 'campaign') {
        this.loadCampaignChart(this.campaignData);
      }
    }, 100);
  }

  loadReachChart(data: any) {
    const reachChartConfig = this.dashboardChartService.getReachChart(data);
    if (document.getElementById('reach-chart')) {
      Highcharts.chart('reach-chart', reachChartConfig);
    }
  }

  loadAudienceChart(data: any) {
    const audienceChartConfig = this.dashboardChartService.audienceChart(data);
    if (document.getElementById('audience-chart')) {
      Highcharts.chart('audience-chart', audienceChartConfig);
    }
  }

  loadEngagementChart(data: any) {
    const engagementChartConfig =
      this.dashboardChartService.engagementChart(data);
    if (document.getElementById('engagement-chart')) {
      Highcharts.chart('engagement-chart', engagementChartConfig);
    }
  }

  loadCampaignChart(data: any) {
    const campaignChartConfig = this.dashboardChartService.campaignChart(data);
    if (document.getElementById('campaign-chart')) {
      Highcharts.chart('campaign-chart', campaignChartConfig);
    }
  }

  getTopPerformingPostList() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this._dashboardService.getTopPerformingPostList(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.topPerformingPostList = response?.data?.data;
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
        this._loaderService.stop();
      },
      (err: ErrorModel) => {
        this._loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getPostReach() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this._dashboardService.getPostReach(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.postReachData = response?.data;
          this.loadReachChart(this.postReachData);
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
        this._loaderService.stop();
      },
      (err: ErrorModel) => {
        this._loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getAudienceData() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this._dashboardService.getAudienceData(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.audienceData = response?.data;
          this.loadAudienceChart(this.audienceData);
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
        this._loaderService.stop();
      },
      (err: ErrorModel) => {
        this._loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getEngagementData() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this._dashboardService.getEngagementData(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.engagementData = response?.data;
          this.loadEngagementChart(this.engagementData);
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
        this._loaderService.stop();
      },
      (err: ErrorModel) => {
        this._loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  getOverviewData() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this._dashboardService.getOverviewData(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.overviewData = response?.data;
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
        this._loaderService.stop();
      },
      (err: ErrorModel) => {
        this._loaderService.stop();
        if (err.error) {
          const error: ResponseModel = err.error;
          this.toastr.error(error.message, '');
        } else {
          this.toastr.error(MessageConstant.unknownError, '');
        }
      }
    );
  }

  goToContentPage() {
    this._goToContentPage.emit();
  }

  boostPost(data: any) {
    if (!this._utilities?.userData?.isDsahboardLoaded) {
      this.toastr.error(
        'You cannot perform this action at this time. Your dashboard is in preview.'
      );
      return;
    }

    this.dialogRef = this._dialog.open(ActiveBoostingComponent, {
      width: '500px',
      data: { _id: data?.postId },
    });

    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        let index = this.topPerformingPostList.findIndex(
          (x: any) => x?.postId == result?._id
        );
        if (index !== -1) {
          this.topPerformingPostList.isBoosting = true;
        }
      }
    });
  }

  getPostBodyContent(item: any) {
    let postBody =
      item?.postType == 'ARTICLE'
        ? item?.title
        : item?.text
        ? item?.text
        : 'N/A';
    return postBody?.slice(0, 450) + (postBody?.length > 450 ? '...' : '');
  }
}
