import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NetworkRequestService } from 'src/app/services/network-request.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { PaymentService } from 'src/app/services/payment.service';

import { environment } from 'src/environments/environment';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';


@Component({
  selector: 'app-my-assessment',
  templateUrl: './my-assessment.component.html',
  styleUrls: ['./my-assessment.component.scss']
})
export class MyAssessmentComponent implements OnInit {

  constructor(
    private router: Router,
    private networkRequest: NetworkRequestService,
    private share: DataSharingService,
    private misc: MiscellaneousService
  ) {
  }

  env = environment;

  myPackages = [];
  myPackagesAvailable = true;


  getMyPackages() {

    /**
     * Get My Packages
     */
    this.misc.showLoader();
    this.networkRequest.getWithHeaders('/api/userenrolledpackages/').subscribe(
      data => {

        this.myPackages = data['enrolledpackages'];

        if (this.myPackages.length === 0) {
          this.myPackagesAvailable = false;
        }

        this.misc.hideLoader();
      },
      error => {
        this.myPackagesAvailable = false;
        this.misc.hideLoader();
      }
    );
  }


  viewPackage(packageId) {
    this.router.navigateByUrl(`/view-package/${packageId}`)
  }


  showTests(pkgId) {
    this.router.navigateByUrl(`/assessment/dashboard/test-list/${pkgId}`);
  }


  ngOnInit() {
    this.getMyPackages();
  }

}
