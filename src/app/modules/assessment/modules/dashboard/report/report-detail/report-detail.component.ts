import { Component, OnInit, ViewEncapsulation, ViewChild, QueryList, ElementRef, ViewChildren, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocationStrategy } from '@angular/common';


import { NetworkRequestService } from '../../../../../../services/network-request.service';
import { MiscellaneousService } from '../../../../../../services/miscellaneous.service';

// Report Services
import { ReportChartService } from './services/report-chart.service';
import { ReportService } from './services/report.service';


// Modals
import { ReportAdapter } from './adapter/report-modal';


@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ReportChartService, ReportService, ReportAdapter]
})
export class ReportDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private reportChart: ReportChartService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private locationStrategy: LocationStrategy
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
    this.misc.showLoader();

    this.networkRequest.getWithHeaders(`/api/assessmentpaper_report/${this.reportObj['id']}/`).subscribe(
      data => {
        console.log("report data", data);
        this.misc.hideLoader();

        this.reportObj = { ...this.reportObj, ...data };

        if (this.reportObj['report_data']) {
          this.generateReport(this.reportObj);
          this.contentAvailable = true;
        } else {
          this.contentAvailable = false;
        }

      },
      error => {
        this.contentAvailable = true;
        this.misc.hideLoader();
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
          this.generateReport(this.reportObj);

        }, error => {
          this.misc.hideLoader();
        }
      );
  }


  generateReport(data: object) {
    /** Format Moo Report data to feed in highcharts */
    const reportData = this.reportService.formatReportData(data['report_data']);

    /** Difficulty wise Chart */
    this.difficultyWiseChart = this.reportChart.generateChart(reportData['difficulty_wise_report']);

    /** Question wise Chart */
    this.questionWiseChart = this.reportChart.generateChart(reportData['question_type_based_report']);
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

  ngOnInit() {
    this.route.params.subscribe(
      data => {
        this.reportObj = { ...data };
        this.getAssessmentReport();
      }
    );

    // this.preventBackButton();
  }

}
