import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-view-self-assess-ques',
  templateUrl: './view-self-assess-ques.component.html',
  styleUrls: ['./view-self-assess-ques.component.scss']
})
export class ViewSelfAssessQuesComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  examId;
  pathQuestions;
  examDetails;

  deleteQuestion(id) {
    var confirmation = confirm("Are you sure you want to delete this question?");
    if (confirmation){
      this.networkRequest.delete(`/api/selfassessexamquestion/${id}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getQuestions();
        },
        error => {
          console.log("error ", error);
        }
      );
    }
  }

  getQuestions() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
    .subscribe(
      data => {
        console.log("exam details ", data);
        this.examDetails = data;
      },
      error => {
      });
    this.networkRequest.getWithHeaders(`/api/selfassessexamquestion/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("questions ", data);
          this.pathQuestions = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getQuestions();
        }
    });
  }

}
