import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { ReportAdapter } from '../report/report-detail/adapter/report-modal';
import { ReportChartService } from '../report/report-detail/services/report-chart.service';
import { ReportService } from '../report/report-detail/services/report.service';

@Component({
  selector: 'app-pre-goal-report',
  templateUrl: './pre-goal-report.component.html',
  styleUrls: ['./pre-goal-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ReportChartService, ReportService, ReportAdapter]
})
export class PreGoalReportComponent implements OnInit {

  columnChart: Chart;
  donutChart: Chart;
  @Input() subjects: any
  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private reportChart: ReportChartService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private locationStrategy: LocationStrategy,
    private toastr: ToastrService,
    private router: Router
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
  paperType;
  paperId;

  columnWidth: number;
  scrHeight:any;
  scrWidth:any;
  noripple: boolean = false;
  ripple: boolean = true;

  status: boolean = false;
  hasSubjective: boolean = false;

  
  @ViewChild('widgetsContent') widgetsContent: ElementRef;

  slideRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  };
  slideLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  };

  clickEvent(){
      this.status = !this.status;       
  }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.scrHeight = window.innerHeight;
          this.scrWidth = window.innerWidth;
          console.log(this.scrHeight, this.scrWidth);

          if(this.scrWidth > 760){
            this.columnWidth = 30 ;
         }
         else{
           this.columnWidth = 5 ;
         }
  }

  sharemailUrl(examid, paperid) {
    window.open('mailto:?subject=' + encodeURIComponent(document.title) + '&body=' + encodeURIComponent('https://makemypath.app/assessment/dashboard/respond-paper-request/' + examid + '?paper=' + paperid + ' \nHi I am inviting you to accept the exam paper created by me'));
    return false;
  }

  shareinstaUrl(examid, paperid) {
    window.open('https://instagram.com/accounts/login/?text=%20Check%20up%20this%20exam%20paper' + encodeURIComponent(document.title) + ':%20 ' + encodeURIComponent('https://makemypath.app/assessment/dashboard/respond-paper-request/' + examid + '?paper=' + paperid + ' \nHi I am inviting you to accept the exam paper created by me'));
    return false;
  }


  fetchSubjectChaptersData(subjectId) {
    let chapterScoresArrary = [];
    let chapterTotalArray = [];
    let chapterUnchecked = [];
    let chapterIncorrect = [];
    this.chapterNames = [];
    this.showChapterGraph = false;
    this.convertedDataChapter = [];
    for (let i = 0; i < this.reportObj['report_data']['chapters'].length; i++) {
      if (this.reportObj['report_data']['chapters'][i]['subject'] == subjectId) {
        console.log("subjectid", subjectId);
        this.chapterNames.push(this.reportObj['report_data']['chapters'][i]['title']);
        chapterScoresArrary.push(this.reportObj['report_data']['chapters'][i]['correct']);
        chapterUnchecked.push(this.reportObj['report_data']['chapters'][i]['unchecked']);
        chapterTotalArray.push(this.reportObj['report_data']['chapters'][i]['attempted']);
        chapterIncorrect.push(this.reportObj['report_data']['chapters'][i]['incorrect']);
      }
      if (i == this.reportObj['report_data']['chapters'].length - 1) {
        let tmpData: any;
        tmpData = {
          name: 'Attempted', 
          data: chapterTotalArray
        };
        this.convertedDataChapter.push(tmpData);
        tmpData = {
          name: 'Incorrect',
          data: chapterIncorrect,
          stack: 'correctIncorrectUnchecked'
        };
        this.convertedDataChapter.push(tmpData);
        tmpData = {
          name: 'Correct',
          data: chapterScoresArrary,
          stack: 'correctIncorrectUnchecked'
        };
        this.convertedDataChapter.push(tmpData);
        let count = 0;
        // console.log("chapterUnchecked", chapterUnchecked);
        for (let k = 0; k < chapterUnchecked.length; k++) {
          if (chapterUnchecked[k] != 0) {
            count += 1;
          }
          if ((k == chapterUnchecked.length - 1) && count > 0) {
            tmpData = {
              name: 'Unchecked',
              data: chapterUnchecked,
              stack: 'correctIncorrectUnchecked'
            };
            this.convertedDataChapter.push(tmpData);
          }
        }
        console.log("convertedDataChapter", this.convertedDataChapter, this.chapterNames);
        this.initThreeDGraph();
        this.showChapterGraph = true;
      }
    }
  }
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
          type: 'column',
          backgroundColor : '#FFFFFF'
       },
       title: {
          text: ''
       },
       xAxis:{
          categories: this.subjectNames,
          crosshair: true        
       },     
       yAxis : {
          min: 0,
          title: {
             text: 'Questions'         
          }      
       },
       tooltip : {
          headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
             '<td style = "padding:0"><b>{point.y} </b></td></tr>', footerFormat: '</table>', shared: true, useHTML: true
       },
      //  plotOptions : {
      //     column: {
      //        pointPadding: 0,
      //        borderWidth: 0
      //     }
      //  },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointWidth: this.columnWidth,
          //  pointPadding: 0.25,
           groupPadding: this.padding
        }
      },
      colors: [
        '#6699FF',
        '#F05558',
        '#56BE89',
        '#808080'
    ],
    series: this.convertedData
    // series: [{
    //   name: 'John',
    //   data: [5, 3, 4, 7, 2],
    //   stack: 'male'
    // },  {
    //   name: 'Jane',
    //   data: [2, 5, 6, 2, 1],
    //   stack: 'female'
    // }, {
    //   name: 'Janet',
    //   data: [3, 0, 4, 4, 3],
    //   stack: 'female'
    // }]
    };
 }

initThreeDGraph(){
  this.highchartsb = this.highcharts;
  this.chartOptionsb = {   
    chart: {
      type: 'bar'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    xAxis: {
      categories: this.chapterNames,
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      allowDecimals: false,
      title: {
        text: 'Questions',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    tooltip: {
      valueSuffix: ' question(s)'
    },
    plotOptions: {
      series: {
        stacking: 'normal'
    }
    },
    colors: [
      '#6699FF',
      '#F05558',
      '#56BE89',
      '#808080'
  ],
    legend: {
      // layout: 'vertical',
      // align: 'right',
      // verticalAlign: 'top',
      // x: -40,
      // y: 80,
      // floating: true,
      // borderWidth: 1,
      // backgroundColor:
      //   Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      // shadow: true
      reversed: true
    },
    credits: {
      enabled: false
    },
    series:this.convertedDataChapter
 };
}
  initColumn() {
    const column = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Unique User'
      },
      credits: {
        enabled: false
      },

      series: [{
        name: 'Line 1',
        data: [1, 52, 123, 90, 24, 67, 77],
        type: undefined
      }]
    });
    column.addPoint(1);
    this.columnChart = column;
    column.ref$.subscribe(console.log);
  }
  initDonut() {
    const donut = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: '<p>Correct<br> Questions</p>',
        align: 'center',
        verticalAlign: 'middle',
        y: 70
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -30,
            
            style: {
               fontWeight: 'bold',
               color: 'white',
               textShadow: '0px 1px 2px black'
            }
         },
          startAngle: -90,
          endAngle: 90,
         center: ['50%', '75%']
        }
      },
      series: [{
        type: 'pie',
        name: 'Questions',
        innerSize: '50%',
        data: [6, 7],
     }]
    });
    this.donutChart = donut;
  }

  reattempt() {
    const formData = {
      paper: this.paperId
    }
    this.networkRequest.putWithHeaders(formData, `/api/paperreattempt/`)
    .subscribe(
      data => {
        console.log("paper created ", data);
        // this.toastr.success('New Paper Created!', 'Created!', {
        //   timeOut: 4000,
        // });
        if (data['paper_type'] == 'practice') {
          this.router.navigate([`/assessment/paper/practice-paper/${this.paperDetails['goal']['exam']['id']}`],{
            queryParams: {
              paper: data['id']
            }
          });
        }
        else {
          this.openNewPaper(this.paperDetails['goal']['exam']['id'], data['id']);
        }
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['message'], 'Error!', {
          timeOut: 4000,
        });
      }
    );
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

    this.networkRequest.getWithHeaders(`/api/goalassessmentpaper_report/${this.paperId}/`).subscribe(
      data => {
        // console.log("assessmentpaper_report", data);
        // this.misc.hideLoader();
        this.noripple = true;
        this.ripple = false;

        this.reportObj = { ...this.reportObj, ...data };
        this.needleValue = this.reportObj['report_data']['percentage'];
        this.bottomLabel = ((Math.round(this.reportObj['report_data']['percentage'] * 100) / 100).toFixed(2))+'%';

        console.log("reportobj", this.reportObj);
        this.accuracyData.push(this.reportObj['report_data']['corrected']);
        this.accuracyData.push(this.reportObj['report_data']['attempted']);
        this.initDonut();
        this.fetchSubjectChaptersData(this.reportObj['report_data']['subjects'][0]['id']);
        let subjectAttempted =  [];
        let subjectCorrect = [];
        let subjectIncorrect = [];
        let unchecked = [];
        for (let i = 0; i < this.reportObj['report_data']['subjects'].length; i++) {
          this.subjectNames.push(this.reportObj['report_data']['subjects'][i]['title']);
          this.subjectScoresArrary.push(this.reportObj['report_data']['subjects'][i]['score']);
          this.subjectTotalArray.push(this.reportObj['report_data']['subjects'][i]['total']);
          subjectAttempted.push(this.reportObj['report_data']['subjects'][i]['attempted']);
          subjectCorrect.push(this.reportObj['report_data']['subjects'][i]['correct']);
          subjectIncorrect.push(this.reportObj['report_data']['subjects'][i]['incorrect']);
          unchecked.push(this.reportObj['report_data']['subjects'][i]['unchecked']);
          if (i == this.reportObj['report_data']['subjects'].length - 1) {
            let tmpData: any;
            tmpData = {
              name: 'Attempted', 
              data: subjectAttempted,
              stack: 'total'
            };
            this.convertedData.push(tmpData);
            tmpData = {
              name: 'Incorrect',
              data: subjectIncorrect,
              stack: 'chunk'
            };
            this.convertedData.push(tmpData);
            tmpData = {
              name: 'Correct',
              data: subjectCorrect,
              stack: 'chunk'
            };
            this.convertedData.push(tmpData);
            let count = 0;
            for (let k = 0; k < unchecked.length; k++) {
              console.log("unchecked[i]", unchecked[k]);
              if (unchecked[k] != 0) {
                count += 1;
              }
              if ((k == unchecked.length - 1) && count > 0) {
                console.log("aaunchecked[k]", unchecked[k]);
                tmpData = {
                  name: 'Unchecked',
                  data: unchecked,
                  stack: 'chunk'
                };
                this.convertedData.push(tmpData);
              }
            }
            console.log("convertedData", this.convertedData, this.subjectNames);
            if (this.convertedData[0]['data'].length <= 1) {
              this.padding = 0.47;
              this.initGraph();
              this.showGraph = true;
            }
            else if (this.convertedData[0]['data'].length > 1 && this.convertedData[0]['data'].length <= 3) {
              this.padding = 0.42;
              this.initGraph();
              this.showGraph = true;
            }
            else if (this.convertedData[0]['data'].length > 3 && this.convertedData[0]['data'].length <= 6) {
              this.padding = 0.35;
              this.initGraph();
              this.showGraph = true;
            }
             else if (this.convertedData[0]['data'].length > 6 && this.convertedData[0]['data'].length <= 9) {
               this.padding = 0.27;
               this.initGraph();
               this.showGraph = true;
             }
             else if (this.convertedData[0]['data'].length > 9) {
               this.padding = 0.25;
            this.initGraph();
            this.showGraph = true;
             }
            // this.initThreeDGraph();
          }
        }
        for (let i = 0; i < this.reportObj['report_data']['chapters'].length; i++) {
          if ((this.reportObj['report_data']['chapters'][i]['attempted'] == this.reportObj['report_data']['chapters'][i]['unchecked']) && this.reportObj['report_data']['chapters'][i]['attempted'] != 0) {
            this.hasSubjective = true;
          }
          if (this.reportObj['report_data']['chapters'][i]['attempted'] > this.reportObj['report_data']['chapters'][i]['unchecked']) {

            if (this.reportObj['report_data']['chapters'][i]['percentage'] >= this.paperDetails['goal']['exam']['excellent_low'] && this.reportObj['report_data']['chapters'][i]['percentage'] <= this.paperDetails['goal']['exam']['excellent_high']) {
              if (!this.excellentChapters) {
                this.excellentChapters = this.reportObj['report_data']['chapters'][i]['title'];
              }
              else {
                this.excellentChapters = this.excellentChapters + ', ' + this.reportObj['report_data']['chapters'][i]['title'];
              }
            }
            if (this.reportObj['report_data']['chapters'][i]['percentage'] >= this.paperDetails['goal']['exam']['average_low'] && this.reportObj['report_data']['chapters'][i]['percentage'] <= this.paperDetails['goal']['exam']['average_high']) {
              if (!this.averageChapters) {
                this.averageChapters = this.reportObj['report_data']['chapters'][i]['title'];
              }
              else {
                this.averageChapters = this.averageChapters + ', ' + this.reportObj['report_data']['chapters'][i]['title'];
              }
            }
            if (this.reportObj['report_data']['chapters'][i]['percentage'] < this.paperDetails['goal']['exam']['poor']) {
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
    this.networkRequest.getWithHeaders(`/api/mockpaper_report/${this.paperId}/1/`)
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
    this.networkRequest.getWithHeaders(`/api/goalpapers/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
        this.examId = this.paperDetails['goal']['exam']['id'];
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
        this.paperType = data.type;
        this.paperId = data.id;
        this.getPaperDetails();
      }
    );

    // this.preventBackButton();
    this.initColumn();
    
  }

}
