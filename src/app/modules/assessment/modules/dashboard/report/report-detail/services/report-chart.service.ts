import { Injectable } from '@angular/core';
import { Chart } from 'angular-highcharts';

import { ChapterFilter, Comparison } from '../adapter/report-modal';

@Injectable()
export class ReportChartService {

  constructor() { }


  /**
   * Generated Mock Report (Difficulty Wise & Question Type Wise)
   */
  generateChart(data: object) {

    return new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: `${data['title']} (%)`
      },
      credits: {
        enabled: false
      },
      xAxis: {
        visible: false
      },
      yAxis: {
        max: 100,
        title: {
          text: 'Question Correct (%)'
        }
      },
      tooltip: {
        headerFormat: '<table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}</td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      series: data['series']
    });
  }


  /***
   * Generated Attempted & Corrected Ratio Report
   */
  generateAttemptedCorrectedChart(data: object) {
    return new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Attempted vs Correct Ratio'
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Total Questions (%)'
        }
      },
      xAxis: {
        categories: data['category']
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">Attempted Correct Ratio</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Attempted Ratio',
        data: data['attemptedRatio']
      }, {
        name: 'Correct Ratio',
        data: data['correctedRatio']
      }]
    });
  }


  /**
   * Generated Last Tests Score Report
   */
  generateScoreChart(score: Array<number>, category: Array<string>) {

    return new Chart({
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Score'
      },
      yAxis: {
        title: {
          text: 'Score'
        },
      },
      xAxis: {
        categories: category
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{series.name}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">Score: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
        }
      },

      series: [{
        name: 'Score',
        data: score
      }],
    });
  }


  /**
   * Generate Assessment Test Rank Report
   */
  generateRankReport(data) {

    return new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: `${data.title} (%)`
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: data.category
      },
      yAxis: {
        visible: false
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          name: `Percentile`,
          data: data.data
        }
      ]
    });
  }


  chapterChart(data: ChapterFilter) {

    return new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: null
      },
      xAxis: {
        categories: data.categories,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Questions',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ''
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'right',
        verticalAlign: 'top',
        floating: false,
        borderWidth: 1,
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Accuracy (%)',
        data: data.accuracy
      }]
    });
  }


  comparisonChart(report: any) {

    return new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: report.title,
      },
      xAxis: {
        categories: report.subject
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: report.yTitle
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:15px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [
        {
          name: 'You',
          data: report.you
        },
        {
          name: 'Topper',
          data: report.topper
        },
        {
          name: 'Average',
          data: report.average
        },
      ]
    });
  }
}
