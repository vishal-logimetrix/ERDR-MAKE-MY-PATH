import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NetworkRequestService } from 'src/app/services/network-request.service';

@Component({
  selector: 'app-approve-schools',
  templateUrl: './approve-schools.component.html',
  styleUrls: ['./approve-schools.component.scss']
})
export class ApproveSchoolsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private networkRequest: NetworkRequestService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  examId;
  institutes;

  approveSchool(id) {
    var confirmation = confirm("Are you sure you want to approve this school?");
    if (confirmation){
      const formData = {
        institute: id
      }
      this.networkRequest.putWithHeaders(formData,`/api/approveinstitute/`)
      .subscribe(
        data => {
          console.log("approved ", data);
          this.getSchools();
        },
        error => {
          console.log("error ", error);
        }
      );
    }
  }

  getSchools() {
    this.networkRequest.getWithHeaders(`/api/unverifiedinstitutes/`)
      .subscribe(
        data => {
          console.log("schools ", data);
          this.institutes = data;
        },
        error => {
          console.log("error ", error);
        }
      );
  }

  ngOnInit(): void {
    this.getSchools();
  }

}
