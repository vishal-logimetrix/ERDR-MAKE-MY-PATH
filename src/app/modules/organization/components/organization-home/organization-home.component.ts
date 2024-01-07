import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-organization-home',
  templateUrl: './organization-home.component.html',
  styleUrls: ['./organization-home.component.scss']
})
export class OrganizationHomeComponent implements OnInit {

  @ViewChild('closeModal') closeModal: ElementRef;

  constructor(
    private networkRequest: NetworkRequestService,
    private misc: MiscellaneousService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private alertService: AlertService
  ) { }

  batches;
  userProfile;
  batchForm: FormGroup;
  exams;
  deletionBatchId;
  spinner: boolean = true;

  setDeletionId(id) {
    this.deletionBatchId = id;
  }

  clearSelection() {
    this.deletionBatchId = null;
  }

  removeBatch(id) {
    // var confirmation = confirm("Are you sure you want to deactivate this batch?");
    // this.alertService.showAlert({ text: 'Are you sure you want to deactivate this batch?' }, 'info', 'confirm')
    // .subscribe(data => {
      // if (data) {
        this.networkRequest.putWithHeaders(null, `/api/deactivatebatch/${this.deletionBatchId}/`)
        .subscribe(
          data => {
            console.log("deactivated ", data);
            this.getBatches();
            this.toastr.success('Batch removed!', 'Success!', {
              timeOut: 4000,
            });
            document.getElementById("dimissModal").click();
          },
          error => {
            console.log("error ", error);
            this.toastr.error('Some error while deactivating the batch!', 'Error!', {
              timeOut: 4000,
            });
          }
        );
      // }
    // });
  }

  removeAllBatches() {
    var confirmation = confirm("Are you sure you want to deactivate all the batches?");
    if (confirmation){
      this.networkRequest.putWithHeaders(null, `/api/deactivatementorallbatches/`)
      .subscribe(
        data => {
          console.log("deleted ", data);
          this.getBatches();
          this.toastr.success('Batches removed from your account!', 'Success!', {
            timeOut: 4000,
          });
        },
        error => {
          console.log("error ", error);
          this.toastr.error('Some error while deactivating batches!', 'Error!', {
            timeOut: 4000,
          });
        }
      );
    }
  }

  getBatches() {
    this.networkRequest.getWithHeaders('/api/batch/')
      .subscribe(
        data => {
          console.log("batches ", data);
          this.batches = data;
          this.spinner = false;
        },
        error => {
          console.log("error ", error);
          this.spinner = false;
        }
      );
  }

  getUserProfile() {
    this.misc.userProfile().subscribe(
      data => {
        this.userProfile = data;
      }
    );
  }

  submit() {
    var string = this.batchForm.value.name.trim()
    if (string == null || string == '') {
      this.toastr.error('Batch name cannot be blank!', 'Error!', {
        timeOut: 4000,
      });
      return;
    }
    const formData = {
      name: this.batchForm.value.name
    }
    this.networkRequest.postFormData(formData, '/api/batch/').subscribe(
      data => {
        console.log("Batch successfully created ", data);
        this.toastr.success('Batch created successfully!', 'Created!', {
          timeOut: 4000,
        });
        this.router.navigate(["/organization"]);
        this.closeModal.nativeElement.click();
        this.getBatches();
        this.batchForm.reset();
      },
      error => {
        console.log("error ", error);
      }
    );
  }

  createBatchForm() {
    this.batchForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  closeModalPopup() {

    this.closeModal.nativeElement.click();
  }

  ngOnInit() {
    this.getBatches();
    this.getUserProfile();
    this.createBatchForm();
  }

}
