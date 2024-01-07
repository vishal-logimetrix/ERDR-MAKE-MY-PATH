import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-edit-self-assess-ques',
  templateUrl: './edit-self-assess-ques.component.html',
  styleUrls: ['./edit-self-assess-ques.component.scss']
})
export class EditSelfAssessQuesComponent implements OnInit {

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
      option5: null
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
    const formData = {
      exam: this.examId,
      order: this.questionForm.value.order,
      is_compulsory: this.questionForm.value.isCompulsory
    }
    this.networkRequest.putWithHeaders(formData, `/api/selfassessexamquestion/${this.questionId}/`)
    .subscribe(
      data => {
        console.log("Question updated ", data);
        this.toastr.success('Question Updated successfully!', 'Created!', {
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
    // this.questionForm.patchValue({
    //   questionType: 'mcq'
    // });
    // this.mccType = true;
  }

  getQuestionDetails() {
    this.networkRequest.getWithHeaders(`/api/selfassessexamquestion/${this.questionId}/`)
    .subscribe(
      data => {
        console.log("question details", data);
        this.questionDetails = data;
        this.selectedContentId = this.questionDetails['id'];
        this.questionForm.patchValue({
          order: this.questionDetails['order'],
          questionText: this.questionDetails['question']['text'],
          isCompulsory: this.questionDetails['is_compulsory']
        });
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
