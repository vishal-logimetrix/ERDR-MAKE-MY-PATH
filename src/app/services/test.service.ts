import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';
// import {NetworkRequestService} from 'src/app/services/network-request.service';
import {Router} from '@angular/router';
import {MiscellaneousService} from './miscellaneous.service';

import {CookieService} from 'ngx-cookie-service';
import {AlertService} from './alert.service';
import { CourseSwitchService } from '../modules/assessment/services/course-switch.service';
import { NetworkRequestService } from './network-request.service';

@Injectable()
export class TestService implements OnDestroy {

  constructor(
    private router: Router,
    private cookie: CookieService,
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private alertService: AlertService,
    private courseswitchservice: CourseSwitchService
  ) {
  }

  testObj: any;

  answers = [];
  attemptedQuestionsList = [];

  attemptedQuestion = 0;

  questionTimeStartAt = 0;
  timeTakenInQuestion = 0;
  remainingSeconds: any;
  time_in_minutes: any;
  current_time: any;
  endtime: any;
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
    this.time_in_minutes = null;
    this.remainingSeconds = null;
    this.endtime = null;
    this.current_time = null;
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

      submitTestApi = `/api/assessmentpaper_questions/${this.testObj['id']}/`;
      this.misc.showLoader('short');
      this.networkRequest.postWithHeader('', submitTestApi).subscribe(
        data => {
          this.testObj['started'] = false;
          this.misc.hideLoader();
          this.courseswitchservice.updateExamResumeStatus(false);
          clearInterval(this.timeinterval);
          this.postCompletionProcessing();
          this.alertService.hideAlert().subscribe();
          if (this.testObj['paper_type'] == 'paper') {
            this.router.navigateByUrl(`/assessment/dashboard/report/${this.testObj['paper_type']}/${this.testObj['id']}/1`);
          }
          else {
            this.router.navigateByUrl(`/assessment/dashboard/practice-report/${this.testObj['id']}`);
          }
          this.clearVariables();
          console.log("service data", this.testObj, this.attemptedQuestionsList, this.answers, this.remainingSeconds, this.time_in_minutes, this.endtime, this.current_time, this.attemptedQuestion);
        },
        error => {
          this.misc.hideLoader();
          this.alertService.showAlert({text: 'Some Error Occured! Unable to submit your test, Please contact admin'}, 'error').subscribe();
        }
      );
    } else {
      this.alertService.showAlert({text: 'Cannot Save! Check Your Internet Connection'}, 'error').subscribe();
    }
  }

  postCompletionProcessing() {
    this.networkRequest.postWithHeader('', `/api/process_assessmentpaper_postsubmit/${this.testObj['id']}/`).subscribe(
      data => {
        console.log("post submit processing complete", data);
      },
      error => {
        this.alertService.showAlert({text: 'Some Error Occured in Post Submission! Unable to process your data, Please contact admin'}, 'error').subscribe();
      }
    );
  }


  processQuestions(question: object, contentId, sReview: boolean, review: boolean, responseObj: object) {

    /**
     * Process Questions and Return Current Answer Status
     * Generate Answer Object for Submitting Answers
     */

    return new Observable(observer => {
      // const formData: FormData = new FormData();
      let answerObj;
      this.attemptedQuestion++;
      if (!sReview) {
        this.attemptedQuestionsList.push(question['id']);
      }
      console.log("testObj", this.testObj);
      answerObj = {
        userResponse: {
          answer_paper: this.testObj['data']['answer_paper'],
          attempt_order: this.testObj['data']['attempt_order'],
          question: question['id'],
          questioncontent: contentId,
          type_of_answer: question['type_of_question'],
          type_of_paper: this.testObj['paper_type'],
          save_mark_for_review: sReview,
          mark_for_review: review,
          is_cleared: responseObj['cleared'],
          timespent: this.timeTakenInQuestion
        },
        questionAnswered: this.attemptedQuestionsList,
      };

      // Add Answer to user answer object
      if (question['type_of_question'] === 'mcq' || question['type_of_question'] === 'mcc' || question['type_of_question'] === 'assertion') {
        answerObj.userResponse['user_mcq_answer'] = responseObj['response'];
      } else if (question['type_of_question'] === 'fillup_option') {
        answerObj.userResponse['user_fillup_option_answer'] = responseObj['response'][0];
      } else if (question['type_of_question'] === 'numerical' || question['type_of_question'] === 'fillup') {
        answerObj.userResponse['user_string_answer'] = responseObj['response'][0];
      } else if (question['type_of_question'] === 'boolean') {
        answerObj.userResponse['user_boolean_answer'] = responseObj['response'][0];
      } else if (question['type_of_question'] === 'subjective') {
        answerObj.userResponse['user_subjective_answer'] = responseObj['response'][0];
        if (responseObj['response'].length > 1) {
          answerObj.userResponse['user_subjective_answer_images'] = responseObj['response'][1];
        }
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
      if (this.remainingSeconds > 0) {

        this.submittingQuestion.next(true);
        this.networkRequest.postFormData(userResponse, '/api/post_answer/').subscribe(
          data => {
            observer.next(data);
            this.submittingQuestion.next(false);
          },
          error => {
            this.alertService.showAlert({text: 'Some Error Occured! Cannot Save Your Response, Please Contact Admin'}, 'error').subscribe();
            this.submittingQuestion.next(false);
          }
        );

      } else if (this.remainingSeconds <= 0) {
        console.log("aa1122", this.remainingSeconds);
        this.completeTest();
        observer.next('completed');
      }
    });
  }


  getSubjectList(data) {

    // Get Subjects
    const subjectObj = [];
    let subjectList = [];

    data['questions'].forEach((question) => {
      subjectList.push(question['subject']);
    });

    const uniqueSubjects = Array.from(new Set(subjectList));

    uniqueSubjects.forEach(subject => {
      subjectObj.push({
        title: subject,
        index: subjectList.indexOf(subject)
      });
    });

    return subjectObj;
  }


  time_remaining(endtime) {

    /**
     * Calculate Remaining Time
     */

    let t = Date.parse(endtime) - Date.parse(`${new Date()}`);
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / (1000 * 60)) % 60);
    const hours = Math.floor(t / (1000 * 60 * 60) % 60);

    t = t < 0 ? 0 : t;
    if (t == 0 && this.timeinterval) {
      this.clearTimer();
      console.log("abab", this.timeinterval);
      this.completeTest();
    }

    return {
      'total': t, 'hours': hours, 'minutes': minutes, 'seconds': seconds.toString().length === 2 ? seconds : `0${seconds}`
    };
  }


  update_clock() {

    /**
     * Return Updated Time
     */

    if (this.testObj['started']) {
      // console.log("remaining seconds", this.remainingSeconds, this.questionTimeStartAt);
      // if (!this.testObj['paused']) {
        this.remainingSeconds--;
        
        const t = this.time_remaining(this.endtime);
        if (t.total <= 0) {
          this.clearTimer();
        }
        // console.log("t remsec", t, this.remainingSeconds, this.endtime);
        return t;
      // }
     
    }
  }


  setTime(time) {

    /**
     * Set Time For Starting Timer
     */
    console.log("incoming time", time);
    this.time_in_minutes = time / 60;
    this.remainingSeconds = time;
    this.current_time = Date.parse(`${new Date()}`);
    this.endtime = new Date(this.current_time + time * 1000);
  }


  clearTimer() {

    /**
     * Clear Timer
     */

    clearInterval(this.timeinterval);
  }
}
