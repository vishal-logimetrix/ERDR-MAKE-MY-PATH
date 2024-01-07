import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-student-result-analysis',
  templateUrl: './student-result-analysis.component.html',
  styleUrls: ['./student-result-analysis.component.scss']
})
export class StudentResultAnalysisComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private toastr: ToastrService,
    private batchservice: BatchServiceService
  ) { }

  batchId;
  batchDetails;
  max_page: number;
  pages = [];
  currentPage: number;
  startPage: number = 1;
  endPage: number = 1;
  papers;
  links;
  batchStudents;
  showScatter: boolean = false;
  answerPapers;
  convertedData = [];
  subjectNames = [];
  chartOptions = {};
  padding: number;
  chartOptionsb = {};
  highchartsb = Highcharts;
  highcharts = Highcharts;
  convertedDataChapter = [];
  chapterNames = [];
  showGraph: boolean = false;
  reportObj;
  showChapterGraph: boolean = false;
  spinner:boolean = true;
  activeCard: string = "";
  selectedPaperType;
  selectedPaperCount;
  topSpinner:boolean = true;

  initGraph() {
    this.chartOptionsb = {   
       chart: {
          type: 'column',
          // backgroundColor : '#F5F4F4'
       },
       title: {
          text: ''
       },
       xAxis:{
          //  categories: this.chapterNames,
          crosshair: true        
       },     
       yAxis : {
          min: 0,
          title: {
             text: 'Accuracy'         
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
      plotOptions: {
        column: {
          stacking: 'normal',
          pointWidth: 30,
          //  pointPadding: 0.25,
           groupPadding: 0.25
        }
      },
    //   colors: [
    //     '#6699FF',
    //     '#F05558',
    //     '#56BE89'
    // ],
    series: this.convertedDataChapter
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

  goToPage(pageIndex) {
    this.currentPage = pageIndex;
    this.getMyPapers();
  }

  getMyPapers() {
    this.networkRequest.getWithHeaders(`/api/mentorpapers/?page=${this.currentPage}&batch=${this.batchId}`)
    .subscribe(
      data => {
        console.log("mentor papers ", data);
        this.papers = data['results'];
        this.topSpinner = false;
        this.selectedPaperType = this.papers[0]['paper_type'];
        this.selectedPaperCount = this.papers[0]['paper_count'];
        this.fetchAnswerPapersForAParticularPaper(this.papers[0]['id']);
       
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
        this.topSpinner = false;
      }
    );
  }

  fetchPaperType(type, count, id) {
    this.selectedPaperType = type;
    this.selectedPaperCount = count;
    this.fetchAnswerPapersForAParticularPaper(id);
  }

  fetchAnswerPapersForAParticularPaper(id) {
    this.reportObj = null;
    this.answerPapers = null;
    this.activeCard = id ;
    this.networkRequest.getWithHeaders(`/api/getallmentorpaperanswerpapers/?paper=${id}`).subscribe(
      data => {
        this.answerPapers = data;
        console.log("all papers", data);
        this.spinner = true;
        this.showChapterGraph = false;
      },
      error => {
        console.log("error ", error);
      }
    )

    this.networkRequest.getWithHeaders(`/api/mentorassessmentpaper_allreports/${id}/`).subscribe(
      data => {
        this.reportObj = data;
        console.log("all reports", data);
        this.spinner = true;
        this.showChapterGraph = false;
        this.fetchSubjectChaptersData(this.reportObj['report_data'][0]['subjects'][0]['id']);
      },
      error => {
        console.log("error ", error);
      }
    )

    this.networkRequest.getWithHeaders(`/api/mentorassessment_questionreport/${id}/`).subscribe(
      data => {
        console.log("question report", data);
      },
      error => {
        console.log("error ", error);
      }
    )
  }

  fetchSubjectChaptersData(subjectId) {
    this.spinner = true;
    let chapterScoresArrary = 0;
    let chapterTotalArray = [];
    this.chapterNames = [];
    let chapterIds = [];
    this.spinner = true;
    this.showChapterGraph = false;
    this.convertedDataChapter = [];
    for (let i = 0; i < this.reportObj['report_data'][0]['chapters'].length; i++) {
      if (this.reportObj['report_data'][0]['chapters'][i]['subject'] == subjectId) {
        this.chapterNames.push(this.reportObj['report_data'][0]['chapters'][i]['title']);
        chapterIds.push(this.reportObj['report_data'][0]['chapters'][i]['id']);
      }
    }
    // console.log("chapterids and names", chapterIds, this.chapterNames);
    for (let i = 0; i < chapterIds.length; i++) {
      chapterScoresArrary = 0;
      for (let j = 0; j < this.reportObj['report_data'].length; j++) {
        for (let k = 0; k < this.reportObj['report_data'][j]['chapters'].length; k++) {
          if (this.reportObj['report_data'][j]['chapters'][k]['id'] == chapterIds[i]) {
            chapterScoresArrary = chapterScoresArrary + this.reportObj['report_data'][j]['chapters'][k]['percentage'];
          }
        }
        if (j == this.reportObj['report_data'].length - 1) {
          let tmpPerc = (chapterScoresArrary)/ this.reportObj['report_data'].length;
          let tmpData: any;
          tmpData = {
            name: this.chapterNames[i], 
            data: [tmpPerc],
            stack: this.chapterNames[i]
          };
          this.convertedDataChapter.push(tmpData);
          // console.log("convertedDataChapter", this.convertedDataChapter);
        }
      }
      if (i == chapterIds.length - 1) {
        setTimeout(() => {
          this.initGraph();
          this.showChapterGraph = true;
          this.spinner = false;
        }, 1000);
        
      }
      else {
        this.spinner = false;
      }
    }
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
          this.getMyPapers();
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.goToPage(1);
          this.getBatchDetails();
        }
      }
    );
  }

}
