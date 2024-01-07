import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { ToastrService } from 'ngx-toastr';
import * as Highcharts from 'highcharts';
import { ConstantsService } from 'src/app/core/services/constants.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  styleUrls: ['./batch-details.component.scss']
})
export class BatchDetailsComponent implements OnInit {

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
  batchId;
  batchDetails;
  scatteredChart: Chart;
  convertedDataScatter = [];
  showScatter: boolean = false;
  isBlocked: boolean = false;
  paperCountData;
  paperViewType = "mentorpapersfourinapage";
  relativepapers = [];

  @Input() incomingdata: any

  constructor(
    private consts: ConstantsService,
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  selectedPaperId;
  selectedRemark;

  selectRemark(paperid, remark) {
    this.selectedPaperId = paperid;
    this.selectedRemark = remark;
  }

  openNewPaper(exam, paper) {
    this.router.navigate([`/assessment/paper/test-instructions/${exam}`],{
      queryParams: {
        paper: paper
      }
    });
  }

  initScattered() {
    const column = new Chart({
      chart: {
        type: 'scatter',
        zoomType: 'xy',
        style: {
          fontFamily: 'Roboto, sans-serif;'
        },
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
          text: '<p>Accuracy</p>'
        }
      },
      xAxis: {
        // categories: this.topicLabels,
        title: {
          text: 'Total Questions Attempted in Papers'         
       } 
      },
      tooltip: {
        pointFormatter: function () {
          return `<strong>${this.learner}<br></strong>Problems issued: <strong>${this.total_questions}</strong><br>
          Papers issued: <strong>${this.total_papers}</strong><br>
          Practice sheets issued: <strong>${this.total_practice}</strong><br>
          Time Spent in Papers: <strong>${this.time_spent_paper}</strong>`
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
      series: 
      [{
        name: 'Learner',
        color: '#007bff',
        data: this.convertedDataScatter,
      }]
    });
    // column.addPoint(1);
    this.scatteredChart = column;
    column.ref$.subscribe(console.log);
  }

  // Attempted: <strong>${this.originalX ? this.originalX : this.x}</strong><br>
  // Accuracy: <strong>${this.y} %</strong><br>

 initGraphPaper() {
  this.chartOptions = {   
     chart: {
        type: 'column',
        backgroundColor : '#F5F4F4'
     },
     title: {
        text: ''
     },
     xAxis:{
        categories: this.paperNamesPaper,
        crosshair: true        
     },  
     credits: {
      enabled: false
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
    plotOptions: {
      column: {
        stacking: 'normal',
        pointWidth: 14,
        groupPadding: this.padding
      }
    },
    colors: [
      '#6699FF',
      '#F05558',
      '#56BE89'
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
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
      shadow: true
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
      series: [{
        name: 'Percentage',
        // colorByPoint: true,
        data: this.convertedData
      }]
    });
    // column.addPoint(1);
    this.columnChart = column;
    column.ref$.subscribe(console.log);
  }

  showCompleted() {
    this.convertedData = [];
    this.paperViewType = "completedmentorpapersfourinapage";
    this.currentPage = 1;
    this.getMyPapers();
  }

  showPending() {
    this.convertedData = [];
    this.paperViewType = "pendingmentorpapersfourinapage";
    this.currentPage = 1;
    this.getMyPapers();
  }

  showOver() {
    this.convertedData = [];
    this.paperViewType = "overmentorpapersfourinapage";
    this.currentPage = 1;
    this.getMyPapers();
  }

  showAll() {
    this.convertedData = [];
    this.paperViewType = "mentorpapersfourinapage";
    this.currentPage = 1;
    this.getMyPapers();
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.getMyPapers();
  }
  
  getMyPapers() {
    this.networkRequest.getWithHeaders(`/api/${this.paperViewType}/?page=${this.currentPage}&batch=${this.batchId}`)
    .subscribe(
      data => {
        console.log("mentor papers ", data);
        this.papers = data['results'];
        if (this.currentPage == 1) {
          // let anspapers = [];
          // this.paperNamesPaper = [];
          //@ts-ignore
          // anspapers.sort((a, b) => a.attempted_date.localeCompare(b.attempted_date));
          // for (let i = 0; i < anspapers.length; i++) {
          //   this.paperNamesPaper.push(anspapers[i]['paper_type'] + anspapers[i]['paper_count']);
          // }

          this.networkRequest.getWithHeaders(`/api/mentorpapersforrelativegrowth/?page=1&batch=${this.batchId}`)
            .subscribe(
              data => {
                this.relativepapers = data['results'];
                let relativeanspapers = [];
                //@ts-ignore
                for (let i = 0; i < this.relativepapers.length; i++) {
                  if (this.relativepapers[i]['attempt_status']['attempted'] && this.convertedData.length <= 10) {
                    relativeanspapers.push({'attempted_date': this.relativepapers[i]['attempt_status']['attempted_date'], 'percentage': this.relativepapers[i]['attempt_status']['percentage'], 'paper_type': this.relativepapers[i]['paper_type'], 'paper_count': this.relativepapers[i]['paper_count']});
                  }
                }
                relativeanspapers.sort((a, b) => a.attempted_date.localeCompare(b.attempted_date));
                for (let i = 0; i < relativeanspapers.length; i++) {
                  this.convertedData.push(relativeanspapers[i]['percentage']);
                  this.topicLabels.push(relativeanspapers[i]['paper_type'] + relativeanspapers[i]['paper_count']);
                  this.initColumnPaper();
                }
              },
              error => {
                console.log("error ", error);
              }
          );
        }
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


  getBatchDetails() {
    this.networkRequest.getWithHeaders(`/api/batch/${this.batchId}/`)
      .subscribe(
        data => {
          console.log("batch details ", data);
          this.batchDetails = data;
        },
        error => {
          console.log("error ", error);
        }
    );
    this.showScatter = false;
    this.networkRequest.getWithHeaders(`/api/learnerbatchhistory/?batch=${this.batchId}`)
    .subscribe(
      data => {
        console.log("batch learners history ", data);
        let tmpData = data;
        var studentNames = [];
        var totalQuestions = [];
        var totalPapers = [];
        var totalPractice = [];
        var totalTimeSpentPapers = [];
        //@ts-ignore
        for (let i = 0; i < tmpData.length; i++) {
          studentNames.push(tmpData[i]['full_name']);
          totalQuestions.push(tmpData[i]['total_questions']);
          totalPapers.push(tmpData[i]['total_paper_count']);
          totalPractice.push(tmpData[i]['total_practice_count']);
          totalTimeSpentPapers.push(tmpData[i]['total_paper_time_taken']);
          console.log("scatter data ", studentNames, totalQuestions, totalPapers, totalPractice);
          this.convertedDataScatter.push({
            'x': tmpData[i]['total_questions'],
            'y': tmpData[i]['paper_percentage'],
            'learner': tmpData[i]['full_name'],
            'total_questions': tmpData[i]['total_questions'],
            'total_papers': tmpData[i]['total_paper_count'],
            'total_practice': tmpData[i]['total_practice_count'],
            'time_spent_paper': tmpData[i]['total_paper_time_taken'],
          })
          //@ts-ignore
          if (i == tmpData.length - 1) {
            this.showScatter = true;
            console.log("convertedData scatter", this.convertedDataScatter);
            setTimeout(() => {
              this.initScattered();
            }, 1000);
          }
        }
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.getWithHeaders(`/api/student_batch_paper_count_stats/${this.batchId}/`)
      .subscribe(
        data => {
          console.log("student batch paper count details ", data);
          this.paperCountData = data['paper_count_data'];
        },
        error => {
          console.log("error ", error);
        }
    );
  }

  checkIfBlocked() {
    this.networkRequest.getWithHeaders(`/api/checkifblockedfrombatch/?batch=${this.batchId}`).subscribe(
      data => {
      },
      error => {
        console.log("error ", error);
        this.isBlocked = true;
        this.toastr.error(error['error']['detail'], 'Error!', {
          timeOut: 4000,
        });
      }
    )
  }
  
  ngOnInit(): void {
    this.courseswitchservice.examIdStatus.subscribe(
      data => {
        if (!data) {
          this.route.params.subscribe(
            data1 => {
              if (data1['exam']) {
                this.courseswitchservice.updateExamId(data1['exam']);
                this.examId = data1['exam'];
              }
            }
          );
        }
        else {
          this.examId = data;
        }
    });
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchId = data1['batch'];
          this.goToPage(1);
          this.getBatchDetails();
          this.checkIfBlocked();
        }
      }
    );
    this.initScattered();
    this.courseswitchservice.updateReloadPageStatus(true);
    // this.initColumn();
    // this.initGraph();
    // this.initThreeDGraph();
  }

}
