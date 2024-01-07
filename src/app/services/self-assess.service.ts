import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
// import {NetworkRequestService} from 'src/app/services/network-request.service';
import {Router} from '@angular/router';
import {MiscellaneousService} from './miscellaneous.service';

import {CookieService} from 'ngx-cookie-service';
import {AlertService} from './alert.service';
import { CourseSwitchService } from '../modules/assessment/services/course-switch.service';
import { NetworkRequestService } from './network-request.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SelfAssessService {

  constructor(
    private router: Router,
    private cookie: CookieService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private alertService: AlertService,
    private courseswitchservice: CourseSwitchService,
    private toastr: ToastrService
  ) {
  }

  testObj: any;

  answers = [];
  attemptedQuestionsList = [];

  attemptedQuestion = 0;

  questionTimeStartAt = 0;
  timeTakenInQuestion = 0;
  timeinterval: any;

  submittingQuestion: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy() {
    // Clean subscriptions, intervals, etc
  } 

  clearVariables() {
    this.testObj = null;
    this.attemptedQuestionsList = [];
    this.answers = [];
    this.attemptedQuestion = 0;
    this.timeinterval = null;
  }


  completeTest() {

    /**
     * Called When User Click Submit Button or Time is finished
     * Returns Subject with true so that user can be redirected to report page
     */

    if (navigator.onLine) {
      let submitTestApi: string;
      // if (this.testObj['paper_type'] === 'mock') {
      //   submitTestApi = `/api/mockpaper_questions/${this.testObj['id']}/${this.testObj['attemptOrder']}/`;
      // } else {
      //   submitTestApi = `/api/assessmentpaper_questions/${this.testObj['id']}/`;
      // }

      submitTestApi = `/api/self_assessmentpaper_questions/${this.testObj['assessmentpaperdetails']['id']}/`;
      this.misc.showLoader('short');
      this.networkRequest.postWithHeader('', submitTestApi).subscribe(
        data => {
          this.testObj['started'] = false;
          this.misc.hideLoader();
          this.courseswitchservice.updateExamResumeStatus(false);
          clearInterval(this.timeinterval);
          this.alertService.hideAlert().subscribe();
         
          // this.router.navigateByUrl(`/assessment/dashboard/my-goals/${this.testObj['exam']}`);
          const formData = {
            goal: this.testObj['assessmentpaperdetails']['goal']
          }
          this.networkRequest.putWithHeaders(formData, `/api/checkforfirstpathcreation/`).subscribe(
            data => {
              console.log("check first path ", data);
              if (data['status'] == 1) {
                this.goalExamCreation();
                // this.toastr.success(data['message'], 'Success!', {
                //   timeOut: 4000,
                // });
              }
              else {
                this.router.navigate([`/assessment/dashboard/add-goal/${this.testObj['exam']}`],{
                  queryParams: {
                    error: "true"
                  }
                });
                this.testObj['ripple'] = false;
                this.clearVariables();
                this.toastr.error(data['message'], 'Error!', {
                  timeOut: 4000,
                });
              }
            },
            error => {
            }
          )
          this.goalExamCreation();
          // this.clearVariables();
          console.log("service data", this.testObj, this.attemptedQuestionsList, this.answers, this.attemptedQuestion);
        },
        error => {
          this.misc.hideLoader();
          this.alertService.showAlert({text: error['error']['message']}, 'error').subscribe();
        }
      );
    } else {
      this.alertService.showAlert({text: 'Cannot Save! Check Your Internet Connection'}, 'error').subscribe();
    }
  }

  goalExamCreation() {
    this.testObj['ripple'] = true;
    const formData = {
      goal: this.testObj['assessmentpaperdetails']['goal']
    }
    this.networkRequest.putWithHeaders(formData, `/api/fetchgoalpathassessmentques/`)
      .subscribe(
        data => {
          console.log("goal questions ", data);
          this.courseswitchservice.updateReloadPageStatus(true);

          this.router.navigate([`/assessment/paper/goal-paper-instructions/${this.testObj['exam']}`],{
            queryParams: {
              paper: data['id']
            }
          });
          this.testObj['ripple'] = false;
          this.clearVariables();
        },
        error => {
          console.log("error", error);
        }
      );
  }


  processQuestions(question: object,  responseObj: object) {

    /**
     * Process Questions and Return Current Answer Status
     * Generate Answer Object for Submitting Answers
     */

    return new Observable(observer => {
      // const formData: FormData = new FormData();
      let answerObj;
      this.attemptedQuestion++;
      console.log("testObj", this.testObj);
      answerObj = {
        userResponse: {
          answer_paper: this.testObj['assessmentpaperdetails']['id'],
          question: question['id'],
          type_of_answer: question['type_of_question'],
        },
        questionAnswered: this.attemptedQuestionsList,
      };

      // Add Answer to user answer object
      // answerObj.userResponse['user_mcq_answer'] = responseObj['response'];
      if (question['type_of_question'] === 'mcq' || question['type_of_question'] === 'mcc') {
        answerObj.userResponse['user_mcq_answer'] = responseObj['response'];
      } 
      else if (question['type_of_question'] === 'fillup') {
        answerObj.userResponse['user_string_answer'] = responseObj['response'][0];
      }
      this.answers.push(answerObj);
      this.submitAnswers(answerObj['userResponse']).subscribe(
        data => {
          observer.next(data);
        }
      );
    });
  }


  submitAnswers(userResponse) {


    /**
     * Test Final Submit
     */
    return new Observable(observer => {
      this.submittingQuestion.next(true);
      this.networkRequest.postFormData(userResponse, '/api/post_self_assess_answer/').subscribe(
        data => {
          observer.next(data);
          this.submittingQuestion.next(false);
        },
        error => {
          this.alertService.showAlert({text: 'Some Error Occured! Cannot Save Your Response, Please Contact Admin'}, 'error').subscribe();
          this.submittingQuestion.next(false);
        }
      );
      // else if (this.remainingSeconds <= 0) {
      //   console.log("aa1122", this.remainingSeconds);
      //   this.completeTest();
      //   observer.next('completed');
      // }
    });
  }


  
}
