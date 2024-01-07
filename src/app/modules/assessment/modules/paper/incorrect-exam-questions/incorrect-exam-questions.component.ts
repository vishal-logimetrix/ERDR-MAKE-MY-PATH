import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-incorrect-exam-questions',
  templateUrl: './incorrect-exam-questions.component.html',
  styleUrls: ['./incorrect-exam-questions.component.scss']
})
export class IncorrectExamQuestionsComponent implements OnInit {

  @ViewChild('mathjax', { static: false }) mathjax: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private misc: MiscellaneousService
  ) { }

  question;
  questionIds = [];
  options = ['Account', 'Amount', 'Name', 'Signature'];
  currentQuestion = 1;
  totalQuestions = 10;
  div2:boolean = false;
  domainId;
  examId;
  examDetails;
  quesString;
  selectedQuesId;
  questionDetails;
  mcqDetails;
  solutionDetails;
  paperId;
  questions;
  paperDetails;
  booleanDetails;
  fillUpDetails;
  fillUpOptionDetails;
  tag;
  questionData;
  selectedQuestion;
  correctFillUpOption;

  convertBoolean(stringVal) {
    return stringVal.toLowerCase() == 'true';
  }

  div2Function(){
    this.div2 = true;
  }
  closeSolution(){
    this.div2 = false;
  }

  fetchPrev() {
    for (let i = 0; i < this.questionIds.length; i++) {
      if (this.selectedQuesId == this.questionIds[i]) {
        if (i != 0) {
          this.currentQuestion = i;
          this.fetchQuestionDetails(this.questionIds[i-1], i-1);
          return;
        }
        else {
          return;
        }
      }
    }
  }

  fetchNext() {
    for (let i = 0; i < this.questionIds.length; i++) {
      if (this.selectedQuesId == this.questionIds[i]) {
        if (i == this.questionIds.length - 1) {
          alert("That's all!");
          return;
        }
        else {
          this.currentQuestion = i + 2;
          this.fetchQuestionDetails(this.questionIds[i+1], i+1);
          return;
        }
      }
    }
  }

  fetchQuestionDetails(id, iteration) {
    this.questionDetails = null;
    this.selectedQuesId = id;
    let contentId;
    this.mcqDetails = null;
    this.booleanDetails = null;
    this.fillUpDetails = null;
    this.fillUpOptionDetails = null;
    this.selectedQuestion = this.questions[iteration];
    
    this.networkRequest.getWithHeaders(`/api/question/${this.selectedQuesId}/`)
    .subscribe(
      data => {
        console.log("question details ", data);
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
        if (this.questionDetails['type_of_question'] == 'boolean') {
         
          this.networkRequest.getWithHeaders(`/api/booleansolution/?content=${contentId}`)
          .subscribe(
            data => {
              console.log("booleansolution true/ false ", data);
              this.booleanDetails = data[0];
            },
            error => {
            });
        }
        if (this.questionDetails['type_of_question'] == 'fillup') {
         
          this.networkRequest.getWithHeaders(`/api/fillupsolution/?content=${contentId}`)
          .subscribe(
            data => {
              console.log("fillupsolution ", data);
              this.fillUpDetails = data[0];
            },
            error => {
            });
        }
        if (this.questionDetails['type_of_question'] == 'fillup_option') {
         
          this.networkRequest.getWithHeaders(`/api/fillwithoption/?content=${contentId}`)
          .subscribe(
            data => {
              console.log("fillwithoption ", data);
              this.fillUpOptionDetails = data;
              for (let i = 0; i < this.fillUpOptionDetails.length; i++) {
                if (this.fillUpOptionDetails[i]['correct']) {
                  this.correctFillUpOption = this.fillUpOptionDetails[i]['text'];
                }
              }
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
    this.fetchQuestionDetails(this.questionIds[0], 0);
  }

  getPaperDetails() {
    this.misc.showLoader();
    this.networkRequest.getWithHeaders(`/api/learnerpapers/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
      },
      error => {
      });
      this.networkRequest.getWithHeaders(`/api/assessmentpaper_report/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("report details ", data);
        this.misc.hideLoader();
        this.questions = data['report_data']['incorrect_questions'];
        for (let i = 0; i < this.questions.length; i++) {
          this.questionIds.push(this.questions[i]['id']);
          if (i == this.questions.length - 1) {
            this.fetchQuestionDetails(this.questionIds[0], 0);
          }
        }
        if (this.questions.length  == 0) {
          this.currentQuestion = 0;
          // this.toastr.error('No Questions Found in Incorrect Question Solution!', 'Error!', {
          //   timeOut: 4000,
          // });
          // return;
        }
        console.log("questionIds", this.questionIds);
        
      },
      error => {
      });
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
              }
            }
          );
        }
        else {
          this.examId = data;
          this.getExamDetails();
        }
    });

    // this.courseswitchservice.questionIds.subscribe(
    //   data => {
    //     this.questionIds = data;
    //     console.log("questionids", this.questionIds);
    // });

    this.route.queryParams.subscribe(
      params => {
        this.paperId = params.paper;
        if (this.paperId) {
          this.getPaperDetails();
        }
    });
  }


}
