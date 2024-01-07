import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';
import { CourseSwitchService } from '../../../services/course-switch.service';

@Component({
  selector: 'app-pre-goal-paper-solution',
  templateUrl: './pre-goal-paper-solution.component.html',
  styleUrls: ['./pre-goal-paper-solution.component.scss']
})
export class PreGoalPaperSolutionComponent implements OnInit {

  @ViewChild('mathjax', { static: false }) mathjax: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private misc: MiscellaneousService,
    private scroller: ViewportScroller,
    private router: Router
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
  subjectiveAnswer;
  selectedImgId;
  all_questions = [];
  incorrect_questions;
  correct_questions;
  skipped_questions;
  countArray = [];
  activeCard;
  tmpHide: boolean = false;
  noripple: boolean = false;
  ripple: boolean = true;
  linkedTypes;
  quesTypes = [];
  fetchedQuestions;
  sortedQuesIds = [];
  currentQuestionIndex;
  allQuesFlag: boolean = true;
  incorrectFlag: boolean = false;
  skippedFlag: boolean = false;

  div2Function(){
    this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
    this.div2 = true;
    this.scroller.scrollToAnchor("soltuionDiv");
    this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
  }
  goDown(){
    this.scroller.scrollToAnchor("soltuionDiv");
  }
  closeSolution(){
    this.div2 = false;
  }
  enlargeImage(id) {
    this.selectedImgId = id;
  }

  showAllQuestions() {
    this.allQuesFlag = true;
    this.questionIds = this.all_questions;
    this.currentQuestion = 1;
    this.tmpHide = true;
    setTimeout(() => {
      this.activeCard = this.currentQuestion;
      this.tmpHide = false;
    }, 100);
    if (this.questionIds.length  == 0) {
      this.countArray = [];
      this.currentQuestion = 0;
      setTimeout(() => {
        this.activeCard = this.currentQuestion;
        this.tmpHide = false;
      }, 100);
    }
    else {
      this.fetchQuestionDetails(this.questionIds[0], 0);
      this.countArray = [];
      if (this.questionIds.length <= 10) {
        for (let i = 0; i < this.questionIds.length; i++) {
          this.countArray[i] = i+1;
        }
      }
      else {
        for (let i = 0; i < 10; i++) {
          this.countArray[i] = i+1;
        }
      }
    }
  }

  showCorrectQuestions() {
    this.questionDetails = null;
    this.subjectiveAnswer = null;
    this.solutionDetails = null;
    this.mcqDetails = null;
    this.booleanDetails = null;
    this.fillUpDetails = null;
    this.fillUpOptionDetails = null;
    this.questionIds = this.correct_questions;
    this.currentQuestion = 1;
    this.tmpHide = true;
    setTimeout(() => {
      this.activeCard = this.currentQuestion;
      this.tmpHide = false;
    }, 100);
    if (this.questionIds.length  == 0) {
      this.countArray = [];
      this.currentQuestion = 0;
      this.div2 = false;
      this.tmpHide = true;
      setTimeout(() => {
        this.activeCard = this.currentQuestion;
        this.tmpHide = false;
      }, 100);
    }
    else {
      this.fetchQuestionDetails(this.questionIds[0], 0);
      this.countArray = [];
      if (this.questionIds.length <= 10) {
        for (let i = 0; i < this.questionIds.length; i++) {
          this.countArray[i] = i+1;
        }
      }
      else {
        for (let i = 0; i < 10; i++) {
          this.countArray[i] = i+1;
        }
      }
    }
  }

  showInCorrectQuestions() {
    this.incorrectFlag = true;
    this.allQuesFlag = false;
    this.skippedFlag = false;
    this.questionDetails = null;
    this.subjectiveAnswer = null;
    this.solutionDetails = null;
    this.mcqDetails = null;
    this.booleanDetails = null;
    this.fillUpDetails = null;
    this.fillUpOptionDetails = null;
    this.questionIds = this.incorrect_questions;
    this.currentQuestion = 1;
    this.tmpHide = true;
    setTimeout(() => {
      this.activeCard = this.currentQuestion;
      this.tmpHide = false;
    }, 100);
    if (this.questionIds.length  == 0) {
      this.countArray = [];
      this.currentQuestion = 0;
      this.div2 = false;
      this.tmpHide = true;
      setTimeout(() => {
        this.activeCard = this.currentQuestion;
        this.tmpHide = false;
      }, 100);
    }
    else {
      this.fetchQuestionDetails(this.questionIds[0], 0);
      this.countArray = [];
      if (this.questionIds.length <= 10) {
        for (let i = 0; i < this.questionIds.length; i++) {
          this.countArray[i] = i+1;
        }
      }
      else {
        for (let i = 0; i < 10; i++) {
          this.countArray[i] = i+1;
        }
      }
    }
  }

  showSkippedCorrectQuestions() {
    this.skippedFlag = true;
    this.allQuesFlag = false;
    this.incorrectFlag = false;
    this.questionDetails = null;
    this.subjectiveAnswer = null;
    this.solutionDetails = null;
    this.mcqDetails = null;
    this.booleanDetails = null;
    this.fillUpDetails = null;
    this.fillUpOptionDetails = null;
    this.questionIds = this.skipped_questions;
    this.currentQuestion = 1;
    this.tmpHide = true;
    setTimeout(() => {
      this.activeCard = this.currentQuestion;
      this.tmpHide = false;
    }, 100);
    if (this.questionIds.length == 0) {
      this.currentQuestion = 0;
      this.countArray = [];
      this.div2 = false;
      this.tmpHide = true;
      setTimeout(() => {
        this.activeCard = this.currentQuestion;
        this.tmpHide = false;
      }, 100);
    }
    else {
      this.fetchQuestionDetails(this.questionIds[0], 0);
      this.countArray = [];
      if (this.questionIds.length <= 10) {
        for (let i = 0; i < this.questionIds.length; i++) {
          this.countArray[i] = i+1;
        }
      }
      else {
        for (let i = 0; i < 10; i++) {
          this.countArray[i] = i+1;
        }
      }
    }
  }

  fetchPrev() {
    for (let i = 0; i < this.questionIds.length; i++) {
      if (this.selectedQuesId == this.questionIds[i]) {
        this.div2 = false;
        if (i != 0) {
          this.currentQuestion = i;
          this.tmpHide = true;
          setTimeout(() => {
            this.activeCard = this.currentQuestion;
            this.tmpHide = false;
          }, 100);
          this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
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
        this.div2 = false;
        if (i == this.questionIds.length - 1) {
          alert("That's all!");
          return;
        }
        else {
          this.currentQuestion = i + 2;
          this.tmpHide = true;
          setTimeout(() => {
            this.activeCard = this.currentQuestion;
            this.tmpHide = false;
          }, 100);
          this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
          this.fetchQuestionDetails(this.questionIds[i+1], i+1);
          return;
        }
      }
    }
  }

  scrollLeft() {
    if (this.countArray[0] <= 1) {
      return;
    }
    else {
      for (let i = 0; i < 10; i++) {
        this.countArray[i] -= 10;
      }
    }
  }

  scrollRight() {
    if (this.countArray.includes(null)) {
      return;
    }
    if (this.countArray[9] >= this.questionIds.length) {
      return;
    }
    else {
      for (let i = 0; i < 10; i++) {
        this.countArray[i] += 10;
        if (this.countArray[i] > this.questionIds.length) {
          delete(this.countArray[i]);
        }
      }
    }
  }

  fetchByCount(count) {
    this.tmpHide = true;
    setTimeout(() => {
      this.activeCard = count;
      this.tmpHide = false;
    }, 100);
    
    this.currentQuestion = count;
    this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
    this.fetchQuestionDetails(this.questionIds[count-1], count-1);
  }

  fetchQuestionDetails(id, iteration) {
    
    this.questionDetails = null;
    this.subjectiveAnswer = null;
    this.solutionDetails = null;
    this.selectedQuesId = id;
    let contentId;
    this.mcqDetails = null;
    this.booleanDetails = null;
    this.fillUpDetails = null;
    this.fillUpOptionDetails = null;
    // this.selectedQuestion = this.questions[iteration];
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i]['id'] == id) {
        this.selectedQuestion = this.questions[i];
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
         
          this.networkRequest.getWithHeaders(`/api/fetchuseranswer/?paper=${this.paperId}&question=${this.selectedQuesId}`)
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
      this.noripple = true;
        this.ripple = false;
  }

  // getQuestionIds() {
  //   this.questionIds = this.quesString.split(',');
  //   console.log("quesidss", this.questionIds);
  //   this.fetchQuestionDetails(this.questionIds[0], 0);
  // }

  getQuesNumber(n) {
    if (this.allQuesFlag) {
      return n;
    }
    // else if (this.incorrectFlag) {
    //   for (let i = 0; i < this.all_questions.length; i++) {
    //     if (this.incorrect_questions[n] == this.all_questions[i]) {
    //       return i-1;
    //     }
    //   }
    // }
    else {
      for (let i = 0; i < this.all_questions.length; i++) {
        if (this.questionIds[n-1] == this.all_questions[i]) {
          return i+1;
        }
      }
    }
  }

  getPaperDetails() {
    this.networkRequest.getWithHeaders(`/api/goalpapers/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
        // this.questions = this.paperDetails['questions'];
        this.examId = this.paperDetails['goal']['exam']['id'];
        this.getExamDetails();
      },
      error => {
      });
      this.networkRequest.getWithHeaders(`/api/pregoalassessmentpaper_questions_answers/${this.paperId}/`).subscribe(
        data => {
          console.log("pregoalassessmentpaper_questions_answers", data);
          this.questions = data['questions'];
          this.questionData = data['question_data'];
          for (let i = 0; i < this.questions.length; i++) {
            // this.questionIds.push(this.questions[i]['id']);
            this.sortedQuesIds.push(this.questions[i]['id']);
            if (i < 10) {
              this.countArray[i] = i+1;
            }
            // if (i == this.questions.length - 1) {
            //   this.fetchQuestionDetails(this.questionIds[0], 0);
            //   this.activeCard = 1;
            // }
            // console.log("questionIds", this.questionIds);
          }
          if (this.questions.length  == 0) {
            this.currentQuestion = 0;
          }
          this.fetchReport();
          this.misc.hideLoader();
        },
        error => {
          this.misc.hideLoader();
        }
      ); 
  }

  fetchReport() {
    this.networkRequest.getWithHeaders(`/api/goalassessmentpaper_report/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("report details ", data);
        this.misc.hideLoader();
        this.incorrect_questions = data['report_data']['incorrect_question_ids'];
        this.correct_questions = data['report_data']['correct_question_ids'];
        this.skipped_questions = data['report_data']['skipped_question_ids'];
        this.all_questions = data['report_data']['all_question_ids'];
        // this.all_questions.sort(function(a, b){  
        //   // var sortingArr = this.sortedQuesIds;
        //   return sortedQuesIds.indexOf(a) - sortingArr.indexOf(b);
        // });
        this.all_questions.sort((a, b) => this.sortedQuesIds.indexOf(a) - this.sortedQuesIds.indexOf(b));
        this.incorrect_questions.sort((a, b) => this.sortedQuesIds.indexOf(a) - this.sortedQuesIds.indexOf(b));
        this.correct_questions.sort((a, b) => this.sortedQuesIds.indexOf(a) - this.sortedQuesIds.indexOf(b));
        this.skipped_questions.sort((a, b) => this.sortedQuesIds.indexOf(a) - this.sortedQuesIds.indexOf(b));
        this.questionIds = this.all_questions;
        this.fetchQuestionDetails(this.all_questions[0], 0);
        setTimeout(() => {
          console.log("allques", this.all_questions);
        }, 1100);
        
        this.activeCard = 1;
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
      this.networkRequest.getWithHeaders(`/api/examlinkedquestiontypes/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("linked types ", data);
          this.linkedTypes = data;
          for (let i = 0; i < this.linkedTypes.length; i++) {
            this.quesTypes.push(this.linkedTypes[i]['type_of_question']);
          }
          this.quesTypes = [...new Set(this.quesTypes.map(m => m))];
        },
        error => {
        });
  }

  ngOnInit(): void {

    // this.courseswitchservice.examIdStatus.subscribe(
    //   data => {
    //     if (!data) {
    //       this.route.params.subscribe(
    //         data1 => {
    //           if (data1['exam']) {
    //             this.courseswitchservice.updateExamId(data1['exam']);
    //             this.examId = data1['exam'];
    //             this.getExamDetails();
    //           }
    //         }
    //       );
    //     }
    //     else {
    //       this.examId = data;
    //       this.getExamDetails();
    //     }
    // });

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
