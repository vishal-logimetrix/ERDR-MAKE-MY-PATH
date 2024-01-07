import { Component, OnInit, ViewChildren,
  ViewChild,
  QueryList,
  ElementRef,
  Renderer2, 
  Input,
  OnDestroy,
  HostListener} from '@angular/core';
import { NetworkRequestService } from '../../../../../services/network-request.service';
import { MentorTestService } from '../../../../../services/mentor-test.service';
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
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockTemplateComponent } from '../block-template/block-template.component';

@Component({
  selector: 'app-mentor-practice-paper',
  templateUrl: './mentor-practice-paper.component.html',
  styleUrls: ['./mentor-practice-paper.component.scss']
})
export class MentorPracticePaperComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate: BlockTemplateComponent;

  constructor(
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private networkRequest: NetworkRequestService,
    private test: MentorTestService,
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

  env = environment;

  testObj: object = {};
  question: object;
  paperId;
  domainId;
  examId;
  examOver: boolean = false;

  numericalAnswer: string = "";
  clicked: boolean = false;
  linkedTypes;
  selectedOption: any;
  avgtime;
  paused: boolean = false;
  bookmarks;
  currentQuesBookmarked: boolean = false;
  examStatus;
  answerPaperDetails;
  pauseTime: number = 0;
  Noripple:boolean = false;
  ripple:boolean = true;
  currentSubject;
  hiddenDiv:boolean = false;
  chapter;

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    const formData = {
      paper: this.answerPaperDetails['id'],
      remainingSeconds: this.test.remainingSeconds
    }
    this.networkRequest.putWithHeaders(formData, `/api/resumementorpaper/`)
      .subscribe(
        data => {
          // console.log("time updatedaa", data);
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler(event) {
    const formData = {
      paper: this.answerPaperDetails['id'],
      remainingSeconds: this.test.remainingSeconds
    }
    this.networkRequest.putWithHeaders(formData, `/api/resumementorpaper/`)
      .subscribe(
        data => {
          console.log("time updatedaa", data);
        },
        error => {
          console.log("error ", error);
        }
      );
  }
  hiddenDivFunction(){
    this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
    this.hiddenDiv = true;
  }

  closeSolutionFunction(){
    this.hiddenDiv = false;
  }

  ngOnDestroy() {
    if (this.answerPaperDetails) {
      const formData = {
        paper: this.answerPaperDetails['id'],
        remainingSeconds: this.test.remainingSeconds
      }
      this.networkRequest.putWithHeaders(formData, `/api/resumementorpaper/`)
        .subscribe(
          data => {
            console.log("time updatedaa", data);
          },
          error => {
            console.log("error ", error);
          }
        );
    }
    
    clearInterval(this.test.timeinterval);
  }

  deleteSubjectiveImage(id) {
    var confirmation = confirm("Are you sure you want to delete this image?");
    if (confirmation){
      this.networkRequest.delete(`/api/deletesubjectiveimage/${id}/`)
      .subscribe(
        data => {
          // this.urls = [];
          for (let i = 0; i < this.urls.length; i++) {
            if (this.urls[i]['id'] == id) {
              this.urls.splice(i, 1);
            }
          }
          console.log("deleted ", data);
          // this.getFAQs();
          this.networkRequest.getWithHeaders(`/api/mentorassessmentpaper_questions/${this.paperId}/`).subscribe(
            data1 => {
              console.log("mentorassessmentpaper_questions", data1, this.currentQuestion);
              // Check If Assessment Exam is available
              if (!data1['exam_status']) {
                this.testObj['data']['question_data'][this.currentQuestion]['user_subjective_answer_images'] = data1['question_data'][this.currentQuestion]['user_subjective_answer_images'];
                setTimeout(() => {
                  this.question['user_subjective_answer_images'] = data1['question_data'][this.currentQuestion]['user_subjective_answer_images'];
                }, 200);
              }
            },
            error => {
            }
          );
        },
        error => {
          console.log("error ", error);
        }
      );
    }
  }

  startBlocking() {
    const formData = {
      paper: this.answerPaperDetails['id'],
      remainingSeconds: this.test.remainingSeconds
    }
    this.networkRequest.putWithHeaders(formData, `/api/pausementorpaper/`)
      .subscribe(
        data => {
          console.log("updated time ", data);
          this.blockUI.start('Exam Paused..!');
          this.paused = true;
          this.testObj['paused'] = true;
          this.pauseTime = data['remaining_time'];
          clearInterval(this.test.timeinterval);
        },
        error => {
          console.log("error ", error);
          this.toastr.error(error['error']['message'], 'Error!', {
            timeOut: 4000,
          });
        }
      );
  }

  stopBlocking() {
    this.blockUI.stop();
    this.paused = false;
    this.testObj['paused'] = false;
    this.networkRequest.getWithHeaders(`/api/mentorlearneranswerpaper/?paper=${this.paperId}`)
    .subscribe(
      data => {
        console.log("paper details stop blocking", data);
        // if (data[0]['submitted']) {
        //   this.alertService.hideAlert().subscribe();
        //   this.test.completeTest();
        // }
        if (data[0]['submitted'] && (data[0]['remaining_time'] <= 0 || !data[0]['remaining_time'])  ) {
          this.alertService.hideAlert().subscribe();
          this.test.completeTest();
        }
        this.test.remainingSeconds = this.pauseTime;
        const formData = {
          paper: this.answerPaperDetails['id'],
          remainingSeconds: this.pauseTime
        }
        this.networkRequest.putWithHeaders(formData, `/api/resumementorpaper/`)
          .subscribe(
            data => {
              console.log("updated time resume", data);
              this.test.remainingSeconds = data['remaining_time'];
              this.testObj['data']['remaining_time'] = data['remaining_time'];
              this.testObj['remaining_time'] = data['remaining_time'];
              // console.log("this.testObj['data']['remaining_time'] ", data['remaining_time'], this.testObj['data']['remaining_time']);
              this.startTest(this.testObj['data']);
            },
            error => {
              console.log("error ", error);
              this.toastr.error(error['error']['message'], 'Error!', {
                timeOut: 4000,
              });
            }
          );
      },
      error => {
      });
    
  }

  onclickNumericalAnswer(x) {
    this.clicked = true
    this.numericalAnswer += x
  }

  onclickClearallAnswer() {
    this.clicked = false;
    this.numericalAnswer = "";
    this.urls = [];
    // this.selectedOption = null;
    if (this.currentQuestion < this.totalQuestions - 1) {
      if (this.subjectiveInputImageRef) {
        this.renderer.setProperty(this.subjectiveInputImageRef.nativeElement, 'value', null);
      }
    }
    this.fetchQuestionDetails(this.question['id']);
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
  issueType = "Question Unclear";
  errorDesc;

  selectErrorType(i, type) {
    this.issueType = type;
    let id = "";
    for (let i = 1; i < 6; i++){
      id = "regi" + i;
      document.getElementById(id).classList.remove("selected");
    }
    id = "";
    id = "regi" + i;
    document.getElementById(id).classList.add("selected");
  }


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

  selectMCQ(event, id) {
    console.log("event", event.target.checked, id);
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
  }

  selectMCC(event, id) {
    console.log("event", event.target.checked, id);
    // const questionData = this.testObj['data']['question_data'][this.currentQuestion];
    if (this.mcqDetails.length !== 0) {
      console.log("idd", id);
      this.mcqDetails.forEach(option => {
        try {
          if (event.target.checked) {
            if (option.id === id) {
              option['attempted'] = true;
            }
          }
          else {
            if (option.id === id) {
              option['attempted'] = false;
            }
          }
        } catch (err) {
          // Handle Errors Here
        }
      });
    }
  }


  setBooleanTrue() {
    this.selectedOption = true;
  }

  setBooleanFalse() {
    this.selectedOption = false;
  }

  selectFile(event: any) {
    this.file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
        this.compressFile(this.localUrl)
      }
      reader.readAsDataURL(event.target.files[0]);
    }

  }
  imgResultAfterCompress: string;
  compressFile(image) {
    var orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.imgResultAfterCompress = result;
      }
    );
  }

  urls = [];
  showLoader = {
    visibility: false,
  };

  compressAndSendFile(image) {
    this.showLoader.visibility = true;
    var orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.networkRequest.postWithHeader(JSON.stringify({ "user_subjective_answer_image": result }), '/api/post_answer_image/')
          .subscribe(data => {
            this.urls.push(data);
            this.showLoader.visibility = false;
            var x = document.getElementsByClassName("btndisable");
            var i;
            for (i = 0; i < x.length; i++) {
              (<HTMLElement>x[i]).removeAttribute("disabled");
            }
          }, error => {
            this.showLoader.visibility = false;
            var x = document.getElementsByClassName("btndisable");
            var i;
            for (i = 0; i < x.length; i++) {
              (<HTMLElement>x[i]).removeAttribute("disabled");
            }
            console.log(error, "error");
          });
      });

  }

  onSelectFile(event) {
    if (event.target.files.length > 3) {
      this.toastr.error('Maximum three images can be uploaded at a time', 'Error!', {
        timeOut: 4000,
      });
      return;
    }
    var x = document.getElementsByClassName("btndisable");
    var i;
    for (i = 0; i < x.length; i++) {
      (<HTMLElement>x[i]).setAttribute("disabled", "disabled");
    }
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.localUrl = event.target.result;
          this.compressAndSendFile(this.localUrl);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  bookmark() {
    var subject;
    this.currentQuesBookmarked = true;
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i]['id'] == this.questionDetails['id']) {
        subject = this.questions[i]['subject']
      }
    }
    const formData = {
      paper: this.answerPaperDetails['id'],
      question: this.questionDetails['id'],
      subject: subject
    }
    this.networkRequest.putWithHeaders(formData, `/api/savementorpaperbookmark/`)
    .subscribe(
      data => {
        console.log("bookmark created ", data);
        this.fetchBookmarksandUpdate();
        this.toastr.success('Question bookmarked!', 'Bookmarked!', {
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
  }

  unmark() {
    for (let i = 0; i < this.bookmarks.length; i++) {
      if (this.questionDetails['id'] == this.bookmarks[i]['question']['id']) {
        this.networkRequest.delete(`/api/deletementorpapertempbookmark/${this.bookmarks[i]['id']}/`)
        .subscribe(
          data => {
            this.toastr.success('Unmarked successfully!', 'Done!', {
              timeOut: 4000,
            });
            this.currentQuesBookmarked = false;
          this.fetchBookmarksandUpdate();
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
  }

  resetIssue() {
    this.selectErrorType(1, 'Question Unclear');
  }

  reportQuestion() {
    if (!this.issueType) {
      this.toastr.error('Please select issue type', 'Oops!', {
        timeOut: 4000,
      });
      return;
    }
    var confirmation = confirm("Are you sure you want to report this question?");
    const formData = {
      exam: this.examDetails['id'],
      question: this.questionDetails['id'],
      issue_type: this.issueType,
      query: this.errorDesc
    }
    if (confirmation) {
      this.networkRequest.postWithHeader(formData, `/api/report_question/`)
      .subscribe(
        data => {
          console.log("question reported ", data);
          this.toastr.success('Question reported!', 'Reported!', {
            timeOut: 4000,
          });
          this.closeModal.nativeElement.click();
          this.selectErrorType(1, 'Question Unclear');
        },
        error => {
          console.log("error ", error);
          this.toastr.error('Already reported', 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
  }
  
  goDown2() {
    //this.scroller.scrollToAnchor("targetGreen");
    document.getElementById("targetGreen").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  fetchQuestionDetails(id) {
    this.closeSolutionFunction();
    this.selectedQuesId = id;
    let contentId;
    
    this.networkRequest.getWithHeaders(`/api/question/${this.selectedQuesId}/`)
    .subscribe(
      data => {
        console.log("question details ", data);
        this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
        this.questionDetails = data;
        // this.question = data;
        for (let i = 0; i < this.questionDetails['contents'].length; i++) {
          if (this.questionDetails['contents'][i]['language']['text'] == 'English') {
            contentId = this.questionDetails['contents'][i]['id'];
            this.selectedContentId = contentId;
          }
        }
        this.networkRequest.getWithHeaders(`/api/solution/?content=${contentId}`)
        .subscribe(
          data => {
            // console.log("solution details ", data);
            this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
            this.solutionDetails = data[0];
          },
          error => {
          });
          // const question = this.testObj['data']['questions'][this.currentQuestion];
          const questionData = this.testObj['data']['question_data'][this.currentQuestion];
          this.currentSubject = this.testObj['data']['questions'][this.currentQuestion]['subject'];
        if (this.questionDetails['type_of_question'] == 'mcc' || this.questionDetails['type_of_question'] == 'mcq' || this.questionDetails['type_of_question'] == 'assertion') {
          
          this.networkRequest.getWithHeaders(`/api/mcqtestcase/?content=${contentId}`)
          .subscribe(
            data => {
              // console.log("mcq test cases ", data);
              this.mcqDetails = data;
              if (this.mcqDetails.length !== 0) {
                this.mcqDetails.forEach(option => {
                  try {
        
                    // Delete Previous Attempted status (to handle the case if user changes answer)
                    delete option['attempted'];
        
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
            },
            error => {
            });
        }
        if (this.questionDetails['type_of_question'] == 'boolean') {
          console.log("qyesdaata", questionData);
          if (questionData['user_boolean_answer'] == false) {
            this.selectedOption = false;
          }
          else if (questionData['user_boolean_answer'] == true) {
            this.selectedOption = true;
          }
          else {
            this.selectedOption = null;
          }
          
          console.log("selectediption", this.selectedOption);
          var element = <HTMLInputElement> document.getElementById("boolTrue");
          element.checked = false;
          var element2 = <HTMLInputElement> document.getElementById("boolFalse");
          element2.checked = false;
          if (this.selectedOption == true) {
            var element = <HTMLInputElement> document.getElementById("boolTrue");
            element.checked = true;
          }
          else if (this.selectedOption == false){
            var element = <HTMLInputElement> document.getElementById("boolFalse");
            element.checked = true;
          }
          // this.networkRequest.getWithHeaders(`/api/booleansolution/?content=${contentId}`)
          // .subscribe(
          //   data => {
          //     // console.log("booleansolution true/ false ", data);
          //     this.booleanDetails = data;
              
          //   },
          //   error => {
          //   });
        }
        if (this.questionDetails['type_of_question'] == 'fillup') {
         
          // this.networkRequest.getWithHeaders(`/api/fillupsolution/?content=${contentId}`)
          // .subscribe(
          //   data => {
          //     // console.log("fillupsolution ", data);
          //     this.fillUpDetails = data;
              
          //   },
          //   error => {
          //   });
        }
        if (this.questionDetails['type_of_question'] == 'fillup_option') {
          this.networkRequest.getWithHeaders(`/api/fillwithoption/?content=${contentId}`)
          .subscribe(
            data => {
              // console.log("fillwithoption ", data);
              this.fillUpOptionDetails = data;
              console.log("fillupoptionqyesdaata", questionData);
              if (!this.currentQuestion) {
                setTimeout(() => {
                  this.tag = questionData['user_fillup_option_answer'];
                }, 200);
              }
              else {
                this.tag = questionData['user_fillup_option_answer'];
              }
            },
            error => {
            });
        }
      },
      error => {
      });
  }

/**
   * Get Test On Page Load
   */
 getTest() {
  this.networkRequest.getWithHeaders(`/api/mentorpapers/${this.paperId}/`)
  .subscribe(
    data => {
      console.log("paper detailsa ", data);
      this.paperDetails = data;
      this.Noripple = true;
      this.ripple = false;
      this.testObj = data;
      this.router.navigateByUrl(`/assessment/dashboard/batch-details/${this.paperDetails['batch']['id']}`);
      this.subjects = data['subjects'];
      return;
      this.getAnswerpaper();
    },
    error => {
      this.Noripple = true;
      this.ripple = false;
    });
}

getAnswerpaper() {
  this.networkRequest.getWithHeaders(`/api/mentorlearneranswerpaper/?paper=${this.paperId}`)
  .subscribe(
    data => {
      console.log("answer paper details", data);
      //@ts-ignore
      if (data.length > 0) {
        if (this.testObj['exam_status']) {
          if (this.testObj['exam_status'].includes("You can Start your paper")) {
            setTimeout(() => {
              this.testObj = data;
              this.test.testObj = data;
              this.alertService.hideAlert().subscribe();
            }, 3100);
            return;
          }
          else {
            console.log("ahdjw");
            setTimeout(() => {
              this.testObj = data;
              this.test.testObj = data;
              this.alertService.hideAlert().subscribe();
              this.test.completeTest();
            }, 100);
            return;
          }
        }
        this.answerPaperDetails = data[0];
        this.fetchBookmarks();
        // if (this.answerPaperDetails['submitted']) {
        //   this.alertService.hideAlert().subscribe();
        //   this.router.navigateByUrl(`/assessment/dashboard/mentor-paper-report/${this.testObj['paper_type']}/${this.testObj['id']}/1`);
        // }
        if (this.answerPaperDetails['submitted'] && (this.answerPaperDetails['remaining_time'] <= 0 || !this.answerPaperDetails['remaining_time'])) {
          this.alertService.hideAlert().subscribe();
          this.test.completeTest();
        }
      }
      
    },
    error => {
    });
}

fetchBookmarks() {
  this.networkRequest.getWithHeaders(`/api/temporarybookmarkmentorpaper/?paper=${this.answerPaperDetails['id']}`).subscribe(
    data => {
      console.log("bookmarks ", data);
      this.bookmarks = data;
    },
    error => {
      console.log("error ", error);
    }
  )
}

fetchBookmarksandUpdate() {
  let count = 0;
  this.networkRequest.getWithHeaders(`/api/temporarybookmarkmentorpaper/?paper=${this.answerPaperDetails['id']}`).subscribe(
    data => {
      console.log("bookmarks ", data);
      this.bookmarks = data;
      for (let i = 0; i < this.bookmarks.length; i++) {
        if (this.bookmarks[i]['question']['id'] == this.question['id']) {
          
          count += 1;
          console.log("this ques is bookmarked", this.question);
        }
        if (i == this.bookmarks.length - 1) {
          if (count > 0) {
            this.currentQuesBookmarked = true;
          }
          else {
            this.currentQuesBookmarked = false;
          }
        }
      }
    },
    error => {
      console.log("error ", error);
    }
  )
}

  /**
   * Get Assessment Questions From server
   */
  getAssessmentTest() {
    // this.misc.showLoader();
    this.networkRequest.getWithHeaders(`/api/mentorassessmentpaper_questions/${this.paperId}/`).subscribe(
      data => {
        console.log("mentorassessmentpaper_questions", data);
        this.Noripple = true;
        this.ripple = false;
        // Check If Assessment Exam is available
        if (data['exam_status']) {
          if (data['exam_status'] =="your paper has been finished") {
            this.getTest();
            return;
          }
          
        }
        this.paperDetails = data['assessmentpaperdetails'];
        this.testObj = data['assessmentpaperdetails'];
        this.subjects = data['assessmentpaperdetails']['subjects'];
        this.examDetails = data['assessmentpaperdetails']['exam'];
        if (data['assessmentpaperdetails']['paper_type'] == 'practice'){
          this.chapter = data['assessmentpaperdetails']['chapters'][0]['title'];
        }
        this.getAnswerpaper();
        if (!data['exam_status']) {
          this.questions = data['questions'];
          for (let i = 0; i < this.questions.length; i++) {
            this.questionIds.push(this.questions[i]['id']);
            if (i == this.questions.length - 1) {
              this.fetchQuestionDetails(this.questionIds[0]);
            }
          }
          console.log("questionIds", this.questionIds);
          this.testStatus.testAvailable = true;
          this.Noripple = true;
          this.startTest(data);
        } else {
          this.testStatus.testAvailable = false;
          this.examStatus = data['exam_status'];
          this.testObj['exam_status'] = data['exam_status'];
          this.examOver = true;
          if (this.examStatus.includes("You can Start your paper")) {
            setTimeout(() => {
              this.alertService.hideAlert().subscribe();
            }, 3100);
            return;
          }
          else {
            setTimeout(() => {
              this.alertService.hideAlert().subscribe();
              this.test.completeTest();
            }, 100);
            return;
          }
        }
        this.misc.hideLoader();
        this.Noripple = true;
        this.ripple = false;
      },
      error => {
        this.misc.hideLoader();
        this.Noripple = true;
        this.ripple = false;
      }
    );
  }

  /**
   * Syncs all the attempted Questions on page refresh to keep quiz in sync with previously submmitted quiz responses
   */
  syncQuiz() {

    for (const questionIndex in this.testObj['data']['questions']) {
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
        this.testObj['data']['question_data'][questionIndex]['user_mcq_answer'] = userResponse['user_mcq_answer'];
        this.testObj['data']['question_data'][questionIndex]['user_fillup_option_answer'] = userResponse['user_fillup_option_answer'];
        this.testObj['data']['question_data'][questionIndex]['user_string_answer'] = userResponse['user_string_answer'];
        this.testObj['data']['question_data'][questionIndex]['user_subjective_answer'] = userResponse['user_subjective_answer'];
        this.testObj['data']['question_data'][questionIndex]['user_subjective_answer_images'] = userResponse['user_subjective_answer_images'];
        if (userResponse['user_boolean_answer']) {
          this.testObj['data']['question_data'][questionIndex]['user_boolean_answer'] = userResponse['user_boolean_answer'];
        }
        else if (!userResponse['user_boolean_answer'] && userResponse['type_of_answer'] == "boolean") {
          this.testObj['data']['question_data'][questionIndex]['user_boolean_answer'] = userResponse['user_boolean_answer'];
        }
      }

      const question = this.testObj['data']['questions'][questionIndex];
      const questionData = this.testObj['data']['question_data'][questionIndex];

      if (question['type_of_question'] == 'boolean') {
        this.testObj['data']['questions'][questionIndex]['user_boolean_answer'] = questionData['user_boolean_answer'];
      }

      // console.log("question['type_of_question']", question['type_of_question']);
      // Sync MCQ, MCC & Assertion Question's attempted options
      // if (question['type_of_question'] == 'mcc' || question['type_of_question'] == 'mcq' || question['type_of_question'] == 'assertion') {
      //   if (this.mcqDetails.length !== 0) {
      //     this.mcqDetails.forEach(option => {
      //       try {
  
      //         // Delete Previous Attempted status (to handle the case if user changes answer)
      //         delete option['attempted'];
  
      //         if (questionData['user_mcq_answer'].length !== 0) {
  
      //           if (questionData['user_mcq_answer'].includes(option.id)) {
      //             option['attempted'] = true;
      //           }
      //         } else {
      //           option['attempted'] = false;
      //         }
      //       } catch (err) {
      //         // Handle Errors Here
      //       }
      //     });
      //   }
      // }
      

      // Update Previously attempted fill up or numerical answer
      if (questionData['user_string_answer']) {
        this.testObj['data']['questions'][questionIndex]['user_string_answer'] = questionData['user_string_answer'];
      } else {
        this.testObj['data']['questions'][questionIndex]['user_string_answer'] = '';
      }

      // Update Previously attempted subjective text answer
      if (questionData['user_subjective_answer']) {
        this.testObj['data']['questions'][questionIndex]['user_subjective_answer'] = questionData['user_subjective_answer'];
      } else {
        this.testObj['data']['questions'][questionIndex]['user_subjective_answer'] = '';
      }

      // Update Previously attempted attempted subjective image answer
      if (questionData['user_subjective_answer_images']) {
        this.testObj['data']['questions'][questionIndex]['user_subjective_answer_images'] = questionData['user_subjective_answer_images'];
      } else {
        this.testObj['data']['questions'][questionIndex]['user_subjective_answer_images'] = null;
      }

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


  getSubjectList(data: any) {
    this.subjectObj = this.test.getSubjectList(data);
  }


  /**
   * Start Timer
   */
  timer(time: number) {
    console.log("send time", time, this.test.remainingSeconds);
    if (!this.paused) {
      this.test.setTime(time);
      // this.testDuration = this.test.update_clock();
      this.test.timeinterval = setInterval(() => {
        // if (!this.paused) {
          this.testDuration = this.test.update_clock();
        // }
        
      }, 1000);
    }
    
  }


  /**
   * Start Test and Setup Necessary Requirements
   */
  startTest(data) {


    this.testObj['started'] = true;
    // this.testObj['attemptOrder'] = data['attempt_order'];
    this.testObj['data'] = data;
    // Update Service Obj
    this.test.testObj = this.testObj;
    console.log("startTest", this.testObj, this.test);
    this.syncQuiz();

    // Generate Subject List
    this.getSubjectList(data);

    // Set Total No. Of Questions
    this.totalQuestions = this.testObj['data'].questions.length;

    // Start Timer
    if (data['remaining_time'] > 0) {
      if (!this.paused) {
        this.timer(data['remaining_time']);
      }
      
      // Show First Question
      this.Noripple = true;
      setTimeout(() => {
        this.showQuestion();
      }, 500);
      this.fetchQuestionDetails(this.questionIds[this.currentQuestion]);
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
    this.Noripple = true;
    this.misc.initializeMathJax(this.mathjax.nativeElement).subscribe();
    this.currentQuesBookmarked = false;
    this.question = this.testObj['data']['questions'][this.currentQuestion];
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
    if (!this.paused) {
      this.test.questionTimeStartAt = this.test.remainingSeconds;
    }
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
      this.fetchQuestionDetails(this.questionIds[this.currentQuestion]);
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
      this.fetchQuestionDetails(this.questionIds[this.currentQuestion]);
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
    this.fetchQuestionDetails(this.questionIds[questionIndex]);
  }


  nextSubject(subjectIndex) {
    let count = 0;
    console.log("index", subjectIndex);
    this.currentSubject = subjectIndex;
    for (let i = 0; i < this.testObj['data'].questions.length; i++) {
      if (this.testObj['data'].questions[i]['subject'] == subjectIndex) {
        if (count == 0) {
          count = count + 1;
          this.currentQuestion = i;
          this.showQuestion();
          this.fetchQuestionDetails(this.questionIds[i]);
        }
      }
    }
    // this.currentQuestion = subjectIndex;
   
  }


  completeTest() {
    if (!this.paperDetails['submitted']) {
      clearInterval(this.test.timeinterval);
      this.test.completeTest();
      document.getElementById("dimissModal").click();
      // this.alertService.showAlert({ text: 'Do you want to finish this Practice' }, 'info', 'confirm')
      // .subscribe(data => {
      //   if (data) {
      //     clearInterval(this.test.timeinterval);
      //     this.test.completeTest();
      //   }
      // });
    }
    else {
      this.router.navigateByUrl(`/assessment/dashboard/choose-p/${this.paperDetails['learner_exam']['exam']['id']}`);
    }
    // this.alertService.showAlert({ text: 'Do you want to finish this test' }, 'info', 'confirm')
    //   .subscribe(data => {
    //     if (data) {
    //       this.test.completeTest();
    //     }
    //   });
  }


  /**
   * Get User Response from getUserAnswer()
   * Call processQuestions() for futher processing
   * Update Question Status
   * View Next Question
   */
  submitAnswer(question: object, event: any) {

    // Get Generated User Answers
    if (navigator.onLine) {
      const responseObj = this.getUserAnswer(question, event);
      console.log("responseObj", responseObj, question, event);
      if (!responseObj) {
        return false;
      }

      this.test.timeTakenInQuestion = this.test.questionTimeStartAt - this.test.remainingSeconds;

      // Process Questions
      this.toggleSubmit(event, true);
      this.test.processQuestions(question, this.selectedContentId, this.testStatus.sRreview, this.testStatus.review, responseObj).subscribe(data => {
        this.syncQuestions(this.currentQuestion, data).subscribe();

        // If User has not cleared the answer then its a successful submit & completed status can be updated
        if (!this.testStatus.cleared) {
          this.testStatus.completed = true;
        }

        // Update Question Status
        this.updateQuestionStatus(this.currentQuestion, event);
        if (!this.answerPaperDetails) {
          this.getAnswerpaper();
        }
      });
    } else {
      this.alertService
        .showAlert({
          title: 'Network Error',
          text: 'Cannot Save Your Response! Check Your Internet Connection'
        },
          'info');
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
    console.log("getuserans selectedoption ", this.selectedOption);
    // if (question['type_of_question'] == 'boolean' && this.selectedOption == null && !this.testStatus.review) {
    //   this.alertService.showAlert({ text: 'You have not selected your answer' }, 'info').subscribe();
    //   return;
    // }
    let userResponse = event ? this.generateUserAnswer(question, event) : [];
    console.log("userResponse", userResponse, this.testStatus, question);
    if (userResponse.length == 0 && question.review) {
      if (this.testStatus.cleared) {
        this.testStatus.sRreview = false;
        const questiontemp = this.testObj['data']['questions'][this.currentQuestion];
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
        this.alertService.showAlert({ text: 'You have not filled your answer' }, 'info').subscribe();
      }
      
    } 
    else if (userResponse.length == 0 && !this.testStatus.review && !question.review) {
      this.testStatus.sRreview = false;
      this.testStatus.cleared = false;
      this.alertService.showAlert({ text: 'You have not filled your answer' }, 'info').subscribe();
    }
    else if (userResponse.length == 0 && !this.testStatus.review && !question.sReview) {
      this.testStatus.sRreview = false;
      this.testStatus.cleared = false;
      this.alertService.showAlert({ text: 'You have not filled your answer' }, 'info').subscribe();
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
    if (question['type_of_question'] === 'mcq' || question['type_of_question'] === 'mcc' || question['type_of_question'] === 'assertion') {
      event.target.elements.option.forEach(element => {
        if (element.checked) {
          selectedAnswers.push(element.id);
        }
      });
    } else if (question['type_of_question'] === 'boolean') {
      // console.log("aahhbd", this.selectedOption);
      if (this.selectedOption == null) {
        selectedAnswers.push(String(this.selectedOption));
        return [];
      }
      selectedAnswers.push(String(this.selectedOption));
    } else if (question['type_of_question'] === 'fillup') {
      if (this.fillUpInputRef.nativeElement.value) {
        const fillResponse = this.fillUpInputRef.nativeElement.value.trim();
        if (!/\S/.test(fillResponse)) {
          return [];
        }
        selectedAnswers.push(fillResponse);
      }
    } else if (question['type_of_question'] === 'fillup_option') {
      if (!this.tag) {
        return [];
      }
      selectedAnswers.push(this.tag);
    } else if (question['type_of_question'] === 'numerical') {
      if (this.numericalInputRef.nativeElement.value) {
        const numericalResponse = this.numericalInputRef.nativeElement.value.trim();
        if (!/\S/.test(numericalResponse)) {
          return [];
        }
        selectedAnswers.push(numericalResponse);
      }
    } else if (question['type_of_question'] === 'subjective') {
      if (this.subjectiveInputRef.nativeElement.value) {
        const subjectiveResponse = this.subjectiveInputRef.nativeElement.value.trim();
        if (!/\S/.test(subjectiveResponse)) {
          return [];
        }
        selectedAnswers.push(subjectiveResponse);

        if (this.urls.length > 0) {
          const subjectiveImageResponse = this.parseImageIds(this.urls);
          selectedAnswers.push(subjectiveImageResponse);
        }
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
    const question = this.testObj['data']['questions'][currentQuestion];

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

    const question = this.testObj['data']['questions'][questionIndex];
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

  getQuestionScore(questionType) {
    if (this.testObj['paper_type'] === 'mock') {
      if (questionType === 'mcq') {
        return this.testObj['data']['mockpaperdetails']['mcq_correct_answer_marks'];
      } else if (questionType === 'mcc') {
        return this.testObj['data']['mockpaperdetails']['mcc_correct_answer_marks'];
      } else if (questionType === 'fillup') {
        return this.testObj['data']['mockpaperdetails']['flup_correct_answer_marks'];
      } else if (questionType === 'numerical') {
        return this.testObj['data']['mockpaperdetails']['numerical_correct_answer_marks'];
      } else if (questionType === 'subjective') {
        return this.testObj['data']['mockpaperdetails']['subjective_long_correct_answer_marks'];
      } else if (questionType === 'subjective_medium') {
        return this.testObj['data']['mockpaperdetails']['subjective_medium_correct_answer_marks'];
      } else if (questionType === 'subjective_short') {
        return this.testObj['data']['mockpaperdetails']['subjective_short_correct_answer_marks'];
      } else if (questionType === 'subjective_very_short') {
        return this.testObj['data']['mockpaperdetails']['subjective_very_short_correct_answer_marks'];
      }
    } else if (this.testObj['paper_type'] === 'assessment') {
      if (questionType === 'mcq') {
        return this.testObj['data']['assessmentpaperdetails']['mcq_correct_answer_marks'];
      } else if (questionType === 'mcc') {
        return this.testObj['data']['assessmentpaperdetails']['mcc_correct_answer_marks'];
      } else if (questionType === 'fillup') {
        return this.testObj['data']['assessmentpaperdetails']['flup_correct_answer_marks'];
      } else if (questionType === 'numerical') {
        return this.testObj['data']['assessmentpaperdetails']['numerical_correct_answer_marks'];
      } else if (questionType === 'subjective') {
        return this.testObj['data']['assessmentpaperdetails']['subjective_long_correct_answer_marks'];
      } else if (questionType === 'subjective_medium') {
        return this.testObj['data']['assessmentpaperdetails']['subjective_medium_correct_answer_marks'];
      } else if (questionType === 'subjective_short') {
        return this.testObj['data']['assessmentpaperdetails']['subjective_short_correct_answer_marks'];
      } else if (questionType === 'subjective_very_short') {
        return this.testObj['data']['assessmentpaperdetails']['subjective_very_short_correct_answer_marks'];
      }
    }

    if (questionType === 'mcq') {
      return this.testObj['data']['assessmentpaperdetails']['mcq_correct_answer_marks'];
    } else if (questionType === 'mcc') {
      return this.testObj['data']['assessmentpaperdetails']['mcc_correct_answer_marks'];
    } else if (questionType === 'flup') {
      return this.testObj['data']['assessmentpaperdetails']['flup_correct_answer_marks'];
    } else if (questionType === 'numerical') {
      return this.testObj['data']['assessmentpaperdetails']['numerical_correct_answer_marks'];
    } else if (questionType === 'subjective') {
      return this.testObj['data']['assessmentpaperdetails']['subjective_long_correct_answer_marks'];
    } else if (questionType === 'subjective_medium') {
      return this.testObj['data']['assessmentpaperdetails']['subjective_medium_correct_answer_marks'];
    } else if (questionType === 'subjective_short') {
      return this.testObj['data']['assessmentpaperdetails']['subjective_short_correct_answer_marks'];
    } else if (questionType === 'subjective_very_short') {
      return this.testObj['data']['assessmentpaperdetails']['subjective_very_short_correct_answer_marks'];
    }
  }

  getExamDetails() {
      this.networkRequest.getWithHeaders(`/api/examlinkedquestiontypes/?exam=${this.examId}`)
      .subscribe(
        data => {
          // console.log("linked types ", data);
          this.linkedTypes = data;
        },
        error => {
        });
      this.networkRequest.getWithHeaders(`/api/examquestionaveragetime/?exam=${this.examId}`)
      .subscribe(
        data => {
          // console.log("avg details ", data);
          this.avgtime = data[0]['time'];
        },
        error => {
        });
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
      this.maximizeScreen = true;
    }

    this.courseswitchservice.examResumeStatus.subscribe(
      data => {
        console.log("resume status", data);
        if (data) {
          this.stopBlocking();
        }
    });
    this.preventBackButton();
    window.onbeforeunload = () => this.ngOnDestroy();
  }

}
