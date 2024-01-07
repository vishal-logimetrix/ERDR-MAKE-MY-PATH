import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-selfassess-ques',
  templateUrl: './create-selfassess-ques.component.html',
  styleUrls: ['./create-selfassess-ques.component.scss']
})
export class CreateSelfassessQuesComponent implements OnInit {

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
  mccType: boolean = true;
  fillUpType: boolean = false;
  fillUpOptionType: boolean = false;
  numericalType: boolean = false;
  assertionType: boolean = false;
  booleanType: boolean = false;
  subjectiveType: boolean = false;
  booleanTypeVal: boolean = true;

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
  questions;

  setBooleanTrue() {
    this.booleanTypeVal = true;
  }

  setBooleanFalse() {
    this.booleanTypeVal = false;
  }

  // changeQuesText(id) {
  //   for (let i = 0; i < this.questions.length; i++) {
  //     if (this.questions[i]['id'] == id) {
  //       this.selectedquestionText = this.questions[i]['text'];
  //       this.questionForm.patchValue({
  //         questionType: this.questions[i]['type_of_question']
  //       });
  //       this.changeType(this.questions[i]['type_of_question']);
  //     }
  //   }
  // }

  changeType(type) {
    console.log("typeaa", type);
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
    if (type == 'mcq') {
      this.mcqType = true;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (type == 'mcc') {
      this.mcqType = false;
      this.mccType = true;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (type == 'numerical') {
      this.numericalType = true;
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
    }
    else if (type == 'fillup') {
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = true;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (type == 'fillup_option') {
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = true;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (type == 'boolean') {
      this.booleanType = true;
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (type == 'subjective') {
      this.booleanType = false;
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.subjectiveType = true;
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
      is_active: this.questionForm.value.isActive,
      text: this.questionForm.value.questionText,
      type_of_question: this.questionForm.value.questionType,
      is_numeric: this.questionForm.value.isNumeric || false
    }
    this.networkRequest.postWithHeader(formData, `/api/selfassessquestion/`)
    .subscribe(
      data => {
        console.log("Question created ", data);
        this.toastr.success('Question Saved successfully!', 'Created!', {
          timeOut: 4000,
        });
       
          let count = 10;
          // if (this.assertionType) {
          //   count = 5;
          // }
          // else {
          //   count = 4;
          // }
          if (this.mccType || this.mcqType) {
            for (let i = 0; i < count; i++) {
              let mcqData;
              if (i == 0) {
                mcqData = {
                  text: this.questionForm.value.option1,
                  questioncontent: data['id']
                }
              }
              if (i == 1) {
                mcqData = {
                  text: this.questionForm.value.option2,
                  questioncontent: data['id']
                }
              }
              if (i == 2) {
                mcqData = {
                  text: this.questionForm.value.option3,
                  questioncontent: data['id']
                }
              }
              if (i == 3) {
                mcqData = {
                  text: this.questionForm.value.option4,
                  questioncontent: data['id']
                }
              }
              if (i == 4) {
                mcqData = {
                  text: this.questionForm.value.option5,
                  questioncontent: data['id']
                }
              }

              if (i == 5) {
                mcqData = {
                  text: this.questionForm.value.option6,
                  questioncontent: data['id']
                }
              }

              if (i == 6) {
                mcqData = {
                  text: this.questionForm.value.option7,
                  questioncontent: data['id']
                }
              }

              if (i == 7) {
                mcqData = {
                  text: this.questionForm.value.option8,
                  questioncontent: data['id']
                }
              }

              if (i == 8) {
                mcqData = {
                  text: this.questionForm.value.option9,
                  questioncontent: data['id']
                }
              }

              if (i == 9) {
                mcqData = {
                  text: this.questionForm.value.option10,
                  questioncontent: data['id']
                }
              }

              if (mcqData['text']) {
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
      filloption1: [''],
      filloption2: [''],
      filloption3: [''],
      filloption4: [''],
      questionType: ['']
    })
    this.questionForm.patchValue({
      questionType: 'mcq'
    });
    this.mccType = true;
  }

  getQues() {
    this.networkRequest.getWithHeaders(`/api/selfassessquestionbank/`)
      .subscribe(
        data => {
          console.log("questions ", data);
          this.questions = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit() {
    this.createQuestionForm();
    this.getQues();
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
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
