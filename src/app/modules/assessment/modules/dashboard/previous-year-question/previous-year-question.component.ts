import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-previous-year-question',
  templateUrl: './previous-year-question.component.html',
  styleUrls: ['./previous-year-question.component.scss']
})
export class PreviousYearQuestionComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private courseswitchservice: CourseSwitchService,
    private route: ActivatedRoute
  ) { }

  examId;
  examDetails;
  papers;
  totalusers;
  spinner:boolean = true;

  fetchPreviousPapers() {
    this.networkRequest.getWithHeaders(`/api/viewexampreviouspaper/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("papers ", data);
          this.papers = data;
          this.spinner = false;
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
                this.fetchPreviousPapers();
              }
            }
          );
        }
        else {
          this.examId = data;
          this.getExamDetails();
          this.fetchPreviousPapers();
        }
    });
  }

}
