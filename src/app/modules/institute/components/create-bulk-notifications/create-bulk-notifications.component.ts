import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-bulk-notifications',
  templateUrl: './create-bulk-notifications.component.html',
  styleUrls: ['./create-bulk-notifications.component.scss']
})
export class CreateBulkNotificationsComponent implements OnInit {

  createBlog: FormGroup;
  env = environment;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  submitStatus: boolean = false;

  constructor(
    private fb: FormBuilder,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  schools;

  get title() {
    return this.createBlog.get('title')
  }

  get body() {
    return this.createBlog.get('body')
  }

  get school() {
    return this.createBlog.get('school')
  }

  fetchInstitute() {
    this.networkRequest.getWithHeaders('/api/verifiedinstitutes/').subscribe(
      data => {
        console.log("schools ", data);
        this.schools = data;
      },
      error => {
        // console.log("error ", error);
        // this.errors = error['message']['error'];
      }
    )
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

  ngOnInit() {
    this.createBlog = this.fb.group({
      title: ['', [Validators.minLength(4), Validators.maxLength(50), Validators.pattern('^.*([a-zA-Z0-9]+.*)+$')]],
      body: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2500), Validators.pattern('^.*([a-zA-Z0-9]+.*)+$')]],
      school: ['']
    })
    this.fetchInstitute();
  }

  onSubmit() {
    this.submitStatus = true;
    let imageFile: File;
    imageFile = (<HTMLInputElement>document.getElementById('imageFile')).files[0];

    let formData: FormData = new FormData();
    formData.append("subject", this.createBlog.value.title);
    formData.append("notification", this.createBlog.value.body);
    formData.append("institute", this.createBlog.value.school);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    this.networkRequest.postFormData(formData, '/api/send_bulk_notifications/').subscribe((data: any) => {
      // console.log("Success", data);
      this.createBlog.reset();
      this.submitStatus = false;
      this.toastr.success('Notification sent successfully!', 'Created!', {
        timeOut: 4000,
      });
    }, (error: any) => {
      this.submitStatus = false;
      // console.error("Error", error);
      this.toastr.error('Some Error occured while sending notification!', 'Error!', {
        timeOut: 4000,
      });
    })
  }


}
