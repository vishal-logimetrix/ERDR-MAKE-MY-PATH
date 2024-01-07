import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';
import { environment } from 'src/environments/environment';

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
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private batchservice: BatchServiceService
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
  batchId;
  batchDetails;

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
    this.router.navigateByUrl(`/organization/bookmark-detail/${this.selectedExamId}/${this.selectedSubjectId}/${this.selectedChapterId}/${this.batchId}`);
  }

  getMyExams() {
    this.networkRequest.getWithHeaders(`/api/mentorexam/`)
    .subscribe(
      data => {
        console.log("mentorexam exams ", data);
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
    this.networkRequest.getWithHeaders(`/api/getmentorexamsubjects/?mentorexam=${id}`)
      .subscribe(
        data => {
          console.log("subjects ", data);
          this.subjects = data;
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
          console.log("error ", error);
        }
      );
  }

  getChapters(id) {
    this.selectedSubjectId = id;
    
    this.networkRequest.getWithHeaders(`/api/getmentorexamchapters/?subject=${this.selectedSubjectId}&mentorexam=${this.selectedExamId}`)
    .subscribe(
      data => {
        console.log("mentor exam chapters ", data);
        this.chapters = data;
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getBatchDetails() {
    this.networkRequest.getWithHeaders(`/api/batch/${this.batchId}/`)
      .subscribe(
        data => {
          console.log("batch details ", data);
          this.batchDetails = data;
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
          this.isExamBookMark = true;
          this.getMyExams();
        }
        else {
          this.isExamBookMark = false;
          this.getMyExams();
        }
    });
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
        }
      }
    );
  }

}
