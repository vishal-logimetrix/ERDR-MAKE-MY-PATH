import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {
  title : string;
  description : string;
  order : number;
  courseForm: FormGroup;
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
    formData.append("level", this.courseForm.value.level);
    formData.append("description", this.courseForm.value.description);
    formData.append("short_description", this.courseForm.value.shortDescription);
    formData.append("user_guidelines", this.courseForm.value.guidelines);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    this.networkRequest.postFormData(formData, '/api/courses/').subscribe(
      data => {
        console.log("exam successfully created ", data);
        this.courseForm.reset();
        this.toastr.success('Exam created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/add-edit-courses"]);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  createCourseForm() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      isActive: ['', [Validators.required]],
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
    this.getLevels();
    this.createCourseForm();
    this.title = this.route.snapshot.params['title'];
    this.description = this.route.snapshot.params['description'];
    this.order = parseInt(this.route.snapshot.params['order']);
  }

}
