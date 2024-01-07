import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.scss']
})
export class ExamQuestionsComponent implements OnInit {

 
  @ViewChild('mathjax', { static: false }) mathjax: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('openModal') openModal: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: BatchServiceService,
    private misc: MiscellaneousService
  ) { }

  question;
  questionIds = [];
  options = ['Account', 'Amount', 'Name', 'Signature'];
  currentQuestion = 1;
  totalQuestions = 10;
  div2:boolean = false;
  div3:boolean = false;
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
  batchId;
  batchDetails;
  replacementQuestion;
  replacementQuestionDetails;
  replaceBoolean;
  replaceFillup;
  replaceFillupOption;
  replaceMcq;
  replaceSol;
  replacmentCorrectFillUpOption;
  quesReportData;
  currentDate = new Date();

  div2Function(){
    this.div2 = true;
    this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
  }
  div3Function(){
    this.div3 = true;
    this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
  }
  closeSolution(){
    this.div2 = false;
  }
  closeSolutionReplace(){
    this.div3 = false;
  }

  changeStringToDate(date) {
    var tmpDate = new Date(date);
    return tmpDate.getTime();
  }

  goDown2() {
    document.getElementById("targetGreen").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  fetchReplacementQuestionDetails() {
    let contentId;
    this.replaceMcq = null;
    this.replaceBoolean = null;
    this.replaceFillup = null;
    this.replaceFillupOption = null;
    this.replaceSol = null;
    
        for (let i = 0; i < this.replacementQuestion['contents'].length; i++) {
          if (this.replacementQuestion['contents'][i]['language']['text'] == 'English') {
            contentId = this.replacementQuestion['contents'][i]['id'];
          }
        }
        this.networkRequest.getWithHeaders(`/api/solution/?content=${contentId}`)
        .subscribe(
          data => {
            console.log("solution details replace", data);
            this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
            this.replaceSol = data[0];
          },
          error => {
          });
        if (this.replacementQuestion['type_of_question'] == 'mcc' || this.replacementQuestion['type_of_question'] == 'mcq' || this.replacementQuestion['type_of_question'] == 'assertion') {
    
          this.networkRequest.getWithHeaders(`/api/mcqtestcase/?content=${contentId}`)
          .subscribe(
            data => {
              console.log("mcq test cases replace", data);
              this.replaceMcq = data;
            },
            error => {
            });
        }
        if (this.replacementQuestion['type_of_question'] == 'boolean') {
         
          this.networkRequest.getWithHeaders(`/api/booleansolution/?content=${contentId}`)
          .subscribe(
            data => {
              console.log("booleansolution true/ false replace", data);
              this.replaceBoolean = data[0];
            },
            error => {
            });
        }
        if (this.replacementQuestion['type_of_question'] == 'fillup') {
         
          this.networkRequest.getWithHeaders(`/api/fillupsolution/?content=${contentId}`)
          .subscribe(
            data => {
              console.log("fillupsolution replace", data);
              this.replaceFillup = data[0];
            },
            error => {
            });
        }
        if (this.replacementQuestion['type_of_question'] == 'fillup_option') {
         
          this.networkRequest.getWithHeaders(`/api/fillwithoption/?content=${contentId}`)
          .subscribe(
            data => {
              console.log("fillwithoption replace", data);
              this.replaceFillupOption = data;
              for (let i = 0; i < this.replaceFillupOption.length; i++) {
                if (this.replaceFillupOption[i]['correct']) {
                  this.replacmentCorrectFillUpOption = this.replaceFillupOption[i]['text'];
                }
              }
            },
            error => {
            });
        }
  }

  closeModalPopup() {
    this.replaceMcq = null;
    this.replaceBoolean = null;
    this.replaceFillup = null;
    this.replaceFillupOption = null;
    this.replaceSol = null;
    this.replacementQuestion = null;
    this.closeModal.nativeElement.click();
    this.div3 = false;
  }

  findReplacementQuestion() {
    this.closeModal.nativeElement.click();
    this.replaceMcq = null;
    this.replaceBoolean = null;
    this.replaceFillup = null;
    this.replaceFillupOption = null;
    this.replaceSol = null;
    this.replacementQuestion = null;
    this.networkRequest.getWithHeaders(`/api/findreplacementquestion/?question=${this.questionDetails['id']}&paper=${this.paperId}`)
    .subscribe(
      data => {
        //@ts-ignore
        if (data.length > 0) {
          this.replacementQuestion = data[0];
          console.log("question replacement ", data);
          this.toastr.success('Question found!', 'Success!', {
            timeOut: 4000,
          });
          setTimeout(() => {
            this.openModal.nativeElement.click();
          }, 1000);
          
          this.fetchReplacementQuestionDetails();
        }
        else {
          this.toastr.error('No question found', 'Error!', {
            timeOut: 4000,
          });
        }
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['detail'], 'Error!', {
          timeOut: 4000,
        });
      }
    );
    this.div3 = false;
  }

  replaceQuestion() {
    const formData = {
      paper: this.paperDetails['id'],
      question: this.questionDetails['id'],
      newquestion: this.replacementQuestion['id']
    }
    this.networkRequest.putWithHeaders(formData, `/api/replacequestion/`)
    .subscribe(
      data => {
        console.log("question replaced ", data);
        this.closeModal.nativeElement.click();
        this.getPaperDetails();
        this.toastr.success('Question Replaced Successfully!', 'Success!', {
          timeOut: 4000,
        });
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['message'], 'Error!', {
          timeOut: 4000,
        });
      }
    );
    this.div3 = false;
  }

  fetchPrev() {
    for (let i = 0; i < this.questionIds.length; i++) {
      if (this.selectedQuesId == this.questionIds[i]) {
        this.div2 = false;
        if (i != 0) {
          this.currentQuestion = i;
          this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
          this.fetchQuestionDetails(this.questionIds[i-1], i-1);
          return;
        }
        else {
          return;
        }
      }
      this.div2 = false;
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
          this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
          this.fetchQuestionDetails(this.questionIds[i+1], i+1);
          return;
        }
      }
      this.div2 = false;
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
    this.quesReportData = null;

    this.networkRequest.getWithHeaders(`/api/mentorassessment_singlequestionreport/${this.paperId}/?question=${id}`).subscribe(
      data => {
        console.log("question report", data);
        this.quesReportData = data['data'][0];
      },
      error => {
        console.log("error ", error);
      }
    )
    
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
    this.currentQuestion = 1;
    this.questionIds = [];
    this.networkRequest.getWithHeaders(`/api/mentorpapers/${this.paperId}/`)
    .subscribe(
      data => {
        console.log("paper details ", data);
        this.paperDetails = data;
        this.questions = this.paperDetails['questions'];
        for (let i = 0; i < this.questions.length; i++) {
          this.questionIds.push(this.questions[i]['id']);
          if (i == this.questions.length - 1) {
            this.fetchQuestionDetails(this.questionIds[0], 0);
          }
        }
      },
      error => {
      });
     
  }

  deleteTempQues() {
    const formData = {
      paper: this.paperId
    }
    this.networkRequest.putWithHeaders(formData, `/api/deletetemporaryreplacementquestions/`)
      .subscribe(
        data => {
          console.log("tmp ques delete ", data);
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
          // Intialize MathJax
          this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
          this.examDetails = data;
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

    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.courseswitchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
        }
      }
    );

    this.route.queryParams.subscribe(
      params => {
        this.paperId = params.paper;
        if (this.paperId) {
          this.getPaperDetails();
          this.deleteTempQues();
        }
    });
  }

}
