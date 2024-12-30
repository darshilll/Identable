import { Component, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
//LIBRARY
import * as Highcharts from 'highcharts';
import { ToastrService } from 'ngx-toastr';

// COMPONENTS
import { PostContentPreviewComponent } from 'src/app/modules/linkedin-dashboard/dialog/post-content-preview/post-content-preview.component';
import { ActiveBoostingComponent } from '../../../../shared/dialog/active-boosting/active-boosting.component';

// Services
import { DashboardService } from '../../../../providers/dashboard/dashboard.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';

// Chart Services
import { DashboardChartService } from '../../../../shared/services/linkedin-dashboard-chart/dashboard-chart.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-content-area',
  templateUrl: './content-area.component.html',
  styleUrls: ['./content-area.component.scss'],
})
export class ContentAreaComponent {
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() selectedPage: any;

  tdElement: HTMLElement | null = null;

  dialogRef: any;

  // Pagignation Page
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: any;

  creditDeducated: number = 0;
  creditMessage: any;

  contentPostData: any;
  dummyContentPostData: any = ['No Post Found', '-', '-', 0, 0, 0, 0, 0];

  shortBy: any;
  sortMode: any;
  searchText: any;
  isSearch: boolean = false;

  tableHader: any = [
    { label: 'Title', activeSort: false, sortMode: false, isAllowShort: true },
    {
      label: 'Date published',
      activeSort: true,
      sortMode: false,
      isAllowShort: true,
    },
    {
      label: 'Account',
      activeSort: false,
      sortMode: false,
      isAllowShort: false,
    },
    {
      label: 'Impression',
      activeSort: false,
      sortMode: false,
      isAllowShort: true,
    },
    { label: 'Reach', activeSort: false, sortMode: false, isAllowShort: false },
    { label: 'Likes', activeSort: false, sortMode: false, isAllowShort: true },
    {
      label: 'Comments',
      activeSort: false,
      sortMode: false,
      isAllowShort: true,
    },
    { label: 'Repost', activeSort: false, sortMode: false, isAllowShort: true },
  ];

  // engagement Hour Data
  engagementHourData: any;

  constructor(
    private _dialog: MatDialog,
    private dashboardChartService: DashboardChartService,
    private _dashboardService: DashboardService,
    private _loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {}

  ngAfterViewInit() {
    this.initView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPage'] || changes['startDate'] || changes['endDate']) {
      if (this?.selectedPage?._id) {
        this.creditDeducated = this._utilities?.userData?.plan?.boostingCredit;
        this.creditMessage = `This will cost ${this.creditDeducated} credits`;
        this.getPostContentList();
        this.getEngagementHoursData();
      }
    }
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
  }

  // Add Class in Closet td

  toggleDropClass(event: Event): void {
    const allTdElements = document.querySelectorAll('td.ide-cust-class');
    allTdElements.forEach((td) => td.classList.remove('ide-cust-class'));

    const target = event.target as HTMLElement;
    this.tdElement = target.closest('td');
    if (this.tdElement) {
      this.tdElement.classList.toggle('ide-cust-class');
    }
  }

  getEngagementHoursData() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
    };
    this._dashboardService.getEngagementHoursData(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.engagementHourData = response?.data;
          this.engagementHoursChart(this.engagementHourData);
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

  getPostContentList() {
    this._loaderService.start();
    let param = {};
    param = {
      pageId: this.selectedPage?._id,
      page: this.currentPage,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    if (this.shortBy) {
      param = {
        ...param,
        sortByy: this.shortBy,
        sortMode: this.sortMode,
      };
    }

    if (this.searchText) {
      this.isSearch = true;
      param = {
        ...param,
        searchText: this.searchText,
      };
    }

    this._dashboardService.getPostContentList(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          let totalItems = response?.data?.count || 0;
          let pageSize = response?.data?.limit || 0;
          this.totalPages = Math.ceil(totalItems / pageSize);
          this.contentPostData = response?.data?.items;
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

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getPostContentList();
  }

  showPreview(data: any) {
    this.dialogRef = this._dialog.open(PostContentPreviewComponent, {
      width: '1130px',
      panelClass: 'custom-performance-modal',
      data: { ...data, selectedPage: this.selectedPage },
    });
  }

  engagementHoursChart(data: any) {
    const engagementHoursChartConfig =
      this.dashboardChartService.engagementHoursChart(data);
    if (document.getElementById('engagement-hour-chart')) {
      Highcharts.chart('engagement-hour-chart', engagementHoursChartConfig);
    }
  }

  boostPost(data: any) {
    if (this.tdElement) {
      this.tdElement.classList.remove('ide-cust-class');
    }
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
        let index = this.contentPostData.findIndex(
          (x: any) => x?.postId == result?._id
        );
        if (index !== -1) {
          this.contentPostData[index].isBoosting = true;
        }
      }
    });
  }

  actives(by: any) {
    this.shortBy = by;
  }

  sortTable(by: any) {
    this.tableHader.forEach((header: any) => {
      if (header.label == by && header?.isAllowShort) {
        header.activeSort = true;
        header.sortMode = !header.sortMode;
        this.shortBy = header?.label.toLowerCase();
        this.sortMode = header?.sortMode ? 1 : -1;
        this.getPostContentList();
      } else {
        header.activeSort = false;
      }
    });
  }

  hourFormmat(time: any) {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);

    return this.datePipe.transform(date, 'h:mm a');
  }

  searchPost(event: any): void {
    this.searchText = event.target.value;
    this.currentPage = 1;
    this.getPostContentList();
  }
  clearSearchText(): void {
    this.searchText = '';
    if (this.isSearch) {
      this.getPostContentList();
      this.isSearch = false;
    }
  }

  getPostBodyContent(item: any) {
    let postBody =
      item?.postType == 'ARTICLE'
        ? item?.title
        : item?.text
        ? item?.text
        : 'N/A';
    return postBody?.slice(0, 50) + (postBody?.length > 50 ? '...' : '');
  }
}
