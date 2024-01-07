import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ToastrService } from 'ngx-toastr';
import { ConstantsService } from 'src/app/core/services/constants.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import * as Highcharts from 'highcharts';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { Router } from '@angular/router';
import { HostListener } from "@angular/core";
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.scss']
})
export class MyHistoryComponent implements OnInit {

  columnChart: Chart;

  data = [100, 20, 50, 70];
  topicLabels = [];

  maxTime: any;
  convertedDay;
  convertedData = [];

  papers;
  myHistory;
  count = 0;
  chartOptions = {};
  highcharts = Highcharts;
  chartOptionsb = {};
  highchartsb = Highcharts;
  subjectNames = [];
  links;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;
  myExams;
  subjects;
  selectedSubjectId;
  chapters;
  paperType = 'paper';
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
  examId;
  sharedPaperType;
  columnChartPractice: Chart;
  topicLabelsPractice = [];
  convertedDataPractice = [];
  chartOptionspractice = {};
  showColumnPractie: boolean = false;
  showColumnPaper: boolean = false;
  userProfile = {};
  padding: number;
  paddingPractice: number;
  excellentChapters = null;
  averageChapters = null;
  poorChapter = null;
  columnWidth: number;
  scrHeight:any;
  scrWidth:any;
  activeCard: string = "";
  total_questions: number = 0;
  total_paper_time: number = 0;
  spinner:boolean = true;

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
    @ViewChild('widgetsContent') widgetsContent: ElementRef;
    @ViewChild('WidgetSubjectWise') WidgetSubjectWise: ElementRef;
    @ViewChild('WidgetPractice') WidgetPractice: ElementRef;
    @ViewChild('WidgetSubjectWisePractice') WidgetSubjectWisePractice: ElementRef;

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
    slideLeftPractice() {
      this.WidgetPractice.nativeElement.scrollLeft -= 150;
    }
    slideRightPractice() {
      this.WidgetPractice.nativeElement.scrollLeft += 150;
    }
    slideLeftPracticeSubject() {
      this.WidgetSubjectWisePractice.nativeElement.scrollLeft -= 150;
    }
    slideRightPracticeSubject() {
      this.WidgetSubjectWisePractice.nativeElement.scrollLeft += 150;
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
    

  @Input() incomingdata: any

  constructor(
    private consts: ConstantsService,
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private misc: MiscellaneousService,
    private router: Router,
    private courseswitchservice: CourseSwitchService
  ) { }

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

  sharemailUrl(examid, paperid, sharedPaperType) {
    window.open('mailto:?subject=' + encodeURIComponent(document.title) + '&body=' + encodeURIComponent('https://makemypath.app/assessment/dashboard/respond-paper-request/' + examid + '?paper=' + paperid + ' \nHi, I am inviting you to attempt this ' + sharedPaperType.toUpperCase() + '.'));
    
    return false;
  }

  shareinstaUrl(examid, paperid, sharedPaperType) {
    window.open('https://instagram.com/accounts/login/?text=%20Check%20up%20this%20exam%20paper' + encodeURIComponent(document.title) + ':%20 ' + encodeURIComponent('https://makemypath.app/assessment/dashboard/respond-paper-request/' + examid + '?paper=' + paperid + ' \nHi, I am inviting you to attempt this ' + sharedPaperType.toUpperCase() + '.'));

    return false;
  }

  switchPaper() {
    this.paperType = 'paper';
    this.showColumnPractie = false;
    this.showColumnPaper = false;
    this.showChapterGraph = false;
    this.paperNamesPractice = [];
    this.paperNamesPaper = [];
    this.convertedDataChapter = [];
    this.chapterNames = [];
    this.convertedDataPracticeQuestions = [];
    this.convertedDataPaperQuestions = [];
    this.topicLabelsPractice = [];
    this.convertedDataPractice = [];
    this.convertedData = [];
    this.subjectNames = [];
    this.topicLabels = [];
    this.poorChapter = null;
    this.excellentChapters = null;
    this.averageChapters = null;
    this.selectedSubjectData = null;
    this.getMyExams();
  }

  switchPractice() {
    this.paperType = 'practice';
    this.showColumnPractie = false;
    this.showColumnPaper = false;
    this.showChapterGraph = false;
    this.paperNamesPractice = [];
    this.paperNamesPaper = [];
    this.convertedDataChapter = [];
    this.chapterNames = [];
    this.convertedDataPracticeQuestions = [];
    this.convertedDataPaperQuestions = [];
    this.topicLabelsPractice = [];
    this.convertedDataPractice = [];
    this.convertedData = [];
    this.subjectNames = [];
    this.topicLabels = [];
    this.poorChapter = null;
    this.excellentChapters = null;
    this.averageChapters = null;
    this.selectedSubjectData = null;
    this.getMyExams();
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
        //  pointPadding: 0.25,
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
        // colorByPoint: true,
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
      },
      allowDecimals: false
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Questions',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      allowDecimals: false
    },
    tooltip: {
      valueSuffix: ' question(s)'
    },
    credits: {
      enabled: false
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
      reversed: true
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
        text: 'Paper No.'         
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
      name: 'Paper-Percentage',
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
        text: 'Paper No.'         
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
      name: 'Practice-Percentage',
      // colorByPoint: true,
      data: this.convertedDataPractice
    }]
  });
  // column.addPoint(1);
  this.columnChartPractice = column;
  column.ref$.subscribe(console.log);
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

  getMyHistory() {
    this.networkRequest.getWithHeaders(`/api/learnerhistory/`)
    .subscribe(
      data => {
        console.log("learner history ", data);
        //@ts-ignore
        if (data.length > 0) {
            this.myHistory = data[0];
            // this.total_questions = this.myHistory['total_questions'];
            // this.total_paper_time = this.myHistory['total_paper_time'];
            var timeinterval = setInterval(() => {
              // console.log("aa", this.test.remainingSeconds);
              this.total_questions += 1;
              if (this.total_questions >= this.myHistory['total_questions']) {
                this.total_questions = this.myHistory['total_questions'];
                clearInterval(timeinterval);
              }
              setTimeout(() => {
                this.total_questions = this.myHistory['total_questions'];
                clearInterval(timeinterval);
              }, 2500);
          }, 10);
          var timeinterval2 = setInterval(() => {
          this.total_paper_time += 1;
          if (this.total_paper_time >= this.myHistory['total_paper_time']) {
            this.total_paper_time = this.myHistory['total_paper_time'];
            clearInterval(timeinterval2);
          }
          setTimeout(() => {
            this.total_paper_time = this.myHistory['total_paper_time'];
            clearInterval(timeinterval2);
            }, 2500);
          }, 10);
        }
        
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getMyPapers() {
    this.networkRequest.getWithHeaders(`/api/overalllatestlearnerpapers/?page=${this.currentPage}`)
    .subscribe(
      data => {
        console.log("learner papers ", data);
        this.papers = data['results'];
        this.spinner = false;
        // if (this.currentPage == 1) {
        //   this.getAnswerpapers();
        // }
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

  getExamDetails() {
    if (this.paperType == 'paper'){
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
    else {
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
    }
  }

  
  selectSubject(subjectId) {
    this.selectedSubjectData = null
    this.selectedSubjectId = subjectId;
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

  getAnswerpapers(paperIds, type) {
    this.convertedData = [];
    this.topicLabels = [];
    this.topicLabelsPractice = [];
    this.convertedDataPractice = [];
    this.showColumnPractie = false;
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
              this.initColumnPaper();
              
            }
          }
          else {
            console.log("tmpdataaa", type, tmpData[i]);
            this.convertedDataPractice.push(tmpData[i]['percentage']);
            this.topicLabelsPractice.push(tmpData[i]['assessment_paper']['paper_type'] +  ' ' + tmpData[i]['assessment_paper']['paper_count']);
            // this.topicLabelsPractice.push(tmpData[i]['attempted_date']);
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
                this.showColumnPractie = true;
              }
              else if (this.convertedDataPracticeQuestions[0]['data'].length > 1 && this.convertedDataPracticeQuestions[0]['data'].length <= 3) {
                this.paddingPractice = 0.42;
              this.initGraphPractice();
              this.showColumnPractie = true;
              }
              else if (this.convertedDataPracticeQuestions[0]['data'].length > 3 && this.convertedDataPracticeQuestions[0]['data'].length <= 6) {
                this.paddingPractice = 0.35;
                this.initGraphPractice();
                this.showColumnPractie = true;
              }
               else if (this.convertedDataPracticeQuestions[0]['data'].length > 6 && this.convertedDataPracticeQuestions[0]['data'].length <= 9) {
                 this.paddingPractice = 0.27;
                 this.initGraphPractice();
                 this.showColumnPractie = true;
               }
               else if (this.convertedDataPracticeQuestions[0]['data'].length > 9) {
                 this.paddingPractice = 0.25;
                 this.initGraphPractice();
                 this.showColumnPractie = true;
               }
              this.initColumnPractice();
            }
          }
        }
        
      },
      error => {
      }
    );
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.getMyPapers(); 
  }

  switchExam(id) {
    this.convertedData = [];
    this.topicLabels = [];
    this.convertedDataPractice = [];
    this.showColumnPractie = false;
    this.showColumnPaper = false;
    this.showChapterGraph = false;
    this.poorChapter = null;
    this.excellentChapters = null;
    this.averageChapters = null;
    this.selectedSubjectData = null;
    for (let i = 0; i < this.myExams.length; i++) {
      if (this.myExams[i]['exam']['id'] == id) {
        this.examId = id;
        this.getSubjects();
        this.getExamDetails();
      }
    }
  }

  getMyExams() {
    this.networkRequest.getWithHeaders(`/api/alllearnerexam/`)
    .subscribe(
      data => {
        console.log("learner exams ", data);
        this.myExams = data;
        if (this.myExams.length > 0) {
          this.examId = this.myExams[0]['exam']['id'];
          this.getSubjects();
          this.getExamDetails();
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
      }
    );
  }
  
  ngOnInit(): void {
    this.getUserProfile();
    this.getMyExams();
    this.getMyHistory();
    this.goToPage(1);
    this.courseswitchservice.updateReloadPageStatus(true);
  }

}
