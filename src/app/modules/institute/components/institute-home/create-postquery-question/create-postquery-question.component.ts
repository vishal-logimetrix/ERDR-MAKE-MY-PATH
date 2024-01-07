import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-postquery-question',
  templateUrl: './create-postquery-question.component.html',
  styleUrls: ['./create-postquery-question.component.scss']
})
export class CreatePostqueryQuestionComponent implements OnInit {

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

  text;

  submit() {
    const formData = {
      text: this.text
    }
    this.networkRequest.postWithHeader(formData, `/api/postqueryquestions/`)
    .subscribe(
      data => {
        console.log("created ", data);
        this.text = null;
        this.toastr.success('Question successfully added!', 'Added!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/manage-postquery-questions"]);
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
