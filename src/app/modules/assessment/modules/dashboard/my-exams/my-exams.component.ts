import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-my-exams',
  templateUrl: './my-exams.component.html',
  styleUrls: ['./my-exams.component.scss']
})
export class MyExamsComponent implements OnInit {

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService
  ) { }

  myExams;

  removeExam(id) {
    var confirmation = confirm("Are you sure you want to delete this exam?");
    if (confirmation){
      this.networkRequest.delete(`/api/learnerexam/${id}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getMyExams();
          this.toastr.success('Exam removed from your account!', 'Created!', {
            timeOut: 4000,
          });
        },
        error => {
          console.log("error ", error);
          this.toastr.error('Some error while delinking exam!', 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
  }

  getMyExams() {
    this.networkRequest.getWithHeaders(`/api/learnerexam/`)
    .subscribe(
      data => {
        console.log("learner exams ", data);
        this.myExams = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  ngOnInit(): void {
    this.getMyExams();
  }

}
