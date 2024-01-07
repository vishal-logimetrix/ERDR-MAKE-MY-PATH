import { LocationStrategy } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { ReportAdapter } from '../report/report-detail/adapter/report-modal';

@Component({
  selector: 'app-mentor-practice-report',
  templateUrl: './mentor-practice-report.component.html',
  styleUrls: ['./mentor-practice-report.component.scss']
})
export class MentorPracticeReportComponent implements OnInit {

  columnChart: Chart;
  donutChart: Chart;
  @Input() subjects: any
  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private locationStrategy: LocationStrategy,
    private toastr: ToastrService
  ) {
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

  reportObj: any;

  difficultyWiseChart: any;
  questionWiseChart: any;

  viewChapteWiseReport = false;
  viewTestAnalysis = false;
  viewPercentileReport = false;
  viewAttemptedCorrectedReport = false;
  viewComparisonReport = false;

  contentAvailable = true;
  accuracyData = [];
  paperDetails;
  excellentChapters = null;
  averageChapters = null;
  poorChapter = null;

  convertedData = [];
  subjectNames = [];
  chartOptions = {};
  highcharts = Highcharts;
  chartOptionsb = {};
  highchartsb = Highcharts;
  subjectScoresArrary = [];
  subjectTotalArray = [];
  showGraph: boolean = false;
  convertedDataChapter = [];
  chapterNames = [];
  padding: number;
  totalusers;
  examId;
  showChapterGraph: boolean = false;
  hasSubjective: boolean = false;
  noripple: boolean = false;
  ripple: boolean = true;
  convertedDataAttempt = [];
  convertedDataCorrect = [];
  convertedDataIncorrect = [];
  chartOptionsa = {};
  chartOptionsc = {};
  overallPerc;
  attemptedPerc;
  correctPerc;
  incorrectPerc;
  skippedPerc;

  getExamDetails(){
    this.networkRequest.getWithHeaders(`/api/examuserscount/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("total users ", data);
        this.totalusers = data['totalusers'];
      },
      error => {
        console.log("error ", error);
      }
    );
  }
 
  initGraph() {
    this.chartOptions = {   
       chart: {
          type: 'pie',
          backgroundColor : '#F5F4F4'
       },
       credits: {
        enabled: false
      },tooltip: { enabled: false },
       title: {
        text: this.overallPerc,
        verticalAlign: 'middle',
        floating: true
     },
      
      //  tooltip : {
      //     headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
      //     pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
      //        '<td style = "padding:0"><b>{point.y} </b></td></tr>', footerFormat: '</table>', shared: true, useHTML: true
      //  },
      //  plotOptions : {
      //     column: {
      //        pointPadding: 0,
      //        borderWidth: 0
      //     }
      //  },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
              dataLabels: {
                  enabled: false,
              }
        }
      },
      colors: [
        '#6699FF',
        '#1FD115',
        '#56BE89',
        '#808080'
    ],
    series:  [{
      innerSize: '80%',
      data: this.convertedData
    }],
    
    };
 }

 initGrapha() {
  this.chartOptionsa = {   
     chart: {
      height: 150,
      width: 150,
        type: 'pie',
        backgroundColor : '#FFFFFF'
     },
     credits: {
      enabled: false
    },tooltip: { enabled: false },
     title: {
      text: this.attemptedPerc,
      verticalAlign: 'middle',
      floating: true
     },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
            dataLabels: {
                enabled: false,
            }
      }
    },
    colors: [
      '#6699FF',
      '#9460FF',
      '#56BE89',
      '#808080'
  ],
  series:  [{
    innerSize: '80%',
    data: this.convertedDataAttempt
  }],
  
  };
}

initGraphb() {
  this.chartOptionsb = {   
     chart: {
      height: 150,
      width: 150,
        type: 'pie',
        backgroundColor : '#FFFFFF'
     },
     credits: {
      enabled: false
    },tooltip: { enabled: false },
     title: {
      text: this.skippedPerc,
      verticalAlign: 'middle',
      floating: true
     },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
            dataLabels: {
                enabled: false,
            }
      }
    },
    colors: [
      '#6699FF',
      '#ffa500',
      '#56BE89',
      '#808080'
  ],
  series:  [{
    innerSize: '80%',
    data: this.convertedDataCorrect
  }],
  
  };
}

initGraphc() {
  this.chartOptionsc = {   
     chart: {
      height: 150,
      width: 150,
        type: 'pie',
        backgroundColor : '#FFFFFF'
     },
     credits: {
      enabled: false
    },tooltip: { enabled: false },
     title: {
      text: this.incorrectPerc,
      verticalAlign: 'middle',
      floating: true
     },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
            dataLabels: {
                enabled: false,
            }
      }
    },
    colors: [
      '#6699FF',
      '#FF1900',
      '#56BE89',
      '#808080'
  ],
  series:  [{
    innerSize: '80%',
    data: this.convertedDataIncorrect
  }],
  
  };
}
  
  openNewPaper(exam, paper) {
    
    const testWindowUrl = `/assessment/paper/test-instructions/${exam}?paper=${paper}`;
    // console.log("testWindowUrl", testWindowUrl);
    // Open new test window
    const testWindow = window.open(testWindowUrl, 'Test', 'fullscreen');

    // // Test window settings
    if (testWindow.outerWidth < screen.availWidth || testWindow.outerHeight < screen.availHeight) {
      testWindow.moveTo(0, 0);
      testWindow.resizeTo(screen.availWidth, screen.availHeight);
    }
  }

  /**
   * Fetches the report according to the type of test
   */
  getReport() {
    if (this.reportObj['type'] === 'mock') {
      this.getMockReport();
    } else if (this.reportObj['type'] === 'assessment') {
      this.getAssessmentReport();
    }
  }


  /**
   * Fetches Assessment test report from server
   */
  getAssessmentReport() {

    this.contentAvailable = false;
    // this.misc.showLoader();

    this.networkRequest.getWithHeaders(`/api/mentorassessmentpaper_report/${this.reportObj['id']}/`).subscribe(
      data => {

        // this.misc.hideLoader();
        this.noripple = true;
        this.ripple = false;

        this.reportObj = { ...this.reportObj, ...data };
        this.needleValue = this.reportObj['report_data']['percentage'];
        this.bottomLabel = ((Math.round(this.reportObj['report_data']['percentage'] * 100) / 100).toFixed(2))+'%';

        console.log("reportobj", this.reportObj);
        this.overallPerc = ((Math.round(this.reportObj['report_data']['corrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))+'%';
        this.attemptedPerc = ((Math.round(this.reportObj['report_data']['attempted'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))+'%';
        this.skippedPerc = ((Math.round(this.reportObj['report_data']['skipped'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))+'%';
        this.incorrectPerc = ((Math.round(this.reportObj['report_data']['incorrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))+'%';
       
        var tmpData: any;
        tmpData = {
          name: '', 
          y: (100-Number((Math.round(this.reportObj['report_data']['corrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))),
          color: '#e7eaeb'
        };
        this.convertedData.push(tmpData);
        tmpData = {
          name: '', 
          y: Number((Math.round(this.reportObj['report_data']['corrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))
        };
        this.convertedData.push(tmpData);
        this.initGraph();

        tmpData = {
          name: '', 
          y: (100-Number((Math.round(this.reportObj['report_data']['attempted'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))),
          color: '#e7eaeb'
        };
        this.convertedDataAttempt.push(tmpData);
        tmpData = {
          name: '', 
          y: Number((Math.round(this.reportObj['report_data']['attempted'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))
        };
        this.convertedDataAttempt.push(tmpData);
        this.initGrapha();

        tmpData = {
          name: '', 
          y: (100-Number((Math.round(this.reportObj['report_data']['skipped'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))),
          color: '#e7eaeb'
        };
        this.convertedDataCorrect.push(tmpData);
        tmpData = {
          name: '', 
          y: Number((Math.round(this.reportObj['report_data']['skipped'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))
        };
        this.convertedDataCorrect.push(tmpData);
        this.initGraphb();

        tmpData = {
          // name: '', 
          y: (100-Number((Math.round(this.reportObj['report_data']['incorrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))),
          color: '#e7eaeb'
        };
        this.convertedDataIncorrect.push(tmpData);
        tmpData = {
          // name: '', 
          y: Number((Math.round(this.reportObj['report_data']['incorrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))
        };
        this.convertedDataIncorrect.push(tmpData);
        this.initGraphc();
        this.showGraph = true;
        for (let i = 0; i < this.reportObj['report_data']['chapters'].length; i++) {
          if ((this.reportObj['report_data']['chapters'][i]['attempted'] == this.reportObj['report_data']['chapters'][i]['unchecked']) && this.reportObj['report_data']['chapters'][i]['attempted'] != 0) {
            this.hasSubjective = true;
          }
          if (this.reportObj['report_data']['chapters'][i]['attempted'] > this.reportObj['report_data']['chapters'][i]['unchecked']) {
            if (this.reportObj['report_data']['chapters'][i]['percentage'] >= this.paperDetails['exam']['excellent_low'] && this.reportObj['report_data']['chapters'][i]['percentage'] <= this.paperDetails['exam']['excellent_high']) {
              if (!this.excellentChapters) {
                this.excellentChapters = this.reportObj['report_data']['chapters'][i]['title'];
              }
              else {
                this.excellentChapters = this.excellentChapters + ', ' + this.reportObj['report_data']['chapters'][i]['title'];
              }
            }
            if (this.reportObj['report_data']['chapters'][i]['percentage'] >= this.paperDetails['exam']['average_low'] && this.reportObj['report_data']['chapters'][i]['percentage'] <= this.paperDetails['exam']['average_high']) {
              if (!this.averageChapters) {
                this.averageChapters = this.reportObj['report_data']['chapters'][i]['title'];
              }
              else {
                this.averageChapters = this.averageChapters + ', ' + this.reportObj['report_data']['chapters'][i]['title'];
              }
            }
            if (this.reportObj['report_data']['chapters'][i]['percentage'] < this.paperDetails['exam']['poor']) {
              if (!this.poorChapter) {
                this.poorChapter = this.reportObj['report_data']['chapters'][i]['title'];
              }
              else {
                this.poorChapter = this.poorChapter + ', ' + this.reportObj['report_data']['chapters'][i]['title'];
              }
            }
          }

          if (i == this.reportObj['report_data']['chapters'].length - 1) {
            console.log("good average poor", this.excellentChapters, this.averageChapters, this.poorChapter);
          }

        }

        if (this.reportObj['report_data']) {
          // this.generateReport(this.reportObj);
          this.contentAvailable = true;
        } else {
          this.contentAvailable = false;
        }

      },
      error => {
        this.contentAvailable = true;
        // this.misc.hideLoader();
        this.noripple = true;
        this.ripple = false;
      }
    );
  }

  /**
   * Fetches practice test report from server
   */
  getMockReport() {

    // Show loader
    this.misc.showLoader();

    // Get Mock Report
    this.networkRequest.getWithHeaders(`/api/mockpaper_report/${this.reportObj['id']}/${this.reportObj['attemptOrder']}/`)
      .subscribe(
        data => {
          this.misc.hideLoader();

          this.reportObj = { ...this.reportObj, ...data };
          // this.generateReport(this.reportObj);

        }, error => {
          this.misc.hideLoader();
        }
      );
  }


  generateReport(data: object) {
    /** Format Moo Report data to feed in highcharts */
    // const reportData = this.reportService.formatReportData(data['report_data']);

    /** Difficulty wise Chart */
    // this.difficultyWiseChart = this.reportChart.generateChart(reportData['difficulty_wise_report']);

    /** Question wise Chart */
    // this.questionWiseChart = this.reportChart.generateChart(reportData['question_type_based_report']);
  }


  onTabSelect(reportType: string) {
    if (reportType === 'chapterWiseReport') {
      this.viewChapteWiseReport = true;
    } else if (reportType === 'analysis') {
      this.viewTestAnalysis = true;
    } else if (reportType === 'percentile') {
      this.viewPercentileReport = true;
    } else if (reportType === 'attemptedCorrected') {
      this.viewAttemptedCorrectedReport = true;
    } else if (reportType === 'comparison') {
      this.viewComparisonReport = true;
    }
  }
  public canvasWidth = 350
  public needleValue = 0
  public centralLabel = ''
  public name = ''
  public bottomLabel;
  public options = {
      hasNeedle: true,
      needleColor: 'gray',
      needleUpdateSpeed: 1000,
      arcColors: ['red','yellow','green'],
      arcDelimiters: [33,66],
      rangeLabel: ['0', '100'],
      needleStartValue: 50,
  }

  getPaperDetails() {
    this.networkRequest.getWithHeaders(`/api/mentorpapers/${this.reportObj['id']}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
        this.examId = this.paperDetails['exam']['id'];
        this.getExamDetails();
        this.getAssessmentReport();
      },
      error => {
        this.getAssessmentReport();
      });
  }

  ngOnInit() {
    this.route.params.subscribe(
      data => {
        this.reportObj = { ...data };
        this.getPaperDetails();
        // this.getAssessmentReport();
      }
    );

    // this.preventBackButton();
    
  }

}
