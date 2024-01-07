import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss']
})
export class ViewQuestionComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  mcqType: boolean = false;
  mccType: boolean = false;
  fillUpType: boolean = false;
  questionId;
  questionDetails;
  fillupDetails;
  mcqDetails;
  solutionDetails;

  getQuestionDetails() {
    this.networkRequest.getWithHeaders(`/api/question/${this.questionId}/`)
    .subscribe(
      data => {
        console.log("question details ", data);
        this.questionDetails = data;
        this.networkRequest.getWithHeaders(`/api/solution/?content=${this.questionDetails['contents'][0]['id']}`)
        .subscribe(
          data => {
            console.log("solution details ", data);
            this.solutionDetails = data[0];
          },
          error => {
          });
        if (this.questionDetails['type_of_question'] == 'mcc' || this.questionDetails['type_of_question'] == 'mcq') {
          if (this.questionDetails['type_of_question'] == 'mcc') {
            this.mccType = true;
          }
          if (this.questionDetails['type_of_question'] == 'mcq') {
            this.mcqType = true;
          }
          this.networkRequest.getWithHeaders(`/api/mcqtestcase/?content=${this.questionDetails['contents'][0]['id']}`)
          .subscribe(
            data => {
              console.log("mcq test cases ", data);
              this.mcqDetails = data;
              
            },
            error => {
            });
        }
        if (this.questionDetails['type_of_question'] == 'fillup') {
          this.fillUpType = true;
          this.networkRequest.getWithHeaders(`/api/fillupsolution/?content=${this.questionDetails['contents'][0]['id']}`)
          .subscribe(
            data => {
              console.log("fillup details ", data);
              this.fillupDetails = data[0];
            },
            error => {
            });
        }
        
      },
      error => {
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.questionId = params.id;
        if (this.questionId) {
          this.getQuestionDetails();
        }
    });
  }

}
