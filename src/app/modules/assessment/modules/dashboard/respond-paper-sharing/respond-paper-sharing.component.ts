import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/core/services/login.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-respond-paper-sharing',
  templateUrl: './respond-paper-sharing.component.html',
  styleUrls: ['./respond-paper-sharing.component.scss']
})
export class RespondPaperSharingComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private courseswitchservice: CourseSwitchService,
    private misc: MiscellaneousService,
    private toastr: ToastrService,
    private permissions: PermissionsService,
    private login: LoginService,
    private router: Router
  ) {
  }

  testId: any;
  testType: any;
  attemptOrder: any;
  testObj: object = {};
  question: object;
  paperId;
  domainId;
  examId;
  userProfileObj: any;
  instructions;
  paperDetails;
  isAccepted: boolean = false;
  newlyCreatedPaperId;
  newpaperSubmitted: boolean = false;
  submitStatus: boolean = false;
  isAuthenticated = this.permissions.isauthenticated();

  acceptPaper() {
    this.submitStatus = true;
    const formData = {
      paper: this.paperId
    }
    this.networkRequest.putWithHeaders(formData, `/api/linklearnerpapers/`)
    .subscribe(
      data => {
        this.submitStatus = false;
        console.log("paper shared ", data);
        this.toastr.success('Paper Accepted!', 'Accepted!', {
          timeOut: 4000,
        });
        this.getTestInstructions();
      },
      error => {
        this.submitStatus = false;
        console.log("error ", error);
        this.toastr.error(error['error']['message'], 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  getTestInstructions() {
    this.networkRequest.getWithHeaders(`/api/paperinstructions/?paper=${this.paperId}`)
    .subscribe(
      data => {
        console.log("paper instructions ", data);
        this.instructions = data;
      },
      error => {
        console.log("error ", error);
      }
    );

    this.networkRequest.getWithHeaders(`/api/learnerpapers/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
      },
      error => {
      });
    this.networkRequest.getWithHeaders(`/api/checksharedpaperacceptance/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper accepted ", data);
        this.isAccepted = true;
        this.newlyCreatedPaperId = data['newly_created_paper'];
        this.newpaperSubmitted = data['newly_created_submitted'];
      },
      error => {
      });
  }

  ngOnInit() {
    this.courseswitchservice.examIdStatus.subscribe(
      data => {
        if (!data) {
          this.route.params.subscribe(
            data1 => {
              if (data1['exam']) {
                this.courseswitchservice.updateExamId(data1['exam']);
                this.examId = data1['exam'];
              }
            }
          );
        }
        else {
          this.examId = data;
        }
    });

    this.route.queryParams.subscribe(
      params => {
        this.paperId = params.paper;
        this.getTestInstructions();
      }
    );

    if (!this.permissions.isauthenticated()) {
      this.login.setLoginRedirect(`/assessment/dashboard/respond-paper-request/`+ this.examId + `?paper=`+this.paperId);
      this.login.loginRedirectUrl = `/assessment/dashboard/respond-paper-request/`+ this.examId + `?paper=`+this.paperId;
      console.log("loginredirecturl ", this.login.loginRedirectUrl);
      // this.router.navigateByUrl(`/`);
    }

    // Get User Profile
    this.misc.userProfile().subscribe(
      data => {
        this.userProfileObj = data;
      }
    );
  }


}
