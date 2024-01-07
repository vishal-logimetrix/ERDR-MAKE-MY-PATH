import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';

@Component({
  selector: 'app-mypath',
  templateUrl: './mypath.component.html',
  styleUrls: ['./mypath.component.scss']
})
export class MypathComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private permissions: PermissionsService
  ) { }

  ppppFlag: boolean = true;
  examId;
  pathQuestions;
  examDetails;
  domainId;
  totalusers;
  isAuthenticated = this.permissions.isauthenticated();

  sendNotificationRequest() {
    const formData = {
      exam: this.examId
    }
    this.networkRequest.postWithHeader(formData, `/api/examalertrequest/`)
      .subscribe(
        data => {
          console.log("request sent ", data);
          this.toastr.success('Notification Request Sent!', 'Done!', {
            timeOut: 4000,
          });
        },
        error => {
          console.log("error ", error);
          this.toastr.error(error['error']['errors'][0], 'Oops!', {
            timeOut: 4000,
          });
        }
      );
  }

  definePath() {
    this.ppppFlag = false;
  }

  getExamMakePathQuestions() {
    this.networkRequest.getWithHeaders(`/api/exampathquestion/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("path questions ", data);
          this.pathQuestions = data;
        },
        error => {
          console.log("error ", error);
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
  }

  ngOnInit(): void {
  

    this.courseswitchservice.examIdStatus.subscribe(
      data => {
        if (!data) {
          this.route.params.subscribe(
            data1 => {
              if (data1['exam']) {
                this.courseswitchservice.updateExamId(data1['exam']);
                this.examId = data1['exam'];
                this.getExamDetails();
              }
            }
          );
        }
        else {
          this.examId = data;
          this.getExamMakePathQuestions();
          this.getExamDetails();
        }
    });
  }

}
