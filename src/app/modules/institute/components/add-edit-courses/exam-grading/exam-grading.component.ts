import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-exam-grading',
  templateUrl: './exam-grading.component.html',
  styleUrls: ['./exam-grading.component.scss']
})
export class ExamGradingComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  categories;
  title;
  quesType;
  marks;
  negMarks;
  editMarks;
  editNegMarks;
  isActive: boolean = true;
  editIsActive: boolean;
  editTitle;
  questionTypes = [ 
    {val: 'mcq', name: 'Single Correct Choice'},
    {val: 'mcc', name: 'Multiple Correct Choice'},
    {val: 'fillup', name: 'Fill In The Blanks'},
    {val: 'subjective', name: 'Subjective type'},
    {val: 'numerical', name: 'Numerical'},
    {val: 'assertion', name: 'Assertion'},
    {val: 'boolean', name: 'True False'},
    {val: 'fillup_option', name: 'Fill With Option'},
  ]

  linkedTypes;
  examId;
  excellent_low;
  excellent_high;
  average_low;
  average_high;
  poor;
  examDetails;
  editLow;
  editHigh;
  selectedType;

  fetchDetails(type) {
    this.editLow = null;
    this.editHigh = null;
    this.selectedType = type;
    if (type == 'excellent') {
      this.editLow = this.excellent_low;
      this.editHigh = this.excellent_high;
    }
    else if (type == 'average') {
      this.editLow = this.average_low;
      this.editHigh = this.average_high;
    }
    else if (type == 'poor') {
      this.editHigh = this.poor;
    }
  }

  edit() {
    if (this.selectedType == 'excellent') {
      this.excellent_low = this.editLow;
      this.excellent_high = this.editHigh;
    }
    else if (this.selectedType == 'average') {
      this.average_low = this.editLow;
      this.average_high = this.editHigh;
    }
    else if (this.selectedType == 'poor') {
      this.poor = this.editHigh;
    }
    let formData: FormData = new FormData();
    formData.append("title", this.examDetails['title']);
    formData.append("is_active", this.examDetails['is_active']);
    formData.append("level", this.examDetails['level']);
    formData.append("description", this.examDetails['description']);
    formData.append("short_description", this.examDetails['short_description']);
    formData.append("user_guidelines", this.examDetails['user_guidelines']);
    formData.append("excellent_low", this.excellent_low || 0);
    formData.append("excellent_high", this.excellent_high || 0);
    formData.append("average_low", this.average_low || 0);
    formData.append("average_high", this.average_high || 0);
    formData.append("poor", this.poor || 0);
    
    this.networkRequest.putFiles(formData, `/api/courses/${this.examId}/`).subscribe(
      data => {
        console.log("exam successfully updated ", data);
        this.toastr.success('Updated successfully!', 'Updated!', {
          timeOut: 4000,
        });
        this.editLow = null;
        this.editHigh = null;
        this.closeModalEdit.nativeElement.click();
        this.getExamDetails();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  getExamDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
    .subscribe(
      data => {
        console.log("exam details ", data);
        this.examDetails = data;
        this.excellent_low = this.examDetails['excellent_low'];
        this.excellent_high = this.examDetails['excellent_high'];
        this.average_low = this.examDetails['average_low'];
        this.average_high = this.examDetails['average_high'];
        this.poor = this.examDetails['poor'];
      },
      error => {
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getExamDetails();
        }
    });
  }


}
