import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-choose-subjects-chapters',
  templateUrl: './choose-subjects-chapters.component.html',
  styleUrls: ['./choose-subjects-chapters.component.scss']
})
export class ChooseSubjectsChaptersComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService
  ) { }

  examId;
  pathQuestions;
  examDetails;
  domainId;
  subjects;
  chapters;
  selectedSubjectId;

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
  }

  getChapters(id) {
    this.selectedSubjectId = id;
    this.networkRequest.getWithHeaders(`/api/chapter/?subject=${this.selectedSubjectId}`)
      .subscribe(
        data => {
          console.log("chapters ", data);
          this.chapters = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  getSubjects() {
    this.networkRequest.getWithHeaders(`/api/subject/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("subjects ", data);
          this.subjects = data;
          this.selectedSubjectId = this.subjects[0]['id'];
          this.getChapters(this.selectedSubjectId);
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
                this.getSubjects();
              }
            }
          );
        }
        else {
          this.examId = data;
          this.getExamDetails();
          this.getSubjects();
        }
    });
  }

}
