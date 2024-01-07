import { Component, OnInit, Input } from '@angular/core';
import { NetworkRequestService } from '../../../../../../../services/network-request.service';
import { ReportService } from '../services/report.service';
import { ReportChartService } from '../services/report-chart.service';

@Component({
  selector: 'app-percentile',
  templateUrl: './percentile.component.html',
  styleUrls: ['./percentile.component.scss']
})
export class PercentileComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private reportService: ReportService,
    private reportChartService: ReportChartService
  ) { }
  @Input() answerPaperId: string

  percentileObj = {};
  percentileChart: any;

  /**
   * Fetch rank report from server
   */
  getPercentileReport() {

    this.networkRequest.getWithHeaders(`/api/assessmentpaper_student_rank/${this.answerPaperId}/`).subscribe(
      data => {
        this.percentileObj = data;
        if (data['rank_data']) {

          // Format rank data
          const rankData = this.reportService.formatRankData(data['rank_data'][0]);

          // Generate assessment rank chart
          this.percentileChart = this.reportChartService.generateRankReport(rankData);
        }
      }
    );
  }

  ngOnInit() {
    this.getPercentileReport();
  }

}
