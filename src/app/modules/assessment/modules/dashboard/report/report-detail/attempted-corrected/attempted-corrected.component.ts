import { Component, OnInit, Input } from '@angular/core';
import { NetworkRequestService } from '../../../../../../../services/network-request.service';
import { ReportService } from '../services/report.service';
import { ReportChartService } from '../services/report-chart.service';

@Component({
  selector: 'app-attempted-corrected',
  templateUrl: './attempted-corrected.component.html',
  styleUrls: ['./attempted-corrected.component.scss']
})
export class AttemptedCorrectedComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private reportService: ReportService,
    private reportChartService: ReportChartService
  ) { }
  @Input() answerPaperId: string;


  scoreChart: any;
  attemptedCorrectedChart: any;

  feedback = null;

  getAttemptedCorrectedReport() {

    // Get Overall Mock Report
    this.networkRequest.getWithHeaders(`/api/mockpaper_report_overall/${this.answerPaperId}/`).subscribe(
      data => {
        if (!data['question_not_attempted']) {

          // Get Formatted Data and Generate Score and Attempted/Corrected Ratio with Total Questions Report
          const reportData = this.reportService.formatOverallReportData(data['report_data']);

          // Attempted Corrected Report Chart
          this.attemptedCorrectedChart = this.reportChartService.generateAttemptedCorrectedChart(reportData);

          // Score Chart
          this.scoreChart = this.reportChartService.generateScoreChart(reportData.score, reportData.category);
        } else {
          this.feedback = data['question_not_attempted'];
        }
      }
    );
  }

  ngOnInit() {
    this.getAttemptedCorrectedReport()
  }

}
