import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-blocked-students',
  templateUrl: './blocked-students.component.html',
  styleUrls: ['./blocked-students.component.scss']
})
export class BlockedStudentsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private toastr: ToastrService,
    private batchservice: BatchServiceService
  ) { }

  batchId;
  batchDetails;
  blockedStudents;

  unblock(username) {
    this.networkRequest.getWithHeaders(`/api/unblockusersfrombatch/?batch=${this.batchId}&user=${username}`)
    .subscribe(
      data => {
        console.log("unblocked ", data);
        this.getBatchDetails();
      },
      error => {
        console.log("error ", error);
      }
    );
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
    this.networkRequest.getWithHeaders(`/api/blockedusersinbatch/?batch=${this.batchId}`)
    .subscribe(
      data => {
        console.log("blocked studenst ", data);
        this.blockedStudents = data;
      },
      error => {
        console.log("error ", error);
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
  }

}
