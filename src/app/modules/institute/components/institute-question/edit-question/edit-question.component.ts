import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {
  subjects: string[] = ['helo 2','helo 2','helo 6','helo 8','helo 2','helo 2','helo 6','helo 8'];
  ckeditorContent: string = '<p>Some html</p>';
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  searchIcon;
  errors = null;
  viewDetailbutton = false;
  successFlag = false;
  TagData;
  questionForm: FormGroup;
  tags;
  questionDifficulty: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  correctOption1: boolean = false;
  correctOption2: boolean = false;
  correctOption3: boolean = false;
  correctOption4: boolean = false;
  correctOption5: boolean = false;
  mcqType: boolean = false;
  mccType: boolean = false;
  fillUpType: boolean = false;
  numericalType: boolean = false;
  questionId;
  questionDetails;
  fillupDetails;
  mcqDetails;
  solutionDetails;
  selectedLanguageId;
  selectedContentId;
  correctfillOption1: boolean = false;
  correctfillOption2: boolean = false;
  correctfillOption3: boolean = false;
  correctfillOption4: boolean = false;
  fillUpOptionType: boolean = false;
  booleanType: boolean = false;
  booleanTypeVal: boolean = true;
  assertionType: boolean = false;
  fillOptionDetails;
  booleanDetails;
  numericalDetails;
  
  @ViewChild("myckeditor", {static: false}) ckeditor: any;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.mycontent = `<p>My html content</p>`;
  }

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  tag: any;
  selectedtags = [];
  languages;
  tempRemoveTag;

  setBooleanTrue() {
    this.booleanTypeVal = true;
  }

  setBooleanFalse() {
    this.booleanTypeVal = false;
  }

  onCheckChangeOption1(event) {
    if(event.target.checked){
      this.correctOption1 = true;
    }
    else {
      this.correctOption1 = false;
    }
  }

  onCheckChangeOption2(event) {
    if(event.target.checked){
      this.correctOption2 = true;
    }
    else {
      this.correctOption2 = false;
    }
  }

  onCheckChangeOption3(event) {
    if(event.target.checked){
      this.correctOption3 = true;
    }
    else {
      this.correctOption3 = false;
    }
  }

  onCheckChangeOption4(event) {
    if(event.target.checked){
      this.correctOption4 = true;
    }
    else {
      this.correctOption4 = false;
    }
  }

  onCheckChangeOption5(event) {
    if(event.target.checked){
      this.correctOption5 = true;
    }
    else {
      this.correctOption5 = false;
    }
  }

  onCheckfillChangeOption1(event) {
    if(event.target.checked){
      this.correctfillOption1 = true;
    }
    else {
      this.correctfillOption1 = false;
    }
  }

  onCheckfillChangeOption2(event) {
    if(event.target.checked){
      this.correctfillOption2 = true;
    }
    else {
      this.correctfillOption2 = false;
    }
  }

  onCheckfillChangeOption3(event) {
    if(event.target.checked){
      this.correctfillOption3 = true;
    }
    else {
      this.correctfillOption3 = false;
    }
  }

  onCheckfillChangeOption4(event) {
    if(event.target.checked){
      this.correctfillOption4 = true;
    }
    else {
      this.correctfillOption4 = false;
    }
  }

  fetchContentDetails(langId) {
    this.selectedLanguageId = langId;
    this.selectedContentId = null;
    for (let i = 0; i < this.questionDetails['contents'].length; i++) {
      if (this.questionDetails['contents'][i]['language']['id'] == this.selectedLanguageId) {
        this.selectedContentId = this.questionDetails['contents'][i]['id'];
        this.questionForm.patchValue({
          isActive: this.questionDetails['is_active'],
          difficulty: this.questionDetails['difficulty'],
          idealTime: this.questionDetails['ideal_time'],
          questionText: this.questionDetails['contents'][i]['text'],
          language: this.questionDetails['contents'][i]['language']['id'],
        });
        let tagIds = [];
        for (let i = 0; i < this.questionDetails['tags'].length; i++) {
          tagIds.push(this.questionDetails['tags'][i]['id'])
          if (i == this.questionDetails['tags'].length - 1) {
            this.questionForm.patchValue({
              tags: tagIds
            });
          } 
        }

        this.selectedtags = this.questionDetails['linked_topics'];
        this.fetchQuestiondData();
        return;
      }
      if (i == this.questionDetails['contents'].length - 1) {
        if (!this.selectedContentId) {
          this.questionForm.reset();
          this.questionForm.patchValue({
            isActive: this.questionDetails['is_active'],
            difficulty: this.questionDetails['difficulty'],
            idealTime: this.questionDetails['ideal_time'],
            language: this.selectedLanguageId,
          });
          let tagIds = [];
          for (let i = 0; i < this.questionDetails['tags'].length; i++) {
            tagIds.push(this.questionDetails['tags'][i]['id'])
            if (i == this.questionDetails['tags'].length - 1) {
              this.questionForm.patchValue({
                tags: tagIds
              });
            } 
          }

          this.selectedtags = this.questionDetails['linked_topics'];
        }
        
      }
    }
  }

  fetchQuestiondData() {
    this.networkRequest.getWithHeaders(`/api/solution/?content=${this.selectedContentId}`)
        .subscribe(
          data => {
            console.log("solution details ", data);
            this.solutionDetails = data[0];
            this.questionForm.patchValue({
              solution: this.solutionDetails['text']
            });
          },
          error => {
          });
        if (this.questionDetails['type_of_question'] == 'mcc' || this.questionDetails['type_of_question'] == 'mcq' || this.questionDetails['type_of_question'] == 'assertion') {
          if (this.questionDetails['type_of_question'] == 'mcc') {
            this.mccType = true;
          }
          if (this.questionDetails['type_of_question'] == 'mcq') {
            this.mcqType = true;
          }
          if (this.questionDetails['type_of_question'] == 'assertion') {
            this.assertionType = true;
          }
          this.networkRequest.getWithHeaders(`/api/mcqtestcase/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("mcq test cases ", data);
              this.mcqDetails = data;
              for (let i = 0; i < this.mcqDetails.length; i++) {
                if (i == 0) {
                  this.questionForm.patchValue({
                    option1: this.mcqDetails[0]['text'],
                    option1id: this.mcqDetails[0]['id']
                  });
                  this.correctOption1 = this.mcqDetails[0]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option1check");
                  element.checked = this.correctOption1;
                }
                if (i == 1) {
                  this.questionForm.patchValue({
                    option2: this.mcqDetails[1]['text'],
                    option2id: this.mcqDetails[1]['id']
                  });
                  this.correctOption2 = this.mcqDetails[1]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option2check");
                  element.checked = this.correctOption2;
                }
                if (i == 2) {
                  this.questionForm.patchValue({
                    option3: this.mcqDetails[2]['text'],
                    option3id: this.mcqDetails[2]['id']
                  });
                  this.correctOption3 = this.mcqDetails[2]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option3check");
                  element.checked = this.correctOption3;
                }
                if (i == 3) {
                  this.questionForm.patchValue({
                    option4: this.mcqDetails[3]['text'],
                    option4id: this.mcqDetails[3]['id']
                  });
                  this.correctOption4 = this.mcqDetails[3]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option4check");
                  element.checked = this.correctOption4;
                }
                if (this.assertionType && i == 4) {
                  this.questionForm.patchValue({
                    option5: this.mcqDetails[4]['text'],
                    option5id: this.mcqDetails[4]['id']
                  });
                  this.correctOption5 = this.mcqDetails[4]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option5check");
                  element.checked = this.correctOption5;
                }
              }
              
            },
            error => {
            });
        }

        if (this.questionDetails['type_of_question'] == 'fillup_option') {
         this.fillUpOptionType = true;
          this.networkRequest.getWithHeaders(`/api/fillwithoption/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("fillOptionDetails ", data);
              this.fillOptionDetails = data;
              for (let i = 0; i < this.fillOptionDetails.length; i++) {
                if (i == 0) {
                  this.questionForm.patchValue({
                    filloption1: this.fillOptionDetails[0]['text'],
                    filloption1id: this.fillOptionDetails[0]['id']
                  });
                  this.correctfillOption1 = this.fillOptionDetails[0]['correct'];
                  var element = <HTMLInputElement> document.getElementById("optionfill1check");
                  element.checked = this.correctfillOption1;
                }
                if (i == 1) {
                  this.questionForm.patchValue({
                    filloption2: this.fillOptionDetails[1]['text'],
                    filloption2id: this.fillOptionDetails[1]['id']
                  });
                  this.correctfillOption2 = this.fillOptionDetails[1]['correct'];
                  var element = <HTMLInputElement> document.getElementById("optionfill2check");
                  element.checked = this.correctfillOption2;
                }
                if (i == 2) {
                  this.questionForm.patchValue({
                    filloption3: this.fillOptionDetails[2]['text'],
                    filloption3id: this.fillOptionDetails[2]['id']
                  });
                  this.correctfillOption3 = this.fillOptionDetails[2]['correct'];
                  var element = <HTMLInputElement> document.getElementById("optionfill3check");
                  element.checked = this.correctfillOption3;
                }
                if (i == 3) {
                  this.questionForm.patchValue({
                    filloption4: this.fillOptionDetails[3]['text'],
                    filloption4id: this.fillOptionDetails[3]['id']
                  });
                  this.correctfillOption4 = this.fillOptionDetails[3]['correct'];
                  var element = <HTMLInputElement> document.getElementById("optionfill4check");
                  element.checked = this.correctfillOption4;
                }
                
              }
              
            },
            error => {
            });
        }

        if (this.questionDetails['type_of_question'] == 'fillup') {
          this.fillUpType = true;
          this.networkRequest.getWithHeaders(`/api/fillupsolution/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("fillup details ", data);
              this.fillupDetails = data[0];
              this.questionForm.patchValue({
                fillUp: this.fillupDetails['text']
              })
            },
            error => {
            });
        }
        if (this.questionDetails['type_of_question'] == 'numerical') {
          this.numericalType = true;
          this.networkRequest.getWithHeaders(`/api/stringtestcasesolution/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("fillup details ", data);
              this.numericalDetails = data[0];
              this.questionForm.patchValue({
                numerical: this.numericalDetails['text']
              })
            },
            error => {
            });
        }
        if (this.questionDetails['type_of_question'] == 'boolean') {
          this.booleanType = true;
          this.networkRequest.getWithHeaders(`/api/booleansolution/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("boolean details ", data);
              this.booleanDetails = data[0];
              this.booleanTypeVal = this.booleanDetails['option'];
              if (this.booleanDetails['option'] == true) {
                var element = <HTMLInputElement> document.getElementById("trueradio");
                element.checked = true;
              }
              else if (this.booleanDetails['option'] == false){
                var element = <HTMLInputElement> document.getElementById("falseradio");
                element.checked = true;
              }
              
            },
            error => {
            });
        }
  }

  submitForm() {
    if (!this.selectedContentId) {
      this.submitContentCreationForm();
      return;
    }
    let tagIds = [];
    for (let i = 0; i < this.selectedtags.length; i++) {
      tagIds.push(this.selectedtags[i]['id']);
    }

    if (this.mccType || this.mcqType) {
      if (!this.correctOption1 && !this.correctOption2 && !this.correctOption3 && !this.correctOption4) {
        this.toastr.error('At least one correct option is required!', 'Error!', {
          timeOut: 11000,
        });
        return;
      }
      if (this.mcqType) {
        let count = 0;
        if (this.correctOption1) {
          count = count + 1;
        }
        if (this.correctOption2) {
          count = count + 1;
        }
        if (this.correctOption3) {
          count = count + 1;
        }
        if (this.correctOption4) {
          count = count + 1;
        }
        if (this.correctOption5) {
          count = count + 1;
        }
        if (count != 1) {
          this.toastr.error('Only one correct option is allowed!', 'Error!', {
            timeOut: 11000,
          });
          return;
        }
      }
    }

    if (this.fillUpOptionType) {
      if (!this.correctfillOption1 && !this.correctfillOption2 && !this.correctfillOption3 && !this.correctfillOption4) {
        this.toastr.error('At least one correct option is required!', 'Error!', {
          timeOut: 11000,
        });
        return;
      }
      let count = 0;
      if (this.correctfillOption1) {
        count = count + 1;
      }
      if (this.correctfillOption2) {
        count = count + 1;
      }
      if (this.correctfillOption3) {
        count = count + 1;
      }
      if (this.correctfillOption4) {
        count = count + 1;
      }
      if (count != 1) {
        this.toastr.error('Only one correct option is allowed!', 'Error!', {
          timeOut: 11000,
        });
        return;
      }
    }

    const questionContentData = {
      text: this.questionForm.value.questionText,
      language: this.questionForm.value.language
    }
    this.networkRequest.putWithHeaders(questionContentData, `/api/questioncontent/${this.selectedContentId}/`).subscribe(
      data => {
        console.log("Question successfully created ", data);
        this.toastr.success('updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.getQuestionDetails();
      },
      error => {
        console.log("error ", error);
      }
    );

    let questionData;
    if (this.questionForm.value.tags) {
      questionData = {
        linked_topics: tagIds,
        is_active: this.questionForm.value.isActive,
        tags: this.questionForm.value.tags,
        difficulty: this.questionForm.value.difficulty,
        ideal_time: this.questionForm.value.idealTime
      }
    }
    else {
      questionData = {
        linked_topics: tagIds,
        is_active: this.questionForm.value.isActive,
        difficulty: this.questionForm.value.difficulty,
        ideal_time: this.questionForm.value.idealTime
      }
    }
    this.networkRequest.putWithHeaders(questionData, `/api/question/${this.questionDetails['id']}/`).subscribe(
      data => {
        console.log("Question successfully updated ", data);
        // this.toastr.success('Difficulty, tags, active status updated successfully!', 'Updated!', {
        //   timeOut: 4000,
        // });
        this.getQuestionDetails();
        this.syncTag(this.tempRemoveTag);
      },
      error => {
        console.log("error ", error);
        this.toastr.error('Some error while creating quesion features!', 'Error!', {
          timeOut: 4000,
        });
      }
    );

    const solutionData = {
      text: this.questionForm.value.solution
    }
    this.networkRequest.putWithHeaders(solutionData, `/api/solution/${this.solutionDetails['id']}/`).subscribe(
      data => {
        console.log("Solution successfully created ", data);
        // this.toastr.success('Solution Text updated successfully!', 'Updated!', {
        //   timeOut: 4000,
        // });
        this.getQuestionDetails();
      },
      error => {
        console.log("error ", error);
      }
    );

    if (this.fillUpType) {
      const fillUpData = {
        text: this.questionForm.value.fillUp
      }
      this.networkRequest.putWithHeaders(fillUpData, `/api/fillupsolution/${this.fillupDetails['id']}/`).subscribe(
        data => {
          console.log("Fill Up successfully created ", data);
          // this.toastr.success('Fill Up updated successfully!', 'Updated!', {
          //   timeOut: 4000,
          // });
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
    }
    if (this.numericalType) {
      const fillUpData = {
        text: this.questionForm.value.numerical
      }
      this.networkRequest.putWithHeaders(fillUpData, `/api/stringtestcasesolution/${this.numericalDetails['id']}/`).subscribe(
        data => {
          console.log("Numerical successfully created ", data);
          // this.toastr.success('Fill Up updated successfully!', 'Updated!', {
          //   timeOut: 4000,
          // });
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
    }
    if (this.booleanType) {
      const booleanData = {
        option: this.booleanTypeVal
      }
      this.networkRequest.putWithHeaders(booleanData, `/api/booleansolution/${this.booleanDetails['id']}/`)
      .subscribe(
        data => {
          console.log("boolean details updated ", data);
          this.getQuestionDetails();
        },
        error => {
        });
    }
    if (this.mccType || this.mcqType || this.assertionType) { 
      let mcqData;
      mcqData = {
        text: this.questionForm.value.option1,
        correct: this.correctOption1
      }
      this.networkRequest.putWithHeaders(mcqData, `/api/mcqtestcase/${this.questionForm.value.option1id}/`).subscribe(
        data => {
          console.log("MCQ Data 1 successfully created ", data);
          // this.toastr.success('MCQ Data Option 1 updated successfully!', 'Updated!', {
          //   timeOut: 4000,
          // });
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
      mcqData = {
        text: this.questionForm.value.option2,
        correct: this.correctOption2
      }
      this.networkRequest.putWithHeaders(mcqData, `/api/mcqtestcase/${this.questionForm.value.option2id}/`).subscribe(
        data => {
          console.log("MCQ Data 2 successfully created ", data);
          // this.toastr.success('MCQ Data Option 2 updated successfully!', 'Updated!', {
          //   timeOut: 4000,
          // });
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
      mcqData = {
        text: this.questionForm.value.option3,
        correct: this.correctOption3
      }
      this.networkRequest.putWithHeaders(mcqData, `/api/mcqtestcase/${this.questionForm.value.option3id}/`).subscribe(
        data => {
          console.log("MCQ Data 3 successfully created ", data);
          // this.toastr.success('MCQ Data Option 3 updated successfully!', 'Updated!', {
          //   timeOut: 4000,
          // });
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
      mcqData = {
        text: this.questionForm.value.option4,
        correct: this.correctOption4
      }
      this.networkRequest.putWithHeaders(mcqData, `/api/mcqtestcase/${this.questionForm.value.option4id}/`).subscribe(
        data => {
          console.log("MCQ Data 4 successfully created ", data);
          // this.toastr.success('MCQ Data Option 4 updated successfully!', 'Updated!', {
          //   timeOut: 4000,
          // });
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
      if (this.assertionType) {
        mcqData = {
          text: this.questionForm.value.option5,
          correct: this.correctOption5
        }
        this.networkRequest.putWithHeaders(mcqData, `/api/mcqtestcase/${this.questionForm.value.option5id}/`).subscribe(
          data => {
            console.log("MCQ Data 4 successfully created ", data);
            // this.toastr.success('MCQ Data Option 4 updated successfully!', 'Updated!', {
            //   timeOut: 4000,
            // });
            this.getQuestionDetails();
          },
          error => {
            console.log("error ", error);
          }
        );
      }
      
    }

    if (this.fillUpOptionType) { 
      let mcqData;
      mcqData = {
        text: this.questionForm.value.filloption1,
        correct: this.correctfillOption1
      }
      this.networkRequest.putWithHeaders(mcqData, `/api/fillwithoption/${this.questionForm.value.filloption1id}/`).subscribe(
        data => {
          console.log("fill option 1 successfully created ", data);
          // this.toastr.success('MCQ Data Option 1 updated successfully!', 'Updated!', {
          //   timeOut: 4000,
          // });
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
      mcqData = {
        text: this.questionForm.value.filloption2,
        correct: this.correctfillOption2
      }
      this.networkRequest.putWithHeaders(mcqData, `/api/fillwithoption/${this.questionForm.value.filloption2id}/`).subscribe(
        data => {
          console.log("fill option 2 successfully created ", data);
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
      mcqData = {
        text: this.questionForm.value.filloption3,
        correct: this.correctfillOption3
      }
      this.networkRequest.putWithHeaders(mcqData, `/api/fillwithoption/${this.questionForm.value.filloption3id}/`).subscribe(
        data => {
          console.log("fill option 3 successfully created ", data);
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
      mcqData = {
        text: this.questionForm.value.filloption4,
        correct: this.correctfillOption4
      }
      this.networkRequest.putWithHeaders(mcqData, `/api/fillwithoption/${this.questionForm.value.filloption4id}/`).subscribe(
        data => {
          console.log("fill option 4 successfully created ", data);
          this.getQuestionDetails();
        },
        error => {
          console.log("error ", error);
        }
      );
      
    }
  }

  submitContentCreationForm() {
    console.log("correct option ", this.correctOption1, this.correctOption2, this.correctOption3, this.correctOption4);
    
    let tagIds = [];
    for (let i = 0; i < this.selectedtags.length; i++) {
      tagIds.push(this.selectedtags[i]['id']);
    }

    if (this.mccType || this.mcqType) {
      if (!this.correctOption1 && !this.correctOption2 && !this.correctOption3 && !this.correctOption4) {
        this.toastr.error('At least one correct option is required!', 'Error!', {
          timeOut: 11000,
        });
        return;
      }
      if (this.mcqType) {
        let count = 0;
        if (this.correctOption1) {
          count = count + 1;
        }
        if (this.correctOption2) {
          count = count + 1;
        }
        if (this.correctOption3) {
          count = count + 1;
        }
        if (this.correctOption4) {
          count = count + 1;
        }
        if (count != 1) {
          this.toastr.error('Only one correct option is allowed!', 'Error!', {
            timeOut: 11000,
          });
          return;
        }
      }
    }

    if (this.fillUpType) {
      if (!this.questionForm.value.fillUp || this.questionForm.value.fillUp == '') {
        this.toastr.error('Fill Up can not be blank!', 'Error!', {
          timeOut: 11000,
        });
        return;
      }
    }

    if (this.numericalType) {
      if (!this.questionForm.value.numerical || this.questionForm.value.numerical == '') {
        this.toastr.error('Numerical Answer can not be blank!', 'Error!', {
          timeOut: 11000,
        });
        return;
      }
    }

    const formData = {
      text: this.questionForm.value.questionText,
      language: this.questionForm.value.language
    }
    this.networkRequest.postWithHeader(formData, `/api/questioncontent/`)
    .subscribe(
      data => {
        console.log("Question Text created ", data);
        this.toastr.success('Question Text and Language Saved successfully!', 'Created!', {
          timeOut: 4000,
        });

        let contentId = [];
        contentId.push(data['id']);
        let questionData;
        if (this.questionForm.value.tags) {
          questionData = {
            linked_topics: tagIds,
            is_active: this.questionForm.value.isActive,
            tags: this.questionForm.value.tags,
            contents: contentId,
            difficulty: this.questionForm.value.difficulty
          }
        }
        else {
          questionData = {
            linked_topics: tagIds,
            is_active: this.questionForm.value.isActive,
            contents: contentId,
            difficulty: this.questionForm.value.difficulty
          }
        }
        this.networkRequest.putWithHeaders(questionData, `/api/question/${this.questionDetails['id']}/`).subscribe(
          data => {
            console.log("Question successfully updated ", data);
            // this.toastr.success('Difficulty, tags, active status updated successfully!', 'Updated!', {
            //   timeOut: 4000,
            // });
          },
          error => {
            console.log("error ", error);
            this.toastr.error('Some error while updating quesion features!', 'Error!', {
              timeOut: 4000,
            });
          }
        );

        const solutionData = {
          text: this.questionForm.value.solution,
          questioncontent: data['id'],
        }
        this.networkRequest.postWithHeader(solutionData, `/api/solution/`)
        .subscribe(
          data2 => {
            console.log("Solution created ", data2);
            // this.toastr.success('Solution linked successfully!', 'Created!', {
            //   timeOut: 4000,
            // });
          },
          error => {
            console.log("error ", error);
            this.toastr.error('Some error while creating solution!', 'Error!', {
              timeOut: 4000,
            });
          }
        );

        if (this.mccType || this.mcqType) {
          for (let i = 0; i < 4; i++) {
            let mcqData;
            if (i == 0) {
              mcqData = {
                text: this.questionForm.value.option1,
                correct: this.correctOption1,
                questioncontent: data['id']
              }
            }
            if (i == 1) {
              mcqData = {
                text: this.questionForm.value.option2,
                correct: this.correctOption2,
                questioncontent: data['id']
              }
            }
            if (i == 2) {
              mcqData = {
                text: this.questionForm.value.option3,
                correct: this.correctOption3,
                questioncontent: data['id']
              }
            }
            if (i == 3) {
              mcqData = {
                text: this.questionForm.value.option4,
                correct: this.correctOption4,
                questioncontent: data['id']
              }
            }

            this.networkRequest.postWithHeader(mcqData, `/api/mcqtestcase/`)
            .subscribe(
              data2 => {
                console.log("MCQ Test case created ", data2);
                // this.toastr.success('MCQ Test case linked successfully!', 'Created!', {
                //   timeOut: 4000,
                // });
              },
              error => {
                console.log("error ", error);
                this.toastr.error('Some error while creating MCQ Test case!', 'Error!', {
                  timeOut: 4000,
                });
              }
            );
          }
        }
        
        if (this.fillUpType) {
          const fillUpData = {
            text: this.questionForm.value.fillUp,
            questioncontent: data['id'],
          }
          this.networkRequest.postWithHeader(fillUpData, `/api/fillupsolution/`)
          .subscribe(
            data2 => {
              console.log("Fill Up created ", data2);
              // this.toastr.success('Fill Up created and linked successfully!', 'Created!', {
              //   timeOut: 4000,
              // });
            },
            error => {
              console.log("error ", error);
              this.toastr.error('Some error while creating Fill Up!', 'Error!', {
                timeOut: 4000,
              });
            }
          );
        }

        if (this.numericalType) {
          const numericalData = {
            text: this.questionForm.value.numerical,
            questioncontent: data['id'],
          }
          this.networkRequest.postWithHeader(numericalData, `/api/stringtestcasesolution/`)
          .subscribe(
            data2 => {
              console.log("Numerical created ", data2);
              // this.toastr.success('Fill Up created and linked successfully!', 'Created!', {
              //   timeOut: 4000,
              // });
            },
            error => {
              console.log("error ", error);
              this.toastr.error('Some error while creating Numerical Answer!', 'Error!', {
                timeOut: 4000,
              });
            }
          );
        }
        
      },
      error => {
        console.log("error ", error);
        this.toastr.error('Some error while creating question text!', 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(text => text.length < 2 ? []
      : this.options.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 10))
)

removeTag(id) {
  var confirmation = confirm("Are you sure you want to remove this tag?");
  if (confirmation) {
    for (let i = 0; i < this.selectedtags.length; i++) {
      if (this.selectedtags[i]['id'] == id) {
        this.selectedtags.splice(i, 1);
        this.tempRemoveTag = id;
        this.submitForm();
      }
    }
  }
}

syncTag(id) {
  const formData = {
    ftag: id
  }
  console.log("formData ", formData);
  this.networkRequest.putWithHeaders(formData, `/api/syncmastertagbytag/`)
  .subscribe(
    data => {
      console.log("Chapter master tag updated ", data);
      this.toastr.success('Chapter Master Tag updated successfully!', 'Updated!', {
        timeOut: 4000,
      });
      this.tempRemoveTag = null;
    },
    error => {
      console.log("error ", error);
      this.toastr.error(error['error']['message'], 'Error!', {
        timeOut: 4000,
      });
    }
  );
}

detectTag(obj: any) {
  this.searchIcon = false;
  let array1 = [];
  // const objdata = {
  //   text: obj.target.value,
  // }

  let text = obj.target.value

  this.networkRequest.getWithHeaders(`/api/searchfiltertag/?text=${text}`).subscribe(
    data => {
      console.log("tags ", data);
      this.searchIcon = false;
      // @ts-ignore
      data.map((item) => {
        array1.push(item['title'])
      })
      this.options = array1
      // @ts-ignore
      this.TagData = data;
    },
    error => {
      //"Error section")
      this.errors = error['message'];
      //"error msg", this.errors);
      this.viewDetailbutton = false;
      this.searchIcon = true;
    }
  )
  if (this.options.length == 0 || obj.target.value.length < 2){
    document.getElementById("typeahead-basic").classList.remove("input-field-radius");
    this.viewDetailbutton = false;
    this.searchIcon = true;
  }
  else {
    document.getElementById("typeahead-basic").classList.add("input-field-radius");
    this.viewDetailbutton = true;
    this.searchIcon = false;
  }
  
  this.filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value))
  );
}

TagFilter() {
  let filtered = [];
  for (let i = 0; i < this.TagData.length; i++) {
    if (this.TagData[i].title == this.tag) {
      console.log("tagaaaa", this.TagData[i], this.tag);
      this.tempRemoveTag = this.TagData[i]['id'];
      filtered.push(this.TagData[i]);
      this.successFlag = true;
      setTimeout(() => {
        this.submitForm();
      }, 1100);
    }
  }
  this.selectedtags.push(filtered[0]);

  if (this.successFlag == true) {
  }
}

private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
}

  createQuestionForm() {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      isActive: [true, [Validators.required]],
      idealTime: [''],
      questionText: ['', [Validators.required]],
      tags: [''],
      difficulty: [''],
      option1: [''],
      option2: [''],
      option3: [''],
      option4: [''],
      option5: [''],
      option1id: [''],
      option2id: [''],
      option3id: [''],
      option4id: [''],
      option5id: [''],
      filloption1: [''],
      filloption2: [''],
      filloption3: [''],
      filloption4: [''],
      filloption1id: [''],
      filloption2id: [''],
      filloption3id: [''],
      filloption4id: [''],
      fillUp: [''],
      numerical: [''],
      language: [''],
      solution: ['', [Validators.required]]
    })
  }

  getQuestionDetails() {
    this.networkRequest.getWithHeaders(`/api/question/${this.questionId}/`)
    .subscribe(
      data => {
        console.log("question details ", data);
        this.questionDetails = data;
        this.selectedContentId = this.questionDetails['contents'][0]['id'];
        this.questionForm.patchValue({
          isActive: this.questionDetails['is_active'],
          difficulty: this.questionDetails['difficulty'],
          idealTime: this.questionDetails['ideal_time'],
          questionText: this.questionDetails['contents'][0]['text'],
          language: this.questionDetails['contents'][0]['language']['id']
        });
        let tagIds = [];
        for (let i = 0; i < this.questionDetails['tags'].length; i++) {
          tagIds.push(this.questionDetails['tags'][i]['id'])
          if (i == this.questionDetails['tags'].length - 1) {
            this.questionForm.patchValue({
              tags: tagIds
            });
          } 
        }

        this.selectedtags = this.questionDetails['linked_topics'];
        
        this.networkRequest.getWithHeaders(`/api/solution/?content=${this.selectedContentId}`)
        .subscribe(
          data => {
            console.log("solution details ", data);
            this.solutionDetails = data[0];
            this.questionForm.patchValue({
              solution: this.solutionDetails['text']
            });
          },
          error => {
          });
        if (this.questionDetails['type_of_question'] == 'mcc' || this.questionDetails['type_of_question'] == 'mcq'  || this.questionDetails['type_of_question'] == 'assertion') {
          if (this.questionDetails['type_of_question'] == 'mcc') {
            this.mccType = true;
          }
          if (this.questionDetails['type_of_question'] == 'mcq') {
            this.mcqType = true;
          }
          if (this.questionDetails['type_of_question'] == 'assertion') {
            this.assertionType = true;
          }
          this.networkRequest.getWithHeaders(`/api/mcqtestcase/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("mcq test cases ", data);
              this.mcqDetails = data;
              for (let i = 0; i < this.mcqDetails.length; i++) {
                if (i == 0) {
                  this.questionForm.patchValue({
                    option1: this.mcqDetails[0]['text'],
                    option1id: this.mcqDetails[0]['id']
                  });
                  this.correctOption1 = this.mcqDetails[0]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option1check");
                  element.checked = this.correctOption1;
                }
                if (i == 1) {
                  this.questionForm.patchValue({
                    option2: this.mcqDetails[1]['text'],
                    option2id: this.mcqDetails[1]['id']
                  });
                  this.correctOption2 = this.mcqDetails[1]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option2check");
                  element.checked = this.correctOption2;
                }
                if (i == 2) {
                  this.questionForm.patchValue({
                    option3: this.mcqDetails[2]['text'],
                    option3id: this.mcqDetails[2]['id']
                  });
                  this.correctOption3 = this.mcqDetails[2]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option3check");
                  element.checked = this.correctOption3;
                }
                if (i == 3) {
                  this.questionForm.patchValue({
                    option4: this.mcqDetails[3]['text'],
                    option4id: this.mcqDetails[3]['id']
                  });
                  this.correctOption4 = this.mcqDetails[3]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option4check");
                  element.checked = this.correctOption4;
                }
                if (this.assertionType && i == 4) {
                  this.questionForm.patchValue({
                    option5: this.mcqDetails[4]['text'],
                    option5id: this.mcqDetails[4]['id']
                  });
                  this.correctOption5 = this.mcqDetails[4]['correct'];
                  var element = <HTMLInputElement> document.getElementById("option5check");
                  element.checked = this.correctOption5;
                }
              }
              
            },
            error => {
            });
        }
        if (this.questionDetails['type_of_question'] == 'fillup') {
          this.fillUpType = true;
          this.networkRequest.getWithHeaders(`/api/fillupsolution/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("fillup details ", data);
              this.fillupDetails = data[0];
              this.questionForm.patchValue({
                fillUp: this.fillupDetails['text']
              })
            },
            error => {
            });
        }

        if (this.questionDetails['type_of_question'] == 'numerical') {
          this.numericalType = true;
          this.networkRequest.getWithHeaders(`/api/stringtestcasesolution/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("fillup details ", data);
              this.numericalDetails = data[0];
              this.questionForm.patchValue({
                numerical: this.numericalDetails['text']
              })
            },
            error => {
            });
        }

        if (this.questionDetails['type_of_question'] == 'boolean') {
          this.booleanType = true;
          this.networkRequest.getWithHeaders(`/api/booleansolution/?content=${this.selectedContentId}`)
          .subscribe(
            data => {
              console.log("boolean details ", data);
              this.booleanDetails = data[0];
              this.booleanTypeVal = this.booleanDetails['option'];
              if (this.booleanDetails['option'] == true) {
                var element = <HTMLInputElement> document.getElementById("trueradio");
                element.checked = true;
              }
              else if (this.booleanDetails['option'] == false){
                var element = <HTMLInputElement> document.getElementById("falseradio");
                element.checked = true;
              }
            },
            error => {
            });
        }

        if (this.questionDetails['type_of_question'] == 'fillup_option') {
          this.fillUpOptionType = true;
           this.networkRequest.getWithHeaders(`/api/fillwithoption/?content=${this.selectedContentId}`)
           .subscribe(
             data => {
               console.log("fillOptionDetails ", data);
               this.fillOptionDetails = data;
               for (let i = 0; i < this.fillOptionDetails.length; i++) {
                 if (i == 0) {
                   this.questionForm.patchValue({
                     filloption1: this.fillOptionDetails[0]['text'],
                     filloption1id: this.fillOptionDetails[0]['id']
                   });
                   this.correctfillOption1 = this.fillOptionDetails[0]['correct'];
                   var element = <HTMLInputElement> document.getElementById("optionfill1check");
                   element.checked = this.correctfillOption1;
                 }
                 if (i == 1) {
                   this.questionForm.patchValue({
                     filloption2: this.fillOptionDetails[1]['text'],
                     filloption2id: this.fillOptionDetails[1]['id']
                   });
                   this.correctfillOption2 = this.fillOptionDetails[1]['correct'];
                   var element = <HTMLInputElement> document.getElementById("optionfill2check");
                   element.checked = this.correctfillOption2;
                 }
                 if (i == 2) {
                   this.questionForm.patchValue({
                     filloption3: this.fillOptionDetails[2]['text'],
                     filloption3id: this.fillOptionDetails[2]['id']
                   });
                   this.correctfillOption3 = this.fillOptionDetails[2]['correct'];
                   var element = <HTMLInputElement> document.getElementById("optionfill3check");
                   element.checked = this.correctfillOption3;
                 }
                 if (i == 3) {
                   this.questionForm.patchValue({
                     filloption4: this.fillOptionDetails[3]['text'],
                     filloption4id: this.fillOptionDetails[3]['id']
                   });
                   this.correctfillOption4 = this.fillOptionDetails[3]['correct'];
                   var element = <HTMLInputElement> document.getElementById("optionfill4check");
                   element.checked = this.correctfillOption4;
                 }
                 
               }
               
             },
             error => {
             });
         }
        
      },
      error => {
      });
  }

  getTags() {
    this.networkRequest.getWithHeaders('/api/questiontag/')
      .subscribe(
        data => {
          console.log("tags ", data);
          this.tags = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  getLanguages() {
    this.networkRequest.getWithHeaders('/api/questionlanguage/')
      .subscribe(
        data => {
          console.log("languages ", data);
          this.languages = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit() {
    this.getTags();
    this.getLanguages();
    this.createQuestionForm();
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    this.route.queryParams.subscribe(
      params => {
        this.questionId = params.id;
        if (this.questionId) {
          this.getQuestionDetails();
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
