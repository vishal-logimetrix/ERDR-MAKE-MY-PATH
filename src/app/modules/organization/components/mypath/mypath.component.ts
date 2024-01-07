import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

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
    private batchservice: BatchServiceService,
    private permissions: PermissionsService
  ) { }

  ppppFlag: boolean = true;
  examId;
  pathQuestions;
  examDetails;
  domainId;
  totalusers;
  batchId;
  isAuthenticated = this.permissions.isauthenticated();

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
    this.route.params.subscribe(
      data1 => {
        if (data1['exam']) {
          this.batchservice.updateExamId(data1['exam']);
          this.examId = data1['exam'];
          this.getExamDetails();
          this.getExamMakePathQuestions();
        }
      }
    );
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
        }
      }
    );
  }

}
