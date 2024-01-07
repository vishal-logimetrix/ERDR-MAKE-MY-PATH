import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  title : string;
  description : string;
  order : number;
  courseForm: FormGroup;
  courseId;
  levels;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  get f() {
    return this.courseForm.controls;
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
    let imageFile: File;
    imageFile = (<HTMLInputElement>document.getElementById('imageFile')).files[0];

    let formData: FormData = new FormData();
    formData.append("title", this.courseForm.value.title);
    formData.append("is_active", this.courseForm.value.isActive);
    formData.append("allow_goal", this.courseForm.value.allowGoal);
    formData.append("level", this.courseForm.value.level);
    formData.append("description", this.courseForm.value.description);
    formData.append("short_description", this.courseForm.value.shortDescription);
    formData.append("user_guidelines", this.courseForm.value.guidelines);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    this.networkRequest.putFiles(formData, `/api/courses/${this.courseId}/`).subscribe(
      data => {
        console.log("course successfully updated ", data);
        this.courseForm.reset();
        this.toastr.success('Course updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.getCourseDetails();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getCourseDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.courseId}/`)
    .subscribe(
      data => {
        console.log("exam details ", data);
        this.courseForm.patchValue({
          title: data['title'],
          isActive: data['is_active'],
          allowGoal: data['allow_goal'],
          shortDescription: data['short_description'],
          description: data['description'],
          guidelines: data['user_guidelines'],
          level: data['level']
        })
      },
      error => {
      });
  }

  createCourseForm() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      isActive: ['', [Validators.required]],
      allowGoal: ['', [Validators.required]],
      shortDescription: [''],
      level: [''],
      guidelines: [''],
      description: ['', [Validators.required]],
      image: ['']
    })
  }

  getLevels() {
    this.networkRequest.getWithHeaders('/api/examlevel/')
      .subscribe(
        data => {
          console.log("levels ", data);
          this.levels = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.createCourseForm();
    this.getLevels();
    this.route.queryParams.subscribe(
      params => {
        this.courseId = params.id;
        if (this.courseId) {
          this.getCourseDetails();
        }
    });
  }


}
