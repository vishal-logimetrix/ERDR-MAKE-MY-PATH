import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-pathquestions',
  templateUrl: './create-pathquestions.component.html',
  styleUrls: ['./create-pathquestions.component.scss']
})
export class CreatePathquestionsComponent implements OnInit {

  title : string;
  description : string;
  order : number;
  pathQuestionForm: FormGroup;
  examCategories;
  domainId;
  domainDetails;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  get f() {
    return this.pathQuestionForm.controls;
  }

  get moreOptions(){
    return this.pathQuestionForm.get('options') as FormArray;
  }

  addmoreOptions(){
    this.moreOptions.push(this.fb.control(''));
  }
  removeInputField(i: number){
    this.moreOptions.removeAt(i);
  }

  readURL(event: any): void {
    // console.log("type", event.target.files[0]['type']);
    if (event.target.files[0]['type'] !== 'image/jpeg' && event.target.files[0]['type'] !== 'image/jpg' && event.target.files[0]['type'] !== 'image/png' && event.target.files[0]['type'] !== 'image/gif') {
      this.toastr.error('Invalid image format!', 'Error!', {
        timeOut: 4000,
      });
      this.fileInput.nativeElement.value = '';
      return;
    }
  }

  submitForm() {
    const question_text = this.pathQuestionForm.value.title;
    const options = this.pathQuestionForm.get('options').value;

    let tmpOptions: string;
    for (let i = 0; i < options.length; i++) {
      if (i == 0) {
        tmpOptions = options[i];
      }
      else {
        tmpOptions = tmpOptions + ',' + options[i];
      }
    }

    const formData = {
      question_text: question_text,
      alloptions: tmpOptions,
      domain: this.domainId
    }
    
    console.log("formData ", formData);

    this.networkRequest.postWithHeader(formData, `/api/pathquestion/?domain_id=${this.domainId}`).subscribe(
      data => {
        console.log("path question successfully created ", data);
        this.pathQuestionForm.reset();
        this.toastr.success('Path Question created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/add-edit-domains"]);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  createPathQuestionForm() {
    this.pathQuestionForm = this.fb.group({
      title: ['', Validators.required],
      options: this.fb.array([])
    })
  }

  getCategories() {
    this.networkRequest.getWithHeaders('/api/examcategory/')
      .subscribe(
        data => {
          console.log("categories ", data);
          // Populate Selected Assessment list with server data
          this.examCategories = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  getDomainDetails() {
    this.networkRequest.getWithHeaders(`/api/domain/${this.domainId}/`)
    .subscribe(
      data => {
        console.log("domain details ", data);
        this.domainDetails = data;
      },
      error => {
      });
  }

  ngOnInit(): void {
    this.getCategories();
    this.createPathQuestionForm();
    this.route.queryParams.subscribe(
      params => {
        this.domainId = params.id;
        if (this.domainId) {
          this.getDomainDetails();
        }
    });
  }

}
