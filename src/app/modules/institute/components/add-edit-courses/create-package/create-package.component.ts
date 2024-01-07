import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.scss']
})
export class CreatePackageComponent implements OnInit {
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
  examId;
  examDetails;
  order;

  submit() {
    const formData = {
      exam: this.examId,
      is_active: this.isActive,
      title: this.title,
      content: this.ckeditorContent,
      order: this.order
    }
    this.networkRequest.postWithHeader(formData, `/api/exampathquestion/`)
    .subscribe(
      data => {
        console.log("created ", data);
        this.title = null;
        this.ckeditorContent = '<p>Some html</p>';
        this.isActive = true;
        this.updateDate();
        this.toastr.success('Content successfully added!', 'Added!', {
          timeOut: 4000,
        });
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
    formData.append("title", this.examDetails['title']);
    formData.append("is_active", this.examDetails['is_active']);
    formData.append("level", this.examDetails['level']);
    formData.append("description", this.examDetails['description']);
    formData.append("short_description", this.examDetails['short_description']);
    formData.append("user_guidelines", this.examDetails['user_guidelines']);
    //@ts-ignore
    formData.append("update_date", convertedDate);
    this.networkRequest.putFiles(formData, `/api/courses/${this.examId}/`).subscribe(
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

  getExamDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          this.examDetails = data;
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
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getExamDetails();
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

