import { Component, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { CourseSwitchService } from '../../../services/course-switch.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { AlertService } from '../../../../../services/alert.service';

@Component({
  selector: 'app-edit-path-title',
  templateUrl: './edit-path-title.component.html',
  styleUrls: ['./edit-path-title.component.scss']
})
export class EditPathTitleComponent implements OnInit {

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
  goalId;
  goalDetails;

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
  showChapterList(){
    // if (!this.goalTitle) {
    //   this.toastr.error("Please enter goal title", 'Oops!', {
    //     timeOut: 4000,
    //   });
    //   return;
    // }
    this.currentStep = 2;
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
    this.submitStatus = true;
   
    let formData;

    var finalDate = new Date(this.endDate);

    formData = {
      title: this.goalTitle,
      last_date: finalDate,
      level: this.level,
    }
    
   this.networkRequest.putWithHeaders(formData, `/api/learnerexamgoals/${this.goalId}/`).subscribe(
    data => {
      console.log("dataaaaa", data);
      this.submitStatus = false;
      this.toastr.success("Parameters successfully updated", 'Done!', {
        timeOut: 4000,
      });
      this.courseswitchservice.updateReloadPageStatus(true);
      this.router.navigate([`/assessment/dashboard/edit-path-syllabus/${this.examId}`],{
        queryParams: {
          goal: this.goalId
        }
      });
    },
    error => {
      this.submitStatus = false;
      this.misc.hideLoader();
      console.log("error ", error);
      this.toastr.error(error['error']['message'], 'Error!', {
        timeOut: 4000,
      });
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

  goalExamCreation() {
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

  fetchGoalDetails() {
    this.networkRequest.getWithHeaders(`/api/learnerexamgoals/${this.goalId}/`).subscribe(
      data => {
        this.goalDetails = data;
        console.log("Goal details ", data);
        this.goalTitle = this.goalDetails['title'];
        this.level = this.goalDetails['level'];
        var currentDate = new Date( this.goalDetails['last_date']);
        this.endDate = currentDate.toISOString().split('T')[0];
        if (this.goalDetails['evaluation_done']) {
          this.router.navigate([`/assessment/dashboard/goal-path/${this.goalId}`], {
            queryParams: {
              exam: this.examId
            }
          });
        }
      },
      error => {
        console.log("error ", error);
      }
    );

    // this.networkRequest.getWithHeaders(`/api/fetchgoalpaper/?goal=${this.goalId}`).subscribe(
    //   data => {
    //     //@ts-ignore
    //     if (data.length > 0) {
    //       this.paperDetails = data[0];
    //       if (this.paperDetails['paper_complete']) {
    //         this.currentStep = 5;
    //       }
    //     }
    //     console.log("Goal paper details ", data);
    //   },
    //   error => {
    //     console.log("error ", error);
    //   }
    // );
  }
  
  ngOnInit() {
    this.value = 5;
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
   
    this.route.queryParams.subscribe(
      params => {
        this.goalId = params.goal;
        this.fetchGoalDetails();
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
