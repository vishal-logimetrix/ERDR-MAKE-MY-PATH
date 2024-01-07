import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-suggested-books',
  templateUrl: './create-suggested-books.component.html',
  styleUrls: ['./create-suggested-books.component.scss']
})
export class CreateSuggestedBooksComponent implements OnInit {

  ckeditorContent: string = '<p>Some html</p>';
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor", {static: false}) ckeditor: any;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('pdfInput', { static: false }) pdfInput: ElementRef;
 
  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.mycontent = `<p>My html content</p>`;
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
    if (event.target.files[0]['type'] !== 'image/jpeg' && event.target.files[0]['type'] !== 'image/jpg' && event.target.files[0]['type'] !== 'image/png' && event.target.files[0]['type'] !== 'image/gif') {
      this.toastr.error('Invalid image format!', 'Error!', {
        timeOut: 4000,
      });
      this.fileInput.nativeElement.value = '';
      return;
    }
  }


  submit() {
    let imageFile: File;
    imageFile = (<HTMLInputElement>document.getElementById('imageFile')).files[0];
    let pdfFile: File;
    pdfFile = (<HTMLInputElement>document.getElementById('pdfFile')).files[0];

    let formData: FormData = new FormData();
    formData.append("title", this.title);
    formData.append("is_active", String(this.isActive));
    formData.append("about", this.ckeditorContent);
    formData.append("author", this.author);
    formData.append("publication", this.publication);
    formData.append("exam", this.examId);
    formData.append("subject", this.selectedSubject);
    formData.append("amazon_link", this.amazonLink);
    formData.append("flipkart_link", this.filpkartLink);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (pdfFile) {
      formData.append("file", pdfFile);
    }
    this.networkRequest.postFormData(formData, '/api/exambook/').subscribe(
      data => {
        console.log("exam book successfully created ", data);
        this.toastr.success('Exam Book created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/exam-books"],{
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

  getSubjects() {
    this.networkRequest.getWithHeaders(`/api/subject/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("subjects ", data);
          this.subjects = data;
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
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getExamDetails();
          this.getSubjects();
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
