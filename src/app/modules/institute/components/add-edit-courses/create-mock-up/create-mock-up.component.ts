import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-mock-up',
  templateUrl: './create-mock-up.component.html',
  styleUrls: ['./create-mock-up.component.scss']
})
export class CreateMockUpComponent implements OnInit {

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
  subjectData = [];

  @ViewChild("myckeditor", {static: false}) ckeditor: any;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private misc: MiscellaneousService
  ) {
    this.mycontent = `<p>My html content</p>`;
  }

  calculateSubjectTime(subjectid, typeofques, value) {
    console.log("subject type value", subjectid, typeofques, value);
    var quesid = 'inputQuestion' + subjectid + typeofques;
    var timeid = 'inputTime' + subjectid + typeofques;
    console.log("quesid timeid", quesid, timeid);
    var inputElement = <HTMLInputElement>document.getElementById(quesid);
    inputElement.value = String(value);
    var inputElement = <HTMLInputElement>document.getElementById(timeid);
    inputElement.value = String(value * this.avgtime);
  }

  assignSubjectTime(subjectid, typeofques, value) {
    console.log("subject type value", subjectid, typeofques, value);
    var timeid = 'inputTime' + subjectid + typeofques;
    console.log("timeid", timeid);
    var inputElement = <HTMLInputElement>document.getElementById(timeid);
    inputElement.value = String(value);
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
    if (this.paperType == 'paper') {
      this.totalTime = totalQuestions * this.avgtime;
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

  submitFilterForm() {
    this.subjectData = [];
    console.log("selectedChapters", this.selectedChapters);
    for (let i = 0; i < this.selectedSubjects.length; i++) {
      var quesData = [];
      for (let j = 0; j < this.linkedTypes.length; j++) {
        var quesid = 'inputQuestion' + this.selectedSubjects[i]['id'] + this.linkedTypes[j]['type_of_question'];
        var timeid = 'inputTime' + this.selectedSubjects[i]['id'] + this.linkedTypes[j]['type_of_question'];
        var inputElement = <HTMLInputElement>document.getElementById(quesid);
        var inputimeElement = <HTMLInputElement>document.getElementById(timeid);
        console.log("quesid", quesid, timeid, inputimeElement);
        if (Number(inputElement.value) > 0 ) {
          console.log("ques value", Number(inputElement.value), Number(inputimeElement.value));
          quesData.push({'questions': Number(inputElement.value), 'ques_type':this.linkedTypes[j]['type_of_question'], 'time': Number(inputimeElement.value)});
        }
      }
      var chapterid = []
      for (let k = 0; k < this.selectedChapters.length; k++) {
        if (this.selectedChapters[k]['subject'] == this.selectedSubjects[i]['id']) {
          chapterid.push(this.selectedChapters[k]['id']);
        }
      }
      this.subjectData.push({'subject': this.selectedSubjects[i]['id'], 'chapters': chapterid, 'data': quesData});
      if (i == this.selectedSubjects.length - 1) {
        console.log("subject data", this.subjectData);
      }
    }

    this.submitStatus = true;
    // if (this.totalQuestions == 0) {
    //   this.toastr.error('Please enter total number of problems!', 'Oops!', {
    //     timeOut: 9000,
    //   });
    //   this.submitStatus = false;
    //   return;
    // }
    this.misc.showLoader('short');
    let chapterIds = [];
    for (let i = 0; i < this.selectedChapters.length; i++) {
      chapterIds.push(this.selectedChapters[i]['id']);
    }
    const formData = {
      chapters: chapterIds,
      difficulty: this.difficulty,
      exam: this.examId,
      show_time: this.showTime,
      subject_data: this.subjectData
    }
  this.networkRequest.putWithHeaders(formData, `/api/updatemockpaperdetails/`).subscribe(
    data => {
      this.submitStatus = false;
      console.log("mock details updated", data);
      this.misc.hideLoader();
      this.toastr.success('Parameters updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.router.navigate([`institute/view-mockpaper-parameters/${this.examId}`]);
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
  
  getSliderValue(event) {
    console.log(event.target.value);
    this.value = event.target.value;
  }

  showMakePaper() {
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
    if (this.linkedTypes.length == 1) {
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

    this.route.params.subscribe(
      data1 => {
        if (data1['exam']) {
          this.examId = data1['exam'];
          this.getExamDetails();
        }
      }
    );
   
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
