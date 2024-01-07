import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeeplinkService } from 'src/app/modules/assessment/services/deeplink.service';
import { AuthService } from 'src/app/services/auth.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-organization-nav',
  templateUrl: './organization-nav.component.html',
  styleUrls: ['./organization-nav.component.scss']
})
export class OrganizationNavComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private toastr: ToastrService,
    private batchservice: BatchServiceService,
    private misc: MiscellaneousService,
    private deeplinkService : DeeplinkService
  ) { }

  examId;
  batchId;
  examDetail;
  batchDetail;
  userProfile;

  logout() {
    this.auth.logout();
  }

  shareApp() {
    this.deeplinkService.deeplink();
  }

  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
      }
    );
  }


  ngOnInit() {
    this.getUserProfile();
    this.misc.userProfileChange.subscribe(
      data => {
        this.getUserProfile();
      }
    );
    
    this.batchservice.batchIdStatus.subscribe(
      data => {
        this.batchId = data;
        if (this.batchId) {
          this.networkRequest.getWithHeaders(`/api/batch/${this.batchId}/`)
          .subscribe(
            data2 => {
              this.batchDetail = data2;
            },
            error => {
            });
        }
        
    });

    this.batchservice.examIdStatus.subscribe(
      data1 => {
        this.examId = data1;
        if (this.examId) {
          this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
          .subscribe(
            data => {
              this.examDetail = data;
            },
            error => {
            });
        }
        
    });
  }

}
