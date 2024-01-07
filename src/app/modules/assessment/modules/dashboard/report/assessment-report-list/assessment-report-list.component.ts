import {Component, OnInit} from '@angular/core';
import {NetworkRequestService} from '../../../../../../services/network-request.service';
import {Router} from '@angular/router';
import {MiscellaneousService} from '../../../../../../services/miscellaneous.service';

@Component({
  selector: 'app-assessment-report-list',
  templateUrl: './assessment-report-list.component.html',
  styleUrls: ['./assessment-report-list.component.scss']
})
export class AssessmentReportListComponent implements OnInit {

  constructor(
    private router: Router,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService
  ) {
  }


  attemptNo = '1';
  allPackages: any = [];
  reportAvailable = true;

  getAllPackages() {
    this.misc.showLoader();
    this.networkRequest.getWithHeaders('/api/userenrolledpackages/').subscribe(
      data => {

        this.allPackages = data['enrolledpackages'].filter((pkg, index) => {

          // Update Report status
          pkg['packagedetails']['assessmentpaper'].forEach(paper => {
            this.setReportStatus(paper, pkg);
          });

          return pkg['packagedetails']['assessmentpaper'].length !== 0 && pkg['packagedetails']['attempt_status'];
        });

        if (this.allPackages.length === 0) {
          this.reportAvailable = false;
        }

        this.misc.hideLoader();
      },
      error => {
        this.reportAvailable = false;
        this.misc.hideLoader();
      }
    );
  }

  setReportStatus(paper, pkg) {

    if (paper['attempt_status']['attempted']) {
      pkg['report_available_status'] = true;
    }
  }

  viewReport(testId) {
    this.router.navigateByUrl(`/assessment/dashboard/report/test-report/assessment/${testId}/${this.attemptNo}`);
  }


  ngOnInit() {
    this.getAllPackages();
  }

}
