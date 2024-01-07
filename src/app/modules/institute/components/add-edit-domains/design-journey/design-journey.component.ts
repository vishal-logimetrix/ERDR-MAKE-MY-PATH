import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-design-journey',
  templateUrl: './design-journey.component.html',
  styleUrls: ['./design-journey.component.scss']
})
export class DesignJourneyComponent implements OnInit {
  ckeditorContent: string = '<p>Some html</p>';
  name = 'ng2-ckeditor';
  ckeConfig: any;
  mycontent: string;
  log: string = '';
  exams;
  journeyForm: FormGroup;
  domainId;
  domainDetails;

  @ViewChild("myckeditor", {static: false}) ckeditor: any;
 
  constructor(
    private networkRequest: NetworkRequestService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.mycontent = `<p>My html content</p>`;
  }

  submitForm() {
    const exam = this.journeyForm.value.exam;
    const title = this.journeyForm.value.title;
    const description = this.journeyForm.value.description;

    const formData = {
      exam: exam,
      title: title,
      description: description,
      domain: this.domainId
    }
    
    console.log("formData ", formData);

    this.networkRequest.postWithHeader(formData, `/api/domainjourney/?domain_id=${this.domainId}`).subscribe(
      data => {
        console.log("path question successfully created ", data);
        this.journeyForm.reset();
        this.toastr.success('Path Question created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.router.navigate(["/institute/design-domain"]);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  populateTitle(id) {
    this.networkRequest.getWithHeaders(`/api/courses/${id}/`)
      .subscribe(
        data => {
          console.log("exam details ", data);
          this.journeyForm.patchValue({
            title: "Journey " + data['title']
          })
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  getCourses() {
    this.networkRequest.getWithHeaders('/api/courses/')
      .subscribe(
        data => {
          console.log("exams ", data);
          this.exams = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  createJourneyForm() {
    this.journeyForm = this.fb.group({
      title: ['', Validators.required],
      exam: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })
  }

  getDomainDetails() {
    this.networkRequest.getWithHeaders(`/api/domain/${this.domainId}/`)
    .subscribe(
      data => {
        console.log("domain details ", data);
        this.domainDetails = data;
      },
      error => {
      });
  }

  ngOnInit() {
    this.createJourneyForm();
    this.getCourses();
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    this.route.queryParams.subscribe(
      params => {
        this.domainId = params.id;
        if (this.domainId) {
          this.getDomainDetails();
        }
    });
  }

  onChange($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }

}
