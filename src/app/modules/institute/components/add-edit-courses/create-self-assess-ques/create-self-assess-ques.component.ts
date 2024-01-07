import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-self-assess-ques',
  templateUrl: './create-self-assess-ques.component.html',
  styleUrls: ['./create-self-assess-ques.component.scss']
})
export class CreateSelfAssessQuesComponent implements OnInit {

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
  questions;
  selectedquestionText;

  setBooleanTrue() {
    this.booleanTypeVal = true;
  }

  setBooleanFalse() {
    this.booleanTypeVal = false;
  }

  changeQuesText(id) {
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i]['id'] == id) {
        this.selectedquestionText = this.questions[i]['text'];
        this.questionForm.patchValue({
          questionType: this.questions[i]['type_of_question']
        });
      }
    }
  }

  submitForm() {
    const formData = {
      exam: this.examId,
      question: this.questionForm.value.questionText,
      order: this.questionForm.value.order,
      is_compulsory: this.questionForm.value.isCompulsory
    }
    this.networkRequest.postWithHeader(formData, `/api/selfassessexamquestion/`)
    .subscribe(
      data => {
        console.log("Question created ", data);
        this.toastr.success('Question Linked successfully!', 'Created!', {
          timeOut: 4000,
        });
       
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
      order: [],
      questionText: ['', [Validators.required]],
      questionType: [''],
      isCompulsory: [true]
    })
    this.questionForm.patchValue({
      questionType: 'mcq'
    });
    this.mccType = true;
  }

  getQues() {
    this.networkRequest.getWithHeaders(`/api/selfassessquestion/`)
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
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
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
