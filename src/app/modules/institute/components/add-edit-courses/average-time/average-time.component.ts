import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-average-time',
  templateUrl: './average-time.component.html',
  styleUrls: ['./average-time.component.scss']
})
export class AverageTimeComponent implements OnInit {

  subject : string;
  successMsg;
  errors;
  // title : string;
  courses;
  selectedCourseId;
  marks;
  found: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService
  ) { }

  instituteOrganizationProfileData: any;
  examId;
  marksData;
  examDetails;
  totalStudents;
  countFound: boolean = true;
  countData;
  totalusers;
  realUsers;

  chooseCourse(id) {
    this.selectedCourseId = id;
  }

  submit() {
    const formData = {
      exam: this.examId,
      time: this.marks
    }

    if (this.found) {
      const editData = {
        time: this.marks
      }
      this.networkRequest.putWithHeaders(editData, `/api/examquestionaveragetime/${this.marksData['id']}/`)
      .subscribe(
        data => {
          console.log("updated ", data);
          this.toastr.success('Avg. Time updated successfully!', 'Updated!', {
            timeOut: 4000,
          });
          this.getAverageDetails();
        },
        error => {
          console.log("error ", error);
          this.toastr.error(error['error']['detail'], 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
    else {
      this.networkRequest.postWithHeader(formData, `/api/examquestionaveragetime/`)
      .subscribe(
        data => {
          console.log("created ", data);
          this.toastr.success('Marks created successfully!', 'Created!', {
            timeOut: 4000,
          });
          this.getAverageDetails();
        },
        error => {
          console.log("error ", error);
          this.toastr.error(error['error']['detail'], 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
    
  }

  submitCount() {
    const formData = {
      exam: this.examId,
      total_students: this.totalStudents
    }

    if (this.countFound) {
      const editData = {
        total_students: this.totalStudents
      }
      this.networkRequest.putWithHeaders(editData, `/api/examtotalstudent/${this.countData['id']}/`)
      .subscribe(
        data => {
          console.log("updated ", data);
          this.toastr.success('Count updated successfully!', 'Updated!', {
            timeOut: 4000,
          });
          this.getAverageDetails();
        },
        error => {
          console.log("error ", error);
          this.toastr.error(error['error']['detail'], 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
    else {
      this.networkRequest.postWithHeader(formData, `/api/examtotalstudent/`)
      .subscribe(
        data => {
          console.log("created ", data);
          this.toastr.success('Count created successfully!', 'Created!', {
            timeOut: 4000,
          });
          this.getAverageDetails();
        },
        error => {
          console.log("error ", error);
          this.toastr.error(error['error']['detail'], 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
   
  }

  getAverageDetails() {
    this.networkRequest.getWithHeaders(`/api/courses/${this.examId}/`)
    .subscribe(
      data => {
        console.log("exam details ", data);
        this.examDetails = data;
      },
      error => {
      });
    this.networkRequest.getWithHeaders(`/api/examquestionaveragetime/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("avg details ", data);
        let tmpVal = data;
        //@ts-ignore
        if (tmpVal.length == 0) {
          this.found = false;
          return;
        }
        this.marks = data[0]['time'];
        this.marksData = data[0];
        
      },
      error => {
      });
      this.networkRequest.getWithHeaders(`/api/examtotalstudent/?exam=${this.examId}`)
    .subscribe(
      data => {
        console.log("count details ", data);
        let tmpVal = data;
        this.networkRequest.getWithHeaders(`/api/examuserscount/?exam=${this.examId}`)
        .subscribe(
          data => {
            console.log("total users ", data);
            this.totalusers = data['totalusers'];
            //@ts-ignore
            if (tmpVal.length > 0) {
              this.realUsers = this.totalusers - tmpVal[0]['total_students'];
            }
            else {
              this.realUsers = this.totalusers;
            }
          },
          error => {
            console.log("error ", error);
          }
        );
        
        //@ts-ignore
        if (tmpVal.length == 0) {
          this.countFound = false;
          return;
        }
        this.totalStudents = data[0]['total_students'];
        this.countData = data[0];
        
      },
      error => {
      });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.examId = params.id;
        if (this.examId) {
          this.getAverageDetails();
        }
    });
  }

}
