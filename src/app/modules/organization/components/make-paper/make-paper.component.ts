import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

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
  linkedTypes;
  showTime: boolean = true;
  subjectChapters;
  errorMsg;
  startDate;
  startTime;
  endDate;
  endTime;
  batchId;
  totalusers;
  batchDetails;
  submitStatus: boolean = false;
  spinner:boolean = true;

  @ViewChild("myckeditor", {static: false}) ckeditor: any;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private courseswitchservice: BatchServiceService,
    private router: Router,
    private misc: MiscellaneousService
  ) {
    this.mycontent = `<p>My html content</p>`;
  }

  @ViewChild('widgetsContent') widgetsContent: ElementRef;

  slideRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  };
  slideLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;
  };

  manageNegTime() {
    if (this.totalTime < 0) {
      this.totalTime = 0;
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
    if (this.paperType == 'paper') {
      //@ts-ignore
      this.totalTime = (totalQuestions * this.avgtime).toFixed(2);
      
      console.log("totalTime", this.totalTime);
    }
    else {
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
    this.totalTime = this.totalTime + 1;
  }

  decTime() {
    this.totalTime = this.totalTime - 1;
    if (this.totalTime < 0) {
      this.totalTime = 0;
    }
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
  }

  submitFilterForm() {
    this.submitStatus = true;
    this.misc.showLoader('short');
    console.log("startDate", this.startDate, this.startTime, this.endDate, this.endTime);
    // return;
    // this.toastr.success('Fetching Questions Please Wait!', 'Searching!', {
    //   timeOut: 9000,
    // });
    let chapterIds = [];
    for (let i = 0; i < this.selectedChapters.length; i++) {
      chapterIds.push(this.selectedChapters[i]['id']);
    }
    let formData;
    
    const LearnerExamData = {
      exam: this.examId
    }
    this.networkRequest.postWithHeader(LearnerExamData, `/api/mentorexam/`)
    .subscribe(
      data => {
        console.log(" exam linked ", data);
      },
      error => {
        console.log("error in mentor exam linking", error);
        this.toastr.error('Some error occured!', 'Error!', {
          timeOut: 4000,
        });
      }
    );
    
    formData = {
      chapters: chapterIds,
      totalQues: Number(this.totalQuestions),
      quesTypes: this.questionTypes,
      difficulty: this.difficulty,
      exam: this.examId,
      batch: this.batchId,
      endDate: this.endDate,
      endTime: this.endTime,
      startDate: this.startDate,
      startTime: this.startTime,
      show_time: this.showTime,
    }
    this.networkRequest.putWithHeaders(formData, `/api/findmentoractualpaperquestions/`).subscribe(
      data => {
        this.submitStatus = false;
        console.log("Questions found ", data);
        this.misc.hideLoader();
        this.fetchedQuestions = data['questions'];
        if (this.fetchedQuestions.length > 0) {
          this.toastr.success('Questions found!', 'Found!', {
            timeOut: 4000,
          });
        }
        else if (this.fetchedQuestions.length == 0) {
          this.toastr.error('No question found!', 'Error!', {
            timeOut: 4000,
          });
          return;
        }

        this.router.navigate([`/organization/paper-questions/${this.batchId}`],{
          queryParams: {
            tmpobj: data['id']
          }
        });
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['message'], 'Error!', {
          timeOut: 4000,
        });
      }
    );

    // if (this.paperType == 'practice') {
    //   formData = {
    //     chapters: chapterIds,
    //     totalQues: this.totalQuestions,
    //     quesTypes: this.questionTypes,
    //     difficulty: this.difficulty,
    //     exam: this.examId,
    //     show_time: this.showTime,
    //     startDate: this.startDate,
    //     startTime: this.startTime,
    //     endDate: this.endDate,
    //     endTime: this.endTime,
    //     batch: this.batchId,
    //     type: this.paperType
    //   }
    // }
    // else {
    //   formData = {
    //     chapters: chapterIds,
    //     totalQues: this.totalQuestions,
    //     totalTime: this.totalTime,
    //     quesTypes: this.questionTypes,
    //     difficulty: this.difficulty,
    //     exam: this.examId,
    //     show_time: this.showTime,
    //     startDate: this.startDate,
    //     startTime: this.startTime,
    //     endDate: this.endDate,
    //     endTime: this.endTime,
    //     batch: this.batchId,
    //     type: 'paper'
    //   }
    // }
    // this.networkRequest.putWithHeaders(formData, `/api/makementorpaper/`).subscribe(
    //   data => {
    //     this.submitStatus = false;
    //     console.log("Questions found ", data);
    //     this.misc.hideLoader();
    //     this.fetchedQuestions = data['questions'];
    //     if (this.fetchedQuestions.length > 0) {
    //       this.toastr.success('Questions found!', 'Found!', {
    //         timeOut: 4000,
    //       });
    //     }
    //     else if (this.fetchedQuestions.length == 0) {
    //       this.toastr.error('No question found!', 'Error!', {
    //         timeOut: 4000,
    //       });
    //       return;
    //     }
    //     let quesIds = [];

    //     this.router.navigate([`/organization/exam-questions/${this.batchId}`],{
    //       queryParams: {
    //         paper: data['id']
    //       }
    //     });
       
    //   },
    //   error => {
    //     this.submitStatus = false;
    //     this.misc.hideLoader();
    //     console.log("error ", error);
    //     this.toastr.error(error['error']['message'], 'Error!', {
    //       timeOut: 4000,
    //     });
    //   }
    // );
  }
  
  getSliderValue(event) {
    console.log(event.target.value);
    this.value = event.target.value;
  }

  showMakePaper() {
    var currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes()+10);
    this.startDate = currentDate.toISOString().split('T')[0];
    this.startTime = currentDate.toTimeString().split(':')[0] + ':' + currentDate.toTimeString().split(':')[1];
    this.totalQuestions = 5;
    this.calculateTime(this.totalQuestions);
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
  
  ngOnInit() {
    this.value = 5;
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
   
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.courseswitchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
        }
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
