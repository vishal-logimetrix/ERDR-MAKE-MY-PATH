import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-mentors-exams',
  templateUrl: './mentors-exams.component.html',
  styleUrls: ['./mentors-exams.component.scss']
})
export class MentorsExamsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService
  ) { }

  batchId;
  batchDetails;

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
    console.log("aa");
    this.route.params.subscribe(
      data => {
        if (data['batch']) {
          this.batchId = data['batch'];
          this.getBatchDetails();
        }
      }
    );
  }
}
