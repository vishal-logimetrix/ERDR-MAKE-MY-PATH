import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NetworkRequestService} from '../../../../../../services/network-request.service';
import {MiscellaneousService} from '../../../../../../services/miscellaneous.service';

@Component({
  selector: 'app-mock-report-list',
  templateUrl: './mock-report-list.component.html',
  styleUrls: ['./mock-report-list.component.scss']
})
export class MockReportListComponent implements OnInit {

  constructor(
    private router: Router,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService
  ) {
  }

  attemptNo = '0';
  allPackages: any = [];


  getAllPackages() {
    this.misc.showLoader();
    this.networkRequest.getWithHeaders('/api/userenrolledpackages/').subscribe(
      data => {

        // If Packages exits
        if (data['enrolledpackages']) {
          this.allPackages = data['enrolledpackages'].filter((pkg, index) => {

            // Set Report status for individual mock paper
            // pkg['packagedetails']['mockpaper'].forEach(paper => {
            //   this.setReportStatus(paper, pkg);
            // });

            // Return packages that have mock paper and also attempted as well
            return pkg['packagedetails']['mockpaper'].length !== 0 && pkg['packagedetails']['attempt_status'];
          });
        }

        this.misc.hideLoader();
      },
      error => {
        this.misc.hideLoader();
      }
    );
  }


  // setReportStatus(paper, pkg) {
  //
  //   if (paper['attempt_status']) {
  //     pkg['report_available_status'] = true;
  //   }
  // }


  getAttempts(attemptOrder) {
    const attemptList = [];
    for (let i = 1; i <= attemptOrder; i++) {
      attemptList.push(i);
    }
    return attemptList;
  }


  viewReport(testid) {
    if (Number(this.attemptNo) > 0) {
      this.router.navigateByUrl(`/assessment/dashboard/report/test-report/mock/${testid}/${this.attemptNo}`);
    }
  }


  setAttemptOrder($event: Event) {
    this.attemptNo = $event ? event.target['value'] : 0;
  }

  ngOnInit() {
    this.getAllPackages();
  }
}
