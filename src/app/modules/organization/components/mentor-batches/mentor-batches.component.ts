import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-mentor-batches',
  templateUrl: './mentor-batches.component.html',
  styleUrls: ['./mentor-batches.component.scss']
})
export class MentorBatchesComponent implements OnInit {

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
  convertedDataBatch = [];
  chartOptionsbatch = {};
  batchNames = [];
  batchReport;
  leaderBoardData;
  batchChart: any;

  columnWidth: number;
  scrHeight:any;
  scrWidth:any;

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


 initGraphBatch() {
  // this.chartOptionsbatch = {   
  //    chart: {
  //       type: 'column',
  //       // backgroundColor : '#F5F4F4'
  //    },
  //    title: {
  //       text: ''
  //    },
  //    xAxis:{
  //       categories: this.batchNames,
  //       crosshair: true        
  //    },     
  //    yAxis : {
  //       min: 0,
  //       title: {
  //          text: 'Accuracy'         
  //       }      
  //    },
  //    tooltip : {
  //       headerFormat: '<span style = "font-size:10px">{point.key}</span><table>',
  //       pointFormat: '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
  //          '<td style = "padding:0"><b>{point.y} </b></td></tr>', footerFormat: '</table>', shared: true, useHTML: true
  //    },
  //   plotOptions: {
  //     column: {
  //       stacking: 'normal',
  //       pointWidth: 30,
  //       //  pointPadding: 0.25,
  //        groupPadding: 0.25
  //     }
  //   },
  // series: this.convertedDataBatch
  // };
  this.batchChart = new Chart({
    chart: {
      style: {
        fontFamily: 'Roboto, sans-serif;'
      }
    },
    colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
    title: {
      text: 'Accuracy %'
    },
    yAxis: {
      labels: {
        enabled: false
      },
      title: {
        text: null
      }
    },
    xAxis: {
      labels: {
        enabled: false
      },
      title: {
        text: '<h2>Accuracy %<h2>'
      },
    },
    tooltip: {
      headerFormat: '<b>Batch - {series.name}</b><br>',
      pointFormat: 'Accuracy: {point.y} %'
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        },
      },
      column: {
        pointWidth: this.columnWidth,
        borderRadius: 2,
      }
    },
    series: this.convertedDataBatch
  });
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
  }

  getBatchLeaderboard() {
    this.networkRequest.getWithHeaders(`/api/cumulativebatchleaderboard/`)
    .subscribe(
      data => {
        console.log("leaderboard data ", data);
        this.leaderBoardData = data['leaderboard_data'];
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getAllBatchAccuracyReport() {
    this.networkRequest.getWithHeaders(`/api/batchaccuracyreport/`).subscribe(
      data => {
        console.log("overall batch accuracy analysis", data);
        this.batchReport = data;
        for (let i = 0; i < this.batchReport['batch_data'].length; i++) {
          this.batchNames.push(this.batchReport['batch_data'][i]['batch']['name']);
          // let tmpPerc = (Math.round(this.batchReport['batch_data'][i]['accuracy'] * 100) / 100).toFixed(2);
          let tmpPerc = this.batchReport['batch_data'][i]['accuracy'];
          // console.log("perc", tmpPerc);
          let tmpData: any;
          tmpData = {
            type: 'column',
            name: this.batchNames[i], 
            data: [tmpPerc],
            stack: this.batchNames[i]
          };
          this.convertedDataBatch.push(tmpData);
          console.log("convertedDataBatch", this.convertedDataBatch);
          if (i == this.batchReport['batch_data'].length- 1) {
            this.initGraphBatch();
          }
        }
      },
      error => {
        console.log("error ", error);
      }
    )
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
        }
      }
    );
    this.getAllBatchAccuracyReport();
    this.getBatchLeaderboard();
  }


}
