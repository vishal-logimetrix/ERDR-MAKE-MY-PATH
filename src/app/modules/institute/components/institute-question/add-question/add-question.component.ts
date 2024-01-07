import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
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

  questionTypes = [ 
    {val: 'mcq', name: 'Single Correct Choice'},
    {val: 'mcc', name: 'Multiple Correct Choice'},
    {val: 'fillup', name: 'Fill In The Blanks'},
    {val: 'subjective', name: 'Subjective type'},
    {val: 'numerical', name: 'Numerical'},
    {val: 'assertion', name: 'Assertion'},
    {val: 'boolean', name: 'True False'},
    {val: 'fillup_option', name: 'Fill With Option'},
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
    else if (event.target.value == 'numerical') {
      this.numericalType = true;
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
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
    else if (event.target.value == 'fillup_option') {
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = true;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (event.target.value == 'boolean') {
      this.booleanType = true;
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.subjectiveType = false;
      this.numericalType = false;
    }
    else if (event.target.value == 'subjective') {
      this.booleanType = false;
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = false;
      this.fillUpOptionType = false;
      this.subjectiveType = true;
      this.numericalType = false;
    }
    else if (event.target.value == 'assertion') {
      this.mcqType = false;
      this.mccType = false;
      this.fillUpType = false;
      this.assertionType = true;
      this.fillUpOptionType = false;
      this.booleanType = false;
      this.subjectiveType = false;
      this.numericalType = false;
      setTimeout(() => {
        this.questionForm.patchValue({
          option1: "Both A and R are true and R is the correct explanation of A",
          option2: "Both A and R are true but R is NOT the correct explanation of A",
          option3: "A is true but R is false",
          option4: "A is true but R is false",
          option5: "Both A and R are false"
        });
      }, 1100);
     
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

    if (this.fillUpType) {
      if (!this.questionForm.value.fillUp || this.questionForm.value.fillUp == '') {
        this.toastr.error('Fill Up can not be blank!', 'Error!', {
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
        // this.toastr.success('Question Text and Language Saved successfully!', 'Created!', {
        //   timeOut: 4000,
        // });
        let contentId = [];
        contentId.push(data['id']);
        let questionData
        if (this.questionForm.value.tags) {
          questionData = {
            linked_topics: tagIds,
            is_active: this.questionForm.value.isActive,
            tags: this.questionForm.value.tags,
            type_of_question: this.questionForm.value.questionType,
            contents: contentId,
            difficulty: this.questionForm.value.difficulty,
            ideal_time: this.questionForm.value.idealTime
          }
        }
        else {
          questionData = {
            linked_topics: tagIds,
            is_active: this.questionForm.value.isActive,
            type_of_question: this.questionForm.value.questionType,
            contents: contentId,
            difficulty: this.questionForm.value.difficulty,
            ideal_time: this.questionForm.value.idealTime
          }
        }
        this.networkRequest.postWithHeader(questionData, `/api/question/`)
        .subscribe(
          data1 => {
            console.log("Question created ", data1);
            // this.toastr.success('Question Tag, difficulty and type saved and question text linked successfully!', 'Created!', {
            //   timeOut: 4000,
            // });
          },
          error => {
            console.log("error ", error);
            this.toastr.error('Some error while creating quesion features!', 'Error!', {
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
            if (this.subjectiveType) {
              this.toastr.success('Created successfully!', 'Created!', {
                timeOut: 4000,
              });
            }
          },
          error => {
            console.log("error ", error);
            this.toastr.error('Some error while creating solution!', 'Error!', {
              timeOut: 4000,
            });
          }
        );

        if (this.mccType || this.mcqType || this.assertionType) {
          let count = 5;
          // if (this.assertionType) {
          //   count = 5;
          // }
          // else {
          //   count = 4;
          // }
          for (let i = 0; i < count; i++) {
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
            if (i == 4) {
              mcqData = {
                text: this.questionForm.value.option5,
                correct: this.correctOption5,
                questioncontent: data['id']
              }
            }

            this.networkRequest.postWithHeader(mcqData, `/api/mcqtestcase/`)
            .subscribe(
              data2 => {
                console.log("MCQ Test case created ", data2);
                if (i==4) {
                  this.toastr.success('Created successfully!', 'Created!', {
                    timeOut: 4000,
                  });
                }
               
              },
              error => {
                console.log("error ", error);
                // this.toastr.error('Some error while creating MCQ Test case!', 'Error!', {
                //   timeOut: 4000,
                // });
              }
            );
          }
        }

        if (this.fillUpOptionType) {
         
          for (let i = 0; i < 4; i++) {
            let mcqData;
            if (i == 0) {
              mcqData = {
                text: this.questionForm.value.filloption1,
                correct: this.correctfillOption1,
                questioncontent: data['id']
              }
            }
            if (i == 1) {
              mcqData = {
                text: this.questionForm.value.filloption2,
                correct: this.correctfillOption2,
                questioncontent: data['id']
              }
            }
            if (i == 2) {
              mcqData = {
                text: this.questionForm.value.filloption3,
                correct: this.correctfillOption3,
                questioncontent: data['id']
              }
            }
            if (i == 3) {
              mcqData = {
                text: this.questionForm.value.filloption4,
                correct: this.correctfillOption4,
                questioncontent: data['id']
              }
            }

            this.networkRequest.postWithHeader(mcqData, `/api/fillwithoption/`)
            .subscribe(
              data2 => {
                console.log("Fillup Option case created ", data2);
                if (i==3) {
                  this.toastr.success('Created successfully!', 'Created!', {
                    timeOut: 4000,
                  });
                }
              },
              error => {
                console.log("error ", error);
                this.toastr.error('Some error while creating Fill Up Option!', 'Error!', {
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
              this.toastr.success('Created successfully!', 'Created!', {
                timeOut: 4000,
              });
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
          const fillUpData = {
            text: this.questionForm.value.numerical,
            questioncontent: data['id'],
          }
          this.networkRequest.postWithHeader(fillUpData, `/api/stringtestcasesolution/`)
          .subscribe(
            data2 => {
              console.log("Numerical case created ", data2);
              this.toastr.success('Created successfully!', 'Created!', {
                timeOut: 4000,
              });
            },
            error => {
              console.log("error ", error);
              this.toastr.error('Some error while creating Numerical Case!', 'Error!', {
                timeOut: 4000,
              });
            }
          );
        }

        if (this.booleanType) {
          const fillUpData = {
            option: this.booleanTypeVal,
            questioncontent: data['id'],
          }
          this.networkRequest.postWithHeader(fillUpData, `/api/booleansolution/`)
          .subscribe(
            data2 => {
              console.log("Boolean Type created ", data2);
              this.toastr.success('Created successfully!', 'Created!', {
                timeOut: 4000,
              });
            },
            error => {
              console.log("error ", error);
              this.toastr.error('Some error while creating True False!', 'Error!', {
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
    for (let i = 0; i < this.selectedtags.length; i++) {
      if (this.selectedtags[i]['id'] == id) {
        this.selectedtags.splice(i, 1);
      }
    }
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
        console.log("options", this.options);
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
        console.log("tagaaaa", this.TagData[i], this.tag)
        filtered.push(this.TagData[i]);
        this.successFlag = true;
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
      questionText: ['', [Validators.required]],
      tags: [''],
      idealTime: [''],
      difficulty: [''],
      option1: [''],
      option2: [''],
      option3: [''],
      option4: [''],
      option5: [''],
      filloption1: [''],
      filloption2: [''],
      filloption3: [''],
      filloption4: [''],
      fillUp: [''],
      numerical: [''],
      language: [''],
      questionType: [''],
      solution: ['', [Validators.required]]
    })
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
    this.createQuestionForm();
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    this.getTags();
    this.getLanguages();
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
