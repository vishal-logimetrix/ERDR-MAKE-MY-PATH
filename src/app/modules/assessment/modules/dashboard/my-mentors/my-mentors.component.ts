import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-my-mentors',
  templateUrl: './my-mentors.component.html',
  styleUrls: ['./my-mentors.component.scss']
})
export class MyMentorsComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('openModal') openModal: ElementRef;
  
  mentors = [1, 2];

  batchCode;
  batchDetail;
  batches;
  batchId;
  shareBatchCode;
  

  constructor(
    private networkRequest: NetworkRequestService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private permissions: PermissionsService,
  ) { }
  isAuthenticated = this.permissions.isauthenticated();
  submit() {
    if (!this.batchDetail) {
      this.toastr.error('Please select any batch!', 'Error!', {
        timeOut: 4000,
      });
      return;
    }
    const formData = {
      batch: this.batchDetail['id']
    }
    this.networkRequest.postFormData(formData, '/api/joinbatch/').subscribe(
      data => {
        console.log("Batch successfully joined ", data);
        this.toastr.success('Batch successfully joined!', 'Created!', {
          timeOut: 4000,
        });
        this.closeModal.nativeElement.click();
        this.fetchbatches();
        this.batchDetail = null;
      },
      error => {
        console.log("error ", error);
        this.toastr.error(error['error']['errors'][0], 'Error!', {
          timeOut: 4000,
        });
      }
    );
  }

  searchBatch() {
    this.batchDetail = null;
    this.networkRequest.getWithHeaders(`/api/searchmentorbatch/?code=${this.batchCode}`).subscribe(
      data => {
        console.log("mentor's batch ", data);
        //@ts-ignore
        if (data.length == 0) {
          this.toastr.error('Batch not found', 'Error!', {
            timeOut: 4000,
          });
        }
        else {
          this.batchDetail = data[0];
        }
      },
      error => {
        console.log("error ", error);
      }
    )
  }

  fetchbatches() {
    this.networkRequest.getWithHeaders('/api/joinbatch/').subscribe(
      data => {
        this.batches = data;
        console.log("Batchs ", data);
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchbatches();
    this.route.queryParams.subscribe(
      params => {
        this.shareBatchCode = params.batch;
        if (this.shareBatchCode) {
          console.log("sharebatch", this.shareBatchCode);
          this.batchCode = this.shareBatchCode;
          setTimeout(() => {
            // this.openModal.nativeElement.click();
            this.searchBatch();
          }, 1100);
          
        }
    });
  }

}
