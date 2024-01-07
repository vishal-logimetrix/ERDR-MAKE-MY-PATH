import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private toastr: ToastrService,
    private batchservice: BatchServiceService
  ) { }

  batchId;
  batchDetails;
  myExams;
  deletionBatchId;
  spinner:boolean = true;

  setDeletionId(id) {
    this.deletionBatchId = id;
  }

  clearSelection() {
    this.deletionBatchId = null;
  }


  removeExam(id) {
    // var confirmation = confirm("Are you sure you want to delink this exam?");
    // if (confirmation){
      this.networkRequest.putWithHeaders(null, `/api/mentorexam/${this.deletionBatchId}/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getMyExams();
          this.toastr.success('Exam removed from your account!', 'Created!', {
            timeOut: 4000,
          });
          document.getElementById("dimissModal").click();
        },
        error => {
          console.log("error ", error);
          this.toastr.error('Some error while delinking exam!', 'Error!', {
            timeOut: 4000,
          });
        }
      );
    // }
  }

  removeAllExams() {
    // var confirmation = confirm("Are you sure you want to delink all the exams?");
    // if (confirmation){
      const formData = {
        batch: this.batchId
      }
      this.networkRequest.putWithHeaders(formData, `/api/delinkallmentorexams/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getMyExams();
          this.toastr.success('Exams removed from your account!', 'Success!', {
            timeOut: 4000,
          });
        },
        error => {
          console.log("error ", error);
          this.toastr.error('Some error while delinking exams!', 'Error!', {
            timeOut: 4000,
          });
        }
      );
    // }
  }

  getBatchDetails() {
    this.networkRequest.getWithHeaders(`/api/batch/${this.batchId}/`)
      .subscribe(
        data => {
          console.log("batch details ", data);
          this.batchDetails = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  getMyExams() {
    this.networkRequest.getWithHeaders(`/api/mentorexam/?batch=${this.batchId}`)
    .subscribe(
      data => {
        console.log("learner exams ", data);
        this.myExams = data;
        this.spinner = false;
      },
      error => {
        console.log("error", error);
        this.spinner = false;
      }
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
        }
      }
    );
    this.getMyExams();
  }

}
