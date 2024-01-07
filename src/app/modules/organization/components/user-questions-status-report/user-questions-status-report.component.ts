import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-user-questions-status-report',
  templateUrl: './user-questions-status-report.component.html',
  styleUrls: ['./user-questions-status-report.component.scss']
})
export class UserQuestionsStatusReportComponent implements OnInit {

  @ViewChild('mathjax', { static: false }) mathjax: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: BatchServiceService,
    private misc: MiscellaneousService
  ) { }

  env = environment;
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
  username;
  topperAndMyData;
  remarks;
  answerPaperId;
  all_questions = [];
  incorrect_questions;
  correct_questions;
  skipped_questions;
  subjectiveAnswer;
  attemptDate;
  selectedImgId;
  studentName;

  div2Function(){
    this.div2 = true;
  }
  closeSolution(){
    this.div2 = false;
  }

  enlargeImage(id) {
    this.selectedImgId = id;
  }

  showAllQuestions() {
    this.questionDetails = null;
    this.solutionDetails = null;
    this.questionIds = this.all_questions;
    this.currentQuestion = 1;
    if (this.questionIds.length  == 0) {
      this.currentQuestion = 0;
    }
    else {
      this.fetchQuestionDetails(this.questionIds[0], 0);
    }
  }

  showCorrectQuestions() {
    this.questionDetails = null;
    this.solutionDetails = null;
    this.questionIds = this.correct_questions;
    this.currentQuestion = 1;
    if (this.questionIds.length  == 0) {
      this.currentQuestion = 0;
    }
    else {
      this.fetchQuestionDetails(this.questionIds[0], 0);
    }
  }

  showInCorrectQuestions() {
    this.questionDetails = null;
    this.solutionDetails = null;
    this.questionIds = this.incorrect_questions;
    this.currentQuestion = 1;
    if (this.questionIds.length  == 0) {
      this.currentQuestion = 0;
    }
    else {
      this.fetchQuestionDetails(this.questionIds[0], 0);
    }
  }

  showSkippedCorrectQuestions() {
    this.questionDetails = null;
    this.solutionDetails = null;
    this.questionIds = this.skipped_questions;
    this.currentQuestion = 1;
    if (this.questionIds.length  == 0) {
      this.currentQuestion = 0;
    }
    else {
      this.fetchQuestionDetails(this.questionIds[0], 0);
    }
  }

  fetchPrev() {
    for (let i = 0; i < this.questionIds.length; i++) {
      if (this.selectedQuesId == this.questionIds[i]) {
        this.div2 = false;
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
          this.div2 = false ;
          this.currentQuestion = i + 2;
          this.fetchQuestionDetails(this.questionIds[i+1], i+1);
          return;
        }
      }
    }
  }

  fetchQuestionDetails(id, iteration) {
    this.questionDetails = null;
    this.subjectiveAnswer = null;
    this.selectedQuesId = id;
    let contentId;
    this.mcqDetails = null;
    this.booleanDetails = null;
    this.fillUpDetails = null;
    this.fillUpOptionDetails = null;
    // this.selectedQuestion = this.questions[iteration];
    var selectQuesIndex;
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i]['id'] == id) {
        selectQuesIndex = i;
        this.selectedQuestion = this.questions[selectQuesIndex];
      }
    }
    
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
        if (this.questionDetails['type_of_question'] == 'mcc' || this.questionDetails['type_of_question'] == 'mcq' || this.questionDetails['type_of_question'] == 'assertion') {
    
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
        if (this.questionDetails['type_of_question'] == 'subjective') {
         
          this.networkRequest.getWithHeaders(`/api/fetchuseranswerfrommentorpaper/?paper=${this.paperId}&question=${this.selectedQuesId}&user=${this.username}`)
          .subscribe(
            data => {
              console.log("subjective answer ", data);
              //@ts-ignore
              if (data.length > 0) {
                this.subjectiveAnswer = data[0];
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

  updateRemarks() {
    const formData = {
      paper: this.answerPaperId,
      remarks: this.remarks
    }
    this.networkRequest.putWithHeaders(formData,`/api/updateremarks/`)
      .subscribe(
        data => {
          console.log("remarks updated ", data);
          this.remarks = data['remarks'];
          this.toastr.success('Remarks updated successfully!', 'Updated!', {
            timeOut: 4000,
          });
        },
        error => {
        });
  }

  getPaperDetails() {
    this.networkRequest.getWithHeaders(`/api/mentorpapers/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
      },
      error => {
      });
      this.networkRequest.getWithHeaders(`/api/mentorpaper_questions_answers/${this.paperId}/?user=${this.username}`).subscribe(
        data => {
          console.log("assessmentpaper_questions_answers", data);
          this.attemptDate = data['attemp_date'];
          this.questions = data['questions'];
          this.questionData = data['question_data'];
          this.remarks = data['remarks'];
          this.answerPaperId = data['answer_paper'];
          for (let i = 0; i < this.questions.length; i++) {
            this.questionIds.push(this.questions[i]['id']);
            this.all_questions.push(this.questions[i]['id']);
            if (i == this.questions.length - 1) {
              this.fetchQuestionDetails(this.questionIds[0], 0);
              this.questionIds = this.all_questions;
            }
            // console.log("questionIds", this.questionIds);
          }
          if (this.questions.length  == 0) {
            this.currentQuestion = 0;
          }
          this.misc.hideLoader();
        },
        error => {
          this.misc.hideLoader();
        }
      );
      this.networkRequest.getWithHeaders(`/api/mentorpaper_student_stats/${this.paperId}/?user=${this.username}`)
      .subscribe(
        data => {
          console.log("topper details ", data);
          this.topperAndMyData = data;
        },
        error => {
        });
        this.networkRequest.getWithHeaders(`/api/mentorassessmentpaper_report/${this.paperId}/?user=${this.username}`)
        .subscribe(
          data => {
            console.log("report details ", data);
            this.incorrect_questions = data['report_data']['incorrect_question_ids'];
            this.correct_questions = data['report_data']['correct_question_ids'];
            this.skipped_questions = data['report_data']['skipped_question_ids'];
            this.studentName = data['report_data']['full_name'];
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

    this.route.params.subscribe(
      data1 => {
        if (data1['user']) {
          this.username = data1['user'];
          this.route.queryParams.subscribe(
            params => {
              this.paperId = params.paper;
              if (this.paperId) {
                this.getPaperDetails();
              }
          });
        }
      }
    );

    // this.courseswitchservice.questionIds.subscribe(
    //   data => {
    //     this.questionIds = data;
    //     console.log("questionids", this.questionIds);
    // });
    // this.showAllQuestions();    
  }


}
