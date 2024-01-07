import { Component, OnInit, ViewChildren,
  ViewChild,
  QueryList,
  ElementRef,
  Renderer2,
  HostListener} from '@angular/core';
import { NetworkRequestService } from '../../../../../services/network-request.service';
import { MiscellaneousService } from '../../../../../services/miscellaneous.service';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { UtilsService } from '../../../../../core/services/utils.service';
import { AlertService } from '../../../../../services/alert.service';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CourseSwitchService } from '../../../services/course-switch.service';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockTemplateComponent } from '../block-template/block-template.component';
import { SelfAssessService } from 'src/app/services/self-assess.service';
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
  selector: 'app-self-assessment',
  templateUrl: './self-assessment.component.html',
  styleUrls: ['./self-assessment.component.scss']
})
export class SelfAssessmentComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate: BlockTemplateComponent;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private networkRequest: NetworkRequestService,
    private test: SelfAssessService,
    private misc: MiscellaneousService,
    private utils: UtilsService,
    private alertService: AlertService,
    private locationStrategy: LocationStrategy,
    private imageCompress: NgxImageCompressService,
    private courseswitchservice: CourseSwitchService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  @ViewChildren('option') optionRef: QueryList<any>;
  @ViewChild('sidebar', { static: false }) sidebarRef: ElementRef;
  @ViewChild('fillUpInput', { static: false }) fillUpInputRef: ElementRef;
  @ViewChild('numericalInput', { static: false }) numericalInputRef: ElementRef;
  @ViewChild('subjectiveInput', { static: false }) subjectiveInputRef: ElementRef;
  @ViewChild('subjectiveInputImage', { static: false }) subjectiveInputImageRef: ElementRef;
  @ViewChild('mathjax', { static: false }) mathjax: ElementRef;

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('submitButton') submitButton: ElementRef;

  env = environment;

  testObj;
  question;
  paperId;
  domainId;
  examId;
  examOver: boolean = false;
  totalusers;
  numericalAnswer: string = "";
  clicked: boolean = false;
  linkedTypes;
  selectedOption: any;
  avgtime;
  paused: boolean = false;
  bookmarks;
  currentQuesBookmarked: boolean = false;
  issueType = "Question Unclear";
  errorDesc;
  pauseTime: number = 0;
  currentSubject;
  Noripple:boolean = true;
  ripple:boolean = false;
  chapter;
  hiddenDiv:boolean = false;
  goalId;
  currentStep: number = 2;
  currentStepNew: number = 2;

hiddenDivFunction(){
  this.hiddenDiv = true;
}
closeSolutionFunction(){
  this.hiddenDiv = false;
}

goDown2() {
  //this.scroller.scrollToAnchor("targetGreen");
  document.getElementById("targetGreen").scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest"
  });
}
  onclickNumericalAnswer(x) {
    this.clicked = true
    this.numericalAnswer += x
  }

  onclickClearallAnswer() {
    this.clicked = false;
    this.numericalAnswer = "";
    // this.selectedOption = null;
    if (this.currentQuestion < this.totalQuestions - 1) {
      if (this.subjectiveInputImageRef) {
        this.renderer.setProperty(this.subjectiveInputImageRef.nativeElement, 'value', null);
      }
    }
  }

  onclickClearAnswer() {
    this.numericalAnswer = this.numericalAnswer.slice(0, -1);
  }


  testStatus = {
    testAvailable: true,
    cleared: false,
    review: false,
    sRreview: false,
    completed: false
  };

  // Question Count
  notAnswerdCount = [];
  completedCount = [];
  savedReviewCount = [];
  reviewCount = [];

  currentQuestion = 0;
  totalQuestions: any;
  testDuration;
  subjectObj: Array<object>;
  submittingQuestion = false;

  userProfileObj: any;

  questionSidebarActive: boolean;
  viewLengends = true;

  isMobile = this.utils.isMobile();
  maximizeScreen = false;
  file: any;
  localUrl: any;
  questions;
  questionIds = [];
  paperDetails;
  selectedQuesId;
  questionDetails;
  mcqDetails;
  solutionDetails;
  examDetails;
  booleanDetails;
  fillUpDetails;
  fillUpOptionDetails;
  subjectiveDetails;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  myControlSecond = new FormControl();
  options: string[] = [];
  tag: any;
  tagSecond: any;
  searchIcon;
  viewDetailbutton = false;
  errors;
  successMsg;
  TagData;
  selectedContentId;
  subjects;
  disableSubmitButton: boolean = false;
  submitCount: number = 0;

  public dummyElem = document.createElement('DIV');
  decode(activityName) {
    var ret:string = "";

    this.dummyElem.innerHTML = activityName;
    document.body.appendChild(this.dummyElem);
    ret = this.dummyElem.textContent; // just grap the decoded string which contains the desired HTML tags
    document.body.removeChild(this.dummyElem);

    // //"ret ", ret);
    return ret;
  }

  checkNumber(i, event) {
    
    this.currentQuestion = i;
    this.question = this.questions[this.currentQuestion];
    if (this.question['is_numeric']) {
      if (!isNumeric(event.target.value)) {
        this.question.user_string_answer = '';
        // alert("it is not a numeric data !");
        this.toastr.error('It is not a numeric data!', 'Error!', {
          timeOut: 4000,
        });
        return;
      }
    }
    
    var response = [];
    let textid = 'fillup' + this.currentQuestion;
    let textVal = (<HTMLInputElement>document.getElementById(textid)).value;
    if (textVal) {
      const fillResponse = textVal.trim();
      if (!/\S/.test(fillResponse)) {
        return [];
      }
      response.push(fillResponse);
    }
    const responseObj = {
      response: response
    }
    this.test.processQuestions(this.question, responseObj).subscribe(data => {
      this.submitCount = 0;
    });
  }

  selectMCQ(event, id, i) {
    console.log("event", event, event.target.checked, id, i);
    this.currentQuestion = i;
    const questionData = this.testObj['question_data'][this.currentQuestion];
    this.mcqDetails = this.questions[this.currentQuestion]['options'];
    this.question = this.questions[this.currentQuestion];
    console.log("question", questionData);
    if (this.mcqDetails.length !== 0 && (event.target.checked)) {
      console.log("idd", id);
      this.mcqDetails.forEach(option => {
        try {

          // Delete Previous Attempted status (to handle the case if user changes answer)
          delete option['attempted'];

          if (option.id === id) {
            option['attempted'] = true;
          } else {
            option['attempted'] = false;
          }
        } catch (err) {
          // Handle Errors Here
        }
      });
    }
    // setTimeout(() => {
    //   this.submitButton.nativeElement.click();
    // }, 100);
    const responseObj = {
      response: [id]
    }
    this.test.processQuestions(this.question, responseObj).subscribe(data => {
      this.submitCount = 0;
    });
    
  }

  selectMCC(event, id, i) {
    console.log("event", event.target.checked, id);
    this.currentQuestion = i;
    const questionData = this.testObj['question_data'][this.currentQuestion];
    this.mcqDetails = this.questions[this.currentQuestion]['options'];
    this.question = this.questions[this.currentQuestion];
    if (this.mcqDetails.length !== 0) {
      console.log("idd", id);
      this.mcqDetails.forEach(option => {
        try {
          if (event.target.checked) {
            if (option.id === id) {
              option['attempted'] = true;
              questionData['user_mcq_answer'].push(id);
            }
          }
          else {
            if (option.id === id) {
              option['attempted'] = false;
              for (let i = 0; i < questionData['user_mcq_answer'].length; i++) {
                if (questionData['user_mcq_answer'][i] == id) {
                  questionData['user_mcq_answer'].removeAt(i);
                }
              }
            }
          }
        } catch (err) {
          // Handle Errors Here
        }
      });
    }
    // setTimeout(() => {
    //   this.submitButton.nativeElement.click();
    // }, 100);
    const responseObj = {
      response: questionData['user_mcq_answer']
    }
    this.test.processQuestions(this.question, responseObj).subscribe(data => {
      this.submitCount = 0;
    });
  }

  setBooleanTrue() {
    this.selectedOption = true;
  }

  setBooleanFalse() {
    this.selectedOption = false;
  }

  showLoader = {
    visibility: false,
  };

  fetchQuestionDetails(id) {
    this.closeSolutionFunction();
    this.selectedQuesId = id;
    let contentId;
    
    this.networkRequest.getWithHeaders(`/api/selfassessquestion/${this.selectedQuesId}/`)
    .subscribe(
      data => {
        console.log("question details ", data);
        this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
        this.questionDetails = data;
      
        this.selectedContentId = this.questionDetails['id'];
       
          const questionData = this.testObj['question_data'][this.currentQuestion];
          
          this.networkRequest.getWithHeaders(`/api/selfassessmcqoptions/?question=${this.questionDetails['id']}`)
          .subscribe(
            data => {
              // console.log("mcq test cases ", data);
              this.mcqDetails = data;
              if (this.mcqDetails.length !== 0) {
                this.mcqDetails.forEach(option => {
                  try {
        
                    // Delete Previous Attempted status (to handle the case if user changes answer)
                    delete option['attempted'];
                    option['attempted'] = false;
        
                    if (questionData['user_mcq_answer'].length !== 0) {
        
                      if (questionData['user_mcq_answer'].includes(option.id)) {
                        option['attempted'] = true;
                      }
                    } else {
                      option['attempted'] = false;
                    }
                  } catch (err) {
                    // Handle Errors Here
                  }
                });
              }
              // console.log("mcqDetailsaa", this.mcqDetails);
            },
            error => {
            });
        
      },
      error => {
      });
  }
  
  /**
   * Get Assessment Questions From server
   */
  getAssessmentTest() {
  //  this.misc.showLoader();
    this.networkRequest.getWithHeaders(`/api/self_assessmentpaper_questions/${this.paperId}/`).subscribe(
      data => {
        console.log("assessmentpaper_questions", data);
        // Check If Assessment Exam is available
        // this.Noripple = true;
        // this.ripple = false;
      
        this.paperDetails = data['assessmentpaperdetails'];
        this.examDetails = data['exam'];
        this.testObj = data;
        if (data['exam_status']) {
          this.router.navigate([`/assessment/dashboard/goal-path/${data['goal']}`], {
            queryParams: {
              exam: this.examId
            }
          });
          this.alertService.hideAlert().subscribe();
          // this.test.completeTest();
        }
        this.goalId = this.testObj['assessmentpaperdetails']['goal'];
        
        if (!data['exam_status']) {
          // this.Noripple = true;
          this.questions = data['questions'];
          for (let i = 0; i < this.questions.length; i++) {
            this.questionIds.push(this.questions[i]['id']);
            // if (i == this.questions.length - 1) {
            //   this.fetchQuestionDetails(this.questionIds[0]);
            // }
            if (this.questions[i]['type_of_question'] == 'mcq' || this.questions[i]['type_of_question'] == 'mcc') {
              this.mcqDetails = this.questions[i]['options'];
              const questionData = data['question_data'][i];
              if (this.mcqDetails.length !== 0) {
                this.mcqDetails.forEach(option => {
                  try {
        
                    // Delete Previous Attempted status (to handle the case if user changes answer)
                    // delete this.questions[i]['option']['attempted'];
                    option['attempted'] = false;
        
                    if (questionData['user_mcq_answer'] && questionData['user_mcq_answer'].length !== 0) {
        
                      if (questionData['user_mcq_answer'].includes(option.id)) {
                        option['attempted'] = true;
                      }
                    } else {
                      option['attempted'] = false;
                    }
                    // console.log("questionsoption", this.questions[i]);
                  } catch (err) {
                    // Handle Errors Here
                    console.log("erroraa", err);
                  }
                });
              }
            }
          }
          console.log("questionIds", this.questionIds);
          this.testStatus.testAvailable = true;
          // this.Noripple = true;
          this.startTest(data);
        } else {
          this.testStatus.testAvailable = false;
          this.testObj['exam_status'] = data['exam_status'];
          this.examOver = true;
        }
        this.misc.hideLoader();
        // this.Noripple = true;
        // this.ripple = false;
      },
      error => {
        this.misc.hideLoader();
        // this.Noripple = true;
        // this.ripple = false;
      }
    );
  }

  /**
   * Syncs all the attempted Questions on page refresh to keep quiz in sync with previously submmitted quiz responses
   */
  syncQuiz() {

    for (const questionIndex in this.testObj['questions']) {
      if (questionIndex) {
        this.syncQuestions(questionIndex).subscribe();
      }
    }
  }


  /**
   * Updates Test Object With Attempted Question data (from server) to keep the quiz in sync & mentain the state of
     previously attempted questions
    * Updates Single Questions State with user response data (from local) to keep the question in sync

    * 1. Sync Seleted Options
    * 2. Sync Fill Up Type Questions
    * 3. Sync Questions Attempted Status
    * 4. Sync Mark For Review Questions
    */
  syncQuestions(questionIndex, userResponse = null) {


    // Update Test Object With User Response to sync the view
    return new Observable(observer => {

      // Sync Question with user response
      if (userResponse) {
        this.testObj['question_data'][questionIndex]['user_mcq_answer'] = userResponse['user_mcq_answer'];
        this.testObj['question_data'][questionIndex]['user_string_answer'] = userResponse['user_string_answer'];
      }

      const question = this.testObj['questions'][questionIndex];
      const questionData = this.testObj['question_data'][questionIndex];

      console.log("question['type_of_question']", question, questionData);
      // Sync MCQ, MCC & Assertion Question's attempted options
      // if (question['type_of_question'] == 'mcc' || question['type_of_question'] == 'mcq' || question['type_of_question'] == 'assertion') {
        // if (this.mcqDetails.length !== 0) {
        //   this.mcqDetails.forEach(option => {
        //     try {

        //       // Delete Previous Attempted status (to handle the case if user changes answer)
        //       delete option['attempted'];

        //       if (questionData['user_mcq_answer'].length !== 0) {

        //         if (questionData['user_mcq_answer'].includes(option.id)) {
        //           option['attempted'] = true;
        //         }
        //       } else {
        //         option['attempted'] = false;
        //       }
        //     } catch (err) {
        //       // Handle Errors Here
        //     }
        //   });
        // }
      // }

      if (questionData['user_string_answer']) {
        this.testObj['questions'][questionIndex]['user_string_answer'] = questionData['user_string_answer'];
      } else {
        this.testObj['questions'][questionIndex]['user_string_answer'] = '';
      }
      

      // Update Previously attempted fill up or numerical answer
     
      // Question Attempt status
      if (questionData['attempt'] && !questionData['s_review']) {
        if (this.completedCount.indexOf(question['id']) === -1) {
          this.completedCount.push(question['id']);
        }
        question['attempt'] = true;
      } else {
        question['attempt'] = false;
      }

      // Mark For Save & Review Status
      if (questionData['s_review']) {
        if (this.savedReviewCount.indexOf(question['id']) === -1) {
          this.savedReviewCount.push(question['id']);
        }

        question['sReview'] = true;
      }

      // Mark For Review Status
      if (questionData['review']) {
        if (this.reviewCount.indexOf(question['id']) === -1) {
          this.reviewCount.push(question['id']);
        }

        question['review'] = true;
      }
      observer.next(question);
    });
  }


  /**
   * Start Test and Setup Necessary Requirements
   */
  startTest(data) {
    this.testObj['started'] = true;
    // this.testObj['attemptOrder'] = data['attempt_order'];
    this.testObj['exam'] = this.examId;
    // Update Service Obj
    this.test.testObj = this.testObj;
    console.log("startTest", this.testObj, this.test);
    this.syncQuiz();

    // Set Total No. Of Questions
    this.totalQuestions = this.testObj.questions.length;
    console.log("starttest data", data);
    // Start Timer
    if (!data['assessmentpaperdetails']['paper_complete']) {
      
      // Show First Question
      // this.Noripple = true;
      setTimeout(() => {
        this.showQuestion();
      }, 500);
      
      // this.fetchQuestionDetails(this.questionIds[this.currentQuestion]);
    } else {
      this.test.completeTest();
    }


  }


  /**
   * Updates Questions object according to current question
   */
  question_score: any;
  showQuestion() {
    // Intialize MathJax
    // this.Noripple = true;
    this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
    this.currentQuesBookmarked = false;
    this.question = this.testObj['questions'][this.currentQuestion];
    // this.question_score = this.getQuestionScore(this.question['type_of_question']);
    if (this.bookmarks) {
      for (let i = 0; i < this.bookmarks.length; i++) {
        if (this.bookmarks[i]['question']['id'] == this.question['id']) {
          this.currentQuesBookmarked = true;
          console.log("this ques is bookmarked", this.question);
        }
      }
    }
    
    this.updateNotAnswered(this.question);

    // Mark Question as Visited
    this.question['visited'] = true;

    // Question Start At
    this.onclickClearallAnswer();
  }


  /**
   * View Next Question
   * Process Question if question type is Fill in the blanks
   */
  nextQuestion() {

    // Show Next Question
    if (this.currentQuestion < this.totalQuestions - 1) {
      this.currentQuestion++;
      if (this.subjectiveInputRef) {
        this.renderer.setProperty(this.subjectiveInputRef.nativeElement, 'value', '');
        this.renderer.setProperty(this.subjectiveInputImageRef.nativeElement, 'value', null);
      }
      this.showQuestion();
      // this.fetchQuestionDetails(this.questionIds[this.currentQuestion]);
      window.scrollTo(0, 0);
    }


    if (this.fillUpInputRef) {
      // Reset Fill Input (if exists)
      try {
        this.fillUpInputRef.nativeElement.value = '';
      } catch (err) {
        console.log(err, "errr");
      }
    }

    this.tag = null;
    this.selectedOption = null;
    var element = <HTMLInputElement> document.getElementById("boolTrue");
    if (element) {
      element.checked = false;
    }
    var element2 = <HTMLInputElement> document.getElementById("boolFalse");
    if (element2) {
      element2.checked = false;
    }
  }


  previousQuestion() {
    if (this.currentQuestion !== 0) {
      this.currentQuestion--;
      if (this.subjectiveInputRef) {
        this.renderer.setProperty(this.subjectiveInputRef.nativeElement, 'value', '');
        this.renderer.setProperty(this.subjectiveInputImageRef.nativeElement, 'value', null);
      };
      this.showQuestion();
      // this.fetchQuestionDetails(this.questionIds[this.currentQuestion]);
      window.scrollTo(0, 0);
      this.tag = null;
      this.selectedOption = null;
      var element = <HTMLInputElement> document.getElementById("boolTrue");
      element.checked = false;
      var element2 = <HTMLInputElement> document.getElementById("boolFalse");
      element2.checked = false;
    }
    
    if (this.fillUpInputRef) {
      // Reset Fill Input (if exists)
      try {
        this.fillUpInputRef.nativeElement.value = '';
      } catch (err) {
        console.log(err, "errr");
      }
    }
  }


  jumpToQuestion(questionIndex) {
    this.currentQuestion = questionIndex;
    this.showQuestion();
    // this.fetchQuestionDetails(this.questionIds[questionIndex]);
  }


  completeTest() {
    // for (let i = 0; i < this.testObj['question_data'].length; i++) {
    //   if (this.testObj['questions'][i]['is_compulsory'] && (this.testObj['questions'][i]['type_of_question']=='mcq' || this.testObj['questions'][i]['type_of_question']=='mcc')) {
    //     if (!this.testObj['question_data'][i]['user_mcq_answer']) {
    //       this.toastr.error('Please attempt all compulsory questions!', 'Error!', {
    //         timeOut: 4000,
    //       });
    //       return;
    //     }
    //     if (this.testObj['question_data'][i]['user_mcq_answer'] && this.testObj['question_data'][i]['user_mcq_answer'].length == 0) {
    //       this.toastr.error('Please attempt all compulsory questions!', 'Error!', {
    //         timeOut: 4000,
    //       });
    //       return;
    //     }
    //   }
    //   if (this.testObj['questions'][i]['is_compulsory'] && this.testObj['questions'][i]['type_of_question']=='fillup') {
    //     if (!this.testObj['questions'][i]['user_string_answer']) {
    //       this.toastr.error('Please attempt all compulsory questions!', 'Error!', {
    //         timeOut: 4000,
    //       });
    //       return;
    //     }
    //   }
    // }
    if (!this.paperDetails['submitted']) {
      // this.alertService.showAlert({ text: 'Do you want to Submit Self Evaluation Question' }, 'info', 'confirm')
      // .subscribe(data => {
      //   if (data) {
          // this.Noripple = false;
          // this.ripple = true;
          clearInterval(this.test.timeinterval);
          this.test.completeTest();
          this.closeModal.nativeElement.click();
          // this.createPreAssessment();
          // setTimeout(() => {
          //   this.Noripple = true;
          //   this.ripple = false;
          // }, 7000);
      //   }
      // });
    }
    else {
      this.router.navigateByUrl(`/assessment/dashboard/choose-p/${this.paperDetails['learner_exam']['exam']['id']}`);
      this.closeModal.nativeElement.click();
    }
  }

  createPreAssessment() {
    const formData = {
      goal: this.goalId
    }
    this.networkRequest.putWithHeaders(formData, `/api/fetchgoalpathassessmentques/`)
      .subscribe(
        data => {
          console.log("goal questions ", data);
          this.courseswitchservice.updateReloadPageStatus(true);

          this.router.navigate([`/assessment/paper/goal-paper-instructions/${this.examId}`],{
            queryParams: {
              paper: data['id']
            }
          });
        },
        error => {
          this.createPreAssessment();
          console.log("error", error);
        }
      );
  }


  /**
   * Get User Response from getUserAnswer()
   * Call processQuestions() for futher processing
   * Update Question Status
   * View Next Question
   */
  submitAnswer(question: object, event: any) {
    // this.Noripple = false;
    // this.ripple = true;

    // Get Generated User Answers
    if (navigator.onLine) {
      this.submitCount += 1;
      this.toggleSubmit(event, true);
      const responseObj = this.getUserAnswer(question, event);
      console.log("responseObj", responseObj, question, event);
      if (!responseObj) {
        return false;
      }

      // Process Questions
      this.toggleSubmit(event, true);
      if (this.submitCount == 1) {
        this.test.processQuestions(question, responseObj).subscribe(data => {
          this.submitCount = 0;
          // this.syncQuestions(this.currentQuestion, data).subscribe();
  
          // If User has not cleared the answer then its a successful submit & completed status can be updated
          // if (!this.testStatus.cleared) {
          //   this.testStatus.completed = true;
          // }
  
          // Update Question Status
          // setTimeout(() => {
            // this.updateQuestionStatus(this.currentQuestion, event);
            // this.Noripple = true;
            // this.ripple = false;
          // }, 100);
          
  
          // this.nextQuestion();
        });
      }
    } else {
      this.alertService
        .showAlert({
          title: 'Network Error',
          text: 'Cannot Save Your Response! Check Your Internet Connection'
        },
          'info');
        // this.Noripple = true;
        // this.ripple = false;
    }
    this.onclickClearallAnswer();

  }


  /**
   * Get User Response by calling generateUserResponse()
   * Check if User cleared any question then make user response array blank
   * Returned Clear Status (True/False) & User Response Object
   */
  getUserAnswer(question, event) {
    // console.log("abquestionab", question);
    // console.log("getuserans selectedoption ", this.selectedOption);
    // if (question['type_of_question'] == 'boolean' && this.selectedOption == null && !this.testStatus.review) {
    //   this.alertService.showAlert({ text: 'You have not selected your answer' }, 'info').subscribe();
    //   return;
    // }
    console.log("eventaa", event);
    let userResponse = event ? this.generateUserAnswer(question, event) : [];
    console.log("userResponse", userResponse, this.testStatus, question);
    if (userResponse.length == 0 && question.review) {
      if (this.testStatus.cleared) {
        this.testStatus.sRreview = false;
        const questiontemp = this.testObj['questions'][this.currentQuestion];
        delete questiontemp['sReview'];
        console.log("questmp", questiontemp);
        event.target.reset();
        userResponse = [];
        const responseObj = {
          response: userResponse,
          cleared: this.testStatus.cleared
        };
        return responseObj;
      }
      else {
        this.testStatus.cleared = false;
        // this.alertService.showAlert({ text: 'You have not filled your answer' }, 'info').subscribe();
        this.toggleSubmit(event, false);
      }
      
    } 
    else if (userResponse.length == 0 && !this.testStatus.review && !question.review) {
      this.testStatus.sRreview = false;
      this.testStatus.cleared = false;
      // this.alertService.showAlert({ text: 'You have not filled your answer' }, 'info').subscribe();
      this.toggleSubmit(event, false);
    }
    else if (userResponse.length == 0 && !this.testStatus.review && !question.sReview) {
      this.testStatus.sRreview = false;
      this.testStatus.cleared = false;
      // this.alertService.showAlert({ text: 'You have not filled your answer' }, 'info').subscribe();
      this.toggleSubmit(event, false);
    } 
    
    else {

      // Clear Current Question (If user hits clear button)
      if (this.testStatus.cleared) {
        event.target.reset();
        userResponse = [];
      }

      const responseObj = {
        response: userResponse,
        cleared: this.testStatus.cleared
      };
      return responseObj;
    }
  }

  chooseFillUpOption(value) {
    this.tag = value;
  }

  /**
   * Generate User answers from form data
   * Takes Question & Event as Input
   * Fetches Selected Option Id using event
   * Returns seleted options of current quesions as a array
   * Clear input field for next question (Only if question was not marked for save & review )
   */
  generateUserAnswer(question: object, event: any) {

    const selectedAnswers = [];
    // Get User Answers for diffrent type of question
    console.log("questionhdsbn", question);
    if (question['type_of_question'] === 'mcq' || question['type_of_question'] === 'mcc') {
    event.target.elements.option.forEach(element => {
      if (element.checked) {
        selectedAnswers.push(element.id);
      }
    });
  } else if (question['type_of_question'] === 'fillup') {
    let textid = 'fillup' + this.currentQuestion;
    let textVal = (<HTMLInputElement>document.getElementById(textid)).value;
    if (textVal) {
      const fillResponse = textVal.trim();
      if (!/\S/.test(fillResponse)) {
        return [];
      }
      selectedAnswers.push(fillResponse);
    }
  }
    return selectedAnswers;
  }

  parseImageIds(urls) {
    const itemList = [];
    urls.forEach(item => {
      itemList.push(JSON.parse(item['id']));
    });
    return itemList;
  }

  /**
   * Updates Question Status in sidebar
   */
  updateQuestionStatus(currentQuestion, event) {
    const question = this.testObj['questions'][currentQuestion];

    // Delete Previous Marking Status
    delete question['review'];
    delete question['sReview'];
    delete question['completed'];
    delete question['attempt'];

    // Update New Marking Status
    if (this.testStatus.review) {

      this.updateReviewCount(question);
      question['review'] = true;

    } else if (this.testStatus.sRreview) {

      this.updateSaveAndMarkForReviewCount(question);
      question['sReview'] = true;

    } else if (this.testStatus.completed) {

      this.updateCompletedCount(question);
      question['completed'] = true;

      // Question Was Cleared
    } else if (this.testStatus.cleared) {

      this.updateCleared(question);

    }

    // if (this.currentQuestion < this.totalQuestions - 1) {
    //   this.resetAndNext(question, event);
    // }
    // else {
    //   this.toggleSubmit(event, false);
    // }

    this.toggleSubmit(event, false);

  }


  /**
   * Mark For Review
   */
  saveAndMarkForReview(event) {

    this.testStatus.sRreview = true;
  }


  /**
   * Mark For Review & Next
   */
  markForReviewAndNext() {

    this.clearResponse();
    this.testStatus.review = true;
  }


  /**
   * Clear User Reponse
   */
  clearResponse() {
    this.testStatus.cleared = true;
    this.onclickClearallAnswer();
  }


  updateNotAnswered(question) {

    if (!question['completed'] && !question['attempt'] && !question['sReview'] && !question['review']) {
      if (this.notAnswerdCount.indexOf(question['id']) === -1) {
        this.notAnswerdCount.push(this.question['id']);
      }
    }
  }


  /**
   * Rest Current Question Status & Make Ready for Next Question
   */
  resetAndNext(question, event) {

    this.toggleSubmit(event, false);

    // Show Next Question (In user did not clicked clear button & also not mark & save for review)
    if (question['completed'] || question['review'] || question['sReview']) {
      this.nextQuestion();
    }

    // Reset Fillup input field for next question
    if (event && !question['sReview'] && question['type_of_question'] === 'fillup') {
      if (this.currentQuestion < this.totalQuestions - 1) {
        this.renderer.setProperty(this.fillUpInputRef.nativeElement, 'value', '');
      }
    }
    
    if (question['type_of_question'] === 'fillup_option') {
      this.tag = null;
    }

    if (question['type_of_question'] === 'boolean') {
      this.selectedOption = null;
      var element = <HTMLInputElement> document.getElementById("boolTrue");
      element.checked = false;
      var element2 = <HTMLInputElement> document.getElementById("boolFalse");
      element2.checked = false;
    }

    if (this.currentQuestion < this.totalQuestions - 1) {
      if (this.subjectiveInputRef) {
        this.renderer.setProperty(this.subjectiveInputRef.nativeElement, 'value', '');
        this.renderer.setProperty(this.subjectiveInputImageRef.nativeElement, 'value', null);
      }
    }


    // Reset All Status for Next Questions
    this.testStatus.review = false;
    this.testStatus.cleared = false;
    this.testStatus.sRreview = false;
    this.testStatus.completed = false;
  }


  /**
   * Update Review Count
   * CASES:
   * 1. Question will be counted as mark for review if not already marked (push in reviewCount)
   * 2. If Question is marked as save & review then remove it from savedReviewCount
   * 3. If Question is marked as completed then remove it from completedCount
   */
  updateReviewCount(question) {

    // Make List of Questions Marked for Review
    if (this.reviewCount.indexOf(question['id']) === -1) {
      this.reviewCount.push(question['id']);
    }

    // If Questions was maked for completed or Save & Mark for Review then remove it from both array
    if (this.savedReviewCount.includes(question['id'])) {
      _.pull(this.savedReviewCount, question['id']);
    }

    if (this.completedCount.includes(question['id'])) {
      _.pull(this.completedCount, question['id']);
    }

    if (this.notAnswerdCount.includes(question['id'])) {
      _.pull(this.notAnswerdCount, question['id']);
    }
  }


  /**
   * Update Save & Marked For Review Count
   * CASES:
   * 1. Question will be counted as save & mark for review if not already marked (push in savedReviewCount)
   * 2. If Question is marked as review then remove it from reviewCount
   * 3. If Question is marked as completed then remove it from completedCount
   * 4. If Question is marked notAnswered then remove it from notAnswerdCount
   */
  updateSaveAndMarkForReviewCount(question) {

    // Make List of Saved & Marked For Review questions
    if (this.savedReviewCount.indexOf(question['id']) === -1) {
      this.savedReviewCount.push(question['id']);
    }

    // If Questions was maked for review or completed then remove it from both array
    if (this.reviewCount.includes(question['id'])) {
      _.pull(this.reviewCount, question['id']);
    }

    if (this.completedCount.includes(question['id'])) {
      _.pull(this.completedCount, question['id']);
    }

    if (this.notAnswerdCount.includes(question['id'])) {
      _.pull(this.notAnswerdCount, question['id']);
    }
  }


  /**
   * Update Save & Marked For Review Count
   * CASES:
   * 1. Question will be counted as completed if not already marked (push in completedCount)
   * 2. If Question is marked as review then remove it from reviewCount
   * 3. If Question is marked as save & review then remove it from savedReviewCount
   * 4. If Question is marked notAnswered then remove it from notAnswerdCount
   */
  updateCompletedCount(question) {

    // Make List of Completed Questions
    if (this.completedCount.indexOf(question['id']) === -1) {
      this.completedCount.push(question['id']);
    }

    // If Questions was maked for review or Save & Mark for Review then remove it from both array
    if (this.reviewCount.includes(question['id'])) {
      _.pull(this.reviewCount, question['id']);
    }

    if (this.savedReviewCount.includes(question['id'])) {
      _.pull(this.savedReviewCount, question['id']);
    }

    if (this.notAnswerdCount.includes(question['id'])) {
      _.pull(this.notAnswerdCount, question['id']);
    }
  }


  /**
   * Update Save & Marked For Review Count
   * CASES:
   * 1. Question will be removed from completedCount, savedReviewCount, reviewCount & will be
     pushed in notAnswerdCount
    */
  updateCleared(question) {

    if (this.completedCount.includes(question['id'])) {
      _.pull(this.completedCount, question['id']);
    }

    if (this.reviewCount.includes(question['id'])) {
      _.pull(this.reviewCount, question['id']);
    }

    if (this.savedReviewCount.includes(question['id'])) {
      _.pull(this.savedReviewCount, question['id']);
    }

    // Add Question in Not Answerd List
    if (this.notAnswerdCount.indexOf(this.question['id']) === -1) {
      this.notAnswerdCount.push(this.question['id']);
    }
  }

  questionSubmissionStatus() {
    this.test.submittingQuestion.subscribe(
      data => {
        this.submittingQuestion = data;
      }
    );
  }


  /**
   * Get Question status circle color
   */
  getCircleClass(questionIndex) {

    const question = this.testObj['questions'][questionIndex];
    if (question['review']) {
      return 'btn-review';
    } else if (question['sReview']) {
      return 'sbtn-review';
    } else if (question['completed'] || question['attempt']) {
      return 'btn-success';
    } else if (question['visited']) {
      return 'btn-danger';
    } else {
      return 'btn-not-visited';
    }
  }

  toggleSubmit(event, disable = true) {
    if (disable) {
      for (const i in event.target.elements) {
        if (event.target.elements[i]['type'] === 'submit') {
          this.renderer.setAttribute(event.target.elements[i], 'disabled', 'disabled');
        }
      }
    } else {
      for (const i in event.target.elements) {
        if (event.target.elements[i]['type'] === 'submit') {
          this.renderer.removeAttribute(event.target.elements[i], 'disabled');
        }
      }
    }
  }


  /**
   * Toggles Question status sidebar
   */
  toggleSidebar() {

    this.questionSidebarActive = !this.questionSidebarActive;

    if (this.questionSidebarActive) {
      this.renderer.removeClass(this.sidebarRef.nativeElement, 'sidebar-inactive');
      this.renderer.addClass(this.sidebarRef.nativeElement, 'sidebar-active');
    } else {
      this.renderer.removeClass(this.sidebarRef.nativeElement, 'sidebar-active');
      this.renderer.addClass(this.sidebarRef.nativeElement, 'sidebar-inactive');

    }
  }


  /**
   * Checks Network Status
   * Submit test when user comes online (If Test Time is over)
   */
  checkNetworkStatus() {

    this.renderer.listen('window', 'online', () => {

      this.misc.hideLoader();
      location.reload();
    });

    this.renderer.listen('window', 'offline', () => {
      this.misc.showLoader('disabled');
    });
  }


  toggleScreen() {
    this.maximizeScreen = !this.maximizeScreen;
  }


  enlargeImage(imgRef: HTMLImageElement) {

    if (imgRef.classList.contains('enlarge-image')) {
      this.renderer.removeClass(imgRef, 'enlarge-image')
    } else {
      this.renderer.addClass(imgRef, 'enlarge-image')
    }
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

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
    this.networkRequest.getWithHeaders(`/api/examuserscount/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("total users ", data);
        this.totalusers = data['totalusers'];
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  ngOnInit() {

    this.route.queryParams.subscribe(
      params => {
        this.paperId = params.paper;
        this.getAssessmentTest();
      }
    );

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

    this.questionSidebarActive = !this.isMobile;

    
    // Get User Profile
    this.misc.userProfile().subscribe(
      data => {
        this.userProfileObj = data;
      }
    );

    this.questionSubmissionStatus();

    // Check Network Status
    this.checkNetworkStatus();

    if (this.isMobile) {
      this.maximizeScreen = false;
    }

    this.preventBackButton();
  }

}
