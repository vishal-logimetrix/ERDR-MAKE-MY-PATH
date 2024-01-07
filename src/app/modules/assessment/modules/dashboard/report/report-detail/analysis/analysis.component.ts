import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

// Modals & Adapters
import { ReportAdapter, TestAnalysis } from '../adapter/report-modal';

// Services
import { MiscellaneousService } from '../../../../../../../services/miscellaneous.service';
import { NetworkRequestService } from '../../../../../../../services/network-request.service';
import { UtilsService } from '../../../../../../../core/services/utils.service';


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private adapter: ReportAdapter,
    private utils: UtilsService,
  ) { }
  @Input() answerPaperId: string;
  @ViewChild('mathjaxEl', { static: false }) mathjaxElRef: ElementRef<any>;

  testAnalysis: TestAnalysis;
  isMobile = this.utils.isMobile();

  analysisFeedback: string;

  getTestAnalysis() {

    // Show loader
    this.misc.showLoader();

    // Get Test analysis report
    this.networkRequest.getWithHeaders(`/api/assessmentpaper_test_analysis/${this.answerPaperId}/`)
      .subscribe(
        (data: any) => {
          this.misc.hideLoader();
          if (!data['analysis_status']) {

            /** Resolve data using adapter */
            this.testAnalysis = this.adapter.mapAnalysisData(data);
            this.misc.initializeMathJax(this.mathjaxElRef.nativeElement).subscribe();

          } else {

            /** Analysis feedback */
            this.analysisFeedback = data['analysis_status'];
          }
        }, error => {
          this.misc.hideLoader();
        }
      );
  }


  ngOnInit() {
    this.getTestAnalysis();
  }

}
