import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import * as Highcharts from 'highcharts';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-practice-report',
  templateUrl: './practice-report.component.html',
  styleUrls: ['./practice-report.component.scss']
})
export class PracticeReportComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private locationStrategy: LocationStrategy,
    private toastr: ToastrService,
    private router: Router,
    private courseswitchservice: CourseSwitchService
  ) { }

  paperId;
  paperDetails;
  examId;
  reportObj: any;
  excellentChapters = null;
  averageChapters = null;
  poorChapter = null;
  needleValue;
  bottomLabel;
  accuracyData;
  hasSubjective: boolean = false;
  highcharts = Highcharts;
  convertedData = [];
  convertedDataAttempt = [];
  convertedDataCorrect = [];
  convertedDataIncorrect = [];
  chartOptions = {};
  chartOptionsa = {};
  chartOptionsb = {};
  chartOptionsc = {};
  showGraph: boolean = false;
  fetchedQuestions;
  linkedTypes;
  quesTypes = [];
  overallPerc;
  attemptedPerc;
  skippedPerc;
  incorrectPerc;
  correctPerc;
  excellent;
  average;
  poor;
  isDownload;

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

  onPrint() {
    // const printContents = document.getElementById('printinvoice').innerHTML;
    // const originalContents = document.body.innerHTML;
    // document.body.innerHTML = printContents;
    window.print();
    // document.body.innerHTML = originalContents;
  }

  initGraph() {
    this.chartOptions = {   
       chart: {
          type: 'pie',
          backgroundColor : '#F5F4F4'
       },
       credits: {
         enabled: false
       },
       tooltip: { enabled: false },
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
    },
    tooltip: { enabled: false },
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
    },
    tooltip: { enabled: false },
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
    },
    tooltip: { enabled: false },
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

submitFilterForm() {
  let chapterIds = [];
  chapterIds.push(this.paperDetails['chapters'][0]['id']);
  let formData;
  
  formData = {
    chapters: chapterIds,
    totalQues: 10,
    quesTypes: this.quesTypes,
    difficulty: this.paperDetails['questions'][0]['difficulty'],
    learnerExam: this.paperDetails['learner_exam']['id'],
    exam: this.examId,
    show_time: true,
    type: 'practice'
  }
  this.networkRequest.putWithHeaders(formData, `/api/filterquestion/`).subscribe(
    data => {
      console.log("Questions found ", data);
      // this.misc.hideLoader();
      this.fetchedQuestions = data['questions'];
      
      if (this.fetchedQuestions.length == 0) {
        this.toastr.error('No question found!', 'Error!', {
          timeOut: 4000,
        });
        return;
      }
      let quesIds = [];

      this.courseswitchservice.updateReloadPageStatus(true);

      this.router.navigate([`/assessment/paper/practice-paper/${this.examId}`],{
        queryParams: {
          paper: data['id']
        }
      });
    },
    error => {
      this.misc.hideLoader();
      console.log("error ", error);
      this.toastr.error(error['error']['message'], 'Error!', {
        timeOut: 4000,
      });
    }
  );
}

  getPaperDetails() {
    this.networkRequest.getWithHeaders(`/api/learnerpapers/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
        this.examId = this.paperDetails['learner_exam']['exam']['id'];
        this.getAssessmentReport();
        this.networkRequest.getWithHeaders(`/api/examlinkedquestiontypes/?exam=${this.examId}`)
        .subscribe(
          data => {
            console.log("linked types ", data);
            this.linkedTypes = data;
            for (let i = 0; i < this.linkedTypes.length; i++) {
              this.quesTypes.push(this.linkedTypes[i]['type_of_question']);
            }
            this.quesTypes = [...new Set(this.quesTypes.map(m => m))];
          },
          error => {
          });
      },
      error => {
        this.getAssessmentReport();
      });
  }

  getAssessmentReport() {

    this.networkRequest.getWithHeaders(`/api/assessmentpaper_report/${this.paperId}/`).subscribe(
      data => {
        // console.log("assessmentpaper_report", data);

        this.reportObj = { ...this.reportObj, ...data };
        console.log("reportObj", this.reportObj);
        this.needleValue = this.reportObj['report_data']['percentage'];
        this.bottomLabel = ((Math.round(this.reportObj['report_data']['percentage'] * 100) / 100).toFixed(2))+'%';

        console.log("reportobj", this.reportObj);
        this.overallPerc = ((Math.round(this.reportObj['report_data']['corrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))+'%';
        this.attemptedPerc = ((Math.round(this.reportObj['report_data']['attempted'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))+'%';
        this.skippedPerc = ((Math.round(this.reportObj['report_data']['skipped'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))+'%';
        this.incorrectPerc = ((Math.round(this.reportObj['report_data']['incorrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))+'%';

        this.correctPerc = ((Math.round(this.reportObj['report_data']['corrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2));
        
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
          name: '', 
          y: (100-Number((Math.round(this.reportObj['report_data']['incorrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))),
          color: '#e7eaeb'
        };
        this.convertedDataIncorrect.push(tmpData);
        tmpData = {
          name: '', 
          y: Number((Math.round(this.reportObj['report_data']['incorrected'] * 100) / this.reportObj['report_data']['totalquestion']).toFixed(2))
        };
        this.convertedDataIncorrect.push(tmpData);
        this.initGraphc();
        this.showGraph = true;
        console.log("poor", this.correctPerc, this.incorrectPerc, this.paperDetails['learner_exam']['exam']['poor'])

        if ((this.reportObj['report_data']['chapters'][0]['attempted'] == this.reportObj['report_data']['chapters'][0]['unchecked']) && this.reportObj['report_data']['chapters'][0]['attempted'] != 0) {
          this.hasSubjective = true;
        }

        if (this.correctPerc >= this.paperDetails['learner_exam']['exam']['excellent_low'] && this.correctPerc <= this.paperDetails['learner_exam']['exam']['excellent_high']) {
          this.excellent = this.reportObj['report_data']['chapters'][0]['title'];
        }
        if (this.correctPerc >= this.paperDetails['learner_exam']['exam']['average_low'] && this.correctPerc <= this.paperDetails['learner_exam']['exam']['average_high']) {
          this.average = this.reportObj['report_data']['chapters'][0]['title'];
        }
        if (this.correctPerc <= this.paperDetails['learner_exam']['exam']['poor']) {
          console.log("poor", this.correctPerc, this.incorrectPerc, this.paperDetails['learner_exam']['exam']['poor'])
            this.poor = this.reportObj['report_data']['chapters'][0]['title'];
        }

        if (this.isDownload) {
          console.log("download");
          setTimeout(() => {
            this.onPrint();
          }, 1100);
        }

      },
      error => {
       
      }
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      data => {
        this.paperId = data.id;
        this.getPaperDetails();
      }
    );
    this.route.queryParams.subscribe(
      params => {
        this.isDownload = params.download;
    });

    this.preventBackButton();
  }

}
