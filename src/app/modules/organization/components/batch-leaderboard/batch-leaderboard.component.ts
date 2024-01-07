import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-batch-leaderboard',
  templateUrl: './batch-leaderboard.component.html',
  styleUrls: ['./batch-leaderboard.component.scss']
})
export class BatchLeaderboardComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private toastr: ToastrService,
    private batchservice: BatchServiceService
  ) { }

  batchId;
  leaderBoardData;
  batchDetails;

  getBatchLeaderboard() {
    this.networkRequest.getWithHeaders(`/api/batchleaderboard/?batch=${this.batchId}`)
    .subscribe(
      data => {
        console.log("leaderboard data ", data);
        this.leaderBoardData = data['leaderboard_data'];
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
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      data1 => {
        if (data1['batch']) {
          this.batchservice.updateBatchId(data1['batch']);
          this.batchId = data1['batch'];
          this.getBatchDetails();
          this.getBatchLeaderboard();
        }
      }
    );
  }

}
