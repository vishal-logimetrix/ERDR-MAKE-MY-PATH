import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

// Modals
import { Comparison, ReportAdapter } from '../adapter/report-modal';

// Services
import { NetworkRequestService } from '../../../../../../../services/network-request.service';
import { MiscellaneousService } from '../../../../../../../services/miscellaneous.service';
import { ReportService } from '../services/report.service';
import { ReportChartService } from '../services/report-chart.service';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComparisonComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private reportService: ReportService,
    private reportChartService: ReportChartService,
    private adapter: ReportAdapter,
  ) { }
  @Input() answerPaperId: string;
  static = environment.static;

  scoreComparison: Array<object>;
  scoreChart: any;

  attemptedComparison: Comparison;
  attemptedChart: any;

  accuracyComparison: Comparison;
  accuracyChart: any;

  /** Feedback */
  scoreFeedback: string;
  attemptedFeedack: string;
  accuracyFeedback: string;

  dataAvailable: boolean = false;

  getScoreComparison() {

    /** Load from server on if chart not generated */
    if (!this.scoreChart) {
      this.dataAvailable = true;
      this.networkRequest
        .getWithHeaders(`/api/assessmentpaper_test_comparison_score/${this.answerPaperId}/`)
        .subscribe(
          data => {
            if (data['comparison_data_score']) {
              this.scoreChart = this.generateComparison('score', data['comparison_data_score']);
            } else if (data['comparison_status_score']) {
              this.scoreFeedback = data['comparison_status_score'];
            }
          },
          error => {
            this.dataAvailable = false;
          }
        );
    }
  }

  getAttemptedComparison() {

    /** Load from server on if chart not generated */
    if (!this.attemptedChart) {
      this.dataAvailable = true;
      this.networkRequest
        .getWithHeaders(`/api/assessmentpaper_test_comparison_attempted/${this.answerPaperId}/`)
        .subscribe(
          data => {
            if (data['comparison_data_attempted']) {
              this.attemptedChart = this.generateComparison('attempted', data['comparison_data_attempted']);
            } else if (data['comparison_status_attempted']) {
              this.attemptedFeedack = data['comparison_status_attempted'];
            }
          },
          error => {
            this.dataAvailable = false;
          }
        );
    }
  }


  getAccuracyComparison() {

    /** Load from server on if chart not generated */
    if (!this.accuracyChart) {
      this.dataAvailable = true;
      this.networkRequest
        .getWithHeaders(`/api/assessmentpaper_test_comparison_accuracy/${this.answerPaperId}/`)
        .subscribe(
          data => {
            if (data['comparison_data_accuracy']) {
              this.accuracyChart = this.generateComparison('accuracy', data['comparison_data_accuracy']);
            } else if (data['comparison_status_accuracy']) {
              this.accuracyFeedback = data['comparison_status_accuracy'];
            }
          },
          error => {
            this.dataAvailable = false;
          }
        );
    }
  }

  generateComparison(reportType: string, data: Array<object>) {
    const comparisonData = this.adapter.mapComparison(data);
    const formattedData = this.reportService.formatComparison(reportType, comparisonData);
    return this.reportChartService.comparisonChart(formattedData);
  }


  ngOnInit() {
    this.getScoreComparison();
  }

}
