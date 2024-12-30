import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_more from "highcharts/highcharts-more";
HC_more(Highcharts);

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  getReachChart(): Highcharts.Options {
    return {
      chart: {
        type: 'area',
      },
      credits: {
        enabled: false
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: ['9 Jun', '13 Jun', '18 Jun', '23 Jun', '28 Jun', '3 Jul', '9 Jul'],
      },
      yAxis: {
        title: {
          text: 'Reach',
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.key}</small><br/>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
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
          data: [34, 54, 45, 67, 98, 145, 156],
          color: '#E6762F', // Custom color for Organic
        },
        {
          type: 'area',
          name: 'Ads',
          data: [54, 67, 78, 89, 120, 180, 200],
          color: '#4B0082', // Custom color for Ads
        },
      ],
    };
  }

  audienceChart(): Highcharts.Options {
    return {
      chart: {
        type: 'line'
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['9 Jun', '13 Jun', '18 Jun', '23 Jun', '28 Jun', '3 Jul', '9 Jul']
      },
      yAxis: {
        title: {
          text: 'Audience'
        }
      },
      series: [{
        name: 'Followers',
        data: [341, 600, 341, 700, 341, 1200, 341],
        type: 'line',
        color: '#6929C4'
      }, {
        name: 'Connections',
        data: [200, 400, 341, 300, 341, 500, 341],
        type: 'line',
        color: '#1192E8'
      }],
      tooltip: {
        shared: true,
        valueSuffix: ' units'
      }
    }
  }

  engagementChart(): Highcharts.Options {
    return {
      chart: {
        type: 'line'
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['9 Jun', '13 Jun', '18 Jun', '23 Jun', '28 Jun', '3 Jul', '9 Jul']
      },
      yAxis: {
        title: {
          text: 'Interactions'
        }
      },
      series: [
        {
          name: 'Likes',
          data: [8, 12, 5, 9, 6, 11, 14],
          type: 'line',
          color: '#B45F43' // Red for Likes
        },
        {
          name: 'Comments',
          data: [0, 0, 0, 0, 0, 0, 0],
          type: 'line',
          color: '#1192E8' // Green for Comments
        },
        {
          name: 'Shares',
          data: [2, 0, 2, 1, 1, 2, 1],
          type: 'line',
          color: '#CF8BA9' // Blue for Shares
        },
        {
          name: 'Reactions',
          data: [1, 0, 1, 2, 3, 2, 2],
          type: 'line',
          color: '#AB8183' // Orange for Reactions
        }
      ],
      tooltip: {
        shared: true,
        valueSuffix: ' units'
      }
    }
  }
  
  ageGenderColumnChart(): Highcharts.Options {
    return {
      chart: {
        type: 'column'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Age & Gender'
      },
      xAxis: {
        categories: ['18-24', '25-34', '35-44', '45-54', '55-64'],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Percentage (%)'
        }
      },
      tooltip: {
        shared: true,
        valueSuffix: '%'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointPadding: 0,
          groupPadding: 0.05, // Further decrease padding for thinner bars
          borderWidth: 0,
          pointWidth: 15 
        }
      },
      legend: {
        symbolRadius: 0,
        symbolHeight: 12,
        symbolWidth: 12
      },
      series: [{
        name: 'She/Her',
        data: [5, 7, 15, 15, 15],
        type: 'column',
        color: '#D83B07'
      }, {
        name: 'He/Him',
        data: [5, 7, 15, 15, 15],
        type: 'column',
        color: '#000053'
      }, {
        name: 'They/Them',
        data: [5, 4, 15, 15, 15],
        type: 'column',
        color: '#684EA8'
      }, {
        name: 'Unknown',
        data: [3, 2, 15, 15, 15],
        type: 'column',
        color: '#CF810C'
      }]
    }
  }

  ageGenderPieChart(): Highcharts.Options {
    return {
      chart: {
        plotBackgroundColor: undefined,
        plotBorderWidth: undefined,
        plotShadow: false,
        type: 'pie'
      },
      credits: {
        enabled: false
      },
      title: {
        verticalAlign: 'middle',
        floating: true,
        text: 'Gender'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '80%', // Create a donut-style pie chart
          dataLabels: {
            enabled: true,
            distance: 0, // Labels inside the chart
            style: {
              fontWeight: 'bold',
              color: 'white'
            },
            format: '{point.percentage:.1f} %'
          },
          showInLegend: true
        }
      },
      legend: {
        symbolRadius: 0,
        symbolHeight: 12,
        symbolWidth: 12
      },
      series: [{
        data: [{
          name: 'She/Her',
          y: 40,
          color: '#FF5733'
        }, {
          name: 'He/Him',
          y: 40,
          color: '#000053'
        }, {
          name: 'They/Them',
          y: 10,
          color: '#684EA8'
        }, {
          name: 'Unknown',
          y: 10,
          color: '#CF810C'
        }],
        type: 'pie',
        name: 'Gender',        
      }]
    }
  }

  industriesBubbleChart(): Highcharts.Options {
   return {
    chart: {
      type: 'packedbubble',
      //height: '500px'
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    legend: {
      symbolRadius: 0,
      symbolHeight: 12,
      symbolWidth: 12
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.value}'
    },
    plotOptions: {
      packedbubble: {
        maxSize: '60%',
        layoutAlgorithm: {
          gravitationalConstant: 0.05,
          splitSeries: true,
          seriesInteraction: false,
          dragBetweenSeries: true,
          parentNodeLimit: true
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 250
          },
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal'
          }
        }
      }
    },
    series: [
      {
        name: 'IT',
        type: 'packedbubble',
        data: [
          { name: '13-24', value: 50 },
          { name: '25-34', value: 40 },
          { name: '35-44', value: 30 }
        ],
        color: '#5923A6' // Adjust color to match your design
      },
      {
        name: 'Banking',
        type: 'packedbubble',
        data: [
          { name: '13-24', value: 200 },
          { name: '25-34', value: 70 },
          { name: '35-44', value: 60 }
        ],
        color: '#000053' // Adjust color to match your design
      },
      {
        name: 'Marketing',
        type: 'packedbubble',
        data: [
          { name: '13-24', value: 30 },
          { name: '25-34', value: 20 },
          { name: '35-44', value: 30 }
        ],
        color: '#D83B07' // Adjust color to match your design
      },
      {
        name: 'Education',
        type: 'packedbubble',
        data: [
          { name: '13-24', value: 90 },
          { name: '25-34', value: 50 },
          { name: '35-44', value: 30 }
        ],
        color: '#CF810C' // Adjust color to match your design
      }
    ]   
   }
  }
  
}
