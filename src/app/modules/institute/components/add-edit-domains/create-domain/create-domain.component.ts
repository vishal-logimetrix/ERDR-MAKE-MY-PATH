import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-domain',
  templateUrl: './create-domain.component.html',
  styleUrls: ['./create-domain.component.scss']
})
export class CreateDomainComponent implements OnInit {

  title : string;
  description : string;
  order : number;
  domainForm: FormGroup;
  examCategories;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  get f() {
    return this.domainForm.controls;
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
    formData.append("title", this.domainForm.value.title);
    formData.append("order", this.domainForm.value.order);
    formData.append("is_active", this.domainForm.value.isActive);
    formData.append("consider_node_order", this.domainForm.value.consider_node_order);
    formData.append("show_home", this.domainForm.value.showHome);
    formData.append("description", this.domainForm.value.description);
    formData.append("exam_category", this.domainForm.value.category);
    formData.append("short_description", this.domainForm.value.shortDescription);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    this.networkRequest.postFormData(formData, '/api/domain/').subscribe(
      data => {
        console.log("domain successfully created ", data);
        this.domainForm.reset();
        this.toastr.success('Domain created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/add-edit-domains"]);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  createDomainForm() {
    this.domainForm = this.fb.group({
      title: ['', Validators.required],
      isActive: [false, [Validators.required]],
      showHome: [false, [Validators.required]],
      consider_node_order: [false, [Validators.required]],
      shortDescription: [''],
      description: ['', [Validators.required]],
      image: [''],
      order: [''],
      category: ['', Validators.required]
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


  ngOnInit(): void {
    this.getCategories();
    this.createDomainForm();
    this.title = this.route.snapshot.params['title'];
    this.description = this.route.snapshot.params['description'];
    this.order = parseInt(this.route.snapshot.params['order']);
  }

}
