import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import XRangeModule from 'highcharts/modules/xrange';
HC_more(Highcharts);
XRangeModule(Highcharts);

@Injectable({
  providedIn: 'root',
})
export class DashboardChartService {
  constructor() {}

  colorSet: any = [
    '#FF5733', // Red-Orange
    '#33FF57', // Green
    '#3357FF', // Blue
    '#FF33A1', // Pink
    '#33FFA1', // Light Green
    '#A133FF', // Purple
    '#FFA133', // Orange
    '#33A1FF', // Light Blue
    '#FF5733', // Red-Orange (duplicate)
    '#A1FF33', // Lime Green
    '#FF8C00', // Dark Orange
    '#FF1493', // Deep Pink
    '#00FF7F', // Spring Green
    '#1E90FF', // Dodger Blue
    '#FFD700', // Gold
  ];

  getReachChart(data: any): Highcharts.Options {
    const categories = data?.chartData?.map((item: any) => `${item?.start}`);
    const organicData = data?.chartData?.map(
      (item: any) => item?.totalUniqueViews
    );

    return {
      chart: {
        type: 'area',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Time period',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Reach',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.key}</small><br/>',
        pointFormat:
          '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
        style: {
          fontSize: '14px', // Adjust font size
          color: '#333333', // Adjust color
        },
      },
      plotOptions: {
        area: {
          stacking: 'normal' as Highcharts.OptionsStackingValue, // Ensure correct type
          marker: {
            enabled: true,
            radius: 3,
          },
          fillOpacity: 0.3,
        },
      },
      series: [
        {
          type: 'area',
          name: 'Organic',
          data: organicData,
          color: '#E6762F', // Custom color for Organic
        },
        // {
        //   type: 'area',
        //   name: 'Ads',
        //   data: [54, 67, 78, 89, 120, 180, 200],
        //   color: '#4B0082', // Custom color for Ads
        // },
      ],
    };
  }

  audienceChart(data: any): Highcharts.Options {
    const categories = data?.chartData?.map((item: any) => `${item?.start}`);
    const followersCount = data?.chartData?.map(
      (item: any) => item?.followersCount
    );
    const connectionsCount = data?.chartData?.map(
      (item: any) => item?.connectionsCount
    );
    return {
      chart: {
        type: 'line',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Time period',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Audience',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
      },
      series: [
        {
          name: 'Followers',
          data: followersCount,
          type: 'line',
          color: '#6929C4',
        },
        {
          name: 'Connections',
          data: connectionsCount,
          type: 'line',
          color: '#1192E8',
        },
      ],
      tooltip: {
        shared: true,
        valueSuffix: ' units',
      },
    };
  }

  engagementChart(data: any): Highcharts.Options {
    const categories = data?.chartData?.map((item: any) => `${item?.start}`);
    const commentCount = data?.chartData?.map(
      (item: any) => item?.commentCount
    );
    const likeCount = data?.chartData?.map((item: any) => item?.likeCount);
    const repostCount = data?.chartData?.map((item: any) => item?.repostCount);
    return {
      chart: {
        type: 'line',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Time period',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
      },
      yAxis: {
        title: {
          text: 'Interactions',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
      },
      series: [
        {
          name: 'Likes',
          data: likeCount,
          type: 'line',
          color: '#B45F43', // Red for Likes
        },
        {
          name: 'Comments',
          data: commentCount,
          type: 'line',
          color: '#1192E8', // Green for Comments
        },
        {
          name: 'Repost',
          data: repostCount,
          type: 'line',
          color: '#CF8BA9', // Blue for Shares
        },
        // {
        //   name: 'Reactions',
        //   data: [1, 0, 1, 2, 3, 2, 2],
        //   type: 'line',
        //   color: '#AB8183', // Orange for Reactions
        // },
      ],
      tooltip: {
        shared: true,
        valueSuffix: ' units',
      },
    };
  }

  campaignChart(data: any): Highcharts.Options {
    const campaignList = data?.map((item: any) => item?.campaignName);
    const connectedCount = data?.map((item: any) => item?.connectedCount);
    const acceptanceRateList = data?.map((item: any) =>
      this.getAcceptanceRate(item)
    );

    const prospectsList = data?.map((item: any) => item?.count);

    return {
      chart: {
        type: 'column',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
        //text: 'Campaign Performance',
      },
      xAxis: {
        categories: campaignList,
        title: {
          text: 'Campaigns',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
        labels: {
          //rotation: -45, // Rotate labels for better readability
        },
      },
      yAxis: {
        title: {
          text: 'Connected Users',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
        min: 0,
      },
      plotOptions: {
        column: {
          pointWidth: 50,
        },
      },
      series: [
        {
          name: 'Campaigns',
          data: connectedCount,
          type: 'column',
          color: '#ffbaa8', // Main column color
          dataLabels: {
            enabled: true,
            inside: true, // Display inside the column
            formatter: function () {
              // Get the index of the current column
              const index = this.point.index;
              // Get the corresponding acceptance rate
              const acceptanceRate = acceptanceRateList[index];
              // Display both connected users and acceptance rate
              return `${this.y} (${acceptanceRate})`;
            },
          },
        },
      ],
      tooltip: {
        shared: true,
        formatter: function () {
          // Check if this.points is defined and has at least one point
          if (this.points && this.points[0]) {
            const index = this.points[0].point.index; // Get the index of the current column
            const connectedUsers = this.points[0].y;
            const acceptanceRate = acceptanceRateList[index]; // Use the index to get the corresponding acceptance rate
            const prospectsCount = prospectsList[index]; // Use the index to get the corresponding acceptance rate

            let tooltip = `<strong>${this.x}</strong><br/>`;
            tooltip += `Connected Users: ${connectedUsers} / ${prospectsCount} <br/>`;
            tooltip += `Acceptance Rate: ${acceptanceRate}<br/>`;

            return tooltip;
          }

          return ''; // Return an empty string if points are undefined
        },
      },
    };
  }

  ageGenderColumnChart(data: any): Highcharts.Options {
    let ageCategoties = data?.map((item: any) => item.group);
    let womenCount = data?.map((item: any) => item.womenCount);
    let menCount = data?.map((item: any) => item.menCount);
    let otherCount = data?.map((item: any) => item.otherCount);

    return {
      chart: {
        type: 'column',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: ' ',
      },
      xAxis: {
        categories: ageCategoties,
        crosshair: true,
        title: {
          text: 'Age group',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percentage (%)',
          style: {
            fontWeight: 'bold',
            color: '#000000',
          },
        },
      },
      tooltip: {
        shared: true,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointPadding: 0,
          groupPadding: 0.05, // Further decrease padding for thinner bars
          borderWidth: 0,
          pointWidth: 15,
        },
      },
      legend: {
        symbolRadius: 0,
        symbolHeight: 12,
        symbolWidth: 12,
      },
      series: [
        {
          name: 'She/Her',
          data: womenCount,
          type: 'column',
          color: '#D83B07',
        },
        {
          name: 'He/Him',
          data: menCount,
          type: 'column',
          color: '#000053',
        },
        {
          name: 'Unknown',
          data: otherCount,
          type: 'column',
          color: '#CF810C',
        },
      ],
    };
  }

  // {
  //   name: 'They/Them',
  //   data: [5, 4, 15, 15, 15],
  //   type: 'column',
  //   color: '#684EA8',
  // },

  ageGenderPieChart(data: any): Highcharts.Options {
    return {
      chart: {
        plotBackgroundColor: undefined,
        plotBorderWidth: undefined,
        plotShadow: false,
        type: 'pie',
      },
      credits: {
        enabled: false,
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        text: 'Gender',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '80%', // Create a donut-style pie chart
          dataLabels: {
            enabled: true,
            distance: 25, // Labels inside the chart
            style: {
              fontWeight: 'bold',
              color: 'black',
            },
            format: '{point.percentage:.1f} %',
          },
          showInLegend: true,
        },
      },
      legend: {
        symbolRadius: 0,
        symbolHeight: 12,
        symbolWidth: 12,
      },
      series: [
        {
          data: [
            {
              name: 'She/Her',
              y: parseFloat(data?.womenPer),
              color: '#FF5733',
            },
            {
              name: 'He/Him',
              y: parseFloat(data?.menPer),
              color: '#000053',
            },
            {
              name: 'Unknown',
              y: parseFloat(data?.otherPer),
              color: '#CF810C',
            },
          ],
          type: 'pie',
          name: 'Gender',
        },
      ],
    };
  }

  // {
  //   name: 'They/Them',
  //   y: 10,
  //   color: '#684EA8',
  // },

  industriesBubbleChart(data: any): Highcharts.Options {
    const seriesData = data.map((industry: any, index: number) => {
      let allGroups1 = [
        ...industry.menData,
        ...industry.womenData,
        ...industry.otherData,
      ];

      let allGroups: any[] = [];
      for (let i = 0; i < allGroups1?.length; i++) {
        const element = allGroups1[i];

        let resultFilterArray = allGroups?.filter(
          (x) => x?.group == element?.group
        );

        if (resultFilterArray?.length > 0) {
          resultFilterArray[0]['count'] =
            resultFilterArray[0]['count'] + element?.count;
        } else {
          allGroups.push({
            group: element?.group,
            count: element?.count,
          });
        }
      }

      allGroups?.sort((a, b) => a?.group.localeCompare(b?.group));

      return {
        name: industry.industryName || 'Unknown Industry',
        type: 'packedbubble',
        data: allGroups.map((group) => ({
          name: group.group,
          value: group.count,
          industryName: industry.industryName, // Add industry name to use in tooltip
        })),
        color: this.colorSet[index % this.colorSet.length], // Assuming you have a method to assign colors
      };
    });

    return {
      chart: {
        type: 'packedbubble',
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
      legend: {
        symbolRadius: 0,
        symbolHeight: 12,
        symbolWidth: 12,
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          if (
            this.series.type === 'packedbubble' &&
            this.point &&
            this.point.options.value !== undefined
          ) {
            // If it's a sub-bubble, show detailed info for that group
            return `<b>${this.point.name}:</b> ${this.point.options.value}`;
          } else {
            // If it's the main bubble, show info for all sub-bubbles
            let details = `<b style="color: ${this.series.color}; border-left:3px solid ${this.series.color}; padding-left: 3px; margin-bottom: 5px; display: inline-block;">${this.series.name}</b><br/>`;
            let totalVal = 0;
            this.series.points.forEach((point: any) => {
              details += `<b>${point.name}:</b> ${point.options.value}<br/>`;
              totalVal += point.options.value;
            });
            details += `<b>Total:</b> ${totalVal}<br/>`;
            return details;
          }
        },
      },
      plotOptions: {
        packedbubble: {
          maxSize: '60%',
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: true,
            parentNodeLimit: true,
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 250,
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal',
            },
          },
        },
      },
      series: seriesData,
      // series: [
      //   {
      //     name: 'IT',
      //     type: 'packedbubble',
      //     data: [
      //       { name: '13-24', value: 50 },
      //       { name: '25-34', value: 40 },
      //       { name: '35-44', value: 30 },
      //     ],
      //     color: '#5923A6', // Adjust color to match your design
      //   },
      //   {
      //     name: 'Banking',
      //     type: 'packedbubble',
      //     data: [
      //       { name: '13-24', value: 200 },
      //       { name: '25-34', value: 70 },
      //       { name: '35-44', value: 60 },
      //     ],
      //     color: '#000053', // Adjust color to match your design
      //   },
      //   {
      //     name: 'Marketing',
      //     type: 'packedbubble',
      //     data: [
      //       { name: '13-24', value: 30 },
      //       { name: '25-34', value: 20 },
      //       { name: '35-44', value: 30 },
      //     ],
      //     color: '#D83B07', // Adjust color to match your design
      //   },
      //   {
      //     name: 'Education',
      //     type: 'packedbubble',
      //     data: [
      //       { name: '13-24', value: 90 },
      //       { name: '25-34', value: 50 },
      //       { name: '35-44', value: 30 },
      //     ],
      //     color: '#CF810C', // Adjust color to match your design
      //   },
      // ],
    };
  }

  // Benchmarking chart

  socialSellingIndexChart(chartData: any): Highcharts.Options {
    let colorSet = ['#e55800', '#827be9', '#087889', '#0091ca', '#eaeef1'];
    let data = chartData?.chart_data?.map((item: any, index: any) => {
      return {
        name: item?.title,
        y: Number(item?.value),
        color: colorSet[index],
      };
    });
    let isRemainingPoint = data?.find(
      (x: any) => x?.name == 'Remaining points'
    );
    if (!isRemainingPoint) {
      const total = data?.reduce((sum: any, item: any) => sum + item.y, 0);
      let remainingPoints = 100 - total;
      data.push({
        name: 'Remaining points',
        y: remainingPoints,
        color: '#eaeef1',
      });
    }
    let score = chartData?.score;
    console.log('====', data);

    return {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '80%', // Create a donut-style pie chart
          dataLabels: {
            enabled: false,
          },
          showInLegend: false, // Hide legend since it's not shown in the image
        },
      },
      series: [
        {
          data: data,
          type: 'pie',
          name: 'Social Selling Index',
        },
      ],
    };
  }

  engagementHoursChart(chartData: any): Highcharts.Options {
    // Safety check for the data
    if (!chartData || chartData.length === 0) {
      console.error('No map data provided.');
      return {};
    }

    const data = chartData;

    // Parse data for Highcharts format
    const seriesData = data.map((item: any) => {
      const [hours, minutes] = item.bestHour.split(':').map(Number);
      return {
        x: Date.UTC(2023, 7, 14, hours, minutes),
        y: item.dayOfWeek - 1,
        name: `Time: ${item.bestHour}`,
        bestImpression: item.bestImpression,
        bestLike: item.bestLike,
        bestComment: item.bestComment,
        bestRepost: item.bestRepost,
      };
    });

    return {
      chart: {
        type: 'scatter', // Use scatter for dot chart
      },
      title: {
        text: '',
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Time of the day',
        },
        labels: {
          format: '{value:%I:%M %p}', // 12-hour format with AM/PM
        },
      },
      yAxis: {
        title: {
          text: '',
        },
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        reversed: true,
        min: 0,
        max: 6,
        tickInterval: 1,
      },
      series: [
        {
          type: 'scatter',
          name: 'Engagement',
          color: '#FF5733',
          data: seriesData,
          marker: {
            radius: 6,
            symbol: 'circle',
          },
          tooltip: {
            headerFormat: '<b>{point.name}</b><br>',
            pointFormat: `
              Impressions: {point.bestImpression}<br/>
              Likes: {point.bestLike}<br/>
              Comments: {point.bestComment}<br/>
              Reposts: {point.bestRepost}
            `,
          },
        },
      ],
      tooltip: {
        shared: true,
      },
    };
  }

  getAcceptanceRate(listData: any) {
    let per = 0;
    if (listData?.connectedCount > 0 && listData?.count > 0) {
      per = (listData?.connectedCount * 100) / listData?.count;
    }

    return per?.toFixed(2) + '%';
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
