import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-edit-selfassessques',
  templateUrl: './edit-selfassessques.component.html',
  styleUrls: ['./edit-selfassessques.component.scss']
})
export class EditSelfassessquesComponent implements OnInit {

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
  correctOption6: boolean = false;
  correctOption7: boolean = false;
  correctOption8: boolean = false;
  correctOption9: boolean = false;
  correctOption10: boolean = false;
  correctfillOption1: boolean = false;
  correctfillOption2: boolean = false;
  correctfillOption3: boolean = false;
  correctfillOption4: boolean = false;
  mcqType: boolean = false;
  mccType: boolean = false;
  fillUpType: boolean = false;
  fillUpOptionType: boolean = false;
  numericalType: boolean = false;
  assertionType: boolean = false;
  booleanType: boolean = false;
  subjectiveType: boolean = false;
  booleanTypeVal: boolean = true;
  examId;

  questionTypes = [ 
    {val: 'mcq', name: 'Single Correct Choice'},
    {val: 'mcc', name: 'Multiple Correct Choice'},
    {val: 'fillup', name: 'Fill In The Blanks'},
  ]
  
  @ViewChild("myckeditor", {static: false}) ckeditor: any;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.mycontent = `<p>My html content</p>`;
  }

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  tag: any;
  selectedtags = [];
  languages;
  questionId;
  questionDetails;
  fillupDetails;
  mcqDetails;
  selectedContentId;

  setBooleanTrue() {
    this.booleanTypeVal = true;
  }

  setBooleanFalse() {
    this.booleanTypeVal = false;
  }

  changeType(event) {
    this.questionForm.patchValue({
      option1: null,
      option2: null,
      option3: null,
      option4: null,
      option5: null,
      option6: null,
      option7: null,
      option8: null,
      option9: null,
      option10: null
    });
    this.mcqType = false;
    this.mccType = false;
    this.fillUpType = false;
    this.assertionType = false;
    this.booleanType = false;
    this.fillUpOptionType = false;
    this.numericalType = false;
    this.subjectiveType = false;
    if (event.target.value == 'mcq') {
      this.mcqType = true;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (event.target.value == 'mcc') {
      this.mcqType = false;
      this.mccType = true;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (event.target.value == 'fillup') {
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = true;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else {
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.numericalType = false;
    }
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

  onCheckChangeOption6(event) {
    if(event.target.checked){
      this.correctOption6 = true;
    }
    else {
      this.correctOption6 = false;
    }
  }

  onCheckChangeOption7(event) {
    if(event.target.checked){
      this.correctOption7 = true;
    }
    else {
      this.correctOption7 = false;
    }
  }

  onCheckChangeOption8(event) {
    if(event.target.checked){
      this.correctOption8 = true;
    }
    else {
      this.correctOption8 = false;
    }
  }

  onCheckChangeOption9(event) {
    if(event.target.checked){
      this.correctOption9 = true;
    }
    else {
      this.correctOption9 = false;
    }
  }

  onCheckChangeOption10(event) {
    if(event.target.checked){
      this.correctOption10 = true;
    }
    else {
      this.correctOption10 = false;
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

  submitForm() {
    console.log("correct option ", this.correctOption1, this.correctOption2, this.correctOption3, this.correctOption4);
    
    const formData = {
      exam: this.examId,
      is_active: this.questionForm.value.isActive,
      text: this.questionForm.value.questionText,
      type_of_question: this.questionForm.value.questionType,
      is_numeric: this.questionForm.value.isNumeric || false
    }
    this.networkRequest.putWithHeaders(formData, `/api/selfassessquestion/${this.questionId}/`)
    .subscribe(
      data => {
        console.log("Question updated ", data);
        this.toastr.success('Question Updated successfully!', 'Created!', {
          timeOut: 4000,
        });
       
          let count = 5;
          // if (this.assertionType) {
          //   count = 5;
          // }
          // else {
          //   count = 4;
          // }
          if (this.mccType || this.mcqType) {
              let mcqData;
              
              mcqData = {
                text: this.questionForm.value.option1
              }

              if (this.questionForm.value.option1id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option1id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 1 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              
              mcqData = {
                text: this.questionForm.value.option2
              }
              if (this.questionForm.value.option2id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option2id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 2 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                      
                    
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              mcqData = {
                text: this.questionForm.value.option3
              }
              if (this.questionForm.value.option3id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option3id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 3 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              mcqData = {
                text: this.questionForm.value.option4
              }
              if (this.questionForm.value.option4id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option4id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 4 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              mcqData = {
                text: this.questionForm.value.option5
              }
              if (this.questionForm.value.option5id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option5id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 5 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              mcqData = {
                text: this.questionForm.value.option6
              }
              if (this.questionForm.value.option6id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option6id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 6 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              mcqData = {
                text: this.questionForm.value.option7
              }
              if (this.questionForm.value.option7id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option7id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 7 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              mcqData = {
                text: this.questionForm.value.option8
              }
              if (this.questionForm.value.option8id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option8id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 8 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              mcqData = {
                text: this.questionForm.value.option9
              }
              if (this.questionForm.value.option9id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option9id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 9 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
              mcqData = {
                text: this.questionForm.value.option10
              }
              if (this.questionForm.value.option10id) {
                this.networkRequest.putWithHeaders(mcqData, `/api/selfassessmcqoptions/${this.questionForm.value.option10id}/`)
                .subscribe(
                  data2 => {
                    console.log("MCQ Data 10 created ", data2);
                    this.getQuestionDetails();
                  },
                  error => {
                    console.log("error ", error);
                  }
                );
              }
              else {
                if (mcqData['text']) {
                  mcqData['questioncontent'] = this.questionId;
                  this.networkRequest.postWithHeader(mcqData, `/api/selfassessmcqoptions/`)
                  .subscribe(
                    data2 => {
                      console.log("MCQ Test case created ", data2);
                    },
                    error => {
                      console.log("error ", error);
                    }
                  );
                }
              }
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
    for (let i = 0; i < this.selectedtags.length; i++) {
      if (this.selectedtags[i]['id'] == id) {
        this.selectedtags.splice(i, 1);
      }
    }
  }

  createQuestionForm() {
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      isActive: [true, [Validators.required]],
      isNumeric: [],
      questionText: ['', [Validators.required]],
      idealTime: [''],
      option1: [''],
      option2: [''],
      option3: [''],
      option4: [''],
      option5: [''],
      option6: [''],
      option7: [''],
      option8: [''],
      option9: [''],
      option10: [''],
      option1id: [''],
      option2id: [''],
      option3id: [''],
      option4id: [''],
      option5id: [''],
      option6id: [''],
      option7id: [''],
      option8id: [''],
      option9id: [''],
      option10id: [''],
      filloption1: [''],
      filloption2: [''],
      filloption3: [''],
      filloption4: [''],
      questionType: ['']
    })
    // this.questionForm.patchValue({
    //   questionType: 'mcq'
    // });
    // this.mccType = true;
  }

  getQuestionDetails() {
    this.networkRequest.getWithHeaders(`/api/selfassessquestion/${this.questionId}/`)
    .subscribe(
      data => {
        console.log("question details", data);
        this.questionDetails = data;
        this.selectedContentId = this.questionDetails['id'];
        this.questionForm.patchValue({
          isActive: this.questionDetails['is_active'],
          questionText: this.questionDetails['text'],
          questionType: this.questionDetails['type_of_question']
        });
      
        if (this.questionDetails['type_of_question'] == 'mcc' || this.questionDetails['type_of_question'] == 'mcq') {
          if (this.questionDetails['type_of_question'] == 'mcc') {
            this.mccType = true;
          }
          if (this.questionDetails['type_of_question'] == 'mcq') {
            this.mcqType = true;
          }
          this.networkRequest.getWithHeaders(`/api/selfassessmcqoptions/?question=${this.questionDetails['id']}`)
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
                }
                if (i == 1) {
                  this.questionForm.patchValue({
                    option2: this.mcqDetails[1]['text'],
                    option2id: this.mcqDetails[1]['id']
                  });
                }
                if (i == 2) {
                  this.questionForm.patchValue({
                    option3: this.mcqDetails[2]['text'],
                    option3id: this.mcqDetails[2]['id']
                  });
                }
                if (i == 3) {
                  this.questionForm.patchValue({
                    option4: this.mcqDetails[3]['text'],
                    option4id: this.mcqDetails[3]['id']
                  });
                }
                if (i == 4) {
                  this.questionForm.patchValue({
                    option5: this.mcqDetails[4]['text'],
                    option5id: this.mcqDetails[4]['id']
                  });
                }
                if (i == 5) {
                  this.questionForm.patchValue({
                    option6: this.mcqDetails[5]['text'],
                    option6id: this.mcqDetails[5]['id']
                  });
                }
                if (i == 6) {
                  this.questionForm.patchValue({
                    option7: this.mcqDetails[6]['text'],
                    option7id: this.mcqDetails[6]['id']
                  });
                }
                if (i == 7) {
                  this.questionForm.patchValue({
                    option8: this.mcqDetails[7]['text'],
                    option8id: this.mcqDetails[7]['id']
                  });
                }
                if (i == 8) {
                  this.questionForm.patchValue({
                    option9: this.mcqDetails[8]['text'],
                    option9id: this.mcqDetails[8]['id']
                  });
                }
                if (i == 9) {
                  this.questionForm.patchValue({
                    option10: this.mcqDetails[9]['text'],
                    option10id: this.mcqDetails[9]['id']
                  });
                }
              }
              
            },
            error => {
            });
        }
        else {
          this.fillUpType = true;
          this.questionForm.patchValue({
            isNumeric: this.questionDetails['is_numeric']
          });
        }
        
      },
      error => {
      });
  }

  ngOnInit() {
    this.createQuestionForm();
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    // this.route.queryParams.subscribe(
    //   params => {
    //     this.examId = params.id;
    // });
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
