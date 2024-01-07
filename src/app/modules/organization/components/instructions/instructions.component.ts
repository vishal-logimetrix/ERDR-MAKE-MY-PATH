import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private courseswitchservice: BatchServiceService
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


  }

}
