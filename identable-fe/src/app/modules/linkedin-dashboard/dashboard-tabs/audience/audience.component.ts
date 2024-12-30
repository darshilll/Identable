import { Component, Input, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

//LIBRARY
import * as Highcharts from 'highcharts';

// Services
import { DashboardService } from '../../../../providers/dashboard/dashboard.service';
import { LoaderService } from '../../../../providers/loader-service/loader.service';

// Chart Services
import { DashboardChartService } from '../../../../shared/services/linkedin-dashboard-chart/dashboard-chart.service';

//COMPONENT
import { TownEngagementComponent } from '../../dialog/town-engagement/town-engagement.component';

//UTILS
import { CommonFunctionsService } from '../../../../utils/common-functions/common-functions.service';
import { commonConstant } from '../../../../utils/common-functions/common-constant';
import { GlobalService } from '../../../../utils/common-functions/global.service';
import { ErrorModel } from '../../../../utils/models/error';
import { ResponseModel } from '../../../../utils/models/response';
import { MessageConstant } from '../../../../utils/message-constant';

import HighchartsMaps from 'highcharts/highmaps';
import worldMap from '@highcharts/map-collection/custom/world.geo.json';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss'],
})
export class AudienceComponent {
  @Input() selectedPage: any;

  private chart: any;

  countryDataWitId = commonConstant.countryDataWitId;

  ageGenderData: any;
  ageOrder: any = ['18-24', '25-32', '33-40', '41-54', '55+', 'Unknown'];
  connectionData: any;
  selectedType: any = 'followers';
  ageGenderColumnChartData: any;
  ageGenderPieChartData: any;
  indutryData: any;
  mapData: any;

  // dialog
  dialogRef: any;

  // Map Chart
  mapHighcharts: typeof HighchartsMaps = HighchartsMaps;
  mapChartConstructor = 'mapChart';
  mapChartData = [
    { code3: 'ABW', z: 105 },
    { code3: 'AFG', z: 35530 },
  ];
  mapChartOptions: Highcharts.Options = {};
  isMapLoaded: boolean = false;

  constructor(
    private _dialog: MatDialog,
    private dashboardChartService: DashboardChartService,
    private _dashboardService: DashboardService,
    private _loaderService: LoaderService,
    public _utilities: CommonFunctionsService,
    public _globalService: GlobalService,
    private toastr: ToastrService
  ) {
    this.initMapChart(null);
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPage']) {
      this.getAgeGenderData();
      this.getIndutryData();
      this.getMapData();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.ageGenderColumnChart();
      // this.ageGenderPieChart();
      //this.engagementMapData(this.mapData);
      //this.industriesBubbleChart(this.indutryData);
    }, 100);
  }

  initMapChart(data: any) {
    let countryData = [];

    for (let i = 0; i < data?.length; i++) {
      const item = data[i];

      const totalCount = item.data.reduce(
        (sum: any, city: any) => sum + city?.count,
        0
      );

      countryData.push({
        name: item?.country,
        value: totalCount,
      });
    }

    this.mapChartOptions = {
      chart: {
        map: worldMap,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox',
        },
      },
      legend: {
        enabled: true,
      },
      colorAxis: {
        min: 0,
      },
      series: [
        {
          type: 'map',
          name: 'Audience',
          states: {
            hover: {
              color: '#fe4810',
            },
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
          },
          allAreas: true,
          joinBy: 'name',
          data: countryData,
          point: {
            events: {
              click: (event: any) => {
                const countryName = event.point.name;
                this.openDialog(countryName); // Call dialog on click
              },
            },
          },
        },
      ],
    };

    this.isMapLoaded = true;
  }
  openDialog(country: any) {
    let data = this.mapData?.find(
      (x: any) => x?.country.toLowerCase() == country?.toLowerCase()
    );

    this.dialogRef = this._dialog.open(TownEngagementComponent, {
      width: '550px',
      data: data,
    });
  }

  ageGenderColumnChart(data: any) {
    const ageGenderColumnChartConfig =
      this.dashboardChartService.ageGenderColumnChart(data);
    if (document.getElementById('ageGender-column-chart')) {
      Highcharts.chart('ageGender-column-chart', ageGenderColumnChartConfig);
    }
  }

  ageGenderPieChart(data: any) {
    const ageGenderPieChartConfig =
      this.dashboardChartService.ageGenderPieChart(data);
    if (document.getElementById('ageGender-pie-chart')) {
      Highcharts.chart('ageGender-pie-chart', ageGenderPieChartConfig);
    }
  }

  industriesBubbleChart(data: any) {
    const industriesBubbleChartConfig =
      this.dashboardChartService.industriesBubbleChart(data);
    if (document.getElementById('industries-bubble-chart')) {
      Highcharts.chart('industries-bubble-chart', industriesBubbleChartConfig);
    }
  }

  getAgeGenderData() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
    };
    this._dashboardService.getAgeGenderData(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.ageGenderData = response.data;
          let columnChartData = this.ageGenderData?.followerData.sort(
            (a: any, b: any) => {
              return (
                this.ageOrder.indexOf(a.group) - this.ageOrder.indexOf(b.group)
              );
            }
          );
          this.ageGenderPieChartData = this.ageGenderData?.pieChart;

          this.ageGenderColumnChart(columnChartData);
          this.ageGenderPieChart(this.ageGenderPieChartData?.followerData);
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

  getIndutryData() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
    };
    this._dashboardService.getIndutryData(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.indutryData = response.data;
          this.industriesBubbleChart(this.indutryData);
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

  getMapData() {
    this._loaderService.start();
    let param = {
      pageId: this.selectedPage?._id,
    };
    this._dashboardService.getMapData(param).subscribe(
      (response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.mapData = response.data;
          // this.engagementMapData(this.mapData);
          this.initMapChart(this.mapData);
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

  selectType(type: any) {
    this.selectedType = type;
    if (type == 'followers') {
      let columnChartData = this.ageGenderData?.followerData.sort(
        (a: any, b: any) => {
          return (
            this.ageOrder.indexOf(a.group) - this.ageOrder.indexOf(b.group)
          );
        }
      );
      this.ageGenderColumnChart(columnChartData);
      this.ageGenderPieChart(this.ageGenderPieChartData?.followerData);
    } else if (type == 'connections') {
      let columnChartData = this.ageGenderData?.connectionData.sort(
        (a: any, b: any) => {
          return (
            this.ageOrder.indexOf(a.group) - this.ageOrder.indexOf(b.group)
          );
        }
      );
      this.ageGenderColumnChart(columnChartData);
      this.ageGenderPieChart(this.ageGenderPieChartData?.connectionData);
    } else if (type == 'both') {
      let columnChartData = this.ageGenderData?.bothData.sort(
        (a: any, b: any) => {
          return (
            this.ageOrder.indexOf(a.group) - this.ageOrder.indexOf(b.group)
          );
        }
      );
      this.ageGenderColumnChart(columnChartData);
      this.ageGenderPieChart(this.ageGenderPieChartData?.bothData);
    }
  }
}
