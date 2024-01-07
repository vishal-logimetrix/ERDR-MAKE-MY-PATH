import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { BatchServiceService } from '../../services/batch-service.service';

@Component({
  selector: 'app-choose-p',
  templateUrl: './choose-p.component.html',
  styleUrls: ['./choose-p.component.scss']
})
export class ChoosePComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private batchservice: BatchServiceService
  ) { }

  examId;
  examDetails;
  totalusers;
  batchId;
  categoryDetails;
  batchDetails;
  domains;
  currentNode;

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
   
      this.networkRequest.getWithHeaders(`/api/examuserscount/?exam=${this.examId}`)
      .subscribe(
        data => {
          console.log("total users ", data);
          this.totalusers = data['totalusers'];
        },
        error => {
          console.log("error ", error);
        }
      );

      this.networkRequest.getWithHeaders(`/api/domainforexams/?exam_id=${this.examId}`)
        .subscribe(
          data => {
            console.log("filtered domains ", data);
            // Populate Selected Assessment list with server data
            this.domains = data;
            this.getLastExamNode(this.domains[0]['id']);
          },
          error => {
            console.log("error ", error);
          }
        );
  }

  getLastExamNode(id) {
    this.networkRequest.getWithHeaders(`/api/lastexamdomainnode/?domain_id=${id}&exam_id=${this.examId}`)
    .subscribe(
      data => {
        console.log("last node ", data);
        this.currentNode = data[0];
        this.currentNode['successive_nodes'].sort((a, b) => a.text.localeCompare(b.text));
      },
      error => {
      });
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
        if (data1['exam']) {
          this.batchservice.updateExamId(data1['exam']);
          this.examId = data1['exam'];
          this.getExamDetails();
        }
      }
    );
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
