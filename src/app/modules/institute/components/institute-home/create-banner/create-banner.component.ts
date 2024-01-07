import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.scss']
})
export class CreateBannerComponent implements OnInit {
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  link;
 
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

  submit() {
    let imageFile: File;
    imageFile = (<HTMLInputElement>document.getElementById('imageFile')).files[0];
   
    let formData: FormData = new FormData();
    formData.append("title", this.title);
    formData.append("is_active", String(this.isActive));
    formData.append("link", this.link);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }
    this.networkRequest.postFormData(formData, `/api/create_banner/`)
    .subscribe(
      data => {
        console.log("created ", data);
        this.title = null;
        this.isActive = true;
        this.toastr.success('Banner data successfully added!', 'Added!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/manage-banners"]);
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
