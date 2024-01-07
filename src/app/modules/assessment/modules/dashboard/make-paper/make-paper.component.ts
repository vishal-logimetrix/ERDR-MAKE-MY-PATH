import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { CourseSwitchService } from '../../../services/course-switch.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PermissionsService } from 'src/app/core/services/permissions.service';

@Component({
  selector: 'app-make-paper',
  templateUrl: './make-paper.component.html',
  styleUrls: ['./make-paper.component.scss']
})
export class MakePaperComponent implements OnInit {
  value:number;

  ckeditorContent: string = '<p>Some html</p>';
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  chooseSubjectsFlag: boolean = true;
  examId;
  pathQuestions;
  examDetails;
  domainId;
  subjects;
  chapters;
  selectedSubjectId;
  selectedChapters = [];
  selectedSubjects = [];
  totalQuestions: number = 0;
  totalTime: number = 0;
  questionTypes = [];
  difficulty: number = 5;
  fetchedQuestions;
  paperType;
  totalMarks;
  avgtime;
  totalusers;
  linkedTypes;
  showTime: boolean = true;
  subjectChapters;
  errorMsg;
  selectedChapter;
  submitStatus: boolean = false;
  abcd:boolean = true;
  efgh:boolean = false;
  mockParameterFound: boolean = false;
  spinner:boolean = true;

  @ViewChild("myckeditor", {static: false}) ckeditor: any;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private router: Router,
    private misc: MiscellaneousService,
    private permissions: PermissionsService
  ) {
    this.mycontent = `<p>My html content</p>`;
  }

  isAuthenticated = this.permissions.isauthenticated();
  @ViewChild('widgetsContent') widgetsContent: ElementRef;

  slideRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  };
  slideLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  };

  
  
  selectChapter(id) {
    this.networkRequest.getWithHeaders(`/api/chapter/${id}/`)
      .subscribe(
        data => {
          console.log("chapter ", data);
          this.selectedChapter = data;
          // document.getElementById("tooltipModal").click();
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  calculateTime(totalQuestions) {
    this.errorMsg = null;
    console.log("aa", totalQuestions);
    if (totalQuestions > 200) {
      this.totalQuestions = 200;
      totalQuestions = 200;
      this.errorMsg = "Max 200 questions are allowed!";
      // this.toastr.error('Max 200 questions are allowed!', 'Oops!', {
      //   timeOut: 4000,
      // });
      setTimeout(() => {
        this.errorMsg = null;
      }, 4000);
    }
    if (this.totalQuestions < 0) {
      this.totalQuestions = 0;
    }
    if (this.paperType == 'paper') {
      //@ts-ignore
      this.totalTime = (totalQuestions * this.avgtime).toFixed(2);
      if (this.totalTime < 0) {
        this.totalTime = 0;
      }
      console.log("totalTime", this.totalTime, this.avgtime);
    }
    else {
      this.totalTime = 0;
    }
  }

  manageNegTime() {
    if (this.totalTime < 0) {
      this.totalTime = 0;
    }
  }

  incQues() {
    this.errorMsg = null;
    if (this.totalQuestions > 200) {
      this.totalQuestions = 200;
      // this.toastr.error('Max 200 questions are allowed!', 'Oops!', {
      //   timeOut: 4000,
      // });
      this.errorMsg = "Max 200 questions are allowed!";
      setTimeout(() => {
        this.errorMsg = null;
      }, 4000);
    }
    this.totalQuestions = this.totalQuestions + 1;
    this.calculateTime(this.totalQuestions);
  }

  decQues() {
    this.errorMsg = null;
    this.totalQuestions = this.totalQuestions - 1;
    if (this.totalQuestions < 0) {
      this.totalQuestions = 0;
    }
    this.calculateTime(this.totalQuestions);
  }


  incTime() {
    this.totalTime = this.totalTime - 1;
    this.totalTime = this.totalTime + 2;
  }

  decTime() {
    this.totalTime = this.totalTime - 1;
    if (this.totalTime < 0) {
      this.totalTime = 0;
    }
  }

  generateMockPaper() {
    this.submitStatus = true;
    // this.misc.showLoader('short');
    this.abcd=false;
    this.efgh=true;
    const formData = {
      exam: this.examId
    }

    this.networkRequest.putWithHeaders(formData, `/api/generatemockpaper/`)
    .subscribe(
      data => {
        this.submitStatus = false;
        console.log("mock paper generated ", data);
        // this.misc.hideLoader();

        this.courseswitchservice.updateReloadPageStatus(true);
      
        this.router.navigate([`/assessment/paper/test-instructions/${this.examId}`],{
          queryParams: {
            paper: data['id']
          }
        });
      },
      error => {
        this.submitStatus = false;
        console.log("error in learner exam linking", error);
        if (error['error']['message']) {
          this.toastr.error(error['error']['message'], 'Error!', {
            timeOut: 4000,
          });
        }
        else if (error['error']) {
          this.toastr.error(error['error'], 'Error!', {
            timeOut: 4000,
          });
        }
        else {
          this.toastr.error('Some error occured!', 'Error!', {
            timeOut: 4000,
          });
        }
        this.abcd=true;
        this.efgh=false;
      }
    );
  }

  submitFilterForm() {
    this.submitStatus = true;
    if (this.totalQuestions == 0) {
      this.toastr.error('Please enter total number of problems!', 'Oops!', {
        timeOut: 9000,
      });
      this.submitStatus = false;
      return;
    }
    // this.misc.showLoader('short');
    this.abcd=false;
    this.efgh=true;
    let chapterIds = [];
    for (let i = 0; i < this.selectedChapters.length; i++) {
      chapterIds.push(this.selectedChapters[i]['id']);
    }
    let formData;
    
    const LearnerExamData = {
      exam: this.examId
    }
    this.networkRequest.postWithHeader(LearnerExamData, `/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exam linked ", data);
        if (this.paperType == 'practice') {
          formData = {
            chapters: chapterIds,
            totalQues: this.totalQuestions,
            quesTypes: this.questionTypes,
            difficulty: this.difficulty,
            learnerExam: data['id'],
            exam: this.examId,
            show_time: this.showTime,
            type: this.paperType
          }
        }
        else {
          formData = {
            chapters: chapterIds,
            totalQues: this.totalQuestions,
            totalTime: this.totalTime,
            quesTypes: this.questionTypes,
            difficulty: this.difficulty,
            learnerExam: data['id'],
            exam: this.examId,
            show_time: this.showTime,
            type: 'paper'
          }
        }
        this.networkRequest.putWithHeaders(formData, `/api/filterquestion/`).subscribe(
          data => {
            this.submitStatus = false;
            console.log("Questions found ", data);
            // this.misc.hideLoader();
            this.fetchedQuestions = data['questions'];
            // if (this.fetchedQuestions.length > 0) {
            //   this.toastr.success('Questions found!', 'Found!', {
            //     timeOut: 4000,
            //   });
            // }
            if (this.fetchedQuestions.length == 0) {
              this.toastr.error('No question found!', 'Error!', {
                timeOut: 4000,
              });
              return;
            }
            let quesIds = [];

            this.courseswitchservice.updateReloadPageStatus(true);

            this.router.navigate([`/assessment/paper/test-instructions/${this.examId}`],{
              queryParams: {
                paper: data['id']
              }
            });
            // const testWindowUrl = `/assessment/paper/test-instructions/${this.examId}?paper=${data['id']}`;
            // // console.log("testWindowUrl", testWindowUrl);
            // // Open new test window
            // const testWindow = window.open(testWindowUrl, 'Test', 'fullscreen');

            // // // Test window settings
            // if (testWindow.outerWidth < screen.availWidth || testWindow.outerHeight < screen.availHeight) {
            //   testWindow.moveTo(0, 0);
            //   testWindow.resizeTo(screen.availWidth, screen.availHeight);
            // }
               
            // for (let i = 0; i < this.fetchedQuestions.length; i++) {
            //   quesIds.push(this.fetchedQuestions[i]['id']);
            //   if (i == this.fetchedQuestions.length - 1) {
            //     this.courseswitchservice.updateQuestionIds(quesIds);
            //     this.courseswitchservice.questionIds.subscribe(
            //       data => {
            //         console.log("questionids", data);
            //     });
            //     let tmpIds;
            //     for (let i = 0; i < quesIds.length; i++) {
            //       if (i == 0) {
            //         tmpIds = quesIds[i];
            //       }
            //       else {
            //         tmpIds = tmpIds + ',' + quesIds[i];
            //       }
            //     }
                
            //   }
            // }
          },
          error => {
            this.submitStatus = false;
            this.misc.hideLoader();
            console.log("error ", error);
            this.toastr.error(error['error']['message'], 'Error!', {
              timeOut: 4000,
            });
            this.abcd=true;
    this.efgh=false;
          }
        );
      },
      error => {
        this.submitStatus = false;
        this.misc.hideLoader();
        console.log("error in learner exam linking", error);
        this.toastr.error(error['error']['errors'][0], 'Error!', {
          timeOut: 4000,
        });
        this.abcd=true;
    this.efgh=false;
      }
    );
    

  }
  
  getSliderValue(event) {
    console.log(event.target.value);
    this.value = event.target.value;
  }

  showMakePaper() {
    this.totalQuestions = 5;
    this.calculateTime(this.totalQuestions);
    console.log("selected chapters", this.selectedChapters);
    for (let i = 0; i < this.selectedChapters.length; i++) {
      for (let j = 0; j < this.subjects.length; j++) {
        if (this.subjects[j]['id'] == this.selectedChapters[i]['subject']) {
          this.selectedSubjects.push(this.subjects[j]);
        }
      }
    }
    // this.selectedSubjects = [...new Set(this.selectedSubjects.map(m => m))];
    // this.selectedSubjects = this.selectedSubjects.filter((el, i, a) => i === a.indexOf(el));
    this.selectedSubjects = Array.from(this.selectedSubjects.reduce((m, t) => m.set(t.id, t), new Map()).values());
    console.log("selected subjects", this.selectedSubjects);
    if (this.selectedSubjects.length == 0) {
      this.toastr.error('Please select at least one chapter!', 'Error!', {
        timeOut: 4000,
      });
      return;
    }
    if (this.linkedTypes.length >= 1) {
      setTimeout(() => {
        var element = <HTMLInputElement> document.getElementById("customCheck0");
        element.checked = true;
      }, 1000);
      if (this.linkedTypes[0]['is_active']) {
        this.questionTypes.push(this.linkedTypes[0]['type_of_question']);
        this.questionTypes = [...new Set(this.questionTypes.map(m => m))];
      }
    }
    this.chooseSubjectsFlag = false;
  }
  goToMakeMyPaper() {
    this.chooseSubjectsFlag = true;
  }
  resetChaptersSelection() {
    // this.selectedChapters = [];
    this.chooseSubjectsFlag = true;
    this.totalQuestions = 0;
    this.totalTime = 0;
    this.selectedChapters = [];
    this.selectedSubjects = [];
    
    this.getChapters(this.selectedSubjectId);
  }

  questionTypeChange(type, event) {
    if(event.target.checked){
      this.questionTypes.push(type);
      this.questionTypes = [...new Set(this.questionTypes.map(m => m))];
    }
    else {
      for (let i = 0; i < this.questionTypes.length; i++) {
        if (this.questionTypes[i] == type) {
          this.questionTypes.splice(i, 1);
        }
      }
      this.questionTypes = [...new Set(this.questionTypes.map(m => m))];
    }
  }

  onCheckSelectChapters(event) {
    if(event.target.checked){
      for (let i = 0; i < this.chapters.length; i++) {
        var element = <HTMLInputElement> document.getElementById(this.chapters[i]['id']);
        element.checked = true;
        this.selectedChapters.push(this.chapters[i]);
      }
      this.selectedChapters = [...new Set(this.selectedChapters.map(m => m))];
    }
    else {
      for (let i = 0; i < this.selectedChapters.length; i++) {
        for (let j = 0; j < this.chapters.length; j++) {
          if (this.selectedChapters[i]['id'] == this.chapters[j]['id']) {
            this.selectedChapters.splice(i, 1);
            var element = <HTMLInputElement> document.getElementById(this.chapters[j]['id']);
            element.checked = false;
          }
        }
      }
    }
  }

  selectUnselectSingleChapter(id, event) {
    let count = 0;
    if(event.target.checked){
      for (let i = 0; i < this.chapters.length; i++) {
        if (this.chapters[i]['id'] == id) {
          var element = <HTMLInputElement> document.getElementById(this.chapters[i]['id']);
          element.checked = true;
          this.selectedChapters.push(this.chapters[i]);
        }
      }
      this.selectedChapters = [...new Set(this.selectedChapters.map(m => m))];
      for (let i = 0; i < this.selectedChapters.length; i++) {
        for (let j = 0; j < this.chapters.length; j++) {
          if (this.selectedChapters[i]['id'] == this.chapters[j]['id']) {
            count = count + 1;
          }
        }
      }
      if (count == this.chapters.length) {
        var element = <HTMLInputElement> document.getElementById("flexCheckCheckedAll");
        element.checked = true;
      }
    }
    else {
      for (let i = 0; i < this.selectedChapters.length; i++) {
        if (this.selectedChapters[i]['id'] == id) {
          this.selectedChapters.splice(i, 1);
          var element = <HTMLInputElement> document.getElementById(id);
          element.checked = false;
          var element = <HTMLInputElement> document.getElementById("flexCheckCheckedAll");
          element.checked = false;
        }
        
      }
    }
  }

  getChapters(id) {
    var element = <HTMLInputElement> document.getElementById("flexCheckCheckedAll");
    if (element) {
      element.checked = false;
    }
   else {
    setTimeout(() => {
      var element = <HTMLInputElement> document.getElementById("flexCheckCheckedAll");
      element.checked = false;
    }, 1000);
   }
    this.selectedSubjectId = id;
    for (let i = 0; i < this.subjectChapters.length; i++) {
      if (this.subjectChapters[i]['id'] == this.selectedSubjectId) {
        this.chapters = this.subjectChapters[i]['chapters'];
        this.spinner = false;
        setTimeout(() => {
          let count = 0;
          for (let i = 0; i < this.selectedChapters.length; i++) {
            for (let j = 0; j < this.chapters.length; j++) {
              if (this.selectedChapters[i]['id'] == this.chapters[j]['id']) {
                count = count + 1;
                var element = <HTMLInputElement> document.getElementById(this.chapters[j]['id']);
                element.checked = true;
              }
            }
          }
          if (count == this.chapters.length) {
            var element = <HTMLInputElement> document.getElementById("flexCheckCheckedAll");
            element.checked = true;
          }
        }, 200);
      }
    }
  }

  getSubjects() {
    this.networkRequest.getWithHeaders(`/api/subject/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("subjects ", data);
          this.subjects = data;
          
          this.selectedSubjectId = this.subjects[0]['id'];
          this.getChapters(this.selectedSubjectId);
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
    this.networkRequest.getWithHeaders(`/api/examquestionaveragetime/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("avg details ", data);
        this.avgtime = data[0]['time'];
      },
      error => {
      });
    this.networkRequest.getWithHeaders(`/api/examlinkedquestiontypes/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("linked types ", data);
        this.linkedTypes = data;
        this.linkedTypes.sort(function(a, b){  
          var sortingArr = ['mcq', 'mcc', 'boolean', 'fillup', 'fillup_option', 'assertion', 'numerical', 'subjective'];
          return sortingArr.indexOf(a.type_of_question) - sortingArr.indexOf(b.type_of_question);
        });
      },
      error => {
      });
    this.networkRequest.getWithHeaders(`/api/examsubjectwithchapters/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("subjects", data['subjects']);
        this.subjectChapters = data['subjects'];
        this.subjects = data['subjects'];
        if (this.subjects.length > 0) {
          this.selectedSubjectId = this.subjects[0]['id'];
          this.getChapters(this.selectedSubjectId);
        }
        else  {
          this.spinner = false;
        }
        console.log("examsubjectwithchapters ", this.subjectChapters);
        // this.getSubjects();
      },
      error => {
        this.spinner = false;
      });
      this.networkRequest.getWithHeaders(`/api/viewmockpaperdetails/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("exam mock parameter details ", data);
          if (data[0]) {
            this.mockParameterFound = true;
          }
        },
        error => {
        });
  }
  
  ngOnInit() {
    this.value = 5;
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
   

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
    this.route.queryParams.subscribe(
      params => {
        this.paperType = params.type;
    });
  }

  onChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }
}
