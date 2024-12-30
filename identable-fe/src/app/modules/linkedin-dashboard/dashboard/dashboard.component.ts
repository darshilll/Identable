import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import moments from 'moment';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

// COMPONENTS
import { CustomFilterdialogComponent } from 'src/app/shared/dialog/custom-filterdialog/custom-filterdialog.component';
// SERVICES
import { LoaderService } from '../../../providers/loader-service/loader.service';
import { UserService } from '../../../providers/user/user.service';

//UTILS
import { CommonFunctionsService } from '../../../utils/common-functions/common-functions.service';
import { GlobalService } from '../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../utils/models/error';
import { ResponseModel } from '../../../utils/models/response';
import { MessageConstant } from '../../../utils/message-constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup | any;
  isDsahboardLoaded: boolean = false;
  activeTabIndex: number = 0;
  linkedInPageList: any;
  selectedPage: any;
  selectedDuration: any;
  filterStartDate: any;
  filterEndDate: any;
  lastFilterSlection: any;
  dialogRef: any;

  filterTimePeriodList = [
    'Last 7 days',
    'This Week',
    'This Month',
    'This Quarter',
    'This Year',
    'Last Week',
    'Last Month',
    'Last Quarter',
    'Last Year',
    'Custom',
  ];

  constructor(
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private _titleService: Title,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initView();
    this._titleService.setTitle('Identable | Dashboard');
  }

  async initView() {
    await this._globalService.getUserDetails({ isRefresh: false });
    await this._globalService.getLinkedinPageList({ isRefresh: false });
    this.linkedInPageList = this._utilities.linkedinPageList.filter(
      (x: any) => x?.isAccess
    );
    let currentPageIndex = this.linkedInPageList?.findIndex(
      (x: any) => x?._id == this._utilities.userData?.currentPageId
    );

    this.selectPage(this.linkedInPageList[currentPageIndex]);
    this.onTimePeriod('Last 7 days');
    this.isDsahboardLoaded = this._utilities?.userData?.isDsahboardLoaded
      ? false
      : true;
  }

  selectPage(page: any) {
    this.selectedPage = page;
    this.tabGroup.selectedIndex = page;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.activeTabIndex = event.index;
  }

  goToContentPage() {
    this.tabGroup.selectedIndex = 3;
  }

  onTimePeriod(duration: any) {
    if (duration.toLowerCase() != 'custom') {
      this.lastFilterSlection = duration;
    }

    this.selectedDuration = duration;
    if (duration.toLowerCase() == 'custom') {
      this.dialogRef = this._dialog.open(CustomFilterdialogComponent, {
        width: '450px',
        data: { startDate: this.filterStartDate, endDate: this.filterEndDate },
      });
      this.dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          if (result?.startDate) {
            this.filterStartDate = result.startDate;
          }
          if (result?.endDate) {
            this.filterEndDate = result.endDate;
          }
        } else {
          this.selectedDuration = this.lastFilterSlection;
        }
      });
      return;
    }
    let { startDate, endDate } = this.getFilterDate(duration);
    this.filterStartDate = startDate;
    this.filterEndDate = endDate;
  }

  getFilterDate(filterBy: any, filterStartDate = 0, filterEndDate = 0) {
    let startDate = '';
    let endDate = '';
    let currentStartDate = '';
    let currentEndDate = '';
    // let timezoneOffset = this._utilities.dueDateFormat().browserTimezone;

    if (filterBy?.toLowerCase() == 'This Week'?.toLowerCase()) {
      currentStartDate = moments()
        .clone()
        .startOf('week')
        .weekday(1)
        .format('YYYY-MM-DD');
      currentEndDate = moments()
        .clone()
        .endOf('week')
        .weekday(7)
        .format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'This Month'?.toLowerCase()) {
      currentStartDate = moments()
        .clone()
        .startOf('month')
        .format('YYYY-MM-DD');
      currentEndDate = moments().clone().endOf('month').format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'This Quarter'?.toLowerCase()) {
      let currentQuarter = Math.floor(moments().month() / 3) + 1;
      currentStartDate = moments()
        .quarter(currentQuarter)
        .startOf('quarter')
        .format('YYYY-MM-DD');
      currentEndDate = moments()
        .quarter(currentQuarter)
        .endOf('quarter')
        .format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'This Year'?.toLowerCase()) {
      currentStartDate = moments().clone().startOf('year').format('YYYY-MM-DD');
      currentEndDate = moments().clone().endOf('year').format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'Last Week'?.toLowerCase()) {
      currentStartDate = moments()
        .subtract(7, 'days')
        .startOf('week')
        .weekday(1)
        .format('YYYY-MM-DD');
      currentEndDate = moments()
        .subtract(7, 'days')
        .endOf('week')
        .weekday(7)
        .format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'Last Month'?.toLowerCase()) {
      currentStartDate = moments()
        .subtract(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD');
      currentEndDate = moments()
        .subtract(1, 'month')
        .endOf('month')
        .format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'Last Quarter'?.toLowerCase()) {
      let currentQuarter = Math.floor(moments().month() / 3);
      currentStartDate = moments()
        .quarter(currentQuarter)
        .startOf('quarter')
        .format('YYYY-MM-DD');
      currentEndDate = moments()
        .quarter(currentQuarter)
        .endOf('quarter')
        .format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'Last Year'?.toLowerCase()) {
      currentStartDate = moments()
        .subtract(1, 'year')
        .startOf('year')
        .format('YYYY-MM-DD');
      currentEndDate = moments()
        .subtract(1, 'year')
        .endOf('year')
        .format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'Last 7 Days'?.toLowerCase()) {
      currentStartDate = moments(new Date())
        .utcOffset('')
        .subtract(6, 'days')
        .startOf('day')
        .format('YYYY-MM-DD');
      currentEndDate = moments(new Date()).utcOffset('').format('YYYY-MM-DD');
    } else if (filterBy?.toLowerCase() == 'Custom'?.toLowerCase()) {
      let ak = moments(new Date(filterStartDate)).format('YYYY-MM-DD');

      let startDate1 = new Date(ak + 'T00:00:00.000Z');
      let startDate11 = new Date(startDate1).getTime();
      startDate = String(
        startDate11 + startDate1.getTimezoneOffset() * 60 * 1000
      );

      let bk = moments(new Date(filterEndDate)).format('YYYY-MM-DD');
      let endDate1 = new Date(bk + 'T23:59:59.000Z');
      let endDate11 = new Date(endDate1).getTime();
      endDate = String(endDate11 + endDate1.getTimezoneOffset() * 60 * 1000);
    }
    if (filterBy?.toLowerCase() != 'Custom'?.toLowerCase()) {
      let startDate1 = new Date(currentStartDate + 'T00:00:00.000Z');
      let startDate11 = new Date(startDate1).getTime();
      startDate = String(
        startDate11 + startDate1.getTimezoneOffset() * 60 * 1000
      );

      let endDate1 = new Date(currentEndDate + 'T23:59:59.000Z');
      let endDate11 = new Date(endDate1).getTime();
      endDate = String(endDate11 + endDate1.getTimezoneOffset() * 60 * 1000);
    }
    return { startDate, endDate };
  }
}
