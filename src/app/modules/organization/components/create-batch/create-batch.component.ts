import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styleUrls: ['./create-batch.component.scss']
})
export class CreateBatchComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  batchForm: FormGroup;
  exams;

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

  ngOnInit(): void {
    this.createBatchForm();
  }

}
