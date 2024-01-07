import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-edit-postquery-question',
  templateUrl: './edit-postquery-question.component.html',
  styleUrls: ['./edit-postquery-question.component.scss']
})
export class EditPostqueryQuestionComponent implements OnInit {

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
  questionId;

  submit() {
    const formData = {
      text: this.text
    }
    this.networkRequest.putWithHeaders(formData, `/api/postqueryquestions/${this.questionId}/`)
    .subscribe(
      data => {
        console.log("created ", data);
        this.text = null;
        this.toastr.success('Question successfully edited!', 'Done!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/manage-postquery-questions"]);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getQuestionDetails() {
    this.networkRequest.getWithHeaders(`/api/postqueryquestions/${this.questionId}/`)
    .subscribe(
      data => {
        console.log("question details", data);
        this.text = data['text'];
      },
      error => {
      });
  }

  ngOnInit() {
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    this.route.queryParams.subscribe(
      params => {
        this.questionId = params.id;
        if (this.questionId) {
          this.getQuestionDetails();
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
