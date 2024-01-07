import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { ToastrService } from 'ngx-toastr';
import * as Highcharts from 'highcharts';
import { ConstantsService } from 'src/app/core/services/constants.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-exam-history',
  templateUrl: './exam-history.component.html',
  styleUrls: ['./exam-history.component.scss']
})
export class ExamHistoryComponent implements OnInit {

  columnChart: Chart;
  columnChartPractice: Chart;

  data = [100, 20, 50, 70];
  topicLabels = [];
  topicLabelsPractice = [];

  maxTime: any;
  convertedDay;
  convertedData = [];
  convertedDataPractice = [];
  papers;
  myHistory;
  examId;
  examDetails;
  sharedPaperType;
  links;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;
  chartOptions = {};
  chartOptionspractice = {};
  highcharts = Highcharts;
  chartOptionsb = {};
  highchartsb = Highcharts;
  subjectNames = [];
  subjects;
  selectedSubjectId;
  chapters;
  totalusers;
  paperType = 'paper';
  // sharedPaperType: string;
  practiceHistory;
  paperHistory;
  selectedSubjectData;
  convertedDataChapter = [];
  chapterNames = [];
  showChapterGraph: boolean = false;
  convertedDataPracticeQuestions = [];
  convertedDataPaperQuestions = [];
  paperNamesPractice = [];
  paperNamesPaper = [];
  showColumnPaper: boolean = false;
  paddingPractice: number;
  padding: number;
  excellentChapters = null;
  averageChapters = null;
  poorChapter = null;

  columnWidth: number;
  scrHeight:any;
  scrWidth:any;
  activeCard: string = "";
  spinner:boolean = true;

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.scrHeight = window.innerHeight;
          this.scrWidth = window.innerWidth;
          console.log(this.scrHeight, this.scrWidth);

          if(this.scrWidth > 760){
            this.columnWidth = 14 ;
         }
         else{
           this.columnWidth = 5 ;
         }
    }


  @Input() incomingdata: any


  constructor(
    private consts: ConstantsService,
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  @ViewChild('WidgetSubjectWise') WidgetSubjectWise: ElementRef;

  slideRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  };
  slideLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  };
  slideRightSubject() {
    this.WidgetSubjectWise.nativeElement.scrollLeft += 150;
  }
  slideLeftSubject() {
    this.WidgetSubjectWise.nativeElement.scrollLeft -= 150;
  }

  sharemailUrl(examid, paperid, sharedPaperType) {
    window.open('mailto:?subject=' + encodeURIComponent(document.title) + '&body=' + encodeURIComponent('https://makemypath.app/assessment/dashboard/respond-paper-request/' + examid + '?paper=' + paperid + ' \nHi, I am inviting you to attempt this' + sharedPaperType.toUpperCase() + '.'));
    return false;
  }

  shareinstaUrl(examid, paperid, sharedPaperType) {
    window.open('https://instagram.com/accounts/login/?text=%20Check%20up%20this%20exam%20paper' + encodeURIComponent(document.title) + ':%20 ' + encodeURIComponent('https://makemypath.app/assessment/dashboard/respond-paper-request/' + examid + '?paper=' + paperid + ' \nHi, I am inviting you to attempt this' + sharedPaperType.toUpperCase() + '.'));
    return false;
  }

  showShareOption(id){
    this.activeCard = id;
    setTimeout(() => {
      var element = document.getElementsByClassName("media-icons");
      for (let i = 0; i < element.length; i++) {
        this.activeCard = id;
        const ele = element[i];
        if (ele instanceof HTMLElement) {
            this.activeCard = id;
            ele.style.display = "flex";
        }
      }
    }, 200);
  } 

  displaynoneicons() {
    // var element = <HTMLDivElement> document.getElementById("popupicons");
    // element.hidden = true;
    var element = document.getElementsByClassName("media-icons");
    for (let i = 0; i < element.length; i++) {
      const ele = element[i];
      if (ele instanceof HTMLElement) {
          ele.style.display = "none";
      }
    }
  }

  switchPaper() {
    // this.showColumnPaper = false;
    this.showChapterGraph = false;
    this.selectedSubjectData = null;
    this.convertedDataChapter = [];
    // this.convertedDataPractice = [];
    // this.convertedData = [];
    this.paperType = 'paper';
    this.getSubjects();
  }

  switchPractice() {
    // this.showColumnPaper = false;
    this.showChapterGraph = false;
    this.selectedSubjectData = null;
    this.convertedDataChapter = [];
    // this.convertedDataPractice = [];
    // this.convertedData = [];
    this.paperType = 'practice';
    this.getSubjects();
  }

  reattempt(exam, paper) {
    const formData = {
      paper: paper
    }
    this.networkRequest.putWithHeaders(formData, `/api/paperreattempt/`)
    .subscribe(
      data => {
        console.log("paper created ", data);
        // this.toastr.success('New Paper Created!', 'Created!', {
        //   timeOut: 4000,
        // });
        if (data['paper_type'] == 'practice') {
          this.router.navigate([`/assessment/paper/practice-paper/${exam}`],{
            queryParams: {
              paper: data['id']
            }
          });
        }
        else {
          this.openNewPaper(exam, data['id']);
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

    this.router.navigate([`/assessment/paper/test-instructions/${exam}`],{
      queryParams: {
        paper: paper
      }
    });
    
    // const testWindowUrl = `/assessment/paper/test-instructions/${exam}?paper=${paper}`;
    // // console.log("testWindowUrl", testWindowUrl);
    // // Open new test window
    // const testWindow = window.open(testWindowUrl, 'Test', 'fullscreen');

    // // // Test window settings
    // if (testWindow.outerWidth < screen.availWidth || testWindow.outerHeight < screen.availHeight) {
    //   testWindow.moveTo(0, 0);
    //   testWindow.resizeTo(screen.availWidth, screen.availHeight);
    // }
  }
  initGraphPractice() {
    this.chartOptionspractice = {   
       chart: {
          type: 'column',
          backgroundColor : '#FFFFFF'
       },
       title: {
          text: ''
       },
       xAxis:{
          categories: this.paperNamesPractice,
          crosshair: true        
       },     
       yAxis : {
          min: 0,
          allowDecimals: false,
          title: {
             text: 'Questions'         
          }      
       },
       tooltip : {
          headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
             '<td style = "padding:0"><b>{point.y} </b></td></tr>', footerFormat: '</table>', shared: true, useHTML: true
       },
       credits: {
        enabled: false
      },
      //  plotOptions : {
      //     column: {
      //        pointPadding: 0,
      //        borderWidth: 0
      //     }
      //  },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointWidth: this.columnWidth,
          groupPadding: this.paddingPractice
        }
      },
      colors: [
        '#6699FF',
        '#F05558',
        '#56BE89',
        '#808080'
    ],
    series: this.convertedDataPracticeQuestions
    };
 }

 initGraphPaper() {
  this.chartOptions = {   
     chart: {
        type: 'column',
        backgroundColor : '#FFFFFF'
     },
     title: {
        text: ''
     },
     xAxis:{
        categories: this.paperNamesPaper,
        crosshair: true        
     },     
     yAxis : {
        min: 0,
        allowDecimals: false,
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
        groupPadding: this.padding
      }
    },
    colors: [
      '#6699FF',
      '#F05558',
      '#56BE89',
      '#808080'
  ],
  series: this.convertedDataPaperQuestions
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
      // bar: {
      //   dataLabels: {
      //     enabled: true
      //   }
      // }
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
    series: this.convertedDataChapter
 };
}
  initColumnPaper() {
    const column = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      yAxis: {
        max: this.maxTime,
        title: {
          enabled: true,
          text: '<p>Moving Average</p>'
        }
      },
      xAxis: {
        categories: this.topicLabels,
        title: {
          text: 'No. of Papers'         
       } 
      },
      plotOptions: {
        series: {
            events: {
                legendItemClick: function() {
                  return false;
                }
            }
          }
      }, 
      legend: {
        itemHoverStyle: {
            cursor: 'default',
        }
    },   
      series: [{
        name: 'Paper-%',
        // colorByPoint: true,
        data: this.convertedData
      }]
    });
    // column.addPoint(1);
    this.columnChart = column;
    column.ref$.subscribe(console.log);
  }

  initColumnPractice() {
    const column = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      yAxis: {
        max: this.maxTime,
        title: {
          enabled: true,
          text: '<p>Moving Average</p>'
        }
      },
      xAxis: {
        categories: this.topicLabelsPractice,
        title: {
          text: 'No. of Papers'         
       } 
      },
      plotOptions: {
        series: {
            events: {
                legendItemClick: function() {
                  return false;
                }
            }
          }
      },
      legend: {
        itemHoverStyle: {
            cursor: 'default',
        }
    },
      series: [{
        name: 'Practice-%',
        // colorByPoint: true,
        data: this.convertedDataPractice
      }]
    });
    // column.addPoint(1);
    this.columnChartPractice = column;
    column.ref$.subscribe(console.log);
  }

  getExamDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          this.examDetails = data;
        },
        error => {
          console.log("error ", error);
        }
      );
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
    this.networkRequest.getWithHeaders(`/api/learnerexamhistory/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("learner exam history ", data);
        this.myHistory = data[0];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.getWithHeaders(`/api/learnerexampracticehistory/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("learner exam practice history ", data);
        this.practiceHistory = data[0];
        if (this.practiceHistory) {
          if (this.practiceHistory['papers'].length > 0) {
            let paperids = [];
            let totalLength = 0;
            if (this.practiceHistory['papers'].length > 10) {
              totalLength = 10;
            }
            else {
              totalLength = this.practiceHistory['papers'].length
            }
            for (let i = 0; i < totalLength; i++) {
              paperids.push(this.practiceHistory['papers'][i]);
              if (i == totalLength -1 ) {
                this.getAnswerpapers(paperids, 'practice');
              }
            }
          }
        }
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.getWithHeaders(`/api/learnerexampaperhistory/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("learner exam paper history ", data);
        this.paperHistory = data[0];
        if (this.paperHistory) {
          if (this.paperHistory['papers'].length > 0) {
            let paperids = [];
            let totalLength = 0;
            if (this.paperHistory['papers'].length > 10) {
              totalLength = 10;
            }
            else {
              totalLength = this.paperHistory['papers'].length
            }
            for (let i = 0; i < totalLength; i++) {
              paperids.push(this.paperHistory['papers'][i]);
              if (i == totalLength -1 ) {
                this.getAnswerpapers(paperids, 'paper');
              }
            }
          }
        }
        else {
          this.spinner = false;
        }
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  selectSubject(subjectId) {
    this.selectedSubjectId = subjectId;
    this.convertedDataChapter = [];
    this.selectSubjectData(this.selectedSubjectId);
    this.getChapters(this.selectedSubjectId);
  }

  selectSubjectData(id) {
    this.selectedSubjectData = null;
    for (let i = 0; i < this.subjects.length; i++) {
      if (this.subjects[i]['subject']['id'] == id) {
        this.selectedSubjectData = this.subjects[i];
      }
    }
  }

  getSubjects() {
    this.excellentChapters = null;
    this.averageChapters = null;
    this.poorChapter = null;
    if (this.paperType == 'practice') {
      this.networkRequest.getWithHeaders(`/api/getlearnerexampracticesubjects/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("subjects ", data);
          this.subjects = data;
          if (this.subjects.length > 0) {
            this.selectedSubjectId = this.subjects[0]['subject']['id'];
            this.selectSubjectData(this.selectedSubjectId);
            this.getChapters(this.selectedSubjectId);
          }
        },
        error => {
          console.log("error ", error);
        }
      );
    }
    else {
      this.networkRequest.getWithHeaders(`/api/getlearnerexampapersubjects/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("subjects ", data);
          this.subjects = data;
          if (this.subjects.length > 0) {
            this.selectedSubjectId = this.subjects[0]['subject']['id'];
            this.selectSubjectData(this.selectedSubjectId);
            this.getChapters(this.selectedSubjectId);
          }
        },
        error => {
          console.log("error ", error);
        }
      );
    }
  }

  getChapters(id) {
    this.excellentChapters = null;
    this.averageChapters = null;
    this.poorChapter = null;
    this.selectedSubjectId = id;
    if (this.paperType == 'practice') {
      this.networkRequest.getWithHeaders(`/api/getlearnerexampracticechapters/?subject=${this.selectedSubjectId}&exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("learner exam chapters ", data);
          this.chapters = data;
          this.fetchSubjectChaptersData();
          this.excellentChapters = null;
          this.averageChapters = null;
          this.poorChapter = null;
          for (let i = 0; i < this.chapters.length; i++) {
            if (this.chapters[i]['attempted'] > 0) {
              if (this.chapters[i]['percentage'] >= this.chapters[0]['learner_exam']['exam']['excellent_low'] && this.chapters[i]['percentage'] <= this.chapters[0]['learner_exam']['exam']['excellent_high']) {
                if (!this.excellentChapters) {
                  this.excellentChapters = this.chapters[i]['chapter']['title'];
                }
                else {
                  this.excellentChapters = this.excellentChapters + ', ' + this.chapters[i]['chapter']['title'];
                }
              }
              if (this.chapters[i]['percentage'] >= this.chapters[0]['learner_exam']['exam']['average_low'] && this.chapters[i]['percentage'] <= this.chapters[0]['learner_exam']['exam']['average_high']) {
                if (!this.averageChapters) {
                  this.averageChapters = this.chapters[i]['chapter']['title'];
                }
                else {
                  this.averageChapters = this.averageChapters + ', ' + this.chapters[i]['chapter']['title'];
                }
              }
              if (this.chapters[i]['percentage'] < this.chapters[0]['learner_exam']['exam']['poor']) {
                if (!this.poorChapter) {
                  this.poorChapter = this.chapters[i]['chapter']['title'];
                }
                else {
                  this.poorChapter = this.poorChapter + ', ' + this.chapters[i]['chapter']['title'];
                }
              }
            }
            if (i == this.chapters.length - 1) {
              console.log("good average poor", this.excellentChapters, this.averageChapters, this.poorChapter);
            }
  
          }
        },
        error => {
          console.log("error ", error);
        }
      );
    }
    else {
      this.networkRequest.getWithHeaders(`/api/getlearnerexampaperchapters/?subject=${this.selectedSubjectId}&exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("learner exam chapters ", data);
          this.chapters = data;
          this.fetchSubjectChaptersData();
          this.excellentChapters = null;
          this.averageChapters = null;
          this.poorChapter = null;
          for (let i = 0; i < this.chapters.length; i++) {
            if (this.chapters[i]['attempted'] > 0) {
              if (this.chapters[i]['percentage'] >= this.chapters[0]['learner_exam']['exam']['excellent_low'] && this.chapters[i]['percentage'] <= this.chapters[0]['learner_exam']['exam']['excellent_high']) {
                if (!this.excellentChapters) {
                  this.excellentChapters = this.chapters[i]['chapter']['title'];
                }
                else {
                  this.excellentChapters = this.excellentChapters + ', ' + this.chapters[i]['chapter']['title'];
                }
              }
              if (this.chapters[i]['percentage'] >= this.chapters[0]['learner_exam']['exam']['average_low'] && this.chapters[i]['percentage'] <= this.chapters[0]['learner_exam']['exam']['average_high']) {
                if (!this.averageChapters) {
                  this.averageChapters = this.chapters[i]['chapter']['title'];
                }
                else {
                  this.averageChapters = this.averageChapters + ', ' + this.chapters[i]['chapter']['title'];
                }
              }
              if (this.chapters[i]['percentage'] < this.chapters[0]['learner_exam']['exam']['poor']) {
                if (!this.poorChapter) {
                  this.poorChapter = this.chapters[i]['chapter']['title'];
                }
                else {
                  this.poorChapter = this.poorChapter + ', ' + this.chapters[i]['chapter']['title'];
                }
              }
            }
            if (i == this.chapters.length - 1) {
              console.log("good average poor", this.excellentChapters, this.averageChapters, this.poorChapter);
            }
  
          }
        },
        error => {
          console.log("error ", error);
        }
      );
    }
  }

  fetchSubjectChaptersData() {
    let chapterScoresArrary = [];
    let chapterTotalArray = [];
    let unchecked = [];
    this.chapterNames = [];
    let chapterIncorrect = [];
    this.showChapterGraph = false;
    this.convertedDataChapter = [];
    for (let i = 0; i < this.chapters.length; i++) {
      this.chapterNames.push(this.chapters[i]['chapter']['title']);
      chapterScoresArrary.push(this.chapters[i]['correct']);
      chapterTotalArray.push(this.chapters[i]['attempted']);
      unchecked.push(this.chapters[i]['unchecked']);
      chapterIncorrect.push(this.chapters[i]['incorrect']);
         
      if (i == this.chapters.length - 1) {
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
        tmpData = {
          name: 'Unchecked',
          data: unchecked,
          stack: 'correctIncorrectUnchecked'
        };
        this.convertedDataChapter.push(tmpData);
        console.log("convertedDataChapter", this.convertedDataChapter, this.chapterNames);
        this.initThreeDGraph();
        this.showChapterGraph = true;
      }
    }
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.getMyPapers();
  }


  getMyPapers() {
    this.networkRequest.getWithHeaders(`/api/latestlearnerpapers/?page=${this.currentPage}&exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("learner papers ", data);
        this.papers = data['results'];
        this.spinner = false;
        let page_size = data['page_size'];
        this.links = data['links'];
        if (data['count'] % page_size === 0) {
          this.max_page = Math.floor(data['count'] / page_size);
        } else {
          this.max_page = Math.floor(data['count'] / page_size) + 1;
        }
        this.pages = ' '.repeat(this.max_page).split('');
        if (this.max_page < 11) {
          // less than 10 total pages so show all
          this.startPage = 1;
          this.endPage = this.max_page;
        } else if (this.currentPage < 6) {
          this.startPage = 1;
          this.endPage = 10;
        } else if (this.currentPage >= 6 && this.currentPage < this.max_page - 5) {
          this.startPage = this.currentPage - 4;
          this.endPage = this.currentPage - (-5);
        } else {
          this.startPage = this.max_page - 9;
          this.endPage = this.max_page;
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getAnswerpapers(paperIds, type) {
    this.convertedData = [];
    this.topicLabels = [];
    this.convertedDataPractice = [];
    this.topicLabelsPractice = [];
    this.showColumnPaper = false;
    const formData = {
      papers: paperIds
    }
    this.networkRequest.putWithHeaders(formData, `/api/answerpaperbylearnerpaperids/`).subscribe(
      data => {
        let tmpData = data;
        console.log("report data aa", data );
        this.convertedDataPaperQuestions = [];
        this.convertedDataPracticeQuestions = [];
        this.paperNamesPaper = [];
        this.paperNamesPractice = [];
        let paperAttempted =  [];
        let paperCorrect = [];
        let paperIncorrect = [];
        let paperUnchecked = [];
        let papers = [];
        //@ts-ignore
        papers = tmpData;
        papers.sort((a, b) => a.attempted_date.localeCompare(b.attempted_date));
        //@ts-ignore
        for (let i = 0; i < tmpData.length; i++) {
          if (type == 'paper') {
            this.convertedData.push(tmpData[i]['percentage']);
            this.topicLabels.push(tmpData[i]['assessment_paper']['paper_type'] +  ' ' + tmpData[i]['assessment_paper']['paper_count']);
            this.paperNamesPaper.push('Paper ' + tmpData[i]['assessment_paper']['paper_count']);
            paperAttempted.push(tmpData[i]['total_questions']);
            paperCorrect.push(tmpData[i]['correct']);
            paperIncorrect.push(tmpData[i]['incorrect']);
            paperUnchecked.push(tmpData[i]['unchecked']);
            //@ts-ignore
            if (i == tmpData.length - 1) {
              let tmpDataGraph: any;
              tmpDataGraph = {
                name: 'Total Questions', 
                data: paperAttempted,
                stack: 'total'
              };
              this.convertedDataPaperQuestions.push(tmpDataGraph);
              tmpDataGraph = {
                name: 'Incorrect',
                data: paperIncorrect,
                stack: 'chunk'
              };
              this.convertedDataPaperQuestions.push(tmpDataGraph);
              tmpDataGraph = {
                name: 'Correct',
                data: paperCorrect,
                stack: 'chunk'
              };
              this.convertedDataPaperQuestions.push(tmpDataGraph);
              tmpDataGraph = {
                name: 'Unchecked',
                data: paperUnchecked,
                stack: 'chunk'
              };
              this.convertedDataPaperQuestions.push(tmpDataGraph);
              console.log("convertedData paper ques", this.convertedDataPaperQuestions, this.paperNamesPaper);
              if (this.convertedDataPaperQuestions[0]['data'].length <= 1) {
                this.padding = 0.47;
                this.initGraphPaper();
                this.showColumnPaper = true;
              }
              else if (this.convertedDataPaperQuestions[0]['data'].length > 1 && this.convertedDataPaperQuestions[0]['data'].length <= 3) {
                this.padding = 0.42;
                this.initGraphPaper();
                this.showColumnPaper = true;
              }
              else if (this.convertedDataPaperQuestions[0]['data'].length > 3 && this.convertedDataPaperQuestions[0]['data'].length <= 6) {
                this.padding = 0.35;
                this.initGraphPaper();
                this.showColumnPaper = true;
              }
               else if (this.convertedDataPaperQuestions[0]['data'].length > 6 && this.convertedDataPaperQuestions[0]['data'].length <= 9) {
                 this.padding = 0.27;
                 this.initGraphPaper();
                 this.showColumnPaper = true;
               }
               else if (this.convertedDataPaperQuestions[0]['data'].length > 9) {
                 this.padding = 0.25;
                 this.initGraphPaper();
                 this.showColumnPaper = true;
               }
              // this.initGraphPaper();
              this.initColumnPaper();
              // this.showColumnPaper = true;
            }
          }
          else {
            this.convertedDataPractice.push(tmpData[i]['percentage']);
            this.topicLabelsPractice.push(tmpData[i]['assessment_paper']['paper_type'] +  ' ' + tmpData[i]['assessment_paper']['paper_count']);
            this.paperNamesPractice.push('Practice ' + tmpData[i]['assessment_paper']['paper_count']);
            paperAttempted.push(tmpData[i]['total_questions']);
            paperCorrect.push(tmpData[i]['correct']);
            paperIncorrect.push(tmpData[i]['incorrect']);
            paperUnchecked.push(tmpData[i]['unchecked']);
            //@ts-ignore
            if (i == tmpData.length - 1) {
              let tmpDataGraph: any;
              tmpDataGraph = {
                name: 'Total Questions', 
                data: paperAttempted,
                stack: 'total'
              };
              this.convertedDataPracticeQuestions.push(tmpDataGraph);
              tmpDataGraph = {
                name: 'Incorrect',
                data: paperIncorrect,
                stack: 'chunk'
              };
              this.convertedDataPracticeQuestions.push(tmpDataGraph);
              tmpDataGraph = {
                name: 'Correct',
                data: paperCorrect,
                stack: 'chunk'
              };
              this.convertedDataPracticeQuestions.push(tmpDataGraph);
              tmpDataGraph = {
                name: 'Unchecked',
                data: paperUnchecked,
                stack: 'chunk'
              };
              this.convertedDataPracticeQuestions.push(tmpDataGraph);
              console.log("convertedData practice ques", this.convertedDataPracticeQuestions, this.paperNamesPractice);
              if (this.convertedDataPracticeQuestions[0]['data'].length <= 1) {
                this.paddingPractice = 0.47;
                this.initGraphPractice();
                // this.showColumnPractie = true;
              }
              else if (this.convertedDataPracticeQuestions[0]['data'].length > 1 && this.convertedDataPracticeQuestions[0]['data'].length <= 3) {
                this.paddingPractice = 0.42;
              this.initGraphPractice();
              // this.showColumnPractie = true;
              }
              else if (this.convertedDataPracticeQuestions[0]['data'].length > 3 && this.convertedDataPracticeQuestions[0]['data'].length <= 6) {
                this.paddingPractice = 0.35;
                this.initGraphPractice();
                // this.showColumnPractie = true;
              }
               else if (this.convertedDataPracticeQuestions[0]['data'].length > 6 && this.convertedDataPracticeQuestions[0]['data'].length <= 9) {
                 this.paddingPractice = 0.27;
                 this.initGraphPractice();
                //  this.showColumnPractie = true;
               }
               else if (this.convertedDataPracticeQuestions[0]['data'].length > 9) {
                 this.paddingPractice = 0.25;
                 this.initGraphPractice();
                //  this.showColumnPractie = true;
               }
              // this.initGraphPractice();
              this.initColumnPractice();
              
            }
          }
        }
        
      },
      error => {
      }
    );
  }
  
  ngOnInit(): void {
    // this.courseswitchservice.examIdStatus.subscribe(
    //   data => {
    //     if (!data) {
    //       this.route.params.subscribe(
    //         data1 => {
    //           if (data1['exam']) {
    //             this.courseswitchservice.updateExamId(data1['exam']);
    //             this.examId = data1['exam'];
    //             this.goToPage(1);
    //             this.getExamDetails();
    //             this.getSubjects();
    //           }
    //         }
    //       );
    //     }
    //     else {
    //       this.examId = data;
    //       this.goToPage(1);
    //       this.getExamDetails();
    //       this.getSubjects();
    //     }
    // });
    this.route.params.subscribe(
      data1 => {
        if (data1['exam']) {
          this.courseswitchservice.updateExamId(data1['exam']);
          this.examId = data1['exam'];
          this.goToPage(1);
          this.getExamDetails();
          this.getSubjects();
        }
      }
    );
    // this.initColumn();
    // this.initGraph();
    // this.initThreeDGraph();
    this.courseswitchservice.updateReloadPageStatus(true);
  }

}
