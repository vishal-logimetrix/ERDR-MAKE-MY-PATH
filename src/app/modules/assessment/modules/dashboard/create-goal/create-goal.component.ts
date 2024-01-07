import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { CourseSwitchService } from '../../../services/course-switch.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AlertService } from '../../../../../services/alert.service';

@Component({
  selector: 'app-create-goal',
  templateUrl: './create-goal.component.html',
  styleUrls: ['./create-goal.component.scss']
})
export class CreateGoalComponent implements OnInit {

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
  fullSyllabus: boolean = false;
  goalTitle;
  endDate;
  allChapterIds = [];
  currentStep: number = 1;
  currentStepNew: number = 1;
  stepNumber;
  level = "beginner";

  @ViewChild("myckeditor", {static: false}) ckeditor: any;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private router: Router,
    private misc: MiscellaneousService,
    private alertService: AlertService
  ) {
    this.mycontent = `<p>My html content</p>`;
  }
  goToStep(stepNumber){
    this.currentStep = stepNumber;
  }

  showPage;

  @ViewChild('widgetsContent') widgetsContent: ElementRef;

  slideRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  };
  slideLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  };

  showChapterList(){
    if (!this.goalTitle) {
      this.toastr.error("Please enter goal title", 'Oops!', {
        timeOut: 4000,
      });
      return;
    }
    if (!this.endDate) {
      this.toastr.error("Please enter end date", 'Oops!', {
        timeOut: 4000,
      });
      return;
    }
    this.currentStep = 1;
    this.currentStepNew = 2;
  }
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

  createNewGoal() {
    this.showPage = false;
    this.router.navigate([`/assessment/dashboard/add-goal/${this.examId}`]);
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

  confirmSubmission() {
    this.alertService.showAlert({ text: 'You wont be able to change goal parameters once you start your goal' }, 'info', 'confirm')
    .subscribe(data => {
      if (data) {
        this.submitFilterForm();
      }
    });
  }

  submitFilterForm() {
    if (this.selectedChapters.length == 0) {
      this.toastr.error("Please select some chapters before proceeding", 'Error!', {
        timeOut: 4000,
      });
      return;
    }
    this.submitStatus = true;
   
    this.abcd=false;
    this.efgh=true;
    let chapterIds = [];
    // if (this.fullSyllabus) {
    //   console.log("allChapterIds", this.allChapterIds);
    //   chapterIds = this.allChapterIds;
    // }
    // else {
    //   for (let i = 0; i < this.selectedChapters.length; i++) {
    //     chapterIds.push(this.selectedChapters[i]['id']);
    //   }
    // }
    for (let i = 0; i < this.selectedChapters.length; i++) {
      chapterIds.push(this.selectedChapters[i]['id']);
      for (let j = 0; j < this.subjects.length; j++) {
        if (this.subjects[j]['id'] == this.selectedChapters[i]['subject']) {
          this.selectedSubjects.push(this.subjects[j]['id']);
        }
      }
    }
    
    this.selectedSubjects = [...new Set(this.selectedSubjects.map(m => m))];
    
    let formData;

    var finalDate = new Date(this.endDate);
    if (this.allChapterIds.length == chapterIds.length) {
      this.fullSyllabus = true;
    }
    else {
      this.fullSyllabus = false;
    }
    
    const LearnerExamData = {
      exam: this.examId
    }
    this.networkRequest.postWithHeader(LearnerExamData, `/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exam linked ", data);
        if (this.fullSyllabus) {
          formData = {
            chapters: chapterIds,
            subjects: this.selectedSubjects,
            title: this.goalTitle,
            last_date: finalDate,
            syllabus: 'full',
            level: this.level,
            is_active: true,
            exam: this.examId
          }
        }
        else {
          formData = {
            chapters: chapterIds,
            subjects: this.selectedSubjects,
            title: this.goalTitle,
            last_date: finalDate,
            syllabus: 'partial',
            level: this.level,
            is_active: true,
            exam: this.examId
          }
        }
        this.networkRequest.postWithHeader(formData, `/api/learnerexamgoals/`).subscribe(
          data => {
            this.submitStatus = false;
           
            this.courseswitchservice.updateReloadPageStatus(true);

            this.generateAssessmentPaper(data['id']);

            // this.router.navigate([`/assessment/dashboard/goal-details/${this.examId}`],{
            //   queryParams: {
            //     goal: data['id']
            //   }
            // });
           
          },
          error => {
            this.submitStatus = false;
            this.misc.hideLoader();
            console.log("error ", error);
            this.toastr.error(error['error']['errors'][0], 'Error!', {
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

  generateAssessmentPaper(id) {
    const formData = {
      goal: id
    }
    this.networkRequest.putWithHeaders(formData, `/api/creategoalassessment/`)
    .subscribe(
      data => {
        console.log("assessment paper generated ", data);
        // this.misc.hideLoader();
      
        this.router.navigate([`/assessment/paper/self-assessment-paper/${this.examId}`],{
          queryParams: {
            paper: data['id']
          }
        });
      },
      error => {
        console.log("error", error);
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
      }
    );
  }
  
  getSliderValue(event) {
    console.log(event.target.value);
    this.value = event.target.value;
  }

  coverFullSyllabus() {
    this.fullSyllabus = true;
    this.chooseSubjectsFlag = false;
    // for (let i = 0; i < this.allChapterIds.length; i++) {
    //   // var element = <HTMLInputElement> document.getElementById(this.allChapterIds[i]);
    //   // element.checked = true;
    //   this.selectedChapters.push(this.allChapterIds[i]);
    // }
    // this.selectedChapters = [...new Set(this.selectedChapters.map(m => m))];

    for (let i = 0; i < this.subjectChapters.length; i++) {
      // if (this.subjectChapters[i]['id'] == this.selectedSubjectId) {
        this.chapters = this.subjectChapters[i]['chapters'];
        for (let k = 0; k < this.chapters.length; k++) {
          this.selectedChapters.push(this.chapters[k]);
        }
        // setTimeout(() => {
        //   let count = 0;
        //   // for (let i = 0; i < this.selectedChapters.length; i++) {
        //     for (let j = 0; j < this.chapters.length; j++) {
        //       if (this.selectedChapters[i]['id'] == this.chapters[j]['id']) {
        //         count = count + 1;
        //         var element = <HTMLInputElement> document.getElementById(this.chapters[j]['id']);
        //         element.checked = true;
        //       }
        //     }
        //   // }
        //   if (count == this.chapters.length) {
        //     var element = <HTMLInputElement> document.getElementById("flexCheckCheckedAll");
        //     element.checked = true;
        //   }
        // }, 200);
      // }
    }
    this.selectedChapters = [...new Set(this.selectedChapters.map(m => m))];
    console.log("selectedChapters", this.selectedChapters);
    for (let i = 0; i < this.subjects.length; i++) {
      console.log("subjects[i]['id']", this.subjects[i]['id']);
      this.getChapters(this.subjects[i]['id']);
    }
  }

  showMakePaper() {
    // this.totalQuestions = 5;
    // this.calculateTime(this.totalQuestions);
    // console.log("selected chapters", this.selectedChapters);
    // for (let i = 0; i < this.selectedChapters.length; i++) {
    //   for (let j = 0; j < this.subjects.length; j++) {
    //     if (this.subjects[j]['id'] == this.selectedChapters[i]['subject']) {
    //       this.selectedSubjects.push(this.subjects[j]);
    //     }
    //   }
    // }
    // // this.selectedSubjects = [...new Set(this.selectedSubjects.map(m => m))];
    // // this.selectedSubjects = this.selectedSubjects.filter((el, i, a) => i === a.indexOf(el));
    // this.selectedSubjects = Array.from(this.selectedSubjects.reduce((m, t) => m.set(t.id, t), new Map()).values());
    // console.log("selected subjects", this.selectedSubjects);
    // if (this.selectedSubjects.length == 0 && !this.fullSyllabus) {
    //   this.toastr.error('Please select at least one chapter!', 'Error!', {
    //     timeOut: 4000,
    //   });
    //   return;
    // }
    // if (this.linkedTypes.length >= 1) {
    //   setTimeout(() => {
    //     var element = <HTMLInputElement> document.getElementById("customCheck0");
    //     element.checked = true;
    //   }, 1000);
    //   if (this.linkedTypes[0]['is_active']) {
    //     this.questionTypes.push(this.linkedTypes[0]['type_of_question']);
    //     this.questionTypes = [...new Set(this.questionTypes.map(m => m))];
    //   }
    // }
    this.currentStep = 3;
  }
  showAssessment() {
    this.currentStep = 4;
  }

  resetChaptersSelection() {
    // this.selectedChapters = [];
    this.chooseSubjectsFlag = true;
    this.totalQuestions = 0;
    this.totalTime = 0;
    this.selectedChapters = [];
    this.selectedSubjects = [];
    this.fullSyllabus = false;
    
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
        this.subjectChapters = data['subjects'];
        this.subjects = data['subjects'];
        this.selectedSubjectId = this.subjects[0]['id'];
        this.getChapters(this.selectedSubjectId);
        console.log("examsubjectwithchapters ", this.subjectChapters);
        // this.getSubjects();
        for (let i = 0; i < this.subjects.length; i++) {
          this.networkRequest.getWithHeaders(`/api/chapter/?subject=${this.subjects[i]['id']}`)
            .subscribe(
              data => {
                console.log("chapters ", data);
                var chapters = data;
                //@ts-ignore
                for (let j = 0; j < chapters.length; j++) {
                  this.allChapterIds.push(chapters[j]['id']);
                }
              },
              error => {
                // console.log("error ", error);
              }
            );
        }
      },
      error => {
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
        if (params.error == 'true') {
          this.showPage = true;
        }
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
