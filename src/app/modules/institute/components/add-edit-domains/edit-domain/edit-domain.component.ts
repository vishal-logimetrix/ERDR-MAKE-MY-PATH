import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-edit-domain',
  templateUrl: './edit-domain.component.html',
  styleUrls: ['./edit-domain.component.scss']
})
export class EditDomainComponent implements OnInit {

  title : string;
  description : string;
  order : number;
  domainForm: FormGroup;
  domainId;
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

    if (imageFile) {
      let imgData: FormData = new FormData();
      imgData.append("title", this.domainForm.value.title);
      imgData.append("order", this.domainForm.value.order);
      imgData.append("is_active", this.domainForm.value.isActive);
      imgData.append("show_home", this.domainForm.value.showHome);
      imgData.append("consider_node_order", this.domainForm.value.consider_node_order);
      imgData.append("description", this.domainForm.value.description);
      imgData.append("short_description", this.domainForm.value.shortDescription);
      imgData.append("image", imageFile);
      
      this.networkRequest.putFiles(imgData, `/api/domain/${this.domainId}/`).subscribe(
        data => {
          console.log("domain  image successfully updated ", data);
          this.getDomainDetails();
        },
        error => {
          console.log("error ", error);
      });
    }

    const formData = {
      title: this.domainForm.value.title,
      is_active: this.domainForm.value.isActive,
      show_home: this.domainForm.value.showHome,
      description: this.domainForm.value.description,
      exam_category: this.domainForm.value.category,
      short_description: this.domainForm.value.shortDescription,
      order: this.domainForm.value.order,
      consider_node_order: this.domainForm.value.consider_node_order
    }
    
    this.networkRequest.putWithHeaders(formData, `/api/domain/${this.domainId}/`).subscribe(
      data => {
        console.log("domain successfully created ", data);
        this.toastr.success('Domain updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.getDomainDetails();
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
        this.domainForm.patchValue({
          title: data['title'],
          order: data['order'],
          isActive: data['is_active'],
          showHome: data['show_home'],
          shortDescription: data['short_description'],
          description: data['description'],
          category: data['exam_category'],
          consider_node_order: data['consider_node_order']
        })
      },
      error => {
      });
  }

  createDomainForm() {
    this.domainForm = this.fb.group({
      title: ['', Validators.required],
      isActive: ['', [Validators.required]],
      showHome: [false, [Validators.required]],
      consider_node_order: [false, [Validators.required]],
      shortDescription: [''],
      category: ['', Validators.required],
      description: ['', [Validators.required]],
      image: [''],
      order: ['']
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
    this.route.queryParams.subscribe(
      params => {
        this.domainId = params.id;
        if (this.domainId) {
          this.getDomainDetails();
        }
    });
  }
}
