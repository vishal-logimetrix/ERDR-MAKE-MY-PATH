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
  selector: 'app-make-practice',
  templateUrl: './make-practice.component.html',
  styleUrls: ['./make-practice.component.scss']
})
export class MakePracticeComponent implements OnInit {

  @ViewChild('closeModald') closeModald: ElementRef;

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
  totalQuestions: number = 10;
  totalTime: number = 0;
  questionTypes = [];
  difficulty: number = 5;
  fetchedQuestions;
  paperType = 'practice';
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
  selectedChapterid;
  quesTypes = [];
  showSubjective: boolean = false;
  includeSubjectiveflag: boolean = true;
  excludeSubjectiveflag: boolean = false;
  ifanydifficulty: boolean = false;
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

  saveChapterId(id) {
    this.selectedChapterid = id;
    this.selectDifficultyLevel(2, 5);
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

  includeSubjective(event) {
    if(event.target.checked){
      this.quesTypes.push('subjective');
    }
    else {
      this.excludeSubjective();
    }
  }

  excludeSubjective() {
    for (let i = 0; i < this.quesTypes.length; i++) {
      if (this.quesTypes[i] == "subjective") {
        this.quesTypes.splice(i, 1);
      }
    }
  }

  includeObjective(event) {
    if(event.target.checked){
      for (let i = 0; i < this.linkedTypes.length; i++) {
        if (this.linkedTypes[i]['type_of_question'] != 'subjective') {
          this.quesTypes.push(this.linkedTypes[i]['type_of_question']);
        }
      }
      this.quesTypes = [...new Set(this.quesTypes.map(m => m))];
    }
    else {
      this.excludeObjective();
    }
  }

  excludeObjective() {
    for (let i = 0; i < this.quesTypes.length; i++) {
      if (this.quesTypes[i] != "subjective") {
        this.quesTypes.splice(i, 1);
      }
    }
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

  selectDifficultyLevel(i, level) {
    this.ifanydifficulty = false;
    this.difficulty = level;
    let id = "";
    for (let i = 1; i < 4; i++){
      id = "regi" + i;
      document.getElementById(id).classList.remove("selected");
    }
    id = "";
    id = "regi" + i;
    document.getElementById(id).classList.add("selected");
    document.getElementById('allrange').classList.remove("selected");
  }

  selectAnyRange() {
    this.ifanydifficulty = true;
    let id = "";
    for (let i = 1; i < 4; i++){
      id = "regi" + i;
      document.getElementById(id).classList.remove("selected");
    }
    document.getElementById('allrange').classList.add("selected");
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
    // for (let i = 0; i < this.selectedChapters.length; i++) {
    //   chapterIds.push(this.selectedChapters[i]['id']);
    // }
    chapterIds.push(this.selectedChapterid);
    let formData;
    this.closeModald.nativeElement.click();
    
    const LearnerExamData = {
      exam: this.examId
    }
    this.networkRequest.postWithHeader(LearnerExamData, `/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exam linked ", data);
        formData = {
          chapters: chapterIds,
          totalQues: 10,
          quesTypes: this.quesTypes,
          difficulty: this.difficulty,
          learnerExam: data['id'],
          exam: this.examId,
          show_time: this.showTime,
          type: this.paperType,
          anydifficulty: this.ifanydifficulty
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

            this.router.navigate([`/assessment/paper/practice-paper/${this.examId}`],{
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
   
    this.selectedSubjectId = id;
    
    // this.networkRequest.getWithHeaders(`/api/getlearnerexampracticechapters/?subject=${this.selectedSubjectId}&exam=${this.examId}`)
    // .subscribe(
    //   data => {
    //     console.log("learner exam chapters ", data);
    //     this.chapters = data;
    //   },
    //   error => {
    //     console.log("error ", error);
    //   }
    // );
    if (this.isAuthenticated) {
      this.networkRequest.getWithHeaders(`/api/student_practice_chapter_data/${this.examId}/?subject=${this.selectedSubjectId}`)
      .subscribe(
        data => {
          console.log("student chapter details ", data);
          this.chapters = data['chapters'];
          this.spinner = false;
        },
        error => {
          console.log("error ", error);
          this.spinner = false;
        }
      );
    }
    else {
      this.networkRequest.getWithHeaders(`/api/chapter/?subject=${this.selectedSubjectId}`)
      .subscribe(
        data => {
          console.log("chapter ", data);
          this.chapters = data;
        },
        error => {
          console.log("error ", error);
        }
      );
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
        for (let i = 0; i < this.linkedTypes.length; i++) {
          this.quesTypes.push(this.linkedTypes[i]['type_of_question']);
        }
        this.quesTypes = [...new Set(this.quesTypes.map(m => m))];
        if (this.quesTypes.includes('subjective')) {
          this.showSubjective = true;
          this.excludeSubjective();
          setTimeout(() => {
            var element = <HTMLInputElement> document.getElementById('customCheck');
            element.checked = true;
            // var element2 = <HTMLInputElement> document.getElementById('customCheckSecond');
            // element2.checked = true;
          }, 1000);
        }
        this.linkedTypes.sort(function(a, b){  
          var sortingArr = ['mcq', 'mcc', 'boolean', 'fillup', 'fillup_option', 'assertion', 'numerical', 'subjective'];
          return sortingArr.indexOf(a.type_of_question) - sortingArr.indexOf(b.type_of_question);
        });
      },
      error => {
      });
    // this.networkRequest.getWithHeaders(`/api/examsubjectwithchapters/?exam=${this.examId}`)
    // .subscribe(
    //   data => {
    //     this.subjectChapters = data['subjects'];
    //     this.subjects = data['subjects'];
    //     this.selectedSubjectId = this.subjects[0]['id'];
    //     this.getChapters(this.selectedSubjectId);
    //     console.log("examsubjectwithchapters ", this.subjectChapters);
    //     // this.getSubjects();
    //   },
    //   error => {
    //   });
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
                this.getSubjects();
              }
            }
          );
        }
        else {
          this.examId = data;
          this.getExamDetails();
          this.getSubjects();
        }
    });
    // this.route.queryParams.subscribe(
    //   params => {
    //     this.paperType = params.type;
    // });
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
