import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-previous-paper',
  templateUrl: './create-previous-paper.component.html',
  styleUrls: ['./create-previous-paper.component.scss']
})
export class CreatePreviousPaperComponent implements OnInit {

  log: string = '';
  @ViewChild("myckeditor", {static: false}) ckeditor: any;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
 
  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
  }

  title;
  isActive: boolean = true;
  examId;
  examDetails;
  author;
  publication;
  filpkartLink;
  amazonLink;
  subjects;
  selectedSubject;

  readURL(event: any): void {
    // console.log("type", event.target.files[0]['type']);
    // if (event.target.files[0]['type'] !== 'image/jpeg' && event.target.files[0]['type'] !== 'image/jpg' && event.target.files[0]['type'] !== 'image/png' && event.target.files[0]['type'] !== 'image/gif') {
    //   this.toastr.error('Invalid image format!', 'Error!', {
    //     timeOut: 4000,
    //   });
    //   this.fileInput.nativeElement.value = '';
    //   return;
    // }
  }


  submit() {
    let imageFile: File;
    imageFile = (<HTMLInputElement>document.getElementById('imageFile')).files[0];

    let formData: FormData = new FormData();
    formData.append("title", this.title);
    formData.append("is_active", String(this.isActive));
    formData.append("exam", this.examId);
    
    if (imageFile) {
      formData.append("file", imageFile);
    }
    this.networkRequest.postFormData(formData, '/api/exampreviouspaper/').subscribe(
      data => {
        console.log("exam pdf successfully created ", data);
        this.toastr.success('Exam PDF created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/exam-previous-papers"],{
          queryParams: {
            id: this.examId
          }
        });
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
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getExamDetails();
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
