import { Component, OnInit, ViewChild } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { CourseSwitchService } from '../../../services/course-switch.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';

@Component({
  selector: 'app-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss']
})
export class GoalDetailsComponent implements OnInit {

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
  currentStep: number = 3;
  stepNumber;
  goalId;
  goalDetails;
  paperDetails;

  @ViewChild("myckeditor", {static: false}) ckeditor: any;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: CourseSwitchService,
    private router: Router,
    private misc: MiscellaneousService
  ) { this.mycontent = `<p>My html content</p>`;}
  
  goToCreateMyPath(){
    this.currentStep = 5;
  }
  goToStep(stepNumber){
    this.currentStep = stepNumber;
  }
  showChapterList(){
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
   
    this.abcd=false;
    this.efgh=true;
    let chapterIds = [];
    if (this.fullSyllabus) {
      console.log("allChapterIds", this.allChapterIds);
      chapterIds = this.allChapterIds;
    }
    else {
      for (let i = 0; i < this.selectedChapters.length; i++) {
        chapterIds.push(this.selectedChapters[i]['id']);
      }
    }
    
    let formData;
    
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
            title: this.goalTitle,
            last_date: this.endDate,
            syllabus: 'full',
            is_active: true,
            exam: this.examId
          }
        }
        else {
          formData = {
            chapters: chapterIds,
            title: this.goalTitle,
            last_date: this.endDate,
            syllabus: 'partial',
            is_active: true,
            exam: this.examId
          }
        }
        this.networkRequest.postWithHeader(formData, `/api/learnerexamgoals/`).subscribe(
          data => {
            this.submitStatus = false;
           
            this.courseswitchservice.updateReloadPageStatus(true);

            this.router.navigate([`/assessment/dashboard/choose-p/${this.examId}`],{
             
            });
           
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

  coverFullSyllabus() {
    this.fullSyllabus = true;
    this.chooseSubjectsFlag = false;
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
    if (this.selectedSubjects.length == 0 && !this.fullSyllabus) {
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
    this.currentStep = 3;
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

  generateAssessmentPaper() {
    const formData = {
      goal: this.goalId
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

  fetchGoalDetails() {
    this.networkRequest.getWithHeaders(`/api/learnerexamgoals/${this.goalId}/`).subscribe(
      data => {
        this.goalDetails = data;
        console.log("Goal details ", data);
        if (!this.goalDetails.evaluation_done) {
          this.generateAssessmentPaper();
        }
        else if (this.goalDetails.evaluation_done && !this.goalDetails.assessment_done) {
          this.goalExamCreation();
        }
      },
      error => {
        console.log("error ", error);
      }
    );

    this.networkRequest.getWithHeaders(`/api/fetchgoalpaper/?goal=${this.goalId}`).subscribe(
      data => {
        //@ts-ignore
        if (data.length > 0) {
          this.paperDetails = data[0];
          if (this.paperDetails['paper_complete']) {
            this.currentStep = 5;
          }
        }
        console.log("Goal paper details ", data);
      },
      error => {
        console.log("error ", error);
      }
    );
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
