import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-edit-makepath-question',
  templateUrl: './edit-makepath-question.component.html',
  styleUrls: ['./edit-makepath-question.component.scss']
})
export class EditMakepathQuestionComponent implements OnInit {
  ckeditorContent: string = '<p>Some html</p>';
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  @ViewChild("myckeditor", {static: false}) ckeditor: any;
 
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
  exampathId;
  examDetails;
  courseDetails;
  order;

  submit() {
    const formData = {
      exam: this.examDetails['exam'],
      is_active: this.isActive,
      title: this.title,
      content: this.ckeditorContent,
      order: this.order
    }
    this.networkRequest.putWithHeaders(formData, `/api/exampathquestion/${this.exampathId}/`)
    .subscribe(
      data => {
        console.log("created ", data);
        this.toastr.success('Content successfully updated!', 'Updated!', {
          timeOut: 4000,
        });
        this.getExamPathDetails();
        this.updateDate();
        // this.router.navigate(["/institute/add-edit-courses"]);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  updateDate()  {
    var updatePathDate = new Date();
    var convertedDate = this.formatDate(updatePathDate);
    let formData: FormData = new FormData();
    formData.append("title", this.courseDetails['title']);
    formData.append("is_active", this.courseDetails['is_active']);
    formData.append("level", this.courseDetails['level']);
    formData.append("description", this.courseDetails['description']);
    formData.append("short_description", this.courseDetails['short_description']);
    formData.append("user_guidelines", this.courseDetails['user_guidelines']);
    //@ts-ignore
    formData.append("update_date", convertedDate);
    this.networkRequest.putFiles(formData, `/api/courses/${this.examDetails['exam']}/`).subscribe(
      data => {
        console.log("course successfully created ", data);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
  }
  

  getExamPathDetails() {
    this.networkRequest.getWithHeaders(`/api/exampathquestion/${this.exampathId}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          this.examDetails = data;
          this.getCourseDetails();
          this.title = this.examDetails['title'];
          this.ckeditorContent = this.examDetails['content'];
          this.isActive = this.examDetails['is_active'];
          this.order = this.examDetails['order'];
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  getCourseDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examDetails['exam']}/`)
    .subscribe(
      data => {
        console.log("exam details ", data);
        this.courseDetails = data;
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
        this.exampathId = params.id;
        if (this.exampathId) {
          this.getExamPathDetails();
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
