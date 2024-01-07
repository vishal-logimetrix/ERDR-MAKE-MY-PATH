import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  constructor(
    private router: Router,
    private networkRequest: NetworkRequestService,
    private auth: AuthService,
    private misc: MiscellaneousService,
    private courseswitchservice: CourseSwitchService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  myExams;
  selectedExamId;
  selectedSubjectId;
  selectedSubjectName;
  selectedChapterId;
  subjects;
  chapters;
  totalusers;
  examId;
  isExamBookMark: boolean = false;
  actualExamId;
  examName;
  examDetails;
  totalNumberOfBookmarks:number = 0;
  spinner:boolean = true;

  selectExam(examId) {
    this.selectedExamId = examId;
    for (let i = 0; i < this.myExams.length; i++) {
      if (this.myExams[i]['id'] == this.selectedExamId) {
        this.getSubjects(this.myExams[i]['id']);
      }
    }
    
  }

  selectSubject(subjectId, name) {
    this.selectedSubjectId = subjectId;
    this.selectedSubjectName = name;
    this.getChapters(this.selectedSubjectId);
  }

  selectChapter(chapterId) {
    this.selectedChapterId= chapterId;
    this.router.navigateByUrl(`/assessment/dashboard/bookmark-detail/${this.selectedExamId}/${this.selectedSubjectId}/${this.selectedChapterId}`);
  }

  getMyExams() {
    this.networkRequest.getWithHeaders(`/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exams ", data);
        this.myExams = data;
        if (!this.isExamBookMark) {
          if (this.myExams.length > 0) {
            this.selectedExamId = this.myExams[0]['id'];
            this.getSubjects(this.selectedExamId);
          }
        }
        else {
          for (let i = 0; i < this.myExams.length; i++) {
            if (this.myExams[i]['exam']['id'] == this.actualExamId) {
              this.selectedExamId = this.myExams[i]['id'];
              this.examName = this.myExams[i]['exam']['title'];
              this.getSubjects(this.selectedExamId);
            }
            else {
              setTimeout(() => {
                this.spinner = false;
              }, 1100);
            }
          }
        }
        
      },
      error => {
        console.log("error", error);
      }
    );
    this.networkRequest.getWithHeaders(`/api/examuserscount/?exam=${this.actualExamId}`)
    .subscribe(
      data => {
        console.log("total users ", data);
        this.totalusers = data['totalusers'];
      },
      error => {
        console.log("error ", error);
      }
    );
    this.networkRequest.getWithHeaders(`/api/courses/${this.actualExamId}/`)
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

  getSubjects(id) {
    this.networkRequest.getWithHeaders(`/api/getlearnerexamsubjects/?learnerexam=${id}`)
      .subscribe(
        data => {
          console.log("subjects ", data);
          this.subjects = data;
          this.spinner = false;
          this.selectedSubjectId = this.subjects[0]['subject']['id'];
          this.selectedSubjectName = this.subjects[0]['subject']['title'];
          this.getChapters(this.selectedSubjectId);
          for (var index in this.subjects) {
            console.log(index);
            this.totalNumberOfBookmarks = this.totalNumberOfBookmarks + this.subjects[index]['total_bookmarks'];
           console.log(this.totalNumberOfBookmarks);
          }
        },
        error => {
          this.spinner = false;
          console.log("error ", error);
        }
      );
  }

  getChapters(id) {
    this.selectedSubjectId = id;
    
    this.networkRequest.getWithHeaders(`/api/getlearnerexamchapters/?subject=${this.selectedSubjectId}&learnerexam=${this.selectedExamId}`)
    .subscribe(
      data => {
        console.log("learner exam chapters ", data);
        this.chapters = data;
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.actualExamId = params.exam;
        if (this.actualExamId) {
          this.courseswitchservice.updateExamId(this.actualExamId);
          this.isExamBookMark = true;
          this.getMyExams();
        }
        else {
          this.isExamBookMark = false;
          this.getMyExams();
        }
    });
  }

}
