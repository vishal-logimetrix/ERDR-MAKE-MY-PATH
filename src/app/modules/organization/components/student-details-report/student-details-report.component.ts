import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { ViewportScroller } from '@angular/common';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-student-details-report',
  templateUrl: './student-details-report.component.html',
  styleUrls: ['./student-details-report.component.scss']
})
export class StudentDetailsReportComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private toastr: ToastrService,
    private batchservice: BatchServiceService,
    private alertService: AlertService
  ) { }
  batchId;
  batchDetails;
  max_page: number;
  pages = [];
  currentPage: number = 1;
  startPage: number = 1;
  endPage: number = 1;
  papers;
  links;
  batchStudents;
  showScatter: boolean = false;
  selectedStudentUsername;
  maxTime: any;
  convertedData = [];
  paperNamesPaper = [];
  scatteredChart: Chart;
  convertedDataScatter = [];
  chartOptions = {};
  chartOptionspractice = {};
  highcharts = Highcharts;
  chartOptionsb = {};
  highchartsb = Highcharts;
  data = [100, 20, 50, 70];
  topicLabels = [];
  columnChart: Chart;
  showStudentsList: boolean = true;
  selectedPaperId;
  selectedRemark;
  paperCountData;
  paperViewType = "mentorpapersfourinapage";
  selectedUserName;
  activeCard;
  relativepapers = [];
  spinner:boolean = true;

  selectRemark(paperid, remark) {
    this.selectedPaperId = paperid;
    this.selectedRemark = remark;
  }

  

  updateRemarks() {
    const formData = {
      paper: this.selectedPaperId,
      remarks: this.selectedRemark
    }
    this.networkRequest.putWithHeaders(formData,`/api/updateremarks/`)
      .subscribe(
        data => {
          console.log("remarks updated ", data);
          this.closeModal.nativeElement.click();
          this.selectedPaperId = null;
          this.selectedRemark = null;
          this.toastr.success('Remarks updated successfully!', 'Updated!', {
            timeOut: 4000,
          });
          this.selectStudent(this.selectedStudentUsername, this.selectedUserName);
        },
        error => {
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
        allowDecimals: false,
        title: {
          enabled: true,
          text: '<p>Accuracy</p>'
        }
      },
      xAxis: {
        // categories: this.topicLabels,
        allowDecimals: false,
        title: {
          text: 'Total Questions Attempted in Papers'         
       } 
      },
      tooltip: {
        pointFormatter: function () {
          return `<strong>${this.learner}<br></strong>Questions issued: <strong>${this.total_questions}</strong><br>
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
          text: '<p>Percentage Accuracy</p>'
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

  showStudentsListPage() {
    this.showStudentsList = true;
  }

  selectStudent(username, name) {
    this.showStudentsList = false;
    this.selectedStudentUsername = username;
    this.selectedUserName = name;
    this.goToPage(this.currentPage);
    this.activeCard = name ;
    this.convertedData = [];
    this.paperNamesPaper = [];
  }

  blockStudent(username) {
    this.alertService.showAlert({ text: 'Are you sure you want to block this student?' }, 'info', 'confirm')
      .subscribe(data => {
        if (data) {
          const formData = {
            user: username,
            batch: this.batchId
          }
          this.networkRequest.putWithHeaders(formData, `/api/removefrombatch/`)
          .subscribe(
            data => {
              console.log("student removed and blocked ", data);
              this.getBatchDetails();
              this.toastr.success('Student Removed and Blocked Successfully!', 'Success!', {
                timeOut: 4000,
              });
            },
            error => {
              console.log("error ", error);
              this.toastr.error(error['error']['message'], 'Error!', {
                timeOut: 4000,
              });
            }
          );
        }
      });
  }

  showCompleted() {
    this.paperViewType = "completedmentorpapersfourinapage";
    this.currentPage = 1;
    this.getMyPapers();
  }

  showPending() {
    this.paperViewType = "pendingmentorpapersfourinapage";
    this.currentPage = 1;
    this.getMyPapers();
  }

  showOver() {
    this.paperViewType = "overmentorpapersfourinapage";
    this.currentPage = 1;
    this.getMyPapers();
  }

  showAll() {
    this.paperViewType = "mentorpapersfourinapage";
    this.currentPage = 1;
    this.getMyPapers();
  }

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.getMyPapers();
  }

  getMyPapers() {
    this.convertedData = [];
    this.networkRequest.getWithHeaders(`/api/${this.paperViewType}/?page=${this.currentPage}&batch=${this.batchId}&user=${this.selectedStudentUsername}`)
    .subscribe(
      data => {
        console.log("mentor papers ", data);
        this.papers = data['results'];
        // this.fetchAnswerPapersForAParticularPaper(this.papers[0]['id']);
        if (this.currentPage == 1) {
          // let anspapers = [];
          // this.topicLabels = [];
          // this.convertedData = [];
          // this.paperNamesPaper = [];
          // for (let i = 0; i < this.papers.length; i++) {
          //   if (this.papers[i]['attempt_status']['attempted'] && this.convertedData.length <= 5) {
          //     anspapers.push({'attempted_date': this.papers[i]['attempt_status']['attempted_date'], 'percentage': this.papers[i]['attempt_status']['percentage'], 'paper_type': this.papers[i]['paper_type'], 'paper_count': this.papers[i]['paper_count']});
              
          //   }
          // }
          // anspapers.sort((a, b) => a.attempted_date.localeCompare(b.attempted_date));
          // for (let i = 0; i < anspapers.length; i++) {
          //   this.convertedData.push(anspapers[i]['percentage']);
          //   this.topicLabels.push(anspapers[i]['paper_type'] + anspapers[i]['paper_count']);
          //   this.paperNamesPaper.push(anspapers[i]['paper_type'] + anspapers[i]['paper_count']);
          //   this.initColumnPaper();
          // }
          this.networkRequest.getWithHeaders(`/api/mentorpapersforrelativegrowth/?page=1&batch=${this.batchId}&user=${this.selectedStudentUsername}`)
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
                  this.topicLabels.push(relativeanspapers[i]['paper_type'].charAt(0).toUpperCase() +relativeanspapers[i]['paper_type'].slice(1) + relativeanspapers[i]['paper_count']);
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
    this.networkRequest.getWithHeaders(`/api/student_batch_paper_count_stats/${this.batchId}/?user=${this.selectedStudentUsername}`)
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

  fetchAnswerPapersForAParticularPaper(id) {
    this.networkRequest.getWithHeaders(`/api/getallmentorpaperanswerpapers/?paper=${id}`).subscribe(
      data => {
        console.log("all papers", data);
      },
      error => {
        console.log("error ", error);
      }
    )
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
          this.batchStudents = data;
          this.spinner = false;
          this.selectedStudentUsername = this.batchStudents[0]['username'];
          this.selectedUserName = this.batchStudents[0]['full_name'];
          this.activeCard = this.batchStudents[0]['full_name'];
          this.getMyPapers();
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
          this.spinner = false;
        }
      );
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          // this.goToPage(1);
          this.getBatchDetails();
        }
      }
    );
  }

}
