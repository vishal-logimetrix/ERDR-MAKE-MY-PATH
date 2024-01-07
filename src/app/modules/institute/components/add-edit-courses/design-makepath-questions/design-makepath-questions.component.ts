import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-design-makepath-questions',
  templateUrl: './design-makepath-questions.component.html',
  styleUrls: ['./design-makepath-questions.component.scss']
})
export class DesignMakepathQuestionsComponent implements OnInit {

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

  deletePathQuestion(id) {
    var confirmation = confirm("Are you sure you want to delete this path question?");
    if (confirmation){
      this.networkRequest.delete(`/api/exampathquestion/${id}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getExamMakePathQuestions();
        },
        error => {
          console.log("error ", error);
        }
      );
    }
  }

  getExamMakePathQuestions() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
    .subscribe(
      data => {
        console.log("exam details ", data);
        this.examDetails = data;
      },
      error => {
      });
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getExamMakePathQuestions();
        }
    });
  }

}
