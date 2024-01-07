import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-mentorfaq',
  templateUrl: './create-mentorfaq.component.html',
  styleUrls: ['./create-mentorfaq.component.scss']
})
export class CreateMentorfaqComponent implements OnInit {

  ckeditorContent: string = '<p>Some html</p>';
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor", {static: false}) ckeditor: any;
  content;
 
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
    const formData = {
      title: this.title,
      content: this.content
    }
    this.networkRequest.postWithHeader(formData, `/api/create_mentorfaq/`)
    .subscribe(
      data => {
        console.log("created ", data);
        this.title = null;
        this.ckeditorContent = '<p>Some html</p>';
        this.isActive = true;
        this.toastr.success('Content successfully added!', 'Added!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/manage-mentorfaq"]);
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
