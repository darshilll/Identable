import { Component, Input, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

//LIBRARY
import * as Highcharts from 'highcharts';

// Services
import { DashboardService } from '../../../../providers/dashboard/dashboard.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';

// Chart Services
import { DashboardChartService } from '../../../../shared/services/linkedin-dashboard-chart/dashboard-chart.service';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../../utils/common-functions/common-constant';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

@Component({
  selector: 'app-benchmarking',
  templateUrl: './benchmarking.component.html',
  styleUrls: ['./benchmarking.component.scss'],
})
export class BenchmarkingComponent {
  socialSellingIndexData: any=[];
  currentSsiInfo: any;
  peopleIndustryInfo: any;
  peopleNetworkInfo: any;
  constructor(
    private dashboardChartService: DashboardChartService,
    private _dashboardService: DashboardService,
    private _loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSocialSellingIndexData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.socialSellingIndexChart('', '', '');
    });
  }

  socialSellingIndexChart(
    currentSsiInfo: any,
    peopleIndustryInfo: any,
    peopleNetworkInfo: any
  ) {
    const socialSellingIndexChartConfig =
      this.dashboardChartService.socialSellingIndexChart(currentSsiInfo);
    if (document.getElementById('social-selling-chart')) {
      Highcharts.chart('social-selling-chart', socialSellingIndexChartConfig);
    }
    const socialSellingIndexChartConfig1 =
      this.dashboardChartService.socialSellingIndexChart(peopleIndustryInfo);
    if (document.getElementById('social-selling-chart1')) {
      Highcharts.chart('social-selling-chart1', socialSellingIndexChartConfig1);
    }
    const socialSellingIndexChartConfig2 =
      this.dashboardChartService.socialSellingIndexChart(peopleNetworkInfo);
    if (document.getElementById('social-selling-chart2')) {
      Highcharts.chart('social-selling-chart2', socialSellingIndexChartConfig2);
    }
  }

  getSocialSellingIndexData() {
    this._dashboardService.getSocialSellingIndexData({}).subscribe(
      (response: ResponseModel) => {
        this._loaderService.stop();

        if (response.statusCode == 200) {
          this.socialSellingIndexData = response?.data?.ssiData;
          this.currentSsiInfo =
            this.socialSellingIndexData?.current_ssi_info;
          this.peopleIndustryInfo =
            this.socialSellingIndexData?.people_in_your_industry_info;
          this.peopleNetworkInfo =
            this.socialSellingIndexData?.people_in_your_network_info;
          this.socialSellingIndexChart(
            this.currentSsiInfo,
            this.peopleIndustryInfo,
            this.peopleNetworkInfo
          );
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
}
