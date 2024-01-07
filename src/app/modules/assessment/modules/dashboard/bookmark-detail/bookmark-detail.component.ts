import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-bookmark-detail',
  templateUrl: './bookmark-detail.component.html',
  styleUrls: ['./bookmark-detail.component.scss']
})
export class BookmarkDetailComponent implements OnInit {

  @ViewChild('mathjax', { static: false }) mathjax: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private misc: MiscellaneousService,
    private scroller: ViewportScroller
  ) { }

  question;
  questions;
  questionIds = [];
  options = ['Account', 'Amount', 'Name', 'Signature'];
  currentQuestion = 1;
  totalQuestions = 0;
  div2:boolean = false;
  examId;
  subjectId;
  chapterId;
  examDetails;
  quesString;
  selectedQuesId;
  questionDetails;
  mcqDetails;
  solutionDetails;
  paperId;
  paperDetails;
  subjectName;
  chapterName;
  bookmarks;

  div2Function(){
    this.div2 = true;
  }
  closeSolution(){
    this.div2 = false;
  }

  goDown(){
    this.scroller.scrollToAnchor("soltuionDiv");
  }

  unmark() {
    // var confirmation = confirm("Are you sure you want to unmark this question?");
    // if (confirmation) {
      for (let i = 0; i < this.bookmarks.length; i++) {
        if (this.questionDetails['id'] == this.bookmarks[i]['question']['id']) {
          this.networkRequest.delete(`/api/deletebookmark/${this.bookmarks[i]['id']}/`)
          .subscribe(
            data => {
              this.toastr.success('Unmarked successfully!', 'Done!', {
                timeOut: 4000,
              });
              document.getElementById("dimissModal").click();
              this.getBookmarks();
            },
            error => {
              console.log("error ", error);
              this.toastr.error(error['error']['message'], 'Error!', {
                timeOut: 4000,
              });
            }
          );
        }
      }
    // }
  }

  fetchPrev() {
    this.div2 = false;
    for (let i = 0; i < this.questionIds.length; i++) {
      if (this.selectedQuesId == this.questionIds[i]) {
        if (i != 0) {
          this.currentQuestion = i;
          this.fetchQuestionDetails(this.questionIds[i-1]);
          return;
        }
        else {
          return;
        }
      }
    }
  }

  fetchNext() {
    this.div2 = false;
    for (let i = 0; i < this.questionIds.length; i++) {
      if (this.selectedQuesId == this.questionIds[i]) {
        if (i == this.questionIds.length - 1) {
          alert("exam over!");
          return;
        }
        else {
          this.currentQuestion = i + 2;
          this.fetchQuestionDetails(this.questionIds[i+1]);
          return;
        }
      }
    }
  }

  fetchQuestionDetails(id) {
    this.selectedQuesId = id;
    let contentId;
    this.questionDetails = null;
    this.solutionDetails = null;
    this.mcqDetails = null;
    
    this.networkRequest.getWithHeaders(`/api/question/${this.selectedQuesId}/`)
    .subscribe(
      data => {
        console.log("question details ", data);
        this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
        this.questionDetails = data;
        for (let i = 0; i < this.questionDetails['contents'].length; i++) {
          if (this.questionDetails['contents'][i]['language']['text'] == 'English') {
            contentId = this.questionDetails['contents'][i]['id'];
          }
        }
        this.networkRequest.getWithHeaders(`/api/solution/?content=${contentId}`)
        .subscribe(
          data => {
            console.log("solution details ", data);
            this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
            this.solutionDetails = data[0];
          },
          error => {
          });
        if (this.questionDetails['type_of_question'] == 'mcc' || this.questionDetails['type_of_question'] == 'mcq') {
         
          this.networkRequest.getWithHeaders(`/api/mcqtestcase/?content=${contentId}`)
          .subscribe(
            data => {
              console.log("mcq test cases ", data);
              this.mcqDetails = data;
              
            },
            error => {
            });
        }
      },
      error => {
      });
  }

  getQuestionIds() {
    this.questionIds = this.quesString.split(',');
    console.log("quesidss", this.questionIds);
    this.fetchQuestionDetails(this.questionIds[0]);
  }

  getExamDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          // Intialize MathJax
          this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
          this.examDetails = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }


  getBookmarks() {
    this.questionIds = [];
    console.log("exam subject chapter ids", this.examId, this.subjectId, this.chapterId);
    this.networkRequest.getWithHeaders(`/api/getbookmarks/?exam=${this.examId}&subject=${this.subjectId}&chapter=${this.chapterId}`)
      .subscribe(
        data => {
          console.log("bookmarks ", data);
          // Intialize MathJax
          this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
          this.bookmarks = data;
          if (this.bookmarks.length > 0) {
            this.subjectName = this.bookmarks[0]['subject']['title'];
            this.chapterName = this.bookmarks[0]['chapter']['title'];
            for (let i = 0; i < this.bookmarks.length; i++) {
              this.questionIds.push(this.bookmarks[i]['question']['id']);
              if (i == this.bookmarks.length - 1) {
                this.questionIds = [...new Set(this.questionIds.map(m => m))];
                console.log("quesids", this.questionIds);
                this.fetchQuestionDetails(this.questionIds[0]);
              }
            }
          }
          
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
          // this.courseswitchservice.updateExamId(data1['exam']);
          this.examId = data1['exam'];
        }
        if (data1['subject']) {
          this.subjectId = data1['subject'];
        }
        if (data1['chapter']) {
          this.chapterId = data1['chapter'];
          this.getBookmarks();
        }
      }
    );
  }

}
