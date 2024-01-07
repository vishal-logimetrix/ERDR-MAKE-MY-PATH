import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/core/services/login.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-choose-p',
  templateUrl: './choose-p.component.html',
  styleUrls: ['./choose-p.component.scss']
})
export class ChoosePComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private permissions: PermissionsService,
    private login: LoginService
  ) { }

  examId;
  examDetails;
  totalusers;
  submitStatus: boolean = false;
  abcd:boolean = true;
  efgh:boolean = false;
  mockParameterFound: boolean = false;
  domains;
  isAuthenticated = this.permissions.isauthenticated();
  currentNode;

  generateMockPaper() {
    this.submitStatus = true;
    // this.misc.showLoader('short');
    this.abcd=false;
    this.efgh=true;
    const formData = {
      exam: this.examId
    }

    this.networkRequest.putWithHeaders(formData, `/api/generatemockpaper/`)
    .subscribe(
      data => {
        this.submitStatus = false;
        console.log("mock paper generated ", data);
        // this.misc.hideLoader();

        this.courseswitchservice.updateReloadPageStatus(true);
      
        this.router.navigate([`/assessment/paper/test-instructions/${this.examId}`],{
          queryParams: {
            paper: data['id']
          }
        });
      },
      error => {
        this.submitStatus = false;
        console.log("error in learner exam linking", error);
        if (error['error']['message']) {
          this.toastr.error(error['error']['message'], 'Error!', {
            timeOut: 4000,
          });
        }
        else if (error['error']) {
          this.toastr.error(error['error'], 'Error!', {
            timeOut: 4000,
          });
        }
        else {
          this.toastr.error('Some error occured!', 'Error!', {
            timeOut: 4000,
          });
        }
        this.abcd=true;
        this.efgh=false;
      }
    );
  }

  getExamDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          this.examDetails = data;
        },
        error => {
          console.log("error ", error);
        }
      );
      this.networkRequest.getWithHeaders(`/api/examuserscount/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("total users ", data);
          this.totalusers = data['totalusers'];
        },
        error => {
          console.log("error ", error);
        }
      );
      this.networkRequest.getWithHeaders(`/api/viewmockpaperdetails/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("exam mock parameter details ", data);
          if (data[0]) {
            this.mockParameterFound = true;
          }
        },
        error => {
        });

        this.networkRequest.getWithHeaders(`/api/domainforexams/?exam_id=${this.examId}`)
        .subscribe(
          data => {
            console.log("filtered domains ", data);
            // Populate Selected Assessment list with server data
            this.domains = data;
            this.getLastExamNode(this.domains[0]['id']);
          },
          error => {
            console.log("error ", error);
          }
        );
  }

  getLastExamNode(id) {
    this.networkRequest.getWithHeaders(`/api/lastexamdomainnode/?domain_id=${id}&exam_id=${this.examId}`)
    .subscribe(
      data => {
        console.log("last node ", data);
        this.currentNode = data[0];
        this.currentNode['successive_nodes'].sort((a, b) => a.text.localeCompare(b.text));
      },
      error => {
      });
  }

  selectCourse(id) {
    this.courseswitchservice.updateCourseId(id);
  }

  ngOnInit(): void {

    this.route.params.subscribe(
      data1 => {
        if (data1['exam']) {
          this.courseswitchservice.updateExamId(data1['exam']);
          this.examId = data1['exam'];
          this.getExamDetails();
        }
      }
    );
    // this.courseswitchservice.examIdStatus.subscribe(
    //   data => {
    //     if (!data) {
    //       this.route.params.subscribe(
    //         data1 => {
    //           if (data1['exam']) {
    //             this.courseswitchservice.updateExamId(data1['exam']);
    //             this.examId = data1['exam'];
    //             this.getExamDetails();
    //           }
    //         }
    //       );
    //     }
    //     else {
    //       this.examId = data;
    //       this.getExamDetails();
    //     }
    // });
    if (!this.permissions.isauthenticated()) {
      this.login.setLoginRedirect(`/assessment/dashboard/choose-p/`+ this.examId);
      this.login.loginRedirectUrl = `/assessment/dashboard/choose-p/`+ this.examId
      console.log("loginredirecturl ", this.login.loginRedirectUrl);
      // this.router.navigateByUrl(`/`);
    }
  }

}
